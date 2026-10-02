#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Message Contract CLI
// ───────────────────────────────────────────────────────────────────
//
// Usage:
//   validate-message.mjs --commit <file> [--stage pre-stamp]
//   validate-message.mjs --rev-list "<rev-list args>" [--exclude-ref <ref>]...
//   validate-message.mjs --pr-body <file|->
//   validate-message.mjs --branch <name> [--worktree-dir <dir>]
//   validate-message.mjs --explain
//   validate-message.mjs --check-template <file> --kind commit|pr|branch
//   Add --repo <dir> to validate against another checkout, --json for machine output.
//
// Exit codes:
//   0 - passes, or the repository declares no rules for this kind
//   1 - violates the repository's contract
//   2 - the contract or the invocation is broken; gates treat this as a block

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import v8 from 'node:v8';
import { execFileSync } from 'node:child_process';

import {
  ContractError,
  TEMPLATE_FILES,
  loadContract,
  rangeContext,
  resolveContractDir,
  templateDriftErrors,
  validateBranch,
  validateCommit,
  validatePrBody,
  worktreeContext,
} from './lib/message-contract.mjs';

// Contract patterns come from a file a person edits, and a pattern such as ^(a+)+$ backtracks
// without bound. After excessive backtracking V8 can hand a match to its linear-time engine, so a
// bad pattern costs milliseconds instead of hanging every commit. It is set here, in the process
// the hooks start, and not in the library, which host processes import.
v8.setFlagsFromString('--enable-experimental-regexp-engine-on-excessive-backtracks');

// ─────────────────────────────────────────────────────────────────────────────
// 2. ARGUMENTS
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const opts = { excludeRefs: [] };
  const takesValue = new Set(['--commit', '--stage', '--rev-list', '--exclude-ref', '--pr-body', '--branch', '--worktree-dir', '--check-template', '--kind', '--repo']);
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--json') opts.json = true;
    else if (arg === '--explain') opts.explain = true;
    else if (takesValue.has(arg)) {
      const value = argv[i + 1];
      if (value === undefined) throw new UsageError(`${arg} needs a value`);
      i += 1;
      if (arg === '--exclude-ref') opts.excludeRefs.push(value);
      else opts[arg.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = value;
    } else throw new UsageError(`unknown argument: ${arg}`);
  }
  return opts;
}

class UsageError extends Error {}

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function repoRootOf(dir) {
  try {
    return execFileSync('git', ['-C', dir, 'rev-parse', '--show-toplevel'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

function git(repoRoot, args) {
  return execFileSync('git', ['-C', repoRoot, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 256 * 1024 * 1024 });
}

function readInput(file) {
  return file === '-' ? fs.readFileSync(0, 'utf8') : fs.readFileSync(file, 'utf8');
}

function report(label, results, loaded, opts) {
  const blocked = results.filter((r) => r.errors.length > 0);
  if (opts.json) {
    process.stdout.write(`${JSON.stringify({ kind: label, contract: loaded.file, source: loaded.source, results }, null, 2)}\n`);
    return blocked.length ? 1 : 0;
  }
  for (const r of results) {
    if (r.errors.length) {
      process.stderr.write(`\nBLOCKED: ${r.subject} failed the ${label} contract:\n`);
      for (const e of r.errors) process.stderr.write(`  - [${e.id}] ${e.message}\n`);
    }
    if (r.warnings.length) {
      process.stderr.write(`\n${r.errors.length ? 'Additional clarity warnings' : `WARNING: ${r.subject} clarity checks found`}:\n`);
      for (const w of r.warnings) process.stderr.write(`  - [${w.id}] ${w.message}\n`);
    }
  }
  if (blocked.length) {
    const help = loaded.contract.help;
    if (help?.expected) process.stderr.write(`\nExpected: ${help.expected}\n`);
    if (help?.example) process.stderr.write(`Example: ${help.example}\n`);
    process.stderr.write(`Rules: ${loaded.file} (resolved from ${loaded.source})\n\n`);
    return 1;
  }
  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MODES
// ─────────────────────────────────────────────────────────────────────────────

function explain(repoRoot) {
  const resolved = resolveContractDir(repoRoot);
  if (!resolved) {
    process.stdout.write('No contract directory: this repository enforces no message, PR or branch rules.\n');
    return 0;
  }
  process.stdout.write(`Contract directory: ${resolved.dir} (${resolved.source})\n`);
  for (const kind of Object.keys(TEMPLATE_FILES)) {
    const loaded = loadContract(repoRoot, kind);
    process.stdout.write(`  ${kind.padEnd(7)} ${loaded ? `enforced from ${loaded.file}` : 'not enforced (no "Enforced rules" block)'}\n`);
  }
  return 0;
}

function commitMode(repoRoot, opts) {
  const loaded = loadContract(repoRoot, 'commit');
  if (!loaded) return 0;
  let commentChar = '#';
  try {
    const configured = git(repoRoot, ['config', '--get', 'core.commentChar']).trim();
    if (configured && configured !== 'auto') commentChar = configured;
  } catch { /* unset: git's default applies */ }
  let cleanup = '';
  try {
    cleanup = git(repoRoot, ['config', '--get', 'commit.cleanup']).trim();
  } catch { /* unset: git's default applies */ }
  const result = validateCommit(readInput(opts.commit), loaded.contract, { ...worktreeContext(repoRoot), stage: opts.stage, commentChar, cleanup });
  return report('commit message', [{ subject: 'commit message', ...result }], loaded, opts);
}

function revListMode(repoRoot, opts) {
  const loaded = loadContract(repoRoot, 'commit');
  if (!loaded) return 0;
  const args = opts.revList.split(/\s+/).filter(Boolean);
  const shas = git(repoRoot, ['rev-list', '--reverse', ...args]).split('\n').filter(Boolean);
  const contextFor = rangeContext(repoRoot, shas, opts.excludeRefs);
  // One git call for every message: a process per commit made a 500-commit push take seconds.
  const messages = new Map();
  if (shas.length) {
    const raw = git(repoRoot, ['log', '--format=%H%x00%B%x1e', ...args]);
    for (const record of raw.split('\x1e')) {
      const at = record.indexOf('\x00');
      if (at !== -1) messages.set(record.slice(0, at).trim(), record.slice(at + 1).replace(/^\n/, ''));
    }
  }
  const results = shas.map((sha) => {
    const message = messages.get(sha) ?? git(repoRoot, ['log', '-1', '--format=%B', sha]);
    const subjectLine = message.split('\n')[0];
    return { subject: `commit ${sha.slice(0, 10)} "${subjectLine}"`, sha, ...validateCommit(message, loaded.contract, { ...contextFor(sha), alreadyClean: true }) };
  });
  return report('commit message', results, loaded, opts);
}

function prMode(repoRoot, opts) {
  const loaded = loadContract(repoRoot, 'pr');
  if (!loaded) return 0;
  const result = validatePrBody(readInput(opts.prBody), loaded.contract);
  return report('PR description', [{ subject: 'PR description', ...result }], loaded, opts);
}

function branchMode(repoRoot, opts) {
  const loaded = loadContract(repoRoot, 'branch');
  if (!loaded) return 0;
  const result = validateBranch(opts.branch, loaded.contract, opts.worktreeDir);
  return report('branch naming', [{ subject: `branch '${opts.branch}'`, ...result }], loaded, opts);
}

function checkTemplateMode(opts) {
  if (!TEMPLATE_FILES[opts.kind]) throw new UsageError('--check-template needs --kind commit|pr|branch');
  const problems = templateDriftErrors(fs.readFileSync(opts.checkTemplate, 'utf8'), opts.kind, opts.checkTemplate);
  for (const p of problems) process.stderr.write(`DRIFT: ${p}\n`);
  return problems.length ? 1 : 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.checkTemplate) return checkTemplateMode(opts);

  const repoRoot = repoRootOf(opts.repo || process.cwd());
  // Outside a repository there is no contract to hold anything to.
  if (!repoRoot) return 0;

  if (opts.explain) return explain(repoRoot);
  if (opts.commit) return commitMode(repoRoot, opts);
  if (opts.revList) return revListMode(repoRoot, opts);
  if (opts.prBody) return prMode(repoRoot, opts);
  if (opts.branch) return branchMode(repoRoot, opts);
  throw new UsageError('nothing to validate: pass --commit, --rev-list, --pr-body, --branch, --explain or --check-template');
}

try {
  process.exitCode = main();
} catch (err) {
  const label = err instanceof ContractError ? 'BLOCKED: the repository contract cannot be read' : err instanceof UsageError ? 'validate-message: usage error' : 'BLOCKED: the message validator failed';
  process.stderr.write(`${label}: ${err.message}\n`);
  process.exitCode = 2;
}
