import test from 'node:test';
import assert from 'node:assert/strict';
import { formatQueueNotification } from '../src/notifications.ts';

test('queue notification lists every dependency skill by name', () => {
  assert.equal(
    formatQueueNotification('group "Dev"', {
      roots: ['architecture-review', 'write-prd'],
      order: ['verify-before-done', 'architecture-review', 'grill-me', 'write-prd'],
    }),
    'Queued group "Dev": architecture-review, write-prd + 2 dependencies (verify-before-done, grill-me).',
  );
});

test('queue notification is concise when there are no dependencies', () => {
  assert.equal(
    formatQueueNotification('skill "tdd"', {
      roots: ['tdd'],
      order: ['tdd'],
    }),
    'Queued skill "tdd": tdd.',
  );
});

test('a root that is also referenced by another root is not repeated as a dependency', () => {
  assert.equal(
    formatQueueNotification('group "Build"', {
      roots: ['tdd', 'verify-before-done'],
      order: ['verify-before-done', 'tdd'],
    }),
    'Queued group "Build": tdd, verify-before-done.',
  );
});


test("queue notification surfaces missing dependencies and cycles", () => {
  const text = formatQueueNotification('skill "root"', {
    roots: ['root'],
    order: ['dep', 'root'],
    missing: ['missing-helper'],
    cycles: [['root', 'dep', 'root']],
  });
  assert.match(text, /1 missing dependency/);
  assert.match(text, /1 dependency cycle/);
});
