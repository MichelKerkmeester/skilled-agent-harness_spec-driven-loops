// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Gate Configured Checks
// ───────────────────────────────────────────────────────────────────
'use strict';

// The commands a repository's own config names. Each one is matched to the files it should read,
// grouped by the folder it runs in, given an argv array and never a shell, and decided in the
// runner's fixed order: no matching file, then the flags, then an absent tool, then --no-run,
// then an untrusted config, then a run outside git. A check that would start a command outside
// git stops there, because nothing could show whether it changed the workspace.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

const qualityConfig = require('./quality-config.cjs');
const { findTool, spawnGroup } = require('./run-check.cjs');

const { REPAIRS, TRUST_REPAIR, aggregateState, isRegularFile, matchesGlob } = require('./gate-core.cjs');
const { selected } = require('./gate-check-plan.cjs');
const { authored } = require('./gate-files.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// The commands below come from the repository's committed config and from nowhere
// else. Each one gets the files it matched, never a shell, and never a file the
// runner could not find as a regular file, because a tool handed a folder or a dead
// link fails for a reason that is not the change's.
const PASSABLE = new Set([null, 'binary', 'size', 'no comment family']);

// ─────────────────────────────────────────────────────────────────────────────
// 3. MATCHING
// ─────────────────────────────────────────────────────────────────────────────

function configuredEntries(context) {
  return [...context.merged.checks, ...context.merged.generated.filter((row) => row.layer === 'repo')];
}

// A generated row names output and carries its own command, so every in-scope file its
// own paths match is that row's input, wherever the file sits and whether the base layer
// marked it as built output or the base exclude list hides it. A path the repository's own
// exclude list removed is out of the run for every row. A check reads only what the runner
// reads as source, so a declared generated path is never a check's input.
function configuredMatches(entry, files) {
  return files.filter((facts) => {
    const reachable = entry.kind === 'generated' ? !facts.excludedByRepo : authored(facts);
    if (!reachable) return false;
    const passable = entry.kind === 'generated'
      ? (facts.unchecked === 'excluded' ? isRegularFile(facts.abs) : PASSABLE.has(facts.unchecked))
      : PASSABLE.has(facts.unchecked);
    if (!passable) return false;
    if (entry.languages && !entry.languages.includes(facts.language)) return false;
    return !entry.paths || matchesGlob(entry.paths, facts.rel);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ARGUMENTS AND FOLDERS
// ─────────────────────────────────────────────────────────────────────────────

// The nearest folder above a file that holds a project manifest, so a tool that reads
// its own project file starts where that file is. A file with none above it runs at
// the root.
function packageDir(root, rel, cache) {
  const chain = [];
  let dir = path.posix.dirname(rel);
  let found = '.';
  for (;;) {
    if (cache.has(dir)) {
      found = cache.get(dir);
      break;
    }
    chain.push(dir);
    if (qualityConfig.PACKAGE_MARKERS.some((name) => fs.existsSync(path.join(root, dir, name)))) {
      found = dir;
      break;
    }
    if (dir === '.') break;
    dir = path.posix.dirname(dir);
  }
  for (const entry of chain) cache.set(entry, found);
  return found;
}

// A name that starts with a dash would read as an option to most tools, so it is
// passed as ./name.
function fileArgument(cwd, rel) {
  const out = cwd === '.' ? rel : path.posix.relative(cwd, rel);
  return out.startsWith('-') ? `./${out}` : out;
}

// A program named with a slash is a file in the repository, read from the root the same
// way a requires value is, so a run in a package folder starts the file the presence
// probe found instead of one looked up under that folder.
function programArgument(root, argv) {
  const [program, ...rest] = argv;
  if (!program || !program.includes('/') || path.isAbsolute(program)) return argv;
  return [path.resolve(root, program), ...rest];
}

function configuredRuns(entry, matched, context, cache) {
  const groups = new Map();
  for (const facts of matched) {
    const cwd = entry.cwd === 'package' ? packageDir(context.root, facts.rel, cache) : '.';
    if (!groups.has(cwd)) groups.set(cwd, []);
    groups.get(cwd).push(facts);
  }
  return [...groups.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)).map(([cwd, members]) => {
    const expanded = entry.argv.flatMap((arg) => (arg === qualityConfig.FILES_TOKEN ? members.map((facts) => fileArgument(cwd, facts.rel)) : [arg]));
    return { cwd, files: members, argv: programArgument(context.root, expanded) };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PLANNING
// ─────────────────────────────────────────────────────────────────────────────

function configuredRow(entry, overrides = {}) {
  return {
    id: entry.id,
    origin: entry.kind === 'generated' ? 'generated' : 'configured',
    severity: entry.severity,
    required: entry.required,
    state: 'NOT_APPLICABLE',
    argv: [...entry.argv],
    cwd: entry.cwd,
    exit: null,
    duration_ms: 0,
    requires: entry.requires,
    repair: null,
    code: null,
    files: 0,
    runs: [],
    ...overrides,
  };
}

// A requires value holding a slash names a file in the repository, read from the root.
function requiredTool(entry, context) {
  const name = entry.requires.includes('/') ? path.resolve(context.root, entry.requires) : entry.requires;
  return findTool(name, context.env);
}

/**
 * Decide what each configured check does in this run. The order is the built-in one:
 * no matching file, then the flags, then an absent tool, then --no-run, then an untrusted
 * config, then a run outside git. A check that would start a command outside git stops
 * there, because nothing could show whether it changed the workspace.
 *
 * @param {Object[]} files - File facts for the scope.
 * @param {Object} context - The run context.
 * @returns {Array<{entry:Object, row:Object, matched:Object[], runs:Object[], pending:boolean}>}
 */
function planConfigured(files, context) {
  const cache = new Map();
  return configuredEntries(context).map((entry) => {
    const matched = configuredMatches(entry, files);
    const row = configuredRow(entry, { files: matched.length });
    const item = { entry, row, matched, runs: [], pending: false };
    if (matched.length === 0) return item;
    if (!selected(context, entry.id)) return { ...item, row: { ...row, state: 'SKIPPED_BY_FLAG' } };
    if (!requiredTool(entry, context)) {
      return { ...item, row: { ...row, state: 'SKIPPED_ABSENT', repair: `install '${entry.requires}' or remove the check from ${context.config.path}` } };
    }
    const runs = configuredRuns(entry, matched, context, cache);
    if (context.options.noRun) {
      return { ...item, row: { ...row, state: 'LISTED', runs: runs.map((run) => ({ cwd: run.cwd, argv: run.argv, files: run.files.length, state: 'LISTED' })) } };
    }
    if (context.config.trust.checks === 'untrusted') {
      return { ...item, row: { ...row, state: 'SKIPPED_UNTRUSTED', repair: TRUST_REPAIR } };
    }
    if (!context.git) return { ...item, row: { ...row, state: 'ERROR', code: 'GUARD_UNAVAILABLE', repair: REPAIRS.GUARD_UNAVAILABLE } };
    return { ...item, runs, pending: true };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. RUNNING
// ─────────────────────────────────────────────────────────────────────────────

// Each cwd group is one run under the check's own deadline. A run that times out or
// cannot start ends the check, so a stuck tool costs one deadline and not one per
// folder.
function runConfigured(item, context) {
  const timeoutMs = item.entry.timeoutSec ? Math.max(1, Math.round(item.entry.timeoutSec * 1000)) : context.timeoutMs;
  const runs = [];
  for (const run of item.runs) {
    const result = spawnGroup(run.argv, { cwd: path.join(context.root, run.cwd), env: context.env, timeoutMs });
    runs.push({ cwd: run.cwd, argv: run.argv, files: run.files.length, state: result.state, exit: result.exit, duration_ms: result.durationMs });
    if (result.state === 'TIMEOUT' || result.state === 'ERROR') break;
  }
  const state = aggregateState(runs, runs.some((run) => run.state === 'RAN_FAIL'));
  const failed = runs.find((run) => run.state !== 'RAN_CLEAN');
  const repair = {
    RAN_FAIL: 'rerun the command in the listed cwd to read what it reported',
    TIMEOUT: `the command passed its ${timeoutMs / 1000} second deadline, raise timeoutSec or --timeout`,
    ERROR: 'the command could not start, check its argv and its requires value',
  }[state] || null;
  return {
    ...item.row,
    state,
    exit: failed ? failed.exit : 0,
    duration_ms: runs.reduce((sum, run) => sum + run.duration_ms, 0),
    repair,
    runs,
  };
}

function readSuggested(context) {
  const taken = configuredEntries(context);
  return qualityConfig.readSuggestions(context.root).filter((item) => !taken.some((entry) => entry.id === item.id
    || JSON.stringify(entry.argv) === JSON.stringify(item.entry.argv)));
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  configuredEntries, configuredMatches, planConfigured, readSuggested, runConfigured,
};
