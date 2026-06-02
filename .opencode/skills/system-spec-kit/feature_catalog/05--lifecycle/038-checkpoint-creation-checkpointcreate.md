---
title: "Checkpoint creation (checkpoint_create)"
description: "Covers the checkpoint creation tool that captures gzip-compressed memory state snapshots (v1) for scoped rollback safety, plus the v2 file-based VACUUM-INTO path for full-DB snapshots with no string-size limit."
trigger_phrases:
  - "checkpoint creation"
  - "checkpoint_create"
  - "create a memory snapshot"
  - "gzip-compressed memory checkpoint"
  - "rollback safety snapshot"
  - "checkpoint v2 vacuum into snapshot"
  - "full db checkpoint snapshot_format snapshot_path"
---

# Checkpoint creation (checkpoint_create)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Covers the checkpoint creation tool that captures gzip-compressed memory state snapshots for rollback safety.

This takes a snapshot of your entire knowledge base at a point in time, like a save point in a video game. If something goes wrong later (an accidental deletion or a bad import), you can restore back to this snapshot. The system keeps up to 10 snapshots and automatically removes the oldest one when you create a new one.

---

## 2. HOW IT WORKS

Named snapshots capture the current memory state by serializing all 18 tables listed in `CHECKPOINT_MANIFEST.snapshot` (`memory_index`, `vec_memories`, `vec_metadata`, `working_memory`, `causal_edges`, `weight_history`, `memory_history`, `mutation_ledger`, `memory_conflicts`, `memory_corrections`, `adaptive_signal_events`, `negative_feedback_events`, `learned_feedback_audit`, `session_learning`, `governance_audit`, `session_state`, `session_sent_memories`, `memory_summaries`) into a gzip-compressed JSON blob stored in the `checkpoints` table, not just a small core subset. The checkpoint metadata also records the 9 derived tables in `CHECKPOINT_MANIFEST.rebuild` (`memory_lineage`, `active_memory_projection`, `memory_entities`, `entity_catalog`, `degree_snapshots`, `community_assignments`, `graph_communities`, `community_summaries`, `memory_fts`), so restore knows which tables must be regenerated rather than restored verbatim. You can scope a snapshot to a specific spec folder if you only care about preserving one area of the system.

A maximum of 10 checkpoints are retained. When you create the 11th, the oldest is automatically purged. Each checkpoint records arbitrary metadata you provide, plus the current git branch from environment variables. The gzip compression keeps storage manageable even with large memory databases.

Checkpoints are the safety net for destructive operations. `memory_bulk_delete` creates one by default before bulk deletion, unless explicitly skipped for lower-risk tiers. `checkpoint_restore` brings it all back. The cycle works because checkpoints include vector embeddings alongside metadata, so restored memories are immediately searchable without re-running embedding generation.

### v2 File-Based Full-DB Snapshots (VACUUM INTO)

The v1 gzip-JSON path above serializes the whole database into a single `JSON.stringify` blob. On a large main database (~300 MB and up) that single string expands past V8's ~512 MB single-string ceiling and throws `Invalid string length`, so the one database large enough to need a rollback net could not get one. The v2 path fixes this for full-DB checkpoints without touching the small, working v1 scoped path.

A scope-based selection branch in `createCheckpoint` decides the format. An unscoped full-DB request (`specFolder == null` and no tenant/user/agent scope) routes to `createCheckpointV2`; every scoped request stays on the v1 JSON path verbatim. The v2 selection gate checks for `vec_memories` in main only — the payload table the shard-attach slimming actually drops — because the slimming intentionally retains the small `vec_metadata` config table in main as a dimension fallback, so gating on `vec_metadata` would leave v2 inert on every sharded daemon.

`createCheckpointV2` snapshots the database with SQLite `VACUUM main INTO '<tmp>/snapshot-main.sqlite'`, run outside any transaction inside the existing SQLITE_BUSY retry loop, with zero JS-string materialization. When `includeEmbeddings` is set and the `active_vec` vector shard is attached, it also runs `VACUUM active_vec INTO '<tmp>/snapshot-vec.sqlite'` so the vector payload (`vec_memories`, `vec_metadata`) that lives only in the shard is captured too. The snapshot is written into a `<name>.tmp-<pid>/` directory, accompanied by a `manifest.json` recording the format version, embedder slug, schema version, table split, counts, and byte sizes, then atomically renamed to `<name>/` only on success.

The `checkpoints` row records `snapshot_format='v2'` and `snapshot_path` (the schema v29 columns) and leaves `memory_snapshot` NULL, where the v1 path stores the gzip BLOB in `memory_snapshot` and leaves `snapshot_format='v1'`. `MAX_CHECKPOINTS` enforcement is dir-aware for v2: pruned and deleted v2 rows have their snapshot directory `rmSync`-ed after commit so no orphan directories accumulate. Because each v2 snapshot is roughly database-sized on disk, the path also pre-cleans stale `*.tmp-*` directories and pre-unlinks stale targets before vacuuming, and `sanitizeCheckpointName` rejects `/`, `\`, `..`, and NUL and caps length before any filesystem path is built.

A `.needs-rebuild` sentinel (`NEEDS_REBUILD_SENTINEL_NAME`) under the `checkpoints/` directory marks the derived-table state as stale; `repairNeedsRebuildSentinel` reconciles it so post-restore rebuilds are not skipped after a swap. The v2 format is versioned by schema migration v29, which adds the `snapshot_format` and `snapshot_path` columns to `checkpoints`.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `mcp_server/handlers/checkpoints.ts` | Checkpoint handler: create, list, restore, delete orchestration |
| `mcp_server/lib/storage/checkpoints.ts` | Checkpoint storage: `CHECKPOINT_MANIFEST`, gzip serialization (v1), `createCheckpointV2` + `VACUUM main/active_vec INTO` (v2), scope-based selection branch, manifest, dir-aware MAX_CHECKPOINTS purge, `sanitizeCheckpointName`, `NEEDS_REBUILD_SENTINEL_NAME`/`repairNeedsRebuildSentinel` |
| `mcp_server/lib/search/vector-index-schema.ts` | `SCHEMA_VERSION` and migration v29 adding the `snapshot_format`/`snapshot_path` columns to `checkpoints` |
| `mcp_server/lib/search/vector-index-store.ts` | `active_vec` shard attach lifecycle the v2 path snapshots when `includeEmbeddings` is set |
| `mcp_server/core/db-state.ts` | Database state management and connection access |
| `mcp_server/lib/response/envelope.ts` | MCP success/error envelope helpers |
| `mcp_server/schemas/tool-input-schemas.ts` | Zod input schemas for checkpoint arguments |
| `mcp_server/tool-schemas.ts` | MCP-visible JSON schema for `checkpoint_create` |
| `mcp_server/tools/lifecycle-tools.ts` | Lifecycle tool dispatcher for checkpoint tools |
| `mcp_server/utils/json-helpers.ts` | JSON utility helpers for snapshot serialization |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/handler-checkpoints.vitest.ts` | Automated test | Checkpoint handler validation |
| `mcp_server/tests/handler-checkpoints-edge.vitest.ts` | Automated test | Checkpoint lifecycle edge coverage (create/list/restore/delete) |
| `mcp_server/tests/checkpoints-extended.vitest.ts` | Automated test | Checkpoint extended tests |
| `mcp_server/tests/checkpoints-storage.vitest.ts` | Automated test | Checkpoint storage tests |
| `mcp_server/tests/integration-checkpoint-lifecycle.vitest.ts` | Automated test | Checkpoint lifecycle integration |

---

## 4. SOURCE METADATA
- Group: Lifecycle
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `05--lifecycle/038-checkpoint-creation-checkpointcreate.md`
Related references:
- [039-checkpoint-listing-checkpointlist.md](039-checkpoint-listing-checkpointlist.md) — Checkpoint listing (checkpoint_list)
