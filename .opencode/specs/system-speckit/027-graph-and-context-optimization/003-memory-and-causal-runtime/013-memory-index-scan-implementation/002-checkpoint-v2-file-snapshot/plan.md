---
title: "Implementation Plan: Checkpoint v2 File-Based Full-DB Snapshots"
description: "Add a v2 file-based checkpoint path using SQLite VACUUM INTO for main plus the active_vec shard, restore by whole-file swap through a reopen coordinator, and version it with schema migration v29. The v1 scoped path stays verbatim."
trigger_phrases:
  - "checkpoint v2 plan"
  - "vacuum into checkpoint phases"
  - "reopenActiveDatabase coordinator"
  - "schema migration v29 checkpoints"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/002-checkpoint-v2-file-snapshot"
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
# Implementation Plan: Checkpoint v2 File-Based Full-DB Snapshots

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node), better-sqlite3 |
| **Framework** | Spec Kit Memory MCP server |
| **Storage** | SQLite main DB plus `active_vec` vector shard (sqlite-vec) |
| **Testing** | Vitest (`npm run typecheck`, `npm run test:core`) |

### Overview
Add a v2 file-based checkpoint path that snapshots the main database and, when `includeEmbeddings` is set, the attached `active_vec` shard, using SQLite `VACUUM INTO`. Restore swaps the snapshot files in through a new `reopenActiveDatabase` coordinator that closes the live connection first, then reopens via `initialize_db`. The change is versioned with schema migration v29; the existing v1 scoped path stays verbatim so all legacy checkpoints keep working.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (see `spec.md`)
- [ ] Success criteria measurable (SC-001..SC-004)
- [ ] Dependencies identified (VACUUM INTO, shard attach lifecycle, checkpoint primitives)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001..REQ-009)
- [ ] `npm run typecheck` shows 0 new errors and `npm run test:core` is green per phase
- [ ] Docs updated (spec/plan/tasks/checklist/decision-record/implementation-summary)
- [ ] Mandatory deep-review surfaces no P0/P1
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Selection branch plus reused primitives. Checkpoint format is chosen by scope: `specFolder == null && no tenant/user/agent scope` routes to v2 file-based; otherwise the existing v1 JSON path runs unchanged.

### Key Components
- **`createCheckpointV2` (`checkpoints.ts`)**: writes into `<name>.tmp-<pid>/`, runs `VACUUM main INTO` and optional `VACUUM active_vec INTO`, writes `manifest.json`, atomic-renames to `<name>/`, then inserts the row and enforces `MAX_CHECKPOINTS`.
- **`restoreCheckpointV2` (`checkpoints.ts`)**: validates the manifest, then routes the file swap through `reopenActiveDatabase`, then runs `runPostRestoreRebuilds`.
- **`reopenActiveDatabase(targetPath, swapFn)` (`vector-index-store.ts`)**: owns `db_connections` and the attach lifecycle; checkpoints both schemas, detaches the shard, closes, runs `swapFn`, then reopens via `initialize_db`.
- **`migrations[29]` (`vector-index-schema.ts`)**: adds `snapshot_format` and `snapshot_path` columns and bumps `SCHEMA_VERSION` 28 to 29.

### Data Flow
On create, `VACUUM INTO` produces transactionally consistent file copies of main and the shard with zero JS-string materialization, the manifest records the table split, and the `checkpoints` row stores `snapshot_format='v2'` plus `snapshot_path` with `memory_snapshot` NULL. On restore, the coordinator drains and closes the live connection, the snapshot files replace the live files, and `initialize_db` reattaches the shard, reloads sqlite-vec, and runs `ensure_schema_version`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet fixes a production-breaking bug (`Invalid string length`) and touches persistence, schema boundaries, and path handling, so the affected-surface inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/storage/checkpoints.ts` create path | Produces the checkpoint row and snapshot | update (add v2 branch; v1 verbatim) | New v2 create tests; existing v1 create tests stay green |
| `lib/storage/checkpoints.ts` restore path | Restores from a checkpoint | update (add v2 branch; v1 verbatim) | New v2 restore round-trip and rollback tests |
| `lib/storage/checkpoints.ts` prune/delete | Enforces `MAX_CHECKPOINTS`, deletes checkpoints | update (dir-aware for v2) | Prune and delete tests assert no orphan dirs |
| `lib/search/vector-index-store.ts` | Owns connection and shard attach lifecycle | update (add `reopenActiveDatabase`) | Restore round-trip reopens and reattaches the shard |
| `lib/search/vector-index-schema.ts` | Owns `SCHEMA_VERSION` and migrations | update (v29 columns + DDL) | v29 migration test; fresh-DB DDL parity |
| `handlers/checkpoints.ts` + `tool-schemas.ts` | Public `checkpoint_create` contract | update (expose `includeEmbeddings`) | Handler flag test; schema includes the field |
| `lib/search/db-shard-migration.ts` | VACUUM/ATTACH/vec0 precedent | unchanged (reference only) | grep confirms no edits |

Required inventories:
- Same-class producers: `rg -n 'snapshot_format|snapshot_path|memory_snapshot' lib/storage/checkpoints.ts lib/search/vector-index-schema.ts`.
- Consumers of changed symbols: `rg -n 'createCheckpoint|restoreCheckpoint|includeEmbeddings|reopenActiveDatabase|SCHEMA_VERSION' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: format (v1, v2) x includeEmbeddings (true, false) x shard-attached (yes, no) - list required rows before implementation.
- Algorithm invariant: restore never writes to a file that is open under a live connection; `sanitizeCheckpointName` rejects every path-traversal input.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Every phase is gated: `npm run typecheck` (0 new errors) plus `npm run test:core` (green) before the next phase starts. Phase 0 is this packet setup, done by the orchestrator, not the executor.

### Phase 1: Schema v29 + includeEmbeddings wiring
- [ ] Bump `SCHEMA_VERSION` 28 to 29 in `vector-index-schema.ts`
- [ ] Add idempotent `migrations[29]` adding `snapshot_format TEXT DEFAULT 'v1'` and `snapshot_path TEXT` to `checkpoints`, plus the fresh-DB `CREATE TABLE` DDL
- [ ] Expose `includeEmbeddings` in `handlers/checkpoints.ts` (`CheckpointCreateArgs`, pass into `createCheckpoint`) and the `checkpoint_create` tool schema
- [ ] Extend `CheckpointEntry` and `listCheckpoints` to read the new columns
- [ ] No create or restore behavior change; existing checkpoint tests stay green; add v29 migration and handler-flag tests

### Phase 2: v2 CREATE
- [ ] Implement `createCheckpointV2` (VACUUM INTO main plus optional shard, tmp-dir then atomic rename, write `manifest.json`)
- [ ] Add the selection branch (`specFolder == null && no scope` routes to v2)
- [ ] Make prune and `deleteCheckpoint` dir-aware (rmSync v2 dirs after commit)
- [ ] Add `sanitizeCheckpointName` (reject `/ \ .. NUL`, length cap)
- [ ] New create tests; v1 scoped create unchanged

### Phase 3: v2 RESTORE
- [ ] Implement `reopenActiveDatabase(targetPath, swapFn)` coordinator in `vector-index-store.ts`
- [ ] Implement `restoreCheckpointV2` (file swap, `.bak` rollback, post-restore rebuilds, format detection)
- [ ] Add downgrade and embedder-slug guards from the manifest
- [ ] Round-trip, rollback, format-detection, and schema-shape tests; v1 restore unchanged
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | v29 migration, name sanitization, manifest guards | Vitest |
| Integration | v2 create and restore round-trip with injectable reopen fn | Vitest |
| Regression | All 12 existing v1 checkpoint vitest files stay green | Vitest |
| Manual (live) | Full-DB create plus restore round-trip on the ~1 GB DB after deliberate daemon restart | MCP tools + `memory_health` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| SQLite `VACUUM INTO` | Internal (better-sqlite3) | Green | No file-based snapshot path |
| `active_vec` shard attach lifecycle | Internal | Green | Cannot snapshot or reattach vectors |
| Existing checkpoint primitives (barrier, manifest, rebuilds) | Internal | Green | Would reinvent reused logic |
| `db-shard-migration.ts` precedent | Internal | Green | Lose the VACUUM/ATTACH reference pattern |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: v2 create or restore regresses v1 behavior, or a live full-DB create or restore fails.
- **Procedure**: Because v2 is gated behind the scope selection branch and v29 columns are additive with `DEFAULT 'v1'`, reverting the v2 code leaves all v1 checkpoints fully functional. Revert per-phase commits in reverse order; the v29 columns can remain (unused) without breaking v1.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Schema v29 + flag) ──► Phase 2 (v2 CREATE) ──► Phase 3 (v2 RESTORE)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | Phase 2 |
| Phase 2 | Phase 1 | Phase 3 |
| Phase 3 | Phase 2 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Schema v29 + flag | Med | 2-3 hours |
| Phase 2: v2 CREATE | High | 4-6 hours |
| Phase 3: v2 RESTORE | High | 4-6 hours |
| **Total** | | **10-15 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Main committed and recovery-baseline hash recorded (RM-8 L3)
- [ ] Worktree node_modules symlinks in place (`mcp_server/node_modules`, `system-spec-kit/node_modules`, `system-spec-kit/shared/dist`)
- [ ] No `npm run build` while the daemon is live; typecheck only until the deliberate restart

### Rollback Procedure
1. Stop dispatching; `pkill -9 -f "opencode run"` between dispatches.
2. Revert the offending per-phase commit on `main`.
3. Re-run `npm run typecheck` plus `npm run test:core` to confirm v1 is green.
4. v29 columns are additive with `DEFAULT 'v1'`, so they may stay without breaking v1.

### Data Reversal
- **Has data migrations?** Yes - schema migration v29 (additive columns).
- **Reversal procedure**: Columns are nullable/defaulted and ignored by the v1 path; no destructive reversal required. Drop them only if a clean rollback is explicitly wanted.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│ Schema v29  │     │  v2 CREATE  │     │ v2 RESTORE  │
│  + flag     │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Schema v29 + flag | None | Columns, exposed `includeEmbeddings` | v2 CREATE |
| v2 CREATE | Schema v29 | `createCheckpointV2`, selection branch | v2 RESTORE |
| v2 RESTORE | v2 CREATE | `reopenActiveDatabase`, `restoreCheckpointV2` | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 - Schema v29 + flag** - 2-3 hours - CRITICAL
2. **Phase 2 - v2 CREATE** - 4-6 hours - CRITICAL
3. **Phase 3 - v2 RESTORE** - 4-6 hours - CRITICAL

**Total Critical Path**: 10-15 hours

**Parallel Opportunities**:
- None. Each phase gates the next through typecheck plus tests; the chain is strictly sequential.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Schema v29 live, `includeEmbeddings` wired | v29 migration + handler-flag tests green; v1 tests green | End Phase 1 |
| M2 | v2 CREATE working | New create tests green; v1 scoped create unchanged | End Phase 2 |
| M3 | v2 RESTORE working, full round-trip | Round-trip, rollback, format-detection tests green; deep-review clean | End Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

Full ADRs live in `decision-record.md`. Summary:

### ADR-001: File-based VACUUM INTO over chunked NDJSON

**Status**: Accepted

**Context**: The single `JSON.stringify` materializes the whole DB as one JS string and throws `Invalid string length`.

**Decision**: Use SQLite `VACUUM INTO 'file'` for a transactionally consistent file copy with zero JS-string materialization.

**Consequences**:
- Eliminates the string-size ceiling entirely.
- Snapshots consume roughly database-sized disk; pruning must be dir-aware.

**Alternatives Rejected**:
- Chunked NDJSON: re-introduces serialization machinery for a problem `VACUUM INTO` solves natively.

---

## EXECUTOR DISPATCH CONTRACT

Per-phase code implementation runs through cli-opencode, model `openai/gpt-5.5-fast --variant high`, fast tier. The orchestrator verifies each gate and owns all git writes.

- Dispatch: `AI_SESSION_CHILD=1 opencode run --model openai/gpt-5.5-fast --variant high --agent general --format json --dir <worktree> "<prompt>" </dev/null`
- RM-8 four-layer safeguards (cli-opencode SKILL.md ALWAYS rule 13): (L1) rendered prompt carries literal `BANNED OPERATIONS` plus `ALLOWED WRITE PATHS`; (L2) `--dir` is a fresh `git worktree`, not the live tree; (L3) main committed plus recovery-baseline hash recorded; (L4) gpt-5.5 chosen for instruction-following.
- Worktree node_modules gotcha (013 handover): three symlinks required - `mcp_server/node_modules`, `system-spec-kit/node_modules`, `system-spec-kit/shared/dist` - or `tsc` fails resolving `@spec-kit/shared/types`.
- Build-while-live: never `npm run build` (emits to `dist/` that the live daemon reloads). Typecheck is `npm run typecheck` (`tsc --noEmit`) only; daemon restart is a deliberate final step.
- `pkill -9 -f "opencode run"` between dispatches; treat `TS5101 baseUrl deprecated` in clean worktrees as pre-existing noise (count only new errors).
<!-- /IF -->
