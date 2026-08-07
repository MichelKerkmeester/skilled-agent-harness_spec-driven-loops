---
title: "Changelog: Edge-Presence Currentness and Temporal Recall [001-speckit-memory/008-edge-presence-currentness]"
description: "Chronological changelog for the edge-presence currentness and temporal recall phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/008-edge-presence-currentness` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

This phase shipped the C3-A edge-presence currentness candidate behind the default-off `SPECKIT_EDGE_PRESENCE_CURRENTNESS` flag, alongside a sequenced Level-3 plan for the four remaining candidates. The read-side currentness reconciliation lands in `temporal-edges.ts` `getValidEdges` with its schema migration, and recall stays byte-identical while the flag is off. The four remaining currentness and temporal-recall candidates stay pending schema, benchmark and shared-infra evidence. Commit `cb92f2f211` carried the slice with a 241-line passing test.

### Added

- Added the C3-A read-side currentness reconciliation in `lib/graph/temporal-edges.ts` behind `SPECKIT_EDGE_PRESENCE_CURRENTNESS`.
- Added the schema migration in `lib/search/vector-index-schema.ts` and the default-off flag in `lib/search/search-flags.ts`.
- Added the Level-3 planning set and candidate gating for the four remaining candidates.

### Changed

- Converted the original flip-shaped idea into a read-side build plan.
- Synchronized the spec, plan, task list and decision record around C3-A shipped and four candidates pending.

### Fixed

_No fixes recorded._

### Verification

- Strict phase validation: PASS.
- Wave-0 evidence cross-check: PASS.
- Code verification: PASS. C3-A test 3 pass and typecheck 0 at commit `cb92f2f211`.

### Files Changed

- `lib/graph/temporal-edges.ts`: C3-A `getValidEdges` currentness reconciliation, a no-op when the flag is off.
- `lib/search/vector-index-schema.ts`: schema migration for the currentness slice.
- `lib/search/search-flags.ts`: default-off `SPECKIT_EDGE_PRESENCE_CURRENTNESS` flag.
- `tests/edge-presence-currentness.vitest.ts`: 241-line coverage, 3 pass.

### Follow-Ups

- Land the bi-temporal substrate before building the currentness readers.
- Keep current-mode recall byte-identical until a consumer is enabled.
- Implement the read-side edge-presence filter with focused temporal tests.
