---
title: "Changelog: Code-Graph Seeded-PPR Impact Ranking Benchmark [007-dark-flag-graduation/005-codegraph-seeded-ppr]"
description: "Chronological changelog for the Code-Graph Seeded-PPR Impact Ranking Benchmark phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-24

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation/005-codegraph-seeded-ppr` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/007-dark-flag-graduation`

### Summary

This phase benchmarked the removed dark mechanism `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` against the flat reverse impact walk on 20 labeled change-impact queries over the live code graph. The mechanism was reconstructed in-harness from its recorded constants without touching the serving path. Both rankers ranked the same shared multi-hop candidate pool to isolate ranking quality from reachability. PPR ties the flat walk on precision, recall and nDCG at every K with a delta of 0.0 across all cells, and the damping sweep shows no value beats flat while 0.95 makes PPR worse. The root cause is uniform edges: all 18,851 CALLS edges carry identical weight so PPR centrality collapses onto the flat walk hop ordering. Verdict: CUT, confirmed by measurement. The flag and its code stay deleted.

### Added
- `scripts/seeded-ppr-impact-benchmark.mjs`: read-only benchmark harness that backs up the live code graph, derives the labeled change-impact set and shared multi-hop pool from real reverse edges, reconstructs the flat pool ranker and bounded seeded PPR from the constants recorded at commit 657a0f6a3e, and writes per-query and aggregate metrics plus the damping calibration sweep.
- `results/metrics.json`: per-query rows for 20 labeled change-impact queries, aggregate precision, recall and nDCG at K of 3, 5 and 8 for both rankers, the damping calibration sweep and the byte-identity record.
- `benchmark-results.md`: full data tables and the graduation verdict.

### Changed
- Nothing in the serving path was changed. The harness is additive and read-only.

### Fixed
- The prior CUT recorded in commit 277c35344c rested on an asserted claim rather than a reproducible per-query measurement. This phase replaces that inherited assertion with measured evidence: the verdict now traces every claim to a value in `results/metrics.json`.

### Verification
- Benchmark run: PASS, `node scripts/seeded-ppr-impact-benchmark.mjs` exits 0 with stable aggregate numbers across runs.
- Live DB integrity: PASS, the live code graph mtime is unchanged after the run and no temporary eval copy leaks.
- PPR vs flat delta: CONFIRMED, delta 0.0 on every precision, recall and nDCG cell at K of 3, 5 and 8.
- nDCG sanity check: CONFIRMED, nDCG drops to 0.77 on a deliberately hop-scrambled order, so the 1.0 result for both rankers is a real ideal ordering not a metric artifact.
- Damping sweep: CONFIRMED, no damping value beats the flat walk and 0.95 makes PPR worse on every metric.
- Byte-identity: CONFIRMED, the flag `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` and the symbol `computeBoundedPersonalizedPageRank` are absent from the live source, the compiled dist and the flag registry.
- Strict validation: PASS, `validate.sh --strict` exits clean for this phase folder.

### Files Changed
- `scripts/seeded-ppr-impact-benchmark.mjs`: created, the read-only benchmark harness.
- `results/metrics.json`: created, per-query and aggregate metric rollup plus the calibration sweep and byte-identity record.
- `benchmark-results.md`: created, full data tables and the CUT verdict.
- `implementation-summary.md`: authored with the full findings narrative and verification record.
- `spec.md`: authored, defining the benchmark scope, requirements and success criteria.

### Follow-Ups
- A non-uniform edge weighting (resolved call targets, observed-versus-inferred provenance, real strength signals) would give PPR a centrality gradient to differentiate on and would change the question. This is a separate edge-quality design not measured here.
- The flat walk could itself expand past 1 hop for impact queries. The pool ranker already shows a hop-stratified multi-hop order is well-formed. This is a separate enhancement this benchmark only motivates.
