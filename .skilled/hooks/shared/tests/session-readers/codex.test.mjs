// ───────────────────────────────────────────────────────────────────
// MODULE: Codex Reader Tests
// ───────────────────────────────────────────────────────────────────
// Codex may hand over a null path, and its rollout file name can disagree with
// the identity inside the file. The header wins, and a missing path never
// borrows another runtime's store.

import assert from 'node:assert/strict';
import { join } from 'node:path';
import { test } from 'node:test';

import { readSession } from '../../session-readers/index.mjs';
import { codexSession, DECOY, NOW, SESSION } from './fixtures.mjs';
import { trackFileOpens, withTemp, withTempAsync, writeJsonl } from './helpers.mjs';

test('a rollout resolves by the id inside session_meta', () => {
  withTemp('codex-reader', (root) => {
    const fixture = codexSession({ root });
    return readSession({ runtime: 'codex', sessionId: SESSION, ...fixture.options }).then((result) => {
      assert.equal(result.ok, true);
      assert.equal(result.source.runtime, 'codex');
      assert.equal(result.items[0].role, 'user');
      assert.equal(result.items[2].toolCallId, 'codex-call-1');
    });
  });
});

test('a rollout outside the store is refused without reading it', async () => {
  await withTempAsync('codex-outside', async (root) => {
    const fixture = codexSession({ root });
    const outside = writeJsonl(join(root, 'outside-codex.jsonl'), [
      { timestamp: NOW, type: 'session_meta', payload: { id: SESSION } },
    ]);

    const tracker = trackFileOpens();
    try {
      const result = await readSession({
        runtime: 'codex',
        sessionId: SESSION,
        codexRoot: fixture.root,
        transcriptPath: outside,
      });
      assert.equal(result.ok, false);
      assert.equal(result.code, 'session_mismatch');
      assert.equal(tracker.opened.includes(outside), false, 'the outside path was opened before the refusal');
    } finally {
      tracker.restore();
    }
  });
});

test('the header id wins over a rollout file name that disagrees', () => {
  withTemp('codex-header-wins', (root) => {
    const fixture = codexSession({ root, fileName: `rollout-2026-11-07T12-00-00-${DECOY}.jsonl` });
    return readSession({ runtime: 'codex', sessionId: SESSION, ...fixture.options }).then((result) => {
      assert.equal(result.ok, true);
      assert.equal(result.source.sessionId, SESSION);
    });
  });
});

test('a null transcript_path is a locator_unavailable and reads no file', async () => {
  const result = await readSession({ runtime: 'codex', sessionId: SESSION, transcriptPath: null });
  assert.equal(result.ok, false);
  assert.equal(result.code, 'locator_unavailable');
});

test('a rollout that declares another session is a session_mismatch', () => {
  withTemp('codex-mismatch', (root) => {
    const fixture = codexSession({ root, headerId: DECOY });
    return readSession({ runtime: 'codex', sessionId: SESSION, ...fixture.options }).then((result) => {
      assert.equal(result.ok, false);
      assert.equal(result.code, 'session_mismatch');
    });
  });
});

test('an absent rollout is a session_not_found when the store is present', () => {
  withTemp('codex-absent', (root) => {
    const fixture = codexSession({ root });
    return readSession({
      runtime: 'codex',
      sessionId: SESSION,
      codexRoot: fixture.root,
      transcriptPath: join(fixture.root, '2026', '11', '08', 'missing.jsonl'),
    }).then((result) => {
      assert.equal(result.ok, false);
      assert.equal(result.code, 'session_not_found');
    });
  });
});

test('an unreadable store is reported without throwing', () => {
  withTemp('codex-unreadable', (root) => {
    return readSession({
      runtime: 'codex',
      sessionId: SESSION,
      codexRoot: join(root, 'missing-store'),
      transcriptPath: join(root, 'missing-store', 'rollout.jsonl'),
    }).then((result) => {
      assert.equal(result.ok, false);
      assert.equal(result.code, 'store_unreadable');
    });
  });
});
