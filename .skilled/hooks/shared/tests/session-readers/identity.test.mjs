// ───────────────────────────────────────────────────────────────────
// MODULE: Identity Guard Tests
// ───────────────────────────────────────────────────────────────────
// A supplied path is accepted only when its real path stays inside the runtime
// root and the file's own identity equals the request. These cases cover the
// three escapes the guard exists to stop: traversal, a symlink and an id
// mismatch.

import assert from 'node:assert/strict';
import { mkdirSync, realpathSync, symlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

import { guardSessionPath, isSafeSessionId, samePath } from '../../session-readers/identity.mjs';
import { withTemp, writeText } from './helpers.mjs';

const SESSION = 'session-accepted';

test('the guard accepts a file inside the root when the recorded id matches', () => {
  withTemp('identity-accept', (root) => {
    const storeRoot = join(root, 'store');
    const filePath = writeText(join(storeRoot, 'project', `${SESSION}.jsonl`), '{}\n');
    const result = guardSessionPath({ path: filePath, root: storeRoot, sessionId: SESSION, recordedId: SESSION });
    assert.equal(result.ok, true);
    assert.equal(result.path, realpathSync(filePath));
  });
});

test('an empty path or session id is a locator_unavailable, not a read', () => {
  withTemp('identity-empty', (root) => {
    assert.equal(guardSessionPath({ path: '', root, sessionId: SESSION, recordedId: SESSION }).code, 'locator_unavailable');
    assert.equal(guardSessionPath({ path: join(root, 'x'), root, sessionId: '', recordedId: '' }).code, 'locator_unavailable');
  });
});

test('traversal through a .. segment is rejected as a session_mismatch', () => {
  withTemp('identity-traversal', (root) => {
    const storeRoot = join(root, 'store');
    mkdirSync(storeRoot, { recursive: true });
    const outside = writeText(join(root, 'outside.jsonl'), '{}\n');
    const traversal = join(storeRoot, '..', 'outside.jsonl');
    const result = guardSessionPath({ path: traversal, root: storeRoot, sessionId: SESSION, recordedId: SESSION });
    assert.equal(result.code, 'session_mismatch');
    assert.equal(samePath(traversal, outside), true);
  });
});

test('a symlink that leaves the root is rejected as a session_mismatch', () => {
  withTemp('identity-symlink', (root) => {
    const storeRoot = join(root, 'store');
    mkdirSync(storeRoot, { recursive: true });
    const outside = writeText(join(root, 'outside.jsonl'), '{}\n');
    const link = join(storeRoot, 'linked.jsonl');
    symlinkSync(outside, link);
    const result = guardSessionPath({ path: link, root: storeRoot, sessionId: SESSION, recordedId: SESSION });
    assert.equal(result.code, 'session_mismatch');
  });
});

test('a stored id that disagrees with the request is a session_mismatch', () => {
  withTemp('identity-mismatch', (root) => {
    const storeRoot = join(root, 'store');
    const filePath = writeText(join(storeRoot, `${SESSION}.jsonl`), '{}\n');
    const result = guardSessionPath({ path: filePath, root: storeRoot, sessionId: SESSION, recordedId: 'another-session' });
    assert.equal(result.code, 'session_mismatch');
  });
});

test('a session id containing a separator or NUL cannot name a stored session', () => {
  assert.equal(isSafeSessionId(SESSION), true);
  assert.equal(isSafeSessionId('../escape'), false);
  assert.equal(isSafeSessionId('a/b'), false);
  assert.equal(isSafeSessionId('a\0b'), false);
  assert.equal(isSafeSessionId(''), false);
});

test('a missing file is a store_unreadable, and the id comparison never runs', () => {
  withTemp('identity-missing', (root) => {
    const storeRoot = join(root, 'store');
    mkdirSync(storeRoot, { recursive: true });
    const result = guardSessionPath({
      path: join(storeRoot, 'missing.jsonl'),
      root: storeRoot,
      sessionId: SESSION,
      recordedId: SESSION,
    });
    assert.equal(result.code, 'store_unreadable');
  });
});

test('samePath resolves two spellings of one file', () => {
  withTemp('identity-same', (root) => {
    const filePath = writeText(join(root, 'file.txt'), 'x');
    writeFileSync(join(root, 'copy.txt'), 'x');
    assert.equal(samePath(filePath, join(root, '.', 'file.txt')), true);
    assert.equal(samePath(filePath, join(root, 'copy.txt')), false);
  });
});
