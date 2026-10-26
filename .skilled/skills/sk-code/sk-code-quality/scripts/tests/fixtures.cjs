// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Gate Runner Fixtures
// ───────────────────────────────────────────────────────────────────
'use strict';

// Each fixture is a throwaway git repository built from quoted strings, so a test
// reads the exact bytes it seeds. The snapshot covers the whole fixture folder, git
// metadata included, and the runner's own scripts folder, because the runner promises
// to write no file anywhere a check could reach.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const SCRIPTS_DIR = path.resolve(__dirname, '..');
const QUALITY_ROOT = path.resolve(SCRIPTS_DIR, '..');
const RUNNER = path.join(SCRIPTS_DIR, 'quality-gate.cjs');
const HUB_ROOT = path.resolve(SCRIPTS_DIR, '..', '..');
const REPO_ROOT = path.resolve(HUB_ROOT, '..', '..', '..');
const HUB_OVERRIDE_ENV = 'SK_CODE_QUALITY_HUB_ROOT';
// A fixture commit may start a detached auto-maintenance that writes a lock under
// .git/objects while a case is snapshotting, so the fixture's own git never runs it.
const IDENTITY = Object.freeze([
  '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid',
  '-c', 'commit.gpgsign=false', '-c', 'init.defaultBranch=main',
  '-c', 'maintenance.auto=false', '-c', 'gc.auto=0',
]);
const STUB_CHECKLIST = '# Fixture checklist\n\nA stand-in for a declared checklist.\n';

// A declared generated path sits in a build output folder no fixture owns, and a
// freshness check writes its cache record beside the entry it verifies. Those folders
// are snapshot roots too, so a write there is visible to a case. Only a folder that
// holds a declared path is walked, and a nested one is dropped because its parent
// already covers it.
const GENERATED_ROOTS = Object.freeze([...new Set(JSON.parse(fs.readFileSync(
  path.join(QUALITY_ROOT, 'assets', 'quality-defaults.json'), 'utf8',
)).generated.flatMap((row) => row.paths || []).map((rel) => path.dirname(path.join(REPO_ROOT, rel))))]
  .sort((left, right) => left.length - right.length)
  .filter((dir, index, dirs) => fs.existsSync(dir)
    && !dirs.slice(0, index).some((outer) => dir.startsWith(`${outer}${path.sep}`))));

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// A test that runs inside a git hook inherits that hook's GIT_DIR and index, and
// the operator's global config can name hooks or a monitor. Every git variable is
// dropped, the global and system config files are hidden, and discovery stops at
// the fixture folder, so a fixture with no .git never finds the repository above it.
function fixtureEnv(parent) {
  const env = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith('GIT_') || key === HUB_OVERRIDE_ENV) continue;
    env[key] = value;
  }
  return {
    ...env,
    GIT_CONFIG_GLOBAL: '/dev/null',
    GIT_CONFIG_NOSYSTEM: '1',
    GIT_CEILING_DIRECTORIES: parent,
    GIT_CONFIG_COUNT: '1',
    GIT_CONFIG_KEY_0: 'core.fsmonitor',
    GIT_CONFIG_VALUE_0: 'false',
  };
}

function writeTree(root, files) {
  for (const [rel, content] of Object.entries(files)) {
    const file = path.join(root, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
  }
}

function runGit(root, env, args) {
  const result = spawnSync('git', [...IDENTITY, ...args], { cwd: root, env, encoding: 'utf8' });
  assert.equal(result.status, 0, `git ${args.join(' ')} failed: ${result.stderr}`);
  return result.stdout;
}

// A copy of the live registry with a stub at every checklist path it declares, so
// a fixture can point the runner's declarations somewhere it controls.
function writeHub(dir) {
  const registry = JSON.parse(fs.readFileSync(path.join(HUB_ROOT, 'mode-registry.json'), 'utf8'));
  const files = { 'mode-registry.json': `${JSON.stringify(registry, null, 2)}\n` };
  for (const mode of registry.modes) {
    for (const row of (mode.quality && mode.quality.checklists) || []) files[row.file] = STUB_CHECKLIST;
  }
  writeTree(dir, files);
  return dir;
}

// A rewrite that reproduces the bytes still moves the modification time, so the stamp
// is part of every entry, and a folder whose entries were replaced is visible too.
function describeEntry(file) {
  const stat = fs.lstatSync(file);
  if (stat.isSymbolicLink()) return `link:${stat.mtimeMs}:${fs.readlinkSync(file)}`;
  if (stat.isDirectory()) return `dir:${stat.mode}:${stat.mtimeMs}`;
  if (!stat.isFile()) return `other:${stat.mode}:${stat.mtimeMs}`;
  return `file:${stat.mode}:${stat.mtimeMs}:${crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')}`;
}

function snapshotTree(roots) {
  const entries = new Map();
  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      const file = path.join(dir, name);
      entries.set(file, describeEntry(file));
      if (fs.lstatSync(file).isDirectory()) walk(file);
    }
  };
  for (const root of roots) walk(root);
  return entries;
}

function changedEntries(before, after) {
  const keys = new Set([...before.keys(), ...after.keys()]);
  return [...keys].filter((key) => before.get(key) !== after.get(key)).sort();
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. FIXTURE BUILDER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build a fixture repository under the system temp folder.
 *
 * @param {Object} [options] - base files committed first, change files written after
 *   the commit, links and modes applied last, git false for a plain folder, and hub
 *   'sibling', 'inside' or 'real' for where the runner reads its declarations.
 * @returns {Object} root, parent, hub, env, run(args, {env, cwd}), git(args),
 *   write(files) and cleanup().
 */
function buildRepo({ base = {}, change = {}, links = {}, modes = {}, git = true, hub = 'sibling' } = {}) {
  const parent = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'skq-')));
  const root = path.join(parent, 'repo');
  fs.mkdirSync(root);
  const env = fixtureEnv(parent);
  let hubRoot = null;
  if (hub === 'sibling') hubRoot = writeHub(path.join(parent, 'hub', 'skills', 'sk-code'));
  if (hub === 'inside') hubRoot = writeHub(path.join(root, '.skilled', 'skills', 'sk-code'));
  writeTree(root, base);
  if (git) {
    runGit(root, env, ['init', '-q']);
    runGit(root, env, ['add', '-A']);
    runGit(root, env, ['commit', '-q', '--no-verify', '--allow-empty', '-m', 'base']);
  }
  writeTree(root, change);
  for (const [rel, target] of Object.entries(links)) {
    const file = path.join(root, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.symlinkSync(target, file);
  }
  for (const [rel, mode] of Object.entries(modes)) fs.chmodSync(path.join(root, rel), mode);

  const run = (args, { env: extra = {}, cwd = root } = {}) => {
    const childEnv = { ...env };
    if (hubRoot) childEnv[HUB_OVERRIDE_ENV] = hubRoot;
    for (const [key, value] of Object.entries(extra)) {
      if (value === undefined) delete childEnv[key];
      else childEnv[key] = value;
    }
    const result = spawnSync(process.execPath, [RUNNER, ...args], { cwd, env: childEnv, encoding: 'utf8' });
    let verdict = null;
    try {
      verdict = JSON.parse(result.stdout);
    } catch {
      verdict = null;
    }
    return { status: result.status, stdout: result.stdout, stderr: result.stderr, verdict };
  };

  return {
    root,
    parent,
    hub: hubRoot,
    env,
    run,
    git: (args) => runGit(root, env, args),
    write: (files) => writeTree(root, files),
    cleanup: () => fs.rmSync(parent, { recursive: true, force: true }),
  };
}

// A fixture whose committed checks should run vouches for them the way the operator of a
// third-party repository would, so the case keeps testing what it tested.
function trustRepoChecks(repo) {
  repo.git(['config', '--local', 'skilled.trustRepoChecks', 'true']);
  return repo;
}

/**
 * Run fn and fail when any file under the fixture folder, the runner's scripts folder
 * or a folder that holds a declared generated path was created, changed or removed.
 *
 * @param {Object} repo - A fixture from buildRepo.
 * @param {Function} fn - The work to observe.
 * @returns {*} What fn returned.
 */
function assertSnapshotUnchanged(repo, fn) {
  const roots = [repo.parent, SCRIPTS_DIR, ...GENERATED_ROOTS];
  const before = snapshotTree(roots);
  const value = fn();
  assert.deepEqual(changedEntries(before, snapshotTree(roots)), [], 'the run changed files on disk');
  return value;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { REPO_ROOT, assertSnapshotUnchanged, buildRepo, trustRepoChecks };
