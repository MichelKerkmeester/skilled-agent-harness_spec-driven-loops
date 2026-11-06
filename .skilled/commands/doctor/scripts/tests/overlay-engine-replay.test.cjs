// ───────────────────────────────────────────────────────────────────
// MODULE: Overlay Engine Layout-Link And Removal Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Layout links that replace a pinned upstream link, and remove-root rows that
// delete named paths without ever leaving the tree. `status` carries the full
// check, so its check lines and totals are asserted here.

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const { createWorkspace, runEngine, writeManifest } = require('./overlay-engine-fixtures.cjs');

const PINNED = '../skills/hub/changelog';

function createFixture(t, upstreamTarget) {
  const fixture = createWorkspace(t, 'overlay-engine-replay-');
  const { tree } = fixture;
  fs.mkdirSync(path.join(tree, 'skills', 'hub', 'mode', 'changelog'), { recursive: true });
  fs.mkdirSync(path.join(tree, 'changelog'), { recursive: true });
  fs.symlinkSync(upstreamTarget, path.join(tree, 'changelog', 'hub'));
  const replaces = { path: 'changelog/hub', target: PINNED };
  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', commit: '0000000' },
    layoutLinks: [
      { path: 'changelog/hub/parent', target: '../../skills/hub/changelog', replaces },
      { path: 'changelog/hub/mode', target: '../../skills/hub/mode/changelog', replaces },
    ],
    overlays: [],
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  const run = (command) => runEngine([command, '--root', tree], fixture.workspace);
  return { tree, run };
}

function createRemovalFixture(t, paths) {
  const fixture = createWorkspace(t, 'overlay-engine-removal-');
  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', commit: '0000000' },
    layoutLinks: [],
    overlays: [{
      id: 'removal-test',
      scope: 'remove-root',
      paths: typeof paths === 'function' ? paths(fixture.workspace) : paths,
      reason: 'Remove the named fixture paths.',
    }],
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  const run = (command) => runEngine([command, '--root', fixture.tree], fixture.workspace);
  return { workspace: fixture.workspace, tree: fixture.tree, run };
}

test('a layout link replaces the named upstream link while it holds the pinned target', (t) => {
  const { tree, run } = createFixture(t, PINNED);
  const before = run('status');
  assert.equal(before.code, 1);
  assert.match(before.stdout, /changelog\/hub\/parent is missing/);

  const first = run('apply');
  assert.equal(first.code, 0, first.stdout);
  const hub = path.join(tree, 'changelog', 'hub');
  assert.ok(fs.lstatSync(hub).isDirectory() && !fs.lstatSync(hub).isSymbolicLink());
  assert.equal(fs.readlinkSync(path.join(hub, 'parent')), '../../skills/hub/changelog');
  assert.equal(fs.readlinkSync(path.join(hub, 'mode')), '../../skills/hub/mode/changelog');
  assert.equal(fs.realpathSync(path.join(hub, 'mode')), fs.realpathSync(path.join(tree, 'skills', 'hub', 'mode', 'changelog')));

  const second = run('apply');
  assert.equal(second.code, 0, second.stdout);
  assert.match(second.stdout, /^0 changed$/m);
  const after = run('status');
  assert.equal(after.code, 0, after.stdout);
  assert.match(after.stdout, /RESULT: PASSED/);
});

test('an upstream link whose target differs from the pinned value is refused and left alone', (t) => {
  const { tree, run } = createFixture(t, '../skills/elsewhere/changelog');
  const applied = run('apply');
  assert.equal(applied.code, 1);
  assert.match(applied.stdout, /BLOCKED  layout: changelog\/hub links to \.\.\/skills\/elsewhere\/changelog, not the pinned/);
  assert.match(applied.stdout, /changed=0/);
  const hub = path.join(tree, 'changelog', 'hub');
  assert.ok(fs.lstatSync(hub).isSymbolicLink());
  assert.equal(fs.readlinkSync(hub), '../skills/elsewhere/changelog');
  const checked = run('status');
  assert.equal(checked.code, 1);
  assert.match(checked.stdout, /RESULT: FAILED/);
});

test('remove-root checks each present path, removes directories, files and symlinks, then becomes a no-op', (t) => {
  const { workspace, tree, run } = createRemovalFixture(t, ['obsolete', 'retired.txt', 'linked.txt']);
  const nested = path.join(tree, 'obsolete', 'nested');
  const outside = path.join(workspace, 'outside.txt');
  fs.mkdirSync(nested, { recursive: true });
  fs.writeFileSync(path.join(nested, 'keep.md'), 'remove this file\n');
  fs.writeFileSync(path.join(tree, 'retired.txt'), 'remove this file too\n');
  fs.writeFileSync(outside, 'keep the symlink target\n');
  fs.symlinkSync(outside, path.join(tree, 'linked.txt'));

  const before = run('status');
  assert.equal(before.code, 1, before.stdout);
  assert.match(before.stdout, /MISS\s+removal-test: obsolete is still present/);
  assert.match(before.stdout, /MISS\s+removal-test: retired\.txt is still present/);
  assert.match(before.stdout, /MISS\s+removal-test: linked\.txt is still present/);
  assert.match(before.stdout, /checked=4 ok=1 miss=3/);

  const first = run('apply');
  assert.equal(first.code, 0, first.stdout);
  assert.equal(fs.existsSync(path.join(tree, 'obsolete')), false);
  assert.equal(fs.existsSync(path.join(tree, 'retired.txt')), false);
  assert.equal(fs.existsSync(path.join(tree, 'linked.txt')), false);
  assert.equal(fs.readFileSync(outside, 'utf8'), 'keep the symlink target\n');

  const after = run('status');
  assert.equal(after.code, 0, after.stdout);
  assert.match(after.stdout, /RESULT: PASSED/);
  assert.match(after.stdout, /checked=4 ok=4 miss=0/);

  const second = run('apply');
  assert.equal(second.code, 0, second.stdout);
  assert.match(second.stdout, /0 changed$/m);
});

test('remove-root treats absent paths as a no-op', (t) => {
  const { run } = createRemovalFixture(t, ['missing/deep/path']);
  const checked = run('status');
  assert.equal(checked.code, 0, checked.stdout);
  assert.match(checked.stdout, /checked=2 ok=2 miss=0/);

  const applied = run('apply');
  assert.equal(applied.code, 0, applied.stdout);
  assert.match(applied.stdout, /0 changed$/m);
});

test('remove-root rejects parent traversal and absolute paths without deleting any target', (t) => {
  for (const pathKind of ['parent', 'absolute']) {
    const { workspace, tree, run } = createRemovalFixture(t, (root) => [
      'keep.txt',
      pathKind === 'parent' ? '../outside.txt' : path.join(root, 'outside.txt'),
    ]);
    const outside = path.join(workspace, 'outside.txt');
    fs.writeFileSync(path.join(tree, 'keep.txt'), 'must remain\n');
    fs.writeFileSync(outside, 'must also remain\n');

    const applied = run('apply');
    assert.equal(applied.code, 1, applied.stdout);
    assert.match(applied.stdout, /BLOCKED\s+removal-test:/);
    assert.equal(fs.readFileSync(path.join(tree, 'keep.txt'), 'utf8'), 'must remain\n');
    assert.equal(fs.readFileSync(outside, 'utf8'), 'must also remain\n');
  }
});

test('remove-root follows only symlinked parents that stay inside the tree', (t) => {
  const { workspace, tree, run } = createRemovalFixture(t, ['alias/inside.txt']);
  const inside = path.join(tree, 'inside');
  const outside = path.join(workspace, 'outside');
  fs.mkdirSync(inside);
  fs.mkdirSync(outside);
  fs.writeFileSync(path.join(inside, 'inside.txt'), 'remove through the in-tree alias\n');
  fs.writeFileSync(path.join(outside, 'outside.txt'), 'keep outside the tree\n');
  fs.symlinkSync(inside, path.join(tree, 'alias'));

  const applied = run('apply');
  assert.equal(applied.code, 0, applied.stdout);
  assert.equal(fs.existsSync(path.join(inside, 'inside.txt')), false);
  assert.equal(fs.lstatSync(path.join(tree, 'alias')).isSymbolicLink(), true);

  const external = createRemovalFixture(t, ['redirect/outside.txt']);
  const externalDirectory = path.join(external.workspace, 'outside');
  fs.mkdirSync(externalDirectory);
  fs.writeFileSync(path.join(externalDirectory, 'outside.txt'), 'keep outside the tree\n');
  fs.symlinkSync(externalDirectory, path.join(external.tree, 'redirect'));
  const refused = external.run('apply');
  assert.equal(refused.code, 1, refused.stdout);
  assert.match(refused.stdout, /symlink parent/);
  assert.equal(fs.readFileSync(path.join(externalDirectory, 'outside.txt'), 'utf8'), 'keep outside the tree\n');
});
