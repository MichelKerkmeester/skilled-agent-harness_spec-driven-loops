// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode Reader Tests
// ───────────────────────────────────────────────────────────────────
// The session row proves the id before any message is selected. The driver
// loads only when a database is opened, because the shared plugin runs under
// Bun, which has no `node:sqlite`.

import assert from 'node:assert/strict';
import { mkdirSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import { registerHooks } from 'node:module';
import { DatabaseSync } from 'node:sqlite';
import { test } from 'node:test';

import { readSession } from '../../session-readers/index.mjs';
import { DECOY, opencodeSession, SESSION } from './fixtures.mjs';
import { withTempAsync } from './helpers.mjs';

// Builds a store with only the tables OpenCode writes today: the session row and
// its ordered message rows.
function writeStore(root, messages) {
  const opencodeRoot = join(root, 'opencode');
  mkdirSync(opencodeRoot, { recursive: true });
  const dbPath = join(opencodeRoot, 'opencode.db');
  const database = new DatabaseSync(dbPath);
  try {
    database.exec('CREATE TABLE session_v2 (id TEXT, directory TEXT)');
    database.exec('CREATE TABLE session_message (id TEXT, session_id TEXT, type TEXT, seq INTEGER, data TEXT)');
    database.prepare('INSERT INTO session_v2 VALUES (?, ?)').run(SESSION, '/fixture/project');
    const insert = database.prepare('INSERT INTO session_message VALUES (?, ?, ?, ?, ?)');
    messages.forEach(([id, type, data], index) => insert.run(id, SESSION, type, index + 1, JSON.stringify(data)));
  } finally {
    database.close();
  }
  return { opencodeRoot, dbPath };
}

test('a session resolves from its session_message rows', async () => {
  await withTempAsync('opencode-reader', async (root) => {
    const fixture = opencodeSession({ root });
    const result = await readSession({ runtime: 'opencode', sessionId: SESSION, ...fixture.options });
    assert.equal(result.ok, true);
    assert.equal(result.source.locatorKind, 'session-store');
    assert.deepEqual(result.items.map((item) => [item.role, item.content[0].text]), [
      ['user', 'Read the file.'],
      ['assistant', 'The file holds one line.'],
    ]);
  });
});

test('a tool item in an assistant message yields one call and its result', async () => {
  await withTempAsync('opencode-tool', async (root) => {
    const tool = {
      type: 'tool',
      id: 'oc-call-1',
      name: 'read',
      state: { status: 'completed', input: { path: 'file.txt' }, output: 'file contents' },
    };
    const store = writeStore(root, [
      ['oc-u1', 'user', { text: 'Read the file.', time: { created: 1000 } }],
      ['oc-a1', 'assistant', { time: { created: 2000 }, content: [tool] }],
      // A later row that repeats the call must not report it twice.
      ['oc-a2', 'assistant', { time: { created: 3000 }, content: [tool] }],
    ]);
    const result = await readSession({ runtime: 'opencode', sessionId: SESSION, ...store });
    assert.equal(result.ok, true);
    assert.equal(result.items.filter((item) => item.toolCallId === 'oc-call-1').length, 1);
    const toolResult = result.items.find((item) => item.toolCallId === 'oc-call-1');
    assert.equal(toolResult.content[0].text, 'file contents');
  });
});

// Rows in the frozen `part` table predate the current store and were migrated into
// `session_message`, so reading both would repeat the same turn.
test('rows in the frozen part table are not read', async () => {
  await withTempAsync('opencode-part-ignored', async (root) => {
    const fixture = opencodeSession({ root });
    const database = new DatabaseSync(fixture.dbPath);
    try {
      database.exec('CREATE TABLE part (id TEXT, message_id TEXT, session_id TEXT, time_created INTEGER, data TEXT)');
      const insert = database.prepare('INSERT INTO part VALUES (?, ?, ?, ?, ?)');
      insert.run('oc-p0', 'oc-u1', SESSION, 500, JSON.stringify({ id: 'oc-p0', type: 'text', text: 'Read the file.' }));
      insert.run('oc-p1', 'oc-a1', SESSION, 3000, JSON.stringify({
        id: 'oc-p1',
        type: 'tool',
        callID: 'oc-call-1',
        tool: 'read',
        state: { status: 'completed', input: { path: 'file.txt' }, output: 'file contents' },
      }));
    } finally {
      database.close();
    }
    const result = await readSession({ runtime: 'opencode', sessionId: SESSION, ...fixture.options });
    assert.equal(result.ok, true);
    assert.equal(result.items.some((item) => item.id === 'oc-p0' || item.id === 'oc-p1'), false);
    assert.equal(result.items.some((item) => item.toolCallId === 'oc-call-1'), false);
    assert.equal(result.items.filter((item) => item.role === 'user').length, 1);
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
    renameSync(fixture.dbPath, join(fixture.root, 'opencode-named.db'));
    const named = await readSession({
      runtime: 'opencode', sessionId: SESSION, opencodeRoot: fixture.root, env: { OPENCODE_DB: 'opencode-named.db' },
    });
    assert.equal(named.ok, true);
    const unnamed = await readSession({ runtime: 'opencode', sessionId: SESSION, opencodeRoot: fixture.root, env: {} });
    assert.equal(unnamed.ok, false);
  });
});

test('a store holding only the frozen session, message and part tables is store_unreadable', async () => {
  await withTempAsync('opencode-legacy-only', async (root) => {
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
    assert.equal(result.ok, false);
    assert.equal(result.code, 'store_unreadable');
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
