# Iteration 5: Calibration Headroom + Cross-Cutting Synthesis

## Focus

Problem 6: confidence tops out ~0.88 by construction; is the band well-spread or should it be
recalibrated against a labeled relevance set? Plus: how do the six fixes interact?

## Findings — Problem 6 (calibration)

1. **The 0.88 cap is real and decomposes exactly.** `value = heuristicValue + scorePrior` where
   `heuristicValue = rawValue · 0.6` and `rawValue = 0.35·margin + 0.30·channel + 0.15·anchor`
   (max 0.80 → heuristic max 0.48), and `scorePrior = calibrationScore · 0.4` (max 0.40)
   [SOURCE: confidence-scoring.ts:40-42,253-264]. Max = 0.48 + 0.40 = **0.88**. Labels:
   HIGH≥0.7, MEDIUM≥0.4 [SOURCE: confidence-scoring.ts:33-34].

2. **The deeper defect is not the cap — it is that the band is not monotonic in relevance.**
   Relevance (cosine) contributes at most 40% of the score; the heuristic factors
   (margin/channel/anchor) contribute 60%. Worked example: a genuinely strong **0.89 cosine** hit
   that is single-channel, anchor-poor, and at the tail (no margin) scores
   `0.4·0.89 + 0.6·(0.30·0.5) = 0.356 + 0.09 = 0.446` → only **"medium"**, barely above the 0.4
   floor [derived from confidence-scoring.ts:238-264]. So a near-exact match can read "medium"
   purely because it arrived via one channel with no neighbors — the score punishes good *isolated*
   hits, which is precisely the generic-query case (Problem 1). The heuristics were designed for
   *set agreement*, but they leak into *per-result relevance confidence*.

3. **Recommendation: recalibrate against a small labeled relevance set, and rebalance toward the
   absolute signal.** Two moves: (a) lift the `scorePrior` weight (e.g. 0.4→0.55) and trim the
   heuristic weight so relevance dominates per-result confidence; (b) build a labeled
   query→relevant-memory set (~50–100 pairs drawn from real `memory_search` traffic), fit an
   isotonic or Platt calibration so `confidence.value ≈ P(relevant)`, and let the labels — not
   hand-picked constants — set HIGH/LOW thresholds. The 0.88 cap is harmless once the band is
   monotonic; do not chase 1.0.

## Findings — Cross-cutting synthesis

4. **All six problems share one root and packet-015 fixed only its first instance.** The root:
   the pipeline repeatedly reads *relative ranking* signals (RRF magnitude, heuristic set-
   agreement) where it needs *absolute relevance*, then applies conservative AND-gates and hard
   truncations that compound. Packet-015's `resolveAbsoluteRelevance` fix
   [SOURCE: pipeline/types.ts:89-96] closed the calibration-prior instance; the same pattern
   recurs in request-quality aggregation (P2), the budget hard-break (P3), RRF-ordered truncation
   (P4), and the heuristic-dominated confidence band (P6).

5. **The fixes are coupled and MUST ship as one bundle, sequenced by dependency.** Fixing recall
   (P1: route generic/low-confidence queries to the deep HyDE+expansion path) *without* P2 makes
   request-quality **worse** (a longer tail lowers `qualityRatio`), and *without* P3's min-floor
   the recovered hits get truncated away by the greedy-break budget. The labeled set (P6) is the
   measurement backbone that lets P2/P4/P6 be tuned rather than guessed. Recommended sequence:
   **P3 budget floor (safety, unblocks everything) → P2 top-dominant quality → P1 recall routing →
   P6 labeled-set recalibration → P4 cosine reorder → (P5 no-op).**

## Sources Consulted

- `confidence-scoring.ts:33-34,40-42,238-264` (calibration math)
- `pipeline/types.ts:89-96` (absolute-relevance fix); iterations 001–004 (this lineage)

## Assessment

- **newInfoRatio: 0.2** — Mostly consolidation: the calibration decomposition and the
  non-monotonicity worked example are net-new, but the cross-cutting root cause and sequencing
  synthesize prior iterations rather than discovering new mechanisms. Rolling-average novelty has
  dropped 1.0→0.7→0.6→0.5→0.2; the investigation has converged on all six problems.
- Confidence: HIGH on the calibration math and the shared root cause (all code-confirmed).

## Reflection

- **Worked:** the per-result worked example (0.89 cosine → 0.446 "medium") made the
  non-monotonicity concrete and tied P6 back to P1.
- **Ruled out:** "raise the 0.88 cap to 1.0" — the cap is harmless; the fix is monotonicity +
  labeled calibration, not a bigger ceiling.

## Recommended Next Focus

Converged — proceed to synthesis. No further iteration needed (all 6 problems have concrete,
file:line-grounded proposals; newInfoRatio below convergence threshold).
