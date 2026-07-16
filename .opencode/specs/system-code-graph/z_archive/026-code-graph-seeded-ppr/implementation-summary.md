---
title: "Implementation Summary: Code-Graph Seeded-PPR Impact Ranking Benchmark"
description: "Status COMPLETE. Benchmarked the removed dark mechanism SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING against the flat reverse impact walk on 20 labeled change-impact queries over the live code graph, both rankers ranking the same multi-hop candidate pool so the comparison isolates ranking quality from reachability. Reconstructed the removed bounded seeded personalized PageRank from its recorded constants without importing or editing production code. PPR ties the flat walk on precision recall and nDCG at every K (delta 0.0) and no damping in the sweep beats flat while 0.95 makes it worse, because every CALLS edge carries identical weight so PPR centrality collapses onto the flat walk hop ordering and only adds intra-tier churn. Default-off byte-identity is exact since the flag and PPR symbol are absent from the live source dist and registry. Verdict CUT confirmed by measurement, the flag and code stay deleted, a non-uniform edge weighting recorded as the only path that could change the answer."
trigger_phrases:
  - "code graph seeded ppr benchmark summary"
  - "seeded pagerank vs flat impact walk"
  - "SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING cut"
  - "ppr ties flat walk uniform edges"
  - "personalized pagerank code graph verdict"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/026-code-graph-seeded-ppr"
    last_updated_at: "2026-07-06T17:15:57.046Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran the seeded-PPR vs flat-walk benchmark and authored the CUT verdict"
    next_safe_action: "Phase complete, verdict lives in benchmark-results.md"
    blockers: []
    key_files:
      - "scripts/seeded-ppr-impact-benchmark.mjs"
      - "results/metrics.json"
      - "benchmark-results.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Complete |
| **Completed** | 2026-06-24 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A read-only benchmark and a verdict for the dark code-graph mechanism `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING`. The mechanism shipped a bounded seeded personalized PageRank on the impact path behind a default-off flag in commit 657a0f6a3e with calibration noted as pending, then a flag-resolution pass removed it in 277c35344c with a one-line claim that uniform edges make PPR equal to the prior ranking. No reproducible per-query benchmark ever measured it. This phase closes that gap. It reconstructs the removed PPR from its recorded constants, ranks a real edge-derived change-impact pool both with PPR and with the flat reverse impact walk the code graph serves, and returns a verdict grounded in numbers.

The findings:

**The comparison isolates ranking quality from reachability.** The first instinct, comparing recall over each ranker's own candidate set, would credit PPR for reaching multi-hop files the flat 1-hop walk structurally cannot, which measures reach not ranking. The benchmark fixes this by ranking the same shared multi-hop candidate pool with both rankers, so any difference is a ranking-quality difference. The pool is every file reverse-reachable from the changed symbol through CALLS and IMPORTS within maxHops (mean 34.8 files), and the precision ground truth is the 1-hop direct dependents (mean 16.1 files).

**PPR ties the flat walk on every quality metric at every K.** Over 20 labeled change-impact queries, precision@K, recall@K and nDCG@K are identical for PPR and the flat walk at K of 3, 5 and 8, with a delta of 0.0 on every cell. nDCG is 1.0 for both, a real ideal ordering confirmed by the same metric dropping to 0.77 on a hop-scrambled order. The top-8 file order differs on every query (identical-order rate 0 of 20), but that is intra-tier churn, a reshuffle among same-hop files that carries no quality because same-hop files share the same impact relevance.

**No damping unlocks a win.** The calibration sweep across damping 0.5 through 0.95 shows the best value (0.5) only ties the flat walk at nDCG@5 1.0, and damping 0.95 makes PPR worse on every metric. Tuning can only erode the tie, never beat the baseline.

**The root cause is uniform edges.** The live graph has 18,851 CALLS edges and every one carries the identical metadata, INFERRED, confidence 0.8, weight 0.8. The PPR transition weight is therefore a constant for every CALLS edge, so the PPR mass distributes by hop distance, exactly the structural prior the flat walk already encodes. PPR collapses onto the flat hop ordering at mid-and-low damping and injects cross-tier noise at high damping. This is the measured form of the prior CUT's claim, now confirmed per query.

**Default-off byte-identity is exact.** The flag and the symbol `computeBoundedPersonalizedPageRank` are absent from the live code-graph source, the compiled dist and the flag registry (grep empty across all three). The served impact ranker is the flat walk unconditionally, so there is no PPR code in serving to diverge from, and the PPR numbers come only from the in-harness reconstruction.

**Verdict: CUT, confirmed by measurement.** PPR earns no keep on this substrate. It ties the flat walk on every quality axis and no damping beats it, because the uniform-weight CALLS graph gives centrality nothing to differentiate on. The flag and its code are already removed, so this verdict confirms the deletion stands on evidence rather than on an inherited claim. A REFINE would require a non-uniform edge weighting that gives PPR a centrality gradient, which is a separate edge-quality design recorded as an open question, not a tuning of the dark flag, and this benchmark provides no evidence it would win.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The setup located the live code graph, confirmed the CALLS and IMPORTS edge metadata shape (every CALLS edge INFERRED confidence 0.8 weight 0.8) and recovered the removed PPR constants and the transition-weight and reliability functions from the code-graph source at 657a0f6a3e. The core wrote `scripts/seeded-ppr-impact-benchmark.mjs`, which backs up the live code graph read-only to a temporary copy, derives the labeled change-impact set and the shared multi-hop pool and the 1-hop direct-impact ground truth from real reverse edges, reconstructs the flat pool ranker and the bounded seeded PPR over the undirected projection with the recorded transition weights, and scores precision recall and nDCG at K of 3 5 and 8 plus a damping calibration sweep into `results/metrics.json`. The verification confirmed the run reproduces exit 0 with stable aggregate numbers, the live DB mtime is unchanged and no eval copy leaks, then authored the data tables in `benchmark-results.md` and this verdict, every number sourced from `metrics.json`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Rank the same shared pool with both rankers.** Comparing recall over different candidate sets would credit PPR for reach not ranking. The shared multi-hop pool makes any difference a ranking-quality difference, which is the only fair test of the mechanism.
- **Reconstruct the removed mechanism, do not restore it.** The flag and code were already deleted, so the harness rebuilds PPR in-process from the recorded constants and never touches the serving path, keeping the benchmark read-only and the verdict honest about what ships.
- **Use nDCG with an inverse-hop graded relevance as the headline.** Precision and recall over the direct set are coarse, nDCG rewards ordering nearer-impact files first, which is exactly the quality a centrality ranker would have to improve to earn a keep.
- **Sweep the damping before concluding.** The changelog held calibration as pending, so a CUT that did not test damping would inherit the same gap. The sweep shows no value beats flat and high damping makes it worse, so calibration is measured to not unlock a win.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `node scripts/seeded-ppr-impact-benchmark.mjs` reproduces the benchmark from the live code graph read-only, exit 0, with stable aggregate numbers across runs.
- The live code graph mtime is unchanged after the run and no temporary eval copy leaks, so the read-only boundary held.
- `results/metrics.json` reports the per-query rows for 20 labeled change-impact queries and the aggregate precision recall and nDCG at K of 3 5 and 8 for the flat walk and for PPR, plus the damping calibration sweep.
- PPR ties the flat walk with a delta of 0.0 on every precision recall and nDCG cell, and no damping in the sweep beats the flat walk while 0.95 makes PPR worse, every number sourced from `metrics.json`.
- The flag and the PPR symbol are confirmed absent from the live source, the compiled dist and the flag registry, so the default-off byte-identity is exact.
- `validate.sh --strict` on this phase exits clean.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **The verdict is a verdict on PPR over this substrate, not on PPR as an algorithm.** The mechanism cannot win because every CALLS edge carries identical weight. A non-uniform edge weighting (resolved call targets, observed-versus-inferred provenance, real strength signals) would give PPR a centrality gradient to differentiate on, which would change the question. That is a separate edge-quality design, recorded as an open question, and this benchmark provides no evidence it would win.
- **The flat walk is reconstructed, not invoked through the live server.** The harness mirrors the served `code-graph-context.ts` impact path from source rather than dispatching through the MCP handler, to keep the benchmark self-contained and read-only. The served ranker is confirmed to be the flat walk by the absent-flag grep, so the reconstruction matches what ships.
- **One graph snapshot, one labeled set.** The numbers are measured on the 20 top-fan-in change-impact queries against one read-only code-graph backup. They establish that PPR ties the flat walk and that uniform edges are the cause, but the precise rates would shift with a different query mix or a re-indexed graph.
- **The labeled ground truth is structural, not human.** The true impacted files are the 1-hop reverse dependents derived from real edges, which is the strongest structural impact signal available, but a human-curated change-impact set could differ at the margin from the edge-derived one.
<!-- /ANCHOR:limitations -->
