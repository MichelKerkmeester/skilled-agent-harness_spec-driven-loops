#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Fake Conversation Subject
// ───────────────────────────────────────────────────────────────────
'use strict';

/**
 * A line-mode stand-in for a full-screen CLI subject.
 *
 * The conversation runner needs a subject that behaves like a TUI — it prints a prompt, it is
 * briefly busy while it thinks, it can ask a numbered question and it can leave the answered
 * dialog on screen — without spending model quota or depending on an installed CLI. Everything
 * here is deliberately line oriented so a human can drive it by hand with `node fake-subject.cjs`.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ─────────────────────────────────────────────────────────────────────────────
// 2. STATE
// ─────────────────────────────────────────────────────────────────────────────

const READY = 'FAKE READY>';
const BUSY = 'FAKE BUSY';
const START_DELAY_MS = 300;
const STARTUP_REDRAW_ENV = 'CONVERSATION_FAKE_STARTUP_REDRAW';
const STARTUP_REDRAW_DELAY_MS = 700;
const OTHER_LABEL = 'Other';
const ANSWERS_FILE = 'answers.txt';
const RECEIVED_FILE = 'received.txt';
const SESSION_FILE = 'session.log';

let pending = null;
let isChatPending = false;
let isBusyShown = false;
let startupPhase = null;
let startupCursor = 0;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Print one rendered line. The pane sees each call as a new line, which is what a real TUI does
 * when it redraws, and it keeps the captured screen free of escape codes.
 *
 * @param {string} line - Text to render.
 */
function emit(line) {
  process.stdout.write(`${line}\n`);
}

/**
 * Append one answer to the project's answer log. One answer per line lets a check assert a single
 * choice with an exact line match instead of a substring search.
 *
 * @param {string} value - Answer text as the subject would record it.
 */
function appendAnswer(value) {
  fs.appendFileSync(path.resolve(ANSWERS_FILE), `${value}\n`);
}

/** Print the ready prompt and mark the screen idle. */
function promptReady() {
  emit(READY);
  isBusyShown = false;
}

/** Print the busy marker once for the line currently being handled. */
function beginWork() {
  if (!isBusyShown) {
    emit(BUSY);
    isBusyShown = true;
  }
}

/**
 * Split `question|opt1,opt2` into its text and labels.
 *
 * @param {string} spec - Everything after the sub-command word.
 * @returns {[string, string[]]} Question text and option labels.
 */
function splitSpec(spec) {
  const bar = spec.indexOf('|');
  if (bar < 0) return [spec.trim(), []];
  const labels = spec
    .slice(bar + 1)
    .split(',')
    .map((label) => label.trim())
    .filter(Boolean);
  return [spec.slice(0, bar).trim(), labels];
}

/**
 * Render a numbered question. The dialog stays on screen after it is answered, exactly like a real
 * TUI's scrollback, so the runner has to avoid answering the same render twice.
 *
 * @param {string} body - `<single|multi|other> <question>|<labels>`.
 */
function startQuestion(body) {
  const parsed = /^(single|multi|other)\s+([\s\S]*)$/.exec(body);
  if (!parsed) {
    emit(`ok: ask ${body}`);
    promptReady();
    return;
  }
  const kind = parsed[1];
  const [question, options] = splitSpec(parsed[2]);
  const labels = kind === 'other' ? options.concat(OTHER_LABEL) : options;
  emit(`[?] ${question}`);
  labels.forEach((label, index) => emit(`  ${index + 1}. ${label}`));
  emit(kind === 'multi' ? '[multi]' : '[select]');
  pending = { labels };
}

/**
 * Record the answer typed into an open question dialog.
 *
 * @param {string} line - Space separated option numbers, or `o: <text>` for the free-text row.
 */
function answerSelection(line) {
  const { labels } = pending;
  pending = null;
  const trimmed = line.trim();
  let value;
  if (/^o:/i.test(trimmed)) {
    value = trimmed.replace(/^o:\s*/i, '');
  } else {
    const picks = trimmed
      .split(/\s+/)
      .filter(Boolean)
      .map((token) => Number.parseInt(token, 10))
      .filter((number) => Number.isInteger(number) && number >= 1 && number <= labels.length)
      .map((number) => labels[number - 1]);
    value = picks.join(', ');
  }
  appendAnswer(value);
  emit(`answered: ${value}`);
  promptReady();
}

/**
 * Record a plain chat answer. A chat question is asked in prose, so the subject takes the whole
 * next line as the answer rather than offering a dialog.
 *
 * @param {string} line - The reply the subject received.
 */
function answerChat(line) {
  appendAnswer(line);
  emit(`reply: ${line}`);
  promptReady();
}

/**
 * Handle one typed line.
 *
 * @param {string} rawLine - One line from stdin.
 */
function handleLine(rawLine) {
  const line = rawLine.replace(/\r$/, '');
  // Store raw input so scenario checks can distinguish delivered text from screen echoes.
  fs.appendFileSync(path.resolve(RECEIVED_FILE), `${JSON.stringify(line)}\n`);
  if (startupPhase !== null) {
    const isDownPressed = line.includes('\u001b[B') || line.includes('\u001bOB');
    if (startupPhase === 'final' && isDownPressed) {
      startupCursor = Math.min(startupCursor + 1, 1);
      if (startupCursor === 1) {
        startupPhase = null;
        fs.writeFileSync(path.resolve('startup-choice.txt'), 'trusted\n');
        emit('FAKE TRUST ACCEPTED');
        promptReady();
      }
    }
    return;
  }
  if (pending) {
    beginWork();
    answerSelection(line);
    return;
  }
  if (isChatPending) {
    isChatPending = false;
    beginWork();
    answerChat(line);
    return;
  }
  beginWork();
  if (line === '/exit') {
    process.exit(0);
  }
  if (line === '/compact') {
    emit('compacted');
    promptReady();
    return;
  }
  if (line.startsWith('ask ')) {
    startQuestion(line.slice('ask '.length));
    return;
  }
  // A question in plain prose, the way a model asks in chat: the typed line is echoed behind the
  // prompt glyph and the question carries no marker, so only the settled screen shows it.
  if (line.startsWith('prose ')) {
    isChatPending = true;
    emit(`❯ ${line}`);
    emit(line.slice('prose '.length));
    promptReady();
    return;
  }
  if (line.startsWith('chat ')) {
    isChatPending = true;
    emit(`CHAT? ${line.slice('chat '.length)}`);
    promptReady();
    return;
  }
  emit(`ok: ${line}`);
  promptReady();
}

/** Draw a trust prompt twice to model terminals that reset their selection after the first paint. */
function startStartupRedraw() {
  startupPhase = 'first';
  startupCursor = 1;
  emit('FAKE TRUST STARTUP');
  emit('  1. No, exit');
  emit('❯ 2. Yes, I trust this folder');
  setTimeout(() => {
    startupPhase = 'final';
    startupCursor = 0;
    emit('FAKE TRUST STARTUP');
    emit('❯ 1. No, exit');
    emit('  2. Yes, I trust this folder');
    emit('⚠ Settings permissions warning');
  }, STARTUP_REDRAW_DELAY_MS);
}

/**
 * Read the `--session` value, which is written to the session log so a restart test can count
 * launches into the same session.
 *
 * @param {string[]} argv - Process arguments after the script name.
 * @returns {string|null} Session id, or null when it was not given.
 */
function readSessionId(argv) {
  const index = argv.indexOf('--session');
  if (index < 0) return null;
  return index + 1 < argv.length ? argv[index + 1] : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN
// ─────────────────────────────────────────────────────────────────────────────

// A pane can close under the subject at any moment. Ending quietly keeps a shutdown from painting a
// stack trace over the very screen a probe or a failed turn is saved to inspect.
process.stdout.on('error', (error) => {
  if (error && error.code === 'EPIPE') process.exit(0);
  throw error;
});

const sessionId = readSessionId(process.argv.slice(2));
if (sessionId) {
  fs.appendFileSync(path.resolve(SESSION_FILE), `session ${sessionId}\n`);
}

const lineReader = readline.createInterface({ input: process.stdin, terminal: false });
lineReader.on('line', handleLine);
lineReader.on('close', () => {
  process.exitCode = 0;
});

if (process.env[STARTUP_REDRAW_ENV] === '1') {
  startStartupRedraw();
} else {
  setTimeout(promptReady, START_DELAY_MS);
}
