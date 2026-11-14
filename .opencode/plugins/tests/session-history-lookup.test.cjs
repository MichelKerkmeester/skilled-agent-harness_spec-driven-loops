// ───────────────────────────────────────────────────────────────────
// MODULE: Session History Lookup OpenCode Plugin Tests
// ───────────────────────────────────────────────────────────────────
// Drives the plugin the way OpenCode does: a `session.compacted` event, then
// a system transform. The printed command is then run verbatim from the
// session folder against a fixture OpenCode database, so the test proves the
// offer redeems, not only that it is printed.
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');
const { test } = require('node:test');
const { pathToFileURL } = require('node:url');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PLUGIN_PATH = path.join(__dirname, '..', 'session-history-lookup.js');
const SKILLED_ROOT = path.resolve(__dirname, '..', '..', '..', '.skilled');
const MARKER = 'LOOKUP-MARKER-before-compaction';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function tempDir(t, prefix) {
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), prefix)));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

// A checkout root that can run the CLI: a `.git` entry and the real `.skilled`.
function checkout(t) {
  const root = tempDir(t, 'history-lookup-oc-');
  execFileSync('git', ['init', '-q', root]);
  fs.symlinkSync(SKILLED_ROOT, path.join(root, '.skilled'));
  const sub = path.join(root, 'sub');
  fs.mkdirSync(sub);
  return { root, sub };
}

function writeStore(dataHome, sessionId, directory) {
  const storeRoot = path.join(dataHome, 'opencode');
  fs.mkdirSync(storeRoot, { recursive: true });
  const database = new DatabaseSync(path.join(storeRoot, 'opencode.db'));
  try {
    database.exec('CREATE TABLE session_v2 (id TEXT, directory TEXT, time_updated INTEGER)');
    database.exec('CREATE TABLE part (id TEXT, message_id TEXT, session_id TEXT, time_created INTEGER, data TEXT)');
    database.exec('CREATE TABLE session_message (id TEXT, session_id TEXT, type TEXT, seq INTEGER, data TEXT)');
    database.prepare('INSERT INTO session_v2 (id, directory, time_updated) VALUES (?, ?, ?)')
      .run(sessionId, directory, Date.now());
    database.prepare('INSERT INTO session_message (id, session_id, type, seq, data) VALUES (?, ?, ?, ?, ?)')
      .run('m1', sessionId, 'user', 1, JSON.stringify({ text: MARKER, time: { created: Date.now() - 5000 } }));
    database.prepare('INSERT INTO session_message (id, session_id, type, seq, data) VALUES (?, ?, ?, ?, ?)')
      .run('m2', sessionId, 'assistant', 2, JSON.stringify({
        time: { created: Date.now() - 4000 },
        content: [{ type: 'text', text: 'Noted.' }],
      }));
  } finally {
    database.close();
  }
}

async function hooksFor(directory) {
  const pluginModule = await import(pathToFileURL(PLUGIN_PATH).href);
  return pluginModule.default.server({ directory });
}

async function compactAndTransform(hooks, sessionId) {
  await hooks.event({ event: { type: 'session.compacted', properties: { sessionID: sessionId } } });
  const output = { system: [] };
  await hooks['experimental.chat.system.transform']({ sessionID: sessionId }, output);
  return output.system;
}

function commandOf(section) {
  const line = section.split('\n').find((entry) => entry.startsWith('Latest turns (read-only): '));
  assert.ok(line, 'the section prints the latest-turns command');
  return line.slice('Latest turns (read-only): '.length);
}

function stateFiles(sessionId) {
  const stateRoot = path.join(os.tmpdir(), 'speckit-claude-hooks');
  if (!fs.existsSync(stateRoot)) return [];
  const found = [];
  for (const project of fs.readdirSync(stateRoot)) {
    const projectDir = path.join(stateRoot, project);
    if (!fs.statSync(projectDir).isDirectory()) continue;
    for (const file of fs.readdirSync(projectDir)) {
      const full = path.join(projectDir, file);
      try {
        if (fs.readFileSync(full, 'utf8').includes(sessionId)) found.push(full);
      } catch {
        // A file another run is replacing is not this test's.
      }
    }
  }
  return found;
}

function cleanState(t, sessionId) {
  t.after(() => {
    for (const file of stateFiles(sessionId)) fs.rmSync(file, { force: true });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('a compacted session started in a subfolder gets an offer that redeems', async (t) => {
  const { sub } = checkout(t);
  const dataHome = tempDir(t, 'history-lookup-oc-data-');
  const sessionId = `ses_hl_${process.pid}_a`;
  cleanState(t, sessionId);
  writeStore(dataHome, sessionId, sub);

  const hooks = await hooksFor(sub);
  const system = await compactAndTransform(hooks, sessionId);
  assert.equal(system.length, 1);
  assert.match(system[0], /^## History Lookup\n/);
  assert.match(system[0], /SPECKIT_RUNTIME=opencode /);

  // The reader takes its database name from OPENCODE_DB, so a name inherited from the
  // shell would point it away from the store this case wrote.
  const { OPENCODE_DB: _ambientDatabase, ...ambientEnv } = process.env;
  const reply = execFileSync('bash', ['-c', commandOf(system[0])], {
    cwd: sub,
    env: { ...ambientEnv, XDG_DATA_HOME: dataHome, SPECKIT_RUNTIME: '' },
    encoding: 'utf8',
  });
  assert.match(reply, /references/);
  assert.ok(reply.includes(MARKER), 'the reply holds the turn from before compaction');
});

test('a second request keeps the offer and another session gets none', async (t) => {
  const { root } = checkout(t);
  const sessionId = `ses_hl_${process.pid}_b`;
  cleanState(t, sessionId);

  const hooks = await hooksFor(root);
  assert.equal((await compactAndTransform(hooks, sessionId)).length, 1);

  const again = { system: [] };
  await hooks['experimental.chat.system.transform']({ sessionID: sessionId }, again);
  assert.equal(again.system.length, 1);

  const other = { system: [] };
  await hooks['experimental.chat.system.transform']({ sessionID: 'ses_other' }, other);
  assert.deepEqual(other.system, []);
});

test('a folder outside any checkout gets no offer and saves no locator', async (t) => {
  const outside = tempDir(t, 'history-lookup-oc-outside-');
  const sessionId = `ses_hl_${process.pid}_c`;
  cleanState(t, sessionId);

  const hooks = await hooksFor(outside);
  assert.deepEqual(await compactAndTransform(hooks, sessionId), []);
  assert.deepEqual(stateFiles(sessionId), []);
});
