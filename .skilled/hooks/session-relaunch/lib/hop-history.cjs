// ───────────────────────────────────────────────────────────────────
// MODULE: Session Relaunch Hop History
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const core = require('./relaunch-core.cjs');
const nudge = require('./nudge.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// The relaunch log lives in a temporary directory the system clears, so the operator's
// record of hops sits beside the handoff notes, which persist and stay out of git.
const HISTORY_FILE = 'hop-history.log';
// `note-kept` marks a session outside the wrapper that kept a note instead of hopping.
// `withdrawn` marks a prepared hand-over the session called off, so its note stays with the
// session that wrote it.
const EVENTS = Object.freeze([
  'handed-over', 'claimed', 'done', 'timed-out', 'note-kept', 'withdrawn',
]);
const GOAL_MAX_CHARS = 120;
// The leading part of a session id, as the handoff file names show it.
const SESSION_ID_CHARS = 8;
const DEFAULT_HISTORY_LINES = 20;
const NOTIFY_SWITCH = 'SESSION_RELAUNCH_NOTIFY_HOPS';
const NOTIFY_TIMEOUT_MS = 3000;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Fields are tab-separated, so a tab or line break inside one would split the row.
function flatten(value) {
  return String(value ?? '').replace(/[\t\r\n]+/g, ' ').trim();
}

function truncate(text, limit) {
  return text.length > limit ? `${text.slice(0, limit - 3).trimEnd()}...` : text;
}

function noteSummary(handoffPath) {
  try {
    const note = core.parseHandoff(fs.readFileSync(handoffPath, 'utf8'));
    const goal = (note.sections.Goal || '').split(/\r?\n/).find((line) => line.trim()) || '';
    return {
      runtime: note.frontmatter.runtime || '',
      cwd: note.frontmatter.cwd || '',
      goal: truncate(flatten(goal), GOAL_MAX_CHARS),
    };
  } catch {
    return { runtime: '', cwd: '', goal: '' };
  }
}

function isTruthy(value) {
  return ['1', 'true', 'yes', 'on'].includes(String(value ?? '').trim().toLowerCase());
}

// A count, not a slice offset: a negative number would otherwise drop that many of the
// oldest lines, and a zero would start at the first line and keep them all.
function historyCount(last) {
  return Number.isInteger(last) && last >= 0 ? last : DEFAULT_HISTORY_LINES;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/** Return the hop history path under the repository that holds the concern. */
function historyPath(env = process.env) {
  return path.join(path.dirname(nudge.handoffDir(nudge.resolveRepoRoot(env))), HISTORY_FILE);
}

/**
 * Append one hop event. History is a record for the operator, so a failed write never
 * fails the hop it describes.
 *
 * @param {string} event - One of the EVENTS names.
 * @param {string} handoffPath - The note the hop carries.
 * @param {{env?: NodeJS.ProcessEnv, hop?: number|null, runtime?: string, session?: string,
 *   now?: Date}} [options] - `session` names the session that acted, so a claim shows who
 *   picked the note up; the note's file name already names the session that wrote it.
 * @returns {boolean} True when the line was written.
 */
function recordHop(event, handoffPath, {
  env = process.env, hop = null, runtime, session, now,
} = {}) {
  if (!EVENTS.includes(event)) return false;
  const summary = noteSummary(handoffPath);
  const fields = [
    (now ?? new Date()).toISOString(),
    event,
    flatten(runtime || summary.runtime || 'unknown'),
    Number.isInteger(hop) && hop > 0 ? `hop ${hop}` : '-',
    flatten(summary.cwd),
    summary.goal,
    path.basename(String(handoffPath || '')),
  ];
  // A trailing field keeps every older line readable by the same split.
  if (session) fields.push(flatten(session).slice(0, SESSION_ID_CHARS));
  try {
    const filePath = historyPath(env);
    fs.mkdirSync(path.dirname(filePath), { recursive: true, mode: 0o700 });
    fs.appendFileSync(filePath, `${fields.join('\t')}\n`, { mode: 0o600 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Show a desktop notice for a hand-over when the operator switched notices on.
 * The notice is off by default because it reaches outside the terminal.
 *
 * @param {string} handoffPath - The note the hop carries.
 * @param {{switches?: Object, runtime?: string}} [options] - Resolved switches and runtime.
 * @returns {boolean} True when a notice was requested.
 */
function notifyHandOver(handoffPath, { switches = process.env, runtime } = {}) {
  if (!isTruthy(switches[NOTIFY_SWITCH])) return false;
  const summary = noteSummary(handoffPath);
  const where = path.basename(summary.cwd || '') || 'session';
  const runtimeLabel = runtime || summary.runtime || 'session';
  const message = `${runtimeLabel} in ${where}: ${summary.goal || 'handoff note'}`;
  try {
    spawnSync('osascript', [
      '-e',
      `display notification ${JSON.stringify(message)} with title "Session handed over"`,
    ], { timeout: NOTIFY_TIMEOUT_MS, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Read the latest history lines, oldest first.
 *
 * @param {{env?: NodeJS.ProcessEnv, last?: number}} [options] - Environment and how many of
 *   the newest lines to return. A whole number of zero or more is a count, so zero returns
 *   nothing; any other value falls back to `DEFAULT_HISTORY_LINES`.
 * @returns {string[]} Formatted lines, empty when nothing is recorded.
 */
function readHistory({ env = process.env, last = DEFAULT_HISTORY_LINES } = {}) {
  let text;
  try {
    text = fs.readFileSync(historyPath(env), 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
  const lines = text.split('\n').filter(Boolean);
  const count = historyCount(last);
  const newest = count === 0 ? [] : lines.slice(-count);
  return newest.map((line) => {
    const [time, event, runtime, hop, cwd, goal, note, session] = line.split('\t');
    const where = cwd ? path.basename(cwd) : '-';
    const hopLabel = hop && hop !== '-' ? ` (${hop})` : '';
    const sessionLabel = session ? ` by ${session}` : '';
    return `${time}  ${(event || '').padEnd(11)}  ${(runtime || '').padEnd(8)}`
      + `  ${where}${hopLabel}${sessionLabel}  ${goal || ''}  [${note || ''}]`;
  });
}

// The newest event per note file name. A history that cannot be read says nothing about
// any note, so every note then reads as unclaimed work.
function latestEvents(env) {
  const events = new Map();
  let text;
  try {
    text = fs.readFileSync(historyPath(env), 'utf8');
  } catch {
    return events;
  }
  for (const line of text.split('\n')) {
    const [, event, , , , , note] = line.split('\t');
    if (event && note) events.set(note, event);
  }
  return events;
}

// A note nobody claimed is a hand-over that never finished, and nothing else reports it.
// A note whose newest event is a withdrawal is not that: its session called the hand-over
// off and still holds the note.
/**
 * List the handoff notes still open, oldest first.
 *
 * @param {{env?: NodeJS.ProcessEnv}} [options] - Environment that locates the notes.
 * @returns {{name: string, createdAt: string, withdrawn: boolean}[]} One entry per open
 *   note; `withdrawn` is true when its newest history event is a withdrawal.
 */
function openNotes({ env = process.env } = {}) {
  const directory = nudge.handoffDir(nudge.resolveRepoRoot(env));
  let filenames;
  try {
    filenames = fs.readdirSync(directory);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
  const events = latestEvents(env);
  const open = [];
  for (const name of filenames.filter((filename) => filename.endsWith('.md')).sort()) {
    try {
      const { frontmatter } = core.parseHandoff(fs.readFileSync(path.join(directory, name), 'utf8'));
      if (frontmatter.status === 'open') {
        open.push({
          name,
          createdAt: frontmatter.created_at || '',
          withdrawn: events.get(name) === 'withdrawn',
        });
      }
    } catch {}
  }
  return open;
}

/**
 * Summarize the open notes in one line, or return null when there are none.
 *
 * @param {{env?: NodeJS.ProcessEnv}} [options] - Environment that locates the notes.
 * @returns {string|null} The summary line.
 */
function openNotesLine({ env = process.env } = {}) {
  const open = openNotes({ env });
  if (open.length === 0) return null;
  const unclaimed = open.filter((note) => !note.withdrawn);
  const withdrawn = open.length - unclaimed.length;
  const parts = [];
  if (unclaimed.length > 0) {
    const noun = unclaimed.length === 1 ? 'note' : 'notes';
    parts.push(`${unclaimed.length} handoff ${noun} not claimed yet, oldest ${unclaimed[0].name}`);
  }
  if (withdrawn > 0) {
    parts.push(withdrawn === 1
      ? '1 withdrawn note still with its session'
      : `${withdrawn} withdrawn notes still with their sessions`);
  }
  return `open notes: ${parts.join('; ')}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  EVENTS,
  NOTIFY_SWITCH,
  DEFAULT_HISTORY_LINES,
  historyPath,
  recordHop,
  notifyHandOver,
  readHistory,
  openNotes,
  openNotesLine,
};
