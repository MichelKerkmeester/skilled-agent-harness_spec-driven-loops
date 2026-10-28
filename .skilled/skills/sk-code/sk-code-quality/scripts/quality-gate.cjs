#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Gate Runner
// ───────────────────────────────────────────────────────────────────
'use strict';

// One verdict for one change, in any repository. The runner reads the change, runs its
// built-in sensors, one comment-hygiene call and a parse floor, probes which hooks and
// workflows enforce hygiene, resolves the checklists the hub and the repository declare
// and prints the result. It writes no file. The only commands a repository can make it
// start are the ones its committed config names, each run as an argv array under a
// deadline and inside the workspace guard. A command a manifest implies is reported as
// a suggestion and never started. No gate value means pass: exit 0 says only that no
// blocker was found and every required check produced evidence, and the acting agent
// still owns every judgment item.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { CHECK_IDS, DEFAULT_TIMEOUT_SEC, GATE_EXIT, TRUST_REPAIR, usage } = require('./lib/gate-core.cjs');
const { FORMATS, USAGE_TEXT, parseCheckIds, wantsHelp } = require('./lib/gate-arguments.cjs');
const { buildContext, checkTrust } = require('./lib/gate-context.cjs');
const { probeLayers } = require('./lib/gate-layers.cjs');
const { nodeCheckRecords, nodeCheckResult, runDistAdapter } = require('./lib/gate-spawned-checks.cjs');
const { explain } = require('./lib/gate-explain.cjs');
const { runGate } = require('./lib/gate-runner.cjs');
const { render } = require('./lib/gate-render.cjs');
const { decideGate, errorVerdict } = require('./lib/gate-verdict.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. ARGUMENT PARSING
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const options = {
    scope: null, base: null, files: [], lines: 'changed', noRun: false, only: null,
    skip: null, timeoutSec: DEFAULT_TIMEOUT_SEC, format: 'json', explain: [], configPath: null,
  };
  const setScope = (scope) => {
    if (options.scope && options.scope !== scope) throw usage('choose one of --worktree, --base, --files and --explain');
    options.scope = scope;
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const value = () => {
      const next = argv[index + 1];
      if (next === undefined || next.startsWith('--')) throw usage(`${arg} needs a value`);
      index += 1;
      return next;
    };
    if (arg === '--worktree') {
      setScope('worktree');
    } else if (arg === '--base') {
      setScope('base');
      options.base = value();
    } else if (arg === '--files') {
      setScope('files');
      while (index + 1 < argv.length && !argv[index + 1].startsWith('--')) options.files.push(argv[(index += 1)]);
    } else if (arg === '--') {
      setScope('files');
      options.files.push(...argv.slice(index + 1));
      index = argv.length;
    } else if (arg === '--lines') {
      options.lines = value();
      if (!['changed', 'file'].includes(options.lines)) throw usage('--lines takes changed or file');
    } else if (arg === '--no-run') {
      options.noRun = true;
    } else if (arg === '--only') {
      options.only = parseCheckIds(arg, value());
    } else if (arg === '--skip') {
      options.skip = parseCheckIds(arg, value());
    } else if (arg === '--config') {
      options.configPath = value();
    } else if (arg === '--timeout') {
      options.timeoutSec = Number(value());
      if (!Number.isFinite(options.timeoutSec) || options.timeoutSec <= 0) throw usage('--timeout takes a number of seconds above zero');
    } else if (arg === '--format') {
      options.format = value();
      if (!FORMATS.includes(options.format)) throw usage(`--format takes one of ${FORMATS.join(', ')}`);
    } else if (arg === '--explain') {
      // The first path is required, as before, and the rest follow the --files form, so a
      // caller can name every file at once or repeat the flag per file.
      setScope('explain');
      options.explain.push(value());
      while (index + 1 < argv.length && !argv[index + 1].startsWith('--')) options.explain.push(argv[(index += 1)]);
    } else {
      throw usage(`unknown argument ${arg}`);
    }
  }
  options.scope = options.scope || 'worktree';
  if (options.scope === 'files' && options.files.length === 0) throw usage('--files needs at least one file');
  if (options.scope === 'explain' && options.format !== 'json') throw usage('--explain prints JSON, so it takes no other --format');
  return options;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

function main(argv, { cwd = process.cwd(), env = process.env } = {}) {
  // Help reads nothing and starts nothing, because it is the call an operator makes
  // before trusting the tool.
  if (wantsHelp(argv)) return { output: USAGE_TEXT, exitCode: 0, message: null };
  let options = null;
  try {
    options = parseArgs(argv);
    const context = buildContext(options, cwd, env);
    if (options.scope === 'explain') return { output: JSON.stringify(explain(context), null, 2), exitCode: GATE_EXIT.NOTHING_CHECKED, message: null };
    const verdict = runGate(context);
    return { output: render(verdict, options.format), exitCode: verdict.exit_code, message: null };
  } catch (error) {
    const verdict = errorVerdict(error, options);
    const format = options && options.scope !== 'explain' ? options.format : 'json';
    return { output: render(verdict, format), exitCode: GATE_EXIT.ERROR, message: `${verdict.errors[0].code}: ${error.message}` };
  }
}

// Module identity, never a path comparison, decides whether this file runs as the CLI,
// so a hub reached through a link still runs.
if (require.main === module) {
  const { output, exitCode, message } = main(process.argv.slice(2));
  process.stdout.write(`${output}\n`);
  if (message) process.stderr.write(`quality-gate: ${message}\n`);
  process.exitCode = exitCode;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  CHECK_IDS, TRUST_REPAIR, USAGE_TEXT, checkTrust, decideGate, nodeCheckRecords, nodeCheckResult, probeLayers, runDistAdapter,
};
