// ───────────────────────────────────────────────────────────────────
// MODULE: Overlay Engine Next-Line Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// A refusal's first line is what a consumer matches on, so it stays as it was;
// its Next line is a command a reader pastes, so it carries quoted absolute paths
// and the folder to run the engine from, and works from any working folder.

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { spawnSync } = require('node:child_process');

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
// single quotes, which stop every expansion, with an embedded quote as '\''.
function quoted(value) {
  return /^[A-Za-z0-9._\/-]+$/.test(value) ? value : "'" + value.replace(/'/g, "'\\''") + "'";
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

test('a printed path survives a shell round trip whatever characters it holds', () => {
  const paths = ['/plain/dir/file.md', '/a b/c', '/bang !dir/x', '/dollar $HOME/x', '/dq "x"/y',
    "/sq it's/x", '/tick `id`/x', '/back \\slash/x', "/all !$\"'`\\ mixed"];
  assert.equal(engine.shellPath('/plain/dir/file.md'), '/plain/dir/file.md');
  for (const value of paths) {
    const printed = spawnSync('sh', ['-c', 'printf %s ' + engine.shellPath(value)], { encoding: 'utf8' });
    assert.equal(printed.status, 0, printed.stderr);
    assert.equal(printed.stdout, value);
  }
});

test('a path with a bang is single-quoted in a keep-aside Next line, so an interactive shell does not expand it', (t) => {
  const fixture = createFixture(t, [{ id: 'tool', scope: 'file', source: 'files/tool.md', destination: 'my !dir/tool' }]);
  writeFile(fixture.tree, 'my !dir/tool/user.md', 'user work\n');
  assert.match(fixture.tree, /^[A-Za-z0-9._\/-]+$/);
  const result = fixture.run(['apply']);
  assert.notEqual(result.code, 0, result.output);
  const moved = `${fixture.tree}/my !dir/tool`;
  const expected = `  Next: mv '${moved}' '${moved}.keep', then from ${fixture.tree}: ${ENGINE} apply`;
  assert.ok(result.output.split('\n').includes(expected), result.output);
});

test('a layout link to a file names the move aside and the mkdir as one pasteable command', (t) => {
  const fixture = createFixture(t, [{ id: 'tool', scope: 'file', source: 'files/tool.md', destination: 'up/tool.md' }],
    [{ path: 'up', target: 'real' }]);
  writeFile(fixture.tree, 'real', 'a file where the folder belongs\n');
  assert.match(fixture.tree, /^[A-Za-z0-9._\/-]+$/);
  const result = fixture.run(['apply']);
  assert.notEqual(result.code, 0, result.output);
  const real = path.join(fixture.tree, 'real');
  assert.ok(result.output.includes(`Next: mv ${real} ${real}.keep && mkdir -p ${real}, or point the layout link up `),
    result.output);
});

test('an unowned folder in the way names a quoted absolute mv and the folder to rerun apply from', (t) => {
  const fixture = createFixture(t, [{ id: 'tool', scope: 'file', source: 'files/tool.md', destination: 'my tool' }]);
  writeFile(fixture.tree, 'my tool/project.md', 'project file\n');
  const result = fixture.run(['apply']);
  assert.notEqual(result.code, 0, result.output);
  const moved = path.join(fixture.tree, 'my tool');
  const expected = `  Next: mv ${quoted(moved)} ${quoted(moved + '.keep')}, then from ${quoted(fixture.tree)}: ${ENGINE} apply`;
  assert.ok(result.output.split('\n').includes(expected), result.output);
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
  const expected = `  Next: mv ${quoted(moved)} ${quoted(moved + '.keep')}, then from ${quoted(fixture.tree)}: ${ENGINE} apply`;
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
  const expected = `  Next: mv ${quoted(moved)} ${quoted(moved + '.keep')}, then from ${quoted(fixture.tree)}: ${ENGINE} apply`;
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
  assert.equal(parts[2], `  Next: mv ${quoted(moved)} ${quoted(moved + '.keep')}, then rerun the re-pin`);
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

test('a rollback line names a root with a space and a quote so a shell reads it back as that root', () => {
  const root = "/tmp/a b'c";
  const line = engine.rollbackCommand({ root }, '20261121T000000Z-abc123');
  const prefix = `rollback: ${ENGINE} repin --rollback 20261121T000000Z-abc123 --root `;
  assert.ok(line.startsWith(prefix), line);
  const printed = spawnSync('sh', ['-c', 'printf %s ' + line.slice(prefix.length)], { encoding: 'utf8' });
  assert.equal(printed.status, 0, printed.stderr);
  assert.equal(printed.stdout, root);
});

test('the capture fix for a live edit at a path with a space quotes that path', (t) => {
  const fixture = createSyncFixture(t);
  assert.equal(fixture.run(['apply']).code, 0);
  writeFile(fixture.tree, 'directory-live/my file.md', 'hand edit\n');
  const status = fixture.run(['status']);
  assert.equal(status.code, 1, status.output);
  assert.ok(status.output.includes(`fix: ${ENGINE} apply --capture 'directory-live/my file.md'`), status.output);
});

// A refusal reached from every command reruns the read-only check, and names
// the manifest by its quoted absolute path, so the line works from any folder.
function statusRerun(fixture) {
  return `then from ${quoted(fixture.tree)}: ${ENGINE} status`;
}

function manifestPath(fixture) {
  return quoted(engine.createContext(fixture.tree).manifestPath);
}

test('a state file of an unsupported shape is restored from HEAD, index and worktree both', (t) => {
  const fixture = createSyncFixture(t);
  assert.equal(fixture.run(['apply']).code, 0);
  const statePath = engine.createContext(fixture.tree).statePath;
  fs.writeFileSync(statePath, '[]');
  const status = fixture.run(['status']);
  assert.equal(status.code, 2, status.output);
  const expected = `  Next: restore the state file from git: git -C ${quoted(fixture.tree)} restore --source=HEAD --staged --worktree -- ` +
    quoted(path.relative(fixture.tree, statePath));
  assert.ok(status.output.split('\n').includes(expected), status.output);
});

test('a capture whose overlay copy is gone restores that copy from HEAD, index and worktree both', (t) => {
  const fixture = createFixture(t, [{ id: 'tool', scope: 'file', source: 'files/tool.md', destination: 'tool' }]);
  assert.equal(fixture.run(['apply']).code, 0);
  fs.rmSync(path.join(fixture.overlayDir, 'files/tool.md'));
  const captured = fixture.run(['apply', '--capture', 'tool']);
  assert.notEqual(captured.code, 0, captured.output);
  const source = path.join(fixture.overlayDir, 'files/tool.md');
  assert.ok(captured.output.includes(`  Next: restore the overlay copy (git -C ${quoted(fixture.tree)} restore --source=HEAD ` +
    `--staged --worktree -- ${quoted(path.relative(fixture.tree, source))}) or copy tool to ${quoted(source)}`), captured.output);
});

test('two overlays on one destination name the quoted manifest and the status rerun', (t) => {
  const fixture = createFixture(t, [
    { id: 'one', scope: 'file', source: 'files/tool.md', destination: 'tool' },
    { id: 'two', scope: 'file', source: 'bundle/a.md', destination: 'tool' },
  ]);
  const status = fixture.run(['status']);
  assert.equal(status.code, 2, status.output);
  const expected = `  Next: keep tool in one of those two entries in ${manifestPath(fixture)}, ${statusRerun(fixture)}`;
  assert.ok(status.output.split('\n').includes(expected), status.output);
});

test('a protectedPaths refusal names the quoted manifest and the status rerun', (t) => {
  const cases = [
    ['../outside.txt', 'write it in MANIFEST as a path relative to entry bundle, such as "config/token.txt", '],
    ['.env.local', 'remove it from protectedPaths of entry bundle in MANIFEST (a .env file is refused without it), '],
  ];
  for (const [value, next] of cases) {
    const fixture = createFixture(t, [{ id: 'bundle', scope: 'directory', source: 'bundle', destination: 'bundle-live',
      protectedPaths: [value] }]);
    const status = fixture.run(['status']);
    assert.equal(status.code, 2, status.output);
    const expected = '  Next: ' + next.replace('MANIFEST', manifestPath(fixture)) + statusRerun(fixture);
    assert.ok(status.output.split('\n').includes(expected), value + ': ' + status.output);
  }
  const fixture = createFixture(t, [{ id: 'tool', scope: 'file', source: 'files/tool.md', destination: 'tool',
    protectedPaths: ['x.txt'] }]);
  const status = fixture.run(['status']);
  assert.equal(status.code, 2, status.output);
  const expected = `  Next: move protectedPaths of entry tool in ${manifestPath(fixture)} onto a directory or skill-root entry, ` +
    `or make it a list, ${statusRerun(fixture)}`;
  assert.ok(status.output.split('\n').includes(expected), status.output);
});

test('a repin list that is not a list names the quoted manifest and the status rerun', (t) => {
  const fixture = createFixture(t, [{ id: 'tool', scope: 'file', source: 'files/tool.md', destination: 'tool' }]);
  fixture.manifest.repin = { runtimeFolders: '.claude' };
  writeManifest(fixture);
  const status = fixture.run(['status']);
  assert.equal(status.code, 2, status.output);
  const expected = `  Next: set "repin": {"runtimeFolders": ["<path>"]} in ${manifestPath(fixture)}, each path relative to the tree, ` +
    statusRerun(fixture);
  assert.ok(status.output.split('\n').includes(expected), status.output);
});

test('a capture of a live destination that is no longer a file prints the capture command to rerun', (t) => {
  const fixture = createFixture(t, [{ id: 'tool', scope: 'file', source: 'files/tool.md', destination: 'my tool' }]);
  assert.equal(fixture.run(['apply']).code, 0);
  fs.rmSync(path.join(fixture.tree, 'my tool'));
  writeFile(fixture.tree, 'my tool/inner.md', 'a folder now\n');
  const captured = fixture.run(['apply', '--capture', 'my tool']);
  assert.notEqual(captured.code, 0, captured.output);
  const expected = `  Next: once 'my tool' is a regular file again, from ${quoted(fixture.tree)}: ${ENGINE} apply --capture 'my tool'`;
  assert.ok(captured.output.split('\n').includes(expected), captured.output);
});
