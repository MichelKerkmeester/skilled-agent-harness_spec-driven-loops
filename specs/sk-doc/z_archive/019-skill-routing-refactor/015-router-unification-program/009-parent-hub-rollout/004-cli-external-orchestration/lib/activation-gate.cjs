// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: CLI EXTERNAL ORCHESTRATION ACTIVATION GATE                    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const HARD_BLOCKS = Object.freeze([
  ['routeTargetNotActor', 'ROUTE_TARGET_NOT_ACTOR'],
  ['negativeTarget', 'NEGATIVE_TARGET_FORBIDDEN'],
  ['negativeAuthority', 'NEGATIVE_AUTHORITY_FORBIDDEN'],
  ['forbiddenNotRejected', 'FORBIDDEN_NOT_REJECTED'],
  ['zeroSignalNotDeferred', 'ZERO_SIGNAL_NOT_DEFERRED'],
  ['ambiguousNotClarified', 'AMBIGUOUS_NOT_CLARIFIED'],
  ['orderedBundleDrift', 'ORDERED_BUNDLE_DRIFT'],
  ['pinnedTupleMismatch', 'PINNED_TUPLE_MISMATCH'],
  ['mixedGeneration', 'MIXED_GENERATION_OBSERVED'],
  ['commitWithoutVerify', 'COMMIT_WITHOUT_VERIFY'],
  ['scorerEditRequired', 'SCORER_EDIT_REQUIRED'],
]);

// ─────────────────────────────────────────────────────────────────────────────
// 2. GATES
// ─────────────────────────────────────────────────────────────────────────────

class ActivationGateError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'ActivationGateError';
    this.code = code;
  }
}

/**
 * Refuse activation until every semantic and rollout subgate is green.
 *
 * @param {Object} evidence - Stage-gate evidence flags.
 * @returns {Readonly<Object>} Shadow-only activation disposition.
 */
function assertActivationEligible(evidence) {
  for (const [field, code] of HARD_BLOCKS) {
    if (evidence[field] === true) {
      throw new ActivationGateError(code, `activation blocked by ${field}`);
    }
  }
  for (const field of [
    'routeGoldGreen',
    'closedAlgebraGreen',
    'executionFenceGreen',
    'advisorGuardGreen',
    'documentParityGreen',
    'rollbackGreen',
    'sourceProtectionGreen',
  ]) {
    if (evidence[field] !== true) {
      throw new ActivationGateError('CANARY_SUBGATE_INCOMPLETE', `${field} is not green`);
    }
  }
  return Object.freeze({ eligible: true, servingAuthority: 'legacy', shadowOnly: true });
}

/**
 * Require a request pin to match one compiled generation and hash.
 *
 * @param {Object} pin - Request-pinned activation tuple.
 * @param {Object} policy - Compiled policy generation.
 * @returns {void}
 */
function assertPinnedTuple(pin, policy) {
  if (pin.generation !== policy.activationGeneration
    || pin.effectivePolicyHash !== policy.effectivePolicyHash) {
    throw new ActivationGateError(
      'PINNED_TUPLE_MISMATCH',
      'request pin differs from the compiled activation tuple',
    );
  }
}

/**
 * Reject one request observing multiple generation/hash tuples.
 *
 * @param {Object[]} pins - Activation tuples observed by one request.
 * @returns {void}
 */
function assertSingleGeneration(pins) {
  const tuples = new Set(pins.map((pin) => `${pin.generation}:${pin.effectivePolicyHash}`));
  if (tuples.size !== 1) {
    throw new ActivationGateError(
      'MIXED_GENERATION_OBSERVED',
      'one request observed mixed activation generations',
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  ActivationGateError,
  HARD_BLOCKS,
  assertActivationEligible,
  assertPinnedTuple,
  assertSingleGeneration,
};
