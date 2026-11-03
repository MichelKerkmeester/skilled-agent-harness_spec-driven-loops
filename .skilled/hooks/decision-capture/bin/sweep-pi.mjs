#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Session Decision Sweep
// ───────────────────────────────────────────────────────────────────
// Recover Pi's answered questions into the decision queue.
// Pi can record cancelled prompts as tool results, but they contain no operator
// decision and must not become queued decisions.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { closeSync, openSync, readFileSync, readSync, readdirSync, realpathSync } from 'node:fs';
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

const RUNTIME = 'pi';
// Pi has no built-in question tool. `ask_user_question` comes from the
// rpiv-ask-user-question package and `question` from pi-plan-build; a session
// with both installed may answer through either one.
export const QUESTION_TOOLS = new Set(['ask_user_question', 'question']);
const TRANSCRIPT_EXT = '.jsonl';

// ─────────────────────────────────────────────────────────────────────────────
// 3. TRANSCRIPT PARSING
// ─────────────────────────────────────────────────────────────────────────────

function parseTranscriptLines(content) {
  return content.split('\n').map((line) => {
    if (!line.trim()) return null;
    try {
      const parsed = JSON.parse(line);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
        ? parsed
        : null;
    } catch {
      return null;
    }
  });
}

function sessionIdOf(lines, transcriptPath) {
  const firstLine = lines[0];
  if (
    firstLine?.type === 'session'
    && typeof firstLine.id === 'string'
    && firstLine.id
  ) {
    return firstLine.id;
  }

  const fileName = basename(transcriptPath);
  const withoutExtension = fileName.endsWith(TRANSCRIPT_EXT)
    ? fileName.slice(0, -TRANSCRIPT_EXT.length)
    : fileName;
  const separatorIndex = withoutExtension.indexOf('_');
  return separatorIndex === -1
    ? withoutExtension
    : withoutExtension.slice(separatorIndex + 1) || withoutExtension;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ANSWER RECOVERY
// ─────────────────────────────────────────────────────────────────────────────

function askUserQuestionAnswers(toolInput, resultAnswers) {
  const questions = Array.isArray(toolInput?.questions) ? toolInput.questions : [];
  const answers = {};

  for (const answer of resultAnswers) {
    const questionIndex = answer?.questionIndex;
    if (!Number.isInteger(questionIndex)) continue;

    const question = questions[questionIndex]?.question;
    if (typeof question !== 'string') continue;

    if (answer.kind === 'multi' && Array.isArray(answer.selected)) {
      answers[question] = answer.selected.join(', ');
    } else if (
      (answer.kind === 'option' || answer.kind === 'custom')
      && typeof answer.answer === 'string'
    ) {
      answers[question] = answer.answer;
    }
  }

  return { toolInput, answers };
}

// pi-plan-build returns one entry per question, in the order asked, with the
// chosen labels in an `answers` array and no question index.
function planBuildAnswers(toolInput, resultAnswers) {
  const questions = Array.isArray(toolInput?.questions) ? toolInput.questions : [];
  const answers = {};

  resultAnswers.forEach((answer, index) => {
    const question = questions[index]?.question;
    if (typeof question !== 'string' || answer?.question !== question) return;
    if (!Array.isArray(answer.answers)) return;

    const labels = answer.answers.filter((label) => typeof label === 'string' && label);
    if (labels.length > 0) answers[question] = labels.join(', ');
  });

  return {
    toolInput: {
      ...toolInput,
      questions: questions.map((item) => ({ ...item, multiSelect: item?.multiple === true })),
    },
    answers,
  };
}

export function recoveredRecords(lines, sessionId, now) {
  const calls = new Map();
  const results = [];

  for (const line of lines) {
    const message = line?.message;
    if (line?.type !== 'message' || !message || typeof message !== 'object') continue;

    if (message.role === 'assistant') {
      const content = Array.isArray(message.content) ? message.content : [];
      for (const item of content) {
        if (item?.type !== 'toolCall' || !QUESTION_TOOLS.has(item.name)) continue;
        if (typeof item.id !== 'string' || !item.id) continue;
        calls.set(item.id, { name: item.name, input: item.arguments });
      }
      continue;
    }

    if (message.role === 'toolResult' && QUESTION_TOOLS.has(message.toolName)) {
      results.push(message);
    }
  }

  const records = [];
  for (const result of results) {
    if (result.isError === true || result.details?.cancelled === true) continue;
    if (!Array.isArray(result.details?.answers)) continue;

    const toolUseId = result.toolCallId;
    if (typeof toolUseId !== 'string' || !calls.has(toolUseId)) continue;

    const call = calls.get(toolUseId);
    const { toolInput, answers } = call.name === 'question'
      ? planBuildAnswers(call.input, result.details.answers)
      : askUserQuestionAnswers(call.input, result.details.answers);

    records.push(...normalizeAskUserQuestion({
      runtime: RUNTIME,
      sessionId,
      toolUseId,
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

function chatTurnsOf(lines) {
  const turns = [];

  for (const line of lines) {
    if (line?.type !== 'message' || !line.message || typeof line.message !== 'object') continue;

    const { message } = line;
    const content = Array.isArray(message.content) ? message.content : [];

    if (message.role === 'assistant') {
      if (content.some((item) => item?.type === 'toolCall')) {
        turns.push({ kind: 'tool' });
        continue;
      }

      const textBlocks = content.filter(
        (item) => item?.type === 'text' && typeof item.text === 'string',
      );
      if (textBlocks.length > 0) {
        turns.push({
          kind: 'assistant',
          id: line.id,
          text: textBlocks.map((item) => item.text).join('\n'),
        });
      }
      continue;
    }

    if (message.role !== 'user') continue;

    const textBlocks = content.filter(
      (item) => item?.type === 'text' && typeof item.text === 'string',
    );
    if (textBlocks.length === 0) continue;

    const text = textBlocks.map((item) => item.text).join('\n');
    if (!text.startsWith('<')) turns.push({ kind: 'prompt', id: line.id, text });
  }

  return turns;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. SWEEP
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Recover answers missed by a live hook from the saved Pi session.
 * @param {{ projectDir: string, transcriptPath: string, now?: string }} options
 * @returns {object | null} A summary, or null when no output should be emitted.
 * @throws {Error} When the transcript cannot be read, so the CLI can report it.
 */
export function sweepPiTranscript({ projectDir, transcriptPath, now } = {}) {
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

// Pi names a project's session directory after its path with every slash
// flattened, so `/work/foo-bar` and `/work/foo/bar` share one directory. The
// session header's `cwd` tells the two projects apart.
const HEADER_PROBE_BYTES = 64 * 1024;

function sessionDirectory(projectDir) {
  const projectKey = projectDir.replace(/^\/+/, '').replaceAll('/', '-');
  return join(homedir(), '.pi', 'agent', 'sessions', '--' + projectKey + '--');
}

function samePath(left, right) {
  if (left === right) return true;
  try {
    return realpathSync(left) === realpathSync(right);
  } catch {
    return false;
  }
}

function headerCwd(filePath) {
  let fd;
  try {
    fd = openSync(filePath, 'r');
    const buffer = Buffer.alloc(HEADER_PROBE_BYTES);
    const head = buffer.subarray(0, readSync(fd, buffer, 0, HEADER_PROBE_BYTES, 0)).toString('utf8');
    const header = JSON.parse(head.split('\n')[0]);
    return header?.type === 'session' && typeof header.cwd === 'string' ? header.cwd : null;
  } catch {
    return null;
  } finally {
    if (fd !== undefined) closeSync(fd);
  }
}

function latestTranscript(projectDir) {
  const directory = sessionDirectory(projectDir);
  let fileNames;
  try {
    fileNames = readdirSync(directory);
  } catch {
    return null;
  }

  // Session file names start with their creation time, so a reverse sort is
  // newest first.
  const candidates = fileNames
    .filter((fileName) => fileName.endsWith(TRANSCRIPT_EXT))
    .sort()
    .reverse();
  for (const fileName of candidates) {
    const filePath = join(directory, fileName);
    const cwd = headerCwd(filePath);
    if (cwd && samePath(cwd, projectDir)) return filePath;
  }
  return null;
}

function main() {
  const projectDir = process.cwd();
  const transcriptPath = transcriptFromArgs(process.argv.slice(2))
    || latestTranscript(projectDir);
  if (!transcriptPath) return 0;

  try {
    const result = sweepPiTranscript({ projectDir, transcriptPath });
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
