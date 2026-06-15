// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Terminal Lifecycle Taxonomy (shared backend contract)                   ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ One canonical enum for how a deep-loop session terminates: six           ║
// ║ stopReasons (WHY a session ended) and four sessionOutcomes (WHAT         ║
// ║ happened to the candidate). The two axes are orthogonal and must never   ║
// ║ be overloaded into one another. Consumers (e.g. the improvement journal) ║
// ║ import these instead of redefining them, so accepted values and the      ║
// ║ derived validation error strings stay identical across modes.            ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

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

module.exports = {
  STOP_REASONS,
  SESSION_OUTCOMES,
};
