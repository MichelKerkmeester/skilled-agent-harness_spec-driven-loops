#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code Quality Config Doctor
// ───────────────────────────────────────────────────────────────────
'use strict';

// Shows, checks and creates the repository quality config the sk-code quality gate
// reads, without running anything that config names.
//
// WHY THIS EXISTS: a repository names its own checks in .sk-code/quality.json, and the
// gate runs those commands on every change. Writing that file by hand risks a typo
// that fails every run, and copying a template over a reviewed file loses the review.
// This script reads the config through the same module the gate uses, reports which
// named tools are on PATH, and creates the file once from the shipped template, with
// the checks the repository's manifests imply entered as not required.
//
// No mode runs a configured command: status looks tools up on PATH and stops there,
// so a config can be inspected before anyone trusts it. The only write is init with
// --apply, which creates the file through a hard link so it never replaces one that
// already exists, not even one created a moment earlier by a second run.
//
// Usage:
//   sk-code-quality-config.cjs status [--repo <dir>] [--config <path>] [--json]
//   sk-code-quality-config.cjs check  [--repo <dir>] [--config <path>] [--json]
//   sk-code-quality-config.cjs init   [--repo <dir>] [--apply] [--json]
//   sk-code-quality-config.cjs -h | --help
//
// Exit 0 when the request succeeded, 1 when the config is invalid or missing or init
// refused to write, 2 on a usage error or outside a git repository, always with a
// STATUS= line last.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const QUALITY_ROOT = path.resolve(__dirname, '../../../skills/sk-code/sk-code-quality');
const qualityConfig = require(path.join(QUALITY_ROOT, 'scripts', 'lib', 'quality-config.cjs'));
const { findTool, runGit } = require(path.join(QUALITY_ROOT, 'scripts', 'lib', 'run-check.cjs'));
const { CHECK_IDS, probeLayers } = require(path.join(QUALITY_ROOT, 'scripts', 'quality-gate.cjs'));

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULTS_PATH = path.join(QUALITY_ROOT, 'assets', 'quality-defaults.json');
const MODES = Object.freeze(['status', 'check', 'init']);
const HELP_FLAGS = new Set(['-h', '--help']);

const USAGE_TEXT = [
  'Usage: sk-code-quality-config.cjs status|check|init [options]',
  '',
  'Modes:',
  '  status            report the config source, its errors, each named tool and the hygiene layers',
  '  check             validate the config against the schema and report its errors, probing nothing',
  '  init              show the config init would create, and write it only with --apply',
  '',
  'Options:',
  '  --repo DIR        the repository to read, default the working directory',
  '  --config PATH     read this config instead of discovering one, for status and check',
  '  --apply           let init create .sk-code/quality.json, which it never overwrites',
  '  --json            print one JSON document before the STATUS line',
  '  -h, --help        print this help and exit 0',
  '',
  'Config discovery, the first source found wins:',
  '  1. --config PATH',
  '  2. git config skcode.qualityConfig from a config file, relative to the repository root',
  '     (a git -c or GIT_CONFIG_* value is ignored)',
  '  3. .sk-code/quality.json at the repository root',
  '  4. none, so the gate runs its built-in checks alone',
  '',
  'Exit codes:',
  '  0  the request succeeded, including a status that reports a DEGRADED tool',
  '  1  the config is missing or invalid, or init refused to write (CONFIG_EXISTS)',
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
  if (opts.config && mode === 'init') throw new RequestError('init always writes .sk-code/quality.json, so it takes no --config');
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
    return { source: error.source || null, path: error.path || null, display: error.path || null, bytes: null, raw: null,
      errors: [{ code: error.code, field: '', message: error.message }], merged: null };
  }
}

function describeSource(loaded) {
  if (loaded.source === 'none') return 'none, the gate runs its built-in checks alone';
  return `${loaded.display} (${loaded.source}${loaded.bytes === null ? '' : `, ${loaded.bytes} bytes`})`;
}

function errorCode(loaded) {
  return loaded.errors.some((entry) => entry.code === 'CONFIG_PATH_MISSING') ? 'CONFIG_PATH_MISSING' : 'CONFIG_INVALID';
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
  const tools = probeTools(ctx, loaded);
  const layers = probeLayers({ git: true, root: ctx.root, env: ctx.env });
  const lines = [`Repository: ${ctx.root}`, `Config: ${describeSource(loaded)}`];
  if (loaded.errors.length === 0) lines.push('Errors: none');
  for (const entry of loaded.errors) lines.push(`  ERROR  ${entry.message}`);
  if (tools.length === 0) lines.push('Tools: none named');
  for (const row of tools) {
    const names = row.checks.length > 0 ? `checks ${row.checks.join(', ')}` : `suggested ${row.suggested.join(', ')}, no configured check names it`;
    lines.push(`  ${row.state.padEnd(8)} ${row.tool} (${names})${row.repair ? `: ${row.repair}` : ''}`);
  }
  lines.push(`Layers: pre-commit ${layers.pre_commit_hygiene}, ci ${layers.ci_hygiene}, post-edit ${layers.post_edit}`);
  const failed = loaded.errors.length > 0;
  const state = failed ? 'FAIL' : tools.some((row) => row.state === 'DEGRADED') ? 'DEGRADED' : 'OK';
  const source = loaded.source || 'unknown';
  emit(opts, {
    repo: ctx.root,
    config: { source: loaded.source, path: loaded.display, bytes: loaded.bytes, errors: loaded.errors },
    tools,
    layers,
  }, lines, `STATUS=${state} SOURCE="${source}"${failed ? ` ERROR=${errorCode(loaded)}` : ''}`);
  return failed ? 1 : 0;
}

function check(ctx, opts) {
  const loaded = load(ctx, opts);
  const lines = [`Config: ${describeSource(loaded)}`];
  for (const entry of loaded.errors) lines.push(`  ERROR  ${entry.message}`);
  if (loaded.errors.length === 0) lines.push(loaded.source === 'none' ? 'Nothing to check.' : 'Valid against the schema.');
  const failed = loaded.errors.length > 0;
  emit(opts, { repo: ctx.root, config: { source: loaded.source, path: loaded.display, bytes: loaded.bytes, errors: loaded.errors } }, lines,
    `STATUS=${failed ? 'FAIL' : 'OK'} SOURCE="${loaded.source || 'unknown'}" ERRORS=${loaded.errors.length}${failed ? ` ERROR=${errorCode(loaded)}` : ''}`);
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
  const target = path.join(ctx.root, qualityConfig.REPO_CONFIG_FILE);
  const folder = path.dirname(target);
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
  const exists = Boolean(fs.lstatSync(target, { throwIfNoEntry: false }));
  const plan = {
    repo: ctx.root,
    target: qualityConfig.REPO_CONFIG_FILE,
    applied: false,
    exists,
    checks: suggestions.map((item) => ({ id: item.id, source: item.source, argv: item.entry.argv, required: false })),
    outranked,
    config,
  };
  const lines = [`Target: ${qualityConfig.REPO_CONFIG_FILE}`];
  if (plan.checks.length === 0) lines.push('Checks: none, no manifest at the root implies one');
  for (const item of plan.checks) lines.push(`  enable ${item.id} from ${item.source}, not required: ${item.argv.join(' ')}`);
  if (outranked) lines.push(`Note: git config skcode.qualityConfig names ${outranked}, which outranks ${qualityConfig.REPO_CONFIG_FILE}. Unset it for the new file to take effect.`);

  if (exists) {
    lines.push(`Refused: ${qualityConfig.REPO_CONFIG_FILE} already exists and is never overwritten.`);
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
  if (!createOnce(target, text)) {
    lines.push(`Refused: ${qualityConfig.REPO_CONFIG_FILE} appeared before the write and is never overwritten.`);
    emit(opts, { ...plan, exists: true }, lines, 'STATUS=FAIL MODE=REFUSED ERROR=CONFIG_EXISTS');
    return 1;
  }
  lines.push(`Wrote: ${qualityConfig.REPO_CONFIG_FILE}. Review it and commit it like any other repository setting.`);
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

module.exports = { USAGE_TEXT, main };
