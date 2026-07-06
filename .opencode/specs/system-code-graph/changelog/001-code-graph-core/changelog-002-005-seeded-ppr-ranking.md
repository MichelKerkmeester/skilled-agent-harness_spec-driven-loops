---
title: "Changelog: Code-Graph Seeded-PPR Impact Ranking (Structural Retrieval Intelligence) [002-code-graph/005-seeded-ppr-ranking]"
description: "Chronological changelog for the Code-Graph Seeded-PPR Impact Ranking (Structural Retrieval Intelligence) phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph/005-seeded-ppr-ranking` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph`

### Summary

The impact path now has a bounded personalized PageRank mechanism, default-off behind `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING`. It reuses the Memory weighted-walk substrate through a code-graph edge adapter, limits expansion to impact and multi-hop query classes, projects the working graph undirected and folds confidence plus evidence reliability into transition weights. With the flag unset, the existing flat impact walk remains the served path.

### Added

- `computeBoundedPersonalizedPageRank`, seeded from subject symbols with weighted transitions and a hard iteration cap.
- A query-class taxonomy for single-hop, multi-hop, entity and ambiguous requests.
- Flagged impact-path wiring that preserves the existing flat walk when disabled.
- A decision record that cuts vector-seed union work from this structural-only subsystem.

### Changed

- Code Graph consumes the existing weighted-walk artifact through an adapter instead of authoring a second traversal engine.
- Impact and multi-hop queries can use PPR scoring when flagged on.
- Neighborhood and outline paths short-circuit before PPR, even with the flag enabled.
- Ambiguous query classification fails safe to the existing path.

### Fixed

- The old "dormant PageRank helper" caveat is corrected: the reuse target is the weighted-walk substrate.
- PPR runs inside the existing impact deadline and returns sorted prefixes if the budget cuts off.
- Missing vector backend assumptions are removed from the plan.

### Verification

- PageRank mechanism absent before this phase - PASS
- Weighted-walk reuse target exists - PASS
- "Never-wired PageRank helper" caveat corrected - PASS
- Existing trust factor reused as transition weight - PASS
- Seeded PageRank mechanism - PASS, default-off with benchmark tuning pending
- CG-class-gated-expansion - PASS
- Undirected projection - PASS mechanism, benchmark quality pending
- Multi-hop reliability decay - PASS mechanism, calibration pending

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- Keep PPR default-off until a code-graph retrieval benchmark exists.
- Calibrate damping, cap and reliability weights against measured retrieval quality before claiming lift.
- Upgrade current-set filtering to `invalid_at IS NULL` only after the separate temporal-edge schema migration exists.

## 2026-07-01

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph/005-seeded-ppr-ranking` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph`

### Summary

The benchmark this phase's own Follow-Ups called for did run, under 007-dark-flag-graduation. The result was CUT: PPR tied the flat impact walk exactly, delta 0.0000, on every metric at every K tested, and the damping sweep showed no value beating flat while 0.95 made PPR worse. The flag and the PPR module were deleted at commit 277c35344c. That benchmark record noted every CALLS edge carried identical confidence (0.8/INFERRED/heuristic), leaving PPR nothing to differentiate on, and flagged this as the real gap rather than a refutation of PPR as an algorithm.

A second revisit ran on 2026-07-01 (phase 002-code-graph/010-edge-confidence-and-ppr-revisit) to close that gap. It built real per-edge confidence differentiation for CALLS edges behind a new default-off flag, recovered the deleted PPR module byte-for-byte from git history, reindexed the full repo with the new flag on and re-ran the exact same unmodified benchmark harness against the same 20 labeled queries and damping sweep. With a real confidence gradient in place, the cut was confirmed and the gap widened: PPR now loses on every metric instead of tying it, precision@3 -0.10, precision@5 -0.04 to -0.06, precision@8 -0.031 to -0.038, recall@3 through recall@8 -0.01 to -0.05, nDCG@3 -0.057, nDCG@5 -0.04, nDCG@8 -0.03. Giving PPR a real gradient to differentiate on made it perform worse than the uniform-weight tie, not better.

### Verification

- Original benchmark run (007-dark-flag-graduation/005-codegraph-seeded-ppr) - PASS, CUT verdict, delta 0.0000 across all metrics
- Revisit benchmark run (002-code-graph/010-edge-confidence-and-ppr-revisit) with real edge-confidence differentiation - PASS, cut confirmed and strengthened, PPR loses on every metric

### Follow-Ups

- No further seeded-PPR revisit planned. This question is closed: see `../../007-dark-flag-graduation/005-codegraph-seeded-ppr/benchmark-results.md` and `./changelog-002-010-edge-confidence-and-ppr-revisit.md`.
