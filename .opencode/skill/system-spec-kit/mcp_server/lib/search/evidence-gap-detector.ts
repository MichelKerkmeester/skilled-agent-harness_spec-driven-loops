// ---------------------------------------------------------------
// MODULE: Evidence Gap Detector (C138-P1)
// Transparent Reasoning Module (TRM): Z-score confidence check
// on RRF scores to detect low-confidence retrieval and inject
// warnings for the MCP markdown output layer.
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. CONSTANTS
   --------------------------------------------------------------- */

/** Z-score threshold below which retrieval confidence is considered low. */
const Z_SCORE_THRESHOLD = 1.5;

/** Absolute minimum score; any top score below this triggers a gap. */
const MIN_ABSOLUTE_SCORE = 0.015;

/* ---------------------------------------------------------------
   2. INTERFACES
   --------------------------------------------------------------- */

/**
 * Result of a Transparent Reasoning Module evidence-gap check.
 * Summarises Z-score statistics for the RRF score distribution.
 */
export interface TRMResult {
  /** True when retrieval confidence is too low to trust results. */
  gapDetected: boolean;
  /** Z-score of the top-ranked result relative to the distribution. */
  zScore: number;
  /** Arithmetic mean of all RRF scores. */
  mean: number;
  /** Population standard deviation of all RRF scores. */
  stdDev: number;
}

/* ---------------------------------------------------------------
   3. CORE FUNCTIONS
   --------------------------------------------------------------- */

/**
 * Detect evidence gaps in an RRF score distribution.
 *
 * A gap is detected when either:
 * - The top score's Z-score falls below `Z_SCORE_THRESHOLD` (flat distribution),
 * - The top score is below `MIN_ABSOLUTE_SCORE` (all scores too small), or
 * - The input array is empty.
 *
 * @param rrfScores - Array of Reciprocal Rank Fusion scores (any length).
 * @returns TRMResult with gap flag, Z-score, mean, and standard deviation.
 */
export function detectEvidenceGap(rrfScores: number[]): TRMResult {
  if (rrfScores.length === 0) {
    return { gapDetected: true, zScore: 0, mean: 0, stdDev: 0 };
  }

  if (rrfScores.length === 1) {
    // Single score: can't compute a meaningful Z-score, fall back to absolute threshold.
    const score = rrfScores[0];
    return {
      gapDetected: score < MIN_ABSOLUTE_SCORE,
      zScore: 0,
      mean: score,
      stdDev: 0,
    };
  }

  const mean = rrfScores.reduce((acc, s) => acc + s, 0) / rrfScores.length;
  const variance = rrfScores.reduce((acc, s) => acc + (s - mean) ** 2, 0) / rrfScores.length;
  const stdDev = Math.sqrt(variance);

  const topScore = Math.max(...rrfScores);

  // Avoid division by zero when all scores are identical (stdDev === 0 → Z = 0).
  const zScore = stdDev === 0 ? 0 : (topScore - mean) / stdDev;

  const gapDetected = zScore < Z_SCORE_THRESHOLD || topScore < MIN_ABSOLUTE_SCORE;

  return { gapDetected, zScore, mean, stdDev };
}

/**
 * Format an evidence-gap warning for MCP markdown output.
 *
 * Uses plain text (no emoji) to comply with project conventions.
 * The markdown block-quote prefix (`> **`) allows the MCP layer to
 * render the warning prominently without requiring emoji support.
 *
 * @param trm - TRMResult from `detectEvidenceGap`.
 * @returns A formatted markdown warning string.
 */
export function formatEvidenceGapWarning(trm: TRMResult): string {
  return `> **[EVIDENCE GAP DETECTED]: Retrieved context has low mathematical confidence (Z=${trm.zScore.toFixed(2)}). Consider first principles.**`;
}

/* ---------------------------------------------------------------
   4. EXPORTS (constants for consumer use)
   --------------------------------------------------------------- */

export { Z_SCORE_THRESHOLD, MIN_ABSOLUTE_SCORE };
