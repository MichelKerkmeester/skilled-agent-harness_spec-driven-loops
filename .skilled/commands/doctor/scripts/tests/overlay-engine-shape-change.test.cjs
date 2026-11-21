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
  fixture.run(['apply']);
  assert.equal(kindOf(path.join(fixture.tree, 'tool')), 'link');
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
  assert.match(result.output, /Next: mv tool tool\.keep && node \S+overlay-engine\.cjs apply/);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'tool', 'project.md'), 'utf8'), 'project file\n');
});

test('an unowned file where a directory entry writes is refused, and nothing is written', (t) => {
  const fixture = createShapeFixture(t, [DIRECTORY_ENTRY]);
  writeFile(fixture.tree, 'tool', 'project file\n');
  const result = fixture.run(['apply']);
  assert.notEqual(result.code, 0, result.output);
  assert.match(result.output, /tool is a file that does not match what apply last wrote there/);
  assert.match(result.output, /Next: mv tool tool\.keep && node \S+overlay-engine\.cjs apply/);
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
