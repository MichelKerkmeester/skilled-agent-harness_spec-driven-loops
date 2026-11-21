// ───────────────────────────────────────────────────────────────────
// MODULE: Overlay Engine Shape Change Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// A destination can change shape between two applies: a folder an entry wrote
// becomes a file, a file becomes a folder, and a folder becomes a layout link
// or back. Apply replaces the old shape in one run when the state file records
// it as the engine's own output, and refuses, writing nothing, when the old
// shape is someone else's.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const {
  createWorkspace,
  runEngine,
  writeFile,
  writeManifest,
} = require('./overlay-engine-fixtures.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURE
// ─────────────────────────────────────────────────────────────────────────────

function createShapeFixture(t, overlays, layoutLinks = []) {
  const fixture = createWorkspace(t, 'overlay-engine-shape-');
  writeFile(fixture.overlayDir, 'bundle/a.md', 'bundle a\n');
  writeFile(fixture.overlayDir, 'bundle/deep/b.md', 'bundle b\n');
  writeFile(fixture.overlayDir, 'files/tool.md', 'tool file\n');
  writeFile(fixture.tree, 'target/inside.md', 'link target\n');
  fixture.setManifest = (nextOverlays, nextLinks = []) => {
    fixture.manifest = {
      schemaVersion: 1,
      pin: { upstream: 'fixture', commit: 'pin-one' },
      layoutLinks: nextLinks,
      overlays: nextOverlays,
      regenerate: [],
      verifyGenerated: [],
    };
    writeManifest(fixture);
  };
  fixture.setManifest(overlays, layoutLinks);
  fixture.run = (args) => runEngine([...args, '--root', fixture.tree], fixture.workspace);
  return fixture;
}

const DIRECTORY_ENTRY = { id: 'tool', scope: 'directory', source: 'bundle/', destination: 'tool' };
const FILE_ENTRY = { id: 'tool', scope: 'file', source: 'files/tool.md', destination: 'tool' };
const LINK = { path: 'tool', target: 'target' };

function kindOf(filePath) {
  let stats;
  try {
    stats = fs.lstatSync(filePath);
  } catch {
    return 'missing';
  }
  if (stats.isSymbolicLink()) return 'link';
  return stats.isDirectory() ? 'folder' : 'file';
}

function applyOk(fixture) {
  const result = fixture.run(['apply']);
  assert.equal(result.code, 0, result.output);
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. OWNED SHAPES ARE REPLACED IN ONE APPLY
// ─────────────────────────────────────────────────────────────────────────────

test('a folder the engine wrote becomes the file an entry now names, in one apply', (t) => {
  const fixture = createShapeFixture(t, [DIRECTORY_ENTRY]);
  applyOk(fixture);
  fixture.setManifest([FILE_ENTRY]);
  applyOk(fixture);
  const live = path.join(fixture.tree, 'tool');
  assert.equal(kindOf(live), 'file');
  assert.equal(fs.readFileSync(live, 'utf8'), 'tool file\n');
  assert.equal(fixture.run(['status']).code, 0);
});

test('a file the engine wrote becomes the folder an entry now names, in one apply', (t) => {
  const fixture = createShapeFixture(t, [FILE_ENTRY]);
  applyOk(fixture);
  fixture.setManifest([DIRECTORY_ENTRY]);
  applyOk(fixture);
  assert.equal(kindOf(path.join(fixture.tree, 'tool')), 'folder');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'tool', 'deep', 'b.md'), 'utf8'), 'bundle b\n');
  assert.equal(fixture.run(['status']).code, 0);
});

test('a folder the engine wrote becomes the layout link the manifest now names, in one apply', (t) => {
  const fixture = createShapeFixture(t, [DIRECTORY_ENTRY]);
  applyOk(fixture);
  fixture.setManifest([], [LINK]);
  applyOk(fixture);
  const live = path.join(fixture.tree, 'tool');
  assert.equal(kindOf(live), 'link');
  assert.equal(fs.readlinkSync(live), 'target');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'target', 'inside.md'), 'utf8'), 'link target\n');
});

test('a layout link the engine made becomes the folder an entry now names, and its target is untouched', (t) => {
  const fixture = createShapeFixture(t, [], [LINK]);
  applyOk(fixture);
  fixture.setManifest([DIRECTORY_ENTRY]);
  applyOk(fixture);
  assert.equal(kindOf(path.join(fixture.tree, 'tool')), 'folder');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'tool', 'a.md'), 'utf8'), 'bundle a\n');
  // The write went into a real folder, never through the old link.
  assert.deepEqual(fs.readdirSync(path.join(fixture.tree, 'target')), ['inside.md']);
});

test('a file the engine wrote becomes the layout link the manifest now names, in one apply', (t) => {
  const fixture = createShapeFixture(t, [FILE_ENTRY]);
  applyOk(fixture);
  fixture.setManifest([], [LINK]);
  applyOk(fixture);
  assert.equal(fs.readlinkSync(path.join(fixture.tree, 'tool')), 'target');
  assert.equal(fixture.run(['status']).code, 0);
});

test('a layout link the engine made becomes the file an entry now names, and its target is untouched', (t) => {
  const fixture = createShapeFixture(t, [], [LINK]);
  applyOk(fixture);
  fixture.setManifest([FILE_ENTRY]);
  applyOk(fixture);
  assert.equal(kindOf(path.join(fixture.tree, 'tool')), 'file');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'tool'), 'utf8'), 'tool file\n');
  assert.deepEqual(fs.readdirSync(path.join(fixture.tree, 'target')), ['inside.md']);
  assert.equal(fixture.run(['status']).code, 0);
});

test('a link the engine did not make where a directory entry writes keeps its old handling', (t) => {
  const fixture = createShapeFixture(t, [], []);
  fs.symlinkSync('target', path.join(fixture.tree, 'tool'));
  fixture.setManifest([], [LINK]);
  applyOk(fixture);
  // The manifest still names the link, so a directory entry may not take it over.
  fixture.setManifest([DIRECTORY_ENTRY], [LINK]);
  const second = fixture.run(['apply']);
  assert.equal(second.code, 0, second.output);
  // The link stays, and the folder's files land inside the tree, at its target.
  assert.equal(kindOf(path.join(fixture.tree, 'tool')), 'link');
  assert.equal(fs.readlinkSync(path.join(fixture.tree, 'tool')), 'target');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'target', 'a.md'), 'utf8'), 'bundle a\n');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'target', 'inside.md'), 'utf8'), 'link target\n');
});

test('a subfolder of a directory source that becomes a file is replaced in one apply', (t) => {
  const fixture = createShapeFixture(t, [DIRECTORY_ENTRY]);
  applyOk(fixture);
  fs.rmSync(path.join(fixture.overlayDir, 'bundle', 'deep'), { recursive: true });
  writeFile(fixture.overlayDir, 'bundle/deep', 'now a file\n');
  applyOk(fixture);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'tool', 'deep'), 'utf8'), 'now a file\n');
});

test('a subfolder of a directory source that becomes a link is replaced in one apply', (t) => {
  const fixture = createShapeFixture(t, [DIRECTORY_ENTRY]);
  applyOk(fixture);
  fs.rmSync(path.join(fixture.overlayDir, 'bundle', 'deep'), { recursive: true });
  fs.symlinkSync('a.md', path.join(fixture.overlayDir, 'bundle', 'deep'));
  applyOk(fixture);
  assert.equal(kindOf(path.join(fixture.tree, 'tool', 'deep')), 'link');
  assert.equal(fs.readlinkSync(path.join(fixture.tree, 'tool', 'deep')), 'a.md');
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. UNOWNED SHAPES STAY A REFUSAL
// ─────────────────────────────────────────────────────────────────────────────

test('an unowned folder where a file entry writes is refused, and nothing is written', (t) => {
  const fixture = createShapeFixture(t, [FILE_ENTRY]);
  writeFile(fixture.tree, 'tool/project.md', 'project file\n');
  const result = fixture.run(['apply']);
  assert.notEqual(result.code, 0, result.output);
  assert.match(result.output, /tool is a folder that does not match what apply last wrote there/);
  assert.ok(result.output.includes(`Next: mv ${path.join(fixture.tree, 'tool')} ${path.join(fixture.tree, 'tool')}.keep, then from ${fixture.tree}: node `), result.output);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'tool', 'project.md'), 'utf8'), 'project file\n');
});

test('an unowned file where a directory entry writes is refused, and nothing is written', (t) => {
  const fixture = createShapeFixture(t, [DIRECTORY_ENTRY]);
  writeFile(fixture.tree, 'tool', 'project file\n');
  const result = fixture.run(['apply']);
  assert.notEqual(result.code, 0, result.output);
  assert.match(result.output, /tool is a file that does not match what apply last wrote there/);
  assert.ok(result.output.includes(`Next: mv ${path.join(fixture.tree, 'tool')} ${path.join(fixture.tree, 'tool')}.keep, then from ${fixture.tree}: node `), result.output);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'tool'), 'utf8'), 'project file\n');
});

test('an unowned folder where a layout link goes is still refused, and its files stay', (t) => {
  const fixture = createShapeFixture(t, [], [LINK]);
  writeFile(fixture.tree, 'tool/project.md', 'project file\n');
  const result = fixture.run(['apply']);
  assert.notEqual(result.code, 0, result.output);
  assert.match(result.output, /tool exists but is not the link to target/);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'tool', 'project.md'), 'utf8'), 'project file\n');
});

test('an owned folder that also holds a project file is refused as a layout link, and its files stay', (t) => {
  const fixture = createShapeFixture(t, [DIRECTORY_ENTRY]);
  applyOk(fixture);
  writeFile(fixture.tree, 'tool/project.md', 'project file\n');
  fixture.setManifest([], [LINK]);
  const result = fixture.run(['apply']);
  assert.notEqual(result.code, 0, result.output);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'tool', 'project.md'), 'utf8'), 'project file\n');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'tool', 'a.md'), 'utf8'), 'bundle a\n');
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. SKILL-ROOT REPLACE PATHS
// ─────────────────────────────────────────────────────────────────────────────

// A skill-root entry replaces the paths it lists, so a shape change under one
// of them follows the same rule: its own old shape goes, anyone else's stays.
function skillRootEntry(replace) {
  return { id: 'vendor', scope: 'skill-root', source: 'vendor', destination: 'vendor', replace, remove: [], retained: [] };
}

function swapToFile(fixture, relativePath, value) {
  fs.rmSync(path.join(fixture.overlayDir, relativePath), { recursive: true });
  writeFile(fixture.overlayDir, relativePath, value);
}

function swapToFolder(fixture, relativePath, child, value) {
  fs.rmSync(path.join(fixture.overlayDir, relativePath));
  writeFile(fixture.overlayDir, path.join(relativePath, child), value);
}

test('a subfolder under a skill-root replace folder that becomes a file is replaced in one apply', (t) => {
  const fixture = createShapeFixture(t, [skillRootEntry(['keep'])]);
  writeFile(fixture.overlayDir, 'vendor/keep/sub/x.md', 'sub x\n');
  applyOk(fixture);
  swapToFile(fixture, 'vendor/keep/sub', 'now a file\n');
  applyOk(fixture);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'vendor', 'keep', 'sub'), 'utf8'), 'now a file\n');
  assert.equal(applyOk(fixture).output.includes('EISDIR'), false);
});

test('a file under a skill-root replace folder that becomes a folder is replaced in one apply', (t) => {
  const fixture = createShapeFixture(t, [skillRootEntry(['keep'])]);
  writeFile(fixture.overlayDir, 'vendor/keep/sub', 'a file\n');
  applyOk(fixture);
  swapToFolder(fixture, 'vendor/keep/sub', 'x.md', 'sub x\n');
  applyOk(fixture);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'vendor', 'keep', 'sub', 'x.md'), 'utf8'), 'sub x\n');
});

test('a skill-root replace folder the engine wrote becomes the file the source now ships, in one apply', (t) => {
  const fixture = createShapeFixture(t, [skillRootEntry(['keep/sub'])]);
  writeFile(fixture.overlayDir, 'vendor/keep/sub/x.md', 'sub x\n');
  applyOk(fixture);
  swapToFile(fixture, 'vendor/keep/sub', 'now a file\n');
  applyOk(fixture);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'vendor', 'keep', 'sub'), 'utf8'), 'now a file\n');
});

test('a skill-root replace file the engine wrote becomes the folder the source now ships, in one apply', (t) => {
  const fixture = createShapeFixture(t, [skillRootEntry(['keep/sub'])]);
  writeFile(fixture.overlayDir, 'vendor/keep/sub', 'a file\n');
  applyOk(fixture);
  swapToFolder(fixture, 'vendor/keep/sub', 'x.md', 'sub x\n');
  applyOk(fixture);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'vendor', 'keep', 'sub', 'x.md'), 'utf8'), 'sub x\n');
});

test('an unowned folder where a skill-root replace path writes a file is refused, and its files stay', (t) => {
  const fixture = createShapeFixture(t, [skillRootEntry(['keep/sub'])]);
  writeFile(fixture.overlayDir, 'vendor/keep/sub', 'a file\n');
  writeFile(fixture.tree, 'vendor/keep/sub/project.md', 'project file\n');
  const result = fixture.run(['apply']);
  assert.notEqual(result.code, 0, result.output);
  const target = path.join(fixture.tree, 'vendor', 'keep', 'sub');
  assert.match(result.output, /vendor\/keep\/sub is a folder that does not match what apply last wrote there/);
  assert.ok(result.output.includes(`Next: mv ${target} ${target}.keep, then from ${fixture.tree}: node `), result.output);
  assert.equal(fs.readFileSync(path.join(target, 'project.md'), 'utf8'), 'project file\n');
});

test('an unowned file where a skill-root replace path writes a folder is refused, and it stays', (t) => {
  const fixture = createShapeFixture(t, [skillRootEntry(['keep/sub'])]);
  writeFile(fixture.overlayDir, 'vendor/keep/sub/x.md', 'sub x\n');
  writeFile(fixture.tree, 'vendor/keep/sub', 'project file\n');
  const result = fixture.run(['apply']);
  assert.notEqual(result.code, 0, result.output);
  const target = path.join(fixture.tree, 'vendor', 'keep', 'sub');
  assert.match(result.output, /vendor\/keep\/sub is a file that does not match what apply last wrote there/);
  assert.ok(result.output.includes(`Next: mv ${target} ${target}.keep, then from ${fixture.tree}: node `), result.output);
  assert.equal(fs.readFileSync(target, 'utf8'), 'project file\n');
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. LINKS THAT LEAD OUTSIDE THE TREE
// ─────────────────────────────────────────────────────────────────────────────

// A link the engine did not make that leads outside the tree is refused for
// every entry scope, whether it stands at the destination or on a folder above
// it: a write through it would land outside the tree.
function outsideFolder(t) {
  const outside = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'overlay-engine-outside-'));
  t.after(() => fs.rmSync(outside, { recursive: true, force: true }));
  fs.writeFileSync(path.join(outside, 'outside.md'), 'outside\n');
  return outside;
}

function assertOutsideRefusal(fixture, outside, linkKey) {
  const before = fs.readdirSync(outside).sort();
  for (const command of ['status', 'apply']) {
    const result = fixture.run([command]);
    assert.equal(result.code, 1, result.output);
    assert.match(result.output, new RegExp(`${linkKey.replace(/[/.]/g, '\\$&')} is a link that leads outside the tree`), result.output);
    const linkPath = path.join(fixture.tree, linkKey);
    assert.ok(result.output.includes(`Next: mv ${linkPath} ${linkPath}.keep, then from ${fixture.tree}: node `), result.output);
  }
  assert.deepEqual(fs.readdirSync(outside).sort(), before);
  assert.equal(fs.readFileSync(path.join(outside, 'outside.md'), 'utf8'), 'outside\n');
}

test('a link outside the tree where a directory entry writes is refused, and nothing lands outside', (t) => {
  const outside = outsideFolder(t);
  const fixture = createShapeFixture(t, [DIRECTORY_ENTRY]);
  fs.symlinkSync(outside, path.join(fixture.tree, 'tool'));
  assertOutsideRefusal(fixture, outside, 'tool');
});

test('a link outside the tree on a folder above a directory entry is refused, and nothing outside is deleted', (t) => {
  const outside = outsideFolder(t);
  const fixture = createShapeFixture(t, [{ ...DIRECTORY_ENTRY, destination: 'up/tool' }]);
  fs.mkdirSync(path.join(outside, 'tool'));
  fs.writeFileSync(path.join(outside, 'tool', 'theirs.md'), 'theirs\n');
  fs.symlinkSync(outside, path.join(fixture.tree, 'up'));
  assertOutsideRefusal(fixture, outside, 'up');
  assert.equal(fs.readFileSync(path.join(outside, 'tool', 'theirs.md'), 'utf8'), 'theirs\n');
});

test('a link outside the tree where a skill-root entry writes is refused, and nothing lands outside', (t) => {
  const outside = outsideFolder(t);
  const fixture = createShapeFixture(t, [skillRootEntry(['keep'])]);
  writeFile(fixture.overlayDir, 'vendor/keep/x.md', 'keep x\n');
  fs.symlinkSync(outside, path.join(fixture.tree, 'vendor'));
  assertOutsideRefusal(fixture, outside, 'vendor');
});

test('a link outside the tree above a skill-root replace path is refused, and nothing lands outside', (t) => {
  const outside = outsideFolder(t);
  const fixture = createShapeFixture(t, [skillRootEntry(['keep/sub'])]);
  writeFile(fixture.overlayDir, 'vendor/keep/sub/x.md', 'sub x\n');
  fs.mkdirSync(path.join(fixture.tree, 'vendor'));
  fs.symlinkSync(outside, path.join(fixture.tree, 'vendor', 'keep'));
  assertOutsideRefusal(fixture, outside, 'vendor/keep');
});

test('a link to a file outside the tree where a whole-file entry writes is refused, and the file is untouched', (t) => {
  const outside = outsideFolder(t);
  const fixture = createShapeFixture(t, [FILE_ENTRY]);
  fs.symlinkSync(path.join(outside, 'outside.md'), path.join(fixture.tree, 'tool'));
  assertOutsideRefusal(fixture, outside, 'tool');
});

test('a dangling link that points outside the tree where a whole-file entry writes is refused', (t) => {
  const outside = outsideFolder(t);
  const fixture = createShapeFixture(t, [FILE_ENTRY]);
  fs.symlinkSync(path.join(outside, 'not-yet.md'), path.join(fixture.tree, 'tool'));
  assertOutsideRefusal(fixture, outside, 'tool');
});

test('a link that loops where a whole-file entry writes is refused, not a crash', (t) => {
  const fixture = createShapeFixture(t, [FILE_ENTRY]);
  fs.symlinkSync('loop-b', path.join(fixture.tree, 'tool'));
  fs.symlinkSync('tool', path.join(fixture.tree, 'loop-b'));
  const result = fixture.run(['apply']);
  assert.equal(result.code, 1, result.output);
  assert.equal(result.output.includes('ELOOP'), false, result.output);
  assert.match(result.output, /tool is a link that does not resolve/, result.output);
});

test('a dangling link that reaches outside the tree through a second link is refused', (t) => {
  const outside = outsideFolder(t);
  const fixture = createShapeFixture(t, [FILE_ENTRY]);
  fs.symlinkSync('hop', path.join(fixture.tree, 'tool'));
  fs.symlinkSync(path.join(outside, 'not-yet.md'), path.join(fixture.tree, 'hop'));
  assertOutsideRefusal(fixture, outside, 'tool');
});

test('a layout link the manifest names keeps its old handling when its target is outside the tree', (t) => {
  const outside = outsideFolder(t);
  const fixture = createShapeFixture(t, [{ ...DIRECTORY_ENTRY, destination: 'up/tool' }], [{ path: 'up', target: outside }]);
  fs.symlinkSync(outside, path.join(fixture.tree, 'up'));
  const result = fixture.run(['apply']);
  assert.equal(result.code, 0, result.output);
  assert.equal(fs.readFileSync(path.join(outside, 'tool', 'a.md'), 'utf8'), 'bundle a\n');
});

// A link the engine made whose own target stays inside the tree is followed only
// as far as the tree: a later link on its chain that leads outside is refused at
// that link, so the remedy names the link someone else made.
test('a layout link inside the tree whose target became a link outside it is refused, and nothing lands outside', (t) => {
  const outside = outsideFolder(t);
  const fixture = createShapeFixture(t, [{ ...DIRECTORY_ENTRY, destination: 'up/tool' }], [{ path: 'up', target: 'target' }]);
  fs.symlinkSync('target', path.join(fixture.tree, 'up'));
  fs.rmSync(path.join(fixture.tree, 'target'), { recursive: true });
  fs.symlinkSync(outside, path.join(fixture.tree, 'target'));
  assertOutsideRefusal(fixture, outside, 'target');
  assert.equal(fs.existsSync(path.join(outside, 'tool')), false);
});

// A layout link not made yet that an entry writes under is made first, so a
// fresh tree ends the way it would had the link stood before the apply, and the
// entry is judged through the link like any other write.
test('a layout link not made yet above a directory entry is made first, and the entry writes through it', (t) => {
  const fixture = createShapeFixture(t, [{ ...DIRECTORY_ENTRY, destination: 'up/tool' }], [{ path: 'up', target: 'target' }]);
  const result = fixture.run(['apply']);
  assert.equal(result.code, 0, result.output);
  assert.equal(result.output.includes('EPERM'), false, result.output);
  assert.match(result.output, /linked up -> target/, result.output);
  assert.equal(fs.readlinkSync(path.join(fixture.tree, 'up')), 'target');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'target', 'tool', 'a.md'), 'utf8'), 'bundle a\n');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'target', 'tool', 'deep', 'b.md'), 'utf8'), 'bundle b\n');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'target', 'inside.md'), 'utf8'), 'link target\n');
  const status = fixture.run(['status']);
  assert.equal(status.code, 0, status.output);
});

test('a layout link not made yet at a directory entry\'s own path is made first, and the entry writes through it', (t) => {
  const fixture = createShapeFixture(t, [DIRECTORY_ENTRY], [LINK]);
  const result = fixture.run(['apply']);
  assert.equal(result.code, 0, result.output);
  assert.equal(fs.readlinkSync(path.join(fixture.tree, 'tool')), 'target');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'target', 'a.md'), 'utf8'), 'bundle a\n');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'target', 'inside.md'), 'utf8'), 'link target\n');
});

test('a layout link not made yet above a pinned whole-file entry is made first, and the pinned file is read through it', (t) => {
  const pinned = 'upstream tool\n';
  const pinnedSha256 = require('node:crypto').createHash('sha256').update(pinned).digest('hex');
  const fixture = createShapeFixture(t, [{ ...FILE_ENTRY, destination: 'up/tool', pinnedSha256 }], [{ path: 'up', target: 'target' }]);
  writeFile(fixture.tree, 'target/tool', pinned);
  const result = fixture.run(['apply']);
  assert.equal(result.code, 0, result.output);
  assert.equal(fs.readlinkSync(path.join(fixture.tree, 'up')), 'target');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'target', 'tool'), 'utf8'), 'tool file\n');
  assert.equal(fixture.run(['status']).code, 0);
});

test('a layout link not made yet inside a folder a directory entry writes is refused before any write', (t) => {
  const fixture = createShapeFixture(t, [DIRECTORY_ENTRY], [{ path: 'tool/deep', target: '../target' }]);
  const result = fixture.run(['apply']);
  assert.equal(result.code, 1, result.output);
  assert.match(result.output, /tool\/deep is a layout link inside tool, the folder overlay tool writes/, result.output);
  assert.match(result.output, /Next: move the layout link tool\/deep out of tool in /, result.output);
  assert.match(result.output, /this apply wrote nothing/, result.output);
  assert.equal(kindOf(path.join(fixture.tree, 'tool')), 'missing');
  assert.deepEqual(fs.readdirSync(path.join(fixture.tree, 'target')), ['inside.md']);
});

test('a layout link not made yet whose target leads outside the tree is refused, and the link is not left behind', (t) => {
  const outside = outsideFolder(t);
  const fixture = createShapeFixture(t, [{ ...DIRECTORY_ENTRY, destination: 'up/tool' }], [{ path: 'up', target: 'target' }]);
  fs.rmSync(path.join(fixture.tree, 'target'), { recursive: true });
  fs.symlinkSync(outside, path.join(fixture.tree, 'target'));
  const before = fs.readdirSync(outside).sort();
  const result = fixture.run(['apply']);
  assert.equal(result.code, 1, result.output);
  assert.match(result.output, /target is a link that leads outside the tree/, result.output);
  assert.match(result.output, /this apply wrote nothing/, result.output);
  assert.equal(kindOf(path.join(fixture.tree, 'up')), 'missing');
  assert.deepEqual(fs.readdirSync(outside).sort(), before);
});

test('a layout link not made yet whose target holds a project file where the entry writes a folder is refused, and the file stays', (t) => {
  const fixture = createShapeFixture(t, [{ ...DIRECTORY_ENTRY, destination: 'up/tool' }], [{ path: 'up', target: 'target' }]);
  writeFile(fixture.tree, 'target/tool', 'project file\n');
  const result = fixture.run(['apply']);
  assert.equal(result.code, 1, result.output);
  assert.equal(result.output.includes('EPERM'), false, result.output);
  assert.match(result.output, /up\/tool is a file that does not match what apply last wrote there/, result.output);
  assert.match(result.output, /this apply wrote nothing/, result.output);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'target', 'tool'), 'utf8'), 'project file\n');
  assert.equal(kindOf(path.join(fixture.tree, 'up')), 'missing');
});

// A dangling link's target is read from the folder the link really sits in, as
// the operating system reads it, never from the path as written.
test('a dangling link whose target climbs out of the tree from its real folder is refused', (t) => {
  const fixture = createShapeFixture(t, [{ ...FILE_ENTRY, destination: 'a/b/alias/tool' }]);
  fs.mkdirSync(path.join(fixture.tree, 'a', 'b'), { recursive: true });
  fs.mkdirSync(path.join(fixture.tree, 't'));
  fs.symlinkSync('../../t', path.join(fixture.tree, 'a', 'b', 'alias'));
  fs.symlinkSync('../../x.md', path.join(fixture.tree, 't', 'tool'));
  const escaped = path.join(path.dirname(fixture.tree), 'x.md');
  t.after(() => fs.rmSync(escaped, { force: true }));
  const result = fixture.run(['apply']);
  assert.equal(result.code, 1, result.output);
  assert.match(result.output, /a\/b\/alias\/tool is a link that leads outside the tree/, result.output);
  assert.equal(fs.existsSync(escaped), false);
});

test('a dangling link whose target stays in the tree from its real folder is not refused', (t) => {
  const fixture = createShapeFixture(t, [{ ...FILE_ENTRY, destination: 'alias/tool' }]);
  fs.mkdirSync(path.join(fixture.tree, 'deep', 'inner'), { recursive: true });
  fs.symlinkSync('deep/inner', path.join(fixture.tree, 'alias'));
  fs.symlinkSync('../../x.md', path.join(fixture.tree, 'deep', 'inner', 'tool'));
  const result = fixture.run(['apply']);
  assert.equal(result.output.includes('is a link that leads outside the tree'), false, result.output);
  assert.equal(result.code, 0, result.output);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'alias', 'tool'), 'utf8'), 'tool file\n');
  assert.equal(fs.existsSync(path.join(path.dirname(fixture.tree), 'x.md')), false);
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. LAYOUT LINKS MOVED OR MADE BEFORE THE ENTRIES UNDER THEM
// ─────────────────────────────────────────────────────────────────────────────

const UP_ENTRY = { ...DIRECTORY_ENTRY, destination: 'up/tool' };

// A layout link the manifest points somewhere new is moved before the entries
// under it write, so they land in the new target in one apply, and the copy an
// earlier apply wrote in the old target is left there, no longer tracked.
test('a layout link moved to a new target with an entry under it is moved first, and the entry writes there in one apply', (t) => {
  const fixture = createShapeFixture(t, [UP_ENTRY], [{ path: 'up', target: 'target' }]);
  writeFile(fixture.tree, 'target2/inside.md', 'second target\n');
  applyOk(fixture);
  fixture.setManifest([UP_ENTRY], [{ path: 'up', target: 'target2' }]);
  writeFile(fixture.overlayDir, 'bundle/a.md', 'bundle a two\n');
  const result = applyOk(fixture);
  assert.match(result.output, /linked up -> target2/, result.output);
  assert.match(result.output, /NOTE {5}up now links to target2, and what apply wrote through it before stays at target\/tool, no longer tracked/, result.output);
  assert.equal(fs.readlinkSync(path.join(fixture.tree, 'up')), 'target2');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'target2', 'tool', 'a.md'), 'utf8'), 'bundle a two\n');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'target2', 'tool', 'deep', 'b.md'), 'utf8'), 'bundle b\n');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'target', 'tool', 'a.md'), 'utf8'), 'bundle a\n');
  assert.equal(fixture.run(['status']).code, 0);
  const again = applyOk(fixture);
  assert.match(again.output, /^0 changed$/m, again.output);
  assert.equal(again.output.includes('NOTE'), false, again.output);
});

test('a layout link moved to a new target that holds a project file where the entry writes is refused, and the old link stays', (t) => {
  const fixture = createShapeFixture(t, [UP_ENTRY], [{ path: 'up', target: 'target' }]);
  writeFile(fixture.tree, 'target2/tool', 'project file\n');
  applyOk(fixture);
  fixture.setManifest([UP_ENTRY], [{ path: 'up', target: 'target2' }]);
  writeFile(fixture.overlayDir, 'bundle/a.md', 'bundle a two\n');
  const result = fixture.run(['apply']);
  assert.equal(result.code, 1, result.output);
  assert.match(result.output, /up\/tool is a file that does not match what apply last wrote there/, result.output);
  assert.match(result.output, /this apply wrote nothing/, result.output);
  assert.equal(fs.readlinkSync(path.join(fixture.tree, 'up')), 'target');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'target2', 'tool'), 'utf8'), 'project file\n');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'target', 'tool', 'a.md'), 'utf8'), 'bundle a\n');
});

// On a volume that ignores case, a layout link and a destination that differ
// only in case name one path, so the link is still made before the writes.
function isCaseInsensitive(folder) {
  const probe = path.join(folder, 'Case-Probe');
  fs.mkdirSync(probe);
  try {
    return fs.existsSync(path.join(folder, 'case-probe'));
  } finally {
    fs.rmdirSync(probe);
  }
}

test('a layout link whose path differs from a destination only in case is made first on a volume that ignores case', (t) => {
  const fixture = createShapeFixture(t, [UP_ENTRY], [{ path: 'Up', target: 'target' }]);
  if (!isCaseInsensitive(fixture.workspace)) {
    t.skip('the volume tells case apart, so Up and up are two paths');
    return;
  }
  const result = applyOk(fixture);
  assert.match(result.output, /linked Up -> target/, result.output);
  assert.equal(fs.readlinkSync(path.join(fixture.tree, 'Up')), 'target');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'target', 'tool', 'a.md'), 'utf8'), 'bundle a\n');
  assert.equal(fixture.run(['status']).code, 0);
});

// Status reports a write through a missing layout link the way apply will once
// it makes the link, so a target that leads outside the tree is never listed as
// work apply can do.
test('status refuses a write through a missing layout link whose target leads outside the tree, as apply does', (t) => {
  const outside = outsideFolder(t);
  const fixture = createShapeFixture(t, [UP_ENTRY], [{ path: 'up', target: 'target' }]);
  fs.rmSync(path.join(fixture.tree, 'target'), { recursive: true });
  fs.symlinkSync(outside, path.join(fixture.tree, 'target'));
  const status = fixture.run(['status']);
  assert.equal(status.code, 1, status.output);
  assert.match(status.output, /^MISS {5}tool: target is a link that leads outside the tree, to .*, where overlay tool writes$/m, status.output);
  assert.equal(status.output.includes('overlay-edited up/tool/a.md'), false, status.output);
  assert.equal(kindOf(path.join(fixture.tree, 'up')), 'missing');
});

// A missing layout link inside another one whose target leads outside the tree
// is refused while the manifest is planned, before any link is made. The
// refusal names the link that leads out, which is the one to move aside.
test('a nested missing layout link whose folder leads outside the tree through the outer link is refused with the link that leads out', (t) => {
  const outside = outsideFolder(t);
  const fixture = createShapeFixture(t, [{ ...DIRECTORY_ENTRY, destination: 'a/b/tool' }],
    [{ path: 'a', target: 'target' }, { path: 'a/b', target: 'sub' }]);
  fs.rmSync(path.join(fixture.tree, 'target'), { recursive: true });
  fs.symlinkSync(outside, path.join(fixture.tree, 'target'));
  const before = fs.readdirSync(outside).sort();
  for (const command of ['status', 'apply']) {
    const result = fixture.run([command]);
    assert.equal(result.code, 2, command + ': ' + result.output);
    assert.match(result.output, /^\[overlay-engine\] layout link path escapes the tree root: a\/b$/m, command + ': ' + result.output);
    assert.match(result.output, /^ {2}the folder it sits in leads outside the tree through target, so a link made there would land outside it$/m,
      command + ': ' + result.output);
    assert.match(result.output, /^ {2}Next: mv .*\/target .*\/target\.keep, then from .*: node \.skilled\/commands\/doctor\/scripts\/overlay-engine\.cjs apply$/m,
      command + ': ' + result.output);
  }
  assert.equal(kindOf(path.join(fixture.tree, 'a')), 'missing');
  assert.deepEqual(fs.readdirSync(outside).sort(), before);
});
