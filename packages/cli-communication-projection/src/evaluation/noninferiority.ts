// ───────────────────────────────────────────────────────────────────
// MODULE: Paired Non-inferiority Statistics
// ───────────────────────────────────────────────────────────────────

import { EvaluationDimensionNames } from '../contracts/evidence.js';
import {
  MAXIMUM_PAIRED_RATINGS_PER_STRATUM,
  MINIMUM_PAIRED_RATINGS_PER_STRATUM,
} from './power.js';

import type { EvaluationDimensionName } from '../contracts/evidence.js';
import type { EvidenceClass } from './types.js';

/** Frozen inputs for one dimension's paired confidence interval decision. */
export interface DimensionNonInferiorityInput {
  readonly dimension: EvaluationDimensionName;
  readonly pairedDifferences: readonly number[];
  readonly evidenceClass: EvidenceClass;
  readonly margin: number;
  readonly requiredSampleSize: number;
  readonly sampleCap: number;
}

/** Two-sided paired mean confidence interval. */
export interface PairedConfidenceInterval {
  readonly confidenceLevel: 0.95;
  readonly lowerBound: number;
  readonly upperBound: number;
}

/** Statistical and release result for one quality dimension. */
export interface DimensionNonInferiorityResult {
  readonly dimension: EvaluationDimensionName;
  readonly evidenceClass: EvidenceClass;
  readonly status: 'fail' | 'inconclusive' | 'pass';
  readonly reasonCode:
    | 'confidence-interval-crosses-margin'
    | 'inconclusive-at-sample-cap'
    | 'inferior'
    | 'insufficient-sample'
    | 'lower-bound-clears-margin';
  readonly sampleCount: number;
  readonly meanDifference: number | null;
  readonly standardDeviation: number | null;
  readonly standardError: number | null;
  readonly confidenceInterval: PairedConfidenceInterval | null;
  readonly margin: number;
  readonly requiredSampleSize: number;
  readonly sampleCap: number;
  readonly releaseGatePass: boolean;
}

const DIMENSIONS = Object.values(EvaluationDimensionNames) as readonly EvaluationDimensionName[];

/** Compare a paired two-sided 95 percent lower bound with a frozen negative margin. */
export function evaluateDimensionNonInferiority(
  input: DimensionNonInferiorityInput,
): DimensionNonInferiorityResult {
  validateInput(input);
  const sampleCount = input.pairedDifferences.length;
  if (sampleCount === 0) {
    return result(input, 'inconclusive', 'insufficient-sample', null, null, null, null);
  }

  const meanDifference = normalizeZero(
    input.pairedDifferences.reduce((sum, value) => sum + value, 0) / sampleCount,
  );
  let standardDeviation: number | null = null;
  let standardError: number | null = null;
  let confidenceInterval: PairedConfidenceInterval | null = null;
  if (sampleCount >= 2) {
    const sumSquared = input.pairedDifferences.reduce((sum, value) => {
      const difference = value - meanDifference;
      return sum + difference * difference;
    }, 0);
    standardDeviation = normalizeZero(Math.sqrt(sumSquared / (sampleCount - 1)));
    standardError = normalizeZero(standardDeviation / Math.sqrt(sampleCount));
    const width = studentTCritical95(sampleCount - 1) * standardError;
    confidenceInterval = Object.freeze({
      confidenceLevel: 0.95,
      lowerBound: normalizeZero(meanDifference - width),
      upperBound: normalizeZero(meanDifference + width),
    });
  }

  if (confidenceInterval !== null && confidenceInterval.upperBound < input.margin) {
    return result(
      input,
      'fail',
      'inferior',
      meanDifference,
      standardDeviation,
      standardError,
      confidenceInterval,
    );
  }
  if (
    sampleCount >= input.requiredSampleSize
    && confidenceInterval !== null
    && confidenceInterval.lowerBound >= input.margin
  ) {
    return result(
      input,
      'pass',
      'lower-bound-clears-margin',
      meanDifference,
      standardDeviation,
      standardError,
      confidenceInterval,
    );
  }
  if (sampleCount >= input.sampleCap) {
    return result(
      input,
      'fail',
      'inconclusive-at-sample-cap',
      meanDifference,
      standardDeviation,
      standardError,
      confidenceInterval,
    );
  }
  return result(
    input,
    'inconclusive',
    sampleCount < input.requiredSampleSize
      ? 'insufficient-sample'
      : 'confidence-interval-crosses-margin',
    meanDifference,
    standardDeviation,
    standardError,
    confidenceInterval,
  );
}

function result(
  input: DimensionNonInferiorityInput,
  status: DimensionNonInferiorityResult['status'],
  reasonCode: DimensionNonInferiorityResult['reasonCode'],
  meanDifference: number | null,
  standardDeviation: number | null,
  standardError: number | null,
  confidenceInterval: PairedConfidenceInterval | null,
): DimensionNonInferiorityResult {
  return Object.freeze({
    dimension: input.dimension,
    evidenceClass: input.evidenceClass,
    status,
    reasonCode,
    sampleCount: input.pairedDifferences.length,
    meanDifference,
    standardDeviation,
    standardError,
    confidenceInterval,
    margin: input.margin,
    requiredSampleSize: input.requiredSampleSize,
    sampleCap: input.sampleCap,
    releaseGatePass: status === 'pass',
  });
}

function validateInput(input: DimensionNonInferiorityInput): void {
  if (!DIMENSIONS.includes(input.dimension)) {
    throw new TypeError('Unknown evaluation dimension.');
  }
  if (input.evidenceClass !== 'human' && input.evidenceClass !== 'llm-proxy') {
    throw new TypeError('Unknown evaluation evidence class.');
  }
  if (!Number.isFinite(input.margin) || input.margin >= 0) {
    throw new RangeError('Non-inferiority margin must be a finite negative number.');
  }
  if (
    !Number.isInteger(input.requiredSampleSize)
    || !Number.isInteger(input.sampleCap)
    || input.requiredSampleSize < MINIMUM_PAIRED_RATINGS_PER_STRATUM
    || input.sampleCap < input.requiredSampleSize
    || input.sampleCap > MAXIMUM_PAIRED_RATINGS_PER_STRATUM
    || input.pairedDifferences.length > input.sampleCap
  ) {
    throw new RangeError('Non-inferiority sample sizes are inconsistent.');
  }
  if (input.pairedDifferences.some((value) => !Number.isFinite(value))) {
    throw new RangeError('Paired differences must contain only finite numbers.');
  }
}

function studentTCritical95(degreesOfFreedom: number): number {
  const z = 1.959_963_984_540_054;
  const inverseDf = 1 / degreesOfFreedom;
  const z2 = z * z;
  const z3 = z2 * z;
  const z5 = z3 * z2;
  const z7 = z5 * z2;
  const z9 = z7 * z2;
  return z
    + (z3 + z) * inverseDf / 4
    + (5 * z5 + 16 * z3 + 3 * z) * inverseDf ** 2 / 96
    + (3 * z7 + 19 * z5 + 17 * z3 - 15 * z) * inverseDf ** 3 / 384
    + (79 * z9 + 776 * z7 + 1_482 * z5 - 1_920 * z3 - 945 * z)
      * inverseDf ** 4 / 92_160;
}

function normalizeZero(value: number): number {
  return Object.is(value, -0) ? 0 : value;
}
