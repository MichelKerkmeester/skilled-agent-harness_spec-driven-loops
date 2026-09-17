// ───────────────────────────────────────────────────────────────────
// MODULE: Value of Computation Allocation Policy
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';

import type {
  VocAllocationPolicy,
  VocAllocationPolicyInput,
  VocBenefitWeights,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const BASIS_POINTS = 10_000;
const HASH_PATTERN = /^[a-f0-9]{64}$/;

// ───────────────────────────────────────────────────────────────────
// 2. VALIDATION
// ───────────────────────────────────────────────────────────────────

function requireIdentity(value: string, field: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError(`${field} must be a non-empty identity`);
  }
  return value;
}

function requirePositiveInteger(value: number, field: string): number {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new RangeError(`${field} must be a positive safe integer`);
  }
  return value;
}

function requireNonNegativeInteger(value: number, field: string): number {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError(`${field} must be a non-negative safe integer`);
  }
  return value;
}

function requireBasisPoints(value: number, field: string, allowZero = true): number {
  if (
    !Number.isSafeInteger(value)
    || value < (allowZero ? 0 : 1)
    || value > BASIS_POINTS
  ) {
    throw new RangeError(`${field} must be between ${allowZero ? 0 : 1} and 10000`);
  }
  return value;
}

function validateBenefitWeights(weights: VocBenefitWeights): VocBenefitWeights {
  const validated = Object.freeze({
    blockerReductionBps: requireBasisPoints(
      weights.blockerReductionBps,
      'benefitWeights.blockerReductionBps',
    ),
    contradictionResolutionBps: requireBasisPoints(
      weights.contradictionResolutionBps,
      'benefitWeights.contradictionResolutionBps',
    ),
    uncertaintyReductionBps: requireBasisPoints(
      weights.uncertaintyReductionBps,
      'benefitWeights.uncertaintyReductionBps',
    ),
    weightedCoverageBps: requireBasisPoints(
      weights.weightedCoverageBps,
      'benefitWeights.weightedCoverageBps',
    ),
  });
  if (Object.values(validated).every((weight) => weight === 0)) {
    throw new RangeError('At least one evidence-value component must have positive weight');
  }
  return validated;
}

// ───────────────────────────────────────────────────────────────────
// 3. PUBLIC API
// ───────────────────────────────────────────────────────────────────

/** Validate, freeze, and content-address one allocation policy version. */
export function createVocAllocationPolicy(
  input: VocAllocationPolicyInput,
): VocAllocationPolicy {
  if (input.kind !== 'greedy' && input.kind !== 'proportional') {
    throw new TypeError('VOC allocation policy kind is unsupported');
  }
  if (!HASH_PATTERN.test(input.pricingDigest)) {
    throw new TypeError('pricingDigest must be a lowercase SHA-256 digest');
  }

  const normalized: VocAllocationPolicyInput = Object.freeze({
    agingCreditCapBps: requireBasisPoints(input.agingCreditCapBps, 'agingCreditCapBps'),
    agingCreditPerSkipBps: requireBasisPoints(
      input.agingCreditPerSkipBps,
      'agingCreditPerSkipBps',
    ),
    benefitWeights: validateBenefitWeights(input.benefitWeights),
    calibrationEpoch: requirePositiveInteger(input.calibrationEpoch, 'calibrationEpoch'),
    calibrationVersion: requireIdentity(input.calibrationVersion, 'calibrationVersion'),
    candidateQuantumCeiling: requirePositiveInteger(
      input.candidateQuantumCeiling,
      'candidateQuantumCeiling',
    ),
    estimatorVersion: requireIdentity(input.estimatorVersion, 'estimatorVersion'),
    explorationReserveQuanta: requireNonNegativeInteger(
      input.explorationReserveQuanta,
      'explorationReserveQuanta',
    ),
    kind: input.kind,
    maximumConsecutiveSkips: requireNonNegativeInteger(
      input.maximumConsecutiveSkips,
      'maximumConsecutiveSkips',
    ),
    minimumConfidenceBps: requireBasisPoints(
      input.minimumConfidenceBps,
      'minimumConfidenceBps',
    ),
    minimumServiceQuanta: requireNonNegativeInteger(
      input.minimumServiceQuanta,
      'minimumServiceQuanta',
    ),
    modeShareCeilingBps: requireBasisPoints(
      input.modeShareCeilingBps,
      'modeShareCeilingBps',
      false,
    ),
    policyVersion: requirePositiveInteger(input.policyVersion, 'policyVersion'),
    pricingDigest: input.pricingDigest,
    regionShareCeilingBps: requireBasisPoints(
      input.regionShareCeilingBps,
      'regionShareCeilingBps',
      false,
    ),
    totalQuanta: requirePositiveInteger(input.totalQuanta, 'totalQuanta'),
  });
  if (normalized.explorationReserveQuanta > normalized.totalQuanta) {
    throw new RangeError('explorationReserveQuanta cannot exceed totalQuanta');
  }
  if (normalized.minimumServiceQuanta > normalized.explorationReserveQuanta) {
    throw new RangeError('minimumServiceQuanta must fit inside the exploration reserve');
  }

  return Object.freeze({
    ...normalized,
    policyDigest: sha256Bytes(canonicalBytes(normalized)),
  });
}
