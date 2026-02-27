// ---------------------------------------------------------------
// MODULE: Confidence-Based Result Truncation
// Adaptive top-K cutoff based on score gap analysis (Sprint 3, T006)
// ---------------------------------------------------------------

/* -----------------------------------------------------------
   1. TYPES & CONSTANTS
----------------------------------------------------------------*/

/** Generic scored result for truncation — supports both numeric and string IDs. */
interface ScoredResult {
  id: number | string;
  score: number;
  [key: string]: unknown;
}

/** Result of a truncation operation with full audit metadata. */
interface TruncationResult {
  results: ScoredResult[];
  truncated: boolean;
  originalCount: number;
  truncatedCount: number;
  /** Inclusive index of the last kept result (0-based). */
  cutoffIndex: number;
  medianGap: number;
  cutoffGap: number;
}

/** Options for truncation behaviour. */
interface TruncationOptions {
  /** Minimum number of results to always return, regardless of gap. Default: 3. */
  minResults?: number;
}

/** Default minimum result count. */
const DEFAULT_MIN_RESULTS = 3;

/** Gap multiplier: gap must exceed this multiple of the median gap to trigger truncation. */
const GAP_THRESHOLD_MULTIPLIER = 2;

/* -----------------------------------------------------------
   2. FEATURE FLAG
----------------------------------------------------------------*/

/**
 * Check whether confidence-based truncation is enabled.
 * Default: DISABLED. Only enabled when SPECKIT_CONFIDENCE_TRUNCATION is explicitly "true".
 */
function isConfidenceTruncationEnabled(): boolean {
  const raw = process.env.SPECKIT_CONFIDENCE_TRUNCATION?.toLowerCase()?.trim();
  return raw === 'true';
}

/* -----------------------------------------------------------
   3. GAP ANALYSIS HELPERS
----------------------------------------------------------------*/

/**
 * Compute consecutive score gaps for a sorted (descending) score array.
 * gap[i] = scores[i] - scores[i+1]   for i in [0, n-2]
 * Returns empty array when fewer than 2 scores.
 */
function computeGaps(scores: number[]): number[] {
  if (scores.length < 2) return [];
  const gaps: number[] = [];
  for (let i = 0; i < scores.length - 1; i++) {
    gaps.push(scores[i] - scores[i + 1]);
  }
  return gaps;
}

/**
 * Compute the median of an array of numbers.
 * Returns 0 for an empty array.
 */
function computeMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) {
    return sorted[mid];
  }
  return (sorted[mid - 1] + sorted[mid]) / 2;
}

/* -----------------------------------------------------------
   4. CORE TRUNCATION LOGIC
----------------------------------------------------------------*/

/**
 * Truncate results based on confidence gap analysis.
 *
 * Algorithm:
 * 1. If fewer than minResults results, return unchanged.
 * 2. Compute consecutive score gaps.
 * 3. Compute median gap.
 * 4. Find first index >= (minResults - 1) where gap > 2 * medianGap.
 * 5. Truncate at that index + 1 (keep results 0..cutoffIndex inclusive).
 * 6. If no threshold-exceeding gap found, return all results unchanged.
 *
 * When SPECKIT_CONFIDENCE_TRUNCATION is disabled, passes results through unchanged.
 *
 * Results are expected to be pre-sorted by score descending. This function
 * does NOT sort; it operates on the input order.
 */
function truncateByConfidence(
  results: ScoredResult[],
  options?: TruncationOptions,
): TruncationResult {
  const minResults = options?.minResults ?? DEFAULT_MIN_RESULTS;
  const originalCount = results.length;

  // Feature flag gate: pass through when disabled
  if (!isConfidenceTruncationEnabled()) {
    return {
      results: [...results],
      truncated: false,
      originalCount,
      truncatedCount: originalCount,
      cutoffIndex: originalCount - 1,
      medianGap: 0,
      cutoffGap: 0,
    };
  }

  // Not enough results to truncate
  if (results.length <= minResults) {
    return {
      results: [...results],
      truncated: false,
      originalCount,
      truncatedCount: originalCount,
      cutoffIndex: originalCount - 1,
      medianGap: 0,
      cutoffGap: 0,
    };
  }

  const scores = results.map(r => r.score);
  const gaps = computeGaps(scores);
  const medianGap = computeMedian(gaps);
  const threshold = GAP_THRESHOLD_MULTIPLIER * medianGap;

  // When medianGap is 0 (all same scores), no meaningful gap exists — return all
  if (medianGap === 0) {
    return {
      results: [...results],
      truncated: false,
      originalCount,
      truncatedCount: originalCount,
      cutoffIndex: originalCount - 1,
      medianGap: 0,
      cutoffGap: 0,
    };
  }

  // Search for the first gap that exceeds the threshold, starting from minResults - 1.
  // gap[i] is the gap between result i and result i+1.
  // If gap[i] > threshold, we keep results 0..i (cutoffIndex = i).
  let cutoffIndex = -1;
  let cutoffGap = 0;

  for (let i = minResults - 1; i < gaps.length; i++) {
    if (gaps[i] > threshold) {
      cutoffIndex = i;
      cutoffGap = gaps[i];
      break;
    }
  }

  // No significant gap found — return all results
  if (cutoffIndex === -1) {
    return {
      results: [...results],
      truncated: false,
      originalCount,
      truncatedCount: originalCount,
      cutoffIndex: originalCount - 1,
      medianGap,
      cutoffGap: 0,
    };
  }

  // Truncate: keep results[0..cutoffIndex] inclusive
  const truncatedResults = results.slice(0, cutoffIndex + 1);

  return {
    results: truncatedResults,
    truncated: true,
    originalCount,
    truncatedCount: truncatedResults.length,
    cutoffIndex,
    medianGap,
    cutoffGap,
  };
}

/* -----------------------------------------------------------
   5. EXPORTS
----------------------------------------------------------------*/

export {
  // Types
  type ScoredResult,
  type TruncationResult,
  type TruncationOptions,

  // Constants
  DEFAULT_MIN_RESULTS,
  GAP_THRESHOLD_MULTIPLIER,

  // Functions
  truncateByConfidence,
  isConfidenceTruncationEnabled,

  // Internal helpers (exported for testing)
  computeGaps,
  computeMedian,
};
