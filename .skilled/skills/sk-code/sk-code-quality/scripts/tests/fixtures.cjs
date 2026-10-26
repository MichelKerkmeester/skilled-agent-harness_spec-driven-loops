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
const RUNNER = path.join(SCRIPTS_DIR, 'quality-gate.cjs');
const HUB_ROOT = path.resolve(SCRIPTS_DIR, '..', '..');
const HUB_OVERRIDE_ENV = 'SK_CODE_QUALITY_HUB_ROOT';
const IDENTITY = Object.freeze([
  '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid',
  '-c', 'commit.gpgsign=false', '-c', 'init.defaultBranch=main',
]);
const STUB_CHECKLIST = '# Fixture checklist\n\nA stand-in for a declared checklist.\n';

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

function describeEntry(file) {
  const stat = fs.lstatSync(file);
  if (stat.isSymbolicLink()) return `link:${fs.readlinkSync(file)}`;
  if (stat.isDirectory()) return `dir:${stat.mode}`;
  if (!stat.isFile()) return `other:${stat.mode}`;
  return `file:${stat.mode}:${crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')}`;
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

/**
 * Run fn and fail when any file under the fixture folder or the runner's scripts
 * folder was created, changed or removed.
 *
 * @param {Object} repo - A fixture from buildRepo.
 * @param {Function} fn - The work to observe.
 * @returns {*} What fn returned.
 */
function assertSnapshotUnchanged(repo, fn) {
  const roots = [repo.parent, SCRIPTS_DIR];
  const before = snapshotTree(roots);
  const value = fn();
  assert.deepEqual(changedEntries(before, snapshotTree(roots)), [], 'the run changed files on disk');
  return value;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { assertSnapshotUnchanged, buildRepo };
