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

This is a planning-only phase for Code Graph edge write governance. It keeps the driver-level closed vocabulary for `edge_type` as the anchor, then sequences churn caps, audit-subgraph tombstones and deterministic supersession tiebreaks behind the required migration safety checks. No production code shipped here.

### Added

- A migration-first plan for a closed `edge_type` vocabulary.
- Planned additive siblings for heuristic churn limits, audit-subgraph tombstones and derived-clock tiebreaks.

### Changed

- The phase docs record every edge-governance unit as pending.
- Migration safety now depends on a live distinct-vocabulary scan before any table rebuild.

### Fixed

- No runtime fix shipped in this planning phase.

### Verification

- Seam: code_edges.edge_type is TEXT NOT NULL, no CHECK code-graph-db.ts:184 - PASS (confirmed in live code)
- Seam: parser_skip_list CHECK pattern code-graph-db.ts:208 (the mirror) - PASS (confirmed)
- Seam: nullable tombstone.edge_type code-graph-db.ts:256, tombstone store :250-262, env gate :230, prune-100 :232 - PASS (confirmed)
- Seam: prune tiebreak ORDER BY deleted_at DESC, id DESC code-graph-db.ts:279 and :1493 - PASS (confirmed at both sites)
- Seam: heuristic write sites CALLS structural-indexer.ts:1146, TESTED_BY :2058 - PASS (confirmed in live code)
- Seam: SCHEMA_VERSION = 5 :145, additive schema migration path :450, 10 relations indexer-types.ts:20-22 - PASS (confirmed)
- Pre-migration live-DB DISTINCT vocab scan - NOT RUN, gates migration safety
- validate.sh --strict on this folder - PASS, target state before any completion claim

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- Run the pre-migration live vocabulary scan before the closed-vocab table rebuild.
- Keep the rebuild all-or-nothing, with offending values named and no half-migrated table.
- Recreate indexes and prove row-count plus content round-trip if the migration is later implemented.
