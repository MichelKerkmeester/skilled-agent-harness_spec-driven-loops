---
title: "Changelog: Bi-temporal Window for Spec-Kit Memory Causal and Lineage [001-speckit-memory/007-bitemporal-window]"
description: "Chronological changelog for the bi-temporal window for Spec-Kit Memory causal and lineage phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/007-bitemporal-window` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

The phase delivered the schema-migration foundation for bi-temporal Memory causal and lineage data. Schema version 38 adds an additive four-timestamp window to causal edges and fills the missing transaction-time columns on memory lineage, with explicit up, backfill and down helpers. Current readers keep using the legacy open-edge predicate and transaction-time recall stays default-off. Event-time invalidation and chronology-driven behavior remain deferred consumers.

### Added

- Added the additive four-timestamp window for causal edges.
- Added missing transaction-time lineage columns.
- Added explicit migration, backfill, rollback, idempotency and fresh-init coverage.

### Changed

- Kept current-edge readers on the existing open-edge test.
- Added a default-off recall flag for later transaction-time consumers.
- Preserved active projection behavior while the new columns backfill.

### Fixed

- Kept closed generated edges out of promoter cleanup when the schema has the close column.
- Proved fixtures without the close column remain compatible.

### Verification

- Skip-closed sweep fixture: PASS.
- Four-timestamp schema foundation: PASS.
- TypeScript gate: PASS.
- Focused migration, temporal and search-flag Vitest: PASS, 4 files and 84 tests.
- Broad memory, schema, search and migration slice: baseline-matched existing failures with 6 new passing tests.
- Strict phase validation: PASS.

### Files Changed

_Detailed file-level changes live in the phase implementation summary._

### Follow-Ups

- Implement event-time invalidation as the next writer-side consumer.
- Add chronology-driven invalidation only for conflicting relation pairs.
- Keep transaction-time recall behind its default-off flag until benchmark evidence exists.
