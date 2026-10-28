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

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const QUALITY_ROOT = path.resolve(__dirname, '../../../skills/sk-code/sk-code-quality');
const qualityConfig = require(path.join(QUALITY_ROOT, 'scripts', 'lib', 'quality-config.cjs'));
const { findTool, runGit, spawnArgv } = require(path.join(QUALITY_ROOT, 'scripts', 'lib', 'run-check.cjs'));
const { CHECK_IDS, TRUST_REPAIR, checkTrust, probeLayers } = require(path.join(QUALITY_ROOT, 'scripts', 'quality-gate.cjs'));

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULTS_PATH = path.join(QUALITY_ROOT, 'assets', 'quality-defaults.json');
const RUNNER = path.join(QUALITY_ROOT, 'scripts', 'quality-gate.cjs');
const SKILLS_DIR = path.resolve(QUALITY_ROOT, '..', '..');
const OVERRIDE_LINTER_PATH = path.join(QUALITY_ROOT, '..', 'shared', 'scripts', 'check-rule-overrides.cjs');
const RULE_REGISTRY_PATH = path.join(QUALITY_ROOT, '..', 'shared', 'scripts', 'lib', 'rule-registry.cjs');
const OVERRIDE_REPAIR = 'fix or remove each override row the message names, then check the file with '
  + 'node .skilled/skills/sk-code/shared/scripts/check-rule-overrides.cjs <checklist.md>';
const EXPLAIN_SCHEMA = 'code-quality-explain/v1';
const MODES = Object.freeze(['status', 'check', 'init']);
const HELP_FLAGS = new Set(['-h', '--help']);

// A checklist selects files by path glob, extension, content marker or surface, so one file
// per group of the first three folders and extension stands in for the tree. Over this
// framework's own repository that sample resolved the same checklists as every tracked
// file, in about a sixtieth of the time. A paths selector deeper than three folders, a
// contentMarkers selector, or a surface file or content marker can still miss every
// sampled file. The status names the sample it read, and it checks every checklist the
// repository config declares whether or not the sample reached it.
const SAMPLE_DEPTH = 3;
const SAMPLE_LIMIT = 4000;
// Each explain call names its files on the command line, so a batch stays far below the
// system's argument limit.
const EXPLAIN_BATCH = 500;
const EXPLAIN_TIMEOUT_MS = 60000;

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

class RequestError extends Error {
  constructor(message, { code = 'USAGE', exit = 2, mode = null } = {}) {
    super(message);
    this.code = code;
    this.exit = exit;
    this.mode = mode;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
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

function realOrSelf(file) {
  try {
    return fs.realpathSync(file);
  } catch {
    return file;
  }
}

function isInside(child, parent) {
  const rel = path.relative(parent, child);
  return rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel);
}

function emit(opts, payload, lines, status) {
  if (opts.json) process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
  else process.stdout.write(lines.map((line) => `${line}\n`).join(''));
  process.stdout.write(`${status}\n`);
}

// Discovery faults and schema faults both come back as one list, so status and check
// report them the same way.
function load(ctx, opts) {
  try {
    return qualityConfig.loadConfig({
      cliPath: opts.config, cwd: ctx.cwd, root: ctx.root, git: true, env: ctx.env, defaults: ctx.defaults,
      builtinIds: ctx.builtinIds,
    });
  } catch (error) {
    if (!(error instanceof qualityConfig.ConfigError)) throw error;
    return { source: error.source || null, scope: error.scope || null, path: error.path || null, display: error.path || null, bytes: null, raw: null,
      errors: [{ code: error.code, field: '', message: error.message }], merged: null };
  }
}

// A committed file that named another repository applied to nothing, and the line says
// which file and which two repositories, so the status does not read as unconfigured.
function describeSource(loaded, root) {
  if (loaded.ignored) {
    const where = qualityConfig.displayPath(loaded.ignored.path, root);
    return `none; ignored ${where}, written for ${loaded.ignored.repository}, this repository is ${loaded.ignored.current || 'unknown'}`;
  }
  if (loaded.source === 'none') return 'none, the gate runs its built-in checks alone';
  return `${loaded.display} (${loaded.source}${loaded.bytes === null ? '' : `, ${loaded.bytes} bytes`})`;
}

function errorCode(loaded) {
  const named = loaded.errors.find((entry) => entry.code === 'CONFIG_PATH_MISSING' || entry.code === 'CONFIG_LEGACY_LOCATION');
  return named ? named.code : 'CONFIG_INVALID';
}

// The doctor reads the same trust rule the runner applies, so the state it reports is the
// state the gate would act on. A config that did not validate names no check for this run.
function trustState(loaded, ctx) {
  if (loaded.errors.length > 0) {
    const missing = loaded.errors.some((entry) => entry.code === 'CONFIG_PATH_MISSING' || entry.code === 'CONFIG_LEGACY_LOCATION');
    const reason = missing ? 'the config could not be read, so no configured check runs' : 'the config did not validate, so no configured check runs';
    return { checks: 'none', reason, repair: null };
  }
  const merged = loaded.merged;
  const configured = merged ? merged.checks.length + merged.generated.filter((row) => row.layer === 'repo').length : 0;
  const trust = checkTrust({ git: true, root: ctx.root, env: ctx.env, source: loaded.source, scope: loaded.scope, value: loaded.value, configured });
  return { ...trust, repair: trust.checks === 'untrusted' ? TRUST_REPAIR : null };
}

// The core hygiene rules the config switches off, named the way the gate's verdict names
// them. A config that did not validate switches nothing off, because the gate refuses it.
function disabledHygieneRules(loaded) {
  return loaded.merged ? loaded.merged.commentHygiene.disableRules.map((rule) => `hygiene.${rule}`) : [];
}

// A repository with no specs/ folder has none of the planning artifacts the spec-kit
// vocabulary rules point at, so init offers to switch them off. It only offers: the
// config it writes keeps every rule on until someone adds the list.
function hygieneSuggestion(root) {
  if (fs.existsSync(path.join(root, 'specs'))) return null;
  return {
    field: 'commentHygiene.disableRules',
    rules: [...qualityConfig.SPEC_KIT_HYGIENE_RULES],
    reason: 'the repository has no specs/ folder, so the spec-kit vocabulary rules have nothing to point at',
    applied: false,
  };
}

function trustLine(trust) {
  return `Trust: ${trust.checks} (${trust.reason})${trust.repair ? ` (repair: ${trust.repair})` : ''}`;
}

// The files the gate would see in a worktree run, tracked and untracked but not ignored,
// reduced to one per sample key. A link or a deleted path is passed over, because the
// runner names only regular files.
function sampleFiles(ctx) {
  const listed = runGit(['ls-files', '-z', '--cached', '--others', '--exclude-standard'], { cwd: ctx.root, env: ctx.env });
  if (!listed.ok) return { error: `git ls-files failed: ${(listed.stderr || listed.error || '').trim() || 'no output'}` };
  const names = [...new Set(listed.stdout.split('\0').filter(Boolean))];
  const keys = new Set();
  const files = [];
  let capped = false;
  for (const rel of names) {
    const parts = rel.split('/');
    const base = parts[parts.length - 1];
    const dot = base.lastIndexOf('.');
    const key = `${parts.slice(0, Math.min(SAMPLE_DEPTH, parts.length - 1)).join('/')}|${dot > 0 ? base.slice(dot) : ''}`;
    if (keys.has(key)) continue;
    const stat = fs.lstatSync(path.join(ctx.root, rel), { throwIfNoEntry: false });
    if (!stat || !stat.isFile()) continue;
    if (files.length >= SAMPLE_LIMIT) {
      capped = true;
      break;
    }
    keys.add(key);
    files.push(rel);
  }
  return { listed: names.length, files, capped, error: null };
}

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

// failed marks a resolution that broke, as opposed to one with nothing to resolve.
function unresolved(reason, { sample = null, failed = false } = {}) {
  return { resolved: false, failed, reason, sample, checklists: [], conflicts: [], errors: [], warnings: [] };
}

// Every checklist the gate would load for some sampled file, with each seat that listed
// it and its override section exactly as the shared linter read it. A fault is an error
// when any sampled file reaches it, as one run over every file would report it, so a
// warning one batch raised is dropped once another batch reports it as an error. A rule
// conflict is the one the runner's own precedence found for a sampled file, gathered per
// rule and pair of checklists.
function appliedRules(ctx, opts, loaded) {
  if (loaded.errors.length > 0) return unresolved('the config did not validate, so the gate stops before it applies any rule');
  const sample = sampleFiles(ctx);
  if (sample.error) return unresolved(sample.error, { failed: true });
  const described = { files: sample.files.length, listed: sample.listed, capped: sample.capped,
    rule: `one file per first ${SAMPLE_DEPTH} folders and extension` };
  if (sample.files.length === 0) return unresolved('the repository holds no regular file to resolve', { sample: described });
  const checklists = new Map();
  const errors = new Map();
  const warnings = new Map();
  const conflicts = new Map();
  for (let start = 0; start < sample.files.length; start += EXPLAIN_BATCH) {
    const batch = explainBatch(ctx, opts, sample.files.slice(start, start + EXPLAIN_BATCH));
    if (batch.error) return unresolved(batch.error, { sample: described, failed: true });
    for (const entry of batch.doc.files) {
      for (const row of entry.checklists) {
        if (!checklists.has(row.file)) checklists.set(row.file, { file: row.file, why: row.why, seats: [], files: 0, overrides: row.overrides });
        const item = checklists.get(row.file);
        for (const seat of row.sources) if (!item.seats.includes(seat)) item.seats.push(seat);
        item.files += 1;
      }
      for (const row of entry.rule_conflicts || []) {
        const key = `${row.id}\0${row.files.join('\0')}`;
        if (!conflicts.has(key)) conflicts.set(key, { id: row.id, files: row.files, sampled: [] });
        conflicts.get(key).sampled.push(entry.file);
      }
    }
    for (const row of batch.doc.errors) errors.set(`${row.code}\0${row.message}`, row);
    for (const row of batch.doc.config.warnings) warnings.set(`${row.code}\0${row.message}`, row);
  }
  for (const key of errors.keys()) warnings.delete(key);
  const reached = [...checklists.values()].map((item) => ({ ...item, reached: true }));
  const declared = unreachedRepositoryRows(ctx, loaded, checklists);
  const faults = [...errors.values()];
  // A gate run refuses a loaded checklist whose override section the linter refuses, or one
  // with a row that names no known rule, so the status reports the same fault for every
  // checklist it lists, reached or only declared.
  const known = unknownRuleRows();
  for (const item of [...reached, ...declared]) {
    item.unknown = item.overrides && !item.overrides.refused ? known(item.overrides.rows) : [];
    if (item.overrides && item.overrides.refused) faults.push(refusedOverrides(item.file, item.overrides.errors));
    else if (item.unknown.length > 0) faults.push(refusedOverrides(item.file, item.unknown));
  }
  for (const item of declared) if (item.missing) faults.push(item.missing);
  return { resolved: true, failed: false, reason: null, sample: described,
    checklists: [...reached, ...declared.map(({ missing, ...item }) => item)], conflicts: [...conflicts.values()],
    errors: faults, warnings: [...warnings.values()] };
}

// The rows of a section whose id no declaring document carries, read through the same
// registry the runner reads, as {line, message} rows. A registry that cannot be read
// refuses every row, as the runner does.
function unknownRuleRows() {
  let registry = null;
  let fault = null;
  try {
    registry = require(RULE_REGISTRY_PATH).loadRegistry();
  } catch (error) {
    fault = `the rule id registry could not be read: ${error.message}`;
  }
  return (rows) => {
    if (rows.length === 0) return [];
    if (fault) return [{ line: null, message: fault }];
    return rows.filter((row) => !registry.has(row.id))
      .map((row) => ({ line: row.line, message: `\`${row.id}\` names no rule the runner, the universal standards or the review lens declares` }));
  };
}

function refusedOverrides(file, reasonRows) {
  const reasons = reasonRows.map((row) => `${row.line === null ? '' : `line ${row.line}: `}${row.message}`).join('; ');
  return { code: 'CONFIG_INVALID', message: `${file} has a refused ## Rule overrides section, so none of its rows apply: ${reasons}`, repair: OVERRIDE_REPAIR };
}

// The override section of a declared checklist, read through the shared linter the runner
// uses, in the shape an explanation prints. A missing file reads null, as it does there.
function lintChecklist(abs) {
  let stat = null;
  try {
    stat = fs.statSync(abs);
  } catch {
    stat = null;
  }
  if (!stat || !stat.isFile()) return null;
  try {
    const linter = require(OVERRIDE_LINTER_PATH);
    const result = linter.lintOverrides(fs.readFileSync(abs, 'utf8'), linter.loadContract());
    return { found: result.found, refused: result.errors.length > 0, rows: result.rows, errors: result.errors };
  } catch (error) {
    return { found: false, refused: true, rows: [], errors: [{ line: null, message: `the override section could not be read: ${error.message}` }] };
  }
}

// A repository row the sample did not reach still loads for the file it selects, so it is
// listed as declared and checked the way a reached row is: its file must exist and its
// override section must lint. Only the config's own rows are checked here, because those
// are the ones a sample is most likely to miss and the ones the repository can fix.
function unreachedRepositoryRows(ctx, loaded, reached) {
  const rows = loaded.merged ? loaded.merged.checklists.filter((row) => row.layer === 'repo') : [];
  const seen = new Set(reached.keys());
  const declared = [];
  for (const row of rows) {
    if (seen.has(row.file)) continue;
    seen.add(row.file);
    const abs = row.file.startsWith('hub:') ? path.join(SKILLS_DIR, row.file.slice('hub:'.length)) : path.join(ctx.root, row.file);
    const selectors = ['paths', 'extensions', 'contentMarkers'].filter((key) => Array.isArray(row[key])).map((key) => `${key} ${row[key].join(' ')}`).join(', ');
    const overrides = lintChecklist(abs);
    declared.push({
      file: row.file,
      why: row.why || `${loaded.display}, ${selectors}`,
      seats: ['repo-config'],
      files: 0,
      reached: false,
      overrides,
      missing: overrides === null
        ? { code: 'CHECKLIST_MISSING', message: `${row.file} is declared but ${abs} is not a regular file`, repair: 'restore the checklist file or fix the declaration that names it' }
        : null,
    });
  }
  return declared;
}

// The core rules the checker would apply, read from its own table, and the ones the
// config switches off. A config the gate refuses applies none of them.
function appliedHygiene(loaded) {
  if (loaded.errors.length > 0) return null;
  const disabled = disabledHygieneRules(loaded);
  try {
    const active = qualityConfig.readHygieneRules().map((rule) => `hygiene.${rule}`).filter((id) => !disabled.includes(id));
    return { active, disabled, error: null };
  } catch (error) {
    return { active: null, disabled, error: error.message };
  }
}

function overrideLines(overrides, unknown = []) {
  if (overrides === null) return ['    no override section read: the file is missing'];
  if (!overrides.found) return [];
  const reasons = overrides.refused ? overrides.errors : unknown;
  if (reasons.length > 0) {
    return ['    overrides REFUSED, none of its rows apply:',
      ...reasons.map((row) => `      ${row.line === null ? '' : `line ${row.line}: `}${row.message}`)];
  }
  return overrides.rows.map((row) => `    override ${row.id} ${row.action === 'replace' ? `replace: ${row.text}` : 'none'}${row.reason ? ` (${row.reason})` : ''}`);
}

function appliedLines(applies) {
  const { hygiene } = applies;
  const lines = [];
  if (!applies.resolved) {
    lines.push(`Checklists: not resolved, ${applies.reason}`);
  } else {
    const { sample } = applies;
    lines.push(`Checklists: ${applies.checklists.length}, resolved by quality-gate.cjs --explain over ${sample.files} of ${sample.listed} listed files (${sample.rule}${sample.capped ? `, capped at ${SAMPLE_LIMIT}` : ''})`);
    for (const item of applies.checklists) {
      const reach = item.reached
        ? `${item.files} sampled ${item.files === 1 ? 'file' : 'files'}`
        : 'declared, not reached by the sample: run quality-gate.cjs --explain <path> on a file it selects';
      lines.push(`  ${item.seats.join(', ').padEnd(12)} ${item.file} (${item.why}, ${reach})`);
      lines.push(...overrideLines(item.overrides, item.unknown));
    }
    for (const row of applies.conflicts) {
      lines.push(`  override-conflict ${row.id} ${row.files.join(' ')} (neither row applies, so the gate reads UNVERIFIED for ${row.sampled.join(', ')})`);
    }
    for (const row of applies.errors) lines.push(`  ERROR  ${row.code}: ${row.message}${row.repair ? ` (repair: ${row.repair})` : ''}`);
    for (const row of applies.warnings) lines.push(`  warning ${row.code}: ${row.message}`);
  }
  if (hygiene === null) lines.push('Hygiene rules: none apply, the gate stops on the config errors above');
  else if (hygiene.active === null) lines.push(`Hygiene rules: unknown, ${hygiene.error}`);
  else lines.push(`Hygiene rules: ${hygiene.active.length} apply (${hygiene.active.join(', ')}), disabled ${hygiene.disabled.length > 0 ? hygiene.disabled.join(', ') : 'none'}`);
  return lines;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MODES
// ─────────────────────────────────────────────────────────────────────────────

// A tool a configured check names is PASS when PATH holds it and DEGRADED when it does
// not. A tool only a suggestion names is SKIP, because no check would look for it.
function probeTools(ctx, loaded) {
  const entries = loaded.merged
    ? [...loaded.merged.checks, ...loaded.merged.generated.filter((row) => row.layer === 'repo')]
    : [];
  const tools = new Map();
  for (const entry of entries) {
    if (!tools.has(entry.requires)) tools.set(entry.requires, { tool: entry.requires, checks: [], suggested: [] });
    tools.get(entry.requires).checks.push(entry.id);
  }
  for (const item of qualityConfig.readSuggestions(ctx.root)) {
    if (entries.some((entry) => entry.id === item.id)) continue;
    const tool = item.entry.requires;
    if (!tools.has(tool)) tools.set(tool, { tool, checks: [], suggested: [] });
    tools.get(tool).suggested.push(item.id);
  }
  return [...tools.values()].map((row) => {
    if (row.checks.length === 0) return { ...row, state: 'SKIP', found: null, repair: null };
    const name = row.tool.includes('/') ? path.resolve(ctx.root, row.tool) : row.tool;
    const found = findTool(name, ctx.env);
    return found
      ? { ...row, state: 'PASS', found, repair: null }
      : { ...row, state: 'DEGRADED', found: null, repair: `install '${row.tool}' or remove ${row.checks.join(', ')} from ${loaded.display}` };
  });
}

function status(ctx, opts) {
  const loaded = load(ctx, opts);
  const trust = trustState(loaded, ctx);
  const tools = probeTools(ctx, loaded);
  const layers = probeLayers({ git: true, root: ctx.root, env: ctx.env });
  const lines = [`Repository: ${ctx.root}`, `Config: ${describeSource(loaded, ctx.root)}`, trustLine(trust)];
  if (loaded.errors.length === 0) lines.push('Errors: none');
  for (const entry of loaded.errors) lines.push(`  ERROR  ${entry.message}`);
  if (tools.length === 0) lines.push('Tools: none named');
  for (const row of tools) {
    const names = row.checks.length > 0 ? `checks ${row.checks.join(', ')}` : `suggested ${row.suggested.join(', ')}, no configured check names it`;
    lines.push(`  ${row.state.padEnd(8)} ${row.tool} (${names})${row.repair ? `: ${row.repair}` : ''}`);
  }
  lines.push(`Layers: pre-commit ${layers.pre_commit_hygiene}, ci ${layers.ci_hygiene}, post-edit ${layers.post_edit}`);
  const hygiene = { disabled: disabledHygieneRules(loaded) };
  lines.push(`Hygiene: ${hygiene.disabled.length > 0 ? `disabled ${hygiene.disabled.join(', ')}` : 'every core rule applies'}`);
  const applies = { ...appliedRules(ctx, opts, loaded), hygiene: appliedHygiene(loaded) };
  lines.push(...appliedLines(applies));
  // A checklist the gate cannot read makes every run that reaches it stop with exit 3, so
  // the status fails on it the way it fails on a config error. A rule conflict stops no
  // run: the gate reads UNVERIFIED, exit 4, for the files it covers, so the status lists it
  // and stays as it is.
  const failed = loaded.errors.length > 0 || applies.errors.length > 0;
  const degraded = tools.some((row) => row.state === 'DEGRADED') || applies.failed;
  const state = failed ? 'FAIL' : degraded ? 'DEGRADED' : 'OK';
  const code = loaded.errors.length > 0 ? errorCode(loaded) : applies.errors.length > 0 ? applies.errors[0].code : null;
  const source = loaded.source || 'unknown';
  emit(opts, {
    repo: ctx.root,
    config: { source: loaded.source, path: loaded.display, bytes: loaded.bytes, errors: loaded.errors, trust },
    tools,
    layers,
    hygiene,
    applies,
  }, lines, `STATUS=${state} SOURCE="${source}" TRUST=${trust.checks}${code ? ` ERROR=${code}` : ''}`);
  return failed ? 1 : 0;
}

function check(ctx, opts) {
  const loaded = load(ctx, opts);
  const trust = trustState(loaded, ctx);
  const lines = [`Config: ${describeSource(loaded, ctx.root)}`, trustLine(trust)];
  for (const entry of loaded.errors) lines.push(`  ERROR  ${entry.message}`);
  if (loaded.errors.length === 0) lines.push(loaded.source === 'none' ? 'Nothing to check.' : 'Valid against the schema.');
  const failed = loaded.errors.length > 0;
  emit(opts, { repo: ctx.root, config: { source: loaded.source, path: loaded.display, bytes: loaded.bytes, errors: loaded.errors, trust } }, lines,
    `STATUS=${failed ? 'FAIL' : 'OK'} SOURCE="${loaded.source || 'unknown'}" TRUST=${trust.checks} ERRORS=${loaded.errors.length}${failed ? ` ERROR=${errorCode(loaded)}` : ''}`);
  return failed ? 1 : 0;
}

// The folder can be a link a checkout carries in, so it must resolve inside the
// repository both before the plan is shown and again just before the write. A link
// that resolves nowhere is refused the same way.
function assertFolderInside(ctx, folder) {
  if (!fs.lstatSync(folder, { throwIfNoEntry: false })) return;
  const name = path.basename(folder);
  let real;
  try {
    real = fs.realpathSync(folder);
  } catch {
    throw new RequestError(`${name} is a link that resolves nowhere`, { code: 'OUTSIDE_REPOSITORY', exit: 1, mode: 'REFUSED' });
  }
  if (!isInside(real, realOrSelf(ctx.root))) {
    throw new RequestError(`${name} resolves to ${real}, outside the repository`, { code: 'OUTSIDE_REPOSITORY', exit: 1, mode: 'REFUSED' });
  }
  if (!fs.statSync(real).isDirectory()) {
    throw new RequestError(`${name} exists and is not a folder`, { code: 'CONFIG_EXISTS', exit: 1, mode: 'REFUSED' });
  }
}

// A temporary file holds the whole text first, and a hard link puts it in place. A link
// never replaces an existing name, so a file that appears between the check and the
// write is kept, and an interrupted run leaves no half-written config.
function createOnce(target, text) {
  const temp = path.join(path.dirname(target), `.quality.json.${process.pid}.${crypto.randomBytes(6).toString('hex')}.tmp`);
  fs.writeFileSync(temp, text, { flag: 'wx' });
  try {
    fs.linkSync(temp, target);
    return true;
  } catch (error) {
    if (error.code === 'EEXIST') return false;
    throw error;
  } finally {
    fs.rmSync(temp, { force: true });
  }
}

function init(ctx, opts) {
  const target = qualityConfig.repoConfigTarget(ctx.root);
  const file = path.join(ctx.root, target);
  const folder = path.dirname(file);
  assertFolderInside(ctx, folder);
  const { config, suggestions } = qualityConfig.initialConfig(ctx.root);
  const text = `${JSON.stringify(config, null, 2)}\n`;
  let outranked = null;
  try {
    const found = qualityConfig.discoverConfig({ cwd: ctx.cwd, root: ctx.root, git: true, env: ctx.env });
    if (found.source === 'git-config') outranked = found.path;
  } catch (error) {
    if (!(error instanceof qualityConfig.ConfigError)) throw error;
    if (error.source === 'git-config') outranked = error.path;
  }
  const exists = Boolean(fs.lstatSync(file, { throwIfNoEntry: false }));
  const plan = {
    repo: ctx.root,
    target,
    applied: false,
    exists,
    checks: suggestions.map((item) => ({ id: item.id, source: item.source, argv: item.entry.argv, required: false })),
    outranked,
    suggested_hygiene: hygieneSuggestion(ctx.root),
    config,
  };
  const lines = [`Target: ${target}`];
  if (plan.checks.length === 0) lines.push('Checks: none, no manifest at the root implies one');
  for (const item of plan.checks) lines.push(`  enable ${item.id} from ${item.source}, not required: ${item.argv.join(' ')}`);
  if (plan.suggested_hygiene) {
    lines.push(`Suggested, not written: ${plan.suggested_hygiene.field} ${JSON.stringify(plan.suggested_hygiene.rules)}`,
      `  why: ${plan.suggested_hygiene.reason}. Add the list to the file to switch those rules off.`);
  }
  if (outranked) lines.push(`Note: git config skcode.qualityConfig names ${outranked}, which outranks ${target}. Unset it for the new file to take effect.`);

  if (exists) {
    lines.push(`Refused: ${target} already exists and is never overwritten.`);
    emit(opts, plan, lines, `STATUS=FAIL MODE=${opts.apply ? 'REFUSED' : 'DRY_RUN'} ERROR=CONFIG_EXISTS`);
    return 1;
  }
  if (!opts.apply) {
    lines.push('Would write:', ...text.trimEnd().split('\n').map((line) => `  ${line}`), 'Dry run: nothing written. Add --apply to write.');
    emit(opts, plan, lines, 'STATUS=OK MODE=DRY_RUN');
    return 0;
  }
  fs.mkdirSync(folder, { recursive: true });
  assertFolderInside(ctx, folder);
  if (!createOnce(file, text)) {
    lines.push(`Refused: ${target} appeared before the write and is never overwritten.`);
    emit(opts, { ...plan, exists: true }, lines, 'STATUS=FAIL MODE=REFUSED ERROR=CONFIG_EXISTS');
    return 1;
  }
  lines.push(`Wrote: ${target}. Review it and commit it like any other repository setting.`);
  emit(opts, { ...plan, applied: true }, lines, 'STATUS=OK MODE=APPLIED');
  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. MAIN
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
    return { status, check, init }[opts.mode](ctx, opts);
  } catch (error) {
    const known = error instanceof RequestError;
    const message = known ? error.message : `unexpected: ${error.message}`;
    process.stderr.write(`sk-code-quality-config: ${message}\n`);
    const mode = known && error.mode ? ` MODE=${error.mode}` : '';
    process.stdout.write(`STATUS=FAIL${mode} ERROR=${known ? error.code : 'INTERNAL_ERROR'} MESSAGE="${message.replace(/"/g, "'")}"\n`);
    return known ? error.exit : 2;
  }
}

if (require.main === module) process.exitCode = main(process.argv.slice(2));

module.exports = { RUNNER, USAGE_TEXT, main };
