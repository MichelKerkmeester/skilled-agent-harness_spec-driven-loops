#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Claude Transcript Decision Sweep                              ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Recover missed answers and list plain-chat candidates.          ║
// ╚══════════════════════════════════════════════════════════════════════════╝
// Backstop for the decision queue.
//
// The PostToolUse adapter sees a question only while its hook is registered and
// only when the runtime hands it the answer. A transcript still holds every
// answered call, so this sweep replays them at save time and appends what the
// hook missed. Deduplication belongs to the core: a key the hook already wrote
// is skipped, which is what makes running the sweep on every save safe.
//
// A plain chat question leaves no tool result to replay. The sweep only pairs an
// assistant question with the next typed prompt and offers the pair as a
// candidate; the save step decides whether it becomes a decision entry.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, readdirSync, realpathSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, join } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import {
  appendRecords,
  chatSourceKey,
  isProcessQuestion,
  normalizeAskUserQuestion,
  pendingRecords,
  readConsumedKeys,
} from '../lib/capture-core.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const RUNTIME = 'claude';
const QUESTION_TOOL = 'AskUserQuestion';
const TRANSCRIPT_EXT = '.jsonl';

// A paragraph ends at a blank line, and a run of blank lines is still one break.
const PARAGRAPH_BREAK = /(?:\r?\n[ \t]*){2,}/;
// The gate rules offer lettered choices; those letters are what the process
// filter reads, so the sweep has to hand them over the way the tool would.
const OPTION_LINE = /^\s*(?:[-*]\s+)?(?:\*\*)?[A-D]\)/;
const OPTION_MARKER = /^\s*(?:[-*]\s+)?(?:\*\*)?/;

// ─────────────────────────────────────────────────────────────────────────────
// 3. TRANSCRIPT LINES
// ─────────────────────────────────────────────────────────────────────────────

// A killed process leaves a torn final line, and a sidechain is a sub-agent's own
// conversation: neither belongs to the operator's turn sequence. Both are skipped
// rather than failing the sweep, because a partial backfill still beats none.
function readLines(transcriptPath) {
  const raw = readFileSync(transcriptPath, 'utf8');
  const entries = [];
  for (const line of raw.split('\n')) {
    if (!line.trim()) continue;
    let parsed;
    try {
      parsed = JSON.parse(line);
    } catch {
      continue;
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) continue;
    if (parsed.isSidechain === true) continue;
    entries.push(parsed);
  }
  return entries;
}

function sessionIdOf(entries, transcriptPath) {
  const declared = entries[0]?.sessionId;
  if (typeof declared === 'string' && declared) return declared;
  // The file name carries the session id in every transcript directory seen so
  // far, so a header-less file still gets a stable identity for its queue file.
  return basename(transcriptPath).replace(/\.jsonl$/, '');
}

function blocksOf(entry) {
  const content = entry?.message?.content;
  return Array.isArray(content)
    ? content.filter((block) => block && typeof block === 'object')
    : [];
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TOOL ANSWERS
// ─────────────────────────────────────────────────────────────────────────────

// The tool input lives on the assistant turn that asked, while the answer arrives
// on a later user turn, so the sweep has to remember the call until its result
// shows up. Only a result that carries an answers object is a real answer: a
// cancelled or interrupted call keeps its tool_use id and answers nothing.
function answeredToolRecords({ entries, sessionId, now }) {
  const calls = new Map();
  const records = [];

  for (const entry of entries) {
    const blocks = blocksOf(entry);

    if (entry?.type === 'assistant') {
      for (const block of blocks) {
        if (block.type === 'tool_use' && block.name === QUESTION_TOOL && block.id) {
          calls.set(block.id, block.input);
        }
      }
      continue;
    }

    if (entry?.type !== 'user') continue;
    for (const block of blocks) {
      if (block.type !== 'tool_result' || !calls.has(block.tool_use_id)) continue;

      records.push(...normalizeAskUserQuestion({
        runtime: RUNTIME,
        sessionId,
        toolUseId: block.tool_use_id,
        toolInput: calls.get(block.tool_use_id),
        toolResponse: entry.toolUseResult,
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

// A typed prompt is the only thing that answers a chat question. Tool results,
// meta notes and compaction summaries all arrive as user turns, and harness
// reminders start with a tag, so none of them count as the operator typing.
function typedPrompt(entry) {
  if (entry?.type !== 'user') return null;
  if (entry.isMeta === true || entry.isCompactSummary === true) return null;

  const content = entry?.message?.content;
  let text;
  if (typeof content === 'string') {
    text = content;
  } else if (Array.isArray(content)) {
    const parts = content.filter(
      (block) => block?.type === 'text' && typeof block.text === 'string',
    );
    if (parts.length === 0) return null;
    text = parts.map((block) => block.text).join('\n');
  } else {
    return null;
  }

  if (!text || text.startsWith('<')) return null;
  return text;
}

// The closing paragraph is the question; earlier paragraphs are the reasoning
// that led to it, and quoting all of them would bury what was actually asked.
// The paragraph is returned untouched so the record reproduces it byte for byte.
function lastParagraph(text) {
  const paragraphs = text
    .split(PARAGRAPH_BREAK)
    .filter((paragraph) => paragraph.trim() !== '');
  return paragraphs.at(-1) ?? '';
}

function optionLabelsOf(paragraph) {
  return paragraph
    .split('\n')
    .filter((line) => OPTION_LINE.test(line))
    .map((line) => line.replace(OPTION_MARKER, ''));
}

function chatCandidate({ sessionId, lastText, answer, answerTurnId, consumed }) {
  const paragraph = lastParagraph(lastText.text);
  if (!paragraph.includes('?')) return null;

  const options = optionLabelsOf(paragraph);
  if (isProcessQuestion({ question: paragraph, header: '', options })) return null;

  // An unanswered question has no second turn, so it has no identity to dedupe
  // against and must stay a fresh candidate on every sweep until it is answered.
  const key = answerTurnId
    ? chatSourceKey(RUNTIME, sessionId, lastText.uuid, answerTurnId)
    : null;
  if (key && consumed.has(key)) return null;

  return {
    key,
    kind: 'chat',
    question: paragraph,
    answer,
    question_turn_id: lastText.uuid,
    answer_turn_id: answerTurnId,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. SWEEP
// ─────────────────────────────────────────────────────────────────────────────

export function sweepTranscript({ projectDir, transcriptPath, now } = {}) {
  const entries = readLines(transcriptPath);
  const sessionId = sessionIdOf(entries, transcriptPath);
  const capturedAt = now || new Date().toISOString();

  const { appended } = appendRecords(
    projectDir,
    sessionId,
    answeredToolRecords({ entries, sessionId, now: capturedAt }),
  );
  const pending = pendingRecords(projectDir, sessionId);
  const consumed = readConsumedKeys(projectDir);

  const chatCandidates = [];
  let lastText = null;

  for (const entry of entries) {
    const blocks = blocksOf(entry);

    if (entry?.type === 'assistant') {
      // A later tool call means the text before it did not close the turn, so it
      // cannot be the question that a typed reply answers.
      if (blocks.some((block) => block.type === 'tool_use')) {
        lastText = null;
        continue;
      }
      const parts = blocks.filter(
        (block) => block.type === 'text' && typeof block.text === 'string',
      );
      if (parts.length > 0) {
        lastText = { uuid: entry.uuid, text: parts.map((block) => block.text).join('\n') };
      }
      continue;
    }

    const typed = typedPrompt(entry);
    if (typed === null) continue;

    if (lastText) {
      const candidate = chatCandidate({
        sessionId,
        lastText,
        answer: typed,
        answerTurnId: entry.uuid,
        consumed,
      });
      if (candidate) chatCandidates.push(candidate);
    }
    lastText = null;
  }

  // A question left at the end of the file was never answered in this session.
  if (lastText) {
    const candidate = chatCandidate({
      sessionId,
      lastText,
      answer: null,
      answerTurnId: null,
      consumed,
    });
    if (candidate) chatCandidates.push(candidate);
  }

  return {
    transcript: transcriptPath,
    session_id: sessionId,
    recovered: appended,
    pending,
    chat_candidates: chatCandidates,
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

// Claude stores each project's transcripts under a directory named after the
// project path with every separator flattened, so the newest file there is the
// session a save without an explicit path is most likely to be resuming.
function latestTranscript(projectDir) {
  const transcriptDir = join(
    homedir(),
    '.claude',
    'projects',
    projectDir.replace(/[^A-Za-z0-9]/g, '-'),
  );

  let names;
  try {
    names = readdirSync(transcriptDir);
  } catch {
    return null;
  }

  let newest = null;
  let newestMs = -Infinity;
  for (const name of names) {
    if (!name.endsWith(TRANSCRIPT_EXT)) continue;
    const filePath = join(transcriptDir, name);
    let modifiedMs;
    try {
      modifiedMs = statSync(filePath).mtimeMs;
    } catch {
      continue;
    }
    if (modifiedMs > newestMs) {
      newestMs = modifiedMs;
      newest = filePath;
    }
  }
  return newest;
}

function main() {
  const projectDir = process.cwd();
  const transcriptPath = transcriptFromArgs(process.argv.slice(2)) || latestTranscript(projectDir);

  if (!transcriptPath) {
    process.stdout.write(
      `${JSON.stringify({ error: `no transcript found for ${projectDir}` }, null, 2)}\n`,
    );
    return 1;
  }

  try {
    const result = sweepTranscript({ projectDir, transcriptPath });
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
