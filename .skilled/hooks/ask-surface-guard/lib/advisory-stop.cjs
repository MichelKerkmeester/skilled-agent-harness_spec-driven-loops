// ───────────────────────────────────────────────────────────────────
// MODULE: Ask Surface Advisory Stop Runner
// ───────────────────────────────────────────────────────────────────
// Codex and Devin raise Stop with the last assistant message, but neither
// documents a decision that makes the agent take another step. Their guard
// therefore only reports the miss on stderr and lets the turn end.
// ceiling: the ask-tool scan is skipped here, so a menu asked through the
// tool and repeated in prose still logs; upgrade both runtimes to the
// blocking path once their Stop accepts a block.
'use strict';

const { readFileSync } = require('node:fs');

const core = require('./ask-surface-core.cjs');

let isHookEnabled = () => true;
try { isHookEnabled = require('../../shared/hook-flags.cjs').isHookEnabled; } catch {}

/**
 * Evaluate one Stop payload and return the advisory line, if any.
 *
 * @param {string} runtime - `codex` or `devin`.
 * @param {object} payload - The parsed Stop payload.
 * @returns {string|null} The stderr advisory, or null when the turn passes.
 */
function adviseFor(runtime, payload) {
  if (!payload || typeof payload !== 'object' || payload.stop_hook_active === true) return null;
  const lastMessage = typeof payload.last_assistant_message === 'string' ? payload.last_assistant_message : '';
  const result = core.evaluateTurn({ lastMessage, askToolCalled: false });
  if (result.verdict !== 'fire') return null;
  core.recordFire(typeof payload.cwd === 'string' && payload.cwd ? payload.cwd : process.cwd(), { runtime, mode: 'advise' });
  return core.repromptFor(runtime);
}

/**
 * Read the Stop payload from stdin and report a prose menu on stderr.
 * Never prints to stdout, so the runtime never reads a decision from it.
 *
 * @param {string} runtime - `codex` or `devin`.
 */
function runAdvisoryStop(runtime) {
  try {
    if (isHookEnabled(core.CONCERN) === false) return;
    const advisory = adviseFor(runtime, JSON.parse(readFileSync(0, 'utf8')));
    if (advisory) process.stderr.write(`${advisory}\n`);
  } catch {
    // Advisory only: a bad payload or a read error ends the turn normally.
  }
  process.exitCode = 0;
}

module.exports = { adviseFor, runAdvisoryStop };
