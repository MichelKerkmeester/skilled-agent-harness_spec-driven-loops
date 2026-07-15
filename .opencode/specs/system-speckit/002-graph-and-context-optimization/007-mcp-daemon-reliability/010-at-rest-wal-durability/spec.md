---
title: "Feature Specification: at-rest WAL durability"
description: "Shrink the recoverable WAL left beside the large context index by enabling bounded autocheckpointing on the main DB and active vector shard, checkpointing both schemas before detach on close, and adding a periodic best-effort TRUNCATE while keeping synchronous=NORMAL."
trigger_phrases:
  - "at-rest WAL durability"
  - "active_vec wal checkpoint"
  - "wal_autocheckpoint 256"
  - "checkpointAllWal"
  - "026 007 010 at-rest wal durability"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/010-at-rest-wal-durability"
    last_updated_at: "2026-05-29T15:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Bounded WAL: autocheckpoint 256 + periodic + dual-schema TRUNCATE; NORMAL shipped; tests green"
    next_safe_action: "Daemon 011: boot integrity-check + retention durability + probe timeout"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Should production synchronous be FULL in this packet? No. Ship synchronous=NORMAL and document the benchmark-gated follow-up."
---
# Feature Specification: At-Rest WAL Durability

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (daemon durability and DB recovery-window hardening) |
| **Status** | Implemented (autocheckpoint+periodic+dual-schema TRUNCATE; NORMAL shipped, FULL benchmark-deferred; tests green; review clean) |
| **Created** | 2026-05-29 |
| **Branch** | Not checked; user prohibited git commands |
| **Parent** | `system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 008 added a close-time `wal_checkpoint(TRUNCATE)` for the main context index, but the active vector shard remained attached without a shard TRUNCATE checkpoint in the close path. The live `context-index.sqlite-wal` was still about 9.2 MiB, approximately 2349 WAL pages, next to a roughly 1.0 GiB index that is not write-hot.

### Purpose
Keep the steady-state and shutdown recovery window small by bounding autocheckpointing on the main DB and active vector shard, then explicitly truncating both WALs on periodic maintenance and graceful close while preserving `synchronous=NORMAL`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `wal_autocheckpoint = 256` to the main SQLite connection after `synchronous = NORMAL`.
- Add `active_vec.wal_autocheckpoint = 256` when the active vector shard schema is ensured.
- Re-sequence `close_db()` so the active vector shard TRUNCATE checkpoint runs before the existing bare main `wal_checkpoint(TRUNCATE)`, then detach and close.
- Add `checkpointAllWal()` and re-export it through `lib/search/vector-index.ts`.
- Register a five-minute unref'd interval after `server.connect(transport)` that invokes `vectorIndex.checkpointAllWal()`.
- Add regression tests for close order and the new checkpoint helper.
- Run the requested copy-based WAL benchmark and document results.

### Out of Scope
- Changing `synchronous` from `NORMAL` to `FULL`.
- Adding production `fullfsync`.
- Touching signal handlers, `SHUTDOWN_DEADLINE_MS`, or `fatalShutdown` ordering from sibling packet 009.
- Touching probe logic or retention sweep logic from sibling packet 011.
- Setting autocheckpoint to 0, running a blocking full `VACUUM`, changing `auto_vacuum`, deleting DB files, or running recovery on the live DB.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` | Modify | Add main and shard autocheckpoint pragmas, close both WALs before detach, and expose `checkpointAllWal()` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index.ts` | Modify | Re-export `checkpointAllWal()` beside `closeDb` |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modify | Import `registerInterval` and register periodic WAL TRUNCATE after transport connect |
| `.opencode/skills/system-spec-kit/mcp_server/tests/vector-index-store.vitest.ts` | Modify | Assert shard checkpoint happens before DETACH and `checkpointAllWal()` calls both schemas |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/010-at-rest-wal-durability/` | Create | Level 2 docs and benchmark scratch artifact |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Production DB initialization must keep `synchronous=NORMAL` | `vector-index-store.ts` still contains `new_db.pragma('synchronous = NORMAL')` and does not add production `FULL` or `fullfsync` |
| REQ-002 | Main and active vector shard WAL autocheckpointing must be bounded | Main connection and `active_vec` both set `wal_autocheckpoint = 256` |
| REQ-003 | Graceful close must checkpoint the shard before detaching it | `active_vec.wal_checkpoint(TRUNCATE)` runs before any `DETACH DATABASE active_vec` |
| REQ-004 | Existing main close checkpoint string must be preserved | The bare call `db.pragma('wal_checkpoint(TRUNCATE)')` remains unchanged for the pinned vitest |
| REQ-005 | Periodic maintenance must checkpoint both schemas | `checkpointAllWal()` calls `active_vec.wal_checkpoint(TRUNCATE)` and `wal_checkpoint(TRUNCATE)`, and `context-server.ts` registers it every 300000ms after connect |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Tests must pin the new contracts | Vitest covers close checkpoint order and helper calls |
| REQ-007 | Staged verification must pass | MCP build/typecheck and targeted vitest suite exit 0 |
| REQ-008 | Benchmark must use a DB copy only | Benchmark script opens a scratch copy under this packet and never opens the live DB path |
| REQ-009 | Packet docs must validate | Level 2 docs exist and `validate.sh --strict` is run |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A new main DB connection sets `wal_autocheckpoint = 256` immediately after `synchronous = NORMAL`.
- **SC-002**: The attached `active_vec` schema sets `wal_autocheckpoint = 256`.
- **SC-003**: `close_db()` runs shard TRUNCATE, main TRUNCATE, `detachActiveVectorShard(db)`, `db.close()`, then `db = null`.
- **SC-004**: `context-server.ts` schedules `vectorIndex.checkpointAllWal()` every five minutes and relies on existing `clearAllTimers()` shutdown cleanup.
- **SC-005**: Targeted vitest and build checks pass.
- **SC-006**: Copy-based benchmark results are recorded in `implementation-summary.md`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Attached shard checkpoint could fail if the shard is not attached | Low | `checkpointAllWal()` and `close_db()` treat shard checkpoints as best-effort, then still checkpoint main |
| Risk | Periodic TRUNCATE could add synchronous work to daemon runtime | Low to medium | Runs every five minutes with `unref: true`; benchmark showed forced checkpoints after autocheckpointed writes were 0.100ms to 11.035ms on the copy |
| Risk | `FULL` plus APFS `F_FULLFSYNC` has higher tail latency | Medium | Keep production `NORMAL`; document follow-up gating behind benchmark data |
| Dependency | Packet 008 main close checkpoint | Present | This packet preserves the pinned bare main checkpoint and adds the shard call beside it |
| Dependency | Packet 009 shutdown ordering | Present | This packet does not alter signal handlers or fatal shutdown ordering |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Autocheckpointing must reduce recoverable WAL exposure without adding `FULL` or production `fullfsync` tail latency.
- **NFR-P02**: Periodic TRUNCATE must run as best-effort maintenance and must not keep the process alive.

### Security
- **NFR-S01**: No new external interface, filesystem recovery path, or DB deletion path.

### Reliability
- **NFR-R01**: Ungraceful daemon death should leave only a bounded and recoverable WAL window in normal operation.
- **NFR-R02**: Graceful close must shrink both main and active vector shard WALs when possible.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Attachment Boundaries
- `checkpointAllWal()` returns immediately when no DB is open.
- The active shard checkpoint is best-effort because some call sites may not have an attached shard.

### Error Scenarios
- A shard checkpoint failure must not block the main checkpoint.
- A main checkpoint failure must not block close.

### State Transitions
- Runtime maintenance: timer tick -> shard TRUNCATE -> main TRUNCATE.
- Graceful close: clear prepared statements -> close non-primary tracked connections -> shard TRUNCATE -> main TRUNCATE -> detach active shard -> close main connection.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Three source files, one test file, one benchmark script, Level 2 docs |
| Risk | 16/25 | SQLite WAL behavior and daemon lifecycle maintenance |
| Research | 10/20 | Builds on packets 008 and 009 and requires copy-based benchmark evidence |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
