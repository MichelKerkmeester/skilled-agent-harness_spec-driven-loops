#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Codex Session Decision Sweep
// ───────────────────────────────────────────────────────────────────
// Recover Codex's answered questions into the decision queue.
// Aborted requests contain no choice, and async requests return only an acceptance acknowledgement.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import {
  closeSync,
  openSync,
  readFileSync,
  readdirSync,
  realpathSync,
  readSync,
} from 'node:fs';
import { homedir } from 'node:os';
import { basename, join } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

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

const RUNTIME = 'codex';
const QUESTION_TOOL = 'request_user_input';
const TRANSCRIPT_EXT = '.jsonl';
const ROLLOUT_PREFIX = 'rollout-';
const USER_NOTE_PREFIX = 'user_note: ';
const NONE_OPTION = 'None of the above';

// ─────────────────────────────────────────────────────────────────────────────
// 3. TRANSCRIPT PARSING
// ─────────────────────────────────────────────────────────────────────────────

function parseObject(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed
      : null;
  } catch {
    return null;
  }
}

function parseTranscriptLines(content) {
  return content.split('\n').map((line) => parseObject(line));
}

function sessionIdOf(lines, transcriptPath) {
  const metadata = lines.find((line) => line?.type === 'session_meta');
  const sessionId = metadata?.payload?.id;
  if (typeof sessionId === 'string' && sessionId) return sessionId;

  const fileName = basename(transcriptPath);
  const match = fileName.match(
    /^rollout-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-(.+)\.jsonl$/,
  );
  if (match?.[1]) return match[1];

  return fileName.endsWith(TRANSCRIPT_EXT)
    ? fileName.slice(0, -TRANSCRIPT_EXT.length)
    : fileName;
}

// Rollout headers carry the session's instructions and can run to tens of
// kilobytes, so the first line is read in chunks rather than byte by byte.
const HEADER_CHUNK_BYTES = 64 * 1024;

function readFirstLine(filePath) {
  let descriptor;
  try {
    descriptor = openSync(filePath, 'r');
    const chunk = Buffer.alloc(HEADER_CHUNK_BYTES);
    const parts = [];
    let bytesRead;
    while ((bytesRead = readSync(descriptor, chunk, 0, HEADER_CHUNK_BYTES, null)) > 0) {
      const newline = chunk.subarray(0, bytesRead).indexOf(10);
      if (newline !== -1) {
        parts.push(Buffer.from(chunk.subarray(0, newline)));
        break;
      }
      parts.push(Buffer.from(chunk.subarray(0, bytesRead)));
    }
    return Buffer.concat(parts).toString('utf8').replace(/\r$/, '');
  } catch {
    return null;
  } finally {
    if (descriptor !== undefined) closeSync(descriptor);
  }
}

function samePath(left, right) {
  if (left === right) return true;
  try {
    return realpathSync(left) === realpathSync(right);
  } catch {
    return false;
  }
}

function rolloutPaths(directory, paths = []) {
  let entries;
  try {
    entries = readdirSync(directory, { withFileTypes: true });
  } catch {
    return paths;
  }

  for (const entry of entries) {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      rolloutPaths(entryPath, paths);
    } else if (
      entry.isFile()
      && entry.name.startsWith(ROLLOUT_PREFIX)
      && entry.name.endsWith(TRANSCRIPT_EXT)
    ) {
      paths.push(entryPath);
    }
  }
  return paths;
}

function codexHome() {
  return process.env.CODEX_HOME || join(homedir(), '.codex');
}

function latestTranscript(projectDir) {
  const candidates = rolloutPaths(join(codexHome(), 'sessions')).sort().reverse();
  for (const transcriptPath of candidates) {
    const firstLine = parseObject(readFirstLine(transcriptPath));
    if (
      firstLine?.type === 'session_meta'
      && typeof firstLine.payload?.cwd === 'string'
      && samePath(firstLine.payload.cwd, projectDir)
    ) {
      return transcriptPath;
    }
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ANSWER RECOVERY
// ─────────────────────────────────────────────────────────────────────────────

function inputWithSingleSelectQuestions(toolInput) {
  if (!Array.isArray(toolInput.questions)) return toolInput;
  return {
    ...toolInput,
    questions: toolInput.questions.map((question) => (
      question && typeof question === 'object' && !Array.isArray(question)
        ? { ...question, multiSelect: false }
        : question
    )),
  };
}

function answerText(values) {
  if (!Array.isArray(values)) return '';
  const items = values.filter((value) => typeof value === 'string');
  const hasUserNote = items.some((item) => item.startsWith(USER_NOTE_PREFIX));
  const selected = hasUserNote
    ? items
      .filter((item) => item !== NONE_OPTION)
      .map((item) => item.startsWith(USER_NOTE_PREFIX)
        ? item.slice(USER_NOTE_PREFIX.length)
        : item)
    : items;
  return selected.join(', ');
}

function recoveredRecords(lines, sessionId, now) {
  const calls = new Map();
  const records = [];

  for (const line of lines) {
    const payload = line?.payload;
    if (line?.type !== 'response_item' || !payload || typeof payload !== 'object') continue;

    if (payload.type === 'function_call' && payload.name === QUESTION_TOOL) {
      if (typeof payload.call_id !== 'string' || !payload.call_id) continue;
      const parsedInput = parseObject(payload.arguments);
      if (!parsedInput) continue;
      calls.set(payload.call_id, inputWithSingleSelectQuestions(parsedInput));
      continue;
    }

    if (payload.type !== 'function_call_output') continue;
    const toolInput = calls.get(payload.call_id);
    if (!toolInput) continue;

    const toolResponse = parseObject(payload.output);
    const responseAnswers = toolResponse?.answers;
    if (!responseAnswers || typeof responseAnswers !== 'object' || Array.isArray(responseAnswers)) {
      continue;
    }

    const answers = Object.create(null);
    const questions = Array.isArray(toolInput.questions) ? toolInput.questions : [];
    for (const question of questions) {
      if (!question || typeof question !== 'object') continue;
      if (typeof question.id !== 'string' || typeof question.question !== 'string') continue;

      const answerEntry = Object.hasOwn(responseAnswers, question.id)
        ? responseAnswers[question.id]
        : null;
      const answer = answerText(answerEntry?.answers);
      if (answer) answers[question.question] = answer;
    }

    records.push(...normalizeAskUserQuestion({
      runtime: RUNTIME,
      sessionId,
      toolUseId: payload.call_id,
      toolInput,
      toolResponse: { answers },
      source: 'transcript',
      now,
    }));
  }

  return records;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CHAT CANDIDATES
// ─────────────────────────────────────────────────────────────────────────────

function joinedTextOf(payload, itemType) {
  const content = Array.isArray(payload.content) ? payload.content : [];
  return content
    .filter((item) => item?.type === itemType && typeof item.text === 'string')
    .map((item) => item.text)
    .join('\n');
}

function chatTurnsOf(lines) {
  const turns = [];

  for (const line of lines) {
    const payload = line?.payload;
    if (line?.type !== 'response_item' || !payload || typeof payload !== 'object') continue;

    if (payload.type === 'function_call' || payload.type === 'custom_tool_call') {
      turns.push({ kind: 'tool' });
      continue;
    }

    if (payload.type !== 'message') continue;

    if (payload.role === 'assistant') {
      const text = joinedTextOf(payload, 'output_text');
      if (text) turns.push({ kind: 'assistant', id: payload.id, text });
      continue;
    }

    if (payload.role !== 'user') continue;

    const text = joinedTextOf(payload, 'input_text');
    // Codex injects environment context as a user message. That text is harness
    // bookkeeping attached to the turn, never something the operator typed.
    if (!text || text.startsWith('<')) continue;
    turns.push({ kind: 'prompt', id: payload.id, text });
  }

  return turns;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. SWEEP
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Recover answers missed by a live hook from a saved Codex rollout.
 *
 * @param {{ projectDir: string, transcriptPath: string, now?: string }} options
 * @returns {object | null} A summary, or null when no output should be emitted.
 * @throws {Error} When the transcript cannot be read, so the CLI can report it.
 */
export function sweepCodexTranscript({ projectDir, transcriptPath, now } = {}) {
  const content = readFileSync(transcriptPath, 'utf8');
  const lines = parseTranscriptLines(content);
  const sessionId = sessionIdOf(lines, transcriptPath);
  const capturedAt = now || new Date().toISOString();
  const { appended } = appendRecords(
    projectDir,
    sessionId,
    recoveredRecords(lines, sessionId, capturedAt),
  );
  const pending = pendingRecords(projectDir, sessionId);
  const { candidates: chatCandidates, dropped: chatCandidatesDropped } = chatCandidatesFromTurns({
    runtime: RUNTIME,
    sessionId,
    turns: chatTurnsOf(lines),
    consumed: readConsumedKeys(projectDir),
  });

  if (appended === 0 && pending.length === 0 && chatCandidates.length === 0) return null;

  return {
    transcript: transcriptPath,
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

function transcriptFromArgs(argv) {
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--transcript' && argv[index + 1]) return argv[index + 1];
  }
  return null;
}

function main() {
  const projectDir = process.cwd();
  const transcriptPath = transcriptFromArgs(process.argv.slice(2))
    || latestTranscript(projectDir);
  if (!transcriptPath) return 0;

  try {
    const result = sweepCodexTranscript({ projectDir, transcriptPath });
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

// Resolve symlinks before comparing the executed file with this module's URL.
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
