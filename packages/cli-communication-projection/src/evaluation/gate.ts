// ───────────────────────────────────────────────────────────────────
// MODULE: Stratified Evaluation Release Gate
// ───────────────────────────────────────────────────────────────────

import { EvaluationDimensionNames } from '../contracts/evidence.js';
import { deepFreeze } from '../fidelity/freeze.js';
import { evaluateDimensionNonInferiority } from './noninferiority.js';
import { assertFrozenPreRegistration } from './preregistration.js';

import type { EvaluationDimensionName } from '../contracts/evidence.js';
import type { EvaluationFidelityVetoDecision } from './fidelity-veto.js';
import type { DimensionNonInferiorityResult } from './noninferiority.js';
import type {
  FrozenPreRegistration,
  PresentationTier,
  ReviewerAssignment,
} from './preregistration.js';

/** One synthetic or human paired score after trusted unblinding. */
export interface BlindReviewerRating {
  readonly comparisonId: string;
  readonly reviewerId: string;
  readonly candidateScores: Readonly<Record<EvaluationDimensionName, number>>;
  readonly referenceScores: Readonly<Record<EvaluationDimensionName, number>>;
}

/** Content-free automated metric retained for diagnostics only. */
export interface DiagnosticEvaluationMetric {
  readonly metricId: string;
  readonly value: number;
}

/** Candidate evidence retained within exactly one pre-registered stratum. */
export interface StratumReleaseEvidence {
  readonly stratumId: string;
  readonly fidelityVetoes: readonly EvaluationFidelityVetoDecision[];
  readonly ratings: readonly BlindReviewerRating[];
}

/** Complete input to one tier-specific release-gate decision. */
export interface EvaluateReleaseGateInput {
  readonly preRegistration: FrozenPreRegistration;
  readonly claimTier: PresentationTier;
  readonly strata: readonly StratumReleaseEvidence[];
  readonly diagnosticMetrics?: readonly DiagnosticEvaluationMetric[];
}

/** Per-stratum fidelity and non-inferiority result. */
export interface StratumReleaseGateDecision {
  readonly stratumId: string;
  readonly presentationTier: PresentationTier;
  readonly status: 'fail' | 'inconclusive' | 'pass';
  readonly reasonCode:
    | 'fidelity-veto'
    | 'incomplete-evidence'
    | 'lower-bounds-clear-margins'
    | 'missing-stratum-evidence'
    | 'noninferiority-fail';
  readonly fidelityPassed: boolean;
  readonly dimensions: readonly DimensionNonInferiorityResult[];
}

/** Tier-specific release result; diagnostic metrics never affect approval. */
export interface ReleaseGateDecision {
  readonly gateVersion: 'evaluation-release-gate/1.0.0';
  readonly claimTier: PresentationTier;
  readonly status: 'fail' | 'inconclusive' | 'pass';
  readonly reasonCode: StratumReleaseGateDecision['reasonCode'];
  readonly releaseApproved: boolean;
  readonly diagnosticMetricCount: number;
  readonly strata: readonly StratumReleaseGateDecision[];
}

const DIMENSIONS = Object.values(EvaluationDimensionNames) as readonly EvaluationDimensionName[];

/** Combine absolute fidelity vetoes and paired human evidence without tier pooling. */
export function evaluateReleaseGate(input: EvaluateReleaseGateInput): ReleaseGateDecision {
  assertFrozenPreRegistration(input.preRegistration);
  validateDiagnostics(input.diagnosticMetrics ?? []);
  const registeredById = new Map(
    input.preRegistration.strata.map((stratum) => [stratum.stratumId, stratum]),
  );
  const evidenceById = new Map<string, StratumReleaseEvidence>();
  for (const evidence of input.strata) {
    if (!registeredById.has(evidence.stratumId) || evidenceById.has(evidence.stratumId)) {
      throw new TypeError('Release evidence must name each registered stratum at most once.');
    }
    evidenceById.set(evidence.stratumId, evidence);
  }

  const claimStrata = input.preRegistration.strata.filter(
    (stratum) => stratum.presentationTier === input.claimTier,
  );
  const decisions = claimStrata.map((stratum): StratumReleaseGateDecision => {
    const evidence = evidenceById.get(stratum.stratumId);
    if (evidence === undefined) {
      return deepFreeze({
        stratumId: stratum.stratumId,
        presentationTier: stratum.presentationTier,
        status: 'fail',
        reasonCode: 'missing-stratum-evidence',
        fidelityPassed: false,
        dimensions: [],
      });
    }
    return evaluateStratum(input.preRegistration, stratum.stratumId, evidence);
  });
  if (decisions.length === 0) {
    throw new TypeError('Pre-registration does not contain the requested presentation tier.');
  }

  const failed = decisions.find((decision) => decision.status === 'fail');
  const inconclusive = decisions.find((decision) => decision.status === 'inconclusive');
  const status = failed !== undefined
    ? 'fail' as const
    : inconclusive !== undefined
      ? 'inconclusive' as const
      : 'pass' as const;
  const reasonCode = failed?.reasonCode
    ?? inconclusive?.reasonCode
    ?? 'lower-bounds-clear-margins';
  return deepFreeze({
    gateVersion: 'evaluation-release-gate/1.0.0',
    claimTier: input.claimTier,
    status,
    reasonCode,
    releaseApproved: status === 'pass',
    diagnosticMetricCount: input.diagnosticMetrics?.length ?? 0,
    strata: decisions,
  });
}

function evaluateStratum(
  registration: FrozenPreRegistration,
  stratumId: string,
  evidence: StratumReleaseEvidence,
): StratumReleaseGateDecision {
  const stratum = registration.strata.find((entry) => entry.stratumId === stratumId);
  const samplePlan = registration.samplePlans.find((entry) => entry.stratumId === stratumId);
  if (stratum === undefined || samplePlan === undefined) {
    throw new TypeError('Registered stratum is missing its sample plan.');
  }
  const assignments = registration.reviewerAssignments.filter(
    (assignment) => assignment.stratumId === stratumId,
  );
  const fidelityByComparison = validateFidelity(
    evidence.fidelityVetoes,
    stratumId,
    assignments,
  );
  if ([...fidelityByComparison.values()].some((decision) => decision.absoluteVeto)) {
    return deepFreeze({
      stratumId,
      presentationTier: stratum.presentationTier,
      status: 'fail',
      reasonCode: 'fidelity-veto',
      fidelityPassed: false,
      dimensions: [],
    });
  }

  validateRatings(evidence.ratings, assignments, fidelityByComparison);
  const dimensions = DIMENSIONS.map((dimension) =>
    evaluateDimensionNonInferiority({
      dimension,
      pairedDifferences: evidence.ratings.map((rating) =>
        rating.candidateScores[dimension] - rating.referenceScores[dimension]),
      margin: registration.nonInferiorityMargins[dimension],
      requiredSampleSize: samplePlan.pairedRatingsPerStratum,
      sampleCap: samplePlan.pairedRatingsPerStratum,
    }));
  const failed = dimensions.some((dimension) => dimension.status === 'fail');
  const inconclusive = dimensions.some((dimension) => dimension.status === 'inconclusive');
  const allComparisonsHaveFidelity = assignments.every((assignment) =>
    fidelityByComparison.get(assignment.comparisonId)?.status === 'passed');
  const status = failed
    ? 'fail' as const
    : inconclusive || !allComparisonsHaveFidelity
      ? 'inconclusive' as const
      : 'pass' as const;
  return deepFreeze({
    stratumId,
    presentationTier: stratum.presentationTier,
    status,
    reasonCode: failed
      ? 'noninferiority-fail'
      : status === 'inconclusive'
        ? 'incomplete-evidence'
        : 'lower-bounds-clear-margins',
    fidelityPassed: allComparisonsHaveFidelity,
    dimensions,
  });
}

function validateFidelity(
  decisions: readonly EvaluationFidelityVetoDecision[],
  stratumId: string,
  assignments: readonly ReviewerAssignment[],
): ReadonlyMap<string, EvaluationFidelityVetoDecision> {
  const result = new Map<string, EvaluationFidelityVetoDecision>();
  const comparisonIds = new Set(assignments.map((assignment) => assignment.comparisonId));
  for (const decision of decisions) {
    const consistent = decision.status === 'passed'
      ? decision.absoluteVeto === false
      : decision.status === 'vetoed' && decision.absoluteVeto === true;
    if (
      decision.stratumId !== stratumId
      || !comparisonIds.has(decision.comparisonId)
      || result.has(decision.comparisonId)
      || !consistent
    ) {
      throw new TypeError('Fidelity decisions must be unique and internally consistent.');
    }
    result.set(decision.comparisonId, decision);
  }
  return result;
}

function validateRatings(
  ratings: readonly BlindReviewerRating[],
  assignments: readonly ReviewerAssignment[],
  fidelity: ReadonlyMap<string, EvaluationFidelityVetoDecision>,
): void {
  const assignmentsByComparison = new Map(
    assignments.map((assignment) => [assignment.comparisonId, assignment]),
  );
  const reviewersByComparison = new Map<string, Set<string>>();
  const ratingKeys = new Set<string>();
  for (const rating of ratings) {
    const assignment = assignmentsByComparison.get(rating.comparisonId);
    const key = JSON.stringify([rating.comparisonId, rating.reviewerId]);
    if (
      assignment === undefined
      || !assignment.reviewerIds.includes(rating.reviewerId)
      || ratingKeys.has(key)
      || fidelity.get(rating.comparisonId)?.status !== 'passed'
    ) {
      throw new TypeError('Ratings must match frozen reviewer and fidelity assignments.');
    }
    validateScores(rating.candidateScores);
    validateScores(rating.referenceScores);
    ratingKeys.add(key);
    const reviewers = reviewersByComparison.get(rating.comparisonId) ?? new Set<string>();
    reviewers.add(rating.reviewerId);
    reviewersByComparison.set(rating.comparisonId, reviewers);
  }
  for (const [comparisonId, reviewers] of reviewersByComparison) {
    const assignment = assignmentsByComparison.get(comparisonId);
    if (assignment === undefined || reviewers.size !== assignment.reviewerIds.length) {
      throw new TypeError('A scored comparison must include every pre-assigned reviewer.');
    }
  }
}

function validateScores(
  scores: Readonly<Record<EvaluationDimensionName, number>>,
): void {
  const keys = Object.keys(scores);
  if (
    keys.length !== DIMENSIONS.length
    || keys.some((key) => !(DIMENSIONS as readonly string[]).includes(key))
    || DIMENSIONS.some((dimension) => !Number.isFinite(scores[dimension]))
  ) {
    throw new TypeError('Reviewer scores must cover every dimension with finite numbers.');
  }
}

function validateDiagnostics(metrics: readonly DiagnosticEvaluationMetric[]): void {
  if (metrics.some((metric) => metric.metricId.length === 0 || !Number.isFinite(metric.value))) {
    throw new TypeError('Diagnostic metrics require content-free identifiers and finite values.');
  }
}
