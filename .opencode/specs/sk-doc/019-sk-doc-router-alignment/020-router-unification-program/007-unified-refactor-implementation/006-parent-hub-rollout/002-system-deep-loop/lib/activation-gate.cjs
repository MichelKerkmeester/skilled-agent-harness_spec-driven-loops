// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: DEEP-LOOP CANARY ACTIVATION GATE                              ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const HARD_BLOCKS = Object.freeze([
  ['sharedPacketCollapse', 'SHARED_PACKET_COLLAPSE'],
  ['runtimeKeyCollapse', 'RUNTIME_KEY_COLLAPSE'],
  ['bundleEmission', 'BUNDLE_EMISSION_FORBIDDEN'],
  ['negativeAuthority', 'NEGATIVE_AUTHORITY_FORBIDDEN'],
  ['pinnedTupleMismatch', 'PINNED_TUPLE_MISMATCH'],
  ['mixedGeneration', 'MIXED_GENERATION_OBSERVED'],
  ['exactRouteRecoveryArtifact', 'EXACT_ROUTE_RECOVERY_ARTIFACT'],
  ['commitWithoutVerify', 'COMMIT_WITHOUT_VERIFY'],
  ['scorerEditRequired', 'SCORER_EDIT_REQUIRED'],
]);

// ─────────────────────────────────────────────────────────────────────────────
// 2. GATES
// ─────────────────────────────────────────────────────────────────────────────

class CanaryActivationError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'CanaryActivationError';
    this.code = code;
  }
}

/**
 * Refuse activation when any semantic hard block or subgate is unresolved.
 *
 * @param {Object} evidence - Stage-gate evidence flags.
 * @returns {Readonly<Object>} Legacy-authoritative canary disposition.
 */
function assertActivationEligible(evidence) {
  for (const [field, code] of HARD_BLOCKS) {
    if (evidence[field] === true) {
      throw new CanaryActivationError(code, `activation blocked by ${field}`);
    }
  }
  for (const field of [
    'routeGoldGreen',
    'advisorGuardGreen',
    'documentParityGreen',
    'rollbackGreen',
    'noCollapseGreen',
    'singleOnlyGreen',
  ]) {
    if (evidence[field] !== true) {
      throw new CanaryActivationError('CANARY_SUBGATE_INCOMPLETE', `${field} is not green`);
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
    throw new CanaryActivationError(
      'PINNED_TUPLE_MISMATCH',
      'request pin does not match one compiled generation and hash',
    );
  }
}

/**
 * Reject one request observing more than one generation/hash tuple.
 *
 * @param {Object[]} pins - All selector pins observed by one request.
 * @returns {void}
 */
function assertSingleGeneration(pins) {
  const tuples = new Set(pins.map((pin) => `${pin.generation}:${pin.effectivePolicyHash}`));
  if (tuples.size > 1) {
    throw new CanaryActivationError(
      'MIXED_GENERATION_OBSERVED',
      'one request observed more than one activation tuple',
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  CanaryActivationError,
  HARD_BLOCKS,
  assertActivationEligible,
  assertPinnedTuple,
  assertSingleGeneration,
};
