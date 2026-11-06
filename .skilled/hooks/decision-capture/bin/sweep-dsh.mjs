#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: DeepSeek Harness Session Decision Sweep
// ───────────────────────────────────────────────────────────────────
// Recover DSH's answered questions into the decision queue.
// A timed question can return a pending result and get its answer later as a
// steered user message; both spellings of an answer land under one key.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, readdirSync, realpathSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { zstdDecompressSync } from 'node:zlib';

import {
  appendRecords,
  normalizeAskUserQuestion,
  pendingRecords,
  readConsumedKeys,
} from '../lib/capture-core.mjs';
import { chatCandidatesFromTurns } from '../lib/chat-questions.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const RUNTIME = 'dsh';
export const QUESTION_TOOL = 'ask_user_question';
const LATE_REPLY_SOURCE = 'user-question-reply';
const OPERATOR_SOURCE = 'user';
const SESSION_LOG_NAME = /^session(?:\.v([1-9]\d*))?\.jsonl(\.zstd)?$/;

const ZSTD_FRAME_MAGIC = 0xfd2fb528;
const SKIPPABLE_MAGIC_MASK = 0xfffffff0;
const SKIPPABLE_MAGIC = 0x184d2a50;

// ─────────────────────────────────────────────────────────────────────────────
// 3. LOG DECODING
// ─────────────────────────────────────────────────────────────────────────────

// Length of one Zstandard frame, from its header and block headers (RFC 8878 §3.1.1).
function zstdFrameLength(buffer, start) {
  let offset = start + 4;
  const descriptor = buffer[offset];
  if (descriptor === undefined) throw new Error('truncated Zstandard frame header');
  offset += 1;

  const contentSizeFlag = descriptor >> 6;
  const singleSegment = (descriptor >> 5) & 1;
  const hasChecksum = (descriptor >> 2) & 1;
  const dictionaryIdFlag = descriptor & 3;
  if (!singleSegment) offset += 1;
  offset += [0, 1, 2, 4][dictionaryIdFlag];
  offset += [singleSegment ? 1 : 0, 2, 4, 8][contentSizeFlag];

  for (;;) {
    if (offset + 3 > buffer.length) throw new Error('truncated Zstandard block header');
    const header = buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
    offset += 3;
    const lastBlock = header & 1;
    const blockType = (header >> 1) & 3;
    const blockSize = header >>> 3;
    if (blockType === 3) throw new Error('reserved Zstandard block type');
    // An RLE block stores one byte however long the content it repeats.
    offset += blockType === 1 ? 1 : blockSize;
    if (lastBlock) break;
  }
  if (hasChecksum) offset += 4;
  if (offset > buffer.length) throw new Error('truncated Zstandard frame');
  return offset - start;
}

/**
 * Decode a DSH session log. The harness appends one Zstandard frame per batch,
 * and Node decodes only the first frame of a buffer, so each frame is cut out and
 * decoded on its own.
 * @param {Buffer} buffer - Raw file contents.
 * @param {string} fileName - Log file name; a `.zstd` suffix selects decoding.
 * @returns {string} The JSONL text.
 */
export function decodeSessionLog(buffer, fileName) {
  if (!fileName.endsWith('.zstd')) return buffer.toString('utf8');

  const parts = [];
  let offset = 0;
  while (offset + 4 <= buffer.length) {
    const magic = buffer.readUInt32LE(offset);
    if ((magic & SKIPPABLE_MAGIC_MASK) >>> 0 === SKIPPABLE_MAGIC) {
      if (offset + 8 > buffer.length) throw new Error('truncated skippable frame');
      offset += 8 + buffer.readUInt32LE(offset + 4);
      continue;
    }
    if (magic !== ZSTD_FRAME_MAGIC) throw new Error(`unknown frame at byte ${offset}`);
    const length = zstdFrameLength(buffer, offset);
    parts.push(zstdDecompressSync(buffer.subarray(offset, offset + length)));
    offset += length;
  }
  return Buffer.concat(parts).toString('utf8');
}

function parseEvents(text) {
  const events = [];
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    try {
      const parsed = JSON.parse(line);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) events.push(parsed);
    } catch {
      // A torn final batch from a killed process must not fail the sweep.
    }
  }
  return events;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ANSWER RECOVERY
// ─────────────────────────────────────────────────────────────────────────────

function parsedObject(value) {
  if (typeof value === 'string') {
    try {
      return parsedObject(JSON.parse(value));
    } catch {
      return null;
    }
  }
  return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
}

function contentText(content) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content.filter((item) => item?.type === 'text' && typeof item.text === 'string')
    .map((item) => item.text).join('\n');
}

function answerLabels(answer) {
  const labels = Array.isArray(answer?.selected)
    ? answer.selected.filter((label) => typeof label === 'string' && label)
    : [];
  if (typeof answer?.custom === 'string' && answer.custom.trim()) labels.push(answer.custom);
  return labels;
}

/**
 * Turn one answered `ask_user_question` call into queue records.
 *
 * The tool answers by question id; the shared core keys answers by the exact
 * question text, so the ids are resolved against the call's own questions.
 * @param {object} input - Call id, arguments, answer value and session identity.
 * @returns {Array<object>} Normalized records, empty for a pending or unanswered call.
 */
export function dshAnswerRecords({ callId, args, value, sessionId, source, now } = {}) {
  const input = parsedObject(args);
  const result = parsedObject(value);
  if (!input || !result || result.pending === true || !Array.isArray(result.answers)) return [];
  if (typeof callId !== 'string' || !callId) return [];

  const questions = Array.isArray(input.questions) ? input.questions : [];
  const byId = new Map(questions.filter((item) => typeof item?.id === 'string').map((item) => [item.id, item]));
  const answers = {};
  for (const answer of result.answers) {
    const question = byId.get(answer?.id)?.question;
    const labels = answerLabels(answer);
    if (typeof question === 'string' && labels.length > 0) answers[question] = labels;
  }

  return normalizeAskUserQuestion({
    runtime: RUNTIME,
    sessionId,
    toolUseId: callId,
    toolInput: {
      questions: questions.map((item) => ({
        ...item,
        multiSelect: item?.multiSelect === true || item?.multi_select === true,
      })),
    },
    toolResponse: { answers },
    source,
    now,
  });
}

/**
 * Recover every answered question from a session's events.
 * @param {Array<object>} events - Parsed session log events, header first.
 * @param {string} sessionId - Session the records belong to.
 * @param {string} now - Capture timestamp.
 * @returns {Array<object>} Queue records with source `transcript`.
 */
export function recoveredRecords(events, sessionId, now) {
  const calls = new Map();
  const records = [];

  for (const event of events) {
    const data = event?.data;
    if (event?.type === 'tool/call' && data?.name === QUESTION_TOOL && typeof data.callId === 'string') {
      calls.set(data.callId, data.arguments);
      continue;
    }

    if (event?.type === 'tool/result') {
      const message = data?.message;
      const callId = message?.toolCallId;
      if (!calls.has(callId) || message.isError === true || data.error) continue;
      records.push(...dshAnswerRecords({
        callId, args: calls.get(callId), value: contentText(message.content), sessionId, source: 'transcript', now,
      }));
      continue;
    }

    const replySource = data?.source;
    if (event?.type === 'user/message' && replySource?.kind === LATE_REPLY_SOURCE && replySource.outcome === 'answered') {
      const reply = parsedObject(contentText(data.content));
      const callId = reply?.callId ?? replySource.callId;
      if (!reply || reply.tool !== QUESTION_TOOL) continue;
      const args = calls.get(callId) ?? { questions: reply.questions };
      records.push(...dshAnswerRecords({
        callId, args, value: { answers: reply.answers }, sessionId, source: 'transcript', now,
      }));
    }
  }

  return records;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CHAT CANDIDATES
// ─────────────────────────────────────────────────────────────────────────────

// Guard notices and runtime-context snapshots are user-role messages too; only a
// message the operator typed can answer a question asked in chat.
function chatTurnsOf(events) {
  const turns = [];

  for (const event of events) {
    const data = event?.data;
    if (event?.type === 'assistant/message') {
      const content = Array.isArray(data?.message?.content) ? data.message.content : [];
      if (content.some((item) => item?.type === 'tool-call')) {
        turns.push({ kind: 'tool' });
        continue;
      }
      const text = contentText(content);
      if (text) turns.push({ kind: 'assistant', id: data.message.id ?? data.id, text });
      continue;
    }

    if (event?.type !== 'user/message' || data?.source?.kind !== OPERATOR_SOURCE) continue;
    const text = contentText(data.content);
    if (text) turns.push({ kind: 'prompt', id: data.id, text });
  }

  return turns;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. SWEEP
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Recover answers missed by the live hook from a saved DSH session log.
 * @param {{ projectDir: string, sessionPath: string, now?: string }} options
 * @returns {object | null} A summary, or null when no output should be emitted.
 * @throws {Error} When the log cannot be read, so the CLI can report it.
 */
export function sweepDshSession({ projectDir, sessionPath, now } = {}) {
  const events = parseEvents(decodeSessionLog(readFileSync(sessionPath), sessionPath));
  const header = events[0]?.type === 'session' ? events[0] : null;
  if (typeof header?.id !== 'string' || !header.id) throw new Error(`no session header in ${sessionPath}`);

  const sessionId = header.id;
  const capturedAt = now || new Date().toISOString();
  const { appended } = appendRecords(projectDir, sessionId, recoveredRecords(events, sessionId, capturedAt));
  const pending = pendingRecords(projectDir, sessionId);
  const { candidates: chatCandidates, dropped: chatCandidatesDropped } = chatCandidatesFromTurns({
    runtime: RUNTIME,
    sessionId,
    turns: chatTurnsOf(events),
    consumed: readConsumedKeys(projectDir),
  });

  if (appended === 0 && pending.length === 0 && chatCandidates.length === 0) return null;

  return {
    session: sessionPath,
    session_id: sessionId,
    recovered: appended,
    pending,
    chat_candidates: chatCandidates,
    chat_candidates_dropped: chatCandidatesDropped,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. CLI
// ─────────────────────────────────────────────────────────────────────────────

function sessionFromArgs(argv) {
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--session' && argv[index + 1]) return argv[index + 1];
  }
  return null;
}

// The harness's own project-directory key: separators collapse to one `-`, and
// any other unsafe code unit becomes a `~XXXX` escape.
export function projectKey(cwd) {
  let readable = '';
  let separatorRun = false;
  for (let index = 0; index < cwd.length; index += 1) {
    const code = cwd.charCodeAt(index);
    const ch = String.fromCharCode(code);
    if (ch === '/' || ch === '\\' || ch === ':') {
      if (!separatorRun) readable += '-';
      separatorRun = true;
    } else if (ch !== '~' && /^[A-Za-z0-9._-]$/.test(ch)) {
      readable += ch;
      separatorRun = false;
    } else {
      readable += '~' + code.toString(16).toUpperCase().padStart(4, '0');
      separatorRun = false;
    }
  }
  return `--${(readable.replace(/^-+/, '') || 'root').slice(0, 251)}--`;
}

function samePath(left, right) {
  if (left === right) return true;
  try {
    return realpathSync(left) === realpathSync(right);
  } catch {
    return false;
  }
}

// The newest generation in one session directory, raw or compressed.
function sessionLogIn(directory) {
  let best = null;
  for (const fileName of readdirSync(directory)) {
    const match = SESSION_LOG_NAME.exec(fileName);
    if (!match) continue;
    const version = Number(match[1] ?? 0);
    if (!best || version > best.version) best = { version, path: join(directory, fileName) };
  }
  return best?.path ?? null;
}

function headerCwd(sessionPath) {
  try {
    const text = decodeSessionLog(readFileSync(sessionPath), sessionPath);
    const header = JSON.parse(text.slice(0, text.indexOf('\n') >>> 0));
    return header?.type === 'session' && typeof header.cwd === 'string' ? header.cwd : null;
  } catch {
    return null;
  }
}

// Separator collapsing makes the key lossy, so `/work/a-b` and `/work/a/b`
// share one directory; the header's `cwd` tells the two projects apart.
function latestSession(projectDir) {
  const root = join(process.env.DSH_HOME || join(homedir(), '.dsh'), 'sessions');
  const spellings = new Set([projectDir]);
  try {
    spellings.add(realpathSync(projectDir));
  } catch {
    // An unresolvable project path keeps its own spelling only.
  }

  const candidates = [];
  for (const spelling of spellings) {
    const projectRoot = join(root, projectKey(spelling));
    let entries;
    try {
      entries = readdirSync(projectRoot, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      try {
        const logPath = sessionLogIn(join(projectRoot, entry.name));
        if (logPath) candidates.push({ logPath, mtime: statSync(logPath).mtimeMs });
      } catch {
        // A session directory removed mid-scan is simply skipped.
      }
    }
  }

  candidates.sort((left, right) => right.mtime - left.mtime);
  for (const { logPath } of candidates) {
    const cwd = headerCwd(logPath);
    if (cwd && samePath(cwd, projectDir)) return logPath;
  }
  return null;
}

function main() {
  const projectDir = process.cwd();
  const sessionPath = sessionFromArgs(process.argv.slice(2)) || latestSession(projectDir);
  if (!sessionPath) return 0;

  try {
    const result = sweepDshSession({ projectDir, sessionPath });
    if (!result) return 0;

    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    return 0;
  } catch (error) {
    process.stdout.write(
      `${JSON.stringify({ error: error?.message || `cannot read ${sessionPath}` }, null, 2)}\n`,
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
