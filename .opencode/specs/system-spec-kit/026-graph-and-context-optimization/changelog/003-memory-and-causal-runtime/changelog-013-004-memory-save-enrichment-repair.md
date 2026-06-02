---
title: "013/004 memory_save Replay Enrichment Repair: schema v30 marker + repair-on-replay"
description: "Durable per-row enrichment-completion marker (schema v30) repaired idempotently on dedup replay and under the scan lease, closing the commit-before-enrichment replay hole. Implemented via parallel gpt-5.5-fast xhigh, integrated, and deployed to the live memory DB."
trigger_phrases:
  - "memory_save enrichment repair changelog"
  - "schema v30 enrichment marker"
  - "repair on replay scan backfill"
  - "post-insert enrichment completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-02

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/004-memory-save-enrichment-repair` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation`

### Summary

Shipped and **deployed** the first deferred follow-up of the memory-index-scan roadmap. `memory_save` commits the primary row inside `writeTransaction.immediate()`, then runs secondary enrichment (FTS, vector, entity/summary, causal/graph) afterward. A SIGKILL in that window left a committed-but-unenriched row that dedup replay (`unchanged`/`duplicate`) never repaired — the memory stayed invisible to search until an unrelated scan re-indexed it. This packet adds a durable per-row enrichment-completion marker (schema v30), repaired idempotently on the dedup replay return and as a bounded scan-lease backfill. Implemented via `cli-opencode gpt-5.5-fast --variant xhigh`, integrated with 005, and deployed: the live `context-index.sqlite` was migrated (9692 rows, all defaulted to `complete`, no re-enrich storm).

### Added

- `mcp_server/handlers/save/enrichment-state.ts` — marker helpers: `markEnrichmentPending`, `recordEnrichmentResult`, `needsEnrichmentRepair`, `repairEnrichmentOnReplay`, `repairIncompleteMarkers` (repair reuses the existing `runPostInsertEnrichmentIfEnabled()` machinery; non-repair helpers stay synchronous).
- Schema v30: 4 narrow defaulted marker columns on `memory_index` — `post_insert_enrichment_status` (default `complete`), `_state` (JSON of completed steps), `_completed_at` (ISO), `_version` (enrichment-logic version) — plus an idempotent v30 migration and a partial index on `status != 'complete'`.
- Bounded scan-lease backfill of incomplete markers in `handlers/memory-index.ts`, with the repair count surfaced in the scan response.
- vitest: schema v30 (fresh + v29→v30 upgrade idempotent), marker lifecycle (pending in-txn → complete), replay repair (`unchanged` + `duplicate`), no-op replay of `complete`, `deferred` semantics, scan backfill, repeated-repair idempotency.

### Changed

- `SCHEMA_VERSION` 29 → 30 in `lib/search/vector-index-schema.ts` (fresh-schema and migration paths declare the same columns).
- `handlers/memory-save.ts`: mark `pending` inside the primary write transaction (atomic with the row); record the outcome after `runPostInsertEnrichmentIfEnabled()`; run replay repair on the `duplicatePrecheck` and `dupResult` returns when `needsEnrichmentRepair`. `dedup.ts` stays synchronous (repair runs in the async caller after the verdict).

### Fixed

- The commit-before-enrichment replay hole: a row killed mid-enrichment becomes searchable again on the next replay (or scan backfill) instead of staying invisible until an unrelated full scan. The default-`complete` column choice keeps the existing corpus from being treated as a repair backlog (no mass re-enrichment storm on upgrade).

### Verification

- 22 focused vitest pass in isolation; 45/45 in the integrated branch with 005.
- `validate.sh --strict`: 0 errors.
- **Deployed**: dist rebuilt (`tsc --build`), daemon restarted; the lazy v30 migration applied to the live `context-index.sqlite` on first memory op — 9692 rows preserved, `PRAGMA quick_check` ok, all rows `post_insert_enrichment_status = complete`, partial index present, `schema_version = 30`, durable across daemon recycles. A pre-migration online backup was taken (`backups/context-index-PRE-V30-*`).

### Files Changed

| File | Change |
|------|--------|
| `mcp_server/lib/search/vector-index-schema.ts` | Modify — SCHEMA_VERSION 30 + 4 marker columns + v30 migration + partial index |
| `mcp_server/handlers/save/enrichment-state.ts` | Create — marker helpers + idempotent repair entrypoints |
| `mcp_server/handlers/memory-save.ts` | Modify — mark pending in txn, record after enrichment, repair on dedup replay returns |
| `mcp_server/handlers/memory-index.ts` | Modify — bounded scan-lease backfill + reported repair count |
| `mcp_server/tests/enrichment-state.vitest.ts` (+ vector-index-schema-enrichment-v30, schema-compatibility, memory-save-dedup-order, handler-memory-index-cooldown) | Create/extend — coverage for every path |

### Follow-Ups

- None required. Monitor `post_insert_enrichment_status` distribution on live `memory_save` to confirm markers flip to `complete` and that no `pending`/`failed` rows accumulate.
