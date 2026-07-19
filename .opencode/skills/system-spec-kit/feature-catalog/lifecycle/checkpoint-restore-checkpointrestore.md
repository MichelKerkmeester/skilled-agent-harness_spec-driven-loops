---
title: "Checkpoint restore (checkpoint_restore)"
description: "Covers the checkpoint restore tool that decompresses v1 gzip snapshots (merge or atomic clear-existing) and restores v2 file-based snapshots by whole-file swap through a reopen coordinator with a two-phase crash-safe restore journal."
trigger_phrases:
  - "checkpoint restore"
  - "checkpoint_restore"
  - "restore memory from snapshot"
  - "atomic checkpoint rollback"
  - "partial restore merge semantics"
  - "checkpoint v2 restore file swap journal"
  - "reopenActiveDatabase swap-pending swap-done"
version: 3.6.0.23
---

# Checkpoint restore (checkpoint_restore)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Covers the checkpoint restore tool that decompresses snapshots and either replaces memory state atomically with `clearExisting=true` or merges with best-effort partial restore semantics by default.

This brings your knowledge base back to a previous snapshot, like using the undo button on a massive scale. If a replace-style restore fails partway through, nothing changes and your current data stays safe. In merge mode, successful rows can still commit while failures are reported as warnings. Restored memories are immediately searchable without any extra steps. The restore path now also enters a maintenance barrier that blocks mutation traffic until the restore lifecycle and post-restore rebuilds finish.

---

## 2. HOW IT WORKS

### Core Behavior

Restoring from a named checkpoint decompresses the gzip snapshot, validates every row against the database schema (a T107 fix that catches corrupted snapshots before they damage the database) and either merges with existing data or clears existing data first.

The `clearExisting` mode deserves explanation. When true, the entire restore runs inside a database transaction. If the restore encounters an error halfway through, the transaction rolls back and existing data is untouched. This atomicity guarantee (a T101 fix) is critical because clearing existing data and then failing to restore would leave you with an empty database and no way back.

When merging (the default), the system checks for duplicates using a logical key of `spec_folder + file_path + anchor_id`. Existing spec-doc records that match the logical key are skipped rather than duplicated, but row-level/table-level errors are accumulated and the successful subset can still commit. In other words, merge mode is intentionally best-effort and may return a partial-restore warning instead of full rollback semantics.

### Post-Action Behavior

After restore, vectors are restored from the checkpoint snapshot when vector payloads are present. The restore handler then clears in-memory search/constitutional caches, rebuilds BM25 from live DB content when BM25 is enabled and refreshes the trigger cache. This keeps restored memories immediately discoverable without forcing a full re-embedding pass.

### Async & Safety

Checkpoint restore now acquires a module-level maintenance barrier before restore mutations begin and keeps it active through the post-restore rebuild sequence. While that barrier is active, concurrent `checkpoint_restore` calls and mutation traffic from `memory_save`, `memory_index_scan` and `memory_bulk_delete` fail fast with `E_RESTORE_IN_PROGRESS` instead of racing the restore lifecycle.

Barrier release is guaranteed in the restore `finally` path, so the maintenance window clears after both successful restores and failed restores.

### v2 File-Based Restore (whole-file swap)

When a checkpoint row carries `snapshot_format='v2'` and a `snapshot_path`, restore routes to `restoreCheckpointV2` instead of the v1 gzip-parse path. A v2 snapshot is a complete database file, so the snapshot is made the live database by a whole-file swap rather than a row-copy. Row-copy was rejected because it re-fires the schema's `ON DELETE CASCADE`/`SET NULL` relationships and the append-only `mutation_ledger` ABORT triggers, and cannot reproduce the `vec_memories` vec0 virtual table.

The swap runs through a `reopenActiveDatabase(targetPath, swapFn)` coordinator in `vector-index-store.ts`. The coordinator runs `wal_checkpoint(TRUNCATE)` on both schemas, detaches the `active_vec` shard, and closes the live connection before any file is touched, so no file is overwritten under an open WAL connection. It then runs the swap body (rename the live files to `.bak`, move the snapshot files into place, drop stale `-wal`/`-shm`) and reopens via `initialize_db`, which reattaches the shard, reloads sqlite-vec, and runs `ensure_schema_version`. On success the `.bak` copies are deleted; on failure the restore rolls back from `.bak`, reopens, and releases the barrier in the `finally` path.

Crash-safety is provided by a two-phase restore journal (`.restore-journal.json`). The journal is written `phase: 'swap-pending'` before the file swap and advanced to `phase: 'swap-done'` once the snapshot files are in place. Boot crash-recovery rolls back from `.bak` ONLY while the journal is `swap-pending`; once the journal reaches `swap-done` it keeps the restored snapshot as committed. An in-process revert deliberately demotes the journal from `swap-done` back to `swap-pending` before reverting so both the boot path and the in-process path roll back from `.bak` deterministically.

Before the swap, manifest guards refuse unsafe restores: a downgrade guard rejects a snapshot whose `schemaVersion` is newer than the running `SCHEMA_VERSION`, and an embedder-slug guard rejects a snapshot taken under a different embedder. After a successful swap, `runPostRestoreRebuilds` regenerates the derived tables, and a `.needs-rebuild` sentinel (`NEEDS_REBUILD_SENTINEL_NAME`) under the `checkpoints/` directory marks post-`swap-done` derived staleness so the rebuilds are not silently skipped. The v1 merge and `clearExisting` paths above are unchanged.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `mcp-server/handlers/checkpoints.ts` | Checkpoint handler: create, list, restore, delete orchestration plus concurrent-restore barrier rejection |
| `mcp-server/lib/storage/checkpoints.ts` | Checkpoint storage: v1 gzip decompression, schema validation, merge/clear-existing logic, transaction wrapping, restore maintenance barrier state, plus `restoreCheckpointV2` whole-file swap, two-phase `.restore-journal.json` (`swap-pending`/`swap-done`), `.bak` rollback, manifest downgrade/embedder guards, and the `.needs-rebuild` sentinel |
| `mcp-server/lib/search/vector-index-store.ts` | `reopenActiveDatabase(targetPath, swapFn)` coordinator: wal_checkpoint, detach `active_vec`, close, swap, reopen via `initialize_db` |
| `mcp-server/handlers/memory-save.ts` | Mutation handler: fail-fast barrier check blocks `memory_save` during active checkpoint restore maintenance |
| `mcp-server/handlers/memory-index.ts` | Mutation handler: fail-fast barrier check blocks `memory_index_scan` during active checkpoint restore maintenance |
| `mcp-server/handlers/memory-bulk-delete.ts` | Mutation handler: fail-fast barrier check blocks `memory_bulk_delete` during active checkpoint restore maintenance |
| `mcp-server/core/db-state.ts` | Database state management and connection access |
| `mcp-server/lib/search/bm25-index.ts` | BM25 index rebuilt post-restore |
| `mcp-server/lib/search/vector-index.ts` | Vector index facade for post-restore cache refresh |
| `mcp-server/lib/response/envelope.ts` | MCP success/error envelope helpers |
| `mcp-server/schemas/tool-input-schemas.ts` | Zod input schemas for checkpoint arguments |
| `mcp-server/tool-schemas.ts` | MCP-visible JSON schema for `checkpoint_restore` |
| `mcp-server/tools/lifecycle-tools.ts` | Lifecycle tool dispatcher for checkpoint tools |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp-server/tests/handler-checkpoints.vitest.ts` | Automated test | Checkpoint handler validation |
| `mcp-server/tests/handler-checkpoints-edge.vitest.ts` | Automated test | Checkpoint lifecycle edge coverage (create/list/restore/delete) |
| `mcp-server/tests/checkpoints-extended.vitest.ts` | Automated test | Checkpoint extended tests |
| `mcp-server/tests/checkpoints-storage.vitest.ts` | Automated test | Checkpoint storage tests |
| `mcp-server/tests/integration-checkpoint-lifecycle.vitest.ts` | Automated test | Checkpoint lifecycle integration |

---

## 4. SOURCE METADATA
- Group: Lifecycle
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `lifecycle/checkpoint-restore-checkpointrestore.md`
Related references:
- [checkpoint-listing-checkpointlist.md](../../feature-catalog/lifecycle/checkpoint-listing-checkpointlist.md) — Checkpoint listing (checkpoint_list)
- [checkpoint-deletion-checkpointdelete.md](../../feature-catalog/lifecycle/checkpoint-deletion-checkpointdelete.md) — Checkpoint deletion (checkpoint_delete)
