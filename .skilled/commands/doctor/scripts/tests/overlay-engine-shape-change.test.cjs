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
