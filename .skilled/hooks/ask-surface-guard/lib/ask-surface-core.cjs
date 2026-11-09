// ───────────────────────────────────────────────────────────────────
// MODULE: Ask Surface Core
// ───────────────────────────────────────────────────────────────────
// Runtime-neutral policy for the ask-surface guard. Each operator message is sent back at most once so every runtime asks through its question tool.
'use strict';

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

const { createHash } = require('node:crypto');
const { appendFileSync, mkdirSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const CONCERN = 'ask-surface';

// The question tool each runtime exposes, as the decision-capture sweeps
// record it. Pi carries two because two installed extensions provide one.
const QUESTION_TOOLS = Object.freeze({
  claude: ['AskUserQuestion'],
  codex: ['request_user_input'],
  devin: ['ask_user_question'],
  dsh: ['ask_user_question'],
  opencode: ['question'],
  pi: ['ask_user_question', 'question'],
});

// Numbered lines can be steps, so they need a closing question that asks the reader to choose.
// ceiling: dotted and multi-digit numeric menus count only when their question signals a choice.
const OPTION_LINE = /^\s*(?:[-*+]\s+)?(?:\*\*|__)?\(?(?:([A-Ha-h])[).:]|(\d+)[).])(?:\*\*|__)?\s+\S/;

// An option's description can wrap over several lines, so options in one
// menu may sit this many non-option lines apart.
const MAX_OPTION_GAP = 6;

// The menu has to close the message: after the last option, only its own
// wrapped description and a short closing line may follow.
const MAX_TRAILING_LINES = 6;

// The question may sit just above the menu instead of after it.
const QUESTION_LOOKBACK = 3;

// ───────────────────────────────────────────────────────────────────
// 3. TEXT NORMALIZATION
// ───────────────────────────────────────────────────────────────────

// Code, quotes, tables and headings can hold option-shaped lines or question
// marks that are not a question to the operator, so they leave the text
// before either test reads it.
function proseLines(text) {
  if (typeof text !== 'string' || !text.trim()) return [];
  const withoutFences = text.replace(/```[\s\S]*?(?:```|$)|~~~[\s\S]*?(?:~~~|$)/g, '\n');
  return withoutFences
    .split('\n')
    .map((line) => line.replace(/`[^`\n]*`/g, 'code'))
    .filter((line) => !/^\s*(?:>|\||#{1,6}\s)/.test(line))
    .map((line) => line.replace(/\s+$/, ''));
}

function optionLabel(line) {
  const match = OPTION_LINE.exec(line);
  if (!match) return null;
  return match[1] ? match[1].toUpperCase() : String(Number(match[2]));
}

function nextLabel(label) {
  if (/^\d+$/.test(label)) return String(Number(label) + 1);
  return String.fromCharCode(label.charCodeAt(0) + 1);
}

function asksForNumericChoice(question) {
  return /\b(?:which|pick|choose|option|prefer)\b|\bhow\s+(?:would|do)\s+you\s+(?:like|want)\b|\b\d+(?:\s*,\s*\d+)*(?:\s+(?:or|and)\s+\d+)\b/i.test(question);
}

// ───────────────────────────────────────────────────────────────────
// 4. DETECTION
// ───────────────────────────────────────────────────────────────────

/**
 * Find a closing prose option menu: two or more labelled options in sequence
 * at the end of the message, with a question just above or after them.
 *
 * @param {string} text - The last assistant message.
 * @returns {{labels: string[], question: string}|null} The menu, or null when none closes the message.
 */
function detectProseMenu(text) {
  const lines = proseLines(text);
  const nonBlank = [];
  lines.forEach((line, index) => { if (line.trim()) nonBlank.push(index); });
  if (nonBlank.length === 0) return null;

  // Walk back from the end to collect the closing run of options.
  const options = [];
  let gap = 0;
  for (let cursor = nonBlank.length - 1; cursor >= 0; cursor -= 1) {
    const label = optionLabel(lines[nonBlank[cursor]]);
    if (label === null) {
      gap += 1;
      if (options.length === 0 && gap > MAX_TRAILING_LINES) return null;
      if (options.length > 0 && gap > MAX_OPTION_GAP) break;
      continue;
    }
    if (options.length > 0 && nextLabel(label) !== options[0].label) break;
    options.unshift({ label, position: cursor });
    gap = 0;
  }

  if (options.length < 2) return null;
  if (options[0].label !== 'A' && options[0].label !== '1') return null;

  const firstPosition = options[0].position;
  const optionPositions = new Set(options.map((option) => option.position));
  for (let cursor = Math.max(0, firstPosition - QUESTION_LOOKBACK); cursor < nonBlank.length; cursor += 1) {
    if (optionPositions.has(cursor)) continue;
    const line = lines[nonBlank[cursor]];
    if (line.includes('?')) {
      if (/^\d+$/.test(options[0].label) && !asksForNumericChoice(line)) continue;
      return { labels: options.map((option) => option.label), question: line.trim() };
    }
  }
  return null;
}

/**
 * Decide whether a finished turn should be sent back.
 *
 * @param {object} turn - What the adapter read from the runtime.
 * @param {string} turn.lastMessage - The last assistant message.
 * @param {boolean} turn.askToolCalled - Whether the turn called the runtime's question tool.
 * @param {boolean} [turn.surfaceAvailable=true] - False where the session has no question tool.
 * @returns {{verdict: 'fire'|'pass', reason: string}} The verdict and why.
 */
function evaluateTurn({ lastMessage, askToolCalled, surfaceAvailable = true }) {
  if (surfaceAvailable === false) return { verdict: 'pass', reason: 'no-surface' };
  if (askToolCalled === true) return { verdict: 'pass', reason: 'tool-asked' };
  const menu = detectProseMenu(lastMessage);
  if (!menu) return { verdict: 'pass', reason: 'no-menu' };
  return { verdict: 'fire', reason: 'prose-menu' };
}

/**
 * The instruction sent back to the agent on a fire.
 *
 * @param {string} runtime - A key of QUESTION_TOOLS.
 * @returns {string} The re-prompt text.
 */
function repromptFor(runtime) {
  const tools = QUESTION_TOOLS[runtime] || [];
  const tool = tools.length > 0 ? tools.map((name) => `\`${name}\``).join(' or ') : 'your question tool';
  return [
    `[ask-surface] Your reply ended with a prose option menu. Ask that question through the ${tool} tool instead:`,
    'one question, the options as its choices, your recommendation marked first.',
    'Do not repeat the menu as prose.',
  ].join(' ');
}

// ───────────────────────────────────────────────────────────────────
// 5. PER-TURN MARKER
// ───────────────────────────────────────────────────────────────────

/**
 * Record that an operator message was sent back, so the guard prompts it at most once.
 * Runtimes with no re-entry flag of their own rely on this marker.
 *
 * @param {string} projectDir - Repository root, scoping the marker folder.
 * @param {string} turnKey - A key unique to one session's one operator message.
 * @param {string} [baseDir] - Marker root; the OS temp folder by default.
 * @returns {boolean} True the first time a turn is marked, false after.
 */
function markTurn(projectDir, turnKey, baseDir = tmpdir()) {
  const projectHash = createHash('sha256').update(String(projectDir)).digest('hex').slice(0, 12);
  const turnHash = createHash('sha256').update(String(turnKey)).digest('hex').slice(0, 24);
  const dir = join(baseDir, 'ask-surface-guard', projectHash);
  mkdirSync(dir, { recursive: true });
  try {
    writeFileSync(join(dir, turnHash), '', { flag: 'wx' });
    return true;
  } catch (error) {
    if (error && error.code === 'EEXIST') return false;
    throw error;
  }
}

// ───────────────────────────────────────────────────────────────────
// 6. FIRE LOG
// ───────────────────────────────────────────────────────────────────

/**
 * Append one line per fire to the project's gitignored state folder, so an
 * operator or a live test can count fires on runtimes whose re-prompt never
 * shows on screen. Never throws: a guard must not fail on its own log.
 *
 * @param {string} projectDir - The session's project root.
 * @param {object} entry - What fired.
 * @param {string} entry.runtime - A key of QUESTION_TOOLS.
 * @param {'reprompt'|'advise'} entry.mode - Whether the turn was sent back or only reported.
 * @returns {boolean} True when the line was written.
 */
function recordFire(projectDir, { runtime, mode }) {
  try {
    if (typeof projectDir !== 'string' || !projectDir) return false;
    const dir = join(projectDir, '.skilled', 'skills', '.state', CONCERN);
    mkdirSync(dir, { recursive: true });
    appendFileSync(join(dir, 'fires.jsonl'), `${JSON.stringify({ runtime, mode, at: new Date().toISOString() })}\n`);
    return true;
  } catch {
    return false;
  }
}

// ───────────────────────────────────────────────────────────────────
// 7. EXPORTS
// ───────────────────────────────────────────────────────────────────

module.exports = {
  CONCERN,
  QUESTION_TOOLS,
  detectProseMenu,
  evaluateTurn,
  markTurn,
  recordFire,
  repromptFor,
};
