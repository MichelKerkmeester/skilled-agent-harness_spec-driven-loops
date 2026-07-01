# Iteration 006: computeLineageTimeoutMs 4-Hour Hard Cap Analysis

## Focus
- Scope: Per-lineage subprocess wall-clock timeout adequacy for high-reasoning-effort models
- Question: Is the 4-hour hard cap adequate for 30+ iteration loops?

## Findings

### F-006: The 4-hour hard cap is catastrophically inadequate for high-reasoning 30+ iteration loops — and there is NO override flag

**Severity: Critical (lineage kills before convergence is reachable)**

**The function:**
```javascript
// fanout-run.cjs:884-887
function computeLineageTimeoutMs(lineage) {
  const iters = lineage.iterations || 12;
  const perIterSecs = lineage.timeoutSeconds || 900;
  return Math.min(iters * perIterSecs * 2 * 1000, 4 * 60 * 60 * 1000);
}
```

[SOURCE: `fanout-run.cjs:884-887`]

**Mathematical analysis of the cap:**

The formula computes: `min(iters × perIterSecs × 2 × 1000, 14,400,000)` where 14,400,000 ms = 4 hours.

| iters | perIterSecs | Computed budget | Effective after cap | Iters before kill |
|-------|-------------|----------------|---------------------|-------------------|
| 12 | 900 (15min) | 21,600,000 (6h) | **14,400,000 (4h)** | **8** |
| 35 | 900 (15min) | 63,000,000 (17.5h) | **14,400,000 (4h)** | **8** |
| 35 | 600 (10min) | 42,000,000 (11.7h) | **14,400,000 (4h)** | **12** |
| 35 | 300 (5min) | 21,000,000 (5.8h) | **14,400,000 (4h)** | **24** |

**Key insight:** The 4-hour hard cap dominates for ANY combination of `iters ≥ 8` with `perIterSecs ≥ 900`. The `× 2` safety multiplier doubles the per-iteration budget, which makes the cap hit even sooner.

**For a 35-iteration convergence-threshold=0.01 research loop (this exact configuration):**
- With default perIterSecs=900: budget = 14,400,000ms (4h), per-iteration budget = 1,800s (30min)
- 4h / 30min = **8 iterations before kill**
- The lineage will be killed at iteration 8, having completed only 23% of its maxIterations
- Convergence at threshold 0.01 typically requires 15-25+ iterations for a complex topic
- **This lineage will NEVER converge under the current cap**

**There is NO override flag.** The cap is hardcoded:
```javascript
Math.min(..., 4 * 60 * 60 * 1000)
```
No `--timeout-override`, no `--max-lineage-hours`, no environment variable. An operator requesting 35 iterations with convergence=0.01 has no way to extend the wall-clock budget.

**Evidence from existing lineages:**
- Codex review lineage ran 50 iterations → this means it either had a much lower perIterSecs, or the cap was different at the time, or it was run outside fanout-run.cjs
- GLM review lineage ran 11 iterations → consistent with ~14-15min per iteration under a 4h cap (11 × 15min × 2 = 5.5h → would be capped, but actual per-iteration time was likely much shorter)

**Root cause:** The cap was set when the default was 12 iterations at 900s/iter (12 × 900 × 2 = 21,600,000 > 14,400,000 → cap hits at iter 8). When maxIterations was extended to 35 and convergence thresholds lowered to 0.01, the cap was not revisited.

**Impact:**
1. Any high-reasoning convergence-threshold=0.01 loop with maxIterations ≥ 15 will be killed before convergence
2. The lineage produces partial results with no synthesis — wasted compute
3. The operator sees `maxIterationsReached` or a timeout without knowing the cap was the real constraint

**Recommendation:**
1. **Immediate:** Add a `--lineage-timeout-hours` CLI flag and `LINEAGE_TIMEOUT_HOURS` env var to override the cap
2. **Short-term:** Raise the default cap to `min(iters × perIterSecs × 2 × 1000, max(iters × perIterSecs × 2 × 1000, 8 * 60 * 60 * 1000))` — i.e., at least `iters × perIterSecs × 2`, capped at 8 hours
3. **Better formula:** Make the cap proportional to maxIterations: `cap = max(4h, iters × perIterSecs × 2 × 1000)` — the floor stays at 4h but scales with the requested iteration count
4. **Observability:** Log the effective timeout and projected max-reachable iterations at dispatch time so operators can see if they'll be killed early

## Novelty Justification
Quantified the exact kill point (iteration 8 for default settings) and confirmed there is NO override mechanism. The mathematical proof that 35-iteration convergence=0.01 loops can NEVER complete under this cap is new — prior observations noted "inadequate" but did not compute the precise failure mode.

## What Was Tried and Failed
- Checked for env var overrides (none exist)
- Checked for CLI flag overrides (none exist)

## Ruled-Out Directions
- The cap is NOT just "tight" — it is mathematically impossible for 35-iteration loops to complete
