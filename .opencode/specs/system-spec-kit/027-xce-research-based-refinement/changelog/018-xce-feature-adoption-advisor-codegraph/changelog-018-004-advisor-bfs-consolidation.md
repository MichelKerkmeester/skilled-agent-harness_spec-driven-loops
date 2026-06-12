---
title: "Changelog: 004-advisor-bfs-consolidation"
description: "Advisor skill-graph transitive_path and subgraph traversal now share one local BFS helper while preserving public outputs."
trigger_phrases:
  - "018 004 advisor BFS changelog"
  - "advisor skill graph BFS"
  - "transitive path subgraph helper"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph/004-advisor-bfs-consolidation` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/018-xce-feature-adoption-advisor-codegraph`

### Summary

The advisor skill graph now uses one local BFS helper for `transitive_path` and `subgraph` traversal. Public response shapes and ordering stay the same, while the helper owns depth caps, visited-set behavior, path matching, and truncation metadata.

### Added

- `bfs-traversal.ts` with `runSkillGraphBfs`, depth clamping, traversal caps, and truncation metadata.
- Helper and parity tests for traversal semantics.

### Changed

- `transitivePath` and `subgraph` now delegate traversal mechanics to the helper while preserving returned objects.

### Fixed

- Removed duplicated queue-loop logic in advisor graph queries.

### Verification

| Check | Result |
|-------|--------|
| Advisor typecheck | PASS |
| Advisor build | PASS |
| BFS/parity tests | PASS: 2 files, 4 tests |
| Skill-graph handler/query suites | PASS: 8 files, 15 passed, 1 skipped |
| Full advisor tests | Existing out-of-scope settings parity failure only |
| Alignment drift and comment hygiene | PASS |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `lib/skill-graph/bfs-traversal.ts` | Created | Advisor-local BFS helper |
| `lib/skill-graph/skill-graph-queries.ts` | Modified | `transitivePath` and `subgraph` cut over |
| `tests/skill-graph-bfs-traversal.vitest.ts` | Created | Helper coverage |
| `tests/skill-graph-queries-parity.vitest.ts` | Created | Legacy parity fixture coverage |

### Follow-Ups

- None identified in the source implementation summary.
