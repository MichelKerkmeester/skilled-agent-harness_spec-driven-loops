// ───────────────────────────────────────────────────────────────────
// MODULE: Operator Decision Capture Queue
// ───────────────────────────────────────────────────────────────────
// Normalize answers into deduplicated, lock-appended queue rows.
// Runtime-neutral core for the local decision queue.
//
// Two producers feed this queue: a runtime adapter that sees a question tool's
// result as it happens, and a transcript sweep that recovers what the adapter
// missed. Both hand the same normalized shape to appendRecords, so the save step
// reads one file format regardless of where an answer came from. Answers are kept
// byte-exact: a decision record quotes the operator's own wording, and trimming or
// rewriting it would quietly change what they agreed to.
//
// PROJECT ROOT LOCALITY -- state follows the real Git root, or the real path of
// a non-Git directory, so calls from different working directories in one project
// agree on a path without depending on the process working directory. Appends
// serialize on a lock directory, and stale locks are reclaimed by age.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  appendFileSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  rmdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export const QUEUE_RELATIVE_DIR = '.skilled/skills/.state/decision-capture';

const CONSUMED_FILE = 'consumed.jsonl';
const LOCK_SUBDIR = '.locks';
// A holder that dies mid-append never removes its lock directory, so the next
// writer reclaims one by age. Two minutes is far longer than writing one line.
const LOCK_STALE_MS = 120_000;
const LOCK_RETRY_MS = 10;
const LOCK_TIMEOUT_MS = 10_000;
const LOCK_WAIT_BUFFER = new Int32Array(new SharedArrayBuffer(4));

// ─────────────────────────────────────────────────────────────────────────────
// 3. IDENTITY KEYS
// ─────────────────────────────────────────────────────────────────────────────

// The decision-record writer accepts only these characters in a source key, and
// runtimes mint ids outside them: Devin's call ids carry `#`. Every producer
// builds keys here, so a hook and a save-time reader still agree on one key.
const KEY_UNSAFE = /[^A-Za-z0-9:._-]/g;

function keyPart(value) {
  return String(value).replace(KEY_UNSAFE, '.');
}

// A tool answer is identified by the call that asked and the position within it,
// because one call can carry several questions.
export function toolSourceKey(runtime, sessionId, toolUseId, questionIndex) {
  return [runtime, sessionId, toolUseId, questionIndex].map(keyPart).join(':');
}

/**
 * Keeps chat-answer keys separate from tool keys and from other questions in one turn.
 *
 * @param {string} runtime Runtime that produced the chat question.
 * @param {string} sessionId Transcript session identity.
 * @param {string} questionTurnId Assistant turn that asked the question.
 * @param {string} answerTurnId User turn that answered the question.
 * @param {string} [segment] Optional identity segment for an additional question.
 * @returns {string} Stable source key.
 */
export function chatSourceKey(runtime, sessionId, questionTurnId, answerTurnId, segment) {
  const key = [runtime, sessionId, 'chat', questionTurnId, answerTurnId].map(keyPart).join(':');
  return segment ? key + ':' + keyPart(segment) : key;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PROCESS FILTER
// ─────────────────────────────────────────────────────────────────────────────

// A process question asks how the session itself should run: which documentation
// scope, which workspace, or whether to ship. Keeping one would fill a decision
// record with bookkeeping the next reader cannot act on, so the filter answers
// before a record is built rather than at display time.
//
// The offered choices are the strongest signal. A product question can mention
// Gate 3 or commit permission as its subject, as a question about which questions
// to record does, while a real process question offers the scope menu, a worktree
// or branch choice, or a commit or push action. The question text only counts for
// a direct ask for permission, so a question about the process stays a decision.
// A commit or push option needs a question about shipping as well, because a
// work-item menu can list a commit among the tasks it offers.
const PROCESS_HEADER = /\bgate\s*3\b|\bspec[\s-]?folder\b|\bpacket folder\b|\bworktree\b/i;
const SCOPE_TEXT = /\bspec[\s-]?folder\b|\bpacket folder\b/i;
// The fixed wording the gate rules prescribe for asking the documentation question.
const GATE_PHRASE = /\bneed to ask about documentation\b/i;
const PERMISSION_TEXT = /\b(may|can|shall|should) (i|we) (commit|push)\b|\b(ok|okay) to (commit|push)\b|\bpermission to (commit|push)\b/i;
const SCOPE_OPTION = /^[A-D]\)\s*(Existing|New|Related|Skip)\b|^new (packet|spec folder)\b/i;
const WORKSPACE_OPTION = /\bworktree\b|\b(current|new|feature) branch\b/i;
const SHIP_OPTION = /^(commit|push)\b/i;
const SHIP_TEXT = /\b(commit|push)/i;

export function isProcessQuestion({ question, header, options } = {}) {
  const questionText = textOf(question);
  if (PROCESS_HEADER.test(textOf(header))) return true;
  if (SCOPE_TEXT.test(questionText) || PERMISSION_TEXT.test(questionText)) return true;
  if (GATE_PHRASE.test(questionText)) return true;

  const aboutShipping = SHIP_TEXT.test(questionText) || SHIP_TEXT.test(textOf(header));
  return optionLabels(options).some(
    (label) => SCOPE_OPTION.test(label)
      || WORKSPACE_OPTION.test(label)
      || (aboutShipping && SHIP_OPTION.test(label)),
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. NORMALIZATION
// ─────────────────────────────────────────────────────────────────────────────

// Anything that does not resemble a real payload yields no records: a hook that
// misreads a newer shape must stay silent rather than invent an answer.
export function normalizeAskUserQuestion({
  runtime,
  sessionId,
  toolUseId,
  toolInput,
  toolResponse,
  source,
  now,
} = {}) {
  const inputQuestions = Array.isArray(toolInput?.questions) ? toolInput.questions : null;
  const responseQuestions = Array.isArray(toolResponse?.questions) ? toolResponse.questions : null;
  const questions = inputQuestions || responseQuestions;
  const answers = toolResponse?.answers;
  if (!questions || !answers || typeof answers !== 'object' || Array.isArray(answers)) return [];

  const records = [];
  for (let index = 0; index < questions.length; index += 1) {
    const item = questions[index];
    if (!item || typeof item !== 'object') continue;

    const question = textOf(item.question);
    if (!question) continue;

    // Answers are keyed by the exact question text, so a lookup has to preserve
    // every byte of it; there is no loose matching to fall back on.
    const answer = answerText(
      Object.prototype.hasOwnProperty.call(answers, question) ? answers[question] : undefined,
    );
    if (!answer) continue;

    const header = textOf(item.header);
    const options = optionLabels(item.options);
    if (isProcessQuestion({ question, header, options })) continue;

    records.push({
      key: toolSourceKey(runtime, sessionId, toolUseId, index),
      kind: 'tool',
      runtime,
      session_id: sessionId,
      tool_use_id: toolUseId,
      question_index: index,
      question,
      header,
      options,
      multi_select: Boolean(item.multiSelect),
      answer,
      source: source || 'hook',
      captured_at: now || new Date().toISOString(),
    });
  }
  return records;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function textOf(value) {
  return typeof value === 'string' ? value : '';
}

// Option labels are what a decision record reproduces; descriptions are context
// the question already carries and would only bloat the queue.
function optionLabels(options) {
  if (!Array.isArray(options)) return [];
  return options.map((option) => {
    if (typeof option === 'string') return option;
    return textOf(option?.label);
  });
}

function answerText(value) {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.join(', ');
  return '';
}

// A session id can hold characters a filename should not, so the file name is its
// hex form and stays stable for the same id across producers.
function sessionToken(sessionId) {
  return Buffer.from(String(sessionId), 'utf8').toString('hex');
}

// A torn line from a killed process, or a hand edit, must not fail a hook. Rows
// that parse to something other than an object are ignored the same way.
function readJsonLines(filePath) {
  let raw;
  try {
    raw = readFileSync(filePath, 'utf8');
  } catch {
    return [];
  }
  const rows = [];
  for (const line of raw.split('\n')) {
    if (!line.trim()) continue;
    try {
      const parsed = JSON.parse(line);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) rows.push(parsed);
    } catch {
      // Unparseable line: skip it rather than lose every other captured answer.
    }
  }
  return rows;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. PATHS
// ─────────────────────────────────────────────────────────────────────────────

const canonicalRoots = new Map();

function canonicalRoot(dir) {
  const input = String(dir);
  if (canonicalRoots.has(input)) return canonicalRoots.get(input);

  let root;
  try {
    const env = { ...process.env };
    delete env.GIT_DIR;
    delete env.GIT_WORK_TREE;
    root = realpathSync(execFileSync('git', ['rev-parse', '--show-toplevel'], {
      cwd: input,
      env,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 5000,
    }).trim());
  } catch {
    try {
      root = realpathSync(input);
    } catch {
      root = resolve(input);
    }
  }

  canonicalRoots.set(input, root);
  return root;
}

export function projectToken(dir) {
  return createHash('sha256').update(canonicalRoot(dir)).digest('hex').slice(0, 12);
}

export function queueDir(projectDir) {
  const root = canonicalRoot(projectDir);
  return join(root, QUEUE_RELATIVE_DIR, projectToken(projectDir));
}

function legacyDir(projectDir) {
  return join(canonicalRoot(projectDir), QUEUE_RELATIVE_DIR);
}

export function queueFile(projectDir, sessionId) {
  return join(queueDir(projectDir), `${sessionToken(sessionId)}.jsonl`);
}

function nudgeFile(projectDir, sessionId) {
  return join(queueDir(projectDir), `${sessionToken(sessionId)}.nudge`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. LOCKING
// ─────────────────────────────────────────────────────────────────────────────

// An append is read-existing-keys then write-new-keys, so two producers racing on
// one session would otherwise both see the same key as new and write it twice.
// mkdir is the atomic test-and-set: it either creates the directory or fails with
// EEXIST, with no window between the check and the acquisition.
function withQueueLock(projectDir, sessionId, operation) {
  const lockRoot = join(queueDir(projectDir), LOCK_SUBDIR);
  mkdirSync(lockRoot, { recursive: true, mode: 0o700 });
  const lockPath = join(lockRoot, `${sessionToken(sessionId)}.lock`);
  const deadlineMs = Date.now() + LOCK_TIMEOUT_MS;

  while (true) {
    try {
      mkdirSync(lockPath, { mode: 0o700 });
      break;
    } catch (error) {
      if (error?.code !== 'EEXIST') throw error;
    }

    try {
      if (Date.now() - statSync(lockPath).mtimeMs > LOCK_STALE_MS) {
        rmdirSync(lockPath);
        continue;
      }
    } catch (error) {
      if (error?.code === 'ENOENT') continue;
    }

    if (Date.now() >= deadlineMs) {
      throw new Error('decision-capture: timed out waiting for the queue lock');
    }
    Atomics.wait(LOCK_WAIT_BUFFER, 0, 0, LOCK_RETRY_MS);
  }

  try {
    return operation();
  } finally {
    try {
      rmdirSync(lockPath);
    } catch {
      // A stale-lock reaper on another process may already have removed it.
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. QUEUE FILES
// ─────────────────────────────────────────────────────────────────────────────

// Returns counts instead of throwing so a caller can log a deduplicated batch
// without treating a repeated capture as an error. An empty batch touches nothing,
// which keeps a no-answer turn from creating state at all.
export function appendRecords(projectDir, sessionId, records) {
  if (!Array.isArray(records) || records.length === 0) return { appended: 0, skipped: 0 };

  const filePath = queueFile(projectDir, sessionId);
  mkdirSync(queueDir(projectDir), { recursive: true, mode: 0o700 });

  return withQueueLock(projectDir, sessionId, () => {
    const seen = new Set([
      ...readQueue(projectDir, sessionId).map((record) => textOf(record.key)),
      ...readConsumedKeys(projectDir),
    ]);
    const lines = [];
    let skipped = 0;

    for (const record of records) {
      const key = textOf(record?.key);
      if (!key || seen.has(key)) {
        skipped += 1;
        continue;
      }
      seen.add(key);
      lines.push(`${JSON.stringify(record)}\n`);
    }

    if (lines.length > 0) appendFileSync(filePath, lines.join(''), { mode: 0o600 });
    return { appended: lines.length, skipped };
  });
}

export function readQueue(projectDir, sessionId) {
  const fileName = `${sessionToken(sessionId)}.jsonl`;
  const records = [
    ...readJsonLines(join(queueDir(projectDir), fileName)),
    ...readJsonLines(join(legacyDir(projectDir), fileName)),
  ];
  const keys = new Set();
  return records.filter((record) => {
    const key = textOf(record.key);
    if (!key) return true;
    if (keys.has(key)) return false;
    keys.add(key);
    return true;
  });
}

// Consumption is the save step's record that a key became a decision entry. It
// lives beside the queue rather than inside it so a re-save can prove what it
// already wrote without the queue growing a second record per answer.
export function readConsumedKeys(projectDir) {
  const keys = new Set();
  for (const directory of [queueDir(projectDir), legacyDir(projectDir)]) {
    for (const row of readJsonLines(join(directory, CONSUMED_FILE))) {
      const key = textOf(row.key);
      if (key) keys.add(key);
    }
  }
  return keys;
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. PENDING STATE
// ─────────────────────────────────────────────────────────────────────────────

export function pendingRecords(projectDir, sessionId) {
  const consumed = readConsumedKeys(projectDir);
  return readQueue(projectDir, sessionId).filter((record) => !consumed.has(record.key));
}

// The session-end nudge reports a count once, not on every turn. The previous
// reported count is the cursor: a new answer raises it, and a save that consumes
// answers lowers it, so the next increase is what deserves a fresh nudge. A count
// of zero resets a cursor an earlier turn left raised, and writes nothing when no
// cursor exists, so a session that never captured an answer leaves no state behind.
export function takeNudge(projectDir, sessionId) {
  const count = pendingRecords(projectDir, sessionId).length;
  const filePath = nudgeFile(projectDir, sessionId);

  let previous = 0;
  try {
    const parsed = Number.parseInt(readFileSync(filePath, 'utf8'), 10);
    if (Number.isFinite(parsed)) previous = parsed;
  } catch {
    // No previous report: every pending record is new.
  }

  if (count === 0) {
    if (previous !== 0) writeNudge(filePath, 0);
    return 0;
  }
  if (count > previous) {
    writeNudge(filePath, count);
    return count;
  }
  // A save that consumed only part of the queue leaves a smaller count. Keeping
  // the old peak would hide every answer captured until the count passed it.
  if (count < previous) writeNudge(filePath, count);
  return 0;
}

function writeNudge(filePath, value) {
  mkdirSync(dirname(filePath), { recursive: true, mode: 0o700 });
  writeFileSync(filePath, String(value), { mode: 0o600 });
}
