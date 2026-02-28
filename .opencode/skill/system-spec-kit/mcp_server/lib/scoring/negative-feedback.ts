// ---------------------------------------------------------------
// MODULE: Negative Feedback Confidence Signal (T002b / A4)
//
// When wasUseful=false is recorded via memory_validate, reduce the
// memory's composite score via a confidence multiplier.
//
// Multiplier: starts at 1.0, decreases with each negative validation
// Floor: 0.3 (never suppress below 30% of original score)
// Decay: gradual recovery over time (30-day half-life)
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. CONSTANTS
   --------------------------------------------------------------- */

/** Base multiplier before any negative feedback is applied. */
export const CONFIDENCE_MULTIPLIER_BASE = 1.0;

/** Minimum multiplier floor -- never suppress below 30% of original score. */
export const CONFIDENCE_MULTIPLIER_FLOOR = 0.3;

/** Per-negative-validation penalty applied to the multiplier. */
export const NEGATIVE_PENALTY_PER_VALIDATION = 0.1;

/**
 * Half-life for recovery in milliseconds (30 days).
 * After 30 days since the last negative validation, the penalty
 * is halved. This allows memories to recover relevance over time
 * if no further negative feedback is received.
 */
export const RECOVERY_HALF_LIFE_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Recovery half-life in days (for human-readable reference).
 */
export const RECOVERY_HALF_LIFE_DAYS = 30;

/* ---------------------------------------------------------------
   2. CORE FUNCTIONS
   --------------------------------------------------------------- */

/**
 * Compute the confidence multiplier based on negative validation count
 * and time since last negative validation.
 *
 * The multiplier starts at 1.0 and decreases by NEGATIVE_PENALTY_PER_VALIDATION
 * for each negative validation, but never drops below CONFIDENCE_MULTIPLIER_FLOOR (0.3).
 *
 * Time-based recovery: the penalty decays with a 30-day half-life since
 * the last negative validation. This means:
 * - At 0 days:  full penalty applied
 * - At 30 days: penalty halved
 * - At 60 days: penalty quartered
 * - At 90 days: penalty at ~12.5%
 *
 * @param negativeCount - Number of negative (wasUseful=false) validations
 * @param lastNegativeAt - Timestamp (ms epoch) of the most recent negative validation.
 *                         If null/undefined, no recovery decay is applied.
 * @returns Confidence multiplier in range [CONFIDENCE_MULTIPLIER_FLOOR, CONFIDENCE_MULTIPLIER_BASE]
 */
export function computeConfidenceMultiplier(
  negativeCount: number,
  lastNegativeAt?: number | null
): number {
  if (negativeCount <= 0) {
    return CONFIDENCE_MULTIPLIER_BASE;
  }

  // Base penalty from negative count
  const rawPenalty = negativeCount * NEGATIVE_PENALTY_PER_VALIDATION;

  // Apply time-based recovery (exponential decay of penalty)
  let effectivePenalty = rawPenalty;

  if (lastNegativeAt != null && Number.isFinite(lastNegativeAt)) {
    const elapsedMs = Date.now() - lastNegativeAt;
    if (elapsedMs > 0) {
      // Exponential decay: penalty * 2^(-elapsed / halfLife)
      const decayFactor = Math.pow(2, -(elapsedMs / RECOVERY_HALF_LIFE_MS));
      effectivePenalty = rawPenalty * decayFactor;
    }
  }

  // Compute multiplier with floor
  const multiplier = CONFIDENCE_MULTIPLIER_BASE - effectivePenalty;
  return Math.max(CONFIDENCE_MULTIPLIER_FLOOR, Math.min(CONFIDENCE_MULTIPLIER_BASE, multiplier));
}

/**
 * Apply negative feedback confidence signal to a composite score.
 *
 * This function wraps computeConfidenceMultiplier and applies the resulting
 * multiplier to the given score. Use this as the integration point in the
 * scoring pipeline.
 *
 * @param score - The composite score to adjust (0-1)
 * @param negativeCount - Number of negative validations on the memory
 * @param lastNegativeAt - Timestamp (ms epoch) of the most recent negative validation
 * @returns Adjusted score in range [score * 0.3, score]
 */
export function applyNegativeFeedback(
  score: number,
  negativeCount: number,
  lastNegativeAt?: number | null
): number {
  const multiplier = computeConfidenceMultiplier(negativeCount, lastNegativeAt);
  return score * multiplier;
}
