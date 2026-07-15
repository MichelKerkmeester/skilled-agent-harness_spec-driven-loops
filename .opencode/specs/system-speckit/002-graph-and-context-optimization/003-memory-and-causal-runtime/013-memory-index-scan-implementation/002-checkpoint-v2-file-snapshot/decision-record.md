---
title: "Decision Record: Checkpoint v2 File-Based Full-DB Snapshots"
description: "Decision record for the four pressure-tested choices behind checkpoint v2: file-based VACUUM INTO, whole-file restore swap, schema v29 marker, and leaving scoped checkpoints on v1."
trigger_phrases:
  - "checkpoint v2 decisions"
  - "vacuum into vs chunked ndjson"
  - "file swap vs row copy restore"
  - "schema v29 vs metadata json marker"
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
# Decision Record: Checkpoint v2 File-Based Full-DB Snapshots

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: File-based VACUUM INTO over chunked NDJSON

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-01 |
| **Deciders** | Operator, orchestrator |

---

<!-- ANCHOR:adr-001-context -->
### Context

`checkpoint_create` serializes the whole database into one `JSON.stringify(snapshot)` call. On the ~300 MB+ main DB that single JS string expands past V8's ~512 MB ceiling and throws `Invalid string length`, so the database large enough to need a rollback net is exactly the one that cannot get a checkpoint. We needed a full-DB snapshot mechanism that does not materialize the database as a JS string.

### Constraints

- Vectors live in a separate `active_vec` shard file; `vec_memories` is a `vec0` virtual table. NOTE (corrected post-implementation, see ADR-005): the shard-attach slimming drops `vec_memories` from main but **retains** a small `vec_metadata` config table in main as a dimension fallback, so `vec_metadata` exists in BOTH main and the shard. That coupling drove the v2-selection gate bug.
- The snapshot must be transactionally consistent against a live WAL database.
- `db-shard-migration.ts` already establishes a working VACUUM + ATTACH + vec0 reconstruction precedent.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Snapshot full-DB checkpoints with SQLite `VACUUM INTO 'file'` for main and, when `includeEmbeddings` is set, for the `active_vec` shard.

**How it works**: `VACUUM INTO` writes a transactionally consistent, defragmented copy of the live WAL database to a target file with zero JS-string materialization. It runs outside any transaction inside the existing SQLITE_BUSY retry loop, into a tmp dir that is atomically renamed on success.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **VACUUM INTO file (chosen)** | No string ceiling; consistent; defragmented; precedent exists | Snapshot is roughly database-sized on disk | 9/10 |
| Chunked NDJSON | Reuses JSON mental model | Re-introduces serialization machinery for a problem the engine solves natively; still streams through JS | 4/10 |

**Why this one**: `VACUUM INTO` is the direct inverse of the failing `JSON.stringify` and removes the string ceiling entirely, while chunked NDJSON would rebuild serialization logic the database already provides.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Full-DB `checkpoint_create` works on the ~1 GB DB with no `Invalid string length`.
- Snapshots are defragmented and consistent without a daemon pause beyond the VACUUM window.

**What it costs**:
- Each snapshot consumes roughly database-sized disk. Mitigation: dir-aware pruning after commit plus a free-space precheck.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| VACUUM target already exists or runs inside a txn | M | Run outside txn in retry loop; tmp dir, pre-clean, atomic rename |
| Disk exhaustion at ~10x DB | M | Free-space precheck; map `ENOSPC`/`SQLITE_FULL`; consider lower MAX for v2 |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Production `checkpoint_create` is broken on the only DB that needs it. |
| 2 | **Beyond Local Maxima?** | PASS | Chunked NDJSON considered and rejected. |
| 3 | **Sufficient?** | PASS | `VACUUM INTO` removes the string ceiling with no extra serialization layer. |
| 4 | **Fits Goal?** | PASS | Directly delivers the full-DB no-limit checkpoint outcome. |
| 5 | **Open Horizons?** | PASS | File snapshots also enable the documented manual recovery fallback. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `lib/storage/checkpoints.ts`: `createCheckpointV2` runs `VACUUM main INTO` and optional `VACUUM active_vec INTO`, writes `manifest.json`, atomic-renames the tmp dir.
- The `checkpoints` row stores `snapshot_format='v2'` plus `snapshot_path`; `memory_snapshot` stays NULL.

**How to roll back**: Revert the `createCheckpointV2` branch; the scope selection falls back to the v1 JSON path, which is unchanged.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Restore by whole-file swap over row-copy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-01 |
| **Deciders** | Operator, orchestrator |

### Context

A v2 snapshot is a complete database file, so restore needs to make that file the live database. The obvious row-level alternative is `ATTACH` the snapshot, `DELETE` live rows, then `INSERT ... SELECT` to copy rows back.

### Constraints

- The schema has `ON DELETE CASCADE` and `SET NULL` relationships plus an append-only `mutation_ledger` with ABORT triggers that v1 painstakingly avoids firing.
- `vec_memories` is a `vec0` virtual table that cannot be copied by ordinary row-copy.

### Decision

**We chose**: Restore by closing the live connection and swapping the snapshot file in through a new `reopenActiveDatabase(targetPath, swapFn)` coordinator, with `.bak` rollback.

**How it works**: The coordinator runs `wal_checkpoint(TRUNCATE)` on both schemas, detaches the shard, closes the connection, runs `swapFn` (rename live to `.bak`, snapshot to live, drop stale `-wal`/`-shm`), then reopens via `initialize_db`, which reattaches the shard, reloads sqlite-vec, and runs `ensure_schema_version`.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Whole-file swap (chosen)** | Sidesteps cascades and ledger triggers; handles vec0 natively; restored file simply is the DB | Requires closing and reopening the shared connection | 9/10 |
| ATTACH + DELETE + INSERT...SELECT row-copy | No connection swap | Re-fires `ON DELETE CASCADE`/`SET NULL`; trips append-only `mutation_ledger` ABORT triggers; cannot copy a vec0 virtual table | 2/10 |

**Why this one**: Row-copy re-fires the exact triggers v1 avoids and cannot reproduce the vec0 virtual table, while the file swap makes the snapshot the database directly.

### Consequences

**What improves**:
- Restore is correct for cascades, the append-only ledger, and the vector virtual table.
- File-swap plus restart doubles as a documented manual catastrophic-recovery fallback.

**What it costs**:
- Closing the shared connection can orphan `db` references. Mitigation: centralize in the coordinator and re-init dependent modules after reopen.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Overwriting live files under an open WAL connection | H | Checkpoint, detach, and close before any swap; reopen via `initialize_db` |
| Closing the shared connection orphans `db` refs | H | Coordinator owns the lifecycle; dependent modules re-init; handler rebuilds indexes |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Row-copy cannot safely restore this schema or the vec0 table. |
| 2 | **Beyond Local Maxima?** | PASS | Row-copy fully evaluated and rejected with concrete trigger evidence. |
| 3 | **Sufficient?** | PASS | A file swap restores main and shard in one consistent step. |
| 4 | **Fits Goal?** | PASS | Delivers the verified restore round-trip in the success criteria. |
| 5 | **Open Horizons?** | PASS | Same mechanism serves manual recovery. |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- `lib/search/vector-index-store.ts`: new `reopenActiveDatabase(targetPath, swapFn)` coordinator.
- `lib/storage/checkpoints.ts`: `restoreCheckpointV2` validates the manifest, routes the swap through the coordinator, runs `runPostRestoreRebuilds`, and rolls back from `.bak` on failure.

**How to roll back**: Revert `restoreCheckpointV2` and `reopenActiveDatabase`; v1 restore (JSON parse path) is unchanged and remains available.

---

## ADR-003: Version marker via schema migration v29 over a metadata-JSON flag

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-01 |
| **Deciders** | Operator, orchestrator |

### Context

The restore path must tell a v2 snapshot from a v1 JSON checkpoint, and pruning must find v2 directories cheaply. We needed a durable, queryable marker on each `checkpoints` row.

### Constraints

- Legacy v1 checkpoints must keep working with no migration of their data.
- Selection and pruning run often, so the marker read should be cheap.

### Decision

**We chose**: Bump `SCHEMA_VERSION` 28 to 29 and add idempotent columns `snapshot_format TEXT DEFAULT 'v1'` and `snapshot_path TEXT` to `checkpoints`.

**How it works**: Detection is `row.snapshot_format === 'v2' && row.snapshot_path` routes to v2; otherwise the v1 path runs unchanged. The default `'v1'` means every legacy row is correctly classified with no backfill.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Schema v29 columns (chosen)** | Cheap column reads for selection and pruning; default classifies legacy rows; standard migration path | Requires a schema-version bump | 9/10 |
| Marker inside a metadata-JSON blob | No schema change | Selection and pruning must parse JSON per row; weaker as a queryable predicate | 4/10 |

**Why this one**: Columns make selection and pruning cheap reads and let the `DEFAULT 'v1'` classify every legacy checkpoint without touching its data.

### Consequences

**What improves**:
- Format detection and dir-aware pruning are simple, indexed-friendly column reads.
- Additive, defaulted columns keep all legacy checkpoints working.

**What it costs**:
- One schema-version bump and an idempotent migration to maintain. Mitigation: a dedicated v29 migration test asserting idempotency and fresh-DB DDL parity.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Migration not idempotent or DDL drift | M | v29 test asserts re-run is a no-op and fresh-DB DDL matches |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Restore and prune need a durable format marker. |
| 2 | **Beyond Local Maxima?** | PASS | Metadata-JSON marker considered and rejected. |
| 3 | **Sufficient?** | PASS | Two columns cover detection and dir-aware pruning. |
| 4 | **Fits Goal?** | PASS | Enables the v1/v2 split without breaking legacy. |
| 5 | **Open Horizons?** | PASS | Columns extend cleanly for future formats. |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- `lib/search/vector-index-schema.ts`: `SCHEMA_VERSION` 28 to 29, `migrations[29]`, and the fresh-DB `checkpoints` DDL.
- `lib/storage/checkpoints.ts`: `CheckpointEntry` and `listCheckpoints` read the new columns.

**How to roll back**: The columns are additive with `DEFAULT 'v1'` and ignored by v1; revert the v2 code and the columns may remain unused without breaking anything.

---

## ADR-004: Leave scoped checkpoints on v1

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-01 |
| **Deciders** | Operator, orchestrator |

### Context

Scoped checkpoints (tenant/user/agent or specFolder-bound) are small and already work through the v1 JSON path. The temptation is to unify everything onto the new mechanism.

### Constraints

- The string-limit bug only affects full-DB snapshots, not small scoped ones.
- Rewriting a working path adds risk with no user-facing benefit.

### Decision

**We chose**: Route only full-DB checkpoints (`specFolder == null && no tenant/user/agent scope`) to v2 and leave the scoped v1 path verbatim.

**How it works**: A single selection branch picks v2 for unscoped full-DB requests and v1 for everything else, so scoped checkpoints keep writing the JSON BLOB exactly as before.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Scoped stays v1 (chosen)** | No risk to a working path; smaller change; faster review | Two code paths to maintain | 9/10 |
| Migrate scoped checkpoints to v2 (chunked) | One unified path | Over-engineering; risk to working behavior; out of scope per spec | 2/10 |

**Why this one**: The bug is specific to full-DB serialization, so rewriting the small, working scoped path adds risk for no benefit.

### Consequences

**What improves**:
- The change stays surgical and the blast radius is limited to full-DB checkpoints.

**What it costs**:
- Two code paths coexist. Mitigation: the selection branch is a single, well-tested predicate.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Selection branch misroutes a scoped request to v2 | M | Explicit predicate plus tests asserting scoped requests stay on v1 |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Only full-DB serialization is broken. |
| 2 | **Beyond Local Maxima?** | PASS | Full migration considered and rejected as over-engineering. |
| 3 | **Sufficient?** | PASS | Fixing the full-DB path resolves the reported failure. |
| 4 | **Fits Goal?** | PASS | Keeps the change on the critical path only. |
| 5 | **Open Horizons?** | PASS | Scoped checkpoints can adopt v2 later if a real need appears. |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- `lib/storage/checkpoints.ts`: the selection branch; the v1 scoped create and restore code is untouched.

**How to roll back**: Remove the branch; all requests fall back to v1, the current behavior.

---

## ADR-005: Gate v2 selection on vec_memories only (post-implementation correction)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-01 |
| **Deciders** | Operator, orchestrator |

### Context

After Phases 1-7 shipped review-clean, live verification on the production database showed full-DB `checkpoint_create` was still choosing v1, not v2 — the feature was inert on the real runtime. Root cause: the selection gate `hasMainVectorPayloadTables` returned true when main held `vec_memories` **or `vec_metadata`**, but the shard-attach slimming (`drop_canonical_vector_payload_tables`) intentionally retains `vec_metadata` in main while dropping `vec_memories`. So every sharded daemon saw `vec_metadata` in main and fell back to the v1 string-ceiling path. Unit tests and the multi-lens review missed it — the test DBs never modeled the daemon post-slim state.

### Decision

**We chose**: Gate v2 selection on `vec_memories` only — the payload table the slimming actually removes from main — and add a regression test that creates `vec_metadata` in main and asserts v2 is still selected.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Gate on vec_memories only (chosen)** | Aligns the gate with what slimming removes; activates v2 on real runtimes; minimal change | Requires understanding the slim/gate coupling | 9/10 |
| Also drop vec_metadata from main during slimming | One source of truth | `vec_metadata` is a deliberate dim fallback read by the no-shard path; dropping it regresses that fallback | 3/10 |

### Consequences

**What improves**: Full-DB v2 checkpoints activate on the production sharded runtime; `Invalid string length` is actually prevented. Live-proven — v2 create (297 MB main + 72 MB shard, 0.37 s, integrity ok) and restore round-trip (9665 memories, consistent).

**What it costs**: Nothing material; one predicate plus a dedicated regression test.

### Implementation

**What changes**: `lib/storage/checkpoints.ts` `hasMainVectorPayloadTables` queries `name = 'vec_memories'` only; `tests/checkpoints-v2-create.vitest.ts` adds the daemon-post-slim regression test. Commit `cce4fe931d`.

**How to roll back**: Re-add `vec_metadata` to the gate's name set; v2 selection reverts to inert (not recommended).

---

<!--
Level 3 Decision Record: five ADRs, one per pressure-tested decision (ADR-005 added post-implementation from the live verification).
Human voice: active, direct, specific. HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
