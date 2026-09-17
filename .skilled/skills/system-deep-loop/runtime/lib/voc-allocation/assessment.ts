// ───────────────────────────────────────────────────────────────────
// MODULE: Value of Computation Assessment
// ───────────────────────────────────────────────────────────────────

import {
  budgetVector,
  budgetVectorFits,
} from '../hierarchical-budgets/index.js';
import {
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from '../event-envelope/index.js';

import type { BudgetVector } from '../hierarchical-budgets/index.js';
import type { FanInEventCut } from '../conditional-fanin/index.js';
import type {
  VocAllocationPolicy,
  VocAssessment,
  VocBudgetPressureRatios,
  VocBudgetSnapshot,
  VocCandidateIdentity,
  VocCandidateInput,
  VocConfidenceInput,
  VocExclusionReason,
  VocMarginalBenefitAssessment,
  VocProxyDiagnostics,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const VOC_ASSESSMENT_VERSION = 1;

const BASIS_POINTS = 10_000;
const SCORE_SCALE = 1_000_000;
const HASH_PATTERN = /^[a-f0-9]{64}$/;

// ───────────────────────────────────────────────────────────────────
// 2. INTEGER MATH
// ───────────────────────────────────────────────────────────────────

function safeNumber(value: bigint, field: string): number {
  if (value < 0n || value > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new RangeError(`${field} exceeds the non-negative safe integer range`);
  }
  return Number(value);
}

function scaledFloor(value: number, scale: number, divisor: number, field: string): number {
  return safeNumber(
    (BigInt(value) * BigInt(scale)) / BigInt(divisor),
    field,
  );
}

function ratioBasisPoints(estimate: number, remainder: number, field: string): number {
  if (estimate === 0) return 0;
  if (estimate < 0 || remainder <= 0) {
    throw new RangeError(`${field} requires a non-negative estimate and positive remainder`);
  }
  const numerator = BigInt(estimate) * BigInt(BASIS_POINTS);
  return safeNumber(
    (numerator + BigInt(remainder) - 1n) / BigInt(remainder),
    field,
  );
}

function sumSafe(values: readonly number[], field: string): number {
  return safeNumber(
    values.reduce((sum, value) => sum + BigInt(value), 0n),
    field,
  );
}

// ───────────────────────────────────────────────────────────────────
// 3. VALIDATION AND NORMALIZATION
// ───────────────────────────────────────────────────────────────────

function isIdentity(value: string): boolean {
  return typeof value === 'string' && value.trim() !== '' && value.length <= 1_024;
}

function requireNonNegativeInteger(value: number, field: string): number {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError(`${field} must be a non-negative safe integer`);
  }
  return value;
}

function requireBasisPoints(value: number, field: string): number {
  const validated = requireNonNegativeInteger(value, field);
  if (validated > BASIS_POINTS) {
    throw new RangeError(`${field} must not exceed 10000 basis points`);
  }
  return validated;
}

function uniqueSorted(values: readonly string[], field: string): readonly string[] {
  if (!Array.isArray(values) || values.some((value) => !isIdentity(value))) {
    throw new TypeError(`${field} must contain bounded non-empty identities`);
  }
  return Object.freeze([...new Set(values)].sort());
}

function normalizeIdentity(identity: VocCandidateIdentity): VocCandidateIdentity {
  if (Object.values(identity).some((value) => !isIdentity(value))) {
    throw new TypeError('VOC candidate identity fields must be bounded and non-empty');
  }
  return Object.freeze({ ...identity });
}

function normalizeConfidence(confidence: VocConfidenceInput): VocConfidenceInput {
  const lowerBoundValue = requireNonNegativeInteger(
    confidence.lowerBoundValue,
    'confidence.lowerBoundValue',
  );
  const predictedValue = requireNonNegativeInteger(
    confidence.predictedValue,
    'confidence.predictedValue',
  );
  const upperBoundValue = requireNonNegativeInteger(
    confidence.upperBoundValue,
    'confidence.upperBoundValue',
  );
  if (lowerBoundValue > predictedValue || predictedValue > upperBoundValue) {
    throw new RangeError('Confidence bounds must contain the predicted value');
  }
  if (
    (confidence.observedValue === null) !== (confidence.observedAtSequence === null)
  ) {
    throw new TypeError('Observed value and sequence must either both exist or both be null');
  }
  const observedValue = confidence.observedValue === null
    ? null
    : requireNonNegativeInteger(confidence.observedValue, 'confidence.observedValue');
  const observedAtSequence = confidence.observedAtSequence === null
    ? null
    : requireNonNegativeInteger(
      confidence.observedAtSequence,
      'confidence.observedAtSequence',
    );
  if (!isIdentity(confidence.priorSource) || !isIdentity(confidence.calibrationVersion)) {
    throw new TypeError('Confidence provenance and calibration version must be non-empty');
  }
  return Object.freeze({
    calibrationEpoch: requireNonNegativeInteger(
      confidence.calibrationEpoch,
      'confidence.calibrationEpoch',
    ),
    calibrationEvidenceIds: uniqueSorted(
      confidence.calibrationEvidenceIds,
      'confidence.calibrationEvidenceIds',
    ),
    calibrationVersion: confidence.calibrationVersion,
    confidenceBps: requireBasisPoints(confidence.confidenceBps, 'confidence.confidenceBps'),
    lowerBoundValue,
    observedAtSequence,
    observedValue,
    predictedValue,
    priorSource: confidence.priorSource,
    sampleCount: requireNonNegativeInteger(confidence.sampleCount, 'confidence.sampleCount'),
    upperBoundValue,
    validThroughSequence: requireNonNegativeInteger(
      confidence.validThroughSequence,
      'confidence.validThroughSequence',
    ),
  });
}

function normalizeProxyDiagnostics(
  diagnostics: VocProxyDiagnostics,
): VocProxyDiagnostics {
  return Object.freeze({
    correlatedEvidenceCount: requireNonNegativeInteger(
      diagnostics.correlatedEvidenceCount,
      'proxyDiagnostics.correlatedEvidenceCount',
    ),
    duplicateEvidenceCount: requireNonNegativeInteger(
      diagnostics.duplicateEvidenceCount,
      'proxyDiagnostics.duplicateEvidenceCount',
    ),
    rawNoveltyCount: requireNonNegativeInteger(
      diagnostics.rawNoveltyCount,
      'proxyDiagnostics.rawNoveltyCount',
    ),
    rawOutputCount: requireNonNegativeInteger(
      diagnostics.rawOutputCount,
      'proxyDiagnostics.rawOutputCount',
    ),
  });
}

function normalizeEventCut(cut: FanInEventCut): FanInEventCut {
  if (
    !isIdentity(cut.ledgerId)
    || !Number.isSafeInteger(cut.sequence)
    || cut.sequence <= 0
    || !HASH_PATTERN.test(cut.recordHash)
    || !HASH_PATTERN.test(cut.registryDigest)
  ) {
    throw new TypeError('VOC event cut must identify one verified positive ledger sequence');
  }
  return Object.freeze({ ...cut });
}

function normalizeBudgetSnapshot(snapshot: VocBudgetSnapshot): VocBudgetSnapshot {
  if (
    !isIdentity(snapshot.ledgerId)
    || !isIdentity(snapshot.scopeId)
    || !HASH_PATTERN.test(snapshot.ledgerRecordHash)
    || !HASH_PATTERN.test(snapshot.projectionDigest)
    || !Number.isSafeInteger(snapshot.ledgerSequence)
    || snapshot.ledgerSequence < 0
  ) {
    throw new TypeError('VOC budget snapshot identity is incomplete');
  }
  const scopePath = uniqueSorted(snapshot.scopePath, 'budgetSnapshot.scopePath');
  const originalPath = [...snapshot.scopePath];
  if (
    scopePath.length !== originalPath.length
    || originalPath.at(-1) !== snapshot.scopeId
    || snapshot.authorizedRemainders.length !== originalPath.length
  ) {
    throw new TypeError('VOC budget snapshot must cover the exact ordered scope path');
  }
  const authorizedRemainders = snapshot.authorizedRemainders.map((entry, index) => {
    if (entry.scopeId !== originalPath[index]) {
      throw new TypeError('VOC budget remainder order must match the ancestor path');
    }
    return Object.freeze({
      scopeId: entry.scopeId,
      remaining: budgetVector(entry.remaining),
    });
  });
  return Object.freeze({
    ...snapshot,
    authorizedRemainders: Object.freeze(authorizedRemainders),
    scopePath: Object.freeze(originalPath),
  });
}

// ───────────────────────────────────────────────────────────────────
// 4. BENEFIT AND PRESSURE
// ───────────────────────────────────────────────────────────────────

function assessBenefit(
  input: VocCandidateInput,
  policy: VocAllocationPolicy,
): VocMarginalBenefitAssessment {
  const source = input.marginalBenefit;
  const weightedCoverageGain = requireNonNegativeInteger(
    source.weightedCoverageGain,
    'marginalBenefit.weightedCoverageGain',
  );
  const contradictionResolutionImpact = requireNonNegativeInteger(
    source.contradictionResolutionImpact,
    'marginalBenefit.contradictionResolutionImpact',
  );
  const contradictionResolutionProbabilityBps = requireBasisPoints(
    source.contradictionResolutionProbabilityBps,
    'marginalBenefit.contradictionResolutionProbabilityBps',
  );
  const blockerReductionValue = requireNonNegativeInteger(
    source.blockerReductionValue,
    'marginalBenefit.blockerReductionValue',
  );
  const uncertaintyReductionValue = requireNonNegativeInteger(
    source.uncertaintyReductionValue,
    'marginalBenefit.uncertaintyReductionValue',
  );
  const diminishingReturnBps = requireBasisPoints(
    source.diminishingReturnBps,
    'marginalBenefit.diminishingReturnBps',
  );
  const contradictionExpectedValue = scaledFloor(
    contradictionResolutionImpact,
    contradictionResolutionProbabilityBps,
    BASIS_POINTS,
    'contradictionExpectedValue',
  );
  const weightedBenefitBeforeDiminishing = sumSafe([
    scaledFloor(
      weightedCoverageGain,
      policy.benefitWeights.weightedCoverageBps,
      BASIS_POINTS,
      'weightedCoverageValue',
    ),
    scaledFloor(
      contradictionExpectedValue,
      policy.benefitWeights.contradictionResolutionBps,
      BASIS_POINTS,
      'weightedContradictionValue',
    ),
    scaledFloor(
      blockerReductionValue,
      policy.benefitWeights.blockerReductionBps,
      BASIS_POINTS,
      'weightedBlockerValue',
    ),
    scaledFloor(
      uncertaintyReductionValue,
      policy.benefitWeights.uncertaintyReductionBps,
      BASIS_POINTS,
      'weightedUncertaintyValue',
    ),
  ], 'weightedBenefitBeforeDiminishing');
  const diminishedBenefitValue = scaledFloor(
    weightedBenefitBeforeDiminishing,
    diminishingReturnBps,
    BASIS_POINTS,
    'diminishedBenefitValue',
  );
  return Object.freeze({
    blockerReductionValue,
    contradictionExpectedValue,
    contradictionResolutionImpact,
    contradictionResolutionProbabilityBps,
    diminishedBenefitValue,
    diminishingReturnBps,
    proxyDiagnostics: normalizeProxyDiagnostics(input.proxyDiagnostics),
    uncertaintyReductionValue,
    weightedBenefitBeforeDiminishing,
    weightedCoverageGain,
  });
}

function compatibleCostIdentity(left: BudgetVector, right: BudgetVector): boolean {
  return left.cost.currency === right.cost.currency
    && left.cost.scale === right.cost.scale
    && left.cost.pricingDigest === right.cost.pricingDigest
    && left.wallTime.deadlineMonotonicMs === right.wallTime.deadlineMonotonicMs;
}

function maxRatioForDimension(
  estimate: number,
  remainders: readonly number[],
  field: string,
): number {
  return Math.max(...remainders.map((remainder) => (
    ratioBasisPoints(estimate, remainder, field)
  )));
}

function assessPressure(
  cost: BudgetVector,
  snapshot: VocBudgetSnapshot,
): VocBudgetPressureRatios {
  const tokensBps = maxRatioForDimension(
    cost.tokens.count,
    snapshot.authorizedRemainders.map((entry) => entry.remaining.tokens.count),
    'tokens pressure',
  );
  const costBps = maxRatioForDimension(
    cost.cost.minorUnits,
    snapshot.authorizedRemainders.map((entry) => entry.remaining.cost.minorUnits),
    'cost pressure',
  );
  const iterationsBps = maxRatioForDimension(
    cost.iterations.attempts,
    snapshot.authorizedRemainders.map((entry) => entry.remaining.iterations.attempts),
    'iterations pressure',
  );
  const wallTimeBps = maxRatioForDimension(
    cost.wallTime.durationMs,
    snapshot.authorizedRemainders.map((entry) => entry.remaining.wallTime.durationMs),
    'wall-time pressure',
  );
  const ordered = [
    ['tokens', tokensBps],
    ['cost', costBps],
    ['iterations', iterationsBps],
    ['wall-time', wallTimeBps],
  ] as const;
  const governing = ordered.reduce((highest, candidate) => (
    candidate[1] > highest[1] ? candidate : highest
  ));
  return Object.freeze({
    costBps,
    governingDimension: governing[0],
    governingPressureBps: governing[1],
    iterationsBps,
    tokensBps,
    wallTimeBps,
  });
}

// ───────────────────────────────────────────────────────────────────
// 5. PUBLIC API
// ───────────────────────────────────────────────────────────────────

/** Score one explicit marginal quantum using only durable, versioned inputs. */
export function assessVocCandidate(
  candidate: VocCandidateInput,
  policy: VocAllocationPolicy,
  expectedEventCut: FanInEventCut,
): VocAssessment {
  const identity = normalizeIdentity(candidate.identity);
  const confidence = normalizeConfidence(candidate.confidence);
  const eventCut = normalizeEventCut(candidate.eventCut);
  const normalizedExpectedCut = normalizeEventCut(expectedEventCut);
  const marginalCost = budgetVector(candidate.marginalCost);
  const budgetSnapshot = normalizeBudgetSnapshot(candidate.budgetSnapshot);
  const marginalBenefit = assessBenefit(candidate, policy);
  const exclusions = new Set<VocExclusionReason>();

  if (canonicalJson(eventCut) !== canonicalJson(normalizedExpectedCut)) {
    exclusions.add('event-cut-mismatch');
  }
  if (!candidate.healthEligible) exclusions.add('health-ineligible');
  if (!candidate.fanInEligible) exclusions.add('fan-in-ineligible');
  if (candidate.estimatorVersion !== policy.estimatorVersion) {
    exclusions.add('estimator-version-mismatch');
  }
  if (
    confidence.calibrationVersion !== policy.calibrationVersion
    || confidence.calibrationEpoch !== policy.calibrationEpoch
  ) {
    exclusions.add('calibration-version-mismatch');
  }
  if (confidence.validThroughSequence < eventCut.sequence) {
    exclusions.add('stale-estimate');
  }
  const isColdStart = confidence.sampleCount === 0;
  if (
    confidence.confidenceBps < policy.minimumConfidenceBps
    && !(isColdStart && policy.explorationReserveQuanta > 0)
  ) {
    exclusions.add('confidence-insufficient');
  }
  if (marginalCost.cost.pricingDigest !== policy.pricingDigest) {
    exclusions.add('pricing-version-mismatch');
  }
  if (
    marginalCost.tokens.count === 0
    && marginalCost.cost.minorUnits === 0
    && marginalCost.iterations.attempts === 0
    && marginalCost.wallTime.durationMs === 0
  ) {
    exclusions.add('cost-envelope-invalid');
  }

  let budgetPressure: VocBudgetPressureRatios | null = null;
  const snapshotComplete = budgetSnapshot.authorizedRemainders.length > 0
    && budgetSnapshot.authorizedRemainders.every((entry) => (
      compatibleCostIdentity(marginalCost, entry.remaining)
    ));
  if (!snapshotComplete) {
    exclusions.add('budget-snapshot-incomplete');
  } else if (budgetSnapshot.authorizedRemainders.some((entry) => (
    !budgetVectorFits(marginalCost, entry.remaining)
  ))) {
    exclusions.add('budget-capacity-insufficient');
  } else if (!exclusions.has('cost-envelope-invalid')) {
    budgetPressure = assessPressure(marginalCost, budgetSnapshot);
  }

  if (marginalBenefit.diminishedBenefitValue <= 0) {
    exclusions.add('non-positive-value');
  }
  const rawScore = budgetPressure === null || marginalBenefit.diminishedBenefitValue <= 0
    ? 0
    : scaledFloor(
      marginalBenefit.diminishedBenefitValue,
      SCORE_SCALE,
      budgetPressure.governingPressureBps,
      'rawScore',
    );
  if (rawScore <= 0) exclusions.add('non-positive-value');
  const consecutiveSkips = requireNonNegativeInteger(
    candidate.consecutiveSkips,
    'consecutiveSkips',
  );
  const agingCreditBps = safeNumber(
    [
      BigInt(consecutiveSkips) * BigInt(policy.agingCreditPerSkipBps),
      BigInt(policy.agingCreditCapBps),
    ].reduce((lowest, value) => (value < lowest ? value : lowest)),
    'agingCreditBps',
  );
  const eligible = exclusions.size === 0 && rawScore > 0;
  const adjustedScore = eligible
    ? scaledFloor(
      rawScore,
      BASIS_POINTS + agingCreditBps,
      BASIS_POINTS,
      'adjustedScore',
    )
    : 0;
  const fairness = Object.freeze({
    agingCreditBps,
    explorationEligible: eligible && isColdStart,
    minimumServiceEligible: eligible
      && consecutiveSkips >= policy.maximumConsecutiveSkips,
  });
  const assessmentFacts = {
    adjustedScore,
    assessmentVersion: VOC_ASSESSMENT_VERSION,
    budgetPressure,
    budgetSnapshot,
    candidate: identity,
    confidence,
    durableSignalEventIds: uniqueSorted(
      candidate.durableSignalEventIds,
      'durableSignalEventIds',
    ),
    eligible,
    estimatorVersion: candidate.estimatorVersion,
    eventCut,
    evidenceSnapshotDigest: candidate.evidenceSnapshotDigest,
    exclusionReasons: [...exclusions].sort(),
    fairness,
    marginalBenefit,
    marginalCost,
    policyDigest: policy.policyDigest,
    rawScore,
  };
  if (!HASH_PATTERN.test(candidate.evidenceSnapshotDigest)) {
    throw new TypeError('evidenceSnapshotDigest must be a lowercase SHA-256 digest');
  }
  const assessmentDigest = sha256Bytes(canonicalBytes(assessmentFacts));
  return Object.freeze({
    ...assessmentFacts,
    assessmentDigest,
    assessmentId: `voc-assessment:${assessmentDigest}`,
    durableSignalEventIds: Object.freeze(assessmentFacts.durableSignalEventIds),
    exclusionReasons: Object.freeze(assessmentFacts.exclusionReasons),
  });
}
