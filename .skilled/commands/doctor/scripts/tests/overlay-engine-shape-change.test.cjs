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
// 7. LAYOUT LINKS MADE BEFORE THE ENTRIES UNDER THEM
// ─────────────────────────────────────────────────────────────────────────────

const UP_ENTRY = { ...DIRECTORY_ENTRY, destination: 'up/tool' };

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
    assert.equal(/^ {2}this apply wrote nothing: it stopped while planning, before any write$/m.test(result.output), command === 'apply',
      command + ': ' + result.output);
  }
  assert.equal(kindOf(path.join(fixture.tree, 'a')), 'missing');
  assert.deepEqual(fs.readdirSync(outside).sort(), before);
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. LAYOUT LINKS APPLY CANNOT WRITE THROUGH AS PLANNED
// ─────────────────────────────────────────────────────────────────────────────

const ENGINE_LINE = 'node \\.skilled\\/commands\\/doctor\\/scripts\\/overlay-engine\\.cjs';

// Every file and folder under a folder, with each file's text, so a test can
// prove a run left the folder exactly as it found it.
function snapshot(folder) {
  const found = {};
  const walk = (at) => {
    for (const name of fs.readdirSync(at).sort()) {
      const filePath = path.join(at, name);
      const key = path.relative(folder, filePath);
      if (fs.lstatSync(filePath).isDirectory()) {
        found[key + '/'] = null;
        walk(filePath);
      } else {
        found[key] = fs.readFileSync(filePath, 'utf8');
      }
    }
  };
  walk(folder);
  return found;
}

// Status and apply print one refusal with the same why and Next lines, apply
// says it wrote nothing, and neither prints a raw error.
function assertRefusedByBoth(fixture, firstLine) {
  const blocks = {};
  for (const command of ['status', 'apply']) {
    const result = fixture.run([command]);
    assert.equal(result.code, 1, command + ': ' + result.output);
    assert.equal(/ENOENT|\[overlay-engine\]/.test(result.output), false, command + ': ' + result.output);
    const lines = result.output.split('\n');
    const label = command === 'status' ? 'MISS     layout: ' : 'BLOCKED  layout: ';
    const at = lines.indexOf(label + firstLine);
    assert.ok(at >= 0, command + ': ' + result.output);
    blocks[command] = lines.slice(at + 1, at + 3);
    if (command === 'apply') assert.match(result.output, /^ {2}this apply wrote nothing: a blocked overlay stops it before any write$/m, result.output);
  }
  assert.deepEqual(blocks.status, blocks.apply);
  return blocks.apply;
}

// The sequence a moved link's refusal names: the entry out, an apply that moves
// the link alone, the entry back and a second apply, ending in sync.
function moveLinkAlone(fixture, overlays, links) {
  fixture.setManifest(overlays.filter((entry) => entry.id !== 'tool'), links);
  applyOk(fixture);
  fixture.setManifest(overlays, links);
  applyOk(fixture);
  const status = fixture.run(['status']);
  assert.equal(status.code, 0, status.output);
}

function assertMovedLinkLines(lines, from, to) {
  assert.equal(lines[0], `  apply writes the entries under a link before it moves the link, so they would land in ${from}, not ${to}`);
  assert.match(lines[1], new RegExp(`^ {2}Next: take overlay tool out of .*overlay-manifest\\.json, run ${ENGINE_LINE} apply from .*\\/tree ` +
    'to move the link alone, then put the entry back and run apply again$'));
}

// A layout link the manifest points somewhere new, with an entry under it, is
// refused while it is planned: apply writes entries before it moves links, so
// the entry would land in the old target.
test('a layout link moved to a new target with an entry under it is refused by status and apply, and its Next sequence ends in sync', (t) => {
  const fixture = createShapeFixture(t, [UP_ENTRY], [{ path: 'up', target: 'target' }]);
  writeFile(fixture.tree, 'target2/other.md', 'second target\n');
  applyOk(fixture);
  const moved = [{ path: 'up', target: 'target2' }];
  fixture.setManifest([UP_ENTRY], moved);
  writeFile(fixture.overlayDir, 'bundle/a.md', 'bundle a two\n');
  const oldTarget = snapshot(path.join(fixture.tree, 'target'));
  const newTarget = snapshot(path.join(fixture.tree, 'target2'));
  assertMovedLinkLines(assertRefusedByBoth(fixture, 'up moves from target to target2, and overlay tool writes under it'),
    'target', 'target2');
  assert.equal(fs.readlinkSync(path.join(fixture.tree, 'up')), 'target');
  assert.deepEqual(snapshot(path.join(fixture.tree, 'target2')), newTarget);
  moveLinkAlone(fixture, [UP_ENTRY], moved);
  assert.equal(fs.readlinkSync(path.join(fixture.tree, 'up')), 'target2');
  assert.deepEqual(snapshot(path.join(fixture.tree, 'target')), oldTarget);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'target2', 'tool', 'a.md'), 'utf8'), 'bundle a two\n');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'target2', 'other.md'), 'utf8'), 'second target\n');
});

test('a layout link moved to a new target where an entry writes the link path itself is refused, and the project file in the old target stays', (t) => {
  const entry = { ...DIRECTORY_ENTRY, destination: 'up' };
  const fixture = createShapeFixture(t, [entry], [{ path: 'up', target: 'target' }]);
  writeFile(fixture.tree, 'target2/other.md', 'second target\n');
  applyOk(fixture);
  fixture.setManifest([entry], [{ path: 'up', target: 'target2' }]);
  const oldTarget = snapshot(path.join(fixture.tree, 'target'));
  const newTarget = snapshot(path.join(fixture.tree, 'target2'));
  assertMovedLinkLines(assertRefusedByBoth(fixture, 'up moves from target to target2, and overlay tool writes under it'),
    'target', 'target2');
  assert.equal(fixture.run(['apply']).output.includes('rm -r'), false);
  assert.equal(fs.readlinkSync(path.join(fixture.tree, 'up')), 'target');
  assert.deepEqual(snapshot(path.join(fixture.tree, 'target')), oldTarget);
  assert.deepEqual(snapshot(path.join(fixture.tree, 'target2')), newTarget);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'target', 'inside.md'), 'utf8'), 'link target\n');
});

test('a layout link moved back to a target that holds an earlier copy is refused by status and apply alike, never sent to capture', (t) => {
  const fixture = createShapeFixture(t, [UP_ENTRY], [{ path: 'up', target: 'target' }]);
  writeFile(fixture.tree, 'target2/other.md', 'second target\n');
  applyOk(fixture);
  const there = [{ path: 'up', target: 'target2' }];
  fixture.setManifest([UP_ENTRY], there);
  writeFile(fixture.overlayDir, 'bundle/a.md', 'bundle a two\n');
  moveLinkAlone(fixture, [UP_ENTRY], there);
  const back = [{ path: 'up', target: 'target' }];
  fixture.setManifest([UP_ENTRY], back);
  const lines = assertRefusedByBoth(fixture, 'up moves from target2 to target, and overlay tool writes under it');
  assertMovedLinkLines(lines, 'target2', 'target');
  assert.equal(fixture.run(['apply']).output.includes('--capture'), false);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'target', 'tool', 'a.md'), 'utf8'), 'bundle a\n');
  moveLinkAlone(fixture, [UP_ENTRY], back);
  assert.equal(fs.readlinkSync(path.join(fixture.tree, 'up')), 'target');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'target', 'tool', 'a.md'), 'utf8'), 'bundle a two\n');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'target', 'inside.md'), 'utf8'), 'link target\n');
});

function assertMissingTargetLines(lines, fixture, target, linkPath = 'up') {
  assert.equal(lines[0], '  a write under a link to a folder that does not exist has no folder to land in, so apply writes nothing');
  assert.equal(lines[1], `  Next: mkdir -p ${path.join(fixture.tree, target)}, or point the layout link ${linkPath} in ` +
    `${path.join(fixture.overlayDir, 'overlay-manifest.json')} at a folder that exists, then from ${fixture.tree}: ` +
    'node .skilled/commands/doctor/scripts/overlay-engine.cjs apply');
}

test('a layout link moved to a target that does not exist with an entry under it is refused, and later applies refuse it the same way', (t) => {
  const fixture = createShapeFixture(t, [UP_ENTRY], [{ path: 'up', target: 'target' }]);
  applyOk(fixture);
  const moved = [{ path: 'up', target: 'nothere' }];
  fixture.setManifest([UP_ENTRY], moved);
  const oldTarget = snapshot(path.join(fixture.tree, 'target'));
  assertMissingTargetLines(assertRefusedByBoth(fixture, 'up links to nothere, which does not exist, and overlay tool writes under it'),
    fixture, 'nothere');
  const again = fixture.run(['apply']);
  assert.equal(again.code, 1, again.output);
  assert.match(again.output, /^BLOCKED {2}layout: up moves from target to nothere, and overlay tool writes under it$/m, again.output);
  assert.equal(fs.readlinkSync(path.join(fixture.tree, 'up')), 'target');
  assert.equal(kindOf(path.join(fixture.tree, 'nothere')), 'missing');
  fs.mkdirSync(path.join(fixture.tree, 'nothere'));
  const status = fixture.run(['status']);
  assert.equal(status.output.includes('which does not exist'), false, status.output);
  assertMovedLinkLines(assertRefusedByBoth(fixture, 'up moves from target to nothere, and overlay tool writes under it'),
    'target', 'nothere');
  moveLinkAlone(fixture, [UP_ENTRY], moved);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'nothere', 'tool', 'a.md'), 'utf8'), 'bundle a\n');
  assert.deepEqual(snapshot(path.join(fixture.tree, 'target')), oldTarget);
});

test('a layout link not made yet whose target does not exist with an entry under it is refused, and the link is not made', (t) => {
  const links = [{ path: 'up', target: 'nothere' }];
  const fixture = createShapeFixture(t, [UP_ENTRY], links);
  assertMissingTargetLines(assertRefusedByBoth(fixture, 'up links to nothere, which does not exist, and overlay tool writes under it'),
    fixture, 'nothere');
  assert.equal(kindOf(path.join(fixture.tree, 'up')), 'missing');
  fs.mkdirSync(path.join(fixture.tree, 'nothere'));
  applyOk(fixture);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'nothere', 'tool', 'a.md'), 'utf8'), 'bundle a\n');
  assert.equal(fixture.run(['status']).code, 0);
});

test('a layout link not made yet in a folder not made yet, whose target does not exist, is refused by status and apply alike', (t) => {
  const fixture = createShapeFixture(t, [{ ...DIRECTORY_ENTRY, destination: 'a/up/tool' }], [{ path: 'a/up', target: 'nothere' }]);
  assertMissingTargetLines(assertRefusedByBoth(fixture, 'a/up links to nothere, which does not exist, and overlay tool writes under it'),
    fixture, 'a/nothere', 'a/up');
  assert.equal(kindOf(path.join(fixture.tree, 'a')), 'missing');
  fs.mkdirSync(path.join(fixture.tree, 'a', 'nothere'), { recursive: true });
  applyOk(fixture);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'a', 'nothere', 'tool', 'a.md'), 'utf8'), 'bundle a\n');
  assert.equal(fixture.run(['status']).code, 0);
});

test('a layout link standing at a target that does not exist is refused once an entry writes under it', (t) => {
  const links = [{ path: 'up', target: 'nothere' }];
  const fixture = createShapeFixture(t, [], links);
  applyOk(fixture);
  fixture.setManifest([UP_ENTRY], links);
  assertMissingTargetLines(assertRefusedByBoth(fixture, 'up links to nothere, which does not exist, and overlay tool writes under it'),
    fixture, 'nothere');
  assert.equal(fs.readlinkSync(path.join(fixture.tree, 'up')), 'nothere');
  fs.mkdirSync(path.join(fixture.tree, 'nothere'));
  applyOk(fixture);
  assert.equal(fixture.run(['status']).code, 0);
});

// The Next line for a target that stands but is not a folder: set it aside,
// make the folder, or point the link elsewhere.
function setAsideNext(fixture, target) {
  const targetPath = path.join(fixture.tree, target);
  return `  Next: mv ${targetPath} ${targetPath}.keep and mkdir -p ${targetPath}, or point the layout link up in ` +
    `${path.join(fixture.overlayDir, 'overlay-manifest.json')} at a folder that exists, then from ${fixture.tree}: ` +
    'node .skilled/commands/doctor/scripts/overlay-engine.cjs apply';
}

// Follow the set-aside Next line and prove the entry then writes through the
// link and the tree ends in sync.
function setAsideAndApply(fixture, target) {
  const targetPath = path.join(fixture.tree, target);
  fs.renameSync(targetPath, targetPath + '.keep');
  fs.mkdirSync(targetPath);
  applyOk(fixture);
  assert.equal(fs.readFileSync(path.join(targetPath, 'tool', 'a.md'), 'utf8'), 'bundle a\n');
  const status = fixture.run(['status']);
  assert.equal(status.code, 0, status.output);
}

// A layout link to a file gives a write under it no folder to land in, so it is
// refused while it is planned instead of failing once apply has made the link.
test('a layout link not made yet whose target is a file with an entry under it is refused, and the link is not made', (t) => {
  const fixture = createShapeFixture(t, [UP_ENTRY], [{ path: 'up', target: 'tfile' }]);
  writeFile(fixture.tree, 'tfile', 'a project file\n');
  const lines = assertRefusedByBoth(fixture, 'up links to tfile, which is a file, and overlay tool writes under it');
  assert.equal(lines[0], '  a write under a link to a file has no folder to land in, so apply writes nothing');
  assert.equal(lines[1], setAsideNext(fixture, 'tfile'));
  assert.equal(kindOf(path.join(fixture.tree, 'up')), 'missing');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'tfile'), 'utf8'), 'a project file\n');
  setAsideAndApply(fixture, 'tfile');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'tfile.keep'), 'utf8'), 'a project file\n');
});

test('a layout link standing at a target that became a file is refused once an entry writes under it', (t) => {
  const links = [{ path: 'up', target: 'tfile' }];
  const fixture = createShapeFixture(t, [], links);
  fs.mkdirSync(path.join(fixture.tree, 'tfile'));
  applyOk(fixture);
  fs.rmdirSync(path.join(fixture.tree, 'tfile'));
  writeFile(fixture.tree, 'tfile', 'a project file\n');
  fixture.setManifest([UP_ENTRY], links);
  const lines = assertRefusedByBoth(fixture, 'up links to tfile, which is a file, and overlay tool writes under it');
  assert.equal(lines[1], setAsideNext(fixture, 'tfile'));
  assert.equal(fs.readlinkSync(path.join(fixture.tree, 'up')), 'tfile');
  setAsideAndApply(fixture, 'tfile');
});

// A whole-file entry at the link's own path writes the link's target, so a
// file target is what it expects and is not refused.
test('a layout link to a file where a whole-file entry writes the link path itself is not refused', (t) => {
  const fixture = createShapeFixture(t, [{ ...FILE_ENTRY, destination: 'up' }], [{ path: 'up', target: 'tfile' }]);
  writeFile(fixture.tree, 'tfile', 'a project file\n');
  assert.equal(fixture.run(['status']).output.includes('which is a file'), false);
  const result = applyOk(fixture);
  assert.equal(result.output.includes('which is a file'), false, result.output);
  assert.equal(fs.readlinkSync(path.join(fixture.tree, 'up')), 'tfile');
  const status = fixture.run(['status']);
  assert.equal(status.code, 0, status.output);
});

// A link at the target that does not resolve cannot take a mkdir -p, so the
// Next line names that link as the thing to set aside.
test('a layout link whose target is a link that does not resolve is refused with a Next line that sets that link aside', (t) => {
  const fixture = createShapeFixture(t, [UP_ENTRY], [{ path: 'up', target: 'tdang' }]);
  fs.symlinkSync('nowhere', path.join(fixture.tree, 'tdang'));
  const lines = assertRefusedByBoth(fixture, 'up links to tdang, which does not exist, and overlay tool writes under it');
  assert.equal(lines[0], '  a write under a link to a link that does not resolve has no folder to land in, so apply writes nothing');
  assert.equal(lines[1], setAsideNext(fixture, 'tdang'));
  assert.equal(kindOf(path.join(fixture.tree, 'up')), 'missing');
  setAsideAndApply(fixture, 'tdang');
  assert.equal(fs.readlinkSync(path.join(fixture.tree, 'tdang.keep')), 'nowhere');
});

// A moved link with another layout link inside it: the apply that moves the
// outer link alone reports the inner one, which the next apply makes.
test('a moved layout link with a layout link inside it names the inner link in its Next line, and the sequence ends in sync', (t) => {
  const entry = { ...DIRECTORY_ENTRY, destination: 'a/b/tool' };
  const links = [{ path: 'a', target: 'target' }, { path: 'a/b', target: 'sub' }];
  const fixture = createShapeFixture(t, [entry], links);
  fs.mkdirSync(path.join(fixture.tree, 'target', 'sub'));
  fs.mkdirSync(path.join(fixture.tree, 'target2', 'sub'), { recursive: true });
  applyOk(fixture);
  const moved = [{ path: 'a', target: 'target2' }, { path: 'a/b', target: 'sub' }];
  fixture.setManifest([entry], moved);
  const lines = assertRefusedByBoth(fixture, 'a moves from target to target2, and overlay tool writes under it');
  assert.match(lines[1], new RegExp(`^ {2}Next: take overlay tool out of .*overlay-manifest\\.json, run ${ENGINE_LINE} apply from .*\\/tree ` +
    'to move the link alone, then put the entry back and run apply again, which makes a/b if the first apply reports it$'));
  fixture.setManifest([], moved);
  const alone = fixture.run(['apply']);
  assert.equal(alone.code, 1, alone.output);
  assert.match(alone.output, /^overlay-edited a\/b {2}\(layout link\)/m, alone.output);
  assert.equal(fs.readlinkSync(path.join(fixture.tree, 'a')), 'target2');
  fixture.setManifest([entry], moved);
  applyOk(fixture);
  const status = fixture.run(['status']);
  assert.equal(status.code, 0, status.output);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'target2', 'sub', 'tool', 'a.md'), 'utf8'), 'bundle a\n');
});

// A moved link that another layout link reads through, both made by earlier
// applies: an entry under the other link writes through the moved one, so it
// would land in the old target as surely as an entry under the moved link.
test('a moved layout link that another layout link reads through, with an entry under that link, is refused and its Next sequence ends in sync', (t) => {
  const links = [{ path: 'inner', target: 'target' }, { path: 'up', target: 'inner' }];
  const fixture = createShapeFixture(t, [], links.slice(0, 1));
  writeFile(fixture.tree, 'target2/other.md', 'second target\n');
  applyOk(fixture);
  fixture.setManifest([UP_ENTRY], links);
  applyOk(fixture);
  assert.equal(fixture.run(['status']).code, 0);
  const moved = [{ path: 'inner', target: 'target2' }, { path: 'up', target: 'inner' }];
  fixture.setManifest([UP_ENTRY], moved);
  writeFile(fixture.overlayDir, 'bundle/a.md', 'bundle a two\n');
  const oldTarget = snapshot(path.join(fixture.tree, 'target'));
  const newTarget = snapshot(path.join(fixture.tree, 'target2'));
  assertMovedLinkLines(assertRefusedByBoth(fixture, 'inner moves from target to target2, and overlay tool writes under it'),
    'target', 'target2');
  assert.equal(fs.readlinkSync(path.join(fixture.tree, 'inner')), 'target');
  assert.deepEqual(snapshot(path.join(fixture.tree, 'target')), oldTarget);
  assert.deepEqual(snapshot(path.join(fixture.tree, 'target2')), newTarget);
  moveLinkAlone(fixture, [UP_ENTRY], moved);
  assert.equal(fs.readlinkSync(path.join(fixture.tree, 'inner')), 'target2');
  assert.deepEqual(snapshot(path.join(fixture.tree, 'target')), oldTarget);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'target2', 'tool', 'a.md'), 'utf8'), 'bundle a two\n');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'target2', 'other.md'), 'utf8'), 'second target\n');
});

// On a volume that ignores case, the link recorded as up is the one the
// manifest now spells UP, so it is moved like any link the engine made.
test('a recorded layout link the manifest spells in another case is moved on a volume that ignores case', (t) => {
  const fixture = createShapeFixture(t, [], [{ path: 'up', target: 'target' }]);
  if (!isCaseInsensitive(fixture.workspace)) {
    t.skip('the volume tells case apart, so up and UP are two paths');
    return;
  }
  writeFile(fixture.tree, 'target2/other.md', 'second target\n');
  applyOk(fixture);
  fixture.setManifest([], [{ path: 'UP', target: 'target2' }]);
  const status = fixture.run(['status']);
  assert.equal(status.code, 1, status.output);
  assert.equal(status.output.includes('exists but is not the link'), false, status.output);
  const result = applyOk(fixture);
  assert.match(result.output, /linked UP -> target2/, result.output);
  assert.equal(fs.readlinkSync(path.join(fixture.tree, 'UP')), 'target2');
  assert.equal(fixture.run(['status']).code, 0);
});

test('a recorded layout link the manifest spells in another case and moves, with an entry under it, is refused on a volume that ignores case', (t) => {
  const fixture = createShapeFixture(t, [UP_ENTRY], [{ path: 'up', target: 'target' }]);
  if (!isCaseInsensitive(fixture.workspace)) {
    t.skip('the volume tells case apart, so up and UP are two paths');
    return;
  }
  writeFile(fixture.tree, 'target2/other.md', 'second target\n');
  applyOk(fixture);
  fixture.setManifest([UP_ENTRY], [{ path: 'UP', target: 'target2' }]);
  assertMovedLinkLines(assertRefusedByBoth(fixture, 'UP moves from target to target2, and overlay tool writes under it'),
    'target', 'target2');
  assert.equal(fs.readlinkSync(path.join(fixture.tree, 'up')), 'target');
});

// An apply stopped by a destination that needs its own fix says it wrote
// nothing, as every other refusal does.
test('an apply stopped by a live edit says it wrote nothing', (t) => {
  const fixture = createShapeFixture(t, [DIRECTORY_ENTRY]);
  applyOk(fixture);
  writeFile(fixture.tree, 'tool/a.md', 'edited live\n');
  const result = fixture.run(['apply']);
  assert.equal(result.code, 1, result.output);
  assert.match(result.output, /^live-edited tool\/a\.md /m, result.output);
  assert.match(result.output, /^ {2}this apply wrote nothing: a destination above stops it before any write$/m, result.output);
  assert.match(result.output, new RegExp(`^ {2}Next: run the fix on each line above, then from .*\\/tree: ${ENGINE_LINE} apply$`, 'm'), result.output);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'tool', 'a.md'), 'utf8'), 'edited live\n');
});
