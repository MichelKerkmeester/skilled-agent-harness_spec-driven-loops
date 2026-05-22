// ───────────────────────────────────────────────────────────────
// MODULE: Deep-Loop Bayesian Scorer
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// 1. CORE LOGIC
// ───────────────────────────────────────────────────────────────

export function computeScore(success: number, total: number): number {
  if (!Number.isInteger(success) || !Number.isInteger(total)) {
    throw new RangeError('success and total must be integers');
  }
  if (success < 0 || total < 0) {
    throw new RangeError('success and total must be non-negative');
  }
  if (success > total) {
    throw new RangeError('success cannot exceed total');
  }

  return (success + 1) / (total + 2);
}

export function shouldDemote(score: number, totalCalls: number): boolean {
  if (!Number.isFinite(score)) {
    throw new RangeError('score must be finite');
  }
  if (!Number.isInteger(totalCalls) || totalCalls < 0) {
    throw new RangeError('totalCalls must be a non-negative integer');
  }

  return score < 0.5 && totalCalls >= 3;
}
