#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code Quality Config Doctor
// ───────────────────────────────────────────────────────────────────
'use strict';

// Shows, checks and creates the repository quality config the sk-code quality gate
// reads, without running anything that config names.
//
// WHY THIS EXISTS: a repository names its own checks in the quality config the skill folder
// carries, and the gate runs those commands on every change. Writing that file by hand risks
// a typo that fails every run, and copying a template over a reviewed file loses the review.
// This script reads the config through the same module the gate uses, reports which
// named tools are on PATH, and creates the file once from the shipped template, with
// the checks the repository's manifests imply entered as not required.
//
// No mode runs a configured command: status looks tools up on PATH and stops there,
// so a config can be inspected before anyone trusts it. To show which checklists and
// override rows the gate would apply, status asks the runner itself through --explain,
// which starts no check and writes no file, so the doctor never keeps a second copy of
// checklist discovery. The only write is init with --apply, which creates the file
// through a hard link so it never replaces one that already exists, not even one
// created a moment earlier by a second run.
//
// WHERE THE WORK LIVES: this file keeps the arguments, the run context, the one call
// that starts the runner, the mode table and the exit status. The modes themselves sit in
// lib/ beside it, one file per concern, and every one of them reads the skill folder
// through lib/quality-skill-paths.cjs. The runner call stays here so a reviewer can prove
// from one file that no configured check ever starts.
//
// Usage:
//   sk-code-quality-config.cjs status [--repo <dir>] [--config <path>] [--json]
//   sk-code-quality-config.cjs check  [--repo <dir>] [--config <path>] [--json]
//   sk-code-quality-config.cjs init   [--repo <dir>] [--apply] [--json]
//   sk-code-quality-config.cjs -h | --help
//
// Exit 0 when the request succeeded, 1 when the config is invalid or missing, a checklist
// the gate would load is broken or init refused to write, 2 on a usage error or outside
// a git repository, always with a STATUS= line last.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

const {
  CHECK_IDS,
  DEFAULTS_PATH,
  RUNNER,
  qualityConfig,
  runGit,
  spawnArgv,
} = require('./lib/quality-skill-paths.cjs');
const { RequestError } = require('./lib/quality-script-io.cjs');
const { check, status } = require('./lib/quality-report-view.cjs');
const { init } = require('./lib/quality-config-init.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// A runner start that hangs would hang the status, so the explanation is bounded.
const EXPLAIN_TIMEOUT_MS = 60000;
const EXPLAIN_SCHEMA = 'code-quality-explain/v1';
const MODES = Object.freeze(['status', 'check', 'init']);
const HELP_FLAGS = new Set(['-h', '--help']);

const USAGE_TEXT = [
  'Usage: sk-code-quality-config.cjs status|check|init [options]',
  '',
  'Modes:',
  '  status            report the config source, its trust, its errors, each named tool, the hygiene layers and the disabled hygiene rules,',
  '                    then what the gate would apply here: each checklist with its seat, its override rows or the reason',
  '                    they were refused, and the hygiene rules that apply. The runner resolves that through --explain over',
  '                    one file per folder group and extension, and runs no check',
  '  check             validate the config against the schema and report its errors and trust state, probing no tool',
  '  init              show the config init would create, and write it only with --apply. Without a specs/ folder it',
  '                    also suggests the spec-kit hygiene rules for commentHygiene.disableRules, and never writes them',
  '',
  'Options:',
  '  --repo DIR        the repository to read, default the working directory',
  '  --config PATH     read this config instead of discovering one, for status and check',
  `  --apply           let init create ${qualityConfig.REPO_CONFIG_FILE}, which it never overwrites`,
  '  --json            print one JSON document before the STATUS line',
  '  -h, --help        print this help and exit 0',
  '',
  'Config discovery, the first source found wins:',
  '  1. --config PATH',
  '  2. git config skcode.qualityConfig from a config file, relative to the repository root',
  '     (a git -c or GIT_CONFIG_* value is ignored)',
  `  3. ${qualityConfig.CONFIG_CANDIDATES.join(' or ')} under the repository root`,
  '  4. none, so the gate runs its built-in checks alone',
  '',
  'Exit codes:',
  '  0  the request succeeded, including a status that reports a DEGRADED tool',
  '  1  the config is missing or invalid, a checklist the gate would load is broken, or init refused to write (CONFIG_EXISTS)',
  '  2  a usage error, or the directory is not inside a git repository',
].join('\n');

// ─────────────────────────────────────────────────────────────────────────────
// 3. ARGUMENTS AND RUN CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const opts = { positional: [], apply: false, json: false, repo: null, config: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const value = () => {
      const next = argv[index + 1];
      if (next === undefined || next.startsWith('--')) throw new RequestError(`${arg} needs a value`);
      index += 1;
      return next;
    };
    if (arg === '--apply') opts.apply = true;
    else if (arg === '--json') opts.json = true;
    else if (arg === '--repo') opts.repo = value();
    else if (arg === '--config') opts.config = value();
    else if (arg.startsWith('-')) throw new RequestError(`unknown flag: ${arg}`);
    else opts.positional.push(arg);
  }
  const [mode, ...rest] = opts.positional;
  if (!MODES.includes(mode)) throw new RequestError(`the mode must be one of ${MODES.join(', ')}, not ${mode || 'nothing'}`);
  if (rest.length > 0) throw new RequestError(`unexpected argument: ${rest[0]}`);
  if (opts.apply && mode !== 'init') throw new RequestError('--apply belongs to init only');
  if (opts.config && mode === 'init') throw new RequestError('init always writes the repository config file, so it takes no --config');
  return { ...opts, mode };
}

function repoRoot(dir, env) {
  const top = runGit(['rev-parse', '--show-toplevel'], { cwd: dir, env });
  if (!top.ok) throw new RequestError(`not inside a git repository: ${dir}`, { code: 'NO_GIT_REPOSITORY' });
  return top.stdout.trim();
}

function readDefaults() {
  return JSON.parse(fs.readFileSync(DEFAULTS_PATH, 'utf8'));
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. RUNNER BRIDGE
// ─────────────────────────────────────────────────────────────────────────────

// One explain call over one batch, read back as JSON. A run that stops prints the run
// schema with its error row, so that row's message is what the status reports.
function explainBatch(ctx, opts, files) {
  const argv = [process.execPath, RUNNER];
  if (opts.config) argv.push('--config', path.resolve(ctx.cwd, opts.config));
  argv.push('--explain', ...files.map((rel) => (rel.startsWith('-') ? `./${rel}` : rel)));
  const run = spawnArgv(argv, { cwd: ctx.root, env: ctx.env, timeoutMs: EXPLAIN_TIMEOUT_MS });
  let doc = null;
  try {
    doc = JSON.parse(run.stdout);
  } catch {
    doc = null;
  }
  if (doc && doc.schema === EXPLAIN_SCHEMA) return { doc, error: null };
  const stopped = doc && Array.isArray(doc.errors) && doc.errors[0] ? `${doc.errors[0].code}: ${doc.errors[0].message}` : null;
  return { doc: null, error: `quality-gate.cjs --explain did not resolve (${stopped || run.error || `exit ${run.exit}`})` };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. MODES
// ─────────────────────────────────────────────────────────────────────────────

// status is the one mode that asks the runner, and the bridge is handed to it rather
// than reached for, so this file stays the only one that starts a process.
function runMode(ctx, opts) {
  if (opts.mode === 'status') return status(ctx, opts, (files) => explainBatch(ctx, opts, files));
  return { check, init }[opts.mode](ctx, opts);
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. MAIN
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run one mode and return its exit code. Output goes to stdout, a refusal message
 * also to stderr.
 *
 * @param {string[]} argv - The arguments after the program name.
 * @param {Object} [options] - cwd and env, so a test can point it at a fixture.
 * @returns {number} The exit code.
 */
function main(argv, { cwd = process.cwd(), env = process.env } = {}) {
  if (argv.some((arg) => HELP_FLAGS.has(arg))) {
    process.stdout.write(`${USAGE_TEXT}\n`);
    return 0;
  }
  let opts = { json: false };
  try {
    opts = parseArgs(argv);
    const dir = path.resolve(cwd, opts.repo || '.');
    const ctx = { cwd: path.resolve(cwd), env, root: repoRoot(dir, env), defaults: readDefaults(), builtinIds: [...CHECK_IDS] };
    return runMode(ctx, opts);
  } catch (error) {
    const known = error instanceof RequestError;
    const message = known ? error.message : `unexpected: ${error.message}`;
    process.stderr.write(`sk-code-quality-config: ${message}\n`);
    const mode = known && error.mode ? ` MODE=${error.mode}` : '';
    process.stdout.write(`STATUS=FAIL${mode} ERROR=${known ? error.code : 'INTERNAL_ERROR'} MESSAGE="${message.replace(/"/g, "'")}"\n`);
    return known ? error.exit : 2;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { RUNNER, USAGE_TEXT, main };

if (require.main === module) process.exitCode = main(process.argv.slice(2));
