---
title: "Feature Specification: Checkpoint v2 File-Based Full-DB Snapshots"
description: "checkpoint_create serializes the whole DB into one JSON.stringify, which throws Invalid string length once the main DB grows past V8's ~512 MB single-string ceiling. The one database large enough to need a rollback net cannot get one."
trigger_phrases:
  - "checkpoint v2"
  - "checkpoint_create invalid string length"
  - "full db checkpoint file snapshot"
  - "vacuum into checkpoint restore"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/001-checkpoint-v2-file-snapshot"
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
# Feature Specification: Checkpoint v2 File-Based Full-DB Snapshots

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

The memory daemon's `checkpoint_create` safety feature is broken on the production database: it serializes the entire DB into a single `JSON.stringify(snapshot)` call, which on the ~300 MB+ main DB expands past V8's ~512 MB single-string ceiling and throws `Invalid string length`. This packet adds a v2 file-based path that snapshots the database with SQLite `VACUUM INTO`, so full-DB create and restore work on the ~1 GB database with no string-size limit, while the existing scoped-checkpoint path stays on v1 untouched.

**Key Decisions**: File-based `VACUUM INTO` snapshots over chunked NDJSON, restore by whole-file swap over row-copy, version marker via schema migration v29.

**Critical Dependencies**: SQLite `VACUUM INTO` semantics, the `active_vec` shard attach lifecycle in `vector-index-store.ts`, and the existing checkpoint primitives in `checkpoints.ts`.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-06-01 |
| **Branch** | `001-checkpoint-v2-file-snapshot` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`checkpoint_create` takes a full rollback snapshot before risky migrations by serializing the entire database with one `JSON.stringify(snapshot)` call (`lib/storage/checkpoints.ts:1604`). On the ~300 MB+ main DB that string expands past V8's ~512 MB single-string ceiling and throws `Invalid string length`; restore has the same flaw at `JSON.parse(decompressed.toString())` (~:1785). The one database large enough to actually need a rollback net is the one that cannot get a checkpoint, so a recent pre-migration checkpoint failed and the operator fell back to a manual `cp`.

### Purpose
Make `checkpoint_create` and `checkpoint_restore` work on the full ~1 GB database with no string-size limit, while leaving the existing small, working scoped-checkpoint path on v1 unchanged.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A v2 file-based path for full-DB checkpoints, selected when `specFolder == null` and no tenant/user/agent scope is set.
- `VACUUM INTO` snapshots of the main database plus, when `includeEmbeddings` is set, the attached `active_vec` vector shard.
- Restore by whole-file swap through a new `reopenActiveDatabase(targetPath, swapFn)` coordinator with `.bak` rollback and post-restore rebuilds.
- Schema migration v29 that adds `snapshot_format` and `snapshot_path` columns to `checkpoints` for format detection and dir-aware pruning.
- Exposing `includeEmbeddings` through `handlers/checkpoints.ts` and the `checkpoint_create` tool schema.
- A manifest (`manifest.json`) per snapshot recording format version, embedder slug, schema version, table split, counts, and byte sizes, with downgrade and embedder-slug guards on restore.

### Out of Scope
- Item E, the MCP front-proxy for checkpoints - separate follow-up, not required for the string-limit fix.
- Chunked-NDJSON serialization for scoped checkpoints - rejected as over-engineering; scoped checkpoints are small and already work.
- Rewriting the v1 scoped checkpoint create or restore path - it stays verbatim and keeps all legacy checkpoints working.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `lib/storage/checkpoints.ts` | Modify | Add `createCheckpointV2`, `restoreCheckpointV2`, selection branch, dir-aware prune/delete, `sanitizeCheckpointName`. |
| `lib/search/vector-index-store.ts` | Modify | Add `reopenActiveDatabase(targetPath, swapFn)` coordinator owning the checkpoint, detach, close, swap, and reopen sequence. |
| `lib/search/vector-index-schema.ts` | Modify | Bump `SCHEMA_VERSION` 28 to 29, add `migrations[29]`, extend the `checkpoints` DDL. |
| `handlers/checkpoints.ts` | Modify | Expose `includeEmbeddings` in `CheckpointCreateArgs` and pass it into `createCheckpoint`. |
| `tool-schemas.ts` | Modify | Add `includeEmbeddings` to the `checkpoint_create` schema. |
| `lib/search/db-shard-migration.ts` | Reference | VACUUM + ATTACH + vec0 reconstruction precedent; no change. |
| `checkpoints-v2-create.vitest.ts` | Create | v2 create coverage. |
| `checkpoints-v2-restore.vitest.ts` | Create | v2 restore round-trip and rollback coverage. |
| `checkpoints-schema-v29.vitest.ts` | Create | v29 migration coverage. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Full-DB `checkpoint_create` succeeds with no string-size limit. | Live `checkpoint_create` on the ~1 GB DB produces a v2 snapshot directory with no `Invalid string length` error. |
| REQ-002 | Full-DB `checkpoint_restore` round-trips main plus shard. | A v2 restore into a verified scratch copy restores main and the `active_vec` shard, and `memory_health` reports `rowsTotal == ftsRowsTotal == vecRowsTotal` with `mismatchedIds: []`. |
| REQ-003 | The v1 scoped checkpoint create and restore path is unchanged. | All existing checkpoint vitest files stay green; scoped checkpoints continue to write `snapshot_format='v1'` with the JSON BLOB. |
| REQ-004 | Restore never mutates the live DB through an open connection. | Restore routes through `reopenActiveDatabase`, which checkpoints, detaches, and closes before any file swap, then reopens via `initialize_db`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `includeEmbeddings` is exposed end to end. | The `checkpoint_create` tool schema and handler accept `includeEmbeddings`, and it gates the shard snapshot in `createCheckpointV2`. |
| REQ-006 | Schema migration v29 is idempotent and additive. | `migrations[29]` adds `snapshot_format TEXT DEFAULT 'v1'` and `snapshot_path TEXT` to `checkpoints`, fresh-DB DDL matches, and re-running the migration is a no-op. |
| REQ-007 | The manifest guards refuse unsafe restores. | Restore refuses when `manifest.schemaVersion` is greater than the running `SCHEMA_VERSION` (downgrade) or when `manifest.embedderSlug` differs from the live slug. |
| REQ-008 | Pruning and delete are dir-aware for v2. | Enforcing `MAX_CHECKPOINTS` and `deleteCheckpoint` remove the v2 snapshot directory after commit, leaving no orphan directories. |
| REQ-009 | User-supplied checkpoint names are path-safe. | `sanitizeCheckpointName` rejects `/`, `\`, `..`, and NUL and caps length before any filesystem path is built. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On the live ~1 GB DB, `checkpoint_create` (full-DB) succeeds with no `Invalid string length`, and `checkpoint_list` shows the v2 row.
- **SC-002**: A `checkpoint_restore` round-trip into a scratch or verified copy restores main and shard, and `memory_health` reports consistency (`rowsTotal == ftsRowsTotal == vecRowsTotal`, `mismatchedIds: []`).
- **SC-003**: `includeEmbeddings: false` create is markedly smaller (no shard file) and restore leaves live vectors intact.
- **SC-004**: All existing v1 checkpoint vitest files plus the new v2 tests are green, and `validate.sh --strict` on this packet passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | SQLite `VACUUM INTO` | Snapshot path depends on transactionally consistent file copy of a live WAL DB | Run outside any transaction inside the existing SQLITE_BUSY retry loop; precedent in `db-shard-migration.ts`. |
| Dependency | `active_vec` shard attach lifecycle | `vec_memories` and `vec_metadata` live only in the shard, not main | Snapshot the shard file when `includeEmbeddings`; manifest records the table split. |
| Risk | Overwriting live shard or main under an open WAL connection | High | Close via `reopenActiveDatabase` before swap; drop stale `-wal`/`-shm`; reopen via `initialize_db`. |
| Risk | VACUUM in a transaction throws, or target file already exists | Med | Run outside txn in retry loop; write to a tmp dir, pre-clean stale targets, atomic rename. |
| Risk | Prune or delete leaves orphan dirs; disk exhaustion at ~10x DB size | Med | `rmSync` directories after commit; free-space precheck; map `ENOSPC`/`SQLITE_FULL`. |
| Risk | Snapshot newer than running schema or different embedder slug | Med | Manifest `schemaVersion` and `embedderSlug` guards refuse unsafe restore. |
| Risk | Path traversal via user `name` | High | `sanitizeCheckpointName` rejects `/ \ .. NUL` and caps length. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A full-DB v2 create must complete inside the existing SQLITE_BUSY retry budget without blocking the daemon beyond the VACUUM window.

### Security
- **NFR-S01**: Checkpoint names that reach a filesystem path must be sanitized so no path-traversal or absolute-path target can be constructed.

### Reliability
- **NFR-R01**: A failed restore must roll back from the `.bak` copy, reopen the original database, and release the restore barrier, leaving the live DB intact.

---

## 8. EDGE CASES

### Data Boundaries
- Empty or scoped checkpoint request: selection routes to v1, never v2.
- Shard not attached at create time: skip the shard snapshot, record vecTables as empty in the manifest.

### Error Scenarios
- `VACUUM INTO` target already exists: pre-unlink stale targets and sweep stale `*.tmp-*` directories before vacuuming.
- Disk fills mid-snapshot: map `ENOSPC`/`SQLITE_FULL` to a clean failure and leave no partial `<name>/` directory.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: 5 changed + 3 test files, LOC: 500+, Systems: storage, vector store, schema |
| Risk | 22/25 | Auth: N, API: Y (tool schema), Breaking: N (v1 preserved), live-DB swap and corruption risk |
| Research | 12/20 | VACUUM INTO semantics and shard reopen stack already scouted via `db-shard-migration.ts` |
| Multi-Agent | 6/15 | Single executor (cli-opencode) per phase, orchestrator-verified gates |
| Coordination | 9/15 | Three gated phases with strict typecheck plus test gate between each |
| **Total** | **67/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Live DB corruption from swapping files under an open connection | H | M | Close and detach via `reopenActiveDatabase` before swap; reopen via `initialize_db`. |
| R-002 | Orphaned snapshot directories accumulate and exhaust disk | M | M | Dir-aware prune and delete after commit; free-space precheck. |
| R-003 | Restore of a snapshot from a newer schema or different embedder | H | L | Manifest `schemaVersion` and `embedderSlug` guards refuse the restore. |
| R-004 | Path traversal via a malicious checkpoint name | H | L | `sanitizeCheckpointName` rejects unsafe characters and caps length. |

---

## 11. USER STORIES

### US-001: Pre-migration full-DB checkpoint (Priority: P0)

**As an** operator about to run a risky migration on the ~1 GB database, **I want** `checkpoint_create` to take a full-DB snapshot without failing, **so that** I have a real rollback net instead of a manual `cp`.

**Acceptance Criteria**:
1. Given the live ~1 GB DB, When I call `checkpoint_create` with no scope, Then a v2 snapshot directory is written and no `Invalid string length` error is thrown.

### US-002: Verified restore round-trip (Priority: P1)

**As an** operator recovering from a bad migration, **I want** `checkpoint_restore` to restore main and the vector shard, **so that** memory search and graph traversal return to a consistent state.

**Acceptance Criteria**:
1. Given a v2 snapshot, When I restore into a verified scratch copy, Then `memory_health` reports `rowsTotal == ftsRowsTotal == vecRowsTotal` with `mismatchedIds: []`.

---

## 12. OPEN QUESTIONS

- Should v2 use a lower `MAX_CHECKPOINTS` than the v1 value of 10, given that each v2 snapshot is roughly the size of the database?
- Should the free-space precheck hard-fail or warn-and-continue when available space is below a configured multiple of the database size?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
