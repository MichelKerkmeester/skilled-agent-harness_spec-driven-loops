// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Loop Lifecycle Taxonomy (shared backend contract)                       ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ One canonical contract for loop active states, legal transitions, and    ║
// ║ terminal outcomes. stopReasons (WHY a session ended) and sessionOutcomes ║
// ║ (WHAT happened to the candidate) remain orthogonal and must never be     ║
// ║ overloaded into one another. Consumers import these instead of           ║
// ║ redefining them, so accepted values and validation strings stay aligned. ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

/**
 * @typedef {'running' | 'waiting' | 'paused' | 'idle' | 'stopped'} LoopActiveStatusValue
 * @typedef {'converged' | 'maxIterationsReached' | 'blockedStop' | 'manualStop' | 'error' | 'stuckRecovery' | 'userPaused'} LoopStopReasonValue
 * @typedef {{
 *   waitForResume: () => Promise<void>,
 *   resolveResume: () => boolean,
 *   resumeResolve: (() => boolean) | null,
 *   isResolved: () => boolean,
 * }} ResumeResolveGate
 */

/**
 * Active statuses describe WHERE a loop is in the runtime lifecycle.
 * The values intentionally match the string literals already used by callers.
 *
 * @type {Readonly<Record<LoopActiveStatusValue, LoopActiveStatusValue>>}
 */
const LoopActiveStatus = Object.freeze({
  running: 'running',
  waiting: 'waiting',
  paused: 'paused',
  idle: 'idle',
  stopped: 'stopped',
});

/**
 * Stop reasons explain WHY a session terminated.
 * Do not overload stopReason with outcome semantics — keep it orthogonal to sessionOutcome.
 *
 * Insertion order is contractual: validation error strings render these via
 * Object.values(...).join(', '), so reordering would change emitted messages.
 * @type {Readonly<Record<string, string>>}
 */
const STOP_REASONS = Object.freeze({
  converged: 'converged',
  maxIterationsReached: 'maxIterationsReached',
  blockedStop: 'blockedStop',
  manualStop: 'manualStop',
  error: 'error',
  stuckRecovery: 'stuckRecovery',
  // Operator-initiated pause: the graph-backed runtime-loop modes (context,
  // research, review) emit this terminal reason at pause-sentinel time. New
  // values append to preserve the contractual error-string order above.
  userPaused: 'userPaused',
});

/**
 * PascalCase alias for consumers that want a type-like runtime contract.
 *
 * @type {Readonly<Record<string, LoopStopReasonValue>>}
 */
const LoopStopReason = STOP_REASONS;

/**
 * Legal active-state transitions. This is a shared contract only; callers opt
 * into validation separately so existing string-literal call sites keep working.
 *
 * @type {Readonly<Record<LoopActiveStatusValue, ReadonlyArray<LoopActiveStatusValue>>>}
 */
const LEGAL_TRANSITIONS = Object.freeze({
  running: Object.freeze(['waiting', 'paused', 'stopped']),
  waiting: Object.freeze(['running', 'paused', 'stopped']),
  paused: Object.freeze(['waiting', 'running', 'stopped']),
  idle: Object.freeze(['waiting', 'running', 'stopped']),
  stopped: Object.freeze([]),
});

/**
 * Session outcomes explain WHAT happened to the candidate.
 * Kept separate from stopReason: stopReason is WHY a session ended, this is WHAT happened to the candidate.
 *
 * Insertion order is contractual for the same reason as STOP_REASONS.
 * @type {Readonly<Record<string, string>>}
 */
const SESSION_OUTCOMES = Object.freeze({
  keptBaseline: 'keptBaseline',
  promoted: 'promoted',
  rolledBack: 'rolledBack',
  advisoryOnly: 'advisoryOnly',
});

/**
 * Create a paused-wait gate. A paused loop awaits waitForResume(), and the
 * resumeResolve resolver is consumed once so a stale resume signal cannot leak
 * into a later wait.
 *
 * @returns {ResumeResolveGate}
 */
function createResumeResolveGate() {
  /** @type {(() => void) | null} */
  let resolveGate = null;
  let didResolve = false;

  const resumePromise = new Promise((resolve) => {
    resolveGate = resolve;
  });

  function resumeResolve() {
    if (didResolve || !resolveGate) {
      return false;
    }

    const resolve = resolveGate;
    didResolve = true;
    resolveGate = null;
    resolve();
    return true;
  }

  return Object.freeze({
    waitForResume() {
      return resumePromise;
    },
    resolveResume() {
      return resumeResolve();
    },
    get resumeResolve() {
      return didResolve ? null : resumeResolve;
    },
    isResolved() {
      return didResolve;
    },
  });
}

module.exports = {
  LoopActiveStatus,
  LoopStopReason,
  LEGAL_TRANSITIONS,
  STOP_REASONS,
  SESSION_OUTCOMES,
  createResumeResolveGate,
};
