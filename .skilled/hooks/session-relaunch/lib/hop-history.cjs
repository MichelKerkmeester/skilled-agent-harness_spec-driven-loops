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
const EVENTS = Object.freeze(['handed-over', 'claimed', 'done', 'timed-out']);
const GOAL_MAX_CHARS = 120;
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
 * @param {{env?: NodeJS.ProcessEnv, hop?: number|null, runtime?: string, now?: Date}} [options]
 * @returns {boolean} True when the line was written.
 */
function recordHop(event, handoffPath, { env = process.env, hop = null, runtime, now } = {}) {
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
 * @param {{env?: NodeJS.ProcessEnv, last?: number}} [options] - Environment and line count.
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
  return text.split('\n').filter(Boolean).slice(-last).map((line) => {
    const [time, event, runtime, hop, cwd, goal, note] = line.split('\t');
    const where = cwd ? path.basename(cwd) : '-';
    const hopLabel = hop && hop !== '-' ? ` (${hop})` : '';
    return `${time}  ${(event || '').padEnd(11)}  ${(runtime || '').padEnd(8)}`
      + `  ${where}${hopLabel}  ${goal || ''}  [${note || ''}]`;
  });
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
};
