// ───────────────────────────────────────────────────────────────────
// MODULE: Immutable Evaluation Pre-registration
// ───────────────────────────────────────────────────────────────────

import { RuntimeIds } from '../contracts/common.js';
import { EvaluationDimensionNames } from '../contracts/evidence.js';
import { createSha256Digest } from '../contracts/exact-original.js';
import { deepFreeze } from '../fidelity/freeze.js';
import {
  MAXIMUM_PAIRED_RATINGS_PER_STRATUM,
  MINIMUM_PAIRED_RATINGS_PER_STRATUM,
  calculatePoweredSampleSize,
} from './power.js';

import type { RuntimeId } from '../contracts/common.js';
import type { EvaluationDimensionName } from '../contracts/evidence.js';
import type { PowerAnalysisInput, PoweredSampleSize } from './power.js';

/** Presentation boundaries that must never be pooled into one claim. */
export type PresentationTier = 'full-projection' | 'safe-native';

/** Complete coordinates for one release-critical independent stratum. */
export interface EvaluationStratum {
  readonly stratumId: string;
  readonly providerId: string;
  readonly modelId: string;
  readonly promptProfileId: string;
  readonly runtimeId: RuntimeId;
  readonly presentationTier: PresentationTier;
}

/** Power inputs associated with exactly one release-critical stratum. */
export interface StratumSamplePlanInput {
  readonly stratumId: string;
  readonly power: PowerAnalysisInput;
}

/** Frozen powered sample plan for one release-critical stratum. */
export interface StratumSamplePlan extends PoweredSampleSize {
  readonly stratumId: string;
}

/** Independent reviewer identities assigned before a comparison is displayed. */
export interface ReviewerAssignment {
  readonly stratumId: string;
  readonly comparisonId: string;
  readonly reviewerIds: readonly string[];
}

/** Negative quality tolerances frozen before candidate scoring. */
export type NonInferiorityMargins = Readonly<Record<EvaluationDimensionName, number>>;

/** Closed release stop policy; ambiguous outcomes cannot become approvals. */
export interface EvaluationStopRules {
  readonly minimumPairedRatings: 30;
  readonly maximumPairedRatings: 100;
  readonly allowEarlyPass: false;
  readonly fidelityFailure: 'fail-release';
  readonly inconclusiveAtSampleCap: 'fail-release';
}

/** Caller-owned choices accepted by the pre-registration freezer. */
export interface CreatePreRegistrationInput {
  readonly frozenAt: string;
  readonly strata: readonly EvaluationStratum[];
  readonly samplePlanInputs: readonly StratumSamplePlanInput[];
  readonly reviewerAssignments: readonly ReviewerAssignment[];
  readonly randomizationSeed: string;
  readonly nonInferiorityMargins: NonInferiorityMargins;
  readonly stopRules: EvaluationStopRules;
}

/** Immutable, digest-stamped plan required by every scoring entry point. */
export interface FrozenPreRegistration {
  readonly preRegistrationVersion: 'evaluation-preregistration/1.0.0';
  readonly status: 'frozen';
  readonly frozenAt: string;
  readonly strata: readonly EvaluationStratum[];
  readonly samplePlans: readonly StratumSamplePlan[];
  readonly reviewerAssignments: readonly ReviewerAssignment[];
  readonly randomizationSeed: string;
  readonly nonInferiorityMargins: NonInferiorityMargins;
  readonly stopRules: EvaluationStopRules;
  readonly preRegistrationDigest: string;
}

const DIMENSIONS = Object.values(EvaluationDimensionNames);
const RUNTIME_IDS = Object.values(RuntimeIds) as readonly RuntimeId[];
const DIGEST_PATTERN = /^sha256:[a-f0-9]{64}$/u;

/** Validate, normalize, clone, freeze, and digest every release-scoring choice. */
export function freezePreRegistration(
  input: CreatePreRegistrationInput,
): FrozenPreRegistration {
  validateTopLevel(input);
  const strata = normalizeStrata(input.strata);
  const samplePlans = createSamplePlans(strata, input.samplePlanInputs);
  const reviewerAssignments = normalizeReviewerAssignments(
    strata,
    samplePlans,
    input.reviewerAssignments,
  );
  const nonInferiorityMargins = normalizeMargins(input.nonInferiorityMargins);
  const stopRules = normalizeStopRules(input.stopRules);
  const base = {
    preRegistrationVersion: 'evaluation-preregistration/1.0.0' as const,
    status: 'frozen' as const,
    frozenAt: new Date(input.frozenAt).toISOString(),
    strata,
    samplePlans,
    reviewerAssignments,
    randomizationSeed: input.randomizationSeed,
    nonInferiorityMargins,
    stopRules,
  };
  return deepFreeze({
    ...base,
    preRegistrationDigest: digestPreRegistration(base),
  });
}

/** Refuse scoring unless the plan is frozen and still matches its original digest. */
export function assertFrozenPreRegistration(
  value: unknown,
): asserts value is FrozenPreRegistration {
  if (!isRecord(value) || value.status !== 'frozen') {
    throw new TypeError('Evaluation scoring requires a frozen pre-registration.');
  }
  if (!isDeeplyFrozen(value)) {
    throw new TypeError('Evaluation pre-registration is not deeply frozen.');
  }
  const digest = value.preRegistrationDigest;
  if (typeof digest !== 'string' || !DIGEST_PATTERN.test(digest)) {
    throw new TypeError('Evaluation pre-registration digest is invalid.');
  }
  const { preRegistrationDigest: ignoredDigest, ...base } = value;
  if (digestPreRegistration(base) !== digest) {
    throw new TypeError('Evaluation pre-registration changed after freezing.');
  }
  if (
    value.preRegistrationVersion !== 'evaluation-preregistration/1.0.0'
    || !Array.isArray(value.strata)
    || !Array.isArray(value.samplePlans)
    || !Array.isArray(value.reviewerAssignments)
  ) {
    throw new TypeError('Evaluation pre-registration shape is invalid.');
  }
}

function validateTopLevel(input: CreatePreRegistrationInput): void {
  if (!Number.isFinite(Date.parse(input.frozenAt))) {
    throw new TypeError('Pre-registration frozenAt must be a valid timestamp.');
  }
  if (input.randomizationSeed.length === 0) {
    throw new TypeError('Pre-registration randomization seed must be non-empty.');
  }
  if (input.strata.length === 0) {
    throw new RangeError('Pre-registration requires at least one release stratum.');
  }
}

function normalizeStrata(
  input: readonly EvaluationStratum[],
): readonly EvaluationStratum[] {
  const seenIds = new Set<string>();
  const seenCoordinates = new Set<string>();
  const strata = input.map((stratum) => {
    const identifiers = [
      stratum.stratumId,
      stratum.providerId,
      stratum.modelId,
      stratum.promptProfileId,
    ];
    if (
      identifiers.some((identifier) => identifier.length === 0)
      || seenIds.has(stratum.stratumId)
      || !RUNTIME_IDS.includes(stratum.runtimeId)
      || (stratum.presentationTier !== 'full-projection'
        && stratum.presentationTier !== 'safe-native')
    ) {
      throw new TypeError('Pre-registration strata must have unique valid coordinates.');
    }
    const normalized = {
      stratumId: stratum.stratumId,
      providerId: stratum.providerId,
      modelId: stratum.modelId,
      promptProfileId: stratum.promptProfileId,
      runtimeId: stratum.runtimeId,
      presentationTier: stratum.presentationTier,
    };
    const coordinate = JSON.stringify([
      normalized.providerId,
      normalized.modelId,
      normalized.promptProfileId,
      normalized.runtimeId,
      normalized.presentationTier,
    ]);
    if (seenCoordinates.has(coordinate)) {
      throw new TypeError('Pre-registration strata must have unique valid coordinates.');
    }
    seenIds.add(stratum.stratumId);
    seenCoordinates.add(coordinate);
    return normalized;
  });
  return Object.freeze(strata.sort((left, right) => compareText(
    stratumKey(left),
    stratumKey(right),
  )).map((stratum) => Object.freeze(stratum)));
}

function createSamplePlans(
  strata: readonly EvaluationStratum[],
  inputs: readonly StratumSamplePlanInput[],
): readonly StratumSamplePlan[] {
  const byStratum = new Map<string, StratumSamplePlanInput>();
  for (const input of inputs) {
    if (byStratum.has(input.stratumId)) {
      throw new TypeError('Each stratum must have exactly one powered sample input.');
    }
    byStratum.set(input.stratumId, input);
  }
  if (byStratum.size !== strata.length) {
    throw new TypeError('Every release stratum requires one powered sample input.');
  }
  return Object.freeze(strata.map((stratum) => {
    const input = byStratum.get(stratum.stratumId);
    if (input === undefined || input.power.alpha !== 0.05) {
      throw new TypeError('Every release stratum requires alpha 0.05.');
    }
    const powered = calculatePoweredSampleSize(input.power);
    if (!powered.meetsTargetPower) {
      throw new RangeError(
        `Stratum ${stratum.stratumId} cannot meet target power within the sample cap.`,
      );
    }
    return Object.freeze({ stratumId: stratum.stratumId, ...powered });
  }));
}

function normalizeReviewerAssignments(
  strata: readonly EvaluationStratum[],
  samplePlans: readonly StratumSamplePlan[],
  input: readonly ReviewerAssignment[],
): readonly ReviewerAssignment[] {
  const stratumIds = new Set(strata.map((stratum) => stratum.stratumId));
  const comparisonIds = new Set<string>();
  const ratingCounts = new Map<string, number>();
  const assignments = input.map((assignment) => {
    const reviewers = [...assignment.reviewerIds].sort(compareText);
    if (
      !stratumIds.has(assignment.stratumId)
      || assignment.comparisonId.length === 0
      || comparisonIds.has(assignment.comparisonId)
      || reviewers.length < 3
      || reviewers.some((reviewerId) => reviewerId.length === 0)
      || new Set(reviewers).size !== reviewers.length
    ) {
      throw new TypeError(
        'Each comparison requires at least three independent reviewers and unique identifiers.',
      );
    }
    comparisonIds.add(assignment.comparisonId);
    ratingCounts.set(
      assignment.stratumId,
      (ratingCounts.get(assignment.stratumId) ?? 0) + reviewers.length,
    );
    return Object.freeze({
      stratumId: assignment.stratumId,
      comparisonId: assignment.comparisonId,
      reviewerIds: Object.freeze(reviewers),
    });
  });
  for (const samplePlan of samplePlans) {
    if ((ratingCounts.get(samplePlan.stratumId) ?? 0) !== samplePlan.pairedRatingsPerStratum) {
      throw new RangeError(
        `Reviewer assignments for ${samplePlan.stratumId} must equal its powered sample count.`,
      );
    }
  }
  return Object.freeze(assignments.sort((left, right) =>
    compareText(left.stratumId, right.stratumId)
    || compareText(left.comparisonId, right.comparisonId)));
}

function normalizeMargins(input: NonInferiorityMargins): NonInferiorityMargins {
  const keys = Object.keys(input);
  if (
    keys.length !== DIMENSIONS.length
    || keys.some((key) => !(DIMENSIONS as readonly string[]).includes(key))
  ) {
    throw new TypeError('Every quality dimension requires exactly one frozen margin.');
  }
  const result = {} as Record<EvaluationDimensionName, number>;
  for (const dimension of DIMENSIONS) {
    const margin = input[dimension];
    if (!Number.isFinite(margin) || margin >= 0) {
      throw new RangeError('Non-inferiority margins must be finite negative numbers.');
    }
    result[dimension] = margin;
  }
  return Object.freeze(result);
}

function normalizeStopRules(input: EvaluationStopRules): EvaluationStopRules {
  if (
    input.minimumPairedRatings !== MINIMUM_PAIRED_RATINGS_PER_STRATUM
    || input.maximumPairedRatings !== MAXIMUM_PAIRED_RATINGS_PER_STRATUM
    || input.allowEarlyPass !== false
    || input.fidelityFailure !== 'fail-release'
    || input.inconclusiveAtSampleCap !== 'fail-release'
  ) {
    throw new TypeError('Evaluation stop rules must preserve the closed release policy.');
  }
  return Object.freeze({
    minimumPairedRatings: 30,
    maximumPairedRatings: 100,
    allowEarlyPass: false,
    fidelityFailure: 'fail-release',
    inconclusiveAtSampleCap: 'fail-release',
  });
}

function digestPreRegistration(value: unknown): string {
  return createSha256Digest(new TextEncoder().encode(JSON.stringify(value)));
}

function isDeeplyFrozen(value: unknown, seen = new Set<object>()): boolean {
  if (typeof value !== 'object' || value === null || seen.has(value)) {
    return true;
  }
  if (!Object.isFrozen(value)) {
    return false;
  }
  seen.add(value);
  return Object.values(value).every((child) => isDeeplyFrozen(child, seen));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stratumKey(stratum: EvaluationStratum): string {
  return JSON.stringify([
    stratum.providerId,
    stratum.modelId,
    stratum.promptProfileId,
    stratum.runtimeId,
    stratum.presentationTier,
    stratum.stratumId,
  ]);
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}
