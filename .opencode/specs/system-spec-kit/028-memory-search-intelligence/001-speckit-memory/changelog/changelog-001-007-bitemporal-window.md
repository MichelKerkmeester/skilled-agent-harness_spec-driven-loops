---
title: "Changelog: Bi-temporal Window for Spec-Kit Memory Causal + Lineage [001-speckit-memory/007-bitemporal-window]"
description: "Chronological changelog for the Bi-temporal Window for Spec-Kit Memory Causal + Lineage phase."
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

This phase carries the Memory MCP's causal + lineage edges toward a correct bi-temporal window. One candidate is already live; the other four are planned against confirmed seams and await implementation. The headline that matters: superseded facts will close at the time they actually became stale, not the time we happened to notice, so "what did we believe as of date X" stops lying.

### Added

- Add AND invalid_at IS NULL (openEdgeClause) to the promoter cleanup query so already-closed generated edges are skipped (lib/causal/frontmatter-promoter.ts) — SHIPPED e1c6a3c793 (030 §14 row 9)

### Changed

- No broader packet changes recorded.

### Fixed

- Schema-aware guard: clause only applied when columns.has('invalid_at') (fixtures without the column stay compatible) — SHIPPED e1c6a3c793

### Verification

- skip-closed-in-sweep shipped + tested - PASS (030 e1c6a3c793; closed-edge fixture)
- MEM-fact-invalidation-event-time - PENDING (planned; seam confirmed temporal-edges.ts:81,86,94)
- C3-B four-timestamp window - PENDING (additivity against active_memory_projection UNVERIFIED — confirm at build)
- GR-temporal-ordering-invalidation - PENDING (scope test for co-valid pairs not yet written)
- C3-D separation note - RECORDED (decision-record ADR-003)
- validate.sh --strict on this folder - PASS (spec-doc structure)
- Tasks complete - 2 completed task item(s) recorded

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- CHK-001 Requirements documented in spec.md (REQ-001..006)
- CHK-002 Technical approach + sequencing defined in plan.md (spearhead → C3-B → GR-temporal → C3-D)
- CHK-003 Canonical event-time source decided (lineage) and recorded in decision-record.md
- CHK-010 Typecheck/build passes (tsc on mcp_server)
- CHK-011 No new lint warnings in temporal-edges.ts / contradiction-detection.ts / vector-index-schema.ts
- CHK-012 invalidateEdge() keeps its fail-open contract (warn, no throw)
