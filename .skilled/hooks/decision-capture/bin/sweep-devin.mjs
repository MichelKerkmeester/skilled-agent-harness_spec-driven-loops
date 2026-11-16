#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Devin CLI Transcript Decision Sweep
// ───────────────────────────────────────────────────────────────────
// Recover Devin's answered questions into the queue.
// Backstop for the decision queue.
//
// Devin keeps a question call on the step that asked and puts the answer in that
// step's observation, so a sweep can replay both without a live hook. Only a
// result that carries the answered-questions envelope counts: a rejected call
// leaves prose there and must not become a queued decision. Deduplication belongs
// to the core, so a key an earlier producer wrote is skipped and running the sweep
// on every save stays safe.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import { homedir } from 'node:os';
import { basename, dirname, join } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import {
  appendRecords,
  normalizeAskUserQuestion,
  pendingRecords,
  readConsumedKeys,
} from '../lib/capture-core.mjs';
import { chatCandidatesFromTurns } from '../lib/chat-questions.mjs';

const require = createRequire(import.meta.url);

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const RUNTIME = 'devin';
const QUESTION_TOOL = 'ask_user_question';
const ANSWER_PREFIX = 'User answered your questions:';
const TRANSCRIPT_EXT = '.json';

// ─────────────────────────────────────────────────────────────────────────────
// 3. QUESTION CALLS
// ─────────────────────────────────────────────────────────────────────────────

// The input lives on the call and the answer arrives later under the same id, so
// the sweep remembers every question call until a matching result shows up. A call
// without an id cannot be paired and is dropped rather than guessed at.
function questionCalls(steps) {
  const calls = new Map();
  for (const step of steps) {
    const toolCalls = Array.isArray(step?.tool_calls) ? step.tool_calls : [];
    for (const call of toolCalls) {
      if (call?.function_name !== QUESTION_TOOL) continue;
      if (typeof call.tool_call_id !== 'string' || !call.tool_call_id) continue;
      calls.set(call.tool_call_id, call.arguments);
    }
  }
  return calls;
}

// Devin spells multi-select in snake case while the core reads camel case, so the
// questions are remapped before normalization rather than teaching the core a
// second spelling for one runtime.
function questionInput(callArguments) {
  const questions = Array.isArray(callArguments?.questions) ? callArguments.questions : [];
  return questions.map((item) => ({
    question: item?.question,
    header: item?.header,
    options: item?.options,
    multiSelect: Boolean(item?.multi_select),
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ANSWERS
// ─────────────────────────────────────────────────────────────────────────────

// A rejected call keeps the same result id but carries an error sentence, so the
// envelope prefix is the only signal that separates an answer from a refusal. A
// torn envelope parses to nothing instead of failing the whole sweep.
function parsedAnswers(content) {
  if (typeof content !== 'string' || !content.startsWith(ANSWER_PREFIX)) return null;
  const newline = content.indexOf('\n');
  if (newline === -1) return null;
  try {
    const parsed = JSON.parse(content.slice(newline + 1));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

// "Other" is a placeholder for what the operator typed, so the record keeps the
// typed wording instead of a label that says nothing. Several selections join the
// way the core joins any multi-select answer. A skipped or malformed entry yields
// no text, and no text means no record.
function answerText(value) {
  if (!value || typeof value !== 'object') return '';
  if (value.skipped === true) return '';
  if (!Array.isArray(value.selected)) return '';

  const custom = typeof value.custom_text === 'string' ? value.custom_text : '';
  return value.selected
    .filter((label) => typeof label === 'string' && label !== '')
    .map((label) => (label === 'Other' && custom !== '' ? custom : label))
    .join(', ');
}

function answersOf(parsed) {
  const answers = {};
  for (const [question, value] of Object.entries(parsed)) {
    const answer = answerText(value);
    if (answer) answers[question] = answer;
  }
  return answers;
}

export function devinAnswerRecords({ transcript, sessionId, now } = {}) {
  const steps = Array.isArray(transcript?.steps) ? transcript.steps : [];
  const calls = questionCalls(steps);
  const records = [];

  for (const step of steps) {
    const results = Array.isArray(step?.observation?.results) ? step.observation.results : [];
    for (const result of results) {
      const toolUseId = result?.source_call_id;
      if (!calls.has(toolUseId)) continue;

      const parsed = parsedAnswers(result.content);
      if (!parsed) continue;
      const answers = answersOf(parsed);
      const questions = questionInput(calls.get(toolUseId));

      records.push(...normalizeAskUserQuestion({
        runtime: RUNTIME,
        sessionId,
        toolUseId,
        toolInput: { questions },
        toolResponse: { answers },
        source: 'transcript',
        now,
      }));
    }
  }

  return records;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CHAT CANDIDATES
// ─────────────────────────────────────────────────────────────────────────────

// A step becomes at most one chat turn. An agent step that called a tool is
// recorded as a bare tool turn because the detector refuses to pair a question
// across it: real work between asking and answering means the answer may not
// belong to the question the sweep can see. A system step is never a turn at
// all, so harness boilerplate cannot pass for something the operator said, and
// a user step that opens with '<' is an injected block for the same reason.
function chatTurnsOf(steps) {
  const turns = [];

  for (const step of steps) {
    const toolCalls = Array.isArray(step?.tool_calls) ? step.tool_calls : [];
    const message = step?.message;

    if (step?.source === 'agent') {
      if (toolCalls.length > 0) {
        turns.push({ kind: 'tool' });
        continue;
      }
      if (typeof message === 'string' && message !== '') {
        turns.push({ kind: 'assistant', id: String(step.step_id), text: message });
      }
      continue;
    }

    if (step?.source !== 'user') continue;
    if (typeof message !== 'string' || message === '') continue;
    if (!message.startsWith('<')) {
      turns.push({ kind: 'prompt', id: String(step.step_id), text: message });
    }
  }

  return turns;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. SWEEP
// ─────────────────────────────────────────────────────────────────────────────

// Devin keeps a session's messages in `message_nodes`, one JSON message per row,
// and writes the transcript file only when an interactive session ends. The rows
// are rebuilt into the transcript's step shape so the answer and chat readers
// serve both sources. A message can be stored twice with only its metadata
// changed, so each message id is kept once.
export function databaseTranscript(dbPath, sessionId) {
  const database = openDatabase(dbPath);
  try {
    const rows = database
      .prepare('SELECT node_id, chat_message FROM message_nodes WHERE session_id = ? ORDER BY row_id')
      .all(sessionId);
    const steps = [];
    const seen = new Set();
    for (const row of rows) {
      let message;
      try {
        message = JSON.parse(row.chat_message);
      } catch {
        continue;
      }
      if (!message || typeof message !== 'object') continue;
      if (typeof message.message_id === 'string') {
        if (seen.has(message.message_id)) continue;
        seen.add(message.message_id);
      }
      const text = typeof message.content === 'string' ? message.content : '';
      if (message.role === 'tool') {
        steps.push({
          step_id: row.node_id,
          source: 'tool',
          observation: { results: [{ source_call_id: message.tool_call_id, content: text }] },
        });
      } else if (message.role === 'assistant') {
        const toolCalls = (Array.isArray(message.tool_calls) ? message.tool_calls : []).map((call) => ({
          tool_call_id: call?.id,
          function_name: call?.name,
          arguments: call?.arguments,
        }));
        steps.push({ step_id: row.node_id, source: 'agent', message: text, tool_calls: toolCalls });
      } else if (message.role === 'user') {
        steps.push({ step_id: row.node_id, source: 'user', message: text });
      }
    }
    return { session_id: sessionId, steps };
  } finally {
    database.close();
  }
}

// The file name carries the session id, so a transcript without a declared id
// still gets a stable identity for its queue file.
function sessionIdOf(transcript, transcriptPath) {
  if (typeof transcript?.session_id === 'string' && transcript.session_id) {
    return transcript.session_id;
  }
  return basename(transcriptPath).replace(/\.json$/, '');
}

export function sweepDevinTranscript({ projectDir, transcriptPath, transcript: loaded, now } = {}) {
  const transcript = loaded ?? JSON.parse(readFileSync(transcriptPath, 'utf8'));
  const sessionId = sessionIdOf(transcript, transcriptPath);
  const capturedAt = now || new Date().toISOString();
  const steps = Array.isArray(transcript?.steps) ? transcript.steps : [];

  const { appended } = appendRecords(
    projectDir,
    sessionId,
    devinAnswerRecords({ transcript, sessionId, now: capturedAt }),
  );
  const { candidates: chatCandidates, dropped: chatCandidatesDropped } = chatCandidatesFromTurns({
    runtime: RUNTIME,
    sessionId,
    turns: chatTurnsOf(steps),
    consumed: readConsumedKeys(projectDir),
  });

  return {
    transcript: transcriptPath,
    session_id: sessionId,
    recovered: appended,
    pending: pendingRecords(projectDir, sessionId),
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

// The ids of this process and every process above it. A runtime that holds a
// session's lock is an ancestor of the shell it runs the save in.
function ancestorPids() {
  const parents = new Map();
  try {
    const table = execFileSync('ps', ['-A', '-o', 'pid=,ppid='], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 5000,
    });
    for (const line of table.split('\n')) {
      const [pid, ppid] = line.trim().split(/\s+/).map(Number);
      if (pid) parents.set(pid, ppid);
    }
  } catch {
    return new Set();
  }
  const ancestors = new Set();
  for (let pid = process.pid; pid > 1 && !ancestors.has(pid); pid = parents.get(pid)) ancestors.add(pid);
  return ancestors;
}

// Devin writes each live session's process id into `session_locks/<id>.lock`. A
// lock whose process this command descends from names the calling session.
function callerSessionIds(dataDir) {
  const ancestors = ancestorPids();
  const lockDir = join(dataDir, 'session_locks');
  let fileNames;
  try {
    fileNames = readdirSync(lockDir);
  } catch {
    return [];
  }
  const ids = [];
  for (const fileName of fileNames) {
    if (!fileName.endsWith('.lock')) continue;
    try {
      const pid = Number.parseInt(readFileSync(join(lockDir, fileName), 'utf8').trim(), 10);
      if (ancestors.has(pid)) ids.push(fileName.slice(0, -'.lock'.length));
    } catch {
      // A lock removed mid-scan names no session.
    }
  }
  return ids;
}

// Devin keys a session by the directory it ran in, and only the newest matching
// row can be the session a save is resuming. The database is opened read-only
// because a sweep must never write to Devin's own state.
// The live Devin adapter imports this file for its answer mapping, and on Node 22
// and 24 loading node:sqlite prints an experimental warning to stderr, which the
// adapter's silent-success contract forbids, so the driver loads only here.
function openDatabase(dbPath) {
  const { DatabaseSync } = require('node:sqlite');
  return new DatabaseSync(dbPath, { readOnly: true });
}

// Devin records the directory it was started in, which can be the symlinked
// spelling of the real path this process sees.
function projectSpellings(projectDir) {
  const spellings = new Set([projectDir]);
  for (const candidate of [projectDir, process.env.PWD]) {
    if (!candidate) continue;
    try {
      if (realpathSync(candidate) === realpathSync(projectDir)) {
        spellings.add(candidate);
        spellings.add(realpathSync(candidate));
      }
    } catch {
      continue;
    }
  }
  return [...spellings];
}

function latestTranscript(projectDir) {
  const dataDir = join(
    process.env.XDG_DATA_HOME || join(homedir(), '.local', 'share'),
    'devin',
    'cli',
  );
  const database = openDatabase(join(dataDir, 'sessions.db'));

  try {
    const spellings = projectSpellings(projectDir);
    // A stale lock can carry a reused process id, so a caller's session must
    // also have run in this project. Without one, the newest session stands.
    const callerIds = callerSessionIds(dataDir);
    const callerRow = callerIds.length > 0
      ? database
        .prepare(
          `SELECT id FROM sessions WHERE id IN (${callerIds.map(() => '?').join(', ')}) AND working_directory IN (${spellings.map(() => '?').join(', ')}) ORDER BY last_activity_at DESC LIMIT 1`,
        )
        .get(...callerIds, ...spellings)
      : undefined;
    const row = callerRow ?? database
      .prepare(
        `SELECT id FROM sessions WHERE working_directory IN (${spellings.map(() => '?').join(', ')}) ORDER BY last_activity_at DESC LIMIT 1`,
      )
      .get(...spellings);
    if (typeof row?.id !== 'string' || !row.id) return null;
    return join(dataDir, 'transcripts', `${row.id}${TRANSCRIPT_EXT}`);
  } finally {
    database.close();
  }
}

function main() {
  const projectDir = process.cwd();

  let explicitPath;
  let transcriptPath;
  try {
    explicitPath = transcriptFromArgs(process.argv.slice(2));
    transcriptPath = explicitPath || latestTranscript(projectDir);
  } catch (error) {
    process.stdout.write(
      `${JSON.stringify({ error: error?.message || 'cannot read devin sessions' }, null, 2)}\n`,
    );
    return 1;
  }

  if (!transcriptPath) {
    process.stdout.write(
      `${JSON.stringify({ error: `no transcript found for ${projectDir}` }, null, 2)}\n`,
    );
    return 1;
  }

  // A live session has no transcript file yet, so the save reads its message
  // store, or failing that still gets the answers the live hook queued.
  if (!explicitPath && !existsSync(transcriptPath)) {
    const sessionId = basename(transcriptPath, TRANSCRIPT_EXT);
    const dbPath = join(dirname(dirname(transcriptPath)), 'sessions.db');
    try {
      const result = sweepDevinTranscript({
        projectDir,
        transcriptPath: dbPath,
        transcript: databaseTranscript(dbPath, sessionId),
      });
      process.stdout.write(`${JSON.stringify({ ...result, transcript_missing: true }, null, 2)}\n`);
      return 0;
    } catch {
      // A store without the message table still yields the answers the hook queued.
    }
    process.stdout.write(`${JSON.stringify({
      transcript: null,
      transcript_missing: true,
      session_id: sessionId,
      recovered: 0,
      pending: pendingRecords(projectDir, sessionId),
      chat_candidates: [],
      chat_candidates_dropped: 0,
    }, null, 2)}\n`);
    return 0;
  }

  try {
    const result = sweepDevinTranscript({ projectDir, transcriptPath });
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return 0;
  } catch (error) {
    process.stdout.write(
      `${JSON.stringify({ error: error?.message || `cannot read ${transcriptPath}` }, null, 2)}\n`,
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
