// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Gate Context
// ───────────────────────────────────────────────────────────────────
'use strict';

// Everything the run resolves once, before a check starts: which hub declares the checklists,
// which repository config was found and whether an operator or the repository vouched for the
// commands it names, and which files the scope reaches. A config fault ends the run here,
// because a check list that did not validate cannot say which commands the repository meant,
// and a trust verdict is read once so every later decision agrees with it.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

const qualityConfig = require('./quality-config.cjs');
const { findTool, runGit } = require('./run-check.cjs');

const {
  CHECK_IDS, COMMENT_SYNTAX_PATH, DEFAULTS_FILE, DEFAULTS_PATH, GateError, HUB_OVERRIDE_ENV, HUB_ROOT,
  REPAIRS, TRUST_KEY, parseDiffHunks, readJson, realpathOrSelf, toPosix,
} = require('./gate-core.cjs');
const { checkIdSet } = require('./gate-arguments.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_TREE = '4b825dc642cb6eb9a060e54bf8d69288fbee4904';

// ─────────────────────────────────────────────────────────────────────────────
// 3. DECLARATIONS AND TRUST
// ─────────────────────────────────────────────────────────────────────────────

function loadCommentSyntax() {
  try {
    const table = readJson(COMMENT_SYNTAX_PATH);
    const byExtension = {};
    const byInterpreter = {};
    for (const [language, spec] of Object.entries(table.languages)) {
      for (const ext of spec.extensions || []) byExtension[ext.toLowerCase()] = language;
      for (const name of spec.shebangs || []) byInterpreter[name] = language;
    }
    return { languages: table.languages, byExtension, byInterpreter };
  } catch (error) {
    throw new GateError('TABLE_UNREADABLE', `cannot read ${COMMENT_SYNTAX_PATH}: ${error.message}`);
  }
}

function loadDefaults() {
  try {
    const defaults = readJson(DEFAULTS_PATH);
    if (defaults.schemaVersion !== 1 || !Array.isArray(defaults.checklists) || !defaults.sensors) {
      throw new Error('schemaVersion 1, checklists and sensors are required');
    }
    return defaults;
  } catch (error) {
    throw new GateError('DEFAULTS_INVALID', `cannot read ${DEFAULTS_PATH}: ${error.message}`);
  }
}

function resolveDeclarationHub(env) {
  const override = env[HUB_OVERRIDE_ENV];
  const hub = override ? path.resolve(override) : HUB_ROOT;
  if (!fs.existsSync(path.join(hub, 'mode-registry.json'))) {
    throw new GateError('HUB_ROOT_INVALID', `${hub} holds no mode-registry.json`);
  }
  return realpathOrSelf(hub);
}

function noTrust(reason) {
  return { checks: 'none', reason };
}

function configuredCount(merged) {
  return merged.checks.length + merged.generated.filter((row) => row.layer === 'repo').length;
}

// A value read through an include is stored in the file that include names, and that file
// is often tracked, so the scope git reports for it says `local` while nothing about it
// belongs to the operator. The local read without includes answers what this repository's
// own .git/config holds, and the value must be the one discovery used, because an include
// may still be what supplied the file the run reads.
function storedInOwnGitConfig(at, value) {
  if (typeof value !== 'string' || value === '') return false;
  const stored = gitValue(at, ['config', '--local', '--no-includes', '--get-all', qualityConfig.GIT_CONFIG_KEY]);
  if (stored === null) return false;
  const values = stored.split('\n').filter((line) => line !== '');
  return values.length > 0 && values[values.length - 1] === value;
}

// A committed config may name commands, so it runs only when an operator or this repository
// vouched for it. The explicit flag, the value in the repository's own .git/config, the
// repository's own trust key and the hub's own checkout are the four ways that happens. A
// value a repository committed is never one of them, which is what keeps a third-party
// checkout from running its own checks.
/**
 * Decide whether configured repository commands have a recognized source of trust.
 *
 * @param {Object} options - Git state, repository root, environment and config provenance.
 * @returns {{checks:string, reason:string}} Trust state and its explanation.
 */
function checkTrust({ git, root, env, source, scope, value, configured }) {
  if (configured === 0) return noTrust('no configured check is declared');
  if (source === 'cli') return { checks: 'trusted', reason: 'the operator named the config with --config' };
  if (git) {
    const at = { root, env };
    if (source === 'git-config' && scope === 'local' && storedInOwnGitConfig(at, value)) {
      return { checks: 'trusted', reason: `git config ${qualityConfig.GIT_CONFIG_KEY} is stored in this repository's own .git/config` };
    }
    if (gitValue(at, ['config', '--local', '--bool', TRUST_KEY]) === 'true') {
      return { checks: 'trusted', reason: `${TRUST_KEY} is true in this repository` };
    }
    const repository = gitValue(at, ['rev-parse', '--path-format=absolute', '--git-common-dir']);
    const runner = gitValue(at, ['rev-parse', '--path-format=absolute', '--git-common-dir'], HUB_ROOT);
    if (repository && runner && repository === runner) {
      return { checks: 'trusted', reason: 'the repository shares its git common dir with the runner checkout' };
    }
  }
  return { checks: 'untrusted', reason: 'the config names commands and no trust rule applies' };
}

function configSummary(loaded, trust) {
  return {
    source: loaded.source,
    path: loaded.display,
    bytes: loaded.bytes,
    defaults: DEFAULTS_FILE,
    trust,
    errors: loaded.errors.map((entry) => ({ ...entry, repair: REPAIRS.CONFIG_INVALID })),
    warnings: [],
    // A committed file that named another repository applied to nothing. The record names
    // the file and both repositories, so the run does not read as an unconfigured one.
    ...(loaded.ignored ? { ignored: loaded.ignored } : {}),
    // The core hygiene rules the repository switched off, named the way a finding names
    // its rule, so a reader can see which findings this run could not raise.
    hygiene: { disabled: loaded.merged ? loaded.merged.commentHygiene.disableRules.map((rule) => `hygiene.${rule}`) : [] },
  };
}

// A config fault ends the run before any check starts, because a check list that did
// not validate cannot say which commands the repository meant.
function readRepositoryConfig(options, realCwd, root, git, env, defaults) {
  let loaded;
  try {
    loaded = qualityConfig.loadConfig({
      cliPath: options.configPath, cwd: realCwd, root, git, env, defaults, builtinIds: [...CHECK_IDS],
    });
  } catch (error) {
    if (!(error instanceof qualityConfig.ConfigError)) throw error;
    const named = ['CONFIG_PATH_MISSING', 'CONFIG_LEGACY_LOCATION'];
    const failure = new GateError(named.includes(error.code) ? error.code : 'GIT_FAILED', error.message);
    failure.config = { source: error.source || null, path: error.path || null, bytes: null, defaults: DEFAULTS_FILE,
      trust: noTrust('the config could not be read, so no configured check runs'), errors: [], warnings: [], hygiene: { disabled: [] } };
    throw failure;
  }
  if (loaded.errors.length > 0) {
    const where = loaded.display || 'the repository config';
    const failure = new GateError('CONFIG_INVALID', `${where} has ${loaded.errors.length} config error(s), listed in config.errors`);
    failure.config = configSummary(loaded, noTrust('the config did not validate, so no configured check runs'));
    throw failure;
  }
  return loaded;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. RUN CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

function buildContext(options, cwd, env) {
  const table = loadCommentSyntax();
  const defaults = loadDefaults();
  const declHub = resolveDeclarationHub(env);
  const realCwd = realpathOrSelf(path.resolve(cwd));
  const top = runGit(['rev-parse', '--show-toplevel'], { cwd: realCwd, env });
  const git = top.ok;
  if (!git && !['files', 'explain'].includes(options.scope)) {
    throw new GateError('NO_GIT_REPOSITORY', top.missing ? 'git is not on PATH' : `${realCwd} is not inside a git repository`);
  }
  const root = git ? top.stdout.trim() : realCwd;
  const loaded = readRepositoryConfig(options, realCwd, root, git, env, defaults);
  const trust = checkTrust({ git, root, env, source: loaded.source, scope: loaded.scope, value: loaded.value, configured: configuredCount(loaded.merged) });
  const known = [...CHECK_IDS, ...loaded.merged.checks.map((entry) => entry.id),
    ...loaded.merged.generated.filter((row) => row.layer === 'repo').map((row) => row.id)];
  const skilledDir = realpathOrSelf(path.resolve(declHub, '..', '..'));
  // The OpenCode plugins live in .opencode/plugins beside .skilled/, and they are still the
  // hub's own code. A path that holds the hub would claim the whole repository, so it is
  // not read as one.
  const hubPlugins = realpathOrSelf(path.join(skilledDir, '..', '.opencode', 'plugins'));
  return {
    options, env, table, defaults, declHub, git, root, cwd: realCwd,
    merged: loaded.merged,
    config: configSummary(loaded, trust),
    configLoaded: loaded,
    only: checkIdSet(options.only, known),
    skip: checkIdSet(options.skip, known) || new Set(),
    rootReal: realpathOrSelf(root),
    skilledDir,
    hubPluginsDir: qualityConfig.isInside(skilledDir, hubPlugins) ? null : hubPlugins,
    // spawnSync reads a deadline of 0 as none, so a tiny value rounds up to 1 ms.
    timeoutMs: Math.max(1, Math.round(options.timeoutSec * 1000)),
    python: findTool('python3', env),
    bash: findTool('bash', env),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. GIT READS
// ─────────────────────────────────────────────────────────────────────────────

function gitValue(context, args, cwd) {
  const env = { ...context.env };
  for (const key of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_COMMON_DIR', 'GIT_INDEX_FILE']) if (cwd) delete env[key];
  const result = runGit(args, { cwd: cwd || context.root, env });
  return result.ok ? result.stdout.trim() : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. SCOPE
// ─────────────────────────────────────────────────────────────────────────────

function gitOrThrow(context, args) {
  const result = runGit(args, { cwd: context.root, env: context.env });
  if (!result.ok) throw new GateError('GIT_FAILED', `git ${args[0]} failed: ${(result.stderr || result.error || '').trim().split('\n')[0]}`);
  return result.stdout;
}

function headOrEmptyTree(context) {
  const head = runGit(['rev-parse', '--verify', '-q', 'HEAD^{commit}'], { cwd: context.root, env: context.env });
  return head.ok ? head.stdout.trim() : EMPTY_TREE;
}

function diffHunks(context, base, paths) {
  if (paths && paths.length === 0) return new Map();
  const args = ['diff', '-U0', '-M', '--diff-filter=ACMR', '--no-color', '--no-ext-diff', '--no-textconv',
    '--src-prefix=a/', '--dst-prefix=b/', base];
  return parseDiffHunks(gitOrThrow(context, paths ? [...args, '--', ...paths] : args));
}

function nulList(text) {
  return text.split('\0').filter(Boolean);
}

// Git refuses a path below a symlinked folder, and such a file is not this
// repository's tracked content anyway, so it is read as new.
function belowSymlink(root, rel) {
  const parts = rel.split('/');
  let current = root;
  for (const part of parts.slice(0, -1)) {
    current = path.join(current, part);
    try {
      if (fs.lstatSync(current).isSymbolicLink()) return true;
    } catch {
      return false;
    }
  }
  return false;
}

function namedFiles(context, names) {
  const seen = new Map();
  for (const name of names) {
    const abs = path.resolve(context.cwd, name);
    let stat = null;
    try {
      stat = fs.statSync(abs);
    } catch {
      stat = null;
    }
    if (!stat || !stat.isFile()) throw new GateError('FILE_NOT_FOUND', `${name} is not an existing regular file`);
    const rel = toPosix(path.relative(context.root, abs));
    if (rel === '' || rel.startsWith('..') || path.isAbsolute(rel)) {
      throw new GateError('FILE_OUTSIDE_ROOT', `${name} lies outside ${context.root}`);
    }
    seen.set(rel, abs);
  }
  return [...seen.entries()].map(([rel, abs]) => ({ rel, abs }));
}

// The untracked side of a scope is one git tree walk and the largest cost of a run, so
// a run takes it once, before any check starts, and hands the same list to the guard. A
// named-file scope takes none of it here, because the files it was asked to check are
// hashed by name, and each guard window lists the folders those files sit in instead.
function untrackedListing(context) {
  if (!context.git || context.options.scope === 'files') return null;
  return nulList(gitOrThrow(context, ['ls-files', '--others', '--exclude-standard', '-z']));
}

// The folders a scope reaches, folded so one pathspec covers a subtree. The guard lists
// again inside them, because a path a check creates while it runs is in no listing taken
// before it, and a walk over these folders is what keeps that write visible without
// paying for the whole tree. A write outside them stays outside the watch.
function scopeFolders(files) {
  const dirs = new Set();
  for (const rel of files) dirs.add(path.posix.dirname(rel));
  if (dirs.has('.')) return ['.'];
  const kept = [];
  for (const dir of [...dirs].sort()) {
    if (kept.some((outer) => dir === outer || dir.startsWith(`${outer}/`))) continue;
    kept.push(dir);
  }
  return kept;
}

function collectScope(context, listing) {
  const { options } = context;
  if (options.scope === 'files') {
    const named = namedFiles(context, options.files);
    if (!context.git) return { base: null, mergeBase: null, files: named.map((file) => ({ ...file, changed: 'all' })) };
    const safe = named.filter((file) => !belowSymlink(context.root, file.rel)).map((file) => file.rel);
    const tracked = new Set(safe.length ? nulList(gitOrThrow(context, ['ls-files', '-z', '--', ...safe])) : []);
    const hunks = diffHunks(context, headOrEmptyTree(context), [...tracked]);
    return {
      base: null,
      mergeBase: null,
      files: named.map((file) => ({ ...file, changed: tracked.has(file.rel) ? hunks.get(file.rel) || new Set() : 'all' })),
    };
  }
  let base = headOrEmptyTree(context);
  let mergeBase = null;
  if (options.scope === 'base') {
    const found = runGit(['merge-base', options.base, 'HEAD'], { cwd: context.root, env: context.env });
    if (!found.ok) throw new GateError('BASE_NOT_FOUND', `no merge base between ${options.base} and HEAD`);
    mergeBase = found.stdout.trim();
    base = mergeBase;
  }
  const names = nulList(gitOrThrow(context, ['diff', '--name-only', '-z', '-M', '--diff-filter=ACMR', '--no-ext-diff', base]));
  const untracked = listing || [];
  const hunks = diffHunks(context, base, null);
  const files = new Map();
  for (const rel of names) files.set(rel, hunks.get(rel) || new Set());
  for (const rel of untracked) files.set(rel, 'all');
  return {
    base: options.scope === 'base' ? options.base : null,
    mergeBase,
    files: [...files.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([rel, changed]) => ({ rel, abs: path.join(context.root, rel), changed })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  buildContext, checkTrust, collectScope, gitValue, namedFiles, noTrust, scopeFolders, untrackedListing,
};
