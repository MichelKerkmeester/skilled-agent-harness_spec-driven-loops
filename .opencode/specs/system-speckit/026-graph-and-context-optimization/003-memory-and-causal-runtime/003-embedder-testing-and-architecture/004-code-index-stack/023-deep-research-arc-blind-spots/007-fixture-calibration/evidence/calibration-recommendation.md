# Calibration Recommendation

## Current Recommendation

Do not change production defaults in 023B.

The packet now has the expanded fixture, the repeated-run harness, and residual miss classifier needed to make that decision with evidence. The full sweep is intentionally long: roughly 20 minutes per run and roughly 60 minutes for `--runs 3`. I ran a live five-probe smoke sample to prove the CLI path still executes, but that sample is not statistically meaningful.

## Default RRF Tuple

Keep `(K=60, V=0.9, F=0.5)` until the full perturbation sweep completes. The harness covers `K in {10, 30, 60, 100, 150, 300}` and the unit test locks the expected flat-line decision rule: hit-rate spread across K values must stay below `0.05` to confirm pass-2 FINDING-014-A.

## Hybrid Boost Magnitudes

Do not re-magnitude path-class or canonical boosts from this packet alone. The fixture now includes generated, vendor, docs, tests, implementation, and spec-research truth targets, so the full boost sweep can measure whether path-class/canonical boosts numerically dominate adjacent RRF gaps. If the full sweep shows the same truth paths displaced by boosted aliases across `n >= 3`, open a follow-on default-change packet.

## Rerank Top-K

Keep `rerank_top_k=20` until the top-K sweep completes. The harness covers `K in {5, 10, 20, 40, 80}` and records p95 latency alongside hit rate so the recommendation can avoid a blind accuracy-only increase.

## Fusion Formula

Keep RRF as the production formula for now. The harness defines ablation lanes for RRF, CombMNZ, and equal-weight average. The alternatives are measurement candidates, not default changes, because they are not yet wired as production config in `query.py`.

## Follow-On Condition

Only change defaults if the completed `--runs 3` sweep shows an unambiguous winner with higher mean hit rate, no expanded-fixture path-class regression, and p95 below the ROBUST gate.
