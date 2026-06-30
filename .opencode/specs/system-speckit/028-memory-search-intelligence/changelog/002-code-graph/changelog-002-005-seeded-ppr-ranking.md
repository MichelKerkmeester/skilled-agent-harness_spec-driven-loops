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
