// ───────────────────────────────────────────────────────────────────
// MODULE: DSH Reader Tests
// ───────────────────────────────────────────────────────────────────
// The session directory is named by the exact id, so a missing id never scans a
// newer sibling. Because the project key collapses separators, the header cwd
// is checked before any event is trusted. Logs may be compressed frame chains.

import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { zstdCompressSync } from 'node:zlib';

import { readSession } from '../../session-readers/index.mjs';
import { dshProjectKey } from '../../session-readers/dsh.mjs';
import { DECOY, dshSession, NOW, SESSION } from './fixtures.mjs';
import { trackFileOpens, withTempAsync, writeJsonl } from './helpers.mjs';

// The fixtures build store folders with the reader's own key helper, so this
// pins the helper to a folder name a real DSH install wrote.
test('the project key matches the folder name DSH writes', () => {
  assert.equal(
    dshProjectKey('/Users/michelkerkmeester/Documents/deepseek-harness/default-workspace'),
    '--Users-michelkerkmeester-Documents-deepseek-harness-default-workspace--',
  );
});

test('a session log resolves by header id and matching cwd', async () => {
  await withTempAsync('dsh-reader', async (root) => {
    const projectDir = join(root, 'project');
    mkdirSync(projectDir, { recursive: true });
    const fixture = dshSession({ root, projectDir });
    const result = await readSession({ runtime: 'dsh', sessionId: SESSION, ...fixture.options });
    assert.equal(result.ok, true);
    assert.equal(result.source.locatorKind, 'session_log');
    assert.deepEqual(result.items.map((item) => item.role), ['user', 'assistant', 'toolResult', 'assistant']);
    assert.equal(result.items[2].toolCallId, 'dsh-call-1');
  });
});

test('a session path outside the store is refused without reading it', async () => {
  await withTempAsync('dsh-outside', async (root) => {
    const projectDir = join(root, 'project');
    mkdirSync(projectDir, { recursive: true });
    const fixture = dshSession({ root, projectDir });
    const outside = writeJsonl(join(root, 'outside-dsh.jsonl'), [
      { type: 'session', version: 4, id: SESSION, timestamp: NOW, cwd: projectDir },
      {
        type: 'user/message',
        seq: 1,
        data: { role: 'user', id: 'outside-u1', source: { kind: 'user' }, content: [{ type: 'text', text: 'outside the store' }] },
      },
    ]);

    const tracker = trackFileOpens();
    try {
      const result = await readSession({
        runtime: 'dsh',
        sessionId: SESSION,
        ...fixture.options,
        sessionPath: outside,
      });
      assert.equal(result.ok, false);
      assert.equal(result.code, 'session_mismatch');
      assert.equal(tracker.opened.includes(outside), false, 'the outside path was opened before the refusal');
    } finally {
      tracker.restore();
    }
  });
});

test('a project-key collision is rejected by the header cwd', async () => {
  await withTempAsync('dsh-collision', async (root) => {
    const projectDir = join(root, 'a', 'b');
    const otherDir = join(root, 'a-b');
    mkdirSync(projectDir, { recursive: true });
    mkdirSync(otherDir, { recursive: true });

    const fixture = dshSession({ root, projectDir, headerCwd: otherDir });
    const result = await readSession({ runtime: 'dsh', sessionId: SESSION, ...fixture.options });
    assert.equal(result.ok, false);
    assert.equal(result.code, 'session_mismatch');
  });
});

test('an absent id is a session_not_found even when a newer session exists', async () => {
  await withTempAsync('dsh-absent', async (root) => {
    const projectDir = join(root, 'project');
    mkdirSync(projectDir, { recursive: true });
    dshSession({ root, projectDir, sessionId: DECOY });
    const result = await readSession({
      runtime: 'dsh',
      sessionId: SESSION,
      dshRoot: join(root, 'dsh', 'sessions'),
      projectDir,
    });
    assert.equal(result.ok, false);
    assert.equal(result.code, 'session_not_found');
  });
});

test('a missing store is a store_unreadable', async () => {
  await withTempAsync('dsh-unreadable', async (root) => {
    const projectDir = join(root, 'project');
    mkdirSync(projectDir, { recursive: true });
    const result = await readSession({
      runtime: 'dsh',
      sessionId: SESSION,
      dshRoot: join(root, 'missing-dsh-store'),
      projectDir,
    });
    assert.equal(result.ok, false);
    assert.equal(result.code, 'store_unreadable');
  });
});

test('a compressed log is decoded through its frame chain', async () => {
  await withTempAsync('dsh-zstd', async (root) => {
    const projectDir = join(root, 'project');
    mkdirSync(projectDir, { recursive: true });
    const directory = join(root, 'dsh', 'sessions', dshProjectKey(projectDir), SESSION);
    const lines = [
      { type: 'session', version: 4, id: SESSION, timestamp: '2026-11-07T12:00:00.000Z', cwd: projectDir },
      { type: 'user/message', seq: 1, data: { role: 'user', id: 'u1', source: { kind: 'user' }, content: [{ type: 'text', text: 'Hello.' }] } },
    ];
    const text = lines.map((line) => JSON.stringify(line)).join('\n') + '\n';
    const cut = text.indexOf('\n', Math.floor(text.length / 2)) + 1;

    mkdirSync(directory, { recursive: true });
    const filePath = join(directory, 'session.v4.jsonl.zstd');
    writeFileSync(filePath, Buffer.concat([
      zstdCompressSync(Buffer.from(text.slice(0, cut))),
      zstdCompressSync(Buffer.from(text.slice(cut))),
    ]));

    const result = await readSession({
      runtime: 'dsh',
      sessionId: SESSION,
      dshRoot: join(root, 'dsh', 'sessions'),
      projectDir,
    });
    assert.equal(result.ok, true);
    assert.equal(result.items.length, 1);
  });
});

test('a torn plain log still yields its complete entries', async () => {
  await withTempAsync('dsh-torn', async (root) => {
    const projectDir = join(root, 'project');
    mkdirSync(projectDir, { recursive: true });
    const directory = join(root, 'dsh', 'sessions', dshProjectKey(projectDir), SESSION);
    const filePath = join(directory, 'session.v2.jsonl');
    const complete = [
      { type: 'session', version: 4, id: SESSION, cwd: projectDir },
      { type: 'user/message', seq: 1, data: { role: 'user', id: 'u1', source: { kind: 'user' }, content: [{ type: 'text', text: 'Hello.' }] } },
    ];
    mkdirSync(directory, { recursive: true });
    writeFileSync(filePath, complete.map((line) => JSON.stringify(line)).join('\n') + '\n{"type":"assistant/mess');

    const result = await readSession({
      runtime: 'dsh',
      sessionId: SESSION,
      dshRoot: join(root, 'dsh', 'sessions'),
      projectDir,
    });
    assert.equal(result.ok, true);
    assert.equal(result.items.length, 1);
  });
});

test('a pruned tool result keeps its full first copy and the event time', async () => {
  await withTempAsync('dsh-prune', async (root) => {
    const projectDir = join(root, 'project');
    mkdirSync(projectDir, { recursive: true });
    const directory = join(root, 'dsh', 'sessions', dshProjectKey(projectDir), SESSION);
    const time = Date.parse('2026-11-07T12:00:00.000Z');
    writeJsonl(join(directory, 'session.v4.jsonl'), [
      { type: 'session', version: 4, id: SESSION, cwd: projectDir },
      { type: 'user/message', seq: 1, time, data: { role: 'user', id: 'u1', source: { kind: 'user' }, content: [{ type: 'text', text: 'Read it.' }] } },
      { type: 'assistant/message', seq: 2, time, data: { message: { role: 'assistant', id: 'a1', content: [{ type: 'tool-call', id: 'call-1', name: 'read', arguments: '{}' }] } } },
      { type: 'tool/result', seq: 3, time, data: { message: { role: 'tool', id: 'r1', toolCallId: 'call-1', content: [{ type: 'text', text: 'full output' }] } } },
      { type: 'compaction/prune', seq: 4, time, data: { shadowedSeqs: [3] } },
      { type: 'tool/result', seq: 5, time, data: { message: { role: 'tool', id: 'r1', toolCallId: 'call-1', content: [{ type: 'text', text: '[pruned]' }] } } },
    ]);

    const result = await readSession({ runtime: 'dsh', sessionId: SESSION, dshRoot: join(root, 'dsh', 'sessions'), projectDir });
    assert.equal(result.ok, true);
    const results = result.items.filter((item) => item.role === 'toolResult');
    assert.equal(results.length, 1);
    assert.match(JSON.stringify(results[0]), /full output/);
    assert.equal(result.items[0].timestamp, '2026-11-07T12:00:00.000Z');
  });
});
