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
