#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Session Decision Sweep
// ───────────────────────────────────────────────────────────────────
// Recover Vibe's answered questions into the decision queue.
// The runtime's question tool answers with a list keyed by the question text it
// repeats, while the shared normalizer reads an object keyed by that same text,
// so the list is folded into an object here. The live adapter imports this
// mapper, so an answer the hook saw and an answer a save recovers share one key.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, readdirSync, realpathSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import {
  appendRecords,
  normalizeAskUserQuestion,
  pendingRecords,
} from '../lib/capture-core.mjs';
import { loadVibeSession } from '../../shared/session-readers/vibe.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const RUNTIME = 'vibe';
const JOURNAL_DIRECTORY = 'journal';
const EFFECT_PREFIX = 'effect-';
const SESSION_ROOT_ENV = 'MISTRAL_VIBE_SESSION_ROOT';
// The question tool belongs to the runtime's `ui` group, so a hook payload and a
// journal entry both spell it `ui.ask_user_question`. The bare name is accepted
// too, because the group prefix is the runtime's spelling rather than part of
// the tool, and a match on one spelling alone would silently capture nothing.
const QUESTION_TOOL = /^(?:[A-Za-z0-9_]+\.)?ask_user_question$/;

// ─────────────────────────────────────────────────────────────────────────────
// 3. TOOL IDENTITY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Whether a tool name is Vibe's question tool, bare or group-qualified.
 * @param {unknown} name - The tool name a payload or journal entry carries.
 * @returns {boolean}
 */
export function isQuestionTool(name) {
  return typeof name === 'string' && QUESTION_TOOL.test(name);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ANSWER RECOVERY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Turn one answered `ask_user_question` call into queue records.
 *
 * The tool returns `{ answers: [{ question, answer, isOther }], cancelled }`,
 * and the shared normalizer looks answers up by the exact question text, so the
 * list is folded into an object keyed by that text. A cancelled question is a
 * dismissed widget rather than a decision, so it yields nothing even though the
 * call itself succeeded.
 * @param {object} input - Call id, the call's arguments, its result and session identity.
 * @returns {Array<object>} Normalized records, empty for a cancelled or unanswered call.
 */
export function vibeAnswerRecords({
  toolUseId,
  toolInput,
  toolResponse,
  sessionId,
  source,
  now,
} = {}) {
  if (toolResponse?.cancelled === true) return [];
  if (!Array.isArray(toolResponse?.answers)) return [];

  const answers = {};
  for (const item of toolResponse.answers) {
    if (!item || typeof item !== 'object') continue;
    const question = typeof item.question === 'string' ? item.question : '';
    if (!question) continue;
    // The value stays as the runtime sent it: a single answer is a string and a
    // multi-select arrives already joined, so the core's own reader decides.
    answers[question] = item.answer;
  }

  return normalizeAskUserQuestion({
    runtime: RUNTIME,
    sessionId,
    toolUseId,
    toolInput,
    toolResponse: { answers },
    source,
    now,
  });
}

// The journal records a tool result inside the runtime's envelope, whose
// `structured_content` is the answer list. A hook payload publishes that same
// `structured_content` directly, so only the journal path unwraps a level.
function resultOf(state) {
  const output = state?.output;
  if (!output || typeof output !== 'object') return null;
  const structured = output.structured_content;
  if (!structured || typeof structured !== 'object' || Array.isArray(structured)) return null;
  return structured;
}

// The queue key is the model's call id, because that is the only identity a
// post_tool payload carries. A journal entry is named after the action instead,
// so the intent record that reserved the call is what maps one to the other.
function callIdsByAction(journalRecords) {
  const callIds = new Map();
  for (const record of journalRecords) {
    if (record.type !== 'action_intent') continue;
    const request = record.payload?.request;
    if (!request || typeof request.action_id !== 'string' || !request.action_id) continue;
    if (typeof request.call_id === 'string' && request.call_id) {
      callIds.set(request.action_id, request.call_id);
    }
  }
  return callIds;
}

// A call id a provider reuses takes `effect-{action_id}-{n}`, so the entry id is
// matched by its action prefix as well as exactly.
function callIdOf(entry, callIds) {
  const id = typeof entry?.id === 'string' ? entry.id : '';
  if (!id.startsWith(EFFECT_PREFIX)) return null;
  const actionId = id.slice(EFFECT_PREFIX.length);
  if (callIds.has(actionId)) return callIds.get(actionId);
  const reused = /^(.*)-\d+$/.exec(actionId);
  return reused && callIds.has(reused[1]) ? callIds.get(reused[1]) : null;
}

function recoveredRecords(session, sessionId, now) {
  const callIds = callIdsByAction(session.journalRecords);
  const records = [];
  for (const entry of session.entries) {
    if (entry?.type !== 'effect') continue;
    const detail = entry.detail;
    if (!detail || detail.kind !== 'tool' || !isQuestionTool(detail.toolName)) continue;
    const toolResponse = resultOf(entry.state);
    if (!toolResponse) continue;
    records.push(...vibeAnswerRecords({
      toolUseId: callIdOf(entry, callIds) ?? entry.id,
      toolInput: detail.input,
      toolResponse,
      sessionId,
      source: 'transcript',
      now,
    }));
  }
  return records;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. SWEEP
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Recover answers missed by the live hook from a saved Vibe session.
 * @param {{ projectDir: string, transcriptPath: string, now?: string }} options
 *   `transcriptPath` is the session storage root a hook receives, the directory
 *   that holds the journal.
 * @returns {object | null} A summary, or null when no output should be emitted.
 * @throws {Error} When the journal cannot be read, so the CLI can report it.
 */
export function sweepVibeSession({ projectDir, transcriptPath, now } = {}) {
  const session = loadVibeSession({ transcriptPath });
  if (!session.ok) throw new Error(`cannot read the Vibe journal at ${transcriptPath}: ${session.code}`);

  const sessionId = session.source.sessionId;
  if (typeof sessionId !== 'string' || !sessionId) {
    throw new Error(`the Vibe journal at ${transcriptPath} names no session`);
  }

  const capturedAt = now || new Date().toISOString();
  const { appended } = appendRecords(
    projectDir,
    sessionId,
    recoveredRecords(session, sessionId, capturedAt),
  );
  const pending = pendingRecords(projectDir, sessionId);

  if (appended === 0 && pending.length === 0) return null;

  return {
    session: transcriptPath,
    session_id: sessionId,
    recovered: appended,
    pending,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. CLI
// ─────────────────────────────────────────────────────────────────────────────

function sessionFromArgs(argv) {
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--session' && argv[index + 1]) return argv[index + 1];
  }
  return null;
}

function expandHome(value) {
  return value.startsWith('~') ? join(homedir(), value.slice(1)) : value;
}

// The runtime keeps every session under one root, and a non-default root is how a
// keyed or test run isolates itself.
function sessionRoot() {
  const configured = process.env[SESSION_ROOT_ENV];
  return configured ? expandHome(configured) : join(homedir(), '.vibe', 'logs', 'session');
}

function samePath(left, right) {
  if (left === right) return true;
  try {
    return realpathSync(left) === realpathSync(right);
  } catch {
    return false;
  }
}

function sessionCwd(directory) {
  try {
    const meta = JSON.parse(readFileSync(join(directory, 'meta.json'), 'utf8'));
    const workingDirectory = meta?.environment?.working_directory;
    if (typeof workingDirectory === 'string' && workingDirectory) return workingDirectory;
    return typeof meta?.origin_directory === 'string' ? meta.origin_directory : null;
  } catch {
    return null;
  }
}

// A session belongs to the directory it ran in, and the journal's mtime orders
// sessions without parsing every metadata file. Vibe 3 keeps sessions under
// `unified/`, and older releases kept them at the root, so both are read.
function latestSession(projectDir) {
  const candidates = [];
  for (const root of [sessionRoot(), join(sessionRoot(), 'unified')]) {
    let entries;
    try {
      entries = readdirSync(root, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const directory = join(root, entry.name);
      try {
        candidates.push({ directory, mtime: statSync(join(directory, JOURNAL_DIRECTORY)).mtimeMs });
      } catch {
        // A session without a journal has nothing to replay.
      }
    }
  }

  candidates.sort((left, right) => right.mtime - left.mtime);
  for (const { directory } of candidates) {
    const cwd = sessionCwd(directory);
    if (cwd && samePath(cwd, projectDir)) return directory;
  }
  return null;
}

function main() {
  const projectDir = process.cwd();
  const transcriptPath = sessionFromArgs(process.argv.slice(2)) || latestSession(projectDir);
  if (!transcriptPath) return 0;

  try {
    const result = sweepVibeSession({ projectDir, transcriptPath });
    if (!result) return 0;

    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    return 0;
  } catch (error) {
    process.stdout.write(
      `${JSON.stringify({ error: error?.message || `cannot read ${transcriptPath}` }, null, 2)}\n`,
    );
    return 1;
  }
}

// A checkout reached through a symlink spells its path differently from the
// module URL, so resolve both paths before deciding whether this file is entrypoint.
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
