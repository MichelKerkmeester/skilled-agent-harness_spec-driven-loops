---
title: "Implementation Plan: CocoIndex daemon resilience (7-patch defense-in-depth)"
description: "Seven patches across two source files address the socket-unlink cascade, double logger.exception CPU spike, six unsafe send_bytes sites, listen backlog default, log rotation gap, and version-mismatch race. About 50 LOC production plus 200 LOC tests."
trigger_phrases:
  - "cocoindex daemon plan"
  - "fcntl flock idempotency plan"
  - "socket-unlink guard plan"
  - "send_bytes safe wrapper plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/010-daemon-resilience"
    last_updated_at: "2026-05-07T08:32:00Z"
    last_updated_by: "deep-research-iter-5-synthesis"
    recent_action: "Authored 7-patch plan from deep-research synthesis"
    next_safe_action: "Author tasks.md + checklist updates then dispatch Phase 2 implementation"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-07-026-011-spec-update-post-research"
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
| **Storage** | SQLite (`target_sqlite.db`), `cocoindex.db` (Rust binding, opaque), unix socket (daemon.sock) |
| **Testing** | pytest under `mcp-coco-index/mcp_server/tests/` |
| **Entry point** | `cocoindex_code.cli` to `ccc run-daemon` |

### Overview

Seven patches across two source files. Patch 1 introduces a cross-platform `_try_acquire_pid_lock()` helper using `fcntl.flock` on POSIX and `msvcrt.locking` on Windows. The lock binds to an open fd, eliminating the 5-60 ms TOCTOU race. Patch 2 wraps all 6 daemon-side `send_bytes` sites in `_safe_send_bytes()` that swallows `BrokenPipeError`/`ConnectionResetError`. Patch 3 adds a daemon-side socket-unlink guard so no daemon severs a sibling's socket. Patch 4 moves the unconditional PID-write inside the lock-held region. Patch 5 swaps `FileHandler` for `RotatingFileHandler`. Patch 6 raises `Listener` backlog to 128. Patch 7 documents a 6-step operator recovery procedure.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md` REQ-001..REQ-010)
- [x] Live evidence captured (PID 98364 leaked, 564 BrokenPipeError lines, severance event Apr 27 17:08:49)
- [x] 5-iteration deep research synthesis at `research/research.md` with 21 findings and 23 spec corrections
- [x] All 10 research key questions answered

### Definition of Done
- [ ] All P0 acceptance criteria met (REQ-001..REQ-004, REQ-007, REQ-009, REQ-010)
- [ ] All P1 acceptance criteria met (REQ-005, REQ-006, REQ-008)
- [ ] Pytest suite passes (`pytest mcp-coco-index/mcp_server/tests/`)
- [ ] No new BrokenPipeError lines in `daemon.log` after a 100-disconnect soak across all 6 send_bytes sites
- [ ] `pgrep -fc 'ccc run-daemon'` returns 1 after 8 concurrent `start_daemon()` callers
- [ ] `daemon.log.1` exists after a 10 MB log content write
- [ ] 16 simultaneous connections all complete handshake without ECONNREFUSED
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Defense-in-depth across the daemon lifecycle. Atomic spawn (advisory lock + idempotency check) on the client side. Pipe-safe error path (six call sites) plus unlink guard plus in-lock PID write on the server side. Rotation and backlog hygiene round out the surface.

### Key Components

- **`client._try_acquire_pid_lock()`** (NEW helper): cross-platform advisory lock. POSIX uses `fcntl.flock(fd, LOCK_EX|LOCK_NB)`. Windows uses `msvcrt.locking(fd, LK_NBLCK, 1)`. Lock-fd pattern eliminates PID-reuse hazards.
- **`client.start_daemon()`** (`client.py:192-225`): now acquires the lock before any check or spawn. Pre-flight reads `daemon.pid`, calls `_pid_alive()`, calls `_cleanup_stale_files()` if dead, then spawns. All under the lock.
- **`client.ensure_daemon()`** (`client.py:413-443`): version-mismatch path now holds the lock across stop+restart, eliminating the 3-caller race window.
- **`daemon._safe_send_bytes()`** (NEW helper in `daemon.py`): wraps `conn.send_bytes()` in try/except for `(BrokenPipeError, ConnectionResetError)`. Logs once at INFO and returns without raising.
- **`daemon._handle_connection()`** (`daemon.py:432-451`): all 6 `send_bytes` call sites switch from raw to `_safe_send_bytes()`.
- **`daemon._async_daemon_main()`** (`daemon.py:613-615`): socket-unlink guard. Reads `daemon.pid`. If `_pid_alive(stored_pid) and stored_pid != os.getpid()`, raises `RuntimeError` and exits before unlink.
- **`daemon.py:568`**: PID-write moves inside the lock-held region.
- **`daemon.py:572-575`**: `RotatingFileHandler(maxBytes=10*1024*1024, backupCount=5)` replaces plain `FileHandler`.
- **`daemon.py:619`**: `Listener(sock_path, family=..., backlog=128)`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `client.py:192-225` `start_daemon()` | Spawns daemon subprocess | Wrap in `_try_acquire_pid_lock()`. Add pre-flight check. | Pytest 8-process stress assert count=1 |
| `client.py:413-443` `ensure_daemon()` version-mismatch | Stops then starts unconditionally | Hold lock across stop+restart sequence | Pytest 3-caller race test |
| `client.py` (NEW helper) `_try_acquire_pid_lock()` | n/a | NEW. Cross-platform advisory lock helper. | Unit test for POSIX and Win32 paths |
| `client.py:_pid_alive()`, `_cleanup_stale_files()` | Existing helpers | Reuse without change | Indirect via integration test |
| `daemon.py:426`, `:436`, `:439`, `:441`, +2 in `_search_with_wait` | Per-site `conn.send_bytes` | Replace with `_safe_send_bytes()` | Pytest parameterized over 6 sites |
| `daemon.py` (NEW helper) `_safe_send_bytes()` | n/a | NEW. Wraps send_bytes in try/except (BrokenPipeError, ConnectionResetError). | Unit test patches send to raise |
| `daemon.py:438`, `:445` `logger.exception` | Full traceback formatting | Replace with `logger.info` (single line) when called from new safe wrapper | Pytest asserts log line count after disconnect |
| `daemon.py:568` `pid_path.write_text` | Unconditional PID write | Move inside lock-held region | Pytest concurrent-spawn test |
| `daemon.py:572-575` `FileHandler` | No rotation | Replace with `RotatingFileHandler(10MB, 5)` | Pytest synthetic log churn test |
| `daemon.py:613-615` socket unlink | Unconditional | Add liveness guard | Pytest two-process socket-mtime test |
| `daemon.py:619` `Listener(...)` | `backlog=1` default | Pass `backlog=128` explicitly | Pytest 16-connect stress test |
| `daemon.py:644-665` `_accept_loop` | Read-only audit | No changes (already decoupled per P0-11) | n/a |
| `tests/test_daemon.py` | Does not exist | CREATE with unit tests for helpers and per-site coverage | pytest |
| `tests/test_e2e_daemon.py` | Does not exist | CREATE with E2E concurrency, backlog, rotation tests | pytest |
| `implementation-summary.md` operator-recovery | Single-line snippet | Replace with 6-step checklist | Manual review |
| `daemon.log` | Runtime log | Verify quieter post-fix | Grep BrokenPipeError count + log size |

Required inventories:
- All `send_bytes` call sites: `rg -n 'conn.send_bytes' .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/`
- All `start_daemon` call sites: `rg -n 'start_daemon\b' .opencode/skills/mcp-coco-index/`
- All `_pid_alive` and `_cleanup_stale_files` call sites: `rg -n '_pid_alive|_cleanup_stale_files' .opencode/skills/mcp-coco-index/`
- All `subprocess.Popen` call sites: `rg -n 'subprocess\.Popen|Popen\(' .opencode/skills/mcp-coco-index/`
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Confirm pytest setup runs locally (`cd mcp-coco-index/mcp_server && pytest --collect-only 2>&1 | head`)
- [ ] Capture `pgrep -af "ccc run-daemon"` baseline
- [ ] Snapshot current `daemon.log` size (~23 MB) and BrokenPipeError count (~564) for before-after comparison
- [ ] Verify no daemon-lifecycle tests exist (per P1-4): `grep -rn 'start_daemon\|ensure_daemon\|stop_daemon' .opencode/skills/mcp-coco-index/mcp_server/tests/` returns 0 hits

### Phase 2: Implementation (7 patches)

- [ ] **Patch 1** Atomic idempotent `start_daemon()` with `_try_acquire_pid_lock()` helper. Touch `client.py:192-225` plus `client.py:413-443`.
- [ ] **Patch 2** BrokenPipeError-safe wrapper for ALL 6 `send_bytes` sites. Touch `daemon.py:426`, `:436`, `:439`, `:441`, plus 2 `_search_with_wait` sites.
- [ ] **Patch 3** Daemon-side socket-unlink guard. Touch `daemon.py:613-615`.
- [ ] **Patch 4** Move `pid_path.write_text` inside lock-held region. Touch `daemon.py:568`.
- [ ] **Patch 5** `RotatingFileHandler(10MB, 5)` replaces `FileHandler`. Touch `daemon.py:572-575`.
- [ ] **Patch 6** `Listener(backlog=128)`. Touch `daemon.py:619`.
- [ ] **Patch 7** Operator recovery 6-step checklist. Touch `implementation-summary.md` (Known Limitations section).
- [ ] Author NEW `tests/test_daemon.py` with unit tests for `_try_acquire_pid_lock`, `_safe_send_bytes`, socket-unlink guard, lock-held PID-write.
- [ ] Author NEW `tests/test_e2e_daemon.py` with concurrency stress (8 process spawn), backlog stress (16 simultaneous connects), version-mismatch race, log-rotation tests.

### Phase 3: Verification

- [ ] `pytest mcp-coco-index/mcp_server/tests/test_daemon.py mcp-coco-index/mcp_server/tests/test_e2e_daemon.py -v` all pass
- [ ] 100-disconnect soak via Python script. Open 100 connections, close each on each of the 6 `send_bytes` sites. Verify `daemon.log` contains zero new `BrokenPipeError` lines.
- [ ] `pgrep -fc "ccc run-daemon"` returns 1 after 8 concurrent `ccc run-daemon` invocations
- [ ] Log rotation: write 11 MB of synthetic content. Verify `daemon.log.1` exists, `daemon.log` under 10 MB.
- [ ] Backlog stress: open 16 simultaneous connections within 100 ms window. Verify all complete handshake without ECONNREFUSED.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `_try_acquire_pid_lock()` cross-platform, `_safe_send_bytes()` swallow behavior, socket-unlink guard logic, classifyError equivalent | pytest, unittest.mock |
| Integration | Connection handler with patched `send_bytes` raising on each of 6 sites | pytest |
| E2E concurrency | 8 process spawn, assert singleton via `pgrep` | pytest with real subprocess |
| E2E version race | 3 concurrent `ensure_daemon` callers expecting different version | pytest with real subprocess |
| E2E backlog | 16 simultaneous connects | pytest with socket library |
| E2E rotation | 11 MB synthetic log, assert `daemon.log.1` exists | pytest with synthetic log writer |
| Soak | 100-disconnect loop across 6 sites | shell script + pytest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `cocoindex_code.client._pid_alive` | Internal | Green | Already exists |
| `cocoindex_code.client._cleanup_stale_files` | Internal | Green | Already exists |
| `fcntl` (POSIX) and `msvcrt` (Win32) | Stdlib | Green | Standard library |
| `logging.handlers.RotatingFileHandler` | Stdlib | Green | Standard library |
| `pytest` + `unittest.mock` | External (test) | Green | Standard |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any P0 patch causes a regression (false-positive lock acquisition prevents legitimate spawn, unlink guard prevents legitimate restart, etc.).
- **Procedure**: Revert the patch commit. All 7 patches are additive guards or local additions. Reverting restores prior behavior. No schema or data migration to roll back. The `RotatingFileHandler` change is the only one with persistent file-system effect, but rollover backups remain readable.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) -> Phase 2 (Implement 7 patches) -> Phase 3 (Verify)
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
| Implementation | Medium | 4-5 hours (~50 LOC production + ~200 LOC tests + new helper modules) |
| Verification | Medium | 2 hours (pytest + soak + concurrency stress + rotation + backlog) |
| **Total** | | **6-8 hours** (was 3-4 hours pre-research) |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Existing pytest suite passes pre-patch
- [ ] Baseline `daemon.log` size and BrokenPipeError count captured
- [ ] Active daemons enumerated and their PIDs noted
- [ ] Operator recovery executed (kill leaked PID 98364 + restart fresh) before applying patches

### Rollback Procedure
1. `git revert <patch-commit>` (each patch is a separate commit; revert in reverse order if needed)
2. Restart daemon via `ccc run-daemon` (the daemon picks up the reverted code on next spawn)
3. Verify pytest suite still passes
4. Note revert reason in handover.md

### Data Reversal
- **Has data migrations?** No. Daemon state files (SQLite) are untouched by these patches.
- **Reversal procedure**: N/A. Rotation backups (daemon.log.1..5) remain readable.
<!-- /ANCHOR:enhanced-rollback -->
