---
title: "Implementation Plan: CocoIndex daemon resilience"
description: "Two surgical patches: idempotent start_daemon() guard and BrokenPipeError-safe error handler. ~15 LOC production + ~50 LOC tests. Plus operator one-shot recovery for the active leaked daemon."
trigger_phrases:
  - "cocoindex daemon plan"
  - "start_daemon idempotency plan"
  - "BrokenPipeError fix plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "specs/system-spec-kit/026-graph-and-context-optimization/011-cocoindex-daemon-resilience"
    last_updated_at: "2026-05-07T07:32:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan after spec landed"
    next_safe_action: "Author tasks + checklist"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-07-027-cocoindex-daemon-spec"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: CocoIndex daemon resilience

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3.11, asyncio, multiprocessing |
| **Framework** | mcp-coco-index `ccc` CLI + daemon module |
| **Storage** | LMDB (cocoindex.db), SQLite (target_sqlite.db), unix socket (daemon.sock) |
| **Testing** | pytest under `mcp-coco-index/mcp_server/tests/` |
| **Entry point** | `cocoindex_code.cli` to `ccc run-daemon` |

### Overview

Two surgical patches to existing daemon code, no new modules. Patch 1 adds a 6-line pre-flight check at the top of `start_daemon()` (uses existing `_pid_alive()` and `_cleanup_stale_files()` helpers). Patch 2 wraps the error-response `send_bytes()` in a try/except for `(BrokenPipeError, ConnectionResetError)` so the error path does not double-crash. Tests assert idempotency, stale-cleanup, and broken-pipe quietness.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md` REQ-001..REQ-006)
- [x] Live evidence captured (PID 98364 leaked, 564 BrokenPipeError lines)
- [x] Existing helpers identified (`_pid_alive`, `_cleanup_stale_files`)

### Definition of Done
- [ ] All P0 acceptance criteria met (REQ-001..REQ-004)
- [ ] Pytest suite passes (`pytest mcp-coco-index/mcp_server/tests/`)
- [ ] No new BrokenPipeError lines in `daemon.log` after a 100-disconnect soak
- [ ] Active daemon's `pgrep -fc run-daemon` returns 1 after `start_daemon()` called twice
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Two independent guards on the existing daemon lifecycle. Idempotency guard at the spawn-site entry point. Pipe-safe error path at the connection-handler error site.

Both are local additions. No cross-module changes. No API surface changes for callers.

### Key Components

- **`client.start_daemon()`** at `client.py:192-225` is the spawn-site entry point. Currently bypasses the existing liveness helpers. Patch adds 6 lines at the top to consult `_pid_alive()` and `_cleanup_stale_files()` before `subprocess.Popen()`.
- **`daemon._handle_connection()`** at `daemon.py:~390-450` is the per-connection coroutine. The streaming-response branch at lines 432-440 has a try/except where the except itself is unsafe. Patch adds an inner try/except around the error-response `send_bytes()`.

### Data Flow

```
start_daemon() entry
   |
   +-- NEW: read daemon.pid -> _pid_alive() check
   |     +-- alive -> return early (no spawn)
   |     +-- dead PID -> _cleanup_stale_files() -> continue
   |     +-- no PID file -> continue
   |
   +-- subprocess.Popen(ccc run-daemon)


daemon._handle_connection (streaming branch)
   |
   +-- async for resp in result:
   |     conn.send_bytes(resp)        <- may raise BrokenPipeError
   |
   +-- except Exception as exc:
   |     logger.exception("Error during streaming response")
   |     try:                          <- NEW
   |       conn.send_bytes(error_resp)
   |     except (BrokenPipeError, ConnectionResetError):
   |       pass                        <- NEW: client gone, nothing to send
   |
   +-- (outer except handles unrelated failures)
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `client.py:start_daemon()` | Spawns daemon subprocess | Add 6-line pre-flight check | Pytest assert process count |
| `client.py:_pid_alive()`, `_cleanup_stale_files()` | Existing helpers | Reuse without change | Indirect via test |
| `daemon.py:_handle_connection()` | Per-connection coroutine | Wrap error-response send_bytes in try/except | Pytest patch send_bytes raise |
| `daemon.py:_dispatch()` | Request router | Read-only audit (no changes expected) | grep for other unsafe send_bytes |
| `tests/test_daemon.py` | Unit tests | Add 3 cases | pytest |
| `tests/test_e2e_daemon.py` | E2E tests | Add 1 case | pytest |
| `daemon.log` | Runtime log | Verify quieter post-fix | Grep BrokenPipeError count |

Required inventories:
- All `send_bytes` call sites: `rg -n 'conn.send_bytes' .opencode/skill/mcp-coco-index/mcp_server/cocoindex_code/`
- All `start_daemon` call sites: `rg -n 'start_daemon\b' .opencode/skill/mcp-coco-index/`
- All `_pid_alive`/`_cleanup_stale_files` call sites: `rg -n '_pid_alive|_cleanup_stale_files' .opencode/skill/mcp-coco-index/`
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Confirm pytest setup runs locally (`cd mcp-coco-index/mcp_server && pytest tests/test_daemon.py -k handshake -x`)
- [ ] Capture `pgrep -af "ccc run-daemon"` baseline
- [ ] Snapshot current `daemon.log` size for before-after comparison

### Phase 2: Implementation

- [ ] **T-Patch1** Edit `client.py:start_daemon()` and add 6-line pre-flight at the function top
- [ ] **T-Patch2** Edit `daemon.py:_handle_connection()` and add inner try/except around the error-response `send_bytes()` (lines ~438-440)
- [ ] **T-Test1** Add `test_start_daemon_idempotent` to `tests/test_daemon.py`
- [ ] **T-Test2** Add `test_start_daemon_cleans_stale_pid` to `tests/test_daemon.py`
- [ ] **T-Test3** Add `test_handle_connection_swallows_broken_pipe_in_error_path` to `tests/test_daemon.py`
- [ ] **T-Test4** Add `test_e2e_double_start_does_not_spawn` to `tests/test_e2e_daemon.py`
- [ ] **T-Recover** One-shot operator recovery. Kill leaked PID 98364 and the error-looping PID 24938 (`pkill -f "ccc run-daemon"`). Re-run `ccc run-daemon` to start a fresh daemon. (This task is OUT OF SCOPE for the patch commit. Track here so the orchestrator records the recovery action separately.)

### Phase 3: Verification

- [ ] `pytest tests/test_daemon.py tests/test_e2e_daemon.py -v` all pass
- [ ] 100-disconnect soak via a quick Python script. Open 100 connections in a tight loop, close each mid-stream. Count `BrokenPipeError` in `daemon.log` afterward. Expect zero.
- [ ] `pgrep -fc "ccc run-daemon"` returns 1 after `ccc run-daemon` is invoked twice consecutively
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `start_daemon()` idempotency, stale-PID cleanup, BrokenPipe error-path quiet | pytest, unittest.mock |
| Integration | Connection handler with patched `send_bytes` raising mid-stream | pytest |
| E2E | Real daemon spawn, double-start asserts singleton | pytest with real subprocess |
| Soak | 100-disconnect loop, log-line count assertion | shell script + pytest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `cocoindex_code.client._pid_alive` | Internal | Green | Already exists |
| `cocoindex_code.client._cleanup_stale_files` | Internal | Green | Already exists |
| `pytest` + `unittest.mock` | External (test) | Green | Standard |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Patch 1 causes a regression where `start_daemon()` returns without spawning when a daemon is needed (false-positive liveness check). OR Patch 2 causes a crash in the error-response path.
- **Procedure**: revert the patch commit. Both changes are additive guards. Reverting restores prior behavior. No schema or data migration to roll back.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) -> Phase 2 (Implement) -> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 min (capture baselines, run existing tests) |
| Implementation | Low | 2 hours (~15 LOC production + ~50 LOC tests) |
| Verification | Low | 1 hour (pytest + soak script + manual recovery probe) |
| **Total** | | **3-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Existing pytest suite passes pre-patch
- [ ] Baseline `daemon.log` size and BrokenPipeError count captured
- [ ] Active daemons enumerated and their PIDs noted

### Rollback Procedure
1. `git revert <patch-commit>`
2. Restart daemon via `ccc run-daemon` (the daemon will pick up the reverted code on next spawn)
3. Verify pytest suite still passes
4. Note revert reason in handover.md

### Data Reversal
- **Has data migrations?** No. Daemon state files (LMDB, SQLite) are untouched by these patches.
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
