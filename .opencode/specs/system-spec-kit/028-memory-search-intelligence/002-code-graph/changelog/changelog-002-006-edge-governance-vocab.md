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

Nothing has been built yet. This is a planning-only spec folder governing how the Code Graph writes edges. All five candidates are PENDING and none shipped in the Wave-0 record (030 §14, where only Code-Graph Q4-C1 shipped, in a different sub-phase). The plan anchors on the one clean GO of the edge-governance cluster — a driver-level closed-vocabulary CHECK on edge_type — and layers three additive governance siblings that the research deferred onto the tombstone and edge-identity substrate.

### Added

- CHK-002 Technical approach defined in plan.md (anchor migration + 3 additive siblings, phase deps)

### Changed

- CHK-001 Requirements documented in spec.md (REQ-001..008, five candidates scoped, all PENDING)

### Fixed

- No fixes recorded.

### Verification

- Seam: code_edges.edge_type is TEXT NOT NULL, no CHECK code-graph-db.ts:184 - PASS (confirmed in live code)
- Seam: parser_skip_list CHECK pattern code-graph-db.ts:208 (the mirror) - PASS (confirmed)
- Seam: nullable tombstone.edge_type code-graph-db.ts:256; tombstone store :250-262, env gate :230, prune-100 :232 - PASS (confirmed)
- Seam: prune tiebreak ORDER BY deleted_at DESC, id DESC code-graph-db.ts:279 and :1493 - PASS (confirmed — both sites)
- Seam: heuristic write sites — CALLS structural-indexer.ts:1146, TESTED_BY :2058 - PASS (confirmed in live code)
- Seam: SCHEMA_VERSION = 5 :145; ensureSchemaMigrations additive-only :450; 10 relations indexer-types.ts:20-22 - PASS (confirmed)
- Pre-migration live-DB DISTINCT vocab scan - NOT RUN — gates migration safety (the iter-024 unverified gap)
- validate.sh --strict on this folder - PASS (target state; run before any completion claim)

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- CHK-003 Dependencies identified and available (sibling Q1-C2 SUPERSEDES; tombstone machinery; edge-drift.ts; live-DB DISTINCT vocab evidence still RED)
- CHK-010 Code passes lint/format checks (typecheck on system-code-graph/mcp_server)
- CHK-011 No console errors or warnings on a clean scan + migration
- CHK-012 Migration error handling: pre-scan abort is all-or-nothing, names offending values, leaves no half-rebuilt table
- CHK-013 Code follows project patterns (CHECK mirrors parser_skip_list:208; cap integrates with edge-drift.ts; audit EXTENDS tombstones, not a new table)
- CHK-020 All acceptance criteria met (REQ-001 CHECK reject/admit; REQ-002 pre-scan abort; REQ-003 round-trip + SCHEMA_VERSION bump; REQ-004 SUPERSEDES admitted; REQ-005 churn cap; REQ-006 audit extension; REQ-007 derived clock; REQ-008 reversible)
