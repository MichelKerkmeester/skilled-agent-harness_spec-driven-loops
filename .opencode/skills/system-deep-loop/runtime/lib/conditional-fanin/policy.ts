import {
  canonicalBytes,
  sha256Bytes,
} from '../event-envelope/index.js';
import {
  CONDITIONAL_FANIN_POLICY_VERSION,
} from './types.js';

import type { ConditionalFanInPolicy } from './types.js';

const HASH_PATTERN = /^[a-f0-9]{64}$/;

function positiveInteger(value: number, field: string): number {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new RangeError(`${field} must be a positive safe integer`);
  }
  return value;
}

export function validateConditionalFanInPolicy(
  policy: ConditionalFanInPolicy,
): ConditionalFanInPolicy {
  if (policy.policyVersion !== CONDITIONAL_FANIN_POLICY_VERSION) {
    throw new TypeError('Unsupported conditional fan-in policy version');
  }
  positiveInteger(policy.minimumAcceptedCount, 'minimumAcceptedCount');
  positiveInteger(policy.minimumProvenanceGroups, 'minimumProvenanceGroups');
  if (
    !Number.isSafeInteger(policy.minimumSupportBasisPoints)
    || policy.minimumSupportBasisPoints < 1
    || policy.minimumSupportBasisPoints > 10_000
  ) {
    throw new RangeError('minimumSupportBasisPoints must be between 1 and 10000');
  }
  if (policy.partialFailurePolicyReference.trim() === '') {
    throw new TypeError('partialFailurePolicyReference must be non-empty');
  }
  if (
    policy.valueOfComputation.kind !== 'none'
    && policy.valueOfComputation.kind !== 'rank-only'
  ) {
    throw new TypeError('Unsupported value-of-computation policy kind');
  }
  positiveInteger(policy.valueOfComputation.version, 'valueOfComputation.version');
  if (
    policy.valueOfComputation.kind === 'none'
    && policy.valueOfComputation.signalDigest !== null
  ) {
    throw new TypeError('Disabled value-of-computation policy cannot carry a signal digest');
  }
  if (
    policy.valueOfComputation.kind === 'rank-only'
    && (
      policy.valueOfComputation.signalDigest === null
      || !HASH_PATTERN.test(policy.valueOfComputation.signalDigest)
    )
  ) {
    throw new TypeError('Rank-only value-of-computation policy requires a SHA-256 digest');
  }
  return policy;
}

export function conditionalFanInPolicyDigest(policy: ConditionalFanInPolicy): string {
  validateConditionalFanInPolicy(policy);
  return sha256Bytes(canonicalBytes(policy));
}

export function defaultConditionalFanInPolicy(input: {
  minimumAcceptedCount: number;
  minimumSupportBasisPoints: number;
  minimumProvenanceGroups: number;
  partialFailurePolicyReference: string;
}): ConditionalFanInPolicy {
  return Object.freeze({
    policyVersion: CONDITIONAL_FANIN_POLICY_VERSION,
    minimumAcceptedCount: input.minimumAcceptedCount,
    minimumSupportBasisPoints: input.minimumSupportBasisPoints,
    minimumProvenanceGroups: input.minimumProvenanceGroups,
    partialFailurePolicyReference: input.partialFailurePolicyReference,
    valueOfComputation: Object.freeze({
      kind: 'none',
      version: 1,
      signalDigest: null,
    }),
  });
}
