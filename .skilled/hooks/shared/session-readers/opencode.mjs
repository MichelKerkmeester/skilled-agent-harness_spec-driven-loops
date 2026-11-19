// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode Read-Only Database Reader
// ───────────────────────────────────────────────────────────────────
// OpenCode keeps its history in SQLite. The driver loads only when a database
// is opened, because the plugin that shares this package runs under Bun, which
// has no `node:sqlite`. The session id is proven against the session table
// before any row for it is selected, and the connection is read-only.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';
import { isAbsolute, join } from 'node:path';
import { envOf, homeDir, isSafeSessionId, resolveInside, samePath } from './identity.mjs';
import {
  contentText,
  isoOr,
  parseJsonObject,
  textBlock,
  toolCallBlock,
} from './project.mjs';

const require = createRequire(import.meta.url);

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const RUNTIME = 'opencode';
const LOCATOR_KIND = 'session-store';
const MESSAGE_TABLE = 'session_message';
const SESSION_TABLE = 'session_v2';
// A message row without its own clock keeps its sequence order, but after every
// row that does carry one, rather than sorting ahead of the conversation.
const UNTIMED_MESSAGE_BASE = 1e15;

// ─────────────────────────────────────────────────────────────────────────────
// 3. STORE
// ─────────────────────────────────────────────────────────────────────────────

export function openCodeStoreRoot(options = {}) {
  if (options.opencodeRoot) return options.opencodeRoot;
  const dataHome = envOf(options).XDG_DATA_HOME || join(homeDir(options), '.local', 'share');
  return join(dataHome, 'opencode');
}

// OpenCode reads `OPENCODE_DB` the same way: a relative name sits in the data
// folder and an absolute path is used as given. A shell the model runs inherits
// it, so the reader opens the database that session wrote.
export function openCodeDatabasePath(options = {}) {
  if (options.dbPath) return options.dbPath;
  const named = envOf(options).OPENCODE_DB;
  const root = openCodeStoreRoot(options);
  if (typeof named === 'string' && named.trim()) {
    return isAbsolute(named) ? named : join(root, named);
  }
  return join(root, 'opencode.db');
}

function openDatabase(dbPath) {
  const { DatabaseSync } = require('node:sqlite');
  return new DatabaseSync(dbPath, { readOnly: true });
}

function tableNames(database) {
  const rows = database.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all();
  return new Set(rows.map((row) => row.name));
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ENTRY MAPPING
// ─────────────────────────────────────────────────────────────────────────────

function toolPair({ id, callId, name, input, output, timestamp, sort }) {
  const resultText = typeof output === 'string' ? output : contentText(output);
  return [
    {
      sort,
      record: {
        id,
        role: 'assistant',
        timestamp,
        content: [toolCallBlock({ id: callId, name, arguments: input ?? {} })],
      },
    },
    {
      sort,
      record: {
        id: `${id}:result`.slice(0, 128),
        role: 'toolResult',
        timestamp,
        content: [textBlock(resultText)],
        toolCallId: callId,
      },
    },
  ];
}

function messageEntries(rows) {
  const entries = [];
  const seenCallIds = new Set();

  rows.forEach((row) => {
    const message = parseJsonObject(row.data);
    if (!message) return;
    const timestamp = isoOr(message.time?.created ?? row.time_created);
    const sort = message.time?.created ?? UNTIMED_MESSAGE_BASE + (row.seq ?? 0);

    if (row.type === 'user') {
      // Synthetic context is recorded as its own message type, which this branch
      // never reads, so a user row is operator content even when it opens with '<'.
      if (typeof message.text !== 'string' || !message.text) return;
      entries.push({ sort, record: { id: row.id, role: 'user', timestamp, content: [textBlock(message.text)] } });
      return;
    }

    if (row.type !== 'assistant') return;
    const content = Array.isArray(message.content) ? message.content : [];
    content.forEach((item, index) => {
      if (!item || typeof item !== 'object') return;
      if (item.type === 'text' && typeof item.text === 'string') {
        entries.push({
          sort,
          record: { id: `${row.id}:${index}`.slice(0, 128), role: 'assistant', timestamp, content: [textBlock(item.text)] },
        });
        return;
      }
      if (item.type === 'tool' && typeof item.id === 'string' && typeof item.name === 'string') {
        if (seenCallIds.has(item.id)) return;
        seenCallIds.add(item.id);
        entries.push(...toolPair({
          id: `${row.id}:${index}`.slice(0, 128),
          callId: item.id,
          name: item.name,
          input: item.state?.input,
          output: item.state?.output ?? item.state?.content,
          timestamp,
          sort,
        }));
      }
    });
  });

  return entries;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. LOADER
// ─────────────────────────────────────────────────────────────────────────────

function columnNames(database, table) {
  return new Set(database.prepare(`PRAGMA table_info(${table})`).all().map((row) => row.name));
}

export function loadOpenCodeSession({ sessionId, ...options } = {}) {
  if (!isSafeSessionId(sessionId)) {
    return { ok: false, code: sessionId ? 'session_mismatch' : 'locator_unavailable' };
  }

  const dbPath = openCodeDatabasePath(options);
  const containment = resolveInside({ path: dbPath, root: openCodeStoreRoot(options) });
  if (!containment.ok) return containment;

  let database;
  try {
    database = openDatabase(containment.path);
  } catch {
    return { ok: false, code: 'store_unreadable' };
  }

  try {
    const tables = tableNames(database);
    if (!tables.has(SESSION_TABLE)) return { ok: false, code: 'store_unreadable' };

    // A caller that names the folder the session ran in gets the session only
    // when its recorded directory is that folder, as the Pi and DSH readers
    // prove the session header's cwd.
    const hasDirectory = columnNames(database, SESSION_TABLE).has('directory');
    const columns = hasDirectory ? 'id, directory' : 'id';
    const row = database.prepare(`SELECT ${columns} FROM ${SESSION_TABLE} WHERE id = ?`).get(sessionId);
    if (typeof row?.id !== 'string' || row.id !== sessionId) return { ok: false, code: 'session_not_found' };
    if (options.projectDir !== undefined && hasDirectory && !samePath(row.directory, options.projectDir)) {
      return { ok: false, code: 'session_mismatch' };
    }

    const messageRows = tables.has(MESSAGE_TABLE)
      ? database
        .prepare(`SELECT id, type, seq, data FROM ${MESSAGE_TABLE} WHERE session_id = ? ORDER BY seq`)
        .all(sessionId)
      : [];

    const entries = messageEntries(messageRows);
    entries.sort((left, right) => left.sort - right.sort);

    return {
      ok: true,
      source: {
        runtime: RUNTIME,
        sessionId,
        locatorKind: LOCATOR_KIND,
        storePath: containment.path,
      },
      records: entries.map((entry) => entry.record),
    };
  } catch {
    return { ok: false, code: 'store_unreadable' };
  } finally {
    database.close();
  }
}
