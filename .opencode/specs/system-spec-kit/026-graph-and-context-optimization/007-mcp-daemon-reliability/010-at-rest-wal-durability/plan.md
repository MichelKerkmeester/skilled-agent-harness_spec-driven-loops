---
title: "Implementation Plan: at-rest WAL durability"
description: "Bound WAL growth on the main and attached vector shard schemas, checkpoint both WALs before detach and on a periodic interval, and preserve synchronous=NORMAL while recording copy-based benchmark data for the FULL/fullfsync follow-up decision."
trigger_phrases:
  - "at-rest WAL durability plan"
  - "active_vec checkpoint plan"
  - "wal_autocheckpoint 256 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/010-at-rest-wal-durability"
    last_updated_at: "2026-05-29T13:10:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented bounded WAL autocheckpointing and periodic checkpoint helper"
    next_safe_action: "Run strict packet validation and update checklist evidence"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Implementation Plan: At-Rest WAL Durability

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript MCP server + better-sqlite3 |
| **Framework** | `@modelcontextprotocol/sdk`, SQLite WAL mode |
| **Storage** | `context-index.sqlite` plus attached `active_vec` vector shard |
| **Testing** | TypeScript build, vitest, copy-based Node benchmark, strict spec validation |

### Overview
The implementation keeps production durability at `synchronous=NORMAL`, adds a 256-page autocheckpoint target to the main and attached vector shard schemas, and makes both close-time and periodic maintenance explicitly TRUNCATE both WALs. The benchmark uses a scratch copy of `database/context-index.sqlite` so the live daemon DB and its single-writer lease are never opened.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] User specified existing child packet path under `007-mcp-daemon-reliability/010-at-rest-wal-durability`.
- [x] `sk-code` OpenCode TypeScript route loaded.
- [x] `system-spec-kit` Level 2 template workflow loaded.
- [x] Required source and test files read before edits.

### Definition of Done
- [x] Main and shard `wal_autocheckpoint = 256` pragmas added.
- [x] `close_db()` checkpoints shard then main before detach.
- [x] `checkpointAllWal()` exported and scheduled after `server.connect(transport)`.
- [x] Targeted build/typecheck passes.
- [x] Targeted vitest suite passes.
- [x] Copy-based benchmark recorded.
- [ ] Packet strict validation exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Bounded WAL maintenance with best-effort checkpointing: keep write latency moderate with `synchronous=NORMAL`, bound uncheckpointed frames with `wal_autocheckpoint = 256`, and periodically force TRUNCATE on both schemas to shrink the file at rest.

### Key Components
- **`vector-index-store.ts`**: owns SQLite connection pragmas, active vector shard attach/detach, and close semantics.
- **`vector-index.ts`**: public search facade that re-exports store helpers.
- **`timer-registry.ts`**: owns registered intervals and shutdown cancellation through `clearAllTimers()`.
- **`context-server.ts`**: schedules periodic maintenance after the MCP transport is connected.
- **`vector-index-store.vitest.ts`**: pins the checkpoint order and helper behavior.

### Data Flow
startup -> main DB WAL mode and autocheckpoint -> attach active vector shard -> shard WAL mode and autocheckpoint -> runtime writes -> periodic shard/main TRUNCATE -> graceful close shard/main TRUNCATE -> detach shard -> close DB.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Main DB initialization | Sets WAL, busy timeout, cache, mmap, `synchronous=NORMAL` | Add `wal_autocheckpoint = 256` directly after `synchronous=NORMAL` | Build plus source inspection |
| Active vector shard schema | Sets attached shard WAL/cache/mmap/temp pragmas | Add `active_vec.wal_autocheckpoint = 256` after shard temp store | Build plus vitest initialization path |
| `close_db()` | Runs main TRUNCATE after detach | Re-sequence to shard TRUNCATE, main TRUNCATE, detach, close | New vitest checks call order before DETACH |
| Public vector index facade | Re-exports store helpers | Add `checkpointAllWal` to the same re-export block as `closeDb` | Build and context-server import usage |
| Context server runtime | Connects transport and owns timer cleanup | Register five-minute unref'd checkpoint interval after connect | Build and existing `clearAllTimers()` shutdown path |
| Benchmark evidence | Needed to gate future `FULL`/`fullfsync` decision | Run Node benchmark on scratch copy only | JSON result under packet `scratch/` |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read required source spans and full relevant function bodies.
- [x] Read timer registry and context-server transport connect area.
- [x] Read existing WAL checkpoint vitest.
- [x] Confirm requested `010-*` packet path did not exist and create only that path.

### Phase 2: Core Implementation
- [x] Add main autocheckpoint pragma.
- [x] Add active shard autocheckpoint pragma.
- [x] Add shard checkpoint before main checkpoint in `close_db()`.
- [x] Add and re-export `checkpointAllWal()`.
- [x] Add registered periodic checkpoint interval after transport connect.
- [x] Add regression tests.

### Phase 3: Verification
- [x] Run MCP build/typecheck.
- [x] Run targeted vitest suite.
- [x] Run copy-based benchmark.
- [ ] Run strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Build/typecheck | MCP server TypeScript | `npm run build --workspace=@spec-kit/mcp-server` from `.opencode/skills/system-spec-kit` |
| Regression | Vector-index close order, lifecycle shutdown, context server, retention runtime | `./node_modules/.bin/vitest run ...` from `mcp_server` |
| Benchmark | Copy-only SQLite commit and checkpoint timings | Node script in packet `scratch/` |
| Documentation | Level 2 packet contract | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <010-folder> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| better-sqlite3 PRAGMA support | Runtime library | Present | Required for schema-qualified WAL checkpoint and autocheckpoint pragmas |
| Existing `timer-registry.ts` | Internal | Present | Provides unref'd interval registration and shutdown cancellation |
| Packet 008 main close checkpoint | Internal | Present | Existing bare main checkpoint call must remain intact |
| Packet 009 shutdown ordering | Internal | Preserved | This packet relies on, but does not alter, shutdown order |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: WAL maintenance causes test failures, runtime checkpoint errors, or unacceptable benchmark/runtime latency.
- **Procedure**: remove the added autocheckpoint pragmas, remove the shard checkpoint and helper export, remove the context-server interval, and restore `close_db()` to its previous main-only checkpoint behavior. No data migration or live DB recovery is involved.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (read and scope) -> Phase 2 (code/test edits) -> Phase 3 (verification and docs)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Existing packet path and source files | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5 hour |
| Core Implementation | Medium | 0.75 hour |
| Verification and benchmark | Medium | 1 hour |
| Docs and validation | Medium | 0.75 hour |
| **Total** | | **~3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No live DB opened by benchmark.
- [x] No production `FULL` or `fullfsync` pragma added.
- [x] No signal handler, shutdown deadline, probe, retention sweep, `auto_vacuum`, or recovery path touched.

### Rollback Procedure
1. Restore previous `vector-index-store.ts` pragmas and close order.
2. Remove `checkpointAllWal()` from the store and barrel.
3. Remove the registered interval from `context-server.ts`.
4. Re-run build and targeted vitest.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
