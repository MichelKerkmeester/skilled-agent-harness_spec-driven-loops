#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: OpenCode SQLite Decision Sweep                                ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Recover OpenCode's answered questions into the queue.           ║
// ╚══════════════════════════════════════════════════════════════════════════╝
// Backstop for the decision queue.
//
// OpenCode records a question call and its answer as one completed tool part, so
// a sweep can replay the turn without a live hook. Only a completed part with an
// answers array counts: a dismissed call keeps the part but stores no answer, and
// a call still running has nothing to quote. Deduplication belongs to the core,
// so a key an earlier producer wrote is skipped and running the sweep on every
// save stays safe.
//
// Two storage layouts share the same queue. Older databases keep every part in
// `part`; newer ones also keep whole assistant messages in `session_message`,
// where the same call appears as a content item. Both are read so a database
// mid-migration does not lose the answers it already holds.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { realpathSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import process from 'node:process';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

import {
  appendRecords,
  normalizeAskUserQuestion,
  pendingRecords,
} from '../lib/capture-core.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const RUNTIME = 'opencode';
const QUESTION_TOOL = 'question';
const PART_TABLE = 'part';
const MESSAGE_TABLE = 'session_message';
const SESSION_TABLES = ['session_v2', 'session'];

// ─────────────────────────────────────────────────────────────────────────────
// 3. ANSWER RECORDS
// ─────────────────────────────────────────────────────────────────────────────

// A completed question part carries the answers beside the question input, and
// answers are positional: answers[i] belongs to questions[i]. A missing or empty
// entry means the operator skipped that question, so it contributes no key and
// the core drops it.
export function openCodeAnswerRecords({ parts, sessionId, now } = {}) {
  const records = [];

  for (const part of Array.isArray(parts) ? parts : []) {
    if (part?.type !== 'tool' || part.tool !== QUESTION_TOOL) continue;

    const state = part.state;
    if (state?.status !== 'completed') continue;

    const answerLists = state.metadata?.answers;
    if (!Array.isArray(answerLists)) continue;

    const questions = Array.isArray(state.input?.questions) ? state.input.questions : [];
    const answers = {};
    for (let index = 0; index < questions.length; index += 1) {
      const question = questions[index]?.question;
      if (typeof question !== 'string' || question === '') continue;

      const selected = answerLists[index];
      if (!Array.isArray(selected) || selected.length === 0) continue;
      if (!selected.every((label) => typeof label === 'string')) continue;
      answers[question] = selected.join(', ');
    }

    // The core reads camel-case multiSelect, while OpenCode spells the flag
    // `multiple`, so the questions are remapped here rather than teaching the
    // core a second spelling for one runtime.
    records.push(...normalizeAskUserQuestion({
      runtime: RUNTIME,
      sessionId,
      toolUseId: part.callID,
      toolInput: {
        questions: questions.map((item) => ({
          question: item?.question,
          header: item?.header,
          options: item?.options,
          multiSelect: Boolean(item?.multiple),
        })),
      },
      toolResponse: { answers },
      source: 'transcript',
      now,
    }));
  }

  return records;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. DATABASE PARTS
// ─────────────────────────────────────────────────────────────────────────────

// A torn row must not fail the whole sweep: one unreadable part is skipped while
// every other answer still reaches the queue.
function parsedPart(data) {
  try {
    const parsed = JSON.parse(data);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function tableNames(database) {
  const rows = database.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all();
  return new Set(rows.map((row) => row.name));
}

// A newer database may hold only one of the two storage tables, so the schema is
// read before a query names a table that is not there. The database is opened
// read-only because a sweep must never write to OpenCode's own state, and it is
// closed in finally so a failed query cannot leave a handle behind.
export function loadOpenCodeParts({ dbPath, sessionId } = {}) {
  const database = new DatabaseSync(dbPath, { readOnly: true });

  try {
    const tables = tableNames(database);
    const parts = [];

    if (tables.has(PART_TABLE)) {
      const rows = database
        .prepare(`SELECT data FROM ${PART_TABLE} WHERE session_id = ? ORDER BY time_created, id`)
        .all(sessionId);
      for (const row of rows) {
        const part = parsedPart(row.data);
        if (part) parts.push(part);
      }
    }

    if (tables.has(MESSAGE_TABLE)) {
      const rows = database
        .prepare(
          `SELECT data FROM ${MESSAGE_TABLE} WHERE session_id = ? AND type = 'assistant' ORDER BY seq`,
        )
        .all(sessionId);
      for (const row of rows) {
        const message = parsedPart(row.data);
        const content = Array.isArray(message?.content) ? message.content : [];
        for (const item of content) {
          if (item?.type !== 'tool') continue;
          // The message item names its tool with `name` where a part uses `tool`,
          // so the item is converted into the part shape the answer reader
          // already understands.
          parts.push({
            type: 'tool',
            tool: item.name,
            callID: item.id,
            state: item.state,
          });
        }
      }
    }

    return parts;
  } finally {
    database.close();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. LATEST SESSION
// ─────────────────────────────────────────────────────────────────────────────

// The same session can appear in the legacy `session` table or in `session_v2`,
// so both are asked and the larger timestamp wins. Directory matching is exact
// because OpenCode stores the resolved path it ran in.
export function latestOpenCodeSession({ dbPath, projectDir } = {}) {
  const database = new DatabaseSync(dbPath, { readOnly: true });

  try {
    const tables = tableNames(database);
    let newest = null;

    for (const table of SESSION_TABLES) {
      if (!tables.has(table)) continue;
      const row = database
        .prepare(
          `SELECT id, time_updated FROM ${table} WHERE directory = ? ORDER BY time_updated DESC LIMIT 1`,
        )
        .get(projectDir);
      if (typeof row?.id !== 'string' || !row.id) continue;

      const updated = Number(row.time_updated);
      if (newest === null || updated > newest.updated) {
        newest = { id: row.id, updated };
      }
    }

    return newest?.id ?? null;
  } finally {
    database.close();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. SWEEP
// ─────────────────────────────────────────────────────────────────────────────

export function sweepOpenCodeSession({ projectDir, dbPath, sessionId, now } = {}) {
  const parts = loadOpenCodeParts({ dbPath, sessionId });
  const capturedAt = now || new Date().toISOString();

  const { appended } = appendRecords(
    projectDir,
    sessionId,
    openCodeAnswerRecords({ parts, sessionId, now: capturedAt }),
  );

  return {
    transcript: dbPath,
    session_id: sessionId,
    recovered: appended,
    pending: pendingRecords(projectDir, sessionId),
    chat_candidates: [],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. CLI
// ─────────────────────────────────────────────────────────────────────────────

function argumentValue(argv, flag) {
  const index = argv.indexOf(flag);
  if (index === -1) return null;
  return argv[index + 1] || null;
}

// OpenCode keeps its database under the XDG data home, and a session is keyed by
// the directory it ran in; only the newest matching row can be the session a
// save is resuming.
function defaultDatabasePath() {
  const dataHome = process.env.XDG_DATA_HOME || join(homedir(), '.local', 'share');
  return join(dataHome, 'opencode', 'opencode.db');
}

function main() {
  const projectDir = process.cwd();
  const argv = process.argv.slice(2);
  const dbPath = argumentValue(argv, '--db') || defaultDatabasePath();

  let sessionId;
  try {
    sessionId = argumentValue(argv, '--session')
      || latestOpenCodeSession({ dbPath, projectDir });
  } catch (error) {
    process.stdout.write(
      `${JSON.stringify({ error: error?.message || `cannot read ${dbPath}` }, null, 2)}\n`,
    );
    return 1;
  }

  if (!sessionId) {
    process.stdout.write(
      `${JSON.stringify({ error: `no opencode session found for ${projectDir}` }, null, 2)}\n`,
    );
    return 1;
  }

  try {
    const result = sweepOpenCodeSession({ projectDir, dbPath, sessionId });
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return 0;
  } catch (error) {
    process.stdout.write(
      `${JSON.stringify({ error: error?.message || `cannot read ${dbPath}` }, null, 2)}\n`,
    );
    return 1;
  }
}

// A hook invokes this script by path, and a checkout reached through a symlink
// spells that path differently from the module URL, so both sides are resolved
// before they are compared. Reaching the file through a link must still run it.
function isMainModule() {
  const entrypoint = process.argv[1];
  if (!entrypoint) return false;
  try {
    return realpathSync(entrypoint) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

if (isMainModule()) process.exitCode = main();
