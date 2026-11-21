// ───────────────────────────────────────────────────────────────────
// MODULE: Overlay Engine Next-Line Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// A refusal's first line is what a consumer matches on, so it stays as it was;
// its Next line is a command a reader pastes, so it carries quoted absolute paths
// and the folder to run the engine from, and works from any working folder.

const assert = require('node:assert/strict');
const { execFileSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const engine = require('../overlay-engine.cjs');
const {
  createSyncFixture,
  createWorkspace,
  runEngine,
  writeFile,
  writeManifest,
} = require('./overlay-engine-fixtures.cjs');

const ENGINE = 'node .skilled/commands/doctor/scripts/overlay-engine.cjs';

// The quoting the engine promises: bare when the path is plain, otherwise in
// double quotes with the shell's special characters escaped.
function quoted(value) {
  return /^[A-Za-z0-9._\/-]+$/.test(value) ? value : '"' + value.replace(/(["\\$`])/g, '\\$1') + '"';
}

function createFixture(t, overlays, layoutLinks = []) {
  const fixture = createWorkspace(t, 'overlay-engine-next-');
  writeFile(fixture.overlayDir, 'bundle/a.md', 'bundle a\n');
  writeFile(fixture.overlayDir, 'files/tool.md', 'tool file\n');
  writeFile(fixture.tree, 'target/inside.md', 'link target\n');
  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', commit: 'pin-one' },
    layoutLinks,
    overlays,
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  fixture.run = (args) => runEngine([...args, '--root', fixture.tree], fixture.workspace);
  return fixture;
}

test('an unowned folder in the way names a quoted absolute mv and the folder to rerun apply from', (t) => {
  const fixture = createFixture(t, [{ id: 'tool', scope: 'file', source: 'files/tool.md', destination: 'my tool' }]);
  writeFile(fixture.tree, 'my tool/project.md', 'project file\n');
  const result = fixture.run(['apply']);
  assert.notEqual(result.code, 0, result.output);
  const moved = path.join(fixture.tree, 'my tool');
  const expected = `  Next: mv -n ${quoted(moved)} ${quoted(moved + '.keep')}, then from ${quoted(fixture.tree)}: ${ENGINE} apply`;
  assert.ok(result.output.split('\n').includes(expected), result.output);
});

// A name already set aside is never the one the line moves to, and the move
// itself never replaces what stands at its destination, so pasting the line
// twice keeps every copy.
test('a keep-aside line skips a name already taken and running it twice overwrites nothing', (t) => {
  const fixture = createFixture(t, [{ id: 'tool', scope: 'file', source: 'files/tool.md', destination: 'my tool' }]);
  writeFile(fixture.tree, 'my tool/project.md', 'project file\n');
  writeFile(fixture.tree, 'my tool.keep', 'set aside before\n');
  const result = fixture.run(['apply']);
  assert.equal(result.code, 1, result.output);
  const moved = path.join(fixture.tree, 'my tool');
  const move = `mv -n ${quoted(moved)} ${quoted(moved + '.keep.1')}`;
  assert.ok(result.output.split('\n').includes(`  Next: ${move}, then from ${quoted(fixture.tree)}: ${ENGINE} apply`), result.output);
  execFileSync('/bin/sh', ['-c', move]);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'my tool.keep'), 'utf8'), 'set aside before\n');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'my tool.keep.1', 'project.md'), 'utf8'), 'project file\n');
  writeFile(fixture.tree, 'my tool/project.md', 'a second project file\n');
  spawnSync('/bin/sh', ['-c', move]);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'my tool.keep'), 'utf8'), 'set aside before\n');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'my tool.keep.1', 'project.md'), 'utf8'), 'project file\n');
  // A second run moves the new folder into the set-aside one or leaves it, and
  // either way replaces nothing.
  const second = [path.join(fixture.tree, 'my tool', 'project.md'), path.join(fixture.tree, 'my tool.keep.1', 'my tool', 'project.md')]
    .filter((filePath) => fs.existsSync(filePath));
  assert.deepEqual(second.map((filePath) => fs.readFileSync(filePath, 'utf8')), ['a second project file\n']);
});

test('a folder where a layout link belongs keeps its first line and names a quoted absolute mv', (t) => {
  const fixture = createFixture(t, [], [{ path: 'my link', target: 'target' }]);
  writeFile(fixture.tree, 'my link/project.md', 'project file\n');
  const result = fixture.run(['apply']);
  assert.notEqual(result.code, 0, result.output);
  const lines = result.output.split('\n');
  const first = lines.findIndex((line) => line.includes('exists but is not the link to'));
  assert.ok(first >= 0, result.output);
  assert.ok(lines[first].endsWith('my link exists but is not the link to target'), result.output);
  const moved = path.join(fixture.tree, 'my link');
  const expected = `  Next: mv -n ${quoted(moved)} ${quoted(moved + '.keep')}, then from ${quoted(fixture.tree)}: ${ENGINE} apply`;
  assert.ok(lines.includes(expected), result.output);
});

test('a folder that replaced an engine-made link before its retarget keeps its first line and names a quoted absolute mv', (t) => {
  const fixture = createFixture(t, []);
  writeFile(fixture.tree, 'my link/project.md', 'project file\n');
  let error = null;
  try {
    engine.applyLayoutLink(fixture.tree, { path: 'my link', target: 'target' }, true);
  } catch (caught) {
    error = caught;
  }
  assert.ok(error, 'the retarget must refuse a real folder');
  const lines = error.message.split('\n');
  assert.equal(lines[0], 'my link is no longer the link this engine made; refusing to replace it');
  const moved = path.join(fixture.tree, 'my link');
  const expected = `  Next: mv -n ${quoted(moved)} ${quoted(moved + '.keep')}, then from ${quoted(fixture.tree)}: ${ENGINE} apply`;
  assert.ok(lines.includes(expected), error.message);
  assert.equal(fs.readFileSync(path.join(moved, 'project.md'), 'utf8'), 'project file\n');
});

test('a re-pin path below a linked folder keeps its first line and names a quoted absolute mv', (t) => {
  const fixture = createFixture(t, []);
  writeFile(fixture.tree, 'elsewhere/kept.md', 'kept\n');
  fs.symlinkSync('elsewhere', path.join(fixture.tree, 'my hub'));
  const lines = engine.treeShapeProblems(fixture.tree, { copy: ['my hub/new.md'], delete: [] });
  assert.equal(lines.length, 1);
  const parts = lines[0].split('\n');
  assert.equal(parts[0], 'refuse: my hub/new.md sits below my hub, which the tree holds as a link');
  const moved = path.join(fixture.tree, 'my hub');
  assert.equal(parts[2], `  Next: mv -n ${quoted(moved)} ${quoted(moved + '.keep')}, then rerun the re-pin`);
  assert.equal(parts[3], '  or, to keep it where it is: add "my hub/new.md" to repin.exclude in overlay-manifest.json, then rerun the re-pin');
});

test('the first line of a state file of an unsupported shape is the line it always was', (t) => {
  const fixture = createSyncFixture(t);
  assert.equal(fixture.run(['apply']).code, 0);
  const statePath = engine.createContext(fixture.tree).statePath;
  const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
  state.links = [];
  fs.writeFileSync(statePath, JSON.stringify(state));
  const status = fixture.run(['status']);
  assert.equal(status.code, 2, status.output);
  const lines = status.output.split('\n');
  const first = lines.findIndex((line) => line.includes('has an unsupported shape'));
  assert.ok(lines[first].endsWith(' sync-state.json has an unsupported shape'), status.output);
  assert.match(lines[first + 1], /^ {2}its links field is not a map of link targets/);
});

test('the first line of a capture whose overlay copy is gone is the line it always was', (t) => {
  const fixture = createFixture(t, [{ id: 'tool', scope: 'file', source: 'files/tool.md', destination: 'tool' }]);
  assert.equal(fixture.run(['apply']).code, 0);
  fs.rmSync(path.join(fixture.overlayDir, 'files/tool.md'));
  const captured = fixture.run(['apply', '--capture', 'tool']);
  assert.notEqual(captured.code, 0, captured.output);
  assert.equal(captured.stdout.split('\n')[0], 'tool: canonical source is missing: files/tool.md', captured.output);
});

test('an unknown json operation keeps its first line and lists the operations on the line under it', () => {
  assert.throws(() => engine.applyJsonOperations('{}\n', { operations: [{ op: 'x' }] }, {}), (error) => {
    const lines = error.message.split('\n');
    assert.equal(lines[0], 'unknown operation "x"');
    assert.match(lines[1], /^ {2}\S.*setKeyOnItem/);
    return true;
  });
});

test('a stuck Python cache folder with a space in its path names a quoted absolute chmod and rm', (t) => {
  if (typeof process.getuid === 'function' && process.getuid() === 0) {
    t.skip('root ignores folder permissions');
    return;
  }
  const fixture = createSyncFixture(t);
  for (const base of [fixture.overlayDir + '/directory-source', fixture.tree + '/directory-live']) {
    writeFile(base, 'my sub/a.py', 'print("a")\n');
    writeFile(base, 'my sub/inner/b.py', 'print("b")\n');
  }
  assert.equal(fixture.run(['apply']).code, 0);
  const cacheDir = path.join(fixture.tree, 'directory-live/my sub/inner/__pycache__');
  writeFile(fixture.tree, 'directory-live/my sub/inner/__pycache__/b.cpython-39.pyc', 'cache\n');
  fs.rmSync(path.join(fixture.overlayDir, 'directory-source/my sub'), { recursive: true });
  fs.chmodSync(cacheDir, 0o555);
  try {
    const applied = fixture.run(['apply']);
    assert.equal(applied.code, 0, applied.output);
    const folder = quoted(path.join(fixture.tree, 'directory-live/my sub/inner'));
    assert.ok(applied.stdout.split('\n').includes(`  Next: chmod -R u+w ${folder} && rm -r ${folder}`), applied.output);
  } finally {
    fs.chmodSync(cacheDir, 0o755);
  }
});
