// ───────────────────────────────────────────────────────────────────
// MODULE: Overlay Engine Sync Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Destination states, apply, capture and guard across every scope. `status`
// is the one read-only report and doubles as the pre-commit check, so it exits
// 1 whenever any destination is out of sync.

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { spawnSync } = require('node:child_process');

const {
  createSyncFixture: createFixture,
  createWorkspace,
  readJson,
  runEngine,
  sha256,
  writeFile,
  writeManifest,
} = require('./overlay-engine-fixtures.cjs');

const engine = require('../overlay-engine.cjs');

function seedState(fixture) {
  const result = fixture.run(['apply']);
  assert.equal(result.code, 0, result.output);
  return result;
}

function addRemovedFolder(fixture, removed = 'retired') {
  const entry = fixture.manifest.overlays.find((item) => item.id === 'skill-root');
  entry.remove = [removed];
  writeManifest(fixture);
  return entry;
}

test('clean apply records every managed file and a second apply is a no-op', (t) => {
  const fixture = createFixture(t);
  const first = seedState(fixture);
  assert.equal(first.output.trim(), '5 changed');

  const second = fixture.run(['apply']);
  assert.equal(second.code, 0, second.output);
  assert.equal(second.output.trim(), '0 changed');

  const state = readJson(fixture.statePath);
  assert.equal(state.schemaVersion, 2);
  assert.equal(state.pin, 'pin-one');
  assert.equal(Object.keys(state.files).length, 6);
  assert.equal(
    fs.readFileSync(path.join(fixture.tree, 'skill/docs/vendor-guide.md'), 'utf8'),
    'retained nested vendor file\n',
  );
  const status = fixture.run(['status']);
  assert.equal(status.code, 0, status.output);
  assert.match(status.output, /in-sync=6 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0/);
  assert.match(status.output, /RESULT: PASSED/);
});

test('overlay edits apply through file, directory, marked-section, and json-entry plans', (t) => {
  const fixture = createFixture(t);
  seedState(fixture);

  writeFile(fixture.overlayDir, 'files/guarded.txt', 'overlay two\n');
  writeFile(fixture.overlayDir, 'directory-source/readme.md', 'directory two\n');
  writeFile(fixture.overlayDir, 'marked/block.md',
    '\n<!-- BEGIN BLOCK -->\nnew block\n<!-- END BLOCK -->\n');
  const operations = readJson(path.join(fixture.overlayDir, 'json/entries.json'));
  operations.operations[0].entries.push({ key: 'visible', value: true });
  writeFile(fixture.overlayDir, 'json/entries.json', JSON.stringify(operations, null, 2) + '\n');

  const status = fixture.run(['status']);
  assert.equal(status.code, 1, status.output);
  assert.match(status.output, /overlay-edited guarded\.txt/);
  assert.match(status.output, /overlay-edited directory-live\/readme\.md/);
  assert.match(status.output, /overlay-edited marked\.md/);
  assert.match(status.output, /overlay-edited settings\.json/);
  assert.match(status.output, /overlay-engine\.cjs apply/);

  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  assert.equal(applied.output.trim(), '4 changed');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'guarded.txt'), 'utf8'), 'overlay two\n');
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'directory-live/readme.md'), 'utf8'), 'directory two\n');
  assert.match(fs.readFileSync(path.join(fixture.tree, 'marked.md'), 'utf8'), /new block/);
  assert.deepEqual(readJson(path.join(fixture.tree, 'settings.json')), {
    name: 'widget',
    enabled: true,
    visible: true,
  });
  assert.equal(fixture.run(['status']).code, 0);
});

test('live edits stop apply and status, then capture updates directory and marked-section sources', (t) => {
  const fixture = createFixture(t);
  seedState(fixture);
  const originalState = fs.readFileSync(fixture.statePath, 'utf8');

  writeFile(fixture.tree, 'directory-live/readme.md', 'hand edit\n');
  const status = fixture.run(['status']);
  assert.equal(status.code, 1, status.output);
  assert.match(status.output, /live-edited directory-live\/readme\.md/);

  const apply = fixture.run(['apply']);
  assert.equal(apply.code, 1, apply.output);
  assert.match(apply.output, /overlay-engine\.cjs apply --capture directory-live\/readme\.md/);
  assert.equal(fs.readFileSync(fixture.statePath, 'utf8'), originalState);

  const capturedDirectory = fixture.run(['apply', '--capture', 'directory-live/readme.md']);
  assert.equal(capturedDirectory.code, 0, capturedDirectory.output);
  assert.equal(fs.readFileSync(path.join(fixture.overlayDir, 'directory-source/readme.md'), 'utf8'), 'hand edit\n');

  const changedMarked = '# Header\n\n<!-- BEGIN BLOCK -->\nhand-edited block\n<!-- END BLOCK -->\n';
  writeFile(fixture.tree, 'marked.md', changedMarked);
  const capturedMarked = fixture.run(['apply', '--capture', 'marked.md']);
  assert.equal(capturedMarked.code, 0, capturedMarked.output);
  assert.equal(
    fs.readFileSync(path.join(fixture.overlayDir, 'marked/block.md'), 'utf8'),
    '<!-- BEGIN BLOCK -->\nhand-edited block\n<!-- END BLOCK -->\n',
  );
  writeFile(fixture.tree, 'directory-live/new/nested.md', 'new owned file\n');
  const capturedNewFile = fixture.run(['apply', '--capture', 'directory-live/new/nested.md']);
  assert.equal(capturedNewFile.code, 0, capturedNewFile.output);
  assert.equal(
    fs.readFileSync(path.join(fixture.overlayDir, 'directory-source/new/nested.md'), 'utf8'),
    'new owned file\n',
  );
  const finalStatus = fixture.run(['status']);
  assert.equal(finalStatus.code, 0, finalStatus.output);
  assert.match(finalStatus.output, /in-sync=7 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0/);
});

test('capture is a no-op for an in-sync destination', (t) => {
  const fixture = createFixture(t);
  seedState(fixture);
  const sourceBefore = fs.readFileSync(path.join(fixture.overlayDir, 'marked/block.md'), 'utf8');
  const stateBefore = fs.readFileSync(fixture.statePath, 'utf8');

  const captured = fixture.run(['apply', '--capture', 'marked.md']);
  assert.equal(captured.code, 0, captured.output);
  assert.equal(captured.output.trim(), 'nothing to capture');
  assert.equal(fs.readFileSync(path.join(fixture.overlayDir, 'marked/block.md'), 'utf8'), sourceBefore);
  assert.equal(fs.readFileSync(fixture.statePath, 'utf8'), stateBefore);
});

test('capture refuses a both-changed destination without writing', (t) => {
  const fixture = createFixture(t);
  seedState(fixture);
  writeFile(fixture.tree, 'guarded.txt', 'live side\n');
  writeFile(fixture.overlayDir, 'files/guarded.txt', 'overlay side\n');
  const stateBefore = fs.readFileSync(fixture.statePath, 'utf8');
  const apply = fixture.run(['apply']);

  const captured = fixture.run(['apply', '--capture', 'guarded.txt']);
  assert.equal(captured.code, 1, captured.output);
  assert.equal(captured.output, apply.output);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'guarded.txt'), 'utf8'), 'live side\n');
  assert.equal(fs.readFileSync(path.join(fixture.overlayDir, 'files/guarded.txt'), 'utf8'), 'overlay side\n');
  assert.equal(fs.readFileSync(fixture.statePath, 'utf8'), stateBefore);
});

test('capture refuses an upstream-moved destination without writing', (t) => {
  const fixture = createFixture(t);
  seedState(fixture);
  fixture.manifest.pin.commit = 'pin-two';
  writeManifest(fixture);
  writeFile(fixture.tree, 'guarded.txt', 'new upstream bytes\n');
  const stateBefore = fs.readFileSync(fixture.statePath, 'utf8');
  const apply = fixture.run(['apply']);

  const captured = fixture.run(['apply', '--capture', 'guarded.txt']);
  assert.equal(captured.code, 1, captured.output);
  assert.equal(captured.output, apply.output);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'guarded.txt'), 'utf8'), 'new upstream bytes\n');
  assert.equal(fs.readFileSync(path.join(fixture.overlayDir, 'files/guarded.txt'), 'utf8'), 'overlay one\n');
  assert.equal(fs.readFileSync(fixture.statePath, 'utf8'), stateBefore);
});

test('both-sides changes stop apply without changing live, overlay, or sync state', (t) => {
  const fixture = createFixture(t);
  seedState(fixture);
  writeFile(fixture.tree, 'guarded.txt', 'live side\n');
  writeFile(fixture.overlayDir, 'files/guarded.txt', 'overlay side\n');
  const stateBefore = fs.readFileSync(fixture.statePath, 'utf8');

  const status = fixture.run(['status']);
  assert.equal(status.code, 1, status.output);
  assert.match(status.output, /both-changed guarded\.txt/);

  const apply = fixture.run(['apply']);
  assert.equal(apply.code, 1, apply.output);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'guarded.txt'), 'utf8'), 'live side\n');
  assert.equal(fs.readFileSync(path.join(fixture.overlayDir, 'files/guarded.txt'), 'utf8'), 'overlay side\n');
  assert.equal(fs.readFileSync(fixture.statePath, 'utf8'), stateBefore);
});

test('a moved pin marks a changed live destination upstream-moved and blocks writes', (t) => {
  const fixture = createFixture(t);
  seedState(fixture);
  fixture.manifest.pin.commit = 'pin-two';
  writeManifest(fixture);
  writeFile(fixture.tree, 'guarded.txt', 'new upstream bytes\n');
  const stateBefore = fs.readFileSync(fixture.statePath, 'utf8');

  const status = fixture.run(['status']);
  assert.equal(status.code, 1, status.output);
  assert.match(status.output, /upstream-moved guarded\.txt/);

  const apply = fixture.run(['apply']);
  assert.equal(apply.code, 1, apply.output);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'guarded.txt'), 'utf8'), 'new upstream bytes\n');
  assert.equal(fs.readFileSync(fixture.statePath, 'utf8'), stateBefore);
});

test('a missing applied file is overlay-edited and restored', (t) => {
  const fixture = createFixture(t);
  seedState(fixture);
  fs.unlinkSync(path.join(fixture.tree, 'guarded.txt'));

  const status = fixture.run(['status']);
  assert.equal(status.code, 1, status.output);
  assert.match(status.output, /overlay-edited guarded\.txt/);

  const apply = fixture.run(['apply']);
  assert.equal(apply.code, 0, apply.output);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'guarded.txt'), 'utf8'), 'overlay one\n');
});

test('remove-root reports pending paths, blocks guard and capture, and drops retired state after apply', (t) => {
  const fixture = createFixture(t);
  seedState(fixture);
  assert.ok(Object.hasOwn(readJson(fixture.statePath).files, 'guarded.txt'));
  assert.ok(Object.hasOwn(readJson(fixture.statePath).files, 'directory-live/readme.md'));
  writeFile(fixture.tree, 'directory-live/design-tokens.json', 'design token reference data\n');

  fixture.manifest.overlays = fixture.manifest.overlays.filter((entry) =>
    !['guarded-file', 'directory-files'].includes(entry.id));
  fixture.manifest.overlays.push({
    id: 'retired-frontends',
    scope: 'remove-root',
    paths: ['guarded.txt', 'directory-live'],
    reason: 'Remove retired overlay destinations.',
  });
  writeManifest(fixture);

  const status = fixture.run(['status']);
  assert.equal(status.code, 1, status.output);
  assert.match(status.output, /overlay-edited guarded\.txt {2}\(remove-root row: retired-frontends\)/);
  assert.match(status.output, /overlay-edited directory-live {2}\(remove-root row: retired-frontends\)/);
  assert.match(status.output, /in-sync=4 overlay-edited=2 live-edited=0 both-changed=0 upstream-moved=0/);

  const guarded = fixture.run(['--guard', 'directory-live/readme.md'], fixture.tree);
  assert.equal(guarded.code, 1, guarded.output);
  assert.match(guarded.output, /scheduled for removal by remove-root row retired-frontends/);
  const capture = fixture.run(['apply', '--capture', 'guarded.txt']);
  assert.equal(capture.code, 2, capture.output);
  assert.match(capture.output, /scheduled for removal by remove-root row retired-frontends/);

  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  assert.equal(fs.existsSync(path.join(fixture.tree, 'guarded.txt')), false);
  assert.equal(fs.existsSync(path.join(fixture.tree, 'directory-live')), false);
  assert.equal(fs.existsSync(path.join(fixture.tree, 'directory-live/design-tokens.json')), false);
  const state = readJson(fixture.statePath);
  assert.equal(Object.hasOwn(state.files, 'guarded.txt'), false);
  assert.equal(Object.hasOwn(state.files, 'directory-live/readme.md'), false);
  assert.equal(Object.keys(state.files).length, 4);

  const settled = fixture.run(['status']);
  assert.equal(settled.code, 0, settled.output);
  assert.match(settled.output, /in-sync=6 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0/);
  assert.equal(fixture.run(['apply']).output.trim(), '0 changed');

  const guardedAfterRemoval = fixture.run(['--guard', 'guarded.txt'], fixture.tree);
  assert.equal(guardedAfterRemoval.code, 1, guardedAfterRemoval.output);
  assert.match(guardedAfterRemoval.output, /remove-root row retired-frontends/);
  const captureAfterRemoval = fixture.run(['apply', '--capture', 'guarded.txt']);
  assert.equal(captureAfterRemoval.code, 2, captureAfterRemoval.output);
  assert.match(captureAfterRemoval.output, /remove-root row retired-frontends/);
});

test('an upstream file added inside a removed folder is overlay-edited and apply deletes it', (t) => {
  const fixture = createFixture(t);
  seedState(fixture);
  addRemovedFolder(fixture);
  writeFile(fixture.tree, 'skill/retired/notes.md', 'upstream addition\n');
  writeFile(fixture.tree, 'skill/retired/nested/deep.md', 'upstream addition deeper\n');

  const status = fixture.run(['status']);
  assert.equal(status.code, 1, status.output);
  assert.match(status.output, /overlay-edited skill\/retired\/notes\.md {2}\(overlay: skilled-overlays\/skill-root-source\/retired\/notes\.md\)/);
  assert.match(status.output, /overlay-edited skill\/retired\/nested\/deep\.md/);
  assert.match(status.output, /overlay-edited=2 live-edited=0 both-changed=0 upstream-moved=0/);
  assert.doesNotMatch(status.output, /apply --capture skill\/retired/);

  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  assert.equal(applied.output.trim(), '2 changed');
  assert.equal(fs.existsSync(path.join(fixture.tree, 'skill/retired/notes.md')), false);
  assert.equal(fs.existsSync(path.join(fixture.tree, 'skill/retired/nested/deep.md')), false);

  const settled = fixture.run(['status']);
  assert.equal(settled.code, 0, settled.output);
  assert.match(settled.output, /RESULT: PASSED/);
});

test('a replace-listed file inside a removed folder stays overlay-owned', (t) => {
  const fixture = createFixture(t);
  seedState(fixture);
  const entry = addRemovedFolder(fixture);
  entry.replace = ['SKILL.md', 'docs', 'retired/keep.md'];
  writeManifest(fixture);
  writeFile(fixture.overlayDir, 'skill-root-source/retired/keep.md', 'overlay keep\n');
  writeFile(fixture.tree, 'skill/retired/keep.md', 'upstream keep\n');
  writeFile(fixture.tree, 'skill/retired/drop.md', 'upstream drop\n');

  const status = fixture.run(['status']);
  assert.equal(status.code, 1, status.output);
  assert.match(status.output, /overlay-edited skill\/retired\/keep\.md/);
  assert.match(status.output, /overlay-edited skill\/retired\/drop\.md/);
  assert.doesNotMatch(status.output, /^live-edited /m);

  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'skill/retired/keep.md'), 'utf8'), 'overlay keep\n');
  assert.equal(fs.existsSync(path.join(fixture.tree, 'skill/retired/drop.md')), false);

  writeFile(fixture.tree, 'skill/retired/keep.md', 'hand edit\n');
  const captured = fixture.run(['apply', '--capture', 'skill/retired/keep.md']);
  assert.equal(captured.code, 0, captured.output);
  assert.equal(
    fs.readFileSync(path.join(fixture.overlayDir, 'skill-root-source/retired/keep.md'), 'utf8'),
    'hand edit\n',
  );
  assert.equal(fixture.run(['status']).code, 0);
});

test('capture refuses a path under a removed folder without writing into the overlay', (t) => {
  const fixture = createFixture(t);
  seedState(fixture);
  addRemovedFolder(fixture);
  writeFile(fixture.tree, 'skill/retired/notes.md', 'upstream addition\n');
  const stateBefore = fs.readFileSync(fixture.statePath, 'utf8');

  const captured = fixture.run(['apply', '--capture', 'skill/retired/notes.md']);
  assert.equal(captured.code, 2, captured.output);
  assert.match(captured.output, /skill\/retired\/notes\.md is scheduled for removal by overlay skill-root; capture is not supported/);
  assert.equal(fs.existsSync(path.join(fixture.overlayDir, 'skill-root-source/retired')), false);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'skill/retired/notes.md'), 'utf8'), 'upstream addition\n');
  assert.equal(fs.readFileSync(fixture.statePath, 'utf8'), stateBefore);
});

test('guard resolves cwd-relative paths and capture refuses unknown, protected, and json-entry destinations', (t) => {
  const fixture = createFixture(t);
  seedState(fixture);

  const refused = fixture.run(['--guard', 'guarded.txt'], fixture.tree);
  assert.equal(refused.code, 1, refused.output);
  assert.match(refused.output, /refuse: guarded\.txt is owned by skilled-overlays\/files\/guarded\.txt/);
  assert.match(refused.output, /then run node \.skilled\/commands\/doctor\/scripts\/overlay-engine\.cjs apply/);

  const allowed = fixture.run(['--guard', path.join(fixture.tree, 'unowned.txt')]);
  assert.equal(allowed.code, 0, allowed.output);
  assert.equal(allowed.output.trim(), 'allow');

  fixture.manifest.overlays.push({
    id: 'env-file',
    scope: 'file',
    source: 'private/.env.local',
    destination: '.env.local',
  });
  writeManifest(fixture);

  const unknown = fixture.run(['apply', '--capture', 'outside.txt']);
  assert.equal(unknown.code, 2, unknown.output);
  assert.match(unknown.output, /not an overlay destination/);
  const env = fixture.run(['apply', '--capture', '.env.local']);
  assert.equal(env.code, 2, env.output);
  assert.match(env.output, /protected capture path/);
  // A token-named file inside a walked folder is never named by an entry, so
  // capture refuses to copy it into the overlay folder.
  const token = fixture.run(['apply', '--capture', 'directory-live/access-token.txt']);
  assert.equal(token.code, 2, token.output);
  assert.match(token.output, /protected capture path/);
  const json = fixture.run(['apply', '--capture', 'settings.json']);
  assert.equal(json.code, 2, json.output);
  assert.match(json.output, /edit skilled-overlays\/json\/entries\.json instead/);
});

test('a missing layout link is reported as overlay-edited and created by apply', (t) => {
  const fixture = createFixture(t);
  seedState(fixture);

  fixture.manifest.layoutLinks = [{ path: 'skills', target: '../directory-source' }];
  writeManifest(fixture);

  const status = fixture.run(['status']);
  assert.equal(status.code, 1, status.output);
  assert.match(status.output, /overlay-edited skills {2}\(layout link\)/);
  assert.match(status.output, /overlay-edited=1/);

  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  assert.match(applied.output, /linked skills -> \.\.\/directory-source/);
  assert.equal(applied.output.trim().split('\n').pop(), '1 changed');
  assert.equal(fs.readlinkSync(path.join(fixture.tree, 'skills')), '../directory-source');

  const settled = fixture.run(['status']);
  assert.equal(settled.code, 0, settled.output);
  assert.doesNotMatch(settled.output, /layout link/);
  assert.match(settled.output, /in-sync=6 overlay-edited=0/);
});

test('an edited json-entry item re-applies over the applied bytes and refuses once the live file moved', (t) => {
  const fixture = createFixture(t);
  const registryPath = path.join(fixture.tree, 'registry.json');
  const registrySeed = '{\n  "hooks": [\n    {\n      "id": "session-start",\n      "event": "SessionStart",\n      "slot": 0\n    }\n  ]\n}\n';
  const entrySet = (slot) => ({
    target: 'registry.json',
    style: { indent: 2, primitiveArrays: 'multiline' },
    operations: [{
      op: 'appendItems',
      path: ['hooks'],
      identityKey: 'id',
      items: [{ id: 'guard', event: 'PreToolUse', slot }],
    }],
  });
  const editEntrySet = (slot) => writeFile(fixture.overlayDir, 'json/registry.json', JSON.stringify(entrySet(slot), null, 2) + '\n');
  const readRegistry = () => readJson(registryPath);

  writeFile(fixture.tree, 'registry.json', registrySeed);
  editEntrySet(0);
  fixture.manifest.overlays.push({
    id: 'hook-registry',
    scope: 'json-entry',
    source: 'json/registry.json',
    destination: 'registry.json',
    pinnedSha256: sha256(Buffer.from(registrySeed)),
  });
  writeManifest(fixture);

  const seeded = fixture.run(['apply']);
  assert.equal(seeded.code, 0, seeded.output);
  assert.equal(seeded.output.trim(), '6 changed');
  assert.deepEqual(readRegistry(), {
    hooks: [
      { id: 'session-start', event: 'SessionStart', slot: 0 },
      { id: 'guard', event: 'PreToolUse', slot: 0 },
    ],
  });

  editEntrySet(5);
  const edited = fixture.run(['status']);
  assert.equal(edited.code, 1, edited.output);
  assert.match(edited.output, /overlay-edited registry\.json {2}\(overlay: skilled-overlays\/json\/registry\.json\)/);

  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  assert.equal(applied.output.trim(), '1 changed');
  assert.deepEqual(readRegistry(), {
    hooks: [
      { id: 'session-start', event: 'SessionStart', slot: 0 },
      { id: 'guard', event: 'PreToolUse', slot: 5 },
    ],
  });
  assert.equal(fixture.run(['apply']).output.trim(), '0 changed');

  writeFile(fixture.tree, 'registry.json', fs.readFileSync(registryPath, 'utf8').replace('"slot": 0', '"slot": 3'));
  editEntrySet(7);
  const liveBefore = fs.readFileSync(registryPath, 'utf8');
  const stateBefore = fs.readFileSync(fixture.statePath, 'utf8');

  const conflicted = fixture.run(['status']);
  assert.equal(conflicted.code, 1, conflicted.output);
  // A hand edit in the live file is never overwritten, and the report names the
  // entry set that owns the destination so the conflict can be resolved there.
  assert.match(conflicted.output, /both-changed registry\.json {2}\(overlay: skilled-overlays\/json\/registry\.json\)/);

  const refused = fixture.run(['apply']);
  assert.equal(refused.code, 1, refused.output);
  assert.match(refused.output, /resolve skilled-overlays\/json\/registry\.json and registry\.json/);
  assert.equal(fs.readFileSync(registryPath, 'utf8'), liveBefore);
  assert.equal(fs.readFileSync(fixture.statePath, 'utf8'), stateBefore);
});

test('an edited json-entry object key re-applies over the applied bytes and refuses once the live file moved', (t) => {
  const fixture = createFixture(t);
  const routerPath = path.join(fixture.tree, 'router.json');
  const routerSeed = '{\n  "classes": {\n    "base": {\n      "keywords": ["one"]\n    }\n  }\n}\n';
  const entrySet = (keywords) => ({
    target: 'router.json',
    style: { indent: 2, primitiveArrays: 'inline' },
    operations: [{
      op: 'insertObjectKeys',
      path: ['classes'],
      entries: [{ key: 'aliases', value: { keywords } }],
    }],
  });
  const editEntrySet = (keywords) => writeFile(fixture.overlayDir, 'json/router.json', JSON.stringify(entrySet(keywords), null, 2) + '\n');
  const readRouter = () => readJson(routerPath);

  writeFile(fixture.tree, 'router.json', routerSeed);
  editEntrySet(['alpha']);
  fixture.manifest.overlays.push({
    id: 'router-classes',
    scope: 'json-entry',
    source: 'json/router.json',
    destination: 'router.json',
    pinnedSha256: sha256(Buffer.from(routerSeed)),
  });
  writeManifest(fixture);
  seedState(fixture);
  assert.deepEqual(readRouter().classes.aliases, { keywords: ['alpha'] });

  editEntrySet(['alpha', 'beta']);
  const edited = fixture.run(['status']);
  assert.match(edited.output, /overlay-edited router\.json {2}\(overlay: skilled-overlays\/json\/router\.json\)/);
  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  assert.equal(applied.output.trim(), '1 changed');
  assert.deepEqual(readRouter().classes, { base: { keywords: ['one'] }, aliases: { keywords: ['alpha', 'beta'] } });
  assert.equal(fixture.run(['apply']).output.trim(), '0 changed');

  writeFile(fixture.tree, 'router.json', fs.readFileSync(routerPath, 'utf8').replace('"beta"', '"gamma"'));
  editEntrySet(['alpha', 'delta']);
  const liveBefore = fs.readFileSync(routerPath, 'utf8');
  const conflicted = fixture.run(['status']);
  assert.match(conflicted.output, /both-changed router\.json/);
  const refused = fixture.run(['apply']);
  assert.equal(refused.code, 1, refused.output);
  assert.equal(fs.readFileSync(routerPath, 'utf8'), liveBefore);
});

test('token-named paths pass only when a manifest entry names them exactly, and .env never does', (t) => {
  const fixture = createFixture(t);
  const ctx = engine.createContext(fixture.tree);
  const fileEntry = { scope: 'file' };
  const walkedEntry = { scope: 'directory' };
  const rows = ['tokens.css', 'auth-token.ts', 'token-store.svelte', 'design-tokens.md',
    'skills/sk-code/assets/tokens.css', 'token.json', '.token', 'tokens.txt'];
  for (const name of rows) {
    const absolute = path.join(fixture.tree, name);
    assert.equal(engine.isProtectedReadPath(absolute), true, name + ' while walking');
    assert.equal(engine.isProtectedReadPath(absolute, new Set([absolute])), false, name + ' named exactly');
    const source = path.join(ctx.overlayRoot, name);
    assert.equal(engine.isCaptureRestricted(ctx, { key: name, sourcePath: source, entry: walkedEntry }, name), true, name);
    assert.equal(engine.isCaptureRestricted(ctx, { key: name, sourcePath: source, entry: fileEntry }, name), false, name);
  }
  for (const name of ['.env', '.env.local']) {
    const absolute = path.join(fixture.tree, name);
    assert.equal(engine.isProtectedReadPath(absolute, new Set([absolute])), true, name);
    const record = { key: name, sourcePath: path.join(ctx.overlayRoot, name), entry: fileEntry };
    assert.equal(engine.isCaptureRestricted(ctx, record, name), true, name);
  }
  assert.equal(engine.isProtectedReadPath(path.join(fixture.tree, 'x.svelte')), false);
  const nested = { key: 'tokens/readme.md', sourcePath: path.join(ctx.overlayRoot, 'x.md'), entry: walkedEntry };
  assert.equal(engine.isCaptureRestricted(ctx, nested, 'tokens/readme.md'), true);
});

test('status --json reports each out-of-sync destination with its fix, and an error as JSON', (t) => {
  const fixture = createFixture(t);
  seedState(fixture);
  writeFile(fixture.overlayDir, 'files/guarded.txt', 'overlay two\n');
  const report = fixture.run(['status', '--json']);
  assert.equal(report.code, 1, report.output);
  const parsed = JSON.parse(report.stdout);
  assert.equal(parsed.result, 'FAILED');
  assert.equal(parsed.overlayFolder, 'skilled-overlays');
  assert.equal(parsed.counts['overlay-edited'], 1);
  assert.deepEqual(parsed.destinations, [{
    state: 'overlay-edited',
    key: 'guarded.txt',
    kind: 'overlay',
    overlay: 'guarded-file',
    source: 'skilled-overlays/files/guarded.txt',
    fix: 'node .skilled/commands/doctor/scripts/overlay-engine.cjs apply',
  }]);
  assert.equal(parsed.check.miss, 1);

  fs.rmSync(path.join(fixture.overlayDir, 'overlay-manifest.json'));
  const failed = fixture.run(['status', '--json']);
  assert.equal(failed.code, 2, failed.output);
  const error = JSON.parse(failed.stdout);
  assert.equal(error.result, 'ERROR');
  // With no setting file the folder was guessed, so the error names the guess and the fix.
  assert.match(error.error, /^no overlay manifest at skilled-overlays\/overlay-manifest\.json: with no \.skilled-overlays\.json /);
  assert.match(error.error, /add \.skilled-overlays\.json at the tree root naming that folder$/);

  fs.writeFileSync(path.join(fixture.tree, '.skilled-overlays.json'), '{ "overlayDir": "skilled-overlays" }\n');
  const named = fixture.run(['status', '--json']);
  assert.equal(named.code, 2, named.output);
  assert.deepEqual(JSON.parse(named.stdout), { result: 'ERROR', error: 'no overlay manifest at skilled-overlays/overlay-manifest.json' });
});

test('a misused command line prints the usage and exits 2', (t) => {
  const fixture = createFixture(t);
  for (const args of [[], ['status', '--capture', 'x'], ['apply', '--json'], ['--guard', 'x', 'status'], ['status', 'apply']]) {
    const result = fixture.run(args);
    assert.equal(result.code, 2, args.join(' ') + ': ' + result.output);
    assert.match(result.output, /^usage: node overlay-engine\.cjs status/, args.join(' '));
  }
});

test('a json-entry set adds a key the document does not hold yet, and still refuses a missing parent', (t) => {
  const fixture = createFixture(t);
  const routerPath = path.join(fixture.tree, 'router.json');
  const routerSeed = '{\n  "classes": {\n    "base": {\n      "keywords": ["one"]\n    }\n  }\n}\n';
  const editEntrySet = (...operationPaths) => writeFile(fixture.overlayDir, 'json/router.json', JSON.stringify({
    target: 'router.json',
    style: { indent: 2, primitiveArrays: 'inline' },
    operations: operationPaths.map((operationPath) => ({ op: 'set', path: operationPath, value: ['alpha'] })),
  }, null, 2) + '\n');

  writeFile(fixture.tree, 'router.json', routerSeed);
  editEntrySet(['mirrors']);
  fixture.manifest.overlays.push({
    id: 'router-set',
    scope: 'json-entry',
    source: 'json/router.json',
    destination: 'router.json',
    pinnedSha256: sha256(Buffer.from(routerSeed)),
  });
  writeManifest(fixture);
  seedState(fixture);
  assert.deepEqual(readJson(routerPath), { classes: { base: { keywords: ['one'] } }, mirrors: ['alpha'] });
  assert.equal(
    fs.readFileSync(routerPath, 'utf8'),
    '{\n  "classes": {\n    "base": {\n      "keywords": ["one"]\n    }\n  },\n  "mirrors": ["alpha"]\n}\n',
  );
  assert.equal(fixture.run(['apply']).output.trim(), '0 changed');

  // Only the last key is added. A path through an object that is not there is a
  // mistake. The first set stays listed, so the refusal is about the missing
  // parent and not about a set that left the entry set.
  editEntrySet(['mirrors'], ['absent', 'mirrors']);
  const refused = fixture.run(['status']);
  assert.notEqual(refused.code, 0, refused.output);
  assert.match(refused.output, /missing key "absent"/);
});

// A `set` writes one value into an upstream file. Once the entry set stops
// naming it, the value has to return to what the pin holds, which the engine
// reads from the upstream checkout the manifest names.
const GIT_CONFIG = [
  '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid',
  '-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=/dev/null', '-c', 'init.defaultBranch=main',
  '-c', 'core.excludesFile=/dev/null',
];

function git(cwd, args) {
  const result = spawnSync('git', [...GIT_CONFIG, '-C', cwd, ...args], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error('git ' + args.join(' ') + ': ' + result.stderr);
  return result.stdout.trim();
}

/**
 * Build a tree whose entry set writes into a file an upstream checkout holds at
 * the pin.
 * @param {object} t The node:test context.
 * @param {object} pinned Document the pin and the live file both start with.
 * @param {{checkout?: boolean}} [options] Whether the manifest names the checkout.
 * @returns {object} Fixture paths, its manifest and helpers to rewrite the entry
 *   set and read the recorded sets.
 */
function createPinnedSetFixture(t, pinned, { checkout = true } = {}) {
  const fixture = createWorkspace(t, 'overlay-engine-sets-');
  const seed = JSON.stringify(pinned, null, 2) + '\n';
  const upstream = path.join(fixture.workspace, 'upstream');
  fs.mkdirSync(upstream);
  git(upstream, ['init', '-q']);
  writeFile(upstream, 'baseline.json', seed);
  git(upstream, ['add', '-A']);
  git(upstream, ['commit', '-q', '-m', 'pinned copy']);
  const commit = git(upstream, ['rev-parse', 'HEAD']);
  writeFile(fixture.tree, 'baseline.json', seed);
  fixture.manifest = {
    schemaVersion: 1,
    pin: checkout ? { upstream: 'fixture', checkout: upstream, commit } : { upstream: 'fixture', commit },
    layoutLinks: [],
    overlays: [{
      id: 'baseline-set',
      scope: 'json-entry',
      source: 'json/baseline.json',
      destination: 'baseline.json',
      pinnedSha256: sha256(Buffer.from(seed)),
    }],
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  fixture.seed = seed;
  fixture.run = (args) => runEngine([...args, '--root', fixture.tree], fixture.workspace);
  fixture.writeOperations = (operations) => writeFile(fixture.overlayDir, 'json/baseline.json', JSON.stringify({
    target: 'baseline.json',
    style: { indent: 2, primitiveArrays: 'inline' },
    operations,
  }, null, 2) + '\n');
  fixture.livePath = path.join(fixture.tree, 'baseline.json');
  fixture.readLive = () => fs.readFileSync(fixture.livePath, 'utf8');
  fixture.recordedSets = () => (readJson(fixture.statePath).sets || {})['baseline.json'] || [];
  return fixture;
}

const TOP_PATH = ['rows', 'a', 'top'];
const PINNED_ROWS = { rows: { a: { top: 'sk-code' } } };

test('apply returns a value to the pin once its set leaves the entry set', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_ROWS);
  fixture.writeOperations([{ op: 'set', path: TOP_PATH, value: 'sk-doc' }]);
  seedState(fixture);
  assert.equal(readJson(fixture.livePath).rows.a.top, 'sk-doc');

  fixture.writeOperations([]);
  const applied = fixture.run(['apply']);

  assert.equal(applied.code, 0, applied.output);
  assert.equal(fixture.readLive(), fixture.seed);
  assert.deepEqual(fixture.recordedSets(), []);
  const status = fixture.run(['status']);
  assert.equal(status.code, 0, status.output);
  assert.match(status.output, /RESULT: PASSED/);
});

test('apply deletes a key its set added once the set leaves the entry set', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_ROWS);
  fixture.writeOperations([{ op: 'set', path: ['rows', 'a', 'extra'], value: 1 }]);
  seedState(fixture);
  assert.deepEqual(readJson(fixture.livePath).rows.a, { top: 'sk-code', extra: 1 });
  // A second apply finds the key in place and must keep it marked as added.
  assert.equal(fixture.run(['apply']).output.trim(), '0 changed');
  assert.deepEqual(fixture.recordedSets(), [{ path: ['rows', 'a', 'extra'], value: 1, added: true }]);

  fixture.writeOperations([]);
  const applied = fixture.run(['apply']);

  assert.equal(applied.code, 0, applied.output);
  assert.equal(fixture.readLive(), fixture.seed);
});

test('apply refuses to restore a set value that was edited after it was applied', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_ROWS);
  fixture.writeOperations([{ op: 'set', path: TOP_PATH, value: 'sk-doc' }]);
  seedState(fixture);

  writeFile(fixture.tree, 'baseline.json', fixture.readLive().replace('"sk-doc"', '"sk-git"'));
  const liveBefore = fixture.readLive();
  fixture.writeOperations([]);

  const refused = fixture.run(['apply']);
  assert.equal(refused.code, 1, refused.output);
  assert.match(refused.output, /dropped set at rows\.a\.top was edited after it was applied/);
  assert.equal(fixture.readLive(), liveBefore);
  const status = fixture.run(['status']);
  assert.notEqual(status.code, 0, status.output);
  assert.doesNotMatch(status.output, /RESULT: PASSED/);
});

test('apply refuses to restore a dropped set when the pinned copy cannot be read', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_ROWS, { checkout: false });
  fixture.writeOperations([{ op: 'set', path: TOP_PATH, value: 'sk-doc' }]);
  seedState(fixture);
  const liveBefore = fixture.readLive();
  fixture.writeOperations([]);

  const refused = fixture.run(['apply']);
  assert.equal(refused.code, 1, refused.output);
  assert.match(refused.output, /cannot restore the dropped set at rows\.a\.top: the pinned copy of the file cannot be read/);
  assert.equal(fixture.readLive(), liveBefore);
});

test('a set whose value changes in the source is rewritten and recorded, not restored', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_ROWS);
  fixture.writeOperations([{ op: 'set', path: TOP_PATH, value: 'sk-doc' }]);
  seedState(fixture);

  fixture.writeOperations([{ op: 'set', path: TOP_PATH, value: 'sk-git' }]);
  const applied = fixture.run(['apply']);

  assert.equal(applied.code, 0, applied.output);
  assert.equal(readJson(fixture.livePath).rows.a.top, 'sk-git');
  assert.deepEqual(fixture.recordedSets(), [{ path: TOP_PATH, value: 'sk-git', added: false }]);
});

test('a state file without set records loads, restores nothing and keeps its bytes', (t) => {
  const fixture = createFixture(t);
  // An inserted object key is recorded as a set, so the entry set holds none here.
  writeFile(fixture.overlayDir, 'json/entries.json', JSON.stringify({ target: 'settings.json', operations: [] }, null, 2) + '\n');
  seedState(fixture);
  const stateBefore = fs.readFileSync(fixture.statePath, 'utf8');
  assert.equal(Object.hasOwn(JSON.parse(stateBefore), 'sets'), false);

  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  assert.equal(applied.output.trim(), '0 changed');
  assert.equal(fs.readFileSync(fixture.statePath, 'utf8'), stateBefore);
});

test('a set applied before sets were recorded is recorded by the next apply and then restored', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_ROWS);
  fixture.writeOperations([{ op: 'set', path: TOP_PATH, value: 'sk-doc' }]);
  seedState(fixture);
  // An older engine wrote the value and kept no record of it.
  const older = readJson(fixture.statePath);
  delete older.sets;
  writeFile(fixture.overlayDir, 'sync-state.json', JSON.stringify(older, null, 2) + '\n');

  assert.equal(fixture.run(['apply']).code, 0);
  assert.deepEqual(fixture.recordedSets(), [{ path: TOP_PATH, value: 'sk-doc', added: false }]);

  fixture.writeOperations([]);
  assert.equal(fixture.run(['apply']).code, 0);
  assert.equal(fixture.readLive(), fixture.seed);
});

test('a dropped set is restored from the pinned copy the run was given', () => {
  const live = JSON.stringify({ rows: { a: { top: 'sk-doc' } } }, null, 2) + '\n';
  const newPin = JSON.stringify({ rows: { a: { top: 'sk-review' } } }, null, 2) + '\n';

  const restored = engine.applyJsonOperations(live, { operations: [] }, {
    canReplaceExisting: true,
    recordedSets: [{ path: TOP_PATH, value: 'sk-doc', added: false }],
    readUpstreamText: () => newPin,
  });

  assert.equal(restored, newPin);
});

// An array index is a position, so a restore through one is trusted only while
// the live array and the pin's still line up.
const PINNED_LIST = { rows: [{ id: 'A', top: 'a' }, { id: 'B', top: 'b' }] };
const INSERT_X = { op: 'insertItems', path: ['rows'], identityKey: 'id', before: { id: 'A' }, items: [{ id: 'X', top: 'x' }] };

test('apply restores a dropped set through an array index while the arrays line up', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_LIST);
  fixture.writeOperations([{ op: 'set', path: ['rows', 1, 'top'], value: 'v' }]);
  seedState(fixture);
  assert.equal(readJson(fixture.livePath).rows[1].top, 'v');

  fixture.writeOperations([]);
  const applied = fixture.run(['apply']);

  assert.equal(applied.code, 0, applied.output);
  assert.equal(fixture.readLive(), fixture.seed);
});

test('apply refuses a dropped set through an array the overlay added an item to', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_LIST);
  fixture.writeOperations([INSERT_X, { op: 'set', path: ['rows', 1, 'top'], value: 'v' }]);
  seedState(fixture);
  assert.deepEqual(readJson(fixture.livePath).rows.map((row) => row.top), ['x', 'v', 'b']);
  const liveBefore = fixture.readLive();

  // With the insert kept, index 1 is A in the live file and B in the pin.
  fixture.writeOperations([INSERT_X]);
  const keptInsert = fixture.run(['apply']);
  assert.equal(keptInsert.code, 1, keptInsert.output);
  assert.match(keptInsert.output, /cannot restore the dropped set at rows\.1\.top: its path goes through an array whose items differ from the pinned copy/);
  assert.equal(fixture.readLive(), liveBefore);

  // With both dropped, removing the item would move every index after it.
  fixture.writeOperations([]);
  const droppedBoth = fixture.run(['apply']);
  assert.equal(droppedBoth.code, 1, droppedBoth.output);
  assert.match(droppedBoth.output, /cannot restore the dropped set at rows\.1\.top/);
  assert.equal(fixture.readLive(), liveBefore);
});

test('two sets on one path keep one record and both leave together', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_ROWS);
  fixture.writeOperations([
    { op: 'set', path: TOP_PATH, value: 'sk-doc' },
    { op: 'set', path: TOP_PATH, value: 'sk-git' },
  ]);
  seedState(fixture);
  assert.equal(readJson(fixture.livePath).rows.a.top, 'sk-git');
  assert.deepEqual(fixture.recordedSets(), [{ path: TOP_PATH, value: 'sk-git', added: false }]);

  fixture.writeOperations([]);
  const applied = fixture.run(['apply']);

  assert.equal(applied.code, 0, applied.output);
  assert.equal(fixture.readLive(), fixture.seed);
});

test('a key the pin does not hold is refused, not deleted, when its record never marked it as added', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_ROWS);
  fixture.writeOperations([{ op: 'set', path: ['rows', 'a', 'extra'], value: 1 }]);
  seedState(fixture);
  // An older engine added the key and kept no record, so the next apply finds
  // the key in place and cannot know who put it there.
  const older = readJson(fixture.statePath);
  delete older.sets;
  writeFile(fixture.overlayDir, 'sync-state.json', JSON.stringify(older, null, 2) + '\n');
  assert.equal(fixture.run(['apply']).code, 0);
  assert.deepEqual(fixture.recordedSets(), [{ path: ['rows', 'a', 'extra'], value: 1, added: false }]);

  fixture.writeOperations([]);
  const liveBefore = fixture.readLive();
  const refused = fixture.run(['apply']);

  assert.equal(refused.code, 1, refused.output);
  assert.match(refused.output, /dropped set at rows\.a\.extra: the pin holds no value there and the record does not show that this overlay added the key; delete the key by hand or put the set back in the entry set/);
  assert.equal(fixture.readLive(), liveBefore);

  writeFile(fixture.tree, 'baseline.json', fixture.seed);
  const cleared = fixture.run(['apply']);
  assert.equal(cleared.code, 0, cleared.output);
  assert.equal(fixture.readLive(), fixture.seed);
  assert.deepEqual(fixture.recordedSets(), []);
});

test('a key added through an index keeps its added mark when the entry set respells the index', (t) => {
  const fixture = createPinnedSetFixture(t, { rows: [{ id: 'A' }] });
  fixture.writeOperations([{ op: 'set', path: ['rows', 0, 'extra'], value: 1 }]);
  seedState(fixture);
  fixture.writeOperations([{ op: 'set', path: ['rows', '0', 'extra'], value: 1 }]);
  assert.equal(fixture.run(['apply']).code, 0);
  assert.equal(fixture.recordedSets()[0].added, true);

  fixture.writeOperations([]);
  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  assert.equal(fixture.readLive(), fixture.seed);
});

test('apply refuses to delete a key the pin does not hold once its value was edited', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_ROWS);
  fixture.writeOperations([{ op: 'set', path: ['rows', 'a', 'extra'], value: 1 }]);
  seedState(fixture);
  writeFile(fixture.tree, 'baseline.json', fixture.readLive().replace('"extra": 1', '"extra": 2'));
  const liveBefore = fixture.readLive();

  fixture.writeOperations([]);
  const refused = fixture.run(['apply']);

  assert.equal(refused.code, 1, refused.output);
  assert.match(refused.output, /dropped set at rows\.a\.extra was edited after it was applied/);
  assert.equal(fixture.readLive(), liveBefore);
});

test('a dropped set is restored while the operations that stay are still applied', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_ROWS);
  const keys = { op: 'insertObjectKeys', path: ['rows', 'a'], entries: [{ key: 'note', value: 'kept' }] };
  fixture.writeOperations([keys, { op: 'set', path: TOP_PATH, value: 'sk-doc' }]);
  seedState(fixture);

  fixture.writeOperations([keys]);
  const applied = fixture.run(['apply']);

  assert.equal(applied.code, 0, applied.output);
  assert.deepEqual(readJson(fixture.livePath).rows.a, { top: 'sk-code', note: 'kept' });
  assert.deepEqual(fixture.recordedSets(), [{ path: ['rows', 'a', 'note'], value: 'kept', added: true }]);
});

// A path step into an array is an index however the entry set spells it.
test('apply refuses a dropped set whose array index is written as a string', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_LIST);
  fixture.writeOperations([INSERT_X, { op: 'set', path: ['rows', '1', 'top'], value: 'v' }]);
  seedState(fixture);
  assert.deepEqual(readJson(fixture.livePath).rows.map((row) => row.top), ['x', 'v', 'b']);
  const liveBefore = fixture.readLive();

  fixture.writeOperations([INSERT_X]);
  const applied = fixture.run(['apply']);

  assert.equal(applied.code, 1, applied.output);
  assert.match(applied.output, /cannot restore the dropped set at rows\.1\.top: its path goes through an array whose items differ from the pinned copy/);
  assert.equal(fixture.readLive(), liveBefore);
});

test('a dropped set whose index fell off the array is refused until the array matches the pin', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_LIST);
  fixture.writeOperations([INSERT_X, { op: 'set', path: ['rows', 2, 'top'], value: 'v' }]);
  seedState(fixture);
  assert.deepEqual(readJson(fixture.livePath).rows.map((row) => row.top), ['x', 'a', 'v']);
  const liveBefore = fixture.readLive();

  // Removing the inserted item would leave no index 2, with B still holding the value.
  fixture.writeOperations([]);
  const refused = fixture.run(['apply']);
  assert.equal(refused.code, 1, refused.output);
  assert.match(refused.output, /cannot restore the dropped set at rows\.2\.top/);
  assert.equal(fixture.readLive(), liveBefore);

  // Put right by hand, the array reads as the pin's and the record has nothing left to do.
  fs.writeFileSync(fixture.livePath, fixture.seed);
  const cleared = fixture.run(['apply']);
  assert.equal(cleared.code, 0, cleared.output);
  assert.equal(fixture.readLive(), fixture.seed);
  assert.deepEqual(fixture.recordedSets(), []);
  assert.equal(fixture.run(['status']).code, 0);
});

test('two records for one path in an older state file restore from the last one', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_ROWS);
  fixture.writeOperations([{ op: 'set', path: TOP_PATH, value: 'sk-git' }]);
  seedState(fixture);
  const state = readJson(fixture.statePath);
  state.sets['baseline.json'] = [
    { path: TOP_PATH, value: 'sk-doc', added: false },
    { path: TOP_PATH, value: 'sk-git', added: false },
  ];
  fs.writeFileSync(fixture.statePath, JSON.stringify(state, null, 2) + '\n');

  fixture.writeOperations([]);
  const applied = fixture.run(['apply']);

  assert.equal(applied.code, 0, applied.output);
  assert.equal(fixture.readLive(), fixture.seed);
});

test('a dropped set leaves in the same apply that adds an item to its array, and the run ends clean', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_LIST);
  // The value equals the pin's, as when upstream took the value over.
  fixture.writeOperations([{ op: 'set', path: ['rows', 1, 'top'], value: 'b' }]);
  seedState(fixture);
  assert.equal(fixture.readLive(), fixture.seed);

  fixture.writeOperations([INSERT_X]);
  const applied = fixture.run(['apply']);

  // The run must not write the file and then judge its own write as an edit.
  assert.equal(applied.code, 0, applied.output);
  assert.deepEqual(readJson(fixture.livePath).rows.map((row) => row.id), ['X', 'A', 'B']);
  assert.deepEqual(fixture.recordedSets(), []);
  assert.equal(fixture.run(['status']).code, 0);
  assert.equal(fixture.run(['apply']).output.trim(), '0 changed');
});

test('a dropped set whose key was deleted by hand leaves quietly while the arrays line up', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_LIST);
  const kept = { op: 'set', path: ['rows', 1, 'top'], value: 'w' };
  fixture.writeOperations([{ op: 'set', path: ['rows', 0, 'extra'], value: 1 }, kept]);
  seedState(fixture);
  const live = readJson(fixture.livePath);
  delete live.rows[0].extra;
  fs.writeFileSync(fixture.livePath, JSON.stringify(live, null, 2) + '\n');

  fixture.writeOperations([kept]);
  const applied = fixture.run(['apply']);

  assert.equal(applied.code, 0, applied.output);
  assert.deepEqual(fixture.recordedSets().map((record) => record.path), [kept.path]);
  assert.equal(fixture.run(['status']).code, 0);
});

test('a dropped set leaves in the same apply whose kept set shortens its array', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_LIST);
  fixture.writeOperations([{ op: 'set', path: ['rows', 1, 'top'], value: 'v' }]);
  seedState(fixture);

  fixture.writeOperations([{ op: 'set', path: ['rows'], value: [{ id: 'A', top: 'a' }] }]);
  const applied = fixture.run(['apply']);

  assert.equal(applied.code, 0, applied.output);
  assert.deepEqual(readJson(fixture.livePath).rows, [{ id: 'A', top: 'a' }]);
  assert.equal(fixture.run(['status']).code, 0);
  assert.equal(fixture.run(['apply']).output.trim(), '0 changed');
});

// The item at an index is checked too, not only how many items the array holds.
test('a dropped set through an array index is refused when the pin holds another item at that index', () => {
  const live = JSON.stringify({ rows: [{ id: 'A', top: 'a' }, { id: 'B', top: 'v' }] }, null, 2) + '\n';
  const swapped = { rows: [{ id: 'B', top: 'b' }, { id: 'A', top: 'a' }] };
  const replaced = { rows: [{ id: 'A', top: 'a' }, { id: 'C', top: 'c' }] };
  for (const pinned of [swapped, replaced]) {
    assert.throws(() => engine.applyJsonOperations(live, { operations: [] }, {
      canReplaceExisting: true,
      recordedSets: [{ path: ['rows', 1, 'top'], value: 'v', added: false }],
      readUpstreamText: () => JSON.stringify(pinned, null, 2) + '\n',
    }), /cannot restore the dropped set at rows\.1\.top: its path goes through an array whose items differ from the pinned copy; put the array at rows back to the pinned copy by hand and run apply$/);
  }
});

test('a dropped set through an array index is restored beside a set the entry set keeps in the same item', () => {
  const pinned = JSON.stringify({ rows: [{ id: 'A', top: 'a', note: 0 }, { id: 'B', top: 'b', note: 0 }] }, null, 2) + '\n';
  const live = JSON.stringify({ rows: [{ id: 'A', top: 'a', note: 0 }, { id: 'B', top: 'v', note: 9 }] }, null, 2) + '\n';
  const kept = { op: 'set', path: ['rows', 1, 'note'], value: 9 };

  const restored = engine.applyJsonOperations(live, { operations: [kept] }, {
    canReplaceExisting: true,
    recordedSets: [{ path: ['rows', 1, 'top'], value: 'v', added: false }, { path: kept.path, value: 9, added: false }],
    readUpstreamText: () => pinned,
    onSet: () => {},
  });

  assert.deepEqual(JSON.parse(restored).rows[1], { id: 'B', top: 'b', note: 9 });
});

test('two nested sets dropped together both leave, in either order they were written', (t) => {
  const outer = { op: 'set', path: ['rows', 'a'], value: { top: 'y', note: 1 } };
  const inner = { op: 'set', path: TOP_PATH, value: 'x' };
  for (const operations of [[inner, outer], [outer, inner]]) {
    const fixture = createPinnedSetFixture(t, PINNED_ROWS);
    fixture.writeOperations(operations);
    seedState(fixture);

    fixture.writeOperations([]);
    const applied = fixture.run(['apply']);

    assert.equal(applied.code, 0, applied.output);
    assert.equal(fixture.readLive(), fixture.seed);
    assert.deepEqual(fixture.recordedSets(), []);
  }
});

test('two nested sets dropped together are refused once the inner value was edited by hand', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_ROWS);
  fixture.writeOperations([
    { op: 'set', path: ['rows', 'a'], value: { top: 'y', note: 1 } },
    { op: 'set', path: TOP_PATH, value: 'x' },
  ]);
  seedState(fixture);
  writeFile(fixture.tree, 'baseline.json', fixture.readLive().replace('"x"', '"hand"'));
  const liveBefore = fixture.readLive();

  fixture.writeOperations([]);
  const refused = fixture.run(['apply']);

  assert.equal(refused.code, 1, refused.output);
  assert.match(refused.output, /dropped set at rows\.a was edited after it was applied/);
  assert.equal(fixture.readLive(), liveBefore);
});

test('sets spelled with 1 and with "1" keep one record, and both leave together', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_LIST);
  fixture.writeOperations([
    { op: 'set', path: ['rows', 1, 'top'], value: 'v1' },
    { op: 'set', path: ['rows', '1', 'top'], value: 'v2' },
  ]);
  seedState(fixture);
  assert.equal(fixture.recordedSets().length, 1);

  fixture.writeOperations([]);
  const applied = fixture.run(['apply']);

  assert.equal(applied.code, 0, applied.output);
  assert.equal(fixture.readLive(), fixture.seed);
});

test('a kept set respelled from "1" to 1 is the same set, so nothing is restored', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_LIST);
  fixture.writeOperations([INSERT_X, { op: 'set', path: ['rows', '1', 'top'], value: 'v' }]);
  seedState(fixture);
  const liveBefore = fixture.readLive();

  fixture.writeOperations([INSERT_X, { op: 'set', path: ['rows', 1, 'top'], value: 'v' }]);
  const applied = fixture.run(['apply']);

  assert.equal(applied.code, 0, applied.output);
  assert.equal(fixture.readLive(), liveBefore);
});

test('with no pinned copy to read, the refusal names pin.checkout and clears once the file holds the pinned bytes', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_ROWS, { checkout: false });
  fixture.writeOperations([{ op: 'set', path: TOP_PATH, value: 'sk-doc' }]);
  seedState(fixture);
  fixture.writeOperations([]);
  const refused = fixture.run(['apply']);
  assert.equal(refused.code, 1, refused.output);
  assert.match(refused.output, /the pinned copy of the file cannot be read; name the upstream checkout in the manifest's pin\.checkout/);

  fs.writeFileSync(fixture.livePath, fixture.seed);
  const cleared = fixture.run(['apply']);

  assert.equal(cleared.code, 0, cleared.output);
  assert.deepEqual(fixture.recordedSets(), []);
  assert.equal(fixture.run(['status']).code, 0);
});

test('an entry set refused over an untouched file is cannot-apply, and putting the named array back clears it', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_LIST);
  fixture.writeOperations([INSERT_X, { op: 'set', path: ['rows', 1, 'top'], value: 'v' }]);
  seedState(fixture);
  fixture.writeOperations([INSERT_X]);

  const status = fixture.run(['status', '--json']);
  assert.equal(status.code, 1, status.output);
  const parsed = JSON.parse(status.stdout);
  assert.equal(parsed.counts['cannot-apply'], 1);
  assert.equal(parsed.counts['both-changed'], 0);
  assert.equal(parsed.destinations[0].state, 'cannot-apply');
  assert.match(parsed.destinations[0].fix, /^cannot restore the dropped set at rows\.1\.top: .*put the array at rows back to the pinned copy by hand and run apply; change the entry set or the live file, then run /);

  const live = readJson(fixture.livePath);
  live.rows = PINNED_LIST.rows;
  fs.writeFileSync(fixture.livePath, JSON.stringify(live, null, 2) + '\n');
  const cleared = fixture.run(['apply']);

  assert.equal(cleared.code, 0, cleared.output);
  assert.deepEqual(readJson(fixture.livePath).rows.map((row) => row.top), ['x', 'a', 'b']);
  assert.deepEqual(fixture.recordedSets(), []);
  assert.equal(fixture.run(['status']).code, 0);
});

test('a dropped set that wrote a whole array item restores only while every other item is the pin\'s', () => {
  const live = JSON.stringify({ rows: [{ id: 'A' }, { id: 'V' }] }, null, 2) + '\n';
  const record = { path: ['rows', 1], value: { id: 'V' }, added: false };
  const restore = (pinned) => engine.applyJsonOperations(live, { operations: [] }, {
    canReplaceExisting: true,
    recordedSets: [record],
    readUpstreamText: () => JSON.stringify(pinned, null, 2) + '\n',
  });

  assert.deepEqual(JSON.parse(restore({ rows: [{ id: 'A' }, { id: 'B' }] })).rows, [{ id: 'A' }, { id: 'B' }]);
  assert.throws(() => restore({ rows: [{ id: 'B' }, { id: 'A' }] }),
    /cannot restore the dropped set at rows\.1: its path goes through an array whose items differ from the pinned copy/);
});

test('a dropped set is restored beside other operations the entry set keeps in the same item', () => {
  const pinned = JSON.stringify({ rows: [{ id: 'A', top: 'a' }, { id: 'B', top: 'b', tags: ['t'] }] }, null, 2) + '\n';
  const live = JSON.stringify({ rows: [{ id: 'A', top: 'a' }, { id: 'B', top: 'v', tags: ['t', 'mine'], extra: 1 }] }, null, 2) + '\n';
  const kept = [
    { op: 'setKeyOnItem', path: ['rows'], identityKey: 'id', match: { id: 'B' }, key: 'extra', value: 1 },
    { op: 'appendItems', path: ['rows', 1, 'tags'], items: ['mine'] },
  ];

  const restored = engine.applyJsonOperations(live, { operations: kept }, {
    canReplaceExisting: true,
    recordedSets: [{ path: ['rows', 1, 'top'], value: 'v', added: false }],
    readUpstreamText: () => pinned,
    onSet: () => {},
    onListed: () => {},
  });

  assert.deepEqual(JSON.parse(restored).rows[1], { id: 'B', top: 'b', tags: ['t', 'mine'], extra: 1 });
});

test('records an older engine kept in first-write order still restore nested sets dropped together', () => {
  const pinned = JSON.stringify({ a: { x: 0 }, k: 0 }, null, 2) + '\n';
  const live = JSON.stringify({ a: { x: 3 }, k: 0 }, null, 2) + '\n';

  const restored = engine.applyJsonOperations(live, { operations: [] }, {
    canReplaceExisting: true,
    recordedSets: [{ path: ['a'], value: { x: 3 }, added: false }, { path: ['a', 'x'], value: 2, added: false }],
    readUpstreamText: () => pinned,
  });

  assert.equal(restored, pinned);
});

test('a dropped set inside an item is restored while a kept set rewrites the whole array', () => {
  const pinned = JSON.stringify({ arr: [{ n: 1 }, { n: 2 }] }, null, 2) + '\n';
  const live = JSON.stringify({ arr: [{ n: 'a' }, { n: 'b', x: 5 }] }, null, 2) + '\n';
  const kept = { op: 'set', path: ['arr'], value: [{ n: 'a' }, { n: 'b' }] };

  const restored = engine.applyJsonOperations(live, { operations: [kept] }, {
    canReplaceExisting: true,
    recordedSets: [{ path: kept.path, value: kept.value, added: false }, { path: ['arr', 1, 'x'], value: 5, added: true }],
    readUpstreamText: () => pinned,
    onSet: () => {},
  });

  assert.deepEqual(JSON.parse(restored).arr, [{ n: 'a' }, { n: 'b' }]);
});

test('sets that together wrote every key of an item restore only while every other item is the pin\'s', () => {
  const live = JSON.stringify({ rows: [{ id: 'A', top: 'a' }, { id: 'Z', top: 'v' }] }, null, 2) + '\n';
  const records = [
    { path: ['rows', 1, 'top'], value: 'v', added: false },
    { path: ['rows', 1, 'id'], value: 'Z', added: false },
  ];
  const restore = (pinned) => engine.applyJsonOperations(live, { operations: [] }, {
    canReplaceExisting: true,
    recordedSets: records,
    readUpstreamText: () => JSON.stringify(pinned, null, 2) + '\n',
  });

  const pin = { rows: [{ id: 'A', top: 'a' }, { id: 'B', top: 'b' }] };
  assert.equal(restore(pin), JSON.stringify(pin, null, 2) + '\n');
  assert.throws(() => restore({ rows: [{ id: 'B', top: 'b' }, { id: 'A', top: 'a' }] }),
    /cannot restore the dropped set at rows\.1\.\w+: its path goes through an array whose items differ from the pinned copy/);
});

test('records an older engine kept with the inner set first still restore when it was written last', () => {
  const pinned = JSON.stringify({ c: { a: 0, b: 0 } }, null, 2) + '\n';
  const live = JSON.stringify({ c: { a: 9, b: 2 } }, null, 2) + '\n';

  const restored = engine.applyJsonOperations(live, { operations: [] }, {
    canReplaceExisting: true,
    recordedSets: [{ path: ['c', 'a'], value: 9, added: false }, { path: ['c'], value: { a: 1, b: 2 }, added: false }],
    readUpstreamText: () => pinned,
  });

  assert.equal(restored, pinned);
});

// A failed apply still wrote its destinations, so what it wrote has to be on
// record before any later step can fail, and the step that failed has to run
// again on the next apply even though every destination is already in sync.
const GENERATOR = "const fs = require('fs'); fs.appendFileSync('gen-runs.txt', 'x'); " +
  "process.exit(fs.existsSync('regen-fail') ? 1 : 0);";
const VERIFIER = "require('fs').appendFileSync('verify-runs.txt', 'x');";

test('a rerun of apply after a failed regenerate step runs the step again, and the item it added still leaves later', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_LIST);
  fixture.manifest.regenerate = [{ id: 'gen', argv: ['node', '-e', GENERATOR], outputs: [] }];
  fixture.manifest.verifyGenerated = [{ id: 'gen-check', argv: ['node', '-e', VERIFIER] }];
  writeManifest(fixture);
  fixture.writeOperations([]);
  seedState(fixture);
  const count = (name) => (fs.existsSync(path.join(fixture.tree, name))
    ? fs.readFileSync(path.join(fixture.tree, name), 'utf8').length
    : 0);
  const runs = () => count('gen-runs.txt');
  const verifies = () => count('verify-runs.txt');

  writeFile(fixture.tree, 'regen-fail', '');
  fixture.writeOperations([INSERT_X]);
  const failed = fixture.run(['apply']);
  assert.equal(failed.code, 1, failed.output);
  assert.match(failed.output, /regen gen: FAILED/);
  assert.equal(runs(), 1);
  assert.equal(verifies(), 0);

  fs.rmSync(path.join(fixture.tree, 'regen-fail'));
  const rerun = fixture.run(['apply']);
  assert.equal(rerun.code, 0, rerun.output);
  assert.equal(runs(), 2);
  assert.equal(verifies(), 1);
  assert.equal(fixture.run(['apply']).code, 0);
  assert.equal(runs(), 2);

  fixture.writeOperations([]);
  const dropped = fixture.run(['apply']);
  assert.equal(dropped.code, 0, dropped.output);
  assert.equal(fixture.readLive(), fixture.seed);
});

test('a state file of schema version 1 loads, is named in status and is rewritten as version 2', (t) => {
  const fixture = createFixture(t);
  seedState(fixture);
  const older = readJson(fixture.statePath);
  older.schemaVersion = 1;
  writeFile(fixture.overlayDir, 'sync-state.json', JSON.stringify(older, null, 2) + '\n');

  const status = fixture.run(['status']);
  assert.equal(status.code, 0, status.output);
  assert.match(status.output, /^NOTE +sync-state\.json is schema version 1; the next apply rewrites it as version 2/m);

  assert.equal(fixture.run(['apply']).code, 0);
  assert.equal(readJson(fixture.statePath).schemaVersion, 2);
  assert.doesNotMatch(fixture.run(['status']).output, /schema version 1/);
});

test('a state record without a path is refused and named', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_ROWS);
  fixture.writeOperations([{ op: 'set', path: TOP_PATH, value: 'sk-doc' }]);
  seedState(fixture);
  const broken = readJson(fixture.statePath);
  broken.sets['baseline.json'] = [{ value: 'sk-doc', added: false }];
  writeFile(fixture.overlayDir, 'sync-state.json', JSON.stringify(broken, null, 2) + '\n');

  const status = fixture.run(['status']);
  assert.equal(status.code, 2, status.output);
  assert.match(status.output, /sync-state\.json has a sets record for baseline\.json without a valid path/);
});

test('the state file is replaced through a rename, so a failed write keeps the old bytes and leaves no temporary file', (t) => {
  const fixture = createFixture(t);
  seedState(fixture);
  const before = fs.readFileSync(fixture.statePath, 'utf8');
  const ctx = engine.createContext(fixture.tree);
  t.mock.method(fs, 'renameSync', () => {
    throw new Error('simulated crash before the rename');
  });

  assert.throws(() => engine.writeStateIfChanged(ctx, { pin: 'pin-two', files: {} }), /simulated crash/);

  assert.equal(fs.readFileSync(fixture.statePath, 'utf8'), before);
  assert.deepEqual(fs.readdirSync(fixture.overlayDir).filter((name) => name.includes('.tmp')), []);
});

test('status notes a skipped stale root-file check when no upstream checkout can be read', (t) => {
  const fixture = createWorkspace(t, 'overlay-engine-no-checkout-');
  writeFile(fixture.overlayDir, 'files/AGENTS.md', 'overlay agents\n');
  writeFile(fixture.tree, 'AGENTS.md', 'overlay agents\n');
  fixture.manifest = {
    schemaVersion: 1,
    pin: { upstream: 'fixture', commit: 'pin-one' },
    repin: { rootFiles: ['AGENTS.md'] },
    layoutLinks: [],
    overlays: [{
      id: 'agents-file',
      scope: 'file',
      source: 'files/AGENTS.md',
      destination: 'AGENTS.md',
      pinnedSha256: sha256(Buffer.from('upstream agents\n')),
    }],
    regenerate: [],
    verifyGenerated: [],
  };
  writeManifest(fixture);
  const run = (args) => runEngine([...args, '--root', fixture.tree], fixture.workspace);
  assert.equal(run(['apply']).code, 0);

  const status = run(['status']);
  assert.equal(status.code, 0, status.output);
  assert.match(status.output, /^NOTE +no upstream checkout at the pin, so the stale root-file check was skipped; name it in the manifest's pin\.checkout$/m);
  const report = JSON.parse(run(['status', '--json']).stdout);
  assert.ok(report.notes.some((note) => /stale root-file check was skipped/.test(note)), report.notes);
});

test('status names both skipped checks when the checkout lacks the pinned commit', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_ROWS);
  fixture.writeOperations([{ op: 'set', path: TOP_PATH, value: 'sk-doc' }]);
  writeFile(fixture.overlayDir, 'files/AGENTS.md', 'overlay agents\n');
  writeFile(fixture.tree, 'AGENTS.md', 'overlay agents\n');
  fixture.manifest.repin = { rootFiles: ['AGENTS.md'] };
  fixture.manifest.overlays.push({
    id: 'agents-file',
    scope: 'file',
    source: 'files/AGENTS.md',
    destination: 'AGENTS.md',
    pinnedSha256: sha256(Buffer.from('upstream agents\n')),
  });
  writeManifest(fixture);
  seedState(fixture);
  const missing = 'f'.repeat(40);
  fixture.manifest.pin.commit = missing;
  writeManifest(fixture);

  const status = fixture.run(['status']);
  assert.match(status.output, new RegExp('^NOTE +no upstream checkout at the pin, so the stale root-file check and ' +
    `the json-entry cross-check were skipped; fetch commit ${missing} into `, 'm'));
});

test('a relative pin.checkout is read from the tree root, not from the shell\'s folder', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_ROWS);
  fixture.manifest.pin.checkout = path.relative(fixture.tree, fixture.manifest.pin.checkout);
  writeManifest(fixture);
  fixture.writeOperations([{ op: 'set', path: TOP_PATH, value: 'sk-doc' }]);
  seedState(fixture);

  fixture.writeOperations([]);
  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  assert.equal(fixture.readLive(), fixture.seed);
});

test('a malformed entry set blocks only its own overlay and names its file', (t) => {
  const fixture = createFixture(t);
  seedState(fixture);
  writeFile(fixture.overlayDir, 'json/entries.json', '{ "operations": [');
  writeFile(fixture.overlayDir, 'files/guarded.txt', 'overlay two\n');

  const status = fixture.run(['status']);
  assert.equal(status.code, 1, status.output);
  assert.match(status.output, /json-entry: entry set json\/entries\.json is not valid JSON/);
  assert.match(status.output, /overlay-edited guarded\.txt/);
});

test('status notes a set through an array index and no longer notes a recorded setKeyOnItem', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_LIST);
  fixture.writeOperations([
    { op: 'setKeyOnItem', path: ['rows'], identityKey: 'id', match: { id: 'B' }, key: 'extra', value: 1 },
    { op: 'set', path: ['rows', 0, 'top'], value: 'z' },
  ]);
  seedState(fixture);

  const status = fixture.run(['status']);
  assert.equal(status.code, 0, status.output);
  assert.doesNotMatch(status.output, /keeps no record/);
  assert.match(status.output, /^NOTE +baseline-set: set at rows\.0\.top goes through an array index, so it lands on another item when an item before it is added or removed$/m);
});

test('status reports a json-entry result that differs from the entry set applied to the pinned copy', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_LIST);
  fixture.writeOperations([
    { op: 'setKeyOnItem', path: ['rows'], identityKey: 'id', match: { id: 'B' }, key: 'extra', value: 1 },
  ]);
  seedState(fixture);
  const clean = fixture.run(['status']);
  assert.doesNotMatch(clean.output, /cross-check/);
  // A state file an older engine wrote holds no record of the key, so the
  // drop below leaves the value in the file with nothing to explain it.
  const older = readJson(fixture.statePath);
  delete older.keys;
  writeFile(fixture.overlayDir, 'sync-state.json', JSON.stringify(older, null, 2) + '\n');

  fixture.writeOperations([]);
  assert.equal(fixture.run(['apply']).code, 0);
  assert.equal(readJson(fixture.livePath).rows[1].extra, 1);

  const status = fixture.run(['status']);
  assert.equal(status.code, 0, status.output);
  assert.match(status.output, /^NOTE +cross-check baseline\.json: the live file differs from the entry set applied to the pinned copy at rows\.1\.extra; no record covers that value, unless a regenerate step that leaves baseline\.json out of its outputs wrote it$/m);
});

test('status prints no note for recorded setKeyOnItem and insertObjectKeys operations', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_LIST);
  fixture.writeOperations([
    { op: 'setKeyOnItem', path: ['rows'], identityKey: 'id', match: { id: 'A' }, key: 'extra', value: 1 },
    { op: 'setKeyOnItem', path: ['rows'], identityKey: 'id', match: { id: 'B' }, key: 'extra', value: 2 },
    { op: 'insertObjectKeys', path: [], entries: [{ key: 'one', value: 1 }, { key: 'two', value: 2 }] },
  ]);
  seedState(fixture);

  const notes = fixture.run(['status']).output.split('\n').filter((line) => line.startsWith('NOTE'));
  assert.deepEqual(notes, []);
});

test('status skips the cross-check on a json-entry destination a regenerate step lists as an output', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_LIST);
  fixture.manifest.regenerate = [{ id: 'gen', argv: ['node', '-e', '0'], outputs: ['baseline.json'] }];
  writeManifest(fixture);
  fixture.writeOperations([]);
  seedState(fixture);
  const live = readJson(fixture.livePath);
  live.rows[1].generated = true;
  writeFile(fixture.tree, 'baseline.json', JSON.stringify(live, null, 2) + '\n');

  const status = fixture.run(['status']);
  assert.equal(status.code, 0, status.output);
  assert.doesNotMatch(status.output, /cross-check/);
});

// An array index is a position whatever operation walks through it, so every
// operation whose path steps through one is named, not only `set`.
test('status notes an appendItems or insertItems whose path goes through an array index', (t) => {
  const fixture = createPinnedSetFixture(t, { groups: [{ items: ['a'] }] });
  fixture.writeOperations([
    { op: 'appendItems', path: ['groups', 0, 'items'], items: ['b'] },
    { op: 'insertItems', path: ['groups', '0', 'items'], items: ['c'] },
  ]);
  seedState(fixture);

  const notes = fixture.run(['status']).output.split('\n').filter((line) => line.startsWith('NOTE'));
  assert.deepEqual(notes, [
    'NOTE     baseline-set: appendItems at groups.0.items goes through an array index, so it lands on another item when an item before it is added or removed',
    'NOTE     baseline-set: insertItems at groups.0.items goes through an array index, so it lands on another item when an item before it is added or removed',
  ]);
});

// A missing anchor still appends, so an entry set that worked before keeps
// applying; the note is what tells the author the position is no longer kept.
test('status notes a before anchor the file no longer holds, and apply still adds the items at the end', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_LIST);
  fixture.writeOperations([
    { op: 'insertItems', path: ['rows'], identityKey: 'id', before: { id: 'Z' }, items: [{ id: 'X', top: 'x' }] },
    { op: 'insertItems', path: ['rows'], identityKey: 'id', before: { id: 'A' }, items: [{ id: 'Y', top: 'y' }] },
    { op: 'insertObjectKeys', path: [], beforeKey: 'missing', entries: [{ key: 'extra', value: 1 }] },
  ]);
  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  assert.deepEqual(readJson(fixture.livePath).rows.map((row) => row.id), ['Y', 'A', 'B', 'X']);

  const expected = [
    'NOTE     baseline-set: insertItems before "Z" at rows finds no such item, so its items go at the end of the array; point before at an item the file holds',
    'NOTE     baseline-set: insertObjectKeys before "missing" at the top level finds no such key, so its keys go at the end of the object; point beforeKey at a key the file holds',
  ];
  const status = fixture.run(['status']);
  assert.equal(status.code, 0, status.output);
  assert.deepEqual(status.output.split('\n').filter((line) => line.startsWith('NOTE')), expected);
  assert.deepEqual(JSON.parse(fixture.run(['status', '--json']).stdout).notes,
    expected.map((line) => line.replace(/^NOTE {5}/, '')));
});

test('status notes a before anchor that has no identityKey to match it by', (t) => {
  const fixture = createPinnedSetFixture(t, { rows: ['a', 'b'] });
  fixture.writeOperations([{ op: 'insertItems', path: ['rows'], before: 'a', items: ['c'] }]);
  seedState(fixture);

  const notes = fixture.run(['status']).output.split('\n').filter((line) => line.startsWith('NOTE'));
  assert.deepEqual(notes, [
    'NOTE     baseline-set: insertItems at rows names a before anchor but no identityKey, so the anchor is ignored and its items go at the end of the array; add an identityKey',
  ]);
});

// setKeyOnItem and insertObjectKeys are recorded like `set`, so a value either
// one wrote leaves the live file once the operation leaves the entry set.
test('apply takes back a dropped insertObjectKeys key and keeps a record of it while it is listed', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_ROWS);
  fixture.writeOperations([{ op: 'insertObjectKeys', path: ['rows', 'a'], entries: [{ key: 'extra', value: 1 }] }]);
  seedState(fixture);
  assert.equal(readJson(fixture.livePath).rows.a.extra, 1);
  assert.deepEqual(fixture.recordedSets(), [{ path: ['rows', 'a', 'extra'], value: 1, added: true }]);

  fixture.writeOperations([]);
  const applied = fixture.run(['apply']);

  assert.equal(applied.code, 0, applied.output);
  assert.equal(fixture.readLive(), fixture.seed);
  assert.deepEqual(fixture.recordedSets(), []);
});

test('apply takes back a dropped setKeyOnItem: a key it added leaves and a key upstream ships returns to the pin', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_LIST);
  fixture.writeOperations([
    { op: 'setKeyOnItem', path: ['rows'], identityKey: 'id', match: { id: 'B' }, key: 'extra', value: 1 },
    { op: 'setKeyOnItem', path: ['rows'], identityKey: 'id', match: { id: 'A' }, key: 'top', value: 'mine' },
  ]);
  seedState(fixture);
  assert.deepEqual(readJson(fixture.livePath).rows, [{ id: 'A', top: 'mine' }, { id: 'B', top: 'b', extra: 1 }]);
  assert.deepEqual(readJson(fixture.statePath).keys['baseline.json'], [
    { path: ['rows'], identityKey: 'id', identity: 'B', key: 'extra', value: 1, added: true },
    { path: ['rows'], identityKey: 'id', identity: 'A', key: 'top', value: 'mine', added: false },
  ]);
  assert.doesNotMatch(fixture.run(['status']).output, /keeps no record/);

  fixture.writeOperations([]);
  const applied = fixture.run(['apply']);

  assert.equal(applied.code, 0, applied.output);
  assert.equal(fixture.readLive(), fixture.seed);
  assert.equal(readJson(fixture.statePath).keys, undefined);
  assert.equal(fixture.run(['apply']).output.trim(), '0 changed');
});

test('a dropped setKeyOnItem on an item the same entry set inserts leaves while the item stays', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_LIST);
  const addsExtra = { op: 'setKeyOnItem', path: ['rows'], identityKey: 'id', match: { id: 'X' }, key: 'extra', value: 1 };
  fixture.writeOperations([INSERT_X, addsExtra]);
  seedState(fixture);
  assert.deepEqual(readJson(fixture.livePath).rows[0], { id: 'X', top: 'x', extra: 1 });

  fixture.writeOperations([INSERT_X]);
  const applied = fixture.run(['apply']);

  assert.equal(applied.code, 0, applied.output);
  assert.deepEqual(readJson(fixture.livePath).rows, [{ id: 'X', top: 'x' }, ...PINNED_LIST.rows]);
  assert.equal(fixture.run(['apply']).output.trim(), '0 changed');
  assert.equal(fixture.run(['status']).code, 0);
});

test('a dropped setKeyOnItem whose value was edited by hand is refused, not removed', (t) => {
  const fixture = createPinnedSetFixture(t, PINNED_LIST);
  fixture.writeOperations([
    { op: 'setKeyOnItem', path: ['rows'], identityKey: 'id', match: { id: 'B' }, key: 'extra', value: 1 },
  ]);
  seedState(fixture);
  const live = readJson(fixture.livePath);
  live.rows[1].extra = 2;
  writeFile(fixture.tree, 'baseline.json', JSON.stringify(live, null, 2) + '\n');
  const liveBefore = fixture.readLive();

  fixture.writeOperations([]);
  const applied = fixture.run(['apply']);

  assert.equal(applied.code, 1, applied.output);
  assert.match(applied.output, /dropped setKeyOnItem of extra on the item matching id=B at rows was edited after it was applied/);
  assert.equal(fixture.readLive(), liveBefore);
});

// A marked block with `insertBefore` lands just before that line rather than at
// the end, so a closing section such as RELATED RESOURCES stays the last one.
const PLACED_BASE = '# Header\n\n## Notes\n\nupstream notes\n\n## Related\n\n- link\n';
const PLACED_BLOCK = '<!-- BEGIN BLOCK -->\n## Overlay\n\nold block\n<!-- END BLOCK -->\n\n';

function createPlacedFixture(t, base = PLACED_BASE) {
  const fixture = createFixture(t);
  writeFile(fixture.overlayDir, 'marked/base.md', base);
  writeFile(fixture.overlayDir, 'marked/block.md', PLACED_BLOCK);
  writeFile(fixture.tree, 'marked.md', base);
  const entry = fixture.manifest.overlays.find((item) => item.id === 'marked-block');
  entry.insertBefore = '## Related';
  entry.pinnedSha256 = sha256(Buffer.from(base));
  writeManifest(fixture);
  return fixture;
}

function placed(block) {
  return PLACED_BASE.replace('## Related\n', `${block}## Related\n`);
}

test('insertBefore places the block before its anchor line and a second apply changes nothing', (t) => {
  const fixture = createPlacedFixture(t);
  seedState(fixture);
  const live = fs.readFileSync(path.join(fixture.tree, 'marked.md'), 'utf8');
  assert.equal(live, placed(PLACED_BLOCK));
  assert.ok(live.trimEnd().endsWith('- link'), 'the anchored section must stay last');

  const second = fixture.run(['apply']);
  assert.equal(second.code, 0, second.output);
  assert.equal(second.output.trim(), '0 changed');
  assert.equal(fixture.run(['status']).code, 0);
});

test('an edited placed block is rewritten in place and the anchored tail is kept', (t) => {
  const fixture = createPlacedFixture(t);
  seedState(fixture);
  const newBlock = '<!-- BEGIN BLOCK -->\n## Overlay\n\nnew block\n<!-- END BLOCK -->\n\n---\n\n';
  writeFile(fixture.overlayDir, 'marked/block.md', newBlock);

  const applied = fixture.run(['apply']);
  assert.equal(applied.code, 0, applied.output);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'marked.md'), 'utf8'), placed(newBlock));
  assert.equal(fixture.run(['status']).code, 0);
});

test('capture of a placed block takes the span apply writes, up to the anchor line', (t) => {
  const fixture = createPlacedFixture(t);
  seedState(fixture);
  const handBlock = '<!-- BEGIN BLOCK -->\n## Overlay\n\nhand-edited block\n<!-- END BLOCK -->\n\n';
  writeFile(fixture.tree, 'marked.md', placed(handBlock));

  const captured = fixture.run(['apply', '--capture', 'marked.md']);
  assert.equal(captured.code, 0, captured.output);
  assert.equal(fs.readFileSync(path.join(fixture.overlayDir, 'marked/block.md'), 'utf8'), handBlock);
  assert.equal(fixture.run(['status']).code, 0);
});

test('a missing insertBefore line refuses the block instead of appending it', (t) => {
  const base = '# Header\n\nno closing section here\n';
  const fixture = createPlacedFixture(t, base);
  const applied = fixture.run(['apply']);
  assert.notEqual(applied.code, 0, applied.output);
  assert.match(applied.output, /marked\.md has no line "## Related" for the block to go before; rebase the overlay/);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'marked.md'), 'utf8'), base);
});

test('naming an anchor moves a block that an earlier apply appended at the end', (t) => {
  const fixture = createFixture(t);
  writeFile(fixture.overlayDir, 'marked/base.md', PLACED_BASE);
  writeFile(fixture.tree, 'marked.md', PLACED_BASE);
  const entry = fixture.manifest.overlays.find((item) => item.id === 'marked-block');
  entry.pinnedSha256 = sha256(Buffer.from(PLACED_BASE));
  writeManifest(fixture);
  seedState(fixture);
  assert.match(fs.readFileSync(path.join(fixture.tree, 'marked.md'), 'utf8'), /- link\n\n<!-- BEGIN BLOCK -->/);

  writeFile(fixture.overlayDir, 'marked/block.md', PLACED_BLOCK);
  entry.insertBefore = '## Related';
  writeManifest(fixture);
  const moved = fixture.run(['apply']);
  assert.equal(moved.code, 0, moved.output);
  assert.equal(fs.readFileSync(path.join(fixture.tree, 'marked.md'), 'utf8'), placed(PLACED_BLOCK));
  assert.equal(fixture.run(['status']).code, 0);
});
