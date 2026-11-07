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

const {
  createSyncFixture: createFixture,
  readJson,
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

test('clean apply records every managed file and a second apply is a no-op', (t) => {
  const fixture = createFixture(t);
  const first = seedState(fixture);
  assert.equal(first.output.trim(), '5 changed');

  const second = fixture.run(['apply']);
  assert.equal(second.code, 0, second.output);
  assert.equal(second.output.trim(), '0 changed');

  const state = readJson(fixture.statePath);
  assert.equal(state.schemaVersion, 1);
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
