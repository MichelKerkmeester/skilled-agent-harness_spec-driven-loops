---
title: "Changelog: Code-Graph Edge Write-Time Governance (closed-vocab CHECK + churn cap + audit + derived-clock tiebreak) [002-code-graph/006-edge-governance-vocab]"
description: "Chronological changelog for the Code-Graph Edge Write-Time Governance (closed-vocab CHECK + churn cap + audit + derived-clock tiebreak) phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph/006-edge-governance-vocab` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph`

### Summary

This phase shipped Unit 1 of Code Graph edge write governance behind the default-off `SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB` flag. The closed `edge_type` CHECK migration rebuilds `code_edges` with a pre-rebuild DISTINCT vocabulary scan, an all-or-nothing abort on out-of-vocab values, a rollback helper and `SCHEMA_VERSION` 7 to 8. The churn cap, audit-subgraph and derived-clock siblings stay deferred behind their migration safety checks. Commit `725fb19d7b` carried the lib code and a 261-line passing test.

### Added

- Added the default-off `SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB` closed-vocab `edge_type` CHECK migration in `lib/code-graph-db.ts`.
- Added the exported `EDGE_TYPES` runtime vocabulary in `lib/indexer-types.ts` as the single source for the TypeScript union and the SQLite CHECK.
- Planned additive siblings for heuristic churn limits, audit-subgraph tombstones and derived-clock tiebreaks.

### Changed

- The phase docs record Unit 1 as shipped and the three governance siblings as deferred.
- Migration safety depends on a live distinct-vocabulary scan before any table rebuild.

### Fixed

- No runtime bug fix. The shipped change is an additive, default-off governance migration.

### Verification

- Seam: code_edges.edge_type is TEXT NOT NULL, no CHECK code-graph-db.ts:184 - PASS (confirmed in live code)
- Seam: parser_skip_list CHECK pattern code-graph-db.ts:208 (the mirror) - PASS (confirmed)
- Seam: nullable tombstone.edge_type code-graph-db.ts:256, tombstone store :250-262, env gate :230, prune-100 :232 - PASS (confirmed)
- Seam: prune tiebreak ORDER BY deleted_at DESC, id DESC code-graph-db.ts:279 and :1493 - PASS (confirmed at both sites)
- Seam: heuristic write sites CALLS structural-indexer.ts:1146, TESTED_BY :2058 - PASS (confirmed in live code)
- Seam: SCHEMA_VERSION = 5 :145, additive schema migration path :450, 10 relations indexer-types.ts:20-22 - PASS (confirmed)
- Pre-migration live-DB DISTINCT vocab scan - NOT RUN against a rebuild, gates migration safety
- Governance migration tests - PASS, 3 files / 15 tests covering CHECK admit/reject, row preservation, abort safety and rollback
- validate.sh --strict on this folder - PASS

### Files Changed

- `lib/code-graph-db.ts`: default-off flag, `SCHEMA_VERSION` 7 to 8, pre-rebuild DISTINCT scan and table-rebuild UP/DOWN helpers.
- `lib/indexer-types.ts`: exported `EDGE_TYPES` vocabulary feeding the union and the CHECK migration.
- `tests/code-edge-governance-vocab.vitest.ts`: 261-line coverage of flag gating, CHECK admit/reject, row preservation, abort safety and rollback.

### Follow-Ups

- Run the pre-migration live vocabulary scan before the closed-vocab table rebuild.
- Keep the rebuild all-or-nothing, with offending values named and no half-migrated table.
- Recreate indexes and prove row-count plus content round-trip if the migration is later implemented.
