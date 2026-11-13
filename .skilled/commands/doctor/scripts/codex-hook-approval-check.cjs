#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Codex Hook Approval Check
// ───────────────────────────────────────────────────────────────────
'use strict';

// Codex runs a project hook only after the operator approves that exact entry.
// The approval lives in config.toml under a hooks.state key as a trusted_hash,
// and an unapproved entry is skipped without a warning. A wired advisor hook can
// therefore be present in .codex/hooks.json and still never deliver a brief,
// which no diff can tell apart from a hook that was never wired.
//
// This check is read-only on purpose. The approval belongs to the /hooks review
// in a Codex session, so the repair line names that step instead of offering to
// copy a hash. The hash value stays out of every output because echoing a
// credential serves no diagnostic purpose.
//
// Exit codes:
//   0  the project has no hooks file, or the advisor entry is approved
//   1  the advisor entry is absent, or present and unapproved
//   2  bad argument
//
// Usage: codex-hook-approval-check.cjs [--root <dir>] [--config <path>] [--json]
//   --root    project root whose .codex/hooks.json is read, defaults to the cwd
//   --config  Codex config file, defaults to $CODEX_HOME/config.toml
//   --json    print one JSON object instead of the text lines

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const ADVISOR_MARKER = 'hooks/codex/user-prompt-submit.js';
const EVENT_KEY = 'user_prompt_submit';
const USAGE = 'Usage: codex-hook-approval-check.cjs [--root <dir>] [--config <path>] [--json]\n';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// A misspelled or value-less flag must fail loudly rather than read another root.
function parseArgs(argv) {
  const options = { root: process.cwd(), config: null, json: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--json') {
      options.json = true;
      continue;
    }
    if (arg === '--root' || arg === '--config') {
      const value = argv[index + 1];
      if (value === undefined || value === '') return null;
      options[arg.slice(2)] = value;
      index += 1;
      continue;
    }
    return null;
  }
  return options;
}

function defaultConfigFile() {
  const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), '.codex');
  return path.join(codexHome, 'config.toml');
}

function trimSeparators(value) {
  const trimmed = value.replace(/[\\/]+$/, '');
  return trimmed === '' ? value : trimmed;
}

// Codex keys an approval by the hooks file, the event, the group and the hook
// index, so any edit that moves the advisor entry needs a fresh approval. The
// caller may pass a relative or symlinked root while Codex recorded the real
// path, so both forms are tried.
function hookStateKeys(root, group, index) {
  const roots = [trimSeparators(root)];
  try {
    roots.push(trimSeparators(fs.realpathSync(root)));
  } catch {
    // A root that cannot be resolved has only the form the caller gave.
  }
  const keys = [];
  for (const base of roots) {
    const key = `${base}/.codex/hooks.json:${EVENT_KEY}:${group}:${index}`;
    if (!keys.includes(key)) keys.push(key);
  }
  return keys;
}

// An unparseable hooks file cannot hold a findable entry, so it takes the same
// verdict as a file that lacks the entry. Either way the hook cannot run.
function findAdvisorEntry(hooksFile) {
  if (!fs.existsSync(hooksFile)) return { kind: 'skip' };
  let document;
  try {
    document = JSON.parse(fs.readFileSync(hooksFile, 'utf8'));
  } catch {
    return { kind: 'absent' };
  }
  const groups = document?.hooks?.UserPromptSubmit;
  if (!Array.isArray(groups)) return { kind: 'absent' };
  for (const [groupIndex, group] of groups.entries()) {
    const hooks = Array.isArray(group?.hooks) ? group.hooks : [];
    for (const [hookIndex, hook] of hooks.entries()) {
      if (typeof hook?.command === 'string' && hook.command.includes(ADVISOR_MARKER)) {
        return { kind: 'present', group: groupIndex, index: hookIndex };
      }
    }
  }
  return { kind: 'absent' };
}

// The approval block ends at the next TOML header, so a trusted_hash recorded
// under a different hooks.state key must not count for this entry.
function approvalFound(configFile, keys) {
  let text;
  try {
    text = fs.readFileSync(configFile, 'utf8');
  } catch {
    return false;
  }
  const lines = text.split(/\r?\n/);
  const headers = new Set(keys.map((key) => `[hooks.state."${key}"]`));
  for (let index = 0; index < lines.length; index += 1) {
    if (!headers.has(lines[index].trim())) continue;
    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      const line = lines[cursor].trim();
      if (line.startsWith('[')) break;
      if (/^trusted_hash\s*=/.test(line)) return true;
    }
  }
  return false;
}

function report(options, verdict, lines) {
  if (options.json) {
    process.stdout.write(`${JSON.stringify(verdict, null, 2)}\n`);
    return;
  }
  for (const line of lines) process.stdout.write(`${line}\n`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

function main(argv) {
  const options = parseArgs(argv);
  if (options === null) {
    process.stderr.write(USAGE);
    return 2;
  }

  const root = options.root;
  const hooksFile = path.join(root, '.codex', 'hooks.json');
  const entry = findAdvisorEntry(hooksFile);

  if (entry.kind === 'skip') {
    report(options, { status: 'skip', code: 'no-codex-hooks', root }, ['SKIP no-codex-hooks']);
    return 0;
  }

  if (entry.kind === 'absent') {
    report(options, {
      status: 'warn',
      code: 'codex-advisor-hook-absent',
      root,
      hooksFile,
    }, ['WARN codex-advisor-hook-absent']);
    return 1;
  }

  const configFile = options.config || defaultConfigFile();
  const keys = hookStateKeys(root, entry.group, entry.index);
  if (approvalFound(configFile, keys)) {
    report(options, {
      status: 'pass',
      code: 'codex-hooks-approved',
      root,
      group: entry.group,
      index: entry.index,
      config: configFile,
    }, ['PASS codex-hooks-approved']);
    return 0;
  }

  const repair = `repair: open /hooks in a Codex session at ${root} and approve each entry`;
  report(options, {
    status: 'warn',
    code: 'codex-hooks-unapproved',
    root,
    group: entry.group,
    index: entry.index,
    config: configFile,
    repair,
  }, [`WARN codex-hooks-unapproved ${root}`, repair]);
  return 1;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

if (require.main === module) process.exitCode = main(process.argv.slice(2));

module.exports = { main, findAdvisorEntry, approvalFound };
