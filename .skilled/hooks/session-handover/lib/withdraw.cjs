// ───────────────────────────────────────────────────────────────────
// MODULE: Session Handover Withdraw
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const core = require('./relaunch-core.cjs');
const nudge = require('./nudge.cjs');
const hopHistory = require('./hop-history.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// An armed record always counts: its killer is already counting down to a signal. A pending
// record counts only as the caller's policy says, because a hand-over prepared moments ago
// in the same turn is not one the session has carried on past.
function acceptsRecord(record, { sessionId, pending }) {
  if (sessionId !== undefined && record.sessionId !== sessionId) return false;
  if (record.status === 'armed') return true;
  if (record.status !== 'pending') return false;
  if (pending === 'any') return true;
  return pending === 'deferred'
    && typeof record.deferredAt === 'string'
    && record.deferredAt.trim() !== '';
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Call off a session's prepared hand-over, the one way every runtime and the cancel command
 * do it. The disarm is guarded and locked like any record write. Once it has taken effect,
 * two best-effort follow-ups give the session what a called-off hand-over owes it: one more
 * context nudge, since it may have spent its last, and a history line that lists the note as
 * still with its session instead of as unclaimed. Neither follow-up can undo the withdrawal.
 *
 * @param {Object} options - What to withdraw and why.
 * @param {string} options.loopId - Wrapper process identifier.
 * @param {string} options.reason - Why the record was disarmed (`user-message` or `cancelled`).
 * @param {string} [options.sessionId] - Session the record must belong to; omitted, any
 *   session's record counts, which is the operator's cancel.
 * @param {'deferred'|'any'|'none'} [options.pending='deferred'] - Which pending records count:
 *   only one a Stop deferred, any, or none. An armed record counts under every policy.
 * @param {NodeJS.ProcessEnv} [options.env=process.env] - Runtime environment.
 * @param {Date|number|string} [options.now] - Clock value for deterministic records.
 * @param {(stage: string, error: Error) => void} [options.onError] - Told when a follow-up
 *   fails (`rearm` or `history`); a failure in the callback itself is ignored.
 * @returns {Object|null} The disarmed record, or null when nothing was withdrawn.
 */
function withdrawHandOver({
  loopId,
  reason,
  sessionId,
  pending = 'deferred',
  env = process.env,
  now,
  onError,
}) {
  const disarmed = core.withdrawRecord({
    loopId,
    reason,
    env,
    now,
    accept: (record) => acceptsRecord(record, { sessionId, pending }),
  });
  if (disarmed === null) return null;

  const report = (stage, error) => {
    try {
      if (typeof onError === 'function') onError(stage, error);
    } catch {
      // The callback only reports; a failure inside it must not undo a withdrawal already made.
    }
  };
  try {
    nudge.rearmAfterWithdraw({ sessionId: disarmed.sessionId, env });
  } catch (error) {
    report('rearm', error);
  }
  try {
    hopHistory.recordHop('withdrawn', disarmed.handoff, { env, session: disarmed.sessionId });
  } catch (error) {
    report('history', error);
  }
  return disarmed;
}

/**
 * Withdraw a session's hand-over because its operator sent a prompt, the step each runtime
 * adapter takes on a new prompt. A failed withdrawal or follow-up is logged as
 * `context-nudge-error` and never thrown, so the prompt that triggered it always runs.
 *
 * @param {Object} options - What to withdraw and how to report it.
 * @param {string} options.loopId - Wrapper process identifier.
 * @param {string} options.sessionId - Session the record must belong to.
 * @param {NodeJS.ProcessEnv} [options.env=process.env] - Runtime environment.
 * @param {(event: string, fields: Object) => void} options.log - The adapter's relaunch-log
 *   writer; a failure inside it is ignored.
 * @param {string} options.withdrawnEvent - The event the adapter logs once a hand-over is withdrawn.
 * @returns {boolean} Whether a hand-over was withdrawn.
 */
function withdrawOnPrompt({ loopId, sessionId, env = process.env, log, withdrawnEvent }) {
  const report = (event, fields) => {
    try {
      log(event, fields);
    } catch {
      // Logging only reports; a failed write must not fail the operator's prompt.
    }
  };
  let withdrawn;
  try {
    withdrawn = withdrawHandOver({
      loopId,
      sessionId,
      reason: 'user-message',
      env,
      onError: (stage, error) => report('context-nudge-error', { stage, message: error.message }),
    });
  } catch (error) {
    report('context-nudge-error', { stage: 'withdraw', message: error.message });
    return false;
  }
  if (withdrawn === null) return false;
  report(withdrawnEvent, { loopId, sessionId, reason: 'user-message' });
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  withdrawHandOver,
  withdrawOnPrompt,
};
