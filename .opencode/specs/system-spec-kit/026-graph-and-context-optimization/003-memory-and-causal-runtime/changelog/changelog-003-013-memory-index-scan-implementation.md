---
title: "Memory Index Scan Phase 013: Self-Maintaining Index Implementation"
description: "Three gated phases shipped on 2026-05-31 implementing the self-maintaining index design from the 012 research packet. Phase 1 replaced the raw E429 error with a coalescing success envelope. Phase 2 added async lexical-first execution to eliminate request-deadline timeouts on large trees. Phase 3 shipped single-writer concurrency with move reconciliation that self-heals renamed spec folders without re-embedding."
trigger_phrases:
  - "memory_index_scan self-maintaining index"
  - "memory index scan coalescing E429 fix"
  - "memory_health index freshness block"
  - "incremental index orphan sweep move reconciliation"
  - "013 memory index implementation changelog"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime`

### Summary

`memory_index_scan` surfaced a raw `E429` error to callers whenever a second scan arrived inside the 30-second lease window, even though the handler already distinguished `lease_active` from `cooldown` internally. A forced re-scan of a large document tree exceeded the MCP request deadline because synchronous embedding was run inside the handler. Renested spec folders left stale orphan rows because the sweep was gated to incremental, non-force, zero-failure scans and had no path-identity for moves.

Three gated phases were dispatched against a clean recovery baseline using cli-opencode with RM-8 safeguards (isolated worktree, banned ops, disjoint file scope, no agent git writes):

1. **Phase 1 (coalescing + health + orphan sweep).** The raw E429 return was replaced with a success envelope that joins the in-flight or recent job (`coalesced:true`). `memory_health` gained an `index` block with a summary enum and counts. `sweepOrphanIndexRows()` was added to `incremental-index.ts`, deleting up to 200 disk-gone rows per completed scan via the safe `deleteMemory()` path only.
2. **Phase 2 (async scan + drain circuit guard).** `indexSingleFile` gained an `asyncEmbedding` option threaded to `indexMemoryFile`. Scans now pass `asyncEmbedding:true`, committing rows as `pending` (BM25/FTS-searchable) without a provider call. `processRetryQueue` guards the `pending` to `retry` claim with `isProviderCircuitOpen()` so an embedder outage never burns clean pending rows into prunable retry rows. The response reports `complete_with_pending_vectors` with a `pendingVectors` count when deferred rows exist.
3. **Phase 3 (move reconciliation + scan heartbeat).** `reconcileMoves()` in `incremental-index.ts` matches renamed spec folders by `packet_id` plus grandparent-dir plus basename, updating `file_path` in place and preserving embeddings. A unique-match guard prevents false-positive merges for copied or template-identical files. `refreshScanLease()` added to `db-state.ts` keeps `scan_started_at` fresh during long batch runs.

All three phases landed on the same day with 14, 17 and 19 passing tests respectively. The daemon was rebuilt and restarted after Phase 3, confirming `index.orphanFiles` numeric, `sweepOrphanIndexRows` live and `scanKey` present.

### Added

- `sweepOrphanIndexRows()` in `incremental-index.ts`: bounded global orphan sweep (up to 200 rows per scan) deleting disk-gone index entries via `deleteMemory()` only
- `memory_health.index` block in `memory-crud-health.ts`: summary enum (`healthy_fresh` / `healthy_lagging_vectors` / `stale_needs_scan` / `degraded_needs_repair` / `unavailable`) plus indexed, pending and failed counts
- `asyncEmbedding` option on `indexSingleFile` threaded to `indexMemoryFile` for deferred vector drain
- `reconcileMoves()` in `incremental-index.ts`: move reconciliation keyed on `packet_id` plus grandparent-dir plus basename with unique-match guard
- `refreshScanLease()` in `db-state.ts`: heartbeat that refreshes `scan_started_at` during long batch scans
- Three new targeted test files: `handler-memory-index-async-scan.vitest.ts`, `incremental-index-move-reconcile.vitest.ts` and updated assertions in `handler-memory-index-cooldown.vitest.ts`

### Changed

- `memory_index_scan` handler (`memory-index.ts`): overlapping scan now returns a `{coalesced:true}` success envelope instead of a raw `E429`; scans pass `asyncEmbedding:true` so lexical rows commit first; `reconcileMoves()` and `refreshScanLease()` wired into the scan pipeline
- `processRetryQueue` in `retry-manager.ts`: `pending` to `retry` claim now guarded by `isProviderCircuitOpen()` check before the atomic update
- Cooldown test renamed and assertions updated to match the coalescing contract (`data.coalesced` and `data.status`)

### Fixed

- Raw `E429` surfaced to callers on any scan inside the 30-second lease window. Replaced with a coalescing success envelope that joins the in-flight or recent job.
- `force` re-scan on a large tree exceeded the MCP request deadline because embedding was synchronous. Async-mode indexing decouples lexical commit from vector drain.
- Renested spec folders left `File not found` orphan rows because the sweep was scope-gated. The global orphan sweep now runs on every completed scan regardless of scope.
- An embedder outage converted clean `pending` rows to prunable `retry` rows. The circuit-open guard now skips the claim during an outage, keeping rows `pending`.

### Verification

| Check | Result |
|-------|--------|
| `validate.sh <folder> --strict` | PASSED. Errors 0, Warnings 0 |
| Phase 1 `tsc` + tests | PASSED. tsc 0 errors. 14/14 on 2026-05-31 |
| Phase 2 `tsc` + tests | PASSED. tsc 0 errors. 17/17 on 2026-05-31 |
| Phase 3 `tsc` + tests | PASSED. tsc 0 errors. 19/19 on 2026-05-31 |
| SC1-SC5 (spec.md §5) | PASSED. All 3 phases shipped |
| Daemon rebuild + restart | DONE. pid 23371. `index.orphanFiles` numeric, `sweepOrphanIndexRows` live, `scanKey` present |
| Embedder after restart | ollama `nomic-embed-text-v1.5`, healthy. Auto-cascade re-selected on restart |
| 012/013 reindex + dup repair | DONE. 012 fresh. 013 = 6 clean success rows. `failedVectors` 36 to 6 |

### Files Changed

| File | What changed |
|------|--------------|
| `mcp_server/handlers/memory-index.ts` | Coalescing success envelope replaces raw E429. Async-mode scan threading. `reconcileMoves()` and `refreshScanLease()` wired into scan pipeline. |
| `mcp_server/handlers/memory-crud-health.ts` | New `index` block: summary enum plus indexed, pending and failed counts derived from existing telemetry. |
| `mcp_server/lib/storage/incremental-index.ts` | `sweepOrphanIndexRows()` (Phase 1) and `reconcileMoves()` (Phase 3) added. |
| `mcp_server/core/db-state.ts` | `refreshScanLease()` heartbeat added for long batch scans. |
| `mcp_server/lib/providers/retry-manager.ts` | `processRetryQueue` now guards `pending` to `retry` claim with `isProviderCircuitOpen()`. |
| `mcp_server/tests/handler-memory-index-async-scan.vitest.ts` (NEW) | 3 tests: async mode, deferred response status, circuit-guard skip. |
| `mcp_server/tests/incremental-index-move-reconcile.vitest.ts` (NEW) | 2 tests for move reconciliation and unique-match guard. |
| `mcp_server/tests/handler-memory-index-cooldown.vitest.ts` | Cooldown test renamed and assertions updated for coalescing contract. |

### Follow-Ups

- Document `memory_health.index` field semantics in the handler reference once the follow-on packet for field naming is settled.
- Investigate the force/incremental path not refreshing existing spec-doc rows that carry NULL `file_mtime_ms`: after the ollama re-index, docs already indexed as `alreadyIndexed` were not re-processed, leaving `handover.md` unindexed.
- Re-embed 6 residual pre-existing failed index rows via `memory_embedding_reconcile` or a forced re-index (4 in `008-playbook-manual-test-run`, 2 in `026 resource-map.md`).
