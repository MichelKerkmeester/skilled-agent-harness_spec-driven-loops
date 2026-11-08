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
  thinkingBlock,
  toolCallBlock,
} from './project.mjs';

const require = createRequire(import.meta.url);

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const RUNTIME = 'opencode';
const LOCATOR_KIND = 'session-store';
const PART_TABLE = 'part';
const MESSAGE_TABLE = 'session_message';
// OpenCode 1 keeps each turn's role in this table instead of `session_message`.
const LEGACY_MESSAGE_TABLE = 'message';
const SESSION_TABLES = ['session_v2', 'session'];
// A message row without its own clock keeps its sequence order, but after every
// part row that does carry one, rather than sorting ahead of the conversation.
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
// folder and an absolute path is used as given. The OpenCode 1 launcher sets it
// so the two majors keep separate databases, and a shell the model runs inherits
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

// A text part is only as trustworthy as the message row it belongs to: the
// same table holds user and assistant parts, so the row type decides the role.
function roleOfMessage(rolesByMessageId, messageId) {
  return rolesByMessageId.get(messageId) === 'user' ? 'user' : 'assistant';
}

function partEntries(rows, rolesByMessageId) {
  const entries = [];
  for (const row of rows) {
    const parsed = parseJsonObject(row.data);
    // OpenCode 1 stores a part's id as a column, not inside its JSON.
    const part = parsed && typeof parsed.id !== 'string' && typeof row.id === 'string'
      ? { ...parsed, id: row.id }
      : parsed;
    if (!part || typeof part.id !== 'string') continue;
    const timestamp = isoOr(row.time_created ?? part.time_created);

    if (part.type === 'text' && typeof part.text === 'string') {
      const role = roleOfMessage(rolesByMessageId, row.message_id);
      entries.push({ sort: row.time_created ?? 0, record: { id: part.id, role, timestamp, content: [textBlock(part.text)] } });
      continue;
    }
    if (part.type === 'reasoning' && typeof part.text === 'string') {
      entries.push({ sort: row.time_created ?? 0, record: { id: part.id, role: 'assistant', timestamp, content: [thinkingBlock(part.text)] } });
      continue;
    }
    if (part.type === 'tool' && typeof part.callID === 'string' && typeof part.tool === 'string') {
      entries.push(...toolPair({
        id: part.id,
        callId: part.callID,
        name: part.tool,
        input: part.state?.input,
        output: part.state?.output ?? part.state?.content,
        timestamp,
        sort: row.time_created ?? 0,
      }));
    }
  }
  return entries;
}

function messageRoles(rows, legacyRows = []) {
  const roles = new Map();
  for (const row of legacyRows) {
    if (typeof row.id !== 'string' || !row.id) continue;
    const role = parseJsonObject(row.data)?.role;
    if (role === 'user' || role === 'assistant') roles.set(row.id, role);
  }
  for (const row of rows) {
    if (typeof row.id !== 'string' || !row.id) continue;
    if (row.type === 'user' || row.type === 'assistant') roles.set(row.id, row.type);
  }
  return roles;
}

function messageEntries(rows, seenCallIds) {
  const entries = [];

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

    const sessionTables = SESSION_TABLES.filter((table) => tables.has(table));
    if (sessionTables.length === 0) return { ok: false, code: 'store_unreadable' };

    // A caller that names the folder the session ran in gets the session only
    // when its recorded directory is that folder, as the Pi and DSH readers
    // prove the session header's cwd.
    let found = false;
    for (const table of sessionTables) {
      const hasDirectory = columnNames(database, table).has('directory');
      const columns = hasDirectory ? 'id, directory' : 'id';
      const row = database.prepare(`SELECT ${columns} FROM ${table} WHERE id = ?`).get(sessionId);
      if (typeof row?.id === 'string' && row.id === sessionId) {
        if (options.projectDir !== undefined && hasDirectory && !samePath(row.directory, options.projectDir)) {
          return { ok: false, code: 'session_mismatch' };
        }
        found = true;
        break;
      }
    }
    if (!found) return { ok: false, code: 'session_not_found' };

    const partRows = tables.has(PART_TABLE)
      ? database
        .prepare(`SELECT id, message_id, time_created, data FROM ${PART_TABLE} WHERE session_id = ? ORDER BY time_created, id`)
        .all(sessionId)
      : [];
    const messageRows = tables.has(MESSAGE_TABLE)
      ? database
        .prepare(`SELECT id, type, seq, data FROM ${MESSAGE_TABLE} WHERE session_id = ? ORDER BY seq`)
        .all(sessionId)
      : [];

    const seenCallIds = new Set();
    const legacyRows = tables.has(LEGACY_MESSAGE_TABLE)
      ? database.prepare(`SELECT id, data FROM ${LEGACY_MESSAGE_TABLE} WHERE session_id = ?`).all(sessionId)
      : [];
    const entries = [...partEntries(partRows, messageRoles(messageRows, legacyRows))];
    for (const entry of entries) {
      if (entry.record.role === 'assistant') {
        for (const block of entry.record.content) {
          if (block.type === 'toolCall') seenCallIds.add(block.id);
        }
      }
    }
    entries.push(...messageEntries(messageRows, seenCallIds));
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
