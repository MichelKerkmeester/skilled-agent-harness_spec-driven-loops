// ───────────────────────────────────────────────────────────────────
// MODULE: Overlay Engine Python Cache Skip Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Python writes a bytecode cache beside every script it runs, so one turns up on
// either side of a folder entry without anyone asking for it. These tests pin
// that a cache is never shipped, deleted, captured, adopted or reported as drift.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { spawnSync } = require('node:child_process');

const {
  createSyncFixture,
  createWorkspace,
  readJson,
  runEngine,
  sha256,
  writeFile,
  writeManifest,
} = require('./overlay-engine-fixtures.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CACHE_BYTES = Buffer.from([0x61, 0x0d, 0x0d, 0x0a, 0x00, 0x01, 0x02, 0x03]);
const GIT_CONFIG = [
  '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid',
  '-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=/dev/null', '-c', 'init.defaultBranch=main',
  '-c', 'core.excludesFile=/dev/null',
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function isCacheKey(key) {
  return key.split('/').includes('__pycache__') || /\.py[co]$/.test(key);
}

function git(cwd, args) {
  const result = spawnSync('git', [...GIT_CONFIG, '-C', cwd, ...args], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error('git ' + args.join(' ') + ': ' + result.stderr);
  return result.stdout.trim();
}

// Every file below a folder, keyed by its posix path relative to that folder.
function filesBelow(dir) {
  const found = [];
  const pending = [''];
  while (pending.length > 0) {
    const relative = pending.pop();
    for (const dirent of fs.readdirSync(path.join(dir, relative), { withFileTypes: true })) {
      const child = relative ? relative + '/' + dirent.name : dirent.name;
      if (dirent.isDirectory()) pending.push(child);
      else found.push(child);
    }
  }
  return found.sort();
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('apply ships no Python cache out of a directory or skill-root source, and records none', (t) => {
  const fixture = createSyncFixture(t);
  writeFile(fixture.overlayDir, 'directory-source/__pycache__/check.cpython-39.pyc', CACHE_BYTES);
  writeFile(fixture.overlayDir, 'directory-source/stray.pyc', CACHE_BYTES);
  writeFile(fixture.overlayDir, 'directory-source/optimized.pyo', CACHE_BYTES);
  writeFile(fixture.overlayDir, 'skill-root-source/docs/__pycache__/tool.cpython-39.pyc', CACHE_BYTES);

  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  assert.deepEqual(filesBelow(path.join(fixture.tree, 'directory-live')), ['readme.md']);
  assert.equal(fs.existsSync(path.join(fixture.tree, 'skill/docs/__pycache__')), false);
  const recorded = Object.keys(readJson(fixture.statePath).files).filter(isCacheKey);
  assert.deepEqual(recorded, []);

  const status = fixture.run(['status']);
  assert.equal(status.code, 0, status.output);
  assert.match(status.stdout, /RESULT: PASSED/);
});

test('a live Python cache in a folder destination survives apply, reads as no drift, and is neither owned nor captured', (t) => {
  const fixture = createSyncFixture(t);
  const liveCaches = [
    'directory-live/__pycache__/check.cpython-39.pyc',
    'directory-live/stray.pyc',
    'skill/docs/__pycache__/tool.cpython-39.pyc',
  ];
  for (const key of liveCaches) writeFile(fixture.tree, key, CACHE_BYTES);

  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  for (const key of liveCaches) assert.deepEqual(fs.readFileSync(path.join(fixture.tree, key)), CACHE_BYTES, key);

  const status = fixture.run(['status']);
  assert.equal(status.code, 0, status.output);
  assert.match(status.stdout, /RESULT: PASSED/);
  assert.doesNotMatch(status.stdout, /__pycache__|\.pyc/);

  const guard = fixture.run(['--guard', path.join(fixture.tree, 'directory-live/__pycache__/check.cpython-39.pyc')]);
  assert.equal(guard.code, 0, guard.output);
  const captured = fixture.run(['apply', '--capture', 'directory-live/__pycache__/check.cpython-39.pyc']);
  assert.notEqual(captured.code, 0, captured.output);
  assert.equal(fs.existsSync(path.join(fixture.overlayDir, 'directory-source/__pycache__')), false);
});

test('a sync state that records a shipped Python cache converges: the cache stays, the record drops, a second apply is a no-op', (t) => {
  const fixture = createSyncFixture(t);
  assert.equal(fixture.run(['apply']).code, 0);
  // The record an engine that shipped caches left behind: the live copy it
  // wrote, hashed in the state, with the overlay source since cleaned of it.
  const staleKey = 'directory-live/__pycache__/old.cpython-39.pyc';
  writeFile(fixture.tree, staleKey, CACHE_BYTES);
  const state = readJson(fixture.statePath);
  state.files[staleKey] = sha256(CACHE_BYTES);
  fs.writeFileSync(fixture.statePath, JSON.stringify(state, null, 2) + '\n');

  const status = fixture.run(['status']);
  assert.equal(status.code, 0, status.output);
  assert.match(status.stdout, /RESULT: PASSED/);

  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  assert.deepEqual(fs.readFileSync(path.join(fixture.tree, staleKey)), CACHE_BYTES);
  assert.equal(Object.prototype.hasOwnProperty.call(readJson(fixture.statePath).files, staleKey), false);

  const stateAfter = fs.readFileSync(fixture.statePath);
  const again = fixture.run(['apply']);
  assert.equal(again.code, 0, again.output);
  assert.match(again.stdout, /^0 changed$/m);
  assert.deepEqual(fs.readFileSync(fixture.statePath), stateAfter);
});

test('adopt of a live folder carries no Python cache into the overlay folder and leaves the live cache alone', (t) => {
  const fixture = createWorkspace(t, 'overlay-engine-cache-adopt-');
  const { workspace, tree, overlayDir } = fixture;
  const upstream = path.join(workspace, 'upstream');
  fs.mkdirSync(upstream);
  git(upstream, ['init', '-q']);
  writeFile(upstream, '.skilled/skills/hub/SKILL.md', 'hub skill\n');
  git(upstream, ['add', '-A']);
  git(upstream, ['commit', '-q', '-m', 'upstream']);
  const commit = git(upstream, ['rev-parse', 'HEAD']);

  writeFile(tree, '.skilled/skills/hub/SKILL.md', 'hub skill\n');
  writeFile(tree, '.skilled/skills/brand/SKILL.md', 'brand skill\n');
  writeFile(tree, '.skilled/skills/brand/__pycache__/check.cpython-39.pyc', CACHE_BYTES);
  writeFile(tree, '.skilled/skills/brand/stray.pyc', CACHE_BYTES);
  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', checkout: upstream, commit },
    layoutLinks: [],
    overlays: [],
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  const run = (args) => runEngine([...args, '--root', tree], tree);

  const adopted = run(['apply', '--adopt', '.skilled/skills/brand']);
  assert.equal(adopted.code, 0, adopted.output);
  assert.deepEqual(filesBelow(path.join(overlayDir, 'framework/skills/brand')), ['SKILL.md']);
  assert.deepEqual(fs.readFileSync(path.join(tree, '.skilled/skills/brand/__pycache__/check.cpython-39.pyc')), CACHE_BYTES);
  assert.deepEqual(fs.readFileSync(path.join(tree, '.skilled/skills/brand/stray.pyc')), CACHE_BYTES);

  const status = run(['status']);
  assert.equal(status.code, 0, status.output);
  assert.match(status.stdout, /RESULT: PASSED/);
});

// A folder the entry stops shipping must go whole, cache included, or a later
// source that reuses its name as a file can never be applied.
test('a directory entry that stops shipping a folder removes it with its Python cache and keeps the cache of a folder it still ships', (t) => {
  const fixture = createSyncFixture(t);
  for (const base of [fixture.overlayDir + '/directory-source', fixture.tree + '/directory-live']) {
    writeFile(base, 'sub/a.py', 'print("a")\n');
    writeFile(base, 'keep/b.py', 'print("b")\n');
  }
  assert.equal(fixture.run(['apply']).code, 0);
  writeFile(fixture.tree, 'directory-live/sub/__pycache__/a.cpython-39.pyc', CACHE_BYTES);
  writeFile(fixture.tree, 'directory-live/keep/__pycache__/b.cpython-39.pyc', CACHE_BYTES);
  fs.rmSync(path.join(fixture.overlayDir, 'directory-source/sub'), { recursive: true });

  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  assert.equal(fs.existsSync(path.join(fixture.tree, 'directory-live/sub')), false);
  assert.deepEqual(fs.readFileSync(path.join(fixture.tree, 'directory-live/keep/__pycache__/b.cpython-39.pyc')), CACHE_BYTES);

  writeFile(fixture.overlayDir, 'directory-source/sub', 'now a file\n');
  const reused = fixture.run(['apply']);
  assert.equal(reused.code, 0, reused.output);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'directory-live/sub'), 'utf8'), 'now a file\n');
});

test('a skill-root entry removes a removed or no longer replaced folder with its Python cache and keeps the cache of a folder it still ships', (t) => {
  const fixture = createSyncFixture(t);
  writeFile(fixture.overlayDir, 'skill-root-source/docs/old/gone.py', 'print("gone")\n');
  assert.equal(fixture.run(['apply']).code, 0);
  fixture.manifest.overlays.find((entry) => entry.id === 'skill-root').remove = ['legacy'];
  writeManifest(fixture);
  fs.rmSync(path.join(fixture.overlayDir, 'skill-root-source/docs/old'), { recursive: true });
  writeFile(fixture.tree, 'skill/legacy/tool.py', 'print("legacy")\n');
  writeFile(fixture.tree, 'skill/legacy/__pycache__/tool.cpython-39.pyc', CACHE_BYTES);
  writeFile(fixture.tree, 'skill/docs/old/__pycache__/gone.cpython-39.pyc', CACHE_BYTES);
  writeFile(fixture.tree, 'skill/docs/__pycache__/kept.cpython-39.pyc', CACHE_BYTES);

  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  assert.equal(fs.existsSync(path.join(fixture.tree, 'skill/legacy')), false);
  assert.equal(fs.existsSync(path.join(fixture.tree, 'skill/docs/old')), false);
  assert.deepEqual(fs.readFileSync(path.join(fixture.tree, 'skill/docs/__pycache__/kept.cpython-39.pyc')), CACHE_BYTES);
});

test('status --audit asks no README of a Python cache folder in the overlay folder', (t) => {
  const fixture = createSyncFixture(t);
  writeFile(fixture.overlayDir, 'directory-source/__pycache__/check.cpython-39.pyc', CACHE_BYTES);

  const audit = fixture.run(['status', '--audit']);
  const missing = audit.stdout.split('\n').filter((line) => line.startsWith('DOCS     missing-readme'));
  assert.ok(missing.some((line) => line.endsWith('/directory-source')), audit.stdout);
  assert.deepEqual(missing.filter((line) => line.includes('__pycache__')), []);
});
