// ───────────────────────────────────────────────────────────────────
// MODULE: Value of Computation Allocation Decision
// ───────────────────────────────────────────────────────────────────

import {
  BudgetReasonCodes,
  HierarchicalBudgetAuthority,
  addBudgetVectors,
  budgetEvidenceDigest,
  budgetVector,
  zeroBudgetVector,
} from '../hierarchical-budgets/index.js';
import {
  canonicalBytes,
  canonicalJson,
  sha256Bytes,
} from '../event-envelope/index.js';
import { planVocAllocation, vocCandidateId } from './allocation.js';
import { populateVocUsefulnessRanks } from './fan-in-handoff.js';

import type { BudgetVector } from '../hierarchical-budgets/index.js';
import type {
  ExecuteVocAllocationInput,
  ExecuteVocAllocationResult,
  UniformStaticAllocationBaseline,
  VocAdmissionEvidence,
  VocAllocationDecision,
  VocAllocationDecisionStatus,
  VocAssessment,
  VocCandidateAllocation,
  VocShadowComparison,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

export const VOC_ALLOCATION_DECISION_VERSION = 1;

const BASIS_POINTS = 10_000;
const HASH_PATTERN = /^[a-f0-9]{64}$/;

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

function safeNumber(value: bigint, field: string): number {
  if (value < 0n || value > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new RangeError(`${field} exceeds the non-negative safe integer range`);
  }
  return Number(value);
}

function multiply(value: number, multiplier: number, field: string): number {
  return safeNumber(BigInt(value) * BigInt(multiplier), field);
}

function scaleBudgetVector(vector: BudgetVector, quanta: number): BudgetVector {
  if (!Number.isSafeInteger(quanta) || quanta <= 0) {
    throw new RangeError('Reservation quanta must be a positive safe integer');
  }
  return budgetVector({
    tokens: {
      ...vector.tokens,
      count: multiply(vector.tokens.count, quanta, 'token reservation'),
    },
    cost: {
      ...vector.cost,
      minorUnits: multiply(vector.cost.minorUnits, quanta, 'cost reservation'),
    },
    iterations: {
      ...vector.iterations,
      attempts: multiply(vector.iterations.attempts, quanta, 'attempt reservation'),
    },
    wallTime: {
      ...vector.wallTime,
      durationMs: multiply(vector.wallTime.durationMs, quanta, 'wall-time reservation'),
    },
  });
}

function normalizeAllocation(
  allocation: VocCandidateAllocation,
): VocCandidateAllocation {
  if (
    typeof allocation.candidateId !== 'string'
    || allocation.candidateId.trim() === ''
    || !Number.isSafeInteger(allocation.quanta)
    || allocation.quanta <= 0
  ) {
    throw new TypeError('Uniform/static allocations require identity and positive quanta');
  }
  return Object.freeze({ ...allocation });
}

function normalizeBaseline(
  baseline: UniformStaticAllocationBaseline,
): UniformStaticAllocationBaseline {
  if (
    typeof baseline.policyVersion !== 'string'
    || baseline.policyVersion.trim() === ''
    || !Number.isSafeInteger(baseline.expectedEvidenceValue)
    || baseline.expectedEvidenceValue < 0
  ) {
    throw new TypeError('Uniform/static baseline identity and value must be valid');
  }
  const allocations = baseline.allocations.map(normalizeAllocation);
  if (new Set(allocations.map((allocation) => allocation.candidateId)).size
    !== allocations.length) {
    throw new TypeError('Uniform/static baseline cannot repeat a candidate identity');
  }
  const starvedCandidateIds = [...new Set(baseline.starvedCandidateIds)].sort();
  if (starvedCandidateIds.some((candidateId) => candidateId.trim() === '')) {
    throw new TypeError('Starved candidate identities must be non-empty');
  }
  return Object.freeze({
    allocations: Object.freeze(allocations),
    expectedEvidenceValue: baseline.expectedEvidenceValue,
    policyVersion: baseline.policyVersion,
    starvedCandidateIds: Object.freeze(starvedCandidateIds),
    typedSpend: budgetVector(baseline.typedSpend),
  });
}

function assessmentFor(
  assessments: readonly VocAssessment[],
  candidateId: string,
): VocAssessment {
  const assessment = assessments.find((candidate) => (
    vocCandidateId(candidate.candidate) === candidateId
  ));
  if (!assessment) throw new TypeError('Allocation references a missing assessment');
  return assessment;
}

function benefitForQuanta(assessment: VocAssessment, quanta: number): number {
  let marginal = assessment.marginalBenefit.diminishedBenefitValue;
  let total = 0n;
  for (let index = 0; index < quanta; index += 1) {
    total += BigInt(marginal);
    marginal = safeNumber(
      (BigInt(marginal) * BigInt(assessment.marginalBenefit.diminishingReturnBps))
        / BigInt(BASIS_POINTS),
      'diminished evidence value',
    );
  }
  return safeNumber(total, 'adaptive evidence value');
}

function shadowComparison(
  baseline: UniformStaticAllocationBaseline,
  admissions: readonly VocAdmissionEvidence[],
  assessments: readonly VocAssessment[],
  allocations: readonly VocCandidateAllocation[],
): VocShadowComparison {
  const adaptiveEstimatedEvidenceValue = safeNumber(
    allocations.reduce((total, allocation) => (
      total + BigInt(benefitForQuanta(
        assessmentFor(assessments, allocation.candidateId),
        allocation.quanta,
      ))
    ), 0n),
    'adaptiveEstimatedEvidenceValue',
  );
  let adaptiveTypedReserved = zeroBudgetVector(baseline.typedSpend);
  for (const admission of admissions) {
    if (admission.reservationGranted) {
      adaptiveTypedReserved = addBudgetVectors(adaptiveTypedReserved, admission.requested);
    }
  }
  const facts = {
    adaptiveEstimatedEvidenceValue,
    adaptiveTypedReserved,
    authoritativeDispatchMoved: false as const,
    parity: canonicalJson(allocations) === canonicalJson(baseline.allocations)
      ? 'same-order-and-quanta' as const
      : 'different-shadow-proposal' as const,
    uniformStaticBaseline: baseline,
  };
  const comparisonDigest = sha256Bytes(canonicalBytes(facts));
  return Object.freeze({
    ...facts,
    comparisonDigest,
    comparisonId: `voc-shadow-comparison:${comparisonDigest}`,
  });
}

function decisionStatus(
  planAllocations: readonly VocCandidateAllocation[],
  admissions: readonly VocAdmissionEvidence[],
): VocAllocationDecisionStatus {
  if (planAllocations.length === 0) return 'shadow-no-eligible-value';
  if (admissions.every((admission) => admission.reservationGranted)) {
    return 'shadow-evaluated';
  }
  if (admissions.some((admission) => (
    admission.budgetDecision.reasonCode === BudgetReasonCodes.BUDGET_EXHAUSTED
    || admission.budgetDecision.reasonCode === BudgetReasonCodes.DEADLINE_EXHAUSTED
  ))) {
    return 'shadow-incomplete-budget-exhausted';
  }
  return 'shadow-incomplete-admission-denied';
}

async function requestAdmissions(
  input: ExecuteVocAllocationInput,
  assessments: readonly VocAssessment[],
  allocations: readonly VocCandidateAllocation[],
): Promise<readonly VocAdmissionEvidence[]> {
  const admissions: VocAdmissionEvidence[] = [];
  for (const allocation of allocations) {
    const assessment = assessmentFor(assessments, allocation.candidateId);
    const requested = scaleBudgetVector(assessment.marginalCost, allocation.quanta);
    const identityDigest = sha256Bytes(canonicalBytes({
      candidateId: allocation.candidateId,
      eventCut: input.eventCut,
      policyDigest: input.policy.policyDigest,
      quanta: allocation.quanta,
      requested,
      scopeId: assessment.budgetSnapshot.scopeId,
    }));
    const reservationId = `voc-reservation:${identityDigest}`;
    const result = await input.authority.admit({
      ...input.admissionEvidence,
      dispatchId: `voc-shadow-dispatch:${identityDigest}`,
      estimate: requested,
      evidenceDigest: budgetEvidenceDigest({
        assessmentDigest: assessment.assessmentDigest,
        candidateId: allocation.candidateId,
        policyDigest: input.policy.policyDigest,
      }),
      leaseDurationMs: input.leaseDurationMs,
      operationId: `voc-admit:${identityDigest}`,
      requestId: `voc-admit:${identityDigest}`,
      reservationId,
      scopeId: assessment.budgetSnapshot.scopeId,
    });
    const reservationGranted = result.decision.status === 'granted'
      && result.decision.dispatchAllowed
      && result.decision.reasonCode === BudgetReasonCodes.ALLOWED;
    admissions.push(Object.freeze({
      budgetAuthorityDispatchAllowed: result.decision.dispatchAllowed,
      budgetDecision: result.decision,
      candidateId: allocation.candidateId,
      converged: false,
      incomplete: !reservationGranted,
      proposedQuanta: allocation.quanta,
      requested,
      reservationGranted,
      reservationId,
      shadowDispatchAuthorized: false,
    }));
  }
  return Object.freeze(admissions);
}

// ───────────────────────────────────────────────────────────────────
// 3. PUBLIC API
// ───────────────────────────────────────────────────────────────────

/** Assess, allocate, reserve, rank, and finalize one non-authoritative decision. */
export async function executeVocAllocationShadow(
  input: ExecuteVocAllocationInput,
): Promise<ExecuteVocAllocationResult> {
  if (!(input.authority instanceof HierarchicalBudgetAuthority)) {
    throw new TypeError('VOC admission requires the shipped hierarchical budget authority');
  }
  if (
    !HASH_PATTERN.test(input.replayFingerprint)
    || input.runId.trim() === ''
    || !Number.isSafeInteger(input.leaseDurationMs)
    || input.leaseDurationMs <= 0
    || input.trigger.eventId.trim() === ''
    || !Number.isSafeInteger(input.trigger.eventSequence)
    || input.trigger.eventSequence <= 0
    || input.trigger.eventSequence > input.eventCut.sequence
  ) {
    throw new TypeError('VOC execution identity, trigger, or lease is invalid');
  }
  if (input.candidates.some((candidate) => candidate.identity.runId !== input.runId)) {
    throw new TypeError('Every VOC candidate must belong to the decision run');
  }

  const baseline = normalizeBaseline(input.baseline);
  const plan = planVocAllocation(input.candidates, input.policy, input.eventCut);
  const admissions = await requestAdmissions(input, plan.assessments, plan.allocations);
  const fanInPopulation = populateVocUsefulnessRanks(
    input.outstandingBranches,
    plan.assessments,
  );
  const comparison = shadowComparison(
    baseline,
    admissions,
    plan.assessments,
    plan.allocations,
  );
  const status = decisionStatus(plan.allocations, admissions);
  const body = {
    admissions,
    authority: 'shadow' as const,
    authoritativeAllocationPath: 'uniform-static' as const,
    authoritativeDispatchMoved: false as const,
    converged: false as const,
    decisionVersion: VOC_ALLOCATION_DECISION_VERSION,
    eventCut: Object.freeze({ ...input.eventCut }),
    fanInHandoff: fanInPopulation.handoff,
    incomplete: status === 'shadow-incomplete-admission-denied'
      || status === 'shadow-incomplete-budget-exhausted',
    plan,
    policy: input.policy,
    replayFingerprint: input.replayFingerprint,
    runId: input.runId,
    shadowComparison: comparison,
    status,
    supersedesDecisionId: input.supersedesDecisionId ?? null,
    trigger: Object.freeze({ ...input.trigger }),
  };
  const decisionDigest = sha256Bytes(canonicalBytes(body));
  const decision: VocAllocationDecision = Object.freeze({
    ...body,
    decisionDigest,
    decisionId: `voc-allocation:${decisionDigest}`,
  });
  return Object.freeze({
    decision,
    outstandingBranches: fanInPopulation.outstandingBranches,
  });
}
