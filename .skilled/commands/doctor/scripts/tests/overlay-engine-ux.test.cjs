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
    assert.ok(status.output.includes(`move it aside (mv ${destination} ${destination}.aside)`), status.output);

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
    assert.ok(result.output.includes('move it aside (mv guarded.txt guarded.txt.aside)'), result.output);
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
  assert.match(status.output, /\[overlay-engine\] \S+ has an unsupported shape: its links field is not a map of link targets/);
  assert.ok(status.output.includes(`  Next: restore the state file from git: git -C ${fixture.tree} checkout -- ` +
    path.relative(fixture.tree, statePath)), status.output);
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
