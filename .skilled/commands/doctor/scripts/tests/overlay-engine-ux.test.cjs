'use strict';

// Operator messages: a refusal says what happened, why, and the exact next
// command on a Next: line, and a folder where an overlay writes a file is
// refused instead of crashing the planner.

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const { createSyncFixture, writeFile, writeManifest } = require('./overlay-engine-fixtures.cjs');
const engine = require('../overlay-engine.cjs');

const ENGINE_COMMAND = 'node .skilled/commands/doctor/scripts/overlay-engine.cjs';

for (const [id, destination] of [['json-entry', 'settings.json'], ['marked-block', 'marked.md']]) {
  for (const shape of ['folder', 'link to a folder']) test(`a ${shape} where the ${id} overlay writes a file is refused, not a crash`, (t) => {
    const fixture = createSyncFixture(t);
    fs.rmSync(path.join(fixture.tree, destination));
    if (shape === 'folder') {
      writeFile(fixture.tree, path.join(destination, 'inside.txt'), 'in the way\n');
    } else {
      fs.mkdirSync(path.join(fixture.tree, 'elsewhere'));
      fs.symlinkSync('elsewhere', path.join(fixture.tree, destination));
    }

    const status = fixture.run(['status']);

    assert.equal(status.output.includes('EISDIR'), false, status.output);
    assert.notEqual(status.code, 0, status.output);
    assert.match(status.output, new RegExp(`${destination.replace('.', '\\.')} is a folder`), status.output);
    const live = path.join(fixture.tree, destination);
    assert.ok(status.output.includes(`  Next: mv ${live} ${live}.keep, then from ${fixture.tree}: ${ENGINE_COMMAND} apply`), status.output);

    const applied = fixture.run(['apply']);
    assert.equal(applied.code, 1, applied.output);
    assert.equal(applied.output.includes('EISDIR'), false, applied.output);
    assert.ok(applied.output.includes(`  Next: from ${fixture.tree}: ${ENGINE_COMMAND} apply, after fixing each BLOCKED line above`),
      applied.output);
  });
}

test('the guard names why an owned path is refused and the folder to run apply from', (t) => {
  const fixture = createSyncFixture(t);
  const guarded = fixture.run(['--guard', path.join(fixture.tree, 'guarded.txt')]);

  assert.equal(guarded.code, 1, guarded.output);
  const lines = guarded.output.split('\n');
  assert.equal(lines[0], `refuse: guarded.txt is owned by skilled-overlays/files/guarded.txt; edit the overlay, ` +
    `then run ${ENGINE_COMMAND} apply`);
  assert.equal(lines[1], '  apply writes the overlay copy over this path, so it would overwrite an edit made here');
  // The overlay copy is named by its absolute path, so a folder beside the tree
  // cannot be read as one inside it.
  assert.equal(lines[2], `  Next: edit ${path.join(fixture.overlayDir, 'files', 'guarded.txt')}, then from ${fixture.tree}: ` +
    `${ENGINE_COMMAND} apply`);
});

test('a held lock names the pid to check and the lock file to remove', (t) => {
  const fixture = createSyncFixture(t);
  const lockPath = engine.createContext(fixture.tree).lockPath;
  fs.writeFileSync(lockPath, `apply pid=${process.pid} host=${require('node:os').hostname()} 2026-01-01T00:00:00.000Z\n`);

  const applied = fixture.run(['apply']);

  assert.equal(applied.code, 2, applied.output);
  assert.match(applied.output, /^refuse: the overlay lock is held: apply pid=/m);
  assert.ok(applied.output.includes(`  Next: check that pid ${process.pid} has ended (ps -p ${process.pid}), then rm ${lockPath}`),
    applied.output);
});

test('a re-pin rollback with an unknown run id names where the runs are listed', (t) => {
  const fixture = createSyncFixture(t);

  const rolled = fixture.run(['repin', '--rollback', '20260101T000000Z-missing']);

  assert.equal(rolled.code, 2, rolled.output);
  assert.match(rolled.output, /^refuse: (not a run id|no backup for run)/m, rolled.output);
  assert.ok(rolled.output.includes(`  Next: ls ${path.join(fixture.overlayDir, 'repin-runs')}, then rerun`), rolled.output);
  assert.match(rolled.output, /^RESULT: FAILED$/m);
});

test('a link to a folder where a whole-file overlay writes a file is refused, not a crash', (t) => {
  const fixture = createSyncFixture(t);
  fs.rmSync(path.join(fixture.tree, 'guarded.txt'));
  fs.mkdirSync(path.join(fixture.tree, 'elsewhere'));
  fs.symlinkSync('elsewhere', path.join(fixture.tree, 'guarded.txt'));

  for (const command of ['status', 'apply']) {
    const result = fixture.run([command]);
    assert.equal(result.output.includes('EISDIR'), false, result.output);
    assert.equal(result.code, 1, result.output);
    assert.match(result.output, /guarded\.txt is a folder, where overlay \S+ edits a file, so there is nothing to merge into\n/);
    const live = path.join(fixture.tree, 'guarded.txt');
    assert.ok(result.output.includes(`  Next: mv ${live} ${live}.keep, then from ${fixture.tree}: ${ENGINE_COMMAND} apply`), result.output);
  }
});

test('a remove path written with a trailing slash removes the same folder as one without', (t) => {
  const fixture = createSyncFixture(t);
  writeFile(fixture.tree, 'skill/old/notes.md', 'vendor notes\n');
  fixture.manifest.overlays.find((entry) => entry.id === 'skill-root').remove = ['old/'];
  writeManifest(fixture);

  const applied = fixture.run(['apply']);

  assert.equal(applied.code, 0, applied.output);
  assert.equal(fs.existsSync(path.join(fixture.tree, 'skill', 'old', 'notes.md')), false, applied.output);
});

test('a state file of an unsupported shape names the field and the git command that restores it', (t) => {
  const fixture = createSyncFixture(t);
  assert.equal(fixture.run(['apply']).code, 0);
  const statePath = engine.createContext(fixture.tree).statePath;
  const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
  state.links = [];
  fs.writeFileSync(statePath, JSON.stringify(state));

  const status = fixture.run(['status']);

  assert.equal(status.code, 2, status.output);
  assert.match(status.output, /\[overlay-engine\] \S+ has an unsupported shape\n {2}its links field is not a map of link targets/);
  assert.ok(status.output.includes(`  Next: restore the state file from git: git -C ${fixture.tree} checkout -- ` +
    path.relative(fixture.tree, statePath)), status.output);
});

test('a state file that is not valid JSON names why and the git command that restores it', (t) => {
  const fixture = createSyncFixture(t);
  assert.equal(fixture.run(['apply']).code, 0);
  const statePath = engine.createContext(fixture.tree).statePath;
  fs.writeFileSync(statePath, '{ "files": \n');

  const status = fixture.run(['status']);

  assert.equal(status.code, 2, status.output);
  assert.match(status.output, /\[overlay-engine\] sync-state\.json is not valid JSON: [^\n]+\n {2}every command reads the state file/);
  assert.ok(status.output.includes(`  Next: restore the state file from git: git -C ${fixture.tree} checkout -- ` +
    path.relative(fixture.tree, statePath)), status.output);
});

test('a replace folder written with a trailing slash prunes a dropped subfolder of Python caches', (t) => {
  const fixture = createSyncFixture(t);
  const entry = fixture.manifest.overlays.find((item) => item.id === 'skill-root');
  entry.replace = ['SKILL.md', 'docs/'];
  writeFile(fixture.overlayDir, 'skill-root-source/docs/sub/tool.md', 'sub tool\n');
  writeManifest(fixture);
  assert.equal(fixture.run(['apply']).code, 0);
  writeFile(fixture.tree, 'skill/docs/sub/__pycache__/tool.cpython-39.pyc', 'cache\n');
  fs.rmSync(path.join(fixture.overlayDir, 'skill-root-source/docs/sub'), { recursive: true });

  const applied = fixture.run(['apply']);

  assert.equal(applied.code, 0, applied.output);
  assert.equal(fs.existsSync(path.join(fixture.tree, 'skill/docs/sub')), false, applied.output);
});

test('a file under a replace folder written with a trailing slash is captured into that folder', (t) => {
  const fixture = createSyncFixture(t);
  const entry = fixture.manifest.overlays.find((item) => item.id === 'skill-root');
  entry.replace = ['SKILL.md', 'docs/'];
  writeManifest(fixture);
  assert.equal(fixture.run(['apply']).code, 0);
  writeFile(fixture.tree, 'skill/docs/readme.md', 'live doc edit\n');

  const captured = fixture.run(['apply', '--capture', 'skill/docs/readme.md']);

  assert.equal(captured.code, 0, captured.output);
  assert.equal(fs.readFileSync(path.join(fixture.overlayDir, 'skill-root-source/docs/readme.md'), 'utf8'), 'live doc edit\n');
});

test('a setting file that names no folder says which value to set and the command to check it', (t) => {
  const fixture = createSyncFixture(t);
  fs.writeFileSync(path.join(fixture.tree, '.skilled-overlays.json'), '{"overlayDir": ""}\n');

  const status = fixture.run(['status']);

  assert.equal(status.code, 2, status.output);
  assert.match(status.output, /^\[overlay-engine\] \.skilled-overlays\.json must name the overlay folder as a non-empty string$/m);
  assert.ok(status.output.includes(`  Next: set "overlayDir" in ${path.join(fixture.tree, '.skilled-overlays.json')} ` +
    `to a folder such as "skilled-overlays" (in the tree) or "../overlays" (beside it), then from ${fixture.tree}: ` +
    `${ENGINE_COMMAND} status`), status.output);
});

test('status reports a regeneration a failed apply left pending, and passes once apply finishes it', (t) => {
  const fixture = createSyncFixture(t);
  fixture.manifest.regenerate = [{ id: 'fails', argv: ['node', '-e', 'process.exit(3)'] }];
  writeManifest(fixture);
  writeFile(fixture.overlayDir, 'files/guarded.txt', 'overlay two\n');
  assert.equal(fixture.run(['apply']).code, 1);

  const status = fixture.run(['status']);
  const report = JSON.parse(fixture.run(['status', '--json']).stdout);

  assert.equal(status.code, 1, status.output);
  const lines = status.output.split('\n');
  const at = lines.indexOf('REGEN    pending: fails');
  assert.ok(at >= 0, status.output);
  assert.equal(lines[at + 1], '  an earlier apply did not finish its regeneration, so the next apply reruns these steps',
    status.output);
  assert.equal(lines[at + 2], `  Next: from ${fixture.tree}: ${ENGINE_COMMAND} apply`, status.output);
  assert.match(status.output, /RESULT: FAILED/);
  assert.equal(report.result, 'FAILED');
  assert.deepEqual(report.regeneratePending, ['fails']);

  fixture.manifest.regenerate = [{ id: 'fails', argv: ['node', '-e', 'process.exit(0)'] }];
  writeManifest(fixture);
  assert.equal(fixture.run(['apply']).code, 0);
  const settled = fixture.run(['status']);
  assert.equal(settled.code, 0, settled.output);
  assert.equal(settled.output.includes('REGEN'), false, settled.output);
  assert.deepEqual(JSON.parse(fixture.run(['status', '--json']).stdout).regeneratePending, []);
});

test('an insert into an empty object says why it cannot and names a set as the way through', (t) => {
  const fixture = createSyncFixture(t);
  fs.writeFileSync(path.join(fixture.tree, 'settings.json'), '{}\n');

  const applied = fixture.run(['apply']);

  assert.notEqual(applied.code, 0, applied.output);
  assert.match(applied.output, /cannot apply the entry set to settings\.json: cannot insert into the empty object at /);
  assert.ok(applied.output.includes('  an insert lays its entries out like the ones already there, and an empty ' +
    'object or array holds none'), applied.output);
  assert.ok(applied.output.includes(`  Next: add one entry to settings.json by hand, or write the whole value with a ` +
    `set operation in ${path.join(fixture.overlayDir, 'json/entries.json')}, then from ${fixture.tree}: ` +
    `${ENGINE_COMMAND} status`), applied.output);
});

test('a capture of a path no overlay writes names the adopt that brings it under one', (t) => {
  const fixture = createSyncFixture(t);
  writeFile(fixture.tree, 'loose.md', 'loose\n');

  const captured = fixture.run(['apply', '--capture', path.join(fixture.tree, 'loose.md')]);

  assert.equal(captured.code, 2, captured.output);
  const lines = captured.output.trim().split('\n');
  assert.equal(lines[0], 'refuse: path is not an overlay destination: ' + path.join(fixture.tree, 'loose.md'));
  assert.equal(lines[1], '  capture copies a live edit into the overlay that writes the path, and no overlay writes this one');
  assert.equal(lines[2], '  Next: capture a path a status line names, or bring this one under an overlay: ' +
    `from ${fixture.tree}: ${ENGINE_COMMAND} apply --adopt loose.md`);
});

test('a capture of a json-entry destination names the entry set to edit and the apply after it', (t) => {
  const fixture = createSyncFixture(t);

  const captured = fixture.run(['apply', '--capture', 'settings.json']);

  assert.equal(captured.code, 2, captured.output);
  const lines = captured.output.trim().split('\n');
  assert.match(lines[0], /^refuse: edit \S+\/json\/entries\.json instead$/);
  assert.equal(lines[2], `  Next: edit ${path.join(fixture.overlayDir, 'json/entries.json')}, then from ${fixture.tree}: ` +
    `${ENGINE_COMMAND} apply`, captured.output);
});

test('relayout onto a layout path that already holds a file names the file to move aside', (t) => {
  const fixture = createSyncFixture(t);
  writeFile(fixture.overlayDir, 'root/guarded.txt', 'in the way\n');

  const relayout = fixture.run(['apply', '--relayout']);

  assert.equal(relayout.code, 2, relayout.output);
  const lines = relayout.output.split('\n');
  const at = lines.findIndex((line) => /^refuse: root\/guarded\.txt already exists in \S+$/.test(line));
  assert.ok(at >= 0, relayout.output);
  assert.equal(lines[at + 1], '  relayout never writes over a file that sits at a layout path', relayout.output);
  assert.equal(lines[at + 2], `  Next: move ${path.join(fixture.overlayDir, 'root/guarded.txt')} aside once you have ` +
    `compared it with ${path.join(fixture.overlayDir, 'files/guarded.txt')}, then from ${fixture.tree}: ` +
    `${ENGINE_COMMAND} apply --relayout`, relayout.output);
});

test('a manifest that is not valid JSON is named, with the fix and the command after it', (t) => {
  const fixture = createSyncFixture(t);
  const manifestPath = path.join(fixture.overlayDir, 'overlay-manifest.json');
  fs.writeFileSync(manifestPath, '{ "overlays": [\n');

  const status = fixture.run(['status']);

  assert.equal(status.code, 2, status.output);
  assert.ok(status.output.includes(`${manifestPath} is not valid JSON`), status.output);
  assert.ok(status.output.includes(`  Next: fix the JSON in ${manifestPath}, then from ${fixture.tree}: ${ENGINE_COMMAND} status`),
    status.output);
});
