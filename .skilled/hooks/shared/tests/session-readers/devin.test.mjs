// ───────────────────────────────────────────────────────────────────
// MODULE: Devin Reader Tests
// ───────────────────────────────────────────────────────────────────
// The sessions database is the live store on Devin 3000.12: the session row
// proves the id and its working directory, and the message chain is projected
// in conversation order. Older transcript-only stores still resolve through
// the file, whose own id must agree with the request.

import assert from 'node:assert/strict';
import { mkdirSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

import { readSession } from '../../session-readers/index.mjs';
import { DECOY, devinSession, NOW, SESSION } from './fixtures.mjs';
import { trackFileOpens, withTempAsync, writeJson } from './helpers.mjs';

test('a sessions database row and its chain resolve one session', async () => {
  await withTempAsync('devin-db', async (root) => {
    const projectDir = join(root, 'project');
    mkdirSync(projectDir, { recursive: true });
    const fixture = devinSession({ root, projectDir });
    const result = await readSession({ runtime: 'devin', sessionId: SESSION, ...fixture.options });
    assert.equal(result.ok, true);
    assert.equal(result.source.locatorKind, 'session_id');
    assert.equal(result.source.storePath, realpathSync(fixture.dbPath));
    assert.deepEqual(result.items.map((item) => item.role), ['user', 'assistant', 'toolResult', 'assistant']);
    assert.equal(result.items[0].content[0].text, 'Read the file.');
    assert.equal(result.items[2].toolCallId, 'devin-call-1');
    assert.equal(result.items[2].content[0].text, 'file contents');
  });
});

test('a sessions database hit is preferred over a transcript with another id', async () => {
  await withTempAsync('devin-db-preferred', async (root) => {
    const projectDir = join(root, 'project');
    mkdirSync(projectDir, { recursive: true });
    const fixture = devinSession({ root, projectDir, transcriptId: DECOY });
    const result = await readSession({ runtime: 'devin', sessionId: SESSION, ...fixture.options });
    assert.equal(result.ok, true);
    assert.equal(result.source.locatorKind, 'session_id');
    assert.equal(result.items.find((item) => item.id === 'devin-devin-user-1')?.content[0].text, 'Read the file.');
  });
});

test('a transcript outside the store is refused without reading it', async () => {
  await withTempAsync('devin-outside', async (root) => {
    const projectDir = join(root, 'project');
    mkdirSync(projectDir, { recursive: true });
    const fixture = devinSession({ root, projectDir, withSessionsRow: false });
    const outside = writeJson(join(root, 'outside-devin.json'), {
      schema_version: 'ATIF-v1.7',
      session_id: SESSION,
      steps: [{ step_id: 1, timestamp: NOW, source: 'user', message: 'outside the store' }],
    });

    const tracker = trackFileOpens();
    try {
      const result = await readSession({
        runtime: 'devin',
        sessionId: SESSION,
        ...fixture.options,
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

test('a compacted session keeps the turns from before the compaction', async () => {
  await withTempAsync('devin-compacted', async (root) => {
    const fixture = devinSession({ root, projectDir: '/fixture/project', compacted: true });
    const result = await readSession({ runtime: 'devin', sessionId: SESSION, ...fixture.options });
    assert.equal(result.ok, true);
    const users = result.items.filter((item) => item.role === 'user').map((item) => item.content[0].text);
    assert.deepEqual(users, ['Read the file.', 'Where were we?']);
  });
});

test('a session recorded in a folder below the named folder resolves', async () => {
  await withTempAsync('devin-subfolder', async (root) => {
    const project = realpathSync(root);
    const folder = join(project, 'packages', 'app');
    mkdirSync(folder, { recursive: true });
    const fixture = devinSession({ root, projectDir: project, workingDirectory: folder });
    const result = await readSession({ runtime: 'devin', sessionId: SESSION, ...fixture.options });
    assert.equal(result.ok, true);
  });
});

test('a sessions row for another working directory is a session_mismatch', async () => {
  await withTempAsync('devin-wrong-project', async (root) => {
    const projectDir = join(root, 'project');
    const otherDir = join(root, 'other-project');
    mkdirSync(projectDir, { recursive: true });
    mkdirSync(otherDir, { recursive: true });

    const fixture = devinSession({ root, projectDir, workingDirectory: otherDir });
    const result = await readSession({ runtime: 'devin', sessionId: SESSION, ...fixture.options });
    assert.equal(result.ok, false);
    assert.equal(result.code, 'session_mismatch');
  });
});

test('a transcript that declares another session is a session_mismatch', async () => {
  await withTempAsync('devin-transcript-mismatch', async (root) => {
    const projectDir = join(root, 'project');
    mkdirSync(projectDir, { recursive: true });
    const fixture = devinSession({ root, projectDir, transcriptId: DECOY, withSessionsRow: false });
    const result = await readSession({ runtime: 'devin', sessionId: SESSION, ...fixture.options });
    assert.equal(result.ok, false);
    assert.equal(result.code, 'session_mismatch');
  });
});

test('an unknown id is a session_not_found when the database has other sessions', async () => {
  await withTempAsync('devin-unknown', async (root) => {
    const projectDir = join(root, 'project');
    mkdirSync(projectDir, { recursive: true });
    devinSession({ root, projectDir, sessionId: DECOY });
    const result = await readSession({
      runtime: 'devin',
      sessionId: SESSION,
      devinDataHome: join(root, 'devin', 'cli'),
      projectDir,
    });
    assert.equal(result.ok, false);
    assert.equal(result.code, 'session_not_found');
  });
});

test('an absent transcript is a session_not_found when the store is present', async () => {
  await withTempAsync('devin-absent', async (root) => {
    const projectDir = join(root, 'project');
    mkdirSync(projectDir, { recursive: true });
    devinSession({ root, projectDir, sessionId: DECOY });
    const result = await readSession({
      runtime: 'devin',
      sessionId: SESSION,
      devinDataHome: join(root, 'devin', 'cli'),
      projectDir,
    });
    assert.equal(result.ok, false);
    assert.equal(result.code, 'session_not_found');
  });
});

test('a missing data directory is a store_unreadable', async () => {
  await withTempAsync('devin-unreadable', async (root) => {
    const projectDir = join(root, 'project');
    mkdirSync(projectDir, { recursive: true });
    const result = await readSession({
      runtime: 'devin',
      sessionId: SESSION,
      devinDataHome: join(root, 'missing-devin'),
      projectDir,
    });
    assert.equal(result.ok, false);
    assert.equal(result.code, 'store_unreadable');
  });
});

test('a sessions database linked outside the store is refused before it is opened', async () => {
  await withTempAsync('devin-db-outside', async (root) => {
    const projectDir = join(root, 'project');
    mkdirSync(projectDir, { recursive: true });
    const fixture = devinSession({ root, projectDir });
    // Not a SQLite file: opening it would surface store_unreadable, so the
    // containment refusal proves the reader never opened it.
    const outside = join(root, 'outside-sessions.db');
    writeFileSync(outside, 'not a database');
    rmSync(fixture.dbPath);
    symlinkSync(outside, fixture.dbPath);

    const result = await readSession({ runtime: 'devin', sessionId: SESSION, ...fixture.options });
    assert.equal(result.ok, false);
    assert.equal(result.code, 'session_mismatch');
  });
});
