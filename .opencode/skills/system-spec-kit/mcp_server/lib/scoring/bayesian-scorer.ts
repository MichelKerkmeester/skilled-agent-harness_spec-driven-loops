// ───────────────────────────────────────────────────────────────────
// MODULE: Bayesian Scorer
// ───────────────────────────────────────────────────────────────────

/* ───────────────────────────────────────────────────────────────
   1. TYPE DEFINITIONS
──────────────────────────────────────────────────────────────── */

/** Prior configuration for bounded reliability scoring. */
export interface WeightedReliabilityOptions {
  alphaPrior?: number;
  betaPrior?: number;
}

/** Outcome counts for a procedure-like memory. */
export interface ProceduralReliabilitySignals {
  successes: number;
  failures: number;
}

/**
 * Centered reliability evidence for a procedure-like memory.
 *
 * The raw posterior mean lives in [0,1] and shares its pivot with the prior, so on
 * its own it can only ever pull a score down. This decomposition exposes the signed
 * distance from the prior mean (so reliable evidence can lift, not just de-rate) plus
 * an evidence weight that shrinks thin samples back toward neutral.
 */
export interface CenteredReliabilityEvidence {
  /** Beta-posterior mean in [0,1]. */
  mean: number;
  /** Prior mean mu0 = alpha / (alpha + beta); the pivot the delta is centered on. */
  priorMean: number;
  /** Signed distance mean - mu0: positive when evidence beats the prior, negative when it lags. */
  centered: number;
  /** Total observed evidence n = successes + failures. */
  evidenceCount: number;
  /** Shrinkage factor n / (n + alpha + beta) in [0,1); 0 with no evidence, approaching 1 as evidence accrues. */
  evidenceWeight: number;
}

/* ───────────────────────────────────────────────────────────────
   2. CONSTANTS
──────────────────────────────────────────────────────────────── */

export const DEFAULT_ALPHA_PRIOR = 1;
export const DEFAULT_BETA_PRIOR = 1;

/* ───────────────────────────────────────────────────────────────
   3. HELPERS
──────────────────────────────────────────────────────────────── */

function normalizeCount(value: number, label: string): number {
  if (!Number.isFinite(value)) {
    throw new Error(`${label} must be finite`);
  }
  return Math.max(0, value);
}

function normalizePrior(value: number, label: string): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} must be finite and greater than zero`);
  }
  return value;
}

/* ───────────────────────────────────────────────────────────────
   4. CORE LOGIC
──────────────────────────────────────────────────────────────── */

/** Compute a bounded beta-posterior mean from success and failure evidence. */
export function computeWeightedReliability(
  successes: number,
  failures: number,
  options: WeightedReliabilityOptions = {},
): number {
  const alphaPrior = normalizePrior(options.alphaPrior ?? DEFAULT_ALPHA_PRIOR, 'alphaPrior');
  const betaPrior = normalizePrior(options.betaPrior ?? DEFAULT_BETA_PRIOR, 'betaPrior');
  const safeSuccesses = normalizeCount(successes, 'successes');
  const safeFailures = normalizeCount(failures, 'failures');

  return (alphaPrior + safeSuccesses) / (alphaPrior + betaPrior + safeSuccesses + safeFailures);
}

/** Resolve the recall multiplier for a procedural memory from outcome counts. */
export function computeProceduralReliabilityMultiplier(
  signals: ProceduralReliabilitySignals,
  options: WeightedReliabilityOptions = {},
): number {
  return computeWeightedReliability(signals.successes, signals.failures, options);
}

/**
 * Decompose procedural reliability into a prior-centered, evidence-weighted signal.
 *
 * Centering on the prior mean is what lets a reliable procedure earn a promotion: the
 * raw posterior mean tops out at the prior pivot only in the no-evidence case, so a bare
 * `mean - 1` term can never be positive. `centered = mean - priorMean` is positive when
 * the procedure outperforms its prior and negative when it underperforms, and
 * `evidenceWeight` pulls thin-evidence cases back toward neutral so a single noisy
 * outcome cannot swing ranking.
 */
export function computeCenteredReliabilityEvidence(
  signals: ProceduralReliabilitySignals,
  options: WeightedReliabilityOptions = {},
): CenteredReliabilityEvidence {
  const alphaPrior = normalizePrior(options.alphaPrior ?? DEFAULT_ALPHA_PRIOR, 'alphaPrior');
  const betaPrior = normalizePrior(options.betaPrior ?? DEFAULT_BETA_PRIOR, 'betaPrior');
  const safeSuccesses = normalizeCount(signals.successes, 'successes');
  const safeFailures = normalizeCount(signals.failures, 'failures');

  const evidenceCount = safeSuccesses + safeFailures;
  const mean = (alphaPrior + safeSuccesses) / (alphaPrior + betaPrior + safeSuccesses + safeFailures);
  const priorMean = alphaPrior / (alphaPrior + betaPrior);
  const evidenceWeight = evidenceCount / (evidenceCount + alphaPrior + betaPrior);

  return {
    mean,
    priorMean,
    centered: mean - priorMean,
    evidenceCount,
    evidenceWeight,
  };
}
