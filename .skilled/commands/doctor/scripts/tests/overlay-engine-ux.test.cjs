'use strict';

// Operator messages: a refusal says what happened, why, and the exact next
// command on a Next: line, and a folder where an overlay writes a file is
// refused instead of crashing the planner.

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const { createSyncFixture, writeFile } = require('./overlay-engine-fixtures.cjs');
const engine = require('../overlay-engine.cjs');

const ENGINE_COMMAND = 'node .skilled/commands/doctor/scripts/overlay-engine.cjs';

for (const [id, destination] of [['json-entry', 'settings.json'], ['marked-block', 'marked.md']]) {
  test(`a folder where the ${id} overlay writes a file is refused, not a crash`, (t) => {
    const fixture = createSyncFixture(t);
    fs.rmSync(path.join(fixture.tree, destination));
    writeFile(fixture.tree, path.join(destination, 'inside.txt'), 'in the way\n');

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
  assert.equal(lines[2], `  Next: edit skilled-overlays/files/guarded.txt, then from ${fixture.tree}: ${ENGINE_COMMAND} apply`);
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
