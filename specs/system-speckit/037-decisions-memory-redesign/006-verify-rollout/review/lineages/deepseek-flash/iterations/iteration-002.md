---
title: "Iteration 2: D1 Correctness (deepen) — Handlers, hooks, index scope"
trigger_phrases: []
---
# Iteration 2: D1 Correctness (deepen) — Handlers, hooks, index scope

## Focus
Verify fetch/cache/injection removal and index-scope discipline in the handler/hook layer: `handlers/memory-index.ts`, `handlers/memory-save.ts`, `handlers/memory-crud-update.ts`, `handlers/memory-index-discovery.ts`, `handlers/memory-bulk-delete.ts`, `handlers/memory-crud.ts`, `handlers/memory-ingest.ts`, `lib/storage/post-insert-metadata.ts`, `hooks/memory-surface.ts`, `hooks/claude/compact-inject.ts`, `api/indexing.ts`, `lib/search/vector-index-queries.ts`, `lib/search/vector-index-mutations.ts`, `lib/search/graph-search-fn.ts`, `lib/search/vector-index-store.ts`.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 15
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.0

## Findings
None new. F001-F003 carried forward (unchanged).

## Confirmed-Good Checks (negative evidence)
- Zero `constitutional` references across `memory-save.ts`, `memory-crud-update.ts`, `memory-index-discovery.ts`, `memory-bulk-delete.ts`, `memory-crud.ts`, `memory-ingest.ts`, `lib/storage/post-insert-metadata.ts`, `hooks/claude/compact-inject.ts`, `api/indexing.ts`.
- Zero `learned`/`recordSelection` references in `memory-save.ts` and `memory-crud-update.ts` — save/update paths do not touch the learned-trigger path (F001 confined to search-side stage2-fusion + maintenance tools).
- `memory-index.ts` scan is spec-doc scanning (`includeSpecDocs` gate at handlers/memory-index.ts:488,577); no constitutional scan surface.
- `memory-surface.ts` prime query joins working-memory rows only (`hooks/memory-surface.ts:198`); `primeSessionIfNeeded` (line 328) has no constitutional path.
- `compact-inject.ts` surfaces via `autoSurfaceAtCompaction` (`hooks/claude/compact-inject.ts:22,391-399`) — no constitutional injection.
- `vector-index-queries.ts`, `vector-index-mutations.ts`, `graph-search-fn.ts`: zero constitutional references.
- `vector-index-store.ts:1825` comment confirms store domain is non-constitutional/deprecated — active-row discipline in the store layer.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | 003 REQ-002 (indexer scan stop) fully confirmed at handler level | F001 still open |

## Assessment
- New findings ratio: 0.0
- Dimensions addressed: correctness (handler layer complete)
- Novelty justification: n/a — clean pass over the handler/hook surface.

## Ruled Out
- Save/update paths seeding learned-trigger rows: ruled out — no learned references in save/update handlers (F001 impact confined to search-side application + explicit maintenance tools).

## Dead Ends
- Constitutional scan surface in api/indexing.ts: none exists.

## Recommended Next Focus
Iteration 3 — D1 Correctness (server/CLI/API layer): cli.ts, context-server.ts, api/index.ts, tool-schemas.ts (strict-schema behavior), schemas/tool-input-schemas.ts, tools/types.ts — verify startup/prime wiring and schema surfaces.

Review verdict: PASS
