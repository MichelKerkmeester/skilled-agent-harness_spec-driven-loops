'use strict';

const HARD_BLOCKS = Object.freeze([
  ['bundleRuleDrift', 'BUNDLE_RULE_DRIFT'],
  ['orderedBundleOrder', 'ORDERED_BUNDLE_ORDER_INVALID'],
  ['defaultModeDrift', 'DEFAULT_MODE_DRIFT'],
  ['negativeAuthority', 'NEGATIVE_AUTHORITY_FORBIDDEN'],
  ['pinnedTupleMismatch', 'PINNED_TUPLE_MISMATCH'],
  ['mixedGeneration', 'MIXED_GENERATION_OBSERVED'],
  ['exactRouteRecoveryArtifact', 'EXACT_ROUTE_RECOVERY_ARTIFACT'],
  ['commitWithoutVerify', 'COMMIT_WITHOUT_VERIFY'],
  ['scorerEditRequired', 'SCORER_EDIT_REQUIRED'],
]);

class CanaryActivationError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'CanaryActivationError';
    this.code = code;
  }
}

function assertActivationEligible(evidence) {
  for (const [field, code] of HARD_BLOCKS) {
    if (evidence[field] === true) {
      throw new CanaryActivationError(code, `activation blocked by ${field}`);
    }
  }
  for (const field of [
    'routeGoldGreen',
    'documentParityGreen',
    'rollbackGreen',
    'routerClosureGreen',
    'orderedBundleGreen',
    'defaultModeGreen',
  ]) {
    if (evidence[field] !== true) {
      throw new CanaryActivationError('CANARY_SUBGATE_INCOMPLETE', `${field} is not green`);
    }
  }
  return Object.freeze({ eligible: true, servingAuthority: 'legacy', shadowOnly: true });
}

function assertPinnedTuple(pin, policy) {
  if (pin.generation !== policy.activationGeneration
    || pin.effectivePolicyHash !== policy.effectivePolicyHash) {
    throw new CanaryActivationError('PINNED_TUPLE_MISMATCH', 'request pin differs from policy');
  }
}

function assertSingleGeneration(pins) {
  const tuples = new Set(pins.map((pin) => `${pin.generation}:${pin.effectivePolicyHash}`));
  if (tuples.size > 1) {
    throw new CanaryActivationError('MIXED_GENERATION_OBSERVED', 'request observed mixed policy tuples');
  }
}

module.exports = {
  CanaryActivationError,
  HARD_BLOCKS,
  assertActivationEligible,
  assertPinnedTuple,
  assertSingleGeneration,
};
