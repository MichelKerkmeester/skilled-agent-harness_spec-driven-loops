// ───────────────────────────────────────────────────────────────────
// MODULE: Session Relaunch Goal Hand-over
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const path = require('node:path');
const { spawnSync } = require('node:child_process');
const core = require('./relaunch-core.cjs');
const nudge = require('./nudge.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Claude refuses a goal condition longer than this, and the spec kit validator holds a
// packet's durable slice to the same number, so a slice that passes the budget also fits.
const GOAL_SLICE_LIMIT = 4000;
const GOAL_CLI = path.resolve(__dirname, '../../goal/bin/goal.cjs');
const RENDER_TIMEOUT_MS = 10000;
const RENDER_MAX_BUFFER = 4 * 1024 * 1024;
const FAILURE_DETAIL_CHARS = 120;
const FRONTMATTER_FENCE = /^\s*---[ \t]*\r?\n/;
const CONTROL_CHARACTER = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function refuse(reason) {
  return { ok: false, reason };
}

// The command prints one `key=value` line per field, with each value JSON-quoted.
function parsePacketOutput(stdout) {
  const fields = new Map();
  for (const line of String(stdout).split('\n')) {
    const index = line.indexOf('=');
    if (index > 0 && !line.startsWith('STATUS=')) fields.set(line.slice(0, index), line.slice(index + 1));
  }
  return fields;
}

function jsonField(fields, key) {
  if (!fields.has(key)) return undefined;
  try {
    return JSON.parse(fields.get(key));
  } catch {
    return undefined;
  }
}

function firstLine(text) {
  const line = String(text ?? '').split('\n').map((entry) => entry.trim()).find(Boolean) ?? '';
  return line.length > FAILURE_DETAIL_CHARS ? `${line.slice(0, FAILURE_DETAIL_CHARS)}...` : line;
}

function overLimit(durableChars) {
  const measured = Number.isInteger(durableChars) ? ` (${durableChars} characters)` : '';
  return `the goal slice is over the ${GOAL_SLICE_LIMIT}-character limit${measured};`
    + ' cut goal.md first';
}

// A packet may live in this repository or in the checkout the fresh session starts in, which a
// git worktree session does not share with the CLI's repository.
function packetRoot(packet, roots) {
  return roots.find((root) => core.goalPacketProblem(packet, [root]) === null) ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Render a packet's chat slice for a receiver that sets its goal from the start prompt. The
 * slice is read from goal.md now, so it is never a copy that went stale, and it is the
 * `chat_slice` the goal command prints and nothing else.
 *
 * Every refusal is a one-line reason and never a throw, because a hand-over must start the
 * receiver whether or not its goal can be carried. A slice is refused unless the packet is a
 * repo-relative directory holding a goal.md, the goal command reports the budget ok and the
 * slice is plain text within the limit.
 *
 * @param {Object} options - The packet to render.
 * @param {string} options.packet - Repo-relative packet directory from the hand-over note.
 * @param {string[]} [options.roots] - Absolute checkouts the packet may live in; the CLI's
 *   repository and the working directory by default.
 * @param {string} [options.goalCli] - The goal command to run, overridable for tests.
 * @param {NodeJS.ProcessEnv} [options.env=process.env] - Environment for the command.
 * @returns {{ok: true, slice: string} | {ok: false, reason: string}} The slice, or why none.
 */
function renderGoalSlice({
  packet,
  roots = [nudge.resolveRepoRoot(), process.cwd()],
  goalCli = GOAL_CLI,
  env = process.env,
} = {}) {
  // The packet is checked before it reaches a command line: a bad path never runs anything.
  const root = packetRoot(packet, roots);
  if (root === null) {
    return refuse(core.goalPacketProblem(packet, roots) ?? 'goal_packet cannot be read');
  }

  const run = spawnSync(
    process.execPath,
    [goalCli, 'packet', packet, '--workspace', root],
    {
      encoding: 'utf8',
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: RENDER_TIMEOUT_MS,
      maxBuffer: RENDER_MAX_BUFFER,
    },
  );
  const succeeded = run.status === 0 && String(run.stdout).startsWith('STATUS=OK');
  if (run.error || !succeeded) {
    const detail = firstLine(run.error?.message || run.stderr || run.stdout);
    return refuse(`could not render the goal packet${detail === '' ? '' : `: ${detail}`}`);
  }

  const fields = parsePacketOutput(run.stdout);
  const budget = fields.get('packet_budget');
  if (budget === 'over') return refuse(overLimit(Number(fields.get('packet_durable_chars'))));
  if (budget !== 'ok') return refuse('the goal slice has no budget to check against');

  const slice = jsonField(fields, 'chat_slice');
  if (typeof slice !== 'string') return refuse('the goal command did not print a slice');
  if (slice.trim() === '') return refuse('goal.md has no durable slice');
  if (slice.length > GOAL_SLICE_LIMIT) return refuse(overLimit(slice.length));
  if (FRONTMATTER_FENCE.test(slice) || slice.includes('<!--')) {
    return refuse('the goal slice carries frontmatter or markup');
  }
  if (CONTROL_CHARACTER.test(slice)) return refuse('the goal slice holds a control character');
  return { ok: true, slice };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  GOAL_SLICE_LIMIT,
  renderGoalSlice,
};
