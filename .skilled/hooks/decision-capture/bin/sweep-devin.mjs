#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Devin CLI Transcript Decision Sweep                           ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Recover Devin's answered questions into the queue.              ║
// ╚══════════════════════════════════════════════════════════════════════════╝
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

import { readFileSync, realpathSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, join } from 'node:path';
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
// 5. SWEEP
// ─────────────────────────────────────────────────────────────────────────────

// The file name carries the session id, so a transcript without a declared id
// still gets a stable identity for its queue file.
function sessionIdOf(transcript, transcriptPath) {
  if (typeof transcript?.session_id === 'string' && transcript.session_id) {
    return transcript.session_id;
  }
  return basename(transcriptPath).replace(/\.json$/, '');
}

export function sweepDevinTranscript({ projectDir, transcriptPath, now } = {}) {
  const transcript = JSON.parse(readFileSync(transcriptPath, 'utf8'));
  const sessionId = sessionIdOf(transcript, transcriptPath);
  const capturedAt = now || new Date().toISOString();

  const { appended } = appendRecords(
    projectDir,
    sessionId,
    devinAnswerRecords({ transcript, sessionId, now: capturedAt }),
  );

  return {
    transcript: transcriptPath,
    session_id: sessionId,
    recovered: appended,
    pending: pendingRecords(projectDir, sessionId),
    chat_candidates: [],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. CLI
// ─────────────────────────────────────────────────────────────────────────────

function transcriptFromArgs(argv) {
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === '--transcript' && argv[index + 1]) return argv[index + 1];
  }
  return null;
}

// Devin keys a session by the directory it ran in, and only the newest matching
// row can be the session a save is resuming. The database is opened read-only
// because a sweep must never write to Devin's own state.
function latestTranscript(projectDir) {
  const dataDir = join(
    process.env.XDG_DATA_HOME || join(homedir(), '.local', 'share'),
    'devin',
    'cli',
  );
  const database = new DatabaseSync(join(dataDir, 'sessions.db'), { readOnly: true });

  try {
    const row = database
      .prepare(
        'SELECT id FROM sessions WHERE working_directory = ? ORDER BY last_activity_at DESC LIMIT 1',
      )
      .get(projectDir);
    if (typeof row?.id !== 'string' || !row.id) return null;
    return join(dataDir, 'transcripts', `${row.id}${TRANSCRIPT_EXT}`);
  } finally {
    database.close();
  }
}

function main() {
  const projectDir = process.cwd();

  let transcriptPath;
  try {
    transcriptPath = transcriptFromArgs(process.argv.slice(2)) || latestTranscript(projectDir);
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
