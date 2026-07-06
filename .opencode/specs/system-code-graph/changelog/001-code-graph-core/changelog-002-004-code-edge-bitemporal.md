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

This phase shipped the bi-temporal schema foundation for `code_edges`, default-off. The table now carries nullable `valid_at` and `invalid_at` generation columns, and the migration has explicit UP, BACKFILL and DOWN helpers. Fresh databases create the columns directly. Legacy databases get an idempotent fail-closed migration that backfills `valid_at` from `graph_generation` and leaves `invalid_at` NULL. Default reads and writes stay byte-identical unless a later consumer sets `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS=true`. The live current views, close-and-insert lifecycle writes and as-of timeline read still wait for a named consumer and a benchmark.

### Added

- Nullable `valid_at` and `invalid_at` columns on `code_edges`, present in both the fresh schema and the legacy migration path.
- Migration helpers `ensureCodeEdgeBitemporalSchema` (UP), `backfillCodeEdgeBitemporalColumns` (BACKFILL) and `rollbackCodeEdgeBitemporalSchema` (DOWN), exported for tests and future migration tooling.
- The `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS` flag that keeps every temporal consumer off by default.
- Focused schema coverage for fresh-init, legacy backfill, idempotent re-run and rollback.

### Changed

- The code-graph schema version advances to add the bitemporal columns without changing default read or write behavior.
- The legacy migration is fail-closed: it refuses to proceed unless the required columns can be added cleanly.

### Fixed

- The validity-window columns now exist for a future as-of consumer, so reindex can record an edge lifetime later even though default writes still replace edges.
- The edge-staleness behavior test dropped a stale exact schema-version assertion that the new migration would otherwise break.

### Verification

- Typecheck - PASS
- Bi-temporal schema and migration Vitest - PASS, 6 cases in `code-edge-bitemporal-schema.vitest.ts`
- Focused migration, schema and indexer Vitest - PASS, 5 files, 117 passed, 1 skipped
- Default read and write parity - PASS, behavior byte-identical with the flag unset
- Live current views - PENDING, gated to ship atomically with a consumer
- Close-and-insert lifecycle writes - PENDING, layered on the columns once a consumer exists
- Symbol timeline and as-of read - PENDING, no consumer named
- validate.sh --strict on this folder - PASS

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts` | Modified | Adds the `valid_at`/`invalid_at` columns, the UP/BACKFILL/DOWN helpers and the default-off read flag |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts` | Added | Covers fresh-init, legacy backfill, idempotent re-run and rollback |
| `.opencode/skills/system-code-graph/mcp_server/tests/edge-staleness-correctness.vitest.ts` | Modified | Drops a stale exact schema-version assertion |

### Follow-Ups

- Name a real as-of or time-travel consumer before wiring the live views and timeline read.
- Keep the migration atomic when the views land: columns, live views and default read routing ship together.
- Capture a benefit number before flipping `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS` on by default.
