// ───────────────────────────────────────────────────────────────────
// MODULE: Value of Computation Allocation Policies
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';
import { assessVocCandidate } from './assessment.js';

import type { FanInEventCut } from '../conditional-fanin/index.js';
import type {
  VocAllocationPlan,
  VocAllocationPolicy,
  VocAssessment,
  VocCandidateAllocation,
  VocCandidateIdentity,
  VocCandidateInput,
  VocGreedyTraceEntry,
  VocProportionalTraceEntry,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES AND CONSTANTS
// ───────────────────────────────────────────────────────────────────

interface AllocationState {
  readonly allocationOrder: string[];
  readonly candidateCounts: Map<string, number>;
  readonly modeCounts: Map<string, number>;
  readonly regionCounts: Map<string, number>;
}

interface ProportionalCandidate {
  readonly assessment: VocAssessment;
  readonly candidateId: string;
  readonly capacity: number;
  readonly weight: number;
}

interface MutableProportionalTrace {
  awardedRemainderQuantum: boolean;
  candidateId: string;
  denominator: string;
  floorQuanta: number;
  numerator: string;
  pass: number;
  remainderNumerator: string;
}

const BASIS_POINTS = 10_000;

// ───────────────────────────────────────────────────────────────────
// 2. DETERMINISTIC HELPERS
// ───────────────────────────────────────────────────────────────────

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function safeNumber(value: bigint, field: string): number {
  if (value < 0n || value > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new RangeError(`${field} exceeds the non-negative safe integer range`);
  }
  return Number(value);
}

function scaledFloor(value: number, scale: number, divisor: number): number {
  return safeNumber((BigInt(value) * BigInt(scale)) / BigInt(divisor), 'allocation score');
}

function ceilingQuanta(totalQuanta: number, ceilingBps: number): number {
  return safeNumber(
    (BigInt(totalQuanta) * BigInt(ceilingBps)) / BigInt(BASIS_POINTS),
    'share ceiling',
  );
}

/** Derive one delimiter-safe candidate identity from canonical identity fields. */
export function vocCandidateId(identity: VocCandidateIdentity): string {
  return `voc-candidate:${sha256Bytes(canonicalBytes(identity))}`;
}

function assessmentOrder(left: VocAssessment, right: VocAssessment): number {
  return right.adjustedScore - left.adjustedScore
    || compareText(vocCandidateId(left.candidate), vocCandidateId(right.candidate));
}

function fairnessOrder(left: VocAssessment, right: VocAssessment): number {
  return Number(right.fairness.minimumServiceEligible)
    - Number(left.fairness.minimumServiceEligible)
    || Number(right.fairness.explorationEligible)
      - Number(left.fairness.explorationEligible)
    || assessmentOrder(left, right);
}

function marginalScore(assessment: VocAssessment, allocatedQuanta: number): number {
  let score = assessment.adjustedScore;
  for (let index = 0; index < allocatedQuanta; index += 1) {
    score = scaledFloor(
      score,
      assessment.marginalBenefit.diminishingReturnBps,
      BASIS_POINTS,
    );
  }
  return score;
}

function countFor(map: ReadonlyMap<string, number>, key: string): number {
  return map.get(key) ?? 0;
}

function capacityFor(
  assessment: VocAssessment,
  policy: VocAllocationPolicy,
  state: AllocationState,
): number {
  const candidateId = vocCandidateId(assessment.candidate);
  const candidateCapacity = policy.candidateQuantumCeiling
    - countFor(state.candidateCounts, candidateId);
  const modeCapacity = ceilingQuanta(policy.totalQuanta, policy.modeShareCeilingBps)
    - countFor(state.modeCounts, assessment.candidate.modeId);
  const regionCapacity = ceilingQuanta(policy.totalQuanta, policy.regionShareCeilingBps)
    - countFor(state.regionCounts, assessment.candidate.regionId);
  return Math.max(0, Math.min(candidateCapacity, modeCapacity, regionCapacity));
}

function addAllocation(
  assessment: VocAssessment,
  quanta: number,
  state: AllocationState,
): void {
  if (!Number.isSafeInteger(quanta) || quanta <= 0) return;
  const candidateId = vocCandidateId(assessment.candidate);
  if (!state.candidateCounts.has(candidateId)) state.allocationOrder.push(candidateId);
  state.candidateCounts.set(
    candidateId,
    countFor(state.candidateCounts, candidateId) + quanta,
  );
  state.modeCounts.set(
    assessment.candidate.modeId,
    countFor(state.modeCounts, assessment.candidate.modeId) + quanta,
  );
  state.regionCounts.set(
    assessment.candidate.regionId,
    countFor(state.regionCounts, assessment.candidate.regionId) + quanta,
  );
}

function allocateExplorationFloor(
  assessments: readonly VocAssessment[],
  policy: VocAllocationPolicy,
  state: AllocationState,
  trace: VocGreedyTraceEntry[],
): number {
  let allocated = 0;
  const pool = assessments
    .filter((assessment) => assessment.eligible
      && assessment.adjustedScore > 0
      && (assessment.fairness.explorationEligible
        || assessment.fairness.minimumServiceEligible))
    .sort(fairnessOrder);
  for (const assessment of pool) {
    if (allocated >= policy.explorationReserveQuanta) break;
    const serviceTarget = assessment.fairness.minimumServiceEligible
      ? Math.max(1, policy.minimumServiceQuanta)
      : 1;
    const award = Math.min(
      serviceTarget,
      capacityFor(assessment, policy, state),
      policy.explorationReserveQuanta - allocated,
    );
    for (let offset = 0; offset < award; offset += 1) {
      const prior = countFor(state.candidateCounts, vocCandidateId(assessment.candidate));
      addAllocation(assessment, 1, state);
      trace.push(Object.freeze({
        adjustedMarginalScore: marginalScore(assessment, prior),
        candidateId: vocCandidateId(assessment.candidate),
        quantumOrdinal: prior + 1,
        reason: 'exploration-floor',
      }));
      allocated += 1;
    }
  }
  return allocated;
}

function allocateGreedy(
  assessments: readonly VocAssessment[],
  policy: VocAllocationPolicy,
  state: AllocationState,
  alreadyAllocated: number,
  trace: VocGreedyTraceEntry[],
): void {
  for (let total = alreadyAllocated; total < policy.totalQuanta; total += 1) {
    const candidates = assessments
      .filter((assessment) => assessment.eligible
        && capacityFor(assessment, policy, state) > 0
        && marginalScore(
          assessment,
          countFor(state.candidateCounts, vocCandidateId(assessment.candidate)),
        ) > 0)
      .sort((left, right) => {
        const leftScore = marginalScore(
          left,
          countFor(state.candidateCounts, vocCandidateId(left.candidate)),
        );
        const rightScore = marginalScore(
          right,
          countFor(state.candidateCounts, vocCandidateId(right.candidate)),
        );
        return rightScore - leftScore
          || compareText(vocCandidateId(left.candidate), vocCandidateId(right.candidate));
      });
    const selected = candidates[0];
    if (!selected) break;
    const candidateId = vocCandidateId(selected.candidate);
    const prior = countFor(state.candidateCounts, candidateId);
    addAllocation(selected, 1, state);
    trace.push(Object.freeze({
      adjustedMarginalScore: marginalScore(selected, prior),
      candidateId,
      quantumOrdinal: prior + 1,
      reason: 'highest-adjusted-voc',
    }));
  }
}

function proportionalCandidates(
  assessments: readonly VocAssessment[],
  policy: VocAllocationPolicy,
  state: AllocationState,
): readonly ProportionalCandidate[] {
  return assessments
    .filter((assessment) => assessment.eligible)
    .map((assessment): ProportionalCandidate => {
      const candidateId = vocCandidateId(assessment.candidate);
      return {
        assessment,
        candidateId,
        capacity: capacityFor(assessment, policy, state),
        weight: marginalScore(
          assessment,
          countFor(state.candidateCounts, candidateId),
        ),
      };
    })
    .filter((candidate) => candidate.capacity > 0 && candidate.weight > 0)
    .sort((left, right) => right.weight - left.weight
      || compareText(left.candidateId, right.candidateId));
}

function allocateProportional(
  assessments: readonly VocAssessment[],
  policy: VocAllocationPolicy,
  state: AllocationState,
  alreadyAllocated: number,
  trace: VocProportionalTraceEntry[],
): void {
  let remaining = policy.totalQuanta - alreadyAllocated;
  let pass = 1;
  while (remaining > 0) {
    const candidates = proportionalCandidates(assessments, policy, state);
    if (candidates.length === 0) break;
    const denominator = candidates.reduce(
      (sum, candidate) => sum + BigInt(candidate.weight),
      0n,
    );
    if (denominator <= 0n) break;
    const passRemaining = remaining;
    const mutableTrace: MutableProportionalTrace[] = [];
    let allocatedThisPass = 0;

    for (const candidate of candidates) {
      const numerator = BigInt(passRemaining) * BigInt(candidate.weight);
      const uncappedFloor = safeNumber(numerator / denominator, 'proportional floor');
      const floorQuanta = Math.min(
        uncappedFloor,
        capacityFor(candidate.assessment, policy, state),
      );
      if (floorQuanta > 0) {
        addAllocation(candidate.assessment, floorQuanta, state);
        remaining -= floorQuanta;
        allocatedThisPass += floorQuanta;
      }
      mutableTrace.push({
        awardedRemainderQuantum: false,
        candidateId: candidate.candidateId,
        denominator: denominator.toString(),
        floorQuanta,
        numerator: numerator.toString(),
        pass,
        remainderNumerator: (numerator % denominator).toString(),
      });
    }

    const remainderOrder = [...mutableTrace]
      .filter((entry) => {
        const candidate = candidates.find((item) => item.candidateId === entry.candidateId);
        return candidate !== undefined
          && capacityFor(candidate.assessment, policy, state) > 0;
      })
      .sort((left, right) => {
        const leftRemainder = BigInt(left.remainderNumerator);
        const rightRemainder = BigInt(right.remainderNumerator);
        return leftRemainder === rightRemainder
          ? compareText(left.candidateId, right.candidateId)
          : leftRemainder > rightRemainder ? -1 : 1;
      });
    for (const entry of remainderOrder) {
      if (remaining <= 0) break;
      const candidate = candidates.find((item) => item.candidateId === entry.candidateId);
      if (!candidate || capacityFor(candidate.assessment, policy, state) <= 0) continue;
      addAllocation(candidate.assessment, 1, state);
      entry.awardedRemainderQuantum = true;
      remaining -= 1;
      allocatedThisPass += 1;
    }
    trace.push(...mutableTrace.map((entry) => Object.freeze(entry)));
    if (allocatedThisPass === 0) break;
    pass += 1;
  }
}

function allocationOutput(state: AllocationState): readonly VocCandidateAllocation[] {
  return Object.freeze(state.allocationOrder.map((candidateId) => Object.freeze({
    candidateId,
    quanta: countFor(state.candidateCounts, candidateId),
  })));
}

// ───────────────────────────────────────────────────────────────────
// 3. PUBLIC API
// ───────────────────────────────────────────────────────────────────

/** Assess all candidates and allocate deterministic integer quanta without admission. */
export function planVocAllocation(
  candidates: readonly VocCandidateInput[],
  policy: VocAllocationPolicy,
  eventCut: FanInEventCut,
): VocAllocationPlan {
  const assessments = candidates
    .map((candidate) => assessVocCandidate(candidate, policy, eventCut))
    .sort((left, right) => compareText(
      vocCandidateId(left.candidate),
      vocCandidateId(right.candidate),
    ));
  const candidateIds = assessments.map((assessment) => vocCandidateId(assessment.candidate));
  if (new Set(candidateIds).size !== candidateIds.length) {
    throw new TypeError('VOC allocation candidates require unique stable identities');
  }
  const orderedCandidateIds = assessments
    .filter((assessment) => assessment.eligible)
    .sort(assessmentOrder)
    .map((assessment) => vocCandidateId(assessment.candidate));
  const state: AllocationState = {
    allocationOrder: [],
    candidateCounts: new Map(),
    modeCounts: new Map(),
    regionCounts: new Map(),
  };
  const greedyTrace: VocGreedyTraceEntry[] = [];
  const proportionalTrace: VocProportionalTraceEntry[] = [];
  const explorationAllocated = allocateExplorationFloor(
    assessments,
    policy,
    state,
    greedyTrace,
  );
  if (policy.kind === 'greedy') {
    allocateGreedy(assessments, policy, state, explorationAllocated, greedyTrace);
  } else {
    allocateProportional(
      assessments,
      policy,
      state,
      explorationAllocated,
      proportionalTrace,
    );
  }
  const allocations = allocationOutput(state);
  const allocated = allocations.reduce((sum, allocation) => sum + allocation.quanta, 0);
  return Object.freeze({
    allocations,
    assessments: Object.freeze(assessments),
    greedyTrace: Object.freeze(greedyTrace),
    orderedCandidateIds: Object.freeze(orderedCandidateIds),
    proportionalTrace: Object.freeze(proportionalTrace),
    unallocatedQuanta: policy.totalQuanta - allocated,
  });
}
