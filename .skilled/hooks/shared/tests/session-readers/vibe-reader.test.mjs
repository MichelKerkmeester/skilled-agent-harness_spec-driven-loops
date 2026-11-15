// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Reader Tests
// ───────────────────────────────────────────────────────────────────
// The fixtures are redacted copies of recorded Vibe 3.1.2 journals. The
// post-agent copy is the state a `post_agent` hook saw: the completion record is
// present and the projection's assistant message is not, which is why the reply
// is read from the completion first. A foreign journal must fail, never return
// an empty session, because a silent empty read would disable a turn-end guard.

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

import { capabilities, readSession } from '../../session-readers/index.mjs';
import {
  compactionsSince,
  lastAssistantText,
  loadVibeSession,
  turnId,
  turnToolCalls,
} from '../../session-readers/vibe.mjs';
import { withTempAsync, writeJsonl } from './helpers.mjs';

const FIXTURES = join(import.meta.dirname, 'fixtures', 'vibe');
const SCRATCH_CWD = join(FIXTURES, 'scratch-cwd');
const POST_AGENT = join(FIXTURES, 'post-agent');
const COMPACTION = join(FIXTURES, 'compaction');

const SCRATCH_CWD_SESSION = '08b32b11-0d8a-bb26-2385-86bb47a2ca7d';
const SCRATCH_CWD_TURN = 'turn-b72dd1f0707d41156142737776cebcbd';
const SCRATCH_CWD_REPLY = 'Wrote `proof.txt` (3 bytes: `ok` + newline) in the current folder.\n\n'
  + 'The line from my context:\n\n'
  + '> **Objective:** Give every Vibe dispatch bound to a packet that packet\'s goal slice '
  + 'and the session context in its first turn.';

test('the capability row serves Vibe history lookup', () => {
  assert.equal(capabilities.vibe.status, 'ready');
  assert.equal(capabilities.vibe.locatorKind, 'transcript_path');
});

test('the last assistant text is the recorded reply of the current turn', () => {
  const session = loadVibeSession({ transcriptPath: SCRATCH_CWD });
  assert.equal(session.ok, true, session.code);
  assert.equal(lastAssistantText(session), SCRATCH_CWD_REPLY);
});

test('a post_agent read takes the reply from the completion record', () => {
  const session = loadVibeSession({ transcriptPath: POST_AGENT });
  assert.equal(session.ok, true, session.code);
  const assistantMessages = session.entries.filter(
    (entry) => entry.type === 'message' && entry.role === 'assistant',
  );
  assert.equal(assistantMessages.length, 0);
  assert.equal(lastAssistantText(session), 'probe-ok');
});

test('the current turn tool calls are listed with their recorded input', () => {
  const session = loadVibeSession({ transcriptPath: SCRATCH_CWD });
  assert.equal(session.ok, true, session.code);
  const calls = turnToolCalls(session);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].name, 'file_system.write_file');
  assert.equal(calls[0].input.content, 'ok\n');
  assert.match(calls[0].input.path, /\/proof\.txt$/);
});

test('compactions are listed after a watermark and not after their own sequence', () => {
  const session = loadVibeSession({ transcriptPath: COMPACTION });
  assert.equal(session.ok, true, session.code);
  const compactions = compactionsSince(session, 0);
  assert.equal(compactions.length, 1);
  assert.equal(compactions[0].trigger, 'automatic');
  assert.equal(compactions[0].attempt, 1);
  assert.equal(compactions[0].summaryLength, 679);
  assert.equal(compactions[0].status, 'completed');
  assert.deepEqual(compactionsSince(session, compactions[0].sequence), []);
});

// An interactive session folds its journal into a snapshot generation, and the
// journal restarts after the snapshot sequence. A compaction that happened before
// the fold is then only inside the snapshot's projection chunk.
test('a compaction folded into the committed snapshot is still listed', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'vibe-snapshot-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const chunkId = 'a'.repeat(64);
  const compaction = {
    type: 'checkpoint',
    kind: 'compaction',
    id: 'checkpoint-compaction-11111111-2222-3333-4444-555555555555',
    generationStatus: 'completed',
    details: { trigger: 'manual', attempt: 1, summaryLength: 1500 },
  };
  const message = { type: 'message', role: 'user', id: 'user-1', turnId: 'turn-1', content: [] };
  mkdirSync(join(root, 'journal'), { recursive: true });
  mkdirSync(join(root, 'chunks'), { recursive: true });
  mkdirSync(join(root, 'generations', '0000000000000073'), { recursive: true });
  writeFileSync(join(root, 'journal', '0000000000000074.jsonl'), '');
  writeFileSync(join(root, 'chunks', `${chunkId}.json`), JSON.stringify([message, compaction]));
  writeFileSync(join(root, 'CURRENT'), JSON.stringify({ generation: '0000000000000073', snapshot_sequence: 73 }));
  writeFileSync(join(root, 'generations', '0000000000000073', 'manifest.json'), JSON.stringify({
    snapshot_sequence: 73,
    projection_state: { chunks: [chunkId], path: 'projection-state.json' },
  }));
  writeFileSync(join(root, 'generations', '0000000000000073', 'projection-state.json'), JSON.stringify({
    snapshot: { latestTurn: { id: 'turn-1' }, session: { id: 'snapshot-session' } },
  }));

  const session = loadVibeSession({ transcriptPath: root });
  assert.equal(session.ok, true, session.code);
  const compactions = compactionsSince(session, 0);
  assert.equal(compactions.length, 1);
  assert.equal(compactions[0].compactionId, '11111111-2222-3333-4444-555555555555');
  assert.equal(compactions[0].sequence, 73);
  assert.equal(turnId(session), 'turn-1');
});

test('the current turn id is the recorded turn', () => {
  const session = loadVibeSession({ transcriptPath: SCRATCH_CWD, sessionId: SCRATCH_CWD_SESSION });
  assert.equal(session.ok, true, session.code);
  assert.equal(turnId(session), SCRATCH_CWD_TURN);
});

test('a missing locator or journal returns a failure code', () => {
  assert.deepEqual(loadVibeSession({}), { ok: false, code: 'locator_unavailable' });
  assert.deepEqual(
    loadVibeSession({ transcriptPath: join(FIXTURES, 'missing') }),
    { ok: false, code: 'session_not_found' },
  );
});

test('a foreign journal fails instead of returning an empty session', async () => {
  await withTempAsync('vibe-foreign', async (root) => {
    writeJsonl(join(root, 'journal', '0000000000000001.jsonl'), [
      { type: 'user', message: { role: 'user', content: 'not a Vibe journal' } },
      { type: 'assistant', message: { role: 'assistant', content: 'still not one' } },
    ]);
    assert.deepEqual(loadVibeSession({ transcriptPath: root }), {
      ok: false,
      code: 'unsupported_format',
    });
  });
});

test('a read leaves the journal bytes and modification time unchanged', () => {
  const journal = join(SCRATCH_CWD, 'journal', '0000000000000001.jsonl');
  const before = {
    digest: createHash('sha256').update(readFileSync(journal)).digest('hex'),
    mtimeMs: statSync(journal).mtimeMs,
  };
  const session = loadVibeSession({ transcriptPath: SCRATCH_CWD });
  lastAssistantText(session);
  turnToolCalls(session);
  compactionsSince(session, 0);
  turnId(session);
  const after = {
    digest: createHash('sha256').update(readFileSync(journal)).digest('hex'),
    mtimeMs: statSync(journal).mtimeMs,
  };
  assert.deepEqual(after, before);
});

test('the reader conforms to the shared session envelope', async () => {
  const result = await readSession({
    runtime: 'vibe',
    sessionId: SCRATCH_CWD_SESSION,
    transcriptPath: SCRATCH_CWD,
  });
  assert.equal(result.ok, true, result.code);
  assert.equal(result.source.locatorKind, 'transcript_path');
  assert.deepEqual(result.items.map((item) => item.role), ['user', 'assistant']);
});
