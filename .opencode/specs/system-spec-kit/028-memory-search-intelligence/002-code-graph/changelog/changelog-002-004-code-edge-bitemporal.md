---
title: "Changelog: Code-Edge Bi-temporal Lifecycle (Q1-C1 cluster) [002-code-graph/004-code-edge-bitemporal]"
description: "Chronological changelog for the Code-Edge Bi-temporal Lifecycle (Q1-C1 cluster) phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph/004-code-edge-bitemporal` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph`

### Summary

This phase deliberately ships no production change. It records the decision to defer bi-temporal `code_edges` until a real as-of or time-travel consumer exists. The gap is real: reindexing still replaces edges without a validity window. The evidence says building that schema now would be speculative, redundant with readiness checks and unrelated to the dependency-transitivity bug handled by a sibling phase.

### Added

- No production additions.
- A sequenced plan for the future schema migration, live views and timeline read path.

### Changed

- The phase docs preserve the deferred design without implying a schema migration landed.
- Future work is ordered around a named consumer, the generation watermark and an atomic live-view migration.

### Fixed

- No runtime fix shipped in this planning phase.

### Verification

- Deferred decision recorded - PASS
- Bi-temporal edge columns - PENDING, gated on generation support and a named consumer
- Live current views - PENDING, gated to ship atomically with the column migration
- Edge lifecycle versioning - PENDING, only valid on top of the future columns
- Symbol timeline query - PENDING, no consumer named
- validate.sh --strict on this folder - PASS (spec-doc structure)

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- Name a real as-of or time-travel consumer before reopening the migration.
- Keep the migration atomic if it is later built: columns, live views and default read routing ship together.
- Run typecheck, schema round-trip tests and strict validation before any future implementation closeout.
