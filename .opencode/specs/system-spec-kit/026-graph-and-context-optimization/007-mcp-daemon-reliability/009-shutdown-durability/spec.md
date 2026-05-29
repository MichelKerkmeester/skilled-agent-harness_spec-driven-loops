---
title: "Feature Specification: shutdown durability for forwarded launcher signals"
description: "Harden mk-spec-memory shutdown so the close-time WAL TRUNCATE checkpoint can complete before any launcher SIGKILL. Covers every signal the launcher forwards and makes the launcher grace exceed the daemon shutdown deadline."
trigger_phrases:
  - "shutdown durability"
  - "forwarded launcher signals"
  - "SIGHUP SIGQUIT fatalShutdown"
  - "daemon WAL checkpoint before SIGKILL"
  - "026 007 009 shutdown durability"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/009-shutdown-durability"
    last_updated_at: "2026-05-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented shutdown durability guards"
    next_safe_action: "Run staged verification"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Should SIGKILL be handled? No, SIGKILL is unhandleable and remains out of scope."
---
# Feature Specification: Shutdown Durability for Forwarded Launcher Signals

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (shutdown durability and data-integrity hardening) |
| **Status** | implemented |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent** | `system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 008 made `close_db()` run `PRAGMA wal_checkpoint(TRUNCATE)` on graceful close, but the daemon shutdown path still allowed two durability gaps. The context server only registered SIGTERM/SIGINT while the launcher forwards SIGTERM/SIGINT/SIGHUP/SIGQUIT, and the launcher gave children 5000ms before SIGKILL, equal to the daemon's own `SHUTDOWN_DEADLINE_MS`.

### Purpose
Ensure every launcher-forwarded shutdown signal reaches `fatalShutdown`, and ensure the launcher grace is longer than the daemon deadline so synchronous `vectorIndex.closeDb()` can complete its close-time WAL TRUNCATE checkpoint before any external SIGKILL.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add clean `SIGHUP` and `SIGQUIT` handlers that route to `fatalShutdown(..., 0)`.
- Keep synchronous `vectorIndex.closeDb()` AFTER the awaited `fileWatcher` drain (a review found that hoisting it first lets a draining watcher task reopen the DB via `getDb()` and write fresh WAL frames after the TRUNCATE — defeating the durability guarantee). Add a clarifying comment encoding the invariant.
- Replace the launcher's hardcoded 5000ms forwarded-signal reap grace with `RESPAWN_REAP_GRACE_MS`.
- Add a regression test for SIGHUP/SIGQUIT routing and vectorIndex-after-fileWatcher source order.

### Out of Scope
- Handling SIGKILL or adding `exit`/`beforeExit` handlers.
- Changing `SHUTDOWN_DEADLINE_MS`, Promise.race deadline structure, or uncaught exception exit codes.
- Changing SQLite pragmas, `vector-index-store.ts`, probe timeouts, DB files, or recovery logic.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modify | Register SIGHUP/SIGQUIT; keep `vectorIndex.closeDb()` after the fileWatcher drain (with an invariant comment) so drained writes are checkpointed and the DB is not reopened post-close |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | Use `RESPAWN_REAP_GRACE_MS` for forwarded-signal child reap waits |
| `.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts` | Modify | Source-level regression coverage for handlers and cleanup order |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every launcher-forwarded signal must trigger daemon graceful shutdown | SIGTERM, SIGINT, SIGHUP, and SIGQUIT all route to `fatalShutdown(..., 0)` |
| REQ-002 | The close-time WAL checkpoint must capture in-flight watcher writes and not be defeated by a post-close DB reopen | `vectorIndex.closeDb()` runs AFTER the awaited `fileWatcher` drain inside the cleanup IIFE; an invariant comment documents that closeDb-first would let the drain reopen the DB and write post-TRUNCATE WAL |
| REQ-003 | Launcher SIGKILL grace must exceed daemon shutdown deadline | `waitForChildExit` and `sleep` both use `RESPAWN_REAP_GRACE_MS` (7000ms) while `SHUTDOWN_DEADLINE_MS` remains 5000ms |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Regression coverage must lock handler and cleanup ordering | Vitest asserts SIGHUP/SIGQUIT handler routing and that vectorIndex close runs AFTER the fileWatcher drain |
| REQ-005 | Existing daemon-reliability behavior must not regress | Staged launcher/context-server/lifecycle test set passes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: SIGHUP and SIGQUIT cleanly enter `fatalShutdown` with exit code 0.
- **SC-002**: The synchronous DB close/checkpoint step runs AFTER the awaited fileWatcher drain (so drained writes are captured and the DB is not reopened post-close), and before transport, IPC bridge, shutdown hooks, and timer cleanup.
- **SC-003**: Launcher forwarded-signal grace is 7000ms and therefore strictly greater than the daemon 5000ms shutdown deadline.
- **SC-004**: TypeScript build, targeted vitest suites, launcher syntax check, and strict packet validation pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Reordering cleanup could change watcher teardown timing | Low | Only moves synchronous DB close earlier; leaves transport, IPC bridge, shutdown hooks, and timers in relative order |
| Risk | Equal 5000ms deadlines can let launcher SIGKILL race daemon cleanup | Med | Use existing 7000ms launcher grace constant |
| Dependency | Packet 008 checkpoint-on-close is already committed | High | This packet preserves that path and makes it more likely to finish |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No new steady-state runtime cost; changes run only during shutdown.

### Security
- **NFR-S01**: No new external interface, secrets, or filesystem write path.

### Reliability
- **NFR-R01**: Shutdown remains bounded by the daemon deadline, while the launcher external reap grace exceeds it.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Signal Boundaries
- SIGHUP and SIGQUIT are forwarded by the launcher and now receive the same clean daemon handling as SIGTERM/SIGINT.
- SIGKILL remains unhandleable and out of scope.

### Error Scenarios
- Uncaught exceptions and unhandled rejections continue to call `fatalShutdown(..., 1)`.
- Cleanup exceptions remain isolated by `runCleanupStep` and `runAsyncCleanupStep`.

### State Transitions
- Forwarded signal -> daemon `fatalShutdown` -> synchronous `vectorIndex.closeDb()` -> async watcher cleanup -> transport/IPCs/hooks/timers -> process exit.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two source files plus one source-level test |
| Risk | 14/25 | Touches shutdown ordering and launcher kill timing |
| Research | 8/20 | Builds directly on packet 008 and daemon reliability siblings |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
