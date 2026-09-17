// ───────────────────────────────────────────────────────────────────
// MODULE: Value of Computation Fan-In Handoff
// ───────────────────────────────────────────────────────────────────

import { canonicalBytes, sha256Bytes } from '../event-envelope/index.js';

import type {
  OutstandingBranchAtCut,
  ValueOfComputationPolicy,
} from '../conditional-fanin/index.js';
import type {
  VocAssessment,
  VocFanInPopulation,
  VocUsefulnessRank,
} from './types.js';

// ───────────────────────────────────────────────────────────────────
// 1. HELPERS
// ───────────────────────────────────────────────────────────────────

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function branchId(branch: OutstandingBranchAtCut): string {
  return branch.branch.registration.logical_branch_id;
}

// ───────────────────────────────────────────────────────────────────
// 2. PUBLIC API
// ───────────────────────────────────────────────────────────────────

/** Populate rank-only inputs on future outstanding-branch copies. */
export function populateVocUsefulnessRanks(
  outstandingBranches: readonly OutstandingBranchAtCut[],
  assessments: readonly VocAssessment[],
  version = 1,
): VocFanInPopulation {
  if (!Number.isSafeInteger(version) || version <= 0) {
    throw new RangeError('Value-of-computation policy version must be positive');
  }
  const eligibleAssessments = assessments
    .filter((assessment) => assessment.eligible && assessment.adjustedScore > 0)
    .sort((left, right) => right.adjustedScore - left.adjustedScore
      || compareText(left.candidate.logicalBranchId, right.candidate.logicalBranchId));
  const assessmentBranches = eligibleAssessments.map(
    (assessment) => assessment.candidate.logicalBranchId,
  );
  if (new Set(assessmentBranches).size !== assessmentBranches.length) {
    throw new TypeError('Fan-in usefulness requires one assessment per logical branch');
  }
  const outstandingIds = outstandingBranches.map(branchId);
  if (new Set(outstandingIds).size !== outstandingIds.length) {
    throw new TypeError('Fan-in usefulness cannot target duplicate outstanding branches');
  }
  const eligibleOutstanding = new Set(outstandingBranches
    .filter((branch) => branch.partialFailureEligible && branch.executionState !== 'terminal')
    .map(branchId));
  const rankedAssessments = eligibleAssessments.filter((assessment) => (
    eligibleOutstanding.has(assessment.candidate.logicalBranchId)
  ));
  const ranks: VocUsefulnessRank[] = rankedAssessments.map((assessment, index) => (
    Object.freeze({
      adjustedScore: assessment.adjustedScore,
      logicalBranchId: assessment.candidate.logicalBranchId,
      usefulnessRank: rankedAssessments.length - index,
    })
  ));
  const signalDigest = sha256Bytes(canonicalBytes({
    kind: 'rank-only',
    ranks,
    sourceAssessments: rankedAssessments.map((assessment) => ({
      assessmentDigest: assessment.assessmentDigest,
      logicalBranchId: assessment.candidate.logicalBranchId,
    })),
    version,
  }));
  const policy: ValueOfComputationPolicy = Object.freeze({
    kind: 'rank-only',
    signalDigest,
    version,
  });
  const rankByBranch = new Map(ranks.map((rank) => [
    rank.logicalBranchId,
    rank.usefulnessRank,
  ]));
  const populated = outstandingBranches.map((branch) => {
    const usefulnessRank = rankByBranch.get(branchId(branch));
    return Object.freeze(usefulnessRank === undefined
      ? { ...branch }
      : { ...branch, usefulnessRank });
  });
  return Object.freeze({
    handoff: Object.freeze({ policy, ranks: Object.freeze(ranks) }),
    outstandingBranches: Object.freeze(populated),
  });
}
