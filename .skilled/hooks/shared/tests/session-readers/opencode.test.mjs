// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode Reader Tests
// ───────────────────────────────────────────────────────────────────
// The session row proves the id before any part or message is selected. The
// driver loads only when a database is opened, because the shared plugin runs
// under Bun, which has no `node:sqlite`.

import assert from 'node:assert/strict';
import { mkdirSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import { registerHooks } from 'node:module';
import { DatabaseSync } from 'node:sqlite';
import { test } from 'node:test';

import { readSession } from '../../session-readers/index.mjs';
import { DECOY, opencodeSession, SESSION } from './fixtures.mjs';
import { withTempAsync } from './helpers.mjs';

test('a session resolves from its part and session_message rows', async () => {
  await withTempAsync('opencode-reader', async (root) => {
    const fixture = opencodeSession({ root });
    const result = await readSession({ runtime: 'opencode', sessionId: SESSION, ...fixture.options });
    assert.equal(result.ok, true);
    assert.equal(result.source.locatorKind, 'session-store');
    assert.equal(result.items[0].role, 'user');
    assert.equal(result.items.some((item) => item.toolCallId === 'oc-call-1'), true);
  });
});

test('a text part takes its role from the parent message row', async () => {
  await withTempAsync('opencode-part-role', async (root) => {
    const fixture = opencodeSession({ root, withUserTextPart: true });
    const result = await readSession({ runtime: 'opencode', sessionId: SESSION, ...fixture.options });
    assert.equal(result.ok, true);
    const part = result.items.find((item) => item.id === 'oc-p0');
    assert.equal(part?.role, 'user');
    assert.equal(part?.content[0].text, 'Read the file.');
  });
});

test('a named folder must be the folder the session ran in', async () => {
  await withTempAsync('opencode-folder', async (root) => {
    const fixture = opencodeSession({ root, projectDir: '/fixture/project' });
    const same = await readSession({
      runtime: 'opencode', sessionId: SESSION, projectDir: '/fixture/project', ...fixture.options,
    });
    assert.equal(same.ok, true);
    const other = await readSession({
      runtime: 'opencode', sessionId: SESSION, projectDir: '/fixture/elsewhere', ...fixture.options,
    });
    assert.equal(other.ok, false);
    assert.equal(other.code, 'session_mismatch');
  });
});

test('the database named by OPENCODE_DB is the one read', async () => {
  await withTempAsync('opencode-named-db', async (root) => {
    const fixture = opencodeSession({ root });
    renameSync(fixture.dbPath, join(fixture.root, 'opencode-v1.db'));
    const named = await readSession({
      runtime: 'opencode', sessionId: SESSION, opencodeRoot: fixture.root, env: { OPENCODE_DB: 'opencode-v1.db' },
    });
    assert.equal(named.ok, true);
    const unnamed = await readSession({ runtime: 'opencode', sessionId: SESSION, opencodeRoot: fixture.root, env: {} });
    assert.equal(unnamed.ok, false);
  });
});

test('an OpenCode 1 store takes part ids from the column and roles from the message table', async () => {
  await withTempAsync('opencode-v1-shape', async (root) => {
    const opencodeRoot = join(root, 'opencode');
    mkdirSync(opencodeRoot, { recursive: true });
    const dbPath = join(opencodeRoot, 'opencode.db');
    const database = new DatabaseSync(dbPath);
    try {
      database.exec('CREATE TABLE session (id TEXT, directory TEXT)');
      database.exec('CREATE TABLE message (id TEXT, session_id TEXT, time_created INTEGER, data TEXT)');
      database.exec('CREATE TABLE part (id TEXT, message_id TEXT, session_id TEXT, time_created INTEGER, data TEXT)');
      database.prepare('INSERT INTO session VALUES (?, ?)').run(SESSION, '/fixture/project');
      database.prepare('INSERT INTO message VALUES (?, ?, ?, ?)').run('m-user', SESSION, 1000, JSON.stringify({ role: 'user' }));
      database.prepare('INSERT INTO message VALUES (?, ?, ?, ?)').run('m-model', SESSION, 2000, JSON.stringify({ role: 'assistant' }));
      database.prepare('INSERT INTO part VALUES (?, ?, ?, ?, ?)').run('p-user', 'm-user', SESSION, 1000, JSON.stringify({ type: 'text', text: 'Read the file.' }));
      database.prepare('INSERT INTO part VALUES (?, ?, ?, ?, ?)').run('p-model', 'm-model', SESSION, 2000, JSON.stringify({ type: 'text', text: 'Done.' }));
    } finally {
      database.close();
    }

    const result = await readSession({ runtime: 'opencode', sessionId: SESSION, opencodeRoot, dbPath });
    assert.equal(result.ok, true);
    assert.deepEqual(result.items.map((item) => [item.role, item.id]), [['user', 'p-user'], ['assistant', 'p-model']]);
  });
});

test('an absent session id is a session_not_found although a decoy row exists', async () => {
  await withTempAsync('opencode-absent', async (root) => {
    const fixture = opencodeSession({ root, sessionId: DECOY });
    const result = await readSession({ runtime: 'opencode', sessionId: SESSION, ...fixture.options });
    assert.equal(result.ok, false);
    assert.equal(result.code, 'session_not_found');
  });
});

test('the package imports and reads another runtime while node:sqlite is unavailable', async () => {
  const hook = registerHooks({
    resolve(specifier, context, next) {
      if (specifier === 'node:sqlite') throw new Error('node:sqlite unavailable');
      return next(specifier, context);
    },
  });

  try {
    await withTempAsync('opencode-lazy', async (root) => {
      const fixture = opencodeSession({ root });
      const openCode = await readSession({ runtime: 'opencode', sessionId: SESSION, ...fixture.options });
      assert.equal(openCode.ok, false);
      assert.equal(openCode.code, 'store_unreadable');

      const { claudeSession } = await import('./fixtures.mjs');
      const claude = claudeSession({ root });
      const stored = await readSession({ runtime: 'claude', sessionId: SESSION, ...claude.options });
      assert.equal(stored.ok, true);
    });
  } finally {
    hook.deregister();
  }
});

test('a database outside the OpenCode root is a session_mismatch', async () => {
  await withTempAsync('opencode-outside', async (root) => {
    const fixture = opencodeSession({ root });
    const otherRoot = `${fixture.root}-other`;
    mkdirSync(otherRoot, { recursive: true });
    const result = await readSession({
      runtime: 'opencode',
      sessionId: SESSION,
      opencodeRoot: otherRoot,
      dbPath: fixture.dbPath,
    });
    assert.equal(result.ok, false);
    assert.equal(result.code, 'session_mismatch');
  });
});

test('a missing database is a store_unreadable', async () => {
  await withTempAsync('opencode-missing', async (root) => {
    // The builder creates the directory; the database path is removed by
    // pointing at a name that was never written.
    const fixture = opencodeSession({ root });
    const result = await readSession({
      runtime: 'opencode',
      sessionId: SESSION,
      opencodeRoot: fixture.root,
      dbPath: `${fixture.dbPath}.absent`,
    });
    assert.equal(result.ok, false);
    assert.equal(result.code, 'store_unreadable');
  });
});
