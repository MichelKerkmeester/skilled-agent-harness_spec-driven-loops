// ───────────────────────────────────────────────────────────────────
// MODULE: Evaluation Baseline Placeholders
// ───────────────────────────────────────────────────────────────────

import { EvaluationDimensionNames } from '../contracts/evidence.js';

import type { EvaluationDimensionName } from '../contracts/evidence.js';

/** Comparison families required before non-inferiority margins are frozen. */
export type BaselineComparison =
  | 'original-vs-reference'
  | 'reference-vs-reference';

/** Operator-owned baseline values that remain pending until pre-registration. */
export interface EvaluationBaselineRecord {
  readonly baselineVersion: 'evaluation-baseline/1.0.0';
  readonly comparison: BaselineComparison;
  readonly dimension: EvaluationDimensionName;
  readonly status: 'pending';
  readonly sampleCount: null;
  readonly meanDifference: null;
  readonly variance: null;
  readonly frozenAt: null;
}

const COMPARISONS: readonly BaselineComparison[] = Object.freeze([
  'reference-vs-reference',
  'original-vs-reference',
]);

/** Pending records whose values are filled only by the pre-registration workflow. */
export const EVALUATION_BASELINE_PLACEHOLDERS: readonly EvaluationBaselineRecord[] =
  Object.freeze(COMPARISONS.flatMap((comparison) =>
    Object.values(EvaluationDimensionNames).map((dimension) => Object.freeze({
      baselineVersion: 'evaluation-baseline/1.0.0' as const,
      comparison,
      dimension,
      status: 'pending' as const,
      sampleCount: null,
      meanDifference: null,
      variance: null,
      frozenAt: null,
    }))));

