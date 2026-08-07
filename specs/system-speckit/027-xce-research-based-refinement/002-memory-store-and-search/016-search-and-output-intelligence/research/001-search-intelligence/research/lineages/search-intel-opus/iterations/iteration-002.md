# Iteration 2: Request-Quality Aggregation Redesign

## Focus

Problem 2: `assessRequestQuality` requires `topScore≥0.7 AND qualityRatio≥0.6`, so a strong
top hit with a weaker tail is dragged to "weak". Should a strong TOP alone earn citable?
Design a better set-quality aggregation.

## Findings

1. **The current gate is a conjunction that lets the tail veto a strong head.** Live code:
   `if (topScore >= HIGH_THRESHOLD && qualityRatio >= 0.6) return 'good'`
   [SOURCE: confidence-scoring.ts:310-312], where `HIGH_THRESHOLD=0.7`
   [SOURCE: confidence-scoring.ts:33] and `qualityRatio = highOrMediumCount / results.length`
   [SOURCE: confidence-scoring.ts:308]. A 0.751 top hit with 1 strong + 4 mediocre results gives
   `qualityRatio = 0.2` (if only the top is high/medium), so the AND-gate returns "weak" even
   though the single best answer is citable. The grounding doc's "agent improvement" → top 0.751
   case is exactly this failure.

2. **`qualityRatio` is computed against the *whole returned set*, which over-penalizes recall.**
   Pulling more candidates (good for recall) mechanically lowers `qualityRatio` because the
   denominator grows faster than the high/medium count. This couples two unrelated goals —
   "is the best hit citable" and "is the whole set uniformly good" — into one AND, so improving
   recall (Problem 1) would *worsen* request-quality under the current formula. The two fixes
   must be co-designed.

3. **A strong top hit is, by retrieval theory, the right citability signal.** For a "find the
   relevant memory" task (not "summarize all memories"), precision@1 matters far more than the
   mean quality of positions 2–5. The cosine-scale top score is already available as an absolute
   signal via `resolveCalibrationScore`/`resolveAbsoluteRelevance` [SOURCE: confidence-scoring.ts:135-139,
   pipeline/types.ts:89-96]. Nothing prevents a top-dominant decision rule.

4. **Margin already exists as a computed signal but is not used at the request level.**
   Per-result confidence computes `margin = top.score - next.score`
   [SOURCE: confidence-scoring.ts:191-195,233], and `LARGE_MARGIN_THRESHOLD=0.15`
   [SOURCE: confidence-scoring.ts:45]. A large head-to-tail margin is evidence the top is a
   *distinctive* match (low ambiguity) — the ideal "cite the top, ignore the tail" trigger — yet
   `assessRequestQuality` ignores margin entirely.

## Proposed Aggregation (design, not implementation)

Replace the single AND-gate with a **3-rule disjunction**, evaluated top-first:

- **good** if `topScore ≥ HIGH_THRESHOLD` AND (`qualityRatio ≥ 0.6` **OR** `margin ≥
  LARGE_MARGIN_THRESHOLD`). → a confident, *distinctive* top hit earns "good" even with a weak
  tail; a uniformly strong set still qualifies via the ratio arm.
- **good (top-dominant)** if `topScore ≥ HIGH_THRESHOLD + buffer` (e.g. ≥ 0.8) regardless of
  tail. → an unambiguous near-exact match is always citable.
- **weak / gap** unchanged for the genuinely-low cases (preserves the do-not-cite safety net).

Compute `qualityRatio` over **min(results.length, K)** (e.g. K=5) rather than the full set, so
recall expansion (Problem 1) does not mechanically depress request quality.

## Sources Consulted

- `confidence-scoring.ts` (full: thresholds 33/45, margin 191-195, gate 291-317)
- `pipeline/types.ts:67-96` (resolveEffectiveScore / resolveAbsoluteRelevance)
- Grounding evidence Problem 2 (0.751 top-hit case)

## Assessment

- **newInfoRatio: 0.7** — Builds on iteration 1's recall finding (the two are coupled, a net-new
  insight), and converts the grounding question into a concrete margin-aware disjunction with
  exact thresholds and the K-cap fix for the recall/quality coupling.
- Confidence: HIGH on the defect (AND-gate, ratio-over-full-set), MEDIUM on exact buffer (0.8)
  which should be tuned against a labeled set (see Problem 6).

## Reflection

- **Worked:** noticing that margin is already computed per-result but unused at request level —
  a cheap, in-hand signal.
- **Ruled out:** "drop qualityRatio entirely and gate on topScore only" — too aggressive; a
  single fluke high-cosine hit on a vague query would falsely read "good". Margin OR ratio keeps
  a guard.

## Recommended Next Focus

Iteration 3 → Problem 3: what truncates 10 candidates → 1 returned, and the budget/disclosure fix.
