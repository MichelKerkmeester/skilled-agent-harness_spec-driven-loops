---
title: "Tasks: Checkpoint v2 File-Based Full-DB Snapshots"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "checkpoint v2 tasks"
  - "vacuum into create restore tasks"
  - "schema v29 migration tasks"
  - "reopenActiveDatabase tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/002-checkpoint-v2-file-snapshot"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored checkpoint-v2 child packet docs"
    next_safe_action: "Dispatch Phase 1 schema v29 via cli-opencode"
    blockers: []
    key_files:
      - "lib/storage/checkpoints.ts"
      - "lib/search/vector-index-store.ts"
      - "lib/search/vector-index-schema.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "checkpoint-v2-packet-setup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Checkpoint v2 File-Based Full-DB Snapshots

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

**Phase 1 - Schema v29 + includeEmbeddings wiring** (no create or restore behavior change).

- [ ] T001 Bump `SCHEMA_VERSION` 28 to 29 (lib/search/vector-index-schema.ts)
- [ ] T002 Add idempotent `migrations[29]` adding `snapshot_format TEXT DEFAULT 'v1'` and `snapshot_path TEXT` to `checkpoints` (lib/search/vector-index-schema.ts)
- [ ] T003 Update the fresh-DB `CREATE TABLE checkpoints` DDL to include both columns (lib/search/vector-index-schema.ts)
- [ ] T004 Add `includeEmbeddings` to `CheckpointCreateArgs` and pass it into `createCheckpoint` (handlers/checkpoints.ts)
- [ ] T005 Add `includeEmbeddings` to the `checkpoint_create` tool schema (tool-schemas.ts)
- [ ] T006 Extend `CheckpointEntry` and `listCheckpoints` to read `snapshot_format` and `snapshot_path` (lib/storage/checkpoints.ts)
- [ ] T007 Add v29 migration test: columns exist, default is `'v1'`, re-run is a no-op (checkpoints-schema-v29.vitest.ts)
- [ ] T008 Add handler-flag test: `includeEmbeddings` reaches `createCheckpoint` (handler-checkpoints.vitest.ts)
- [ ] T009 Gate: `npm run typecheck` 0 new errors AND `npm run test:core` green before Phase 2
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Phase 2 - v2 CREATE** (VACUUM INTO main plus optional shard, tmp-dir then atomic rename, manifest, selection branch).

- [ ] T010 Add the selection branch: `specFolder == null && no tenant/user/agent scope` routes to v2, else v1 verbatim (lib/storage/checkpoints.ts)
- [ ] T011 Implement `sanitizeCheckpointName` rejecting `/ \ .. NUL` and capping length (lib/storage/checkpoints.ts)
- [ ] T012 Implement `createCheckpointV2`: write into `<name>.tmp-<pid>/`, sweep stale `*.tmp-*`, pre-unlink stale targets (lib/storage/checkpoints.ts)
- [ ] T013 Run `VACUUM main INTO '<tmp>/snapshot-main.sqlite'` outside any transaction, inside the SQLITE_BUSY retry loop (lib/storage/checkpoints.ts)
- [ ] T014 When `includeEmbeddings` and `active_vec` is attached (`PRAGMA database_list`), run `VACUUM active_vec INTO '<tmp>/snapshot-vec.sqlite'` (lib/storage/checkpoints.ts)
- [ ] T015 Write `manifest.json` (formatVersion, embedderSlug, schemaVersion, mainTables minus `vec_memories`/`vec_metadata`, vecTables, counts, byte sizes) (lib/storage/checkpoints.ts)
- [ ] T016 Atomic `renameSync` tmp dir to `<name>/` only after success (lib/storage/checkpoints.ts)
- [ ] T017 Insert the row (`snapshot_format='v2'`, `snapshot_path`, `memory_snapshot=NULL`) in the existing transaction (lib/storage/checkpoints.ts)
- [ ] T018 Make `MAX_CHECKPOINTS` enforcement dir-aware: `rmSync` pruned v2 dirs after commit (lib/storage/checkpoints.ts)
- [ ] T019 Make `deleteCheckpoint` dir-aware for v2 rows (lib/storage/checkpoints.ts)
- [ ] T020 Add free-space precheck and map `ENOSPC`/`SQLITE_FULL` to a clean failure (lib/storage/checkpoints.ts)
- [ ] T021 New create tests: v2 dir layout, manifest split, includeEmbeddings on/off, name sanitization, prune leaves no orphan dirs (checkpoints-v2-create.vitest.ts)
- [ ] T022 Extend `checkpoint-completeness.vitest.ts` with the v2 manifest branch
- [ ] T023 Gate: `npm run typecheck` 0 new errors AND `npm run test:core` green before Phase 3
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

**Phase 3 - v2 RESTORE** (reopenActiveDatabase coordinator plus restoreCheckpointV2 file swap, `.bak` rollback, post-restore rebuilds, format detection).

- [ ] T024 Implement `reopenActiveDatabase(targetPath, swapFn)` coordinator: `wal_checkpoint(TRUNCATE)` both schemas, `detachActiveVectorShard`, `close_db` (lib/search/vector-index-store.ts)
- [ ] T025 In the coordinator, run `swapFn()` then `initialize_db(targetPath)` to reattach shard, reload sqlite-vec, rebuild temp views, run `ensure_schema_version` (lib/search/vector-index-store.ts)
- [ ] T026 Implement `restoreCheckpointV2`: `acquireRestoreBarrier`, validate manifest, route the file swap through `reopenActiveDatabase` (lib/storage/checkpoints.ts)
- [ ] T027 Add the swap body: rename live to `.bak`, snapshot to live, delete stale `-wal`/`-shm` (lib/storage/checkpoints.ts)
- [ ] T028 Add downgrade guard (`manifest.schemaVersion <= SCHEMA_VERSION`) and embedder-slug guard (lib/storage/checkpoints.ts)
- [ ] T029 On success delete `.bak`; on failure roll back from `.bak`, reopen, release barrier in `finally`, return error (lib/storage/checkpoints.ts)
- [ ] T030 Call `runPostRestoreRebuilds` to regenerate the 9 rebuild-manifest tables (lib/storage/checkpoints.ts)
- [ ] T031 Add format detection on restore: `snapshot_format === 'v2' && snapshot_path` routes to v2, else v1 unchanged (lib/storage/checkpoints.ts)
- [ ] T032 Make `restoreCheckpointV2` accept an injectable reopen fn (default coordinator; test uses `new Database` plus module re-init) (lib/storage/checkpoints.ts)
- [ ] T033 New restore tests: round-trip, `.bak` rollback on failure, format detection, schema-shape, includeEmbeddings:false leaves vectors intact (checkpoints-v2-restore.vitest.ts)
- [ ] T034 Gate: `npm run typecheck` 0 new errors AND `npm run test:core` green; v1 restore tests unchanged
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Live full-DB `checkpoint_create` plus restore round-trip proven on the ~1 GB DB after deliberate daemon restart
- [ ] Mandatory deep-review surfaces no P0/P1
- [ ] `validate.sh --strict` on this packet passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
