// ───────────────────────────────────────────────────────────────────
// MODULE: Devin CLI Session Reader
// ───────────────────────────────────────────────────────────────────
// Devin writes its history to a SQLite sessions database, with one row per
// session and one message row per node of that session's conversation tree.
// Older builds named a JSON transcript after the session instead, so the file
// remains a fallback for a store that has no database record. A read is accepted
// only when the session's own row agrees with the request and its recorded
// working directory is the caller's project; either disagreement means the
// record describes another session.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  envOf,
  homeDir,
  isSafeSessionId,
  resolveInside,
  atOrBelow,
  samePath,
} from './identity.mjs';
import {
  isoOr,
  parseJsonObject,
  textBlock,
  toolCallBlock,
} from './project.mjs';

const require = createRequire(import.meta.url);

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const RUNTIME = 'devin';
const DATABASE_LOCATOR_KIND = 'session_id';
const TRANSCRIPT_LOCATOR_KIND = 'transcript_file';
const DATABASE_FILE = 'sessions.db';
const TRANSCRIPT_EXT = '.json';

// ─────────────────────────────────────────────────────────────────────────────
// 3. STORE
// ─────────────────────────────────────────────────────────────────────────────

export function devinDataDirectory(options = {}) {
  if (options.devinDataHome) return options.devinDataHome;
  const dataHome = envOf(options).XDG_DATA_HOME || join(homeDir(options), '.local', 'share');
  return join(dataHome, 'devin', 'cli');
}

export function devinTranscriptRoot(options = {}) {
  return join(devinDataDirectory(options), 'transcripts');
}

export function devinDatabasePath(options = {}) {
  return options.dbPath ?? join(devinDataDirectory(options), DATABASE_FILE);
}

function openDatabase(dbPath) {
  const { DatabaseSync } = require('node:sqlite');
  return new DatabaseSync(dbPath, { readOnly: true });
}

function tableColumns(database, table) {
  return new Set(database.prepare(`PRAGMA table_info('${table}')`).all().map((row) => row.name));
}

function sessionRow(database, sessionId) {
  const columns = tableColumns(database, 'sessions');
  if (!columns.has('id')) return null;

  // A store that predates a column still names the session, so each optional
  // column is selected only when the table has it.
  const selected = ['id'];
  for (const name of ['working_directory', 'main_chain_id']) {
    if (columns.has(name)) selected.push(name);
  }

  const row = database.prepare(`SELECT ${selected.join(', ')} FROM sessions WHERE id = ?`).get(sessionId);
  return row && row.id === sessionId ? row : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. DATABASE PROJECTION
// ─────────────────────────────────────────────────────────────────────────────

function nodeTimestamp(node, message) {
  const recorded = message.metadata?.created_at;
  if (recorded !== undefined && recorded !== null) return isoOr(recorded);
  // The node clock is stored in whole seconds, while the shared normalizer
  // expects milliseconds.
  return isoOr(typeof node.created_at === 'number' ? node.created_at * 1000 : undefined);
}

function nodeIdentifier(node, message) {
  const stored = typeof message.message_id === 'string' && message.message_id
    ? message.message_id
    : String(node.node_id);
  return `devin-${stored}`.slice(0, 128);
}

// The message store is a forest: every request re-records the prompt it was
// built from, so a plain row scan would repeat messages. The session's main
// chain names the live path, and walking it back to its root yields each node
// once in conversation order.
function chainFromHead(nodes, headId) {
  if (headId == null) return null;

  const byNodeId = new Map(nodes.map((node) => [node.node_id, node]));
  const chain = [];
  const seen = new Set();
  let cursor = byNodeId.get(headId);

  while (cursor) {
    if (seen.has(cursor.node_id)) return null;
    seen.add(cursor.node_id);
    chain.push(cursor);

    if (cursor.parent_node_id == null) break;
    const parent = byNodeId.get(cursor.parent_node_id);
    if (!parent) return null;
    cursor = parent;
  }

  return chain.reverse();
}

function recordsFromChain(chain) {
  const records = [];

  for (const node of chain) {
    const message = parseJsonObject(node.chat_message);
    if (!message) continue;

    const timestamp = nodeTimestamp(node, message);
    const id = nodeIdentifier(node, message);
    const text = typeof message.content === 'string' ? message.content : '';

    if (message.role === 'user') {
      // Synthetic prompt context is also stored as a user row; only content the
      // operator typed carries the input flag, so an unflagged row is skipped.
      const isInput = message.metadata?.is_user_input;
      if (isInput !== true && isInput !== 1) continue;
      if (!text) continue;
      records.push({ id, role: 'user', timestamp, content: [textBlock(text)] });
      continue;
    }

    if (message.role === 'assistant') {
      const blocks = [];
      if (text) blocks.push(textBlock(text));
      for (const call of Array.isArray(message.tool_calls) ? message.tool_calls : []) {
        if (typeof call?.id !== 'string' || typeof call.name !== 'string') continue;
        blocks.push(toolCallBlock({
          id: call.id,
          name: call.name,
          arguments: call.arguments,
        }));
      }
      if (blocks.length > 0) {
        records.push({ id, role: 'assistant', timestamp, content: blocks });
      }
      continue;
    }

    if (message.role === 'tool' && typeof message.tool_call_id === 'string') {
      records.push({
        id,
        role: 'toolResult',
        timestamp,
        content: [textBlock(text)],
        toolCallId: message.tool_call_id,
      });
    }
  }

  return records;
}

// A system node carries the harness context a compaction or a session start
// injected. A user node without the input flag is prompt context the harness
// wrote, not text the operator typed, so it is injected context too and never
// a conversation record.
function injectedFromChain(chain) {
  const injected = [];

  for (const node of chain) {
    const message = parseJsonObject(node.chat_message);
    if (!message) continue;

    const text = typeof message.content === 'string' ? message.content : '';
    if (!text) continue;

    if (message.role === 'system') {
      injected.push({ source: message.role, text });
      continue;
    }

    if (message.role === 'user') {
      const isInput = message.metadata?.is_user_input;
      if (isInput === true || isInput === 1) continue;
      injected.push({ source: 'unflagged-user', text });
    }
  }

  return injected;
}

function summarizedFrom(node) {
  const value = parseJsonObject(node.metadata)?.summarized_from;
  return Number.isInteger(value) ? value : null;
}

// A compaction starts a new thread whose root has no parent, so the live chain
// alone holds only the turns after it. The thread's continuation node names
// the last node of the thread it summarized, and following that link back,
// once per compaction, restores the turns the compaction dropped.
function chainWithEarlierThreads(nodes, headId) {
  const threads = [];
  const visited = new Set();
  let head = headId;
  while (head != null) {
    if (visited.has(head)) return null;
    visited.add(head);
    const thread = chainFromHead(nodes, head);
    if (!thread) return null;
    threads.unshift(thread);
    const link = thread.find((node) => summarizedFrom(node) !== null);
    head = link ? summarizedFrom(link) : null;
  }
  return threads.flat();
}

function recordsFromDatabase(database, sessionId, headId) {
  const nodes = database
    .prepare('SELECT node_id, parent_node_id, chat_message, metadata, created_at FROM message_nodes WHERE session_id = ? ORDER BY node_id')
    .all(sessionId);

  if (nodes.length === 0) return { records: [], injected: [] };

  const chain = chainWithEarlierThreads(nodes, headId);
  return chain ? { records: recordsFromChain(chain), injected: injectedFromChain(chain) } : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. TRANSCRIPT MAPPING
// ─────────────────────────────────────────────────────────────────────────────

function recordsFromSteps(steps) {
  const records = [];

  steps.forEach((step, stepIndex) => {
    if (!step || typeof step !== 'object') return;
    const stepId = step.step_id ?? stepIndex;
    const timestamp = step.timestamp;
    const message = typeof step.message === 'string' ? step.message : '';

    if (step.source === 'user') {
      // Harness and system content arrives under a different `source` value, so
      // a user step is operator content even when it opens with '<'.
      if (!message) return;
      records.push({
        id: `devin-${stepId}`.slice(0, 128),
        role: 'user',
        timestamp,
        content: [textBlock(message)],
      });
      return;
    }

    if (step.source !== 'agent') return;

    const toolCalls = Array.isArray(step.tool_calls) ? step.tool_calls : [];
    const blocks = [];
    if (message) blocks.push(textBlock(message));
    for (const call of toolCalls) {
      if (typeof call?.tool_call_id !== 'string' || typeof call.function_name !== 'string') continue;
      blocks.push(toolCallBlock({
        id: call.tool_call_id,
        name: call.function_name,
        arguments: call.arguments,
      }));
    }
    if (blocks.length > 0) {
      records.push({
        id: `devin-${stepId}`.slice(0, 128),
        role: 'assistant',
        timestamp,
        content: blocks,
      });
    }

    const results = Array.isArray(step.observation?.results) ? step.observation.results : [];
    results.forEach((result, resultIndex) => {
      if (typeof result?.source_call_id !== 'string') return;
      const content = typeof result.content === 'string' ? result.content : '';
      records.push({
        id: `devin-${stepId}-result-${resultIndex}`.slice(0, 128),
        role: 'toolResult',
        timestamp,
        content: [textBlock(content)],
        toolCallId: result.source_call_id,
      });
    });
  });

  return records;
}

// Harness and system steps are not conversation records, but they are context
// the next turn saw, kept apart so a caller can tell what the operator typed.
function injectedFromSteps(steps) {
  const injected = [];

  for (const step of steps) {
    if (!step || typeof step !== 'object') continue;
    if (step.source === 'user' || step.source === 'agent') continue;
    if (typeof step.message !== 'string' || !step.message) continue;
    injected.push({ source: step.source, text: step.message });
  }

  return injected;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. LOADER
// ─────────────────────────────────────────────────────────────────────────────

function loadTranscript(sessionId, dataDirectory, options) {
  const root = devinTranscriptRoot(options);
  const transcriptPath = options.transcriptPath ?? join(root, `${sessionId}${TRANSCRIPT_EXT}`);

  // Containment is decided before the file is opened, so a path outside the
  // store is refused without its content ever being read.
  const containment = resolveInside({ path: transcriptPath, root });
  if (!containment.ok) {
    if (containment.code === 'session_mismatch') return containment;
    try {
      statSync(dataDirectory);
      return { ok: false, code: 'session_not_found' };
    } catch {
      return { ok: false, code: 'store_unreadable' };
    }
  }
  const storePath = containment.path;

  let raw;
  try {
    raw = readFileSync(transcriptPath, 'utf8');
  } catch {
    try {
      statSync(dataDirectory);
      return { ok: false, code: 'session_not_found' };
    } catch {
      return { ok: false, code: 'store_unreadable' };
    }
  }

  const transcript = parseJsonObject(raw);
  if (!transcript) return { ok: false, code: 'store_unreadable' };
  if (typeof transcript.session_id === 'string' && transcript.session_id !== sessionId) {
    return { ok: false, code: 'session_mismatch' };
  }

  const steps = Array.isArray(transcript.steps) ? transcript.steps : [];
  return {
    ok: true,
    source: {
      runtime: RUNTIME,
      sessionId,
      locatorKind: TRANSCRIPT_LOCATOR_KIND,
      storePath,
    },
    records: recordsFromSteps(steps),
    injected: injectedFromSteps(steps),
  };
}

export function loadDevinSession({ sessionId, projectDir, ...options } = {}) {
  if (!isSafeSessionId(sessionId)) {
    return { ok: false, code: sessionId ? 'session_mismatch' : 'locator_unavailable' };
  }
  if (typeof projectDir !== 'string' || !projectDir.trim()) {
    return { ok: false, code: 'locator_unavailable' };
  }

  const dataDirectory = devinDataDirectory(options);
  const dbPath = devinDatabasePath(options);

  if (existsSync(dbPath)) {
    const dbContainment = resolveInside({ path: dbPath, root: dataDirectory });
    if (!dbContainment.ok) return dbContainment;

    let database;
    try {
      database = openDatabase(dbContainment.path);
    } catch {
      return { ok: false, code: 'store_unreadable' };
    }

    try {
      const row = sessionRow(database, sessionId);
      if (row) {
        // Devin's hooks receive the project root, while the row records the
        // folder the session ran in, which may sit below that root.
        if (Object.hasOwn(row, 'working_directory') && !atOrBelow(row.working_directory, projectDir)) {
          return { ok: false, code: 'session_mismatch' };
        }

        // An older store names its sessions but keeps their turns only in
        // transcript files, so a database with no message rows for this
        // session, or no chain head to walk, falls through.
        if (tableColumns(database, 'message_nodes').size > 0) {
          const projection = recordsFromDatabase(database, sessionId, row.main_chain_id);
          if (!projection) return { ok: false, code: 'store_unreadable' };

          const { records, injected } = projection;
          if (records.length > 0) {
            return {
              ok: true,
              source: {
                runtime: RUNTIME,
                sessionId,
                locatorKind: DATABASE_LOCATOR_KIND,
                storePath: dbContainment.path,
              },
              records,
              injected,
            };
          }
        }
      }
    } catch {
      return { ok: false, code: 'store_unreadable' };
    } finally {
      database.close();
    }
  }

  // The database has no turns for this id, so the store is either an older
  // transcript-only install or a request for a session it never held.
  return loadTranscript(sessionId, dataDirectory, options);
}
