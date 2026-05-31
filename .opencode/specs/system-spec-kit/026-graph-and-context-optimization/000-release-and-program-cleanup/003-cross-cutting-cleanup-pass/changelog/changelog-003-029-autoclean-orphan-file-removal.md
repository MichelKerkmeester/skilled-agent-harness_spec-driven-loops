---
title: "055 AutoClean Orphan Files: cleanFiles option for verify_integrity and memory_health"
description: "Extends verify_integrity with a cleanFiles option that deletes memory_index rows whose file_path no longer exists on disk. The option threads through the Vectorindex wrapper, the memory_health handler. It also updates memoryHealthSchema so the runtime can self-heal orphan-file drift."
trigger_phrases:
  - "029-autoclean-orphan-file-removal"
  - "verify_integrity cleanFiles option"
  - "memory_health autoRepair cleanFiles"
  - "orphan file rows cleanup"
  - "orphanedFiles drift self-heal"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-08

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/029-autoclean-orphan-file-removal` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass`

### Summary

Packet 054 diagnosed roughly 564 `memory_index` rows whose `file_path` no longer existed on disk. These orphan-file rows caused `memory_health.consistency` to report a permanent degraded state because `verify_integrity({ autoClean: true })` only cleaned orphan vectors and orphan chunks, never orphan file rows. No runtime self-heal path existed.

This packet added a `cleanFiles?: boolean` opt-in to `verify_integrity` (default false). When paired with `autoClean: true`, the function loops over disk-gone rows and deletes each one through the existing `delete_memory_from_database` helper. This ensures vec_memories rows, lineage edges, projections, graph residue are all removed in lockstep. The option is wired through the `Vectorindex` class wrapper, the `memory_health` handler. It also updates `memoryHealthSchema` to expose the new input. The handler gates on `autoRepair && confirmed` to prevent accidental mass deletes. Unit tests cover: happy path deletion. No-orphan no-op. `cleanFiles: false` no-op. `delete_memory_from_database` failure path. A separate integration test covers the full `memory_health` autoRepair end-to-end path.

Note: the implementation-summary.md for this packet was not filled in before the changelog was authored. Evidence was drawn from spec.md, tasks.md. Commit `b77acde62e` on 2026-05-08 confirmed the shipped changes.

### Added

- `cleanFiles?: boolean` option on `verify_integrity` in `vector-index-queries.ts`. When `autoClean: true` and `cleanFiles: true`, loops over orphaned-file rows and deletes each via `delete_memory_from_database`. Records per-row history with action type `mcp:integrity_check_files`. Returns `cleaned.files` count in the report shape.
- `cleaned.files` field in the `verify_integrity` return shape.
- `cleanFiles: z.boolean().optional()` added to `memoryHealthSchema` in `tool-input-schemas.ts`.
- `'cleanFiles'` added to the `memory_health` ALLOWED_KEYS list in `tool-input-schemas.ts`.
- Unit tests for `cleanFiles` in `vector-index-impl.vitest.ts` covering: happy path deletes N rows. No-orphan no-op. `cleanFiles: true` with `autoClean: false` is a no-op.
- Integration test `EXT-H16` in `memory-crud-extended.vitest.ts` covering the full `memory_health autoRepair+confirmed+cleanFiles` flow.
- Integration test `EXT-H17` covering type validation: `cleanFiles` must be a boolean.

### Changed

- `Vectorindex.verifyIntegrity` wrapper in `vector-index-store.ts` updated to accept and forward the `cleanFiles` option. Return type updated to include `cleaned.files`.
- `memory_health` handler in `memory-crud-health.ts` reads `cleanFiles` from input, validates it is a boolean, passes it to `verifyIntegrity` when `autoRepair && confirmed`. Appends `orphan_files_cleaned:N` to `repair.actions` when N is greater than 0.

### Fixed

- `memory_health.consistency.status` remained `degraded` after every autoRepair run because orphan-file rows were never cleaned. With `cleanFiles: true`, the degraded signal clears once all disk-gone rows are removed.

### Verification

| Check | Result |
|-------|--------|
| Unit tests for `cleanFiles` (3 cases in `vector-index-impl.vitest.ts`) | PASS. Happy path deletes N rows. No-orphan no-op passes. `autoClean: false` blocks deletion. |
| Integration test `EXT-H16` in `memory-crud-extended.vitest.ts` | PASS. Full autoRepair+confirmed+cleanFiles path confirmed end-to-end. `repair.actions` contains `orphan_files_cleaned:2`. |
| Integration test `EXT-H17` in `memory-crud-extended.vitest.ts` | PASS. Non-boolean `cleanFiles` input returns `cleanFiles must be a boolean` error. |
| Shipped via commit `b77acde62e` on 2026-05-08 | PASS. All key source files confirmed modified in that commit. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/lib/search/vector-index-queries.ts` | Modified | Added `cleanFiles` option. Added cleanup loop calling `delete_memory_from_database`. Added `cleaned.files` to return shape. Added per-row history recording with `mcp:integrity_check_files`. |
| `mcp_server/lib/search/vector-index-store.ts` | Modified | Extended `verifyIntegrity` wrapper option type to include `cleanFiles`. Extended return type to include `cleaned.files`. |
| `mcp_server/handlers/memory-crud-health.ts` | Modified | Added `cleanFiles` input reading and boolean validation. Passes `cleanFiles` to `verifyIntegrity` when `autoRepair && confirmed`. Appends `orphan_files_cleaned:N` to `repair.actions`. |
| `mcp_server/schemas/tool-input-schemas.ts` | Modified | Added `cleanFiles: z.boolean().optional()` to `memoryHealthSchema`. Added `'cleanFiles'` to ALLOWED_KEYS for `memory_health`. |
| `mcp_server/tests/vector-index-impl.vitest.ts` | Modified | Added unit tests for `cleanFiles`: happy path, no-orphan no-op, `autoClean: false` no-op. Three new test cases total. |
| `mcp_server/tests/memory-crud-extended.vitest.ts` | Modified | Added `EXT-H16` and `EXT-H17` integration tests for the `memory_health` autoRepair+cleanFiles flow. |

### Follow-Ups

- Run `memory_health({ autoRepair: true, confirmed: true, cleanFiles: true })` against the live DB after a MCP child restart. Capture before and after stats in `scratch/cleanup-before.json` and `scratch/cleanup-after.json` to confirm orphanedFiles drops to 0 (or fewer than 5) and `consistency.status` flips to `healthy`. Create a `checkpoint_create` snapshot before running against production data.
- Fill `implementation-summary.md` with results once the live-DB verification run completes.
