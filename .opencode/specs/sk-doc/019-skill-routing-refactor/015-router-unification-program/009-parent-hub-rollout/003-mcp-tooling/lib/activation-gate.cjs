'use strict';

class ActivationGateError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'ActivationGateError';
    this.code = code;
  }
}

const HARD_BLOCKS = Object.freeze([
  ['transportSuppliesJudgment', 'TRANSPORT_SUPPLIES_JUDGMENT'],
  ['outOfOrderComposeCommit', 'COMPOSE_AFTER_ORDER_VIOLATION'],
  ['unsatisfiedAuthorityCommit', 'REQUIRES_AUTHORITY_UNSATISFIED'],
  ['mutatingBeforeReadOnly', 'READ_ONLY_LEGS_INCOMPLETE'],
  ['negativeAuthority', 'NEGATIVE_AUTHORITY_FORBIDDEN'],
  ['pinnedTupleMismatch', 'PINNED_TUPLE_MISMATCH'],
  ['mixedGeneration', 'MIXED_GENERATION_OBSERVED'],
  ['commitWithoutVerify', 'COMMIT_WITHOUT_VERIFY'],
  ['scorerEditRequired', 'SCORER_EDIT_REQUIRED'],
]);

function assertActivationEligible(evidence) {
  for (const [field, code] of HARD_BLOCKS) {
    if (evidence[field] === true) throw new ActivationGateError(code, `activation blocked by ${field}`);
  }
  for (const field of [
    'routeGoldGreen',
    'advisorGuardGreen',
    'documentParityGreen',
    'rollbackGreen',
    'destinationRolloutGreen',
  ]) {
    if (evidence[field] !== true) {
      throw new ActivationGateError('CANARY_SUBGATE_INCOMPLETE', `${field} is not green`);
    }
  }
  return Object.freeze({ eligible: true, servingAuthority: 'legacy', shadowOnly: true });
}

function assertPinnedTuple(pin, snapshot) {
  if (pin.generation !== snapshot.policy.activationGeneration
    || pin.effectivePolicyHash !== snapshot.policy.effectivePolicyHash) {
    throw new ActivationGateError('PINNED_TUPLE_MISMATCH', 'generation/hash pin differs from compiled policy');
  }
}

function assertSingleGeneration(pins) {
  const tuples = new Set(pins.map((pin) => `${pin.generation}:${pin.effectivePolicyHash}`));
  if (tuples.size !== 1) {
    throw new ActivationGateError('MIXED_GENERATION_OBSERVED', 'request observed mixed generations');
  }
}

module.exports = {
  ActivationGateError,
  HARD_BLOCKS,
  assertActivationEligible,
  assertPinnedTuple,
  assertSingleGeneration,
};
