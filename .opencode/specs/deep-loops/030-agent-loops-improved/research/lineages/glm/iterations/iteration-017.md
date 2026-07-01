# Iteration 017 — NEW: Convergence Denominator Drag (Round-1 F-013, Deepened)

**Focus:** Does the monotonic-denominator convergence math structurally suppress late discoveries?
**Angle:** Reason about the newInfoRatio formula over 30+ iterations.

## Findings

Round-1 F-013 hypothesized "convergence denominator drag." Deepening: newInfoRatio is computed as (newly discovered info / accumulated research knowledge). The denominator is MONOTONIC — it only grows. By iteration 25-30 of a 35-iteration loop, even genuinely novel findings get divided by a large accumulated base, pushing the ratio below any fixed threshold (0.01 here).

**Mathematical inevitability:** if the loop discovers ~1 unit of novelty/iteration and accumulates ~25 units by iteration 25, a fully-novel iteration 26 yields ratio ≈ 1/26 ≈ 0.038. To stay ABOVE 0.01 at iteration 30, an iteration must contribute >0.30 of accumulated-units worth of novelty — an increasingly high bar as the base grows.

**Consequence for stopPolicy=max-iterations:** this is EXACTLY why max-iterations exists — convergence-mode would legally stop around iteration 18-22 (as round 1 did) even when the operator wants 35. The 0.01 threshold + monotonic denominator is a structurally-decaying signal that CANNOT sustain 35 iterations of genuine novelty without heroic per-iteration discovery.

**Recommendation (deepens F-013):** add an optional `slidingWindow` convergence mode that computes newInfoRatio over the last N iterations (e.g. N=5) rather than the full accumulated base. This makes late-iteration novelty legible and would let convergence-mode loops run longer without forcing max-iterations. This is design work, not a bug — but it directly addresses why round 1 needed round 2.

## Evidence
[SOURCE: deep-research/SKILL.md:27-31 — newInfoRatio semantics, fully-new=1.0]
[SOURCE: round-1 research.md:7 — converged at iteration 18 of 35 on 0.01 signal]

## newInfoRatio: 0.7 (deepened the math; concrete slidingWindow recommendation)
