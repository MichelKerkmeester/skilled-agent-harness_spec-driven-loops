---
title: "Changelog: Citation-Ledger Reranker Research [001-speckit-memory/024-reranker-research]"
description: "Chronological changelog for the citation-ledger reranker research phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-21

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/024-reranker-research` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

This phase is research, not a build, and it closes a 10-iteration deep research on a memory-search reranker with the verdict CONDITIONAL-GO. The recommended lever is a demote-only, score-mutating, per-memory Beta-posterior penalty placed pre-truncation behind a new default-off `SPECKIT_CITATION_RERANK` switch. Under a synthesized full-coverage ledger the prototype moved completeRecall@3 from 0.0357 to 0.2116, the oracle ceiling, but the real-data eval-gate delta is 0.000 by construction because the gold set and the strong-negative set do not intersect. No reranker code shipped, the prototype ran on a live-DB copy and is not committed.

### Added

- Recorded the recommended demote-only Beta-posterior penalty, its `p_used = (1 + cited) / (2 + shown)` formula, its capped-at-1.0 asymmetry, its pre-truncation placement and its five-layer fail-closed guard.
- Recorded the proposed default-off `SPECKIT_CITATION_RERANK` flag as the flag-off shadow gate that keeps the mechanism inert until the data prerequisites are met.

### Changed

- Narrowed the search to a single permitted mechanism using the truncation law, since a reranker reorders the prod top-3 rather than appending to the cut tail.
- Labeled the 0.2116 synthesized-ledger result a capability check rather than a real-traffic win, because the true_citation_events table is absent from the live DB.

### Fixed

- No fixes recorded.

### Verification

- Capability check: synthesized-ledger completeRecall@3 moved 0.0357 to 0.2116, the oracle ceiling, 6 helped 0 harmed.
- Real-data refutation: eval-gate delta 0.000 by construction, 1 of 246 golds in the ledger-shown universe, 0 gold-and-strong-negative intersection, 0 of 6 movable golds with a strong-negative ranked above.
- HVR scan: PASS, 0 em-dashes, 0 prose semicolons and 0 Oxford commas in the phase docs.
- Strict validation: exit 0 for this child folder and the 028 root.

### Files Changed

- `research.md`: the full reranker deep research.
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`: this phase folder, created.
- `description.json`, `graph-metadata.json`: this phase's search and graph metadata.
- `../graph-metadata.json`, `../spec.md`: edited to register the new child in the parent.

### Follow-Ups

- PREREQ-A: enable the true-citation emitter and accumulate real used and not-used pairs until the gold-and-ledger intersection is materially above the current 0.4 percent at the eval golds' top-3 neighbors.
- PREREQ-B: a corpus geometry that exhibits a reliable-negative distractor at fused rank 1 to 3 above a gold at fused rank 4 to 8, which occurs 0 of 6 on real data today.
- A measured prod win waits on real ledger density plus that corpus geometry, the design is preserved and ready.
