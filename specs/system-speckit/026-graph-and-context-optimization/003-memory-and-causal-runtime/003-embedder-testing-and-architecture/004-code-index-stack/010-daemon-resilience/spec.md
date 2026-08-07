---
title: "CocoIndex daemon resilience: 7-patch defense-in-depth for socket-unlink cascade"
description: "Five interacting bugs in the mcp-coco-index daemon caused leaked-zombie processes and CPU-spinning log spam. Five iterations of deep research expanded the surface from two surface bugs to a seven-patch remediation plus three formally-refuted hypotheses. The leak mechanism is the unconditional socket-unlink at daemon startup combined with a non-atomic start_daemon. The CPU spike is 90 percent double logger.exception per disconnect across six unsafe send_bytes sites."
trigger_phrases:
  - "cocoindex daemon resilience"
  - "daemon socket-unlink cascade"
  - "BrokenPipeError loop"
  - "fcntl flock idempotency"
  - "mcp-coco-index daemon leak"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/010-daemon-resilience"
    last_updated_at: "2026-05-07T08:30:00Z"
    last_updated_by: "deep-research-iter-5-synthesis"
    recent_action: "Applied 23 spec corrections from research synthesis"
    next_safe_action: "Dispatch Phase 2 implementation"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-07-026-011-spec-update-post-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: CocoIndex daemon resilience

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Research-Complete |
| **Created** | 2026-05-07 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The mcp-coco-index daemon (`ccc run-daemon`) has multiple interacting bugs across five surfaces. Five iterations of deep research traced every link in the cascade and produced concrete file:line citations for each.

**Bug 1: `start_daemon()` is non-idempotent.** `client.py:192-225` blindly calls `subprocess.Popen` to spawn a new daemon without first checking whether an alive daemon is already running. The function does NOT consult `daemon.pid`, does NOT call `_pid_alive()`, and does NOT clean up stale state before spawning. Helpers `_pid_alive()` and `_cleanup_stale_files()` exist in the same module but only `stop_daemon()` invokes them.

**Bug 2: Six `send_bytes` sites lack pipe-error safety, not two.** `daemon.py:436-444` is the streaming-response branch. The except handler tries to send an `ErrorResponse` over the same broken pipe that just failed, raising `BrokenPipeError` again. The outer except catches the second exception, logs it, and the connection drops. Each disconnect produces 2-3 stack traces in `daemon.log`. The original spec covered only the streaming pair (`:436` and `:439`). Research found a third unsafe site at `:441` (non-streaming reply path) plus 2 sites under `_search_with_wait`, totaling six call sites that need wrapping.

**Bug 3 (NEW): Unconditional socket-unlink at daemon startup is the leak mechanism.** `_async_daemon_main()` unconditionally unlinks `daemon.sock` at `daemon.py:615` (POSIX path) before binding. Any concurrent live daemon loses its socket binding the moment a new daemon starts. PID 98364 (Apr 27 17:08:49) was severed by PID 16404 spawning concurrently. PID 98364 stayed alive but unreachable for 9 days 23 hours.

**Bug 4 (NEW): `daemon.py:568` overwrites `daemon.pid` unconditionally.** The new daemon's PID-write happens before any liveness check completes, leaving the old daemon untracked.

**Bug 5 (NEW): `Listener` defaults `backlog=1`.** `daemon.py:619` calls `Listener(...)` with no `backlog=` kwarg. Stdlib default is 1 (verified via stdlib source dump). Hygiene only because the accept thread is decoupled from the broken-pipe loop, but raises ECONNREFUSED risk under genuine multi-client storms.

**Live evidence captured 2026-05-07T07:30Z:**

- Two daemon processes running. PID 24938 (May 1, 5d17h, 54.7 percent CPU) and PID 98364 (Apr 27, 9d23h, 0.0 percent CPU but 244 open file descriptors). Only the May 1 daemon is bound to `daemon.sock`. The Apr 27 daemon is an idle fd-leak, not a corruption hazard. The daemon was severed from its socket binding at 2026-04-27 17:08:49 when a concurrent `start_daemon()` call unconditionally unlinked the socket file at `daemon.py:615`. The process stayed alive but unreachable. No requests reach it, so no writes ever fire.
- `daemon.log` is 23 MB and contains 564 `BrokenPipeError` lines. Recent timestamps cluster on `2026-05-06 12:40-15:14` and `2026-05-07 07:58-08:00`.
- Active daemon CPU peaked at 72 percent during a multi-dispatch verification orchestration, dropping to about 5 percent only between dispatches. CPU spike attribution: about 90 percent from double `logger.exception` per disconnect (1128 traceback formats), about 10 percent from reconnect storm, 0 percent from accept-queue starvation.
- `daemon.pid` content is `24938` (only the active daemon). The leaked PID 98364 is not tracked anywhere.

**Hypotheses formally ruled out:**
- LMDB write contention. No LMDB exists in `cocoindex_code/`. Storage is per-project SQLite via `cocoindex.connectors.sqlite`. The sole "LMDB" mention in the codebase is a stale docstring at `project.py:33`.
- Daemon spawns child workers we need to reap. `multiprocessing.Process|Pool|SemLock|set_start_method` returns zero hits. PID 40681 belongs to a transitive dep (`multiprocessing.resource_tracker`), self-exits via SIGCHLD.
- Socket-backlog reconnect storm causes the CPU spike. Accept thread runs in a dedicated `threading.Thread(daemon=True)` at `daemon.py:644-665`. Each iteration is `accept()` plus `asyncio.run_coroutine_threadsafe()`, both sub-millisecond.

### Purpose

Make the daemon lifecycle robust so that:
1. Calling `start_daemon()` while a healthy daemon is already running is a safe no-op, atomic across N concurrent processes via an advisory file lock.
2. Stale PID files are detected and cleaned at daemon startup.
3. A client disconnecting mid-stream produces a single graceful log line on any of the six `send_bytes` sites, not a double-crash with stack trace.
4. Daemon-side socket-unlink is guarded so no daemon can sever a sibling's socket.
5. `daemon.log` rotates at 10 MB with 5 backups (60 MB cap) so unbounded log growth is impossible.
6. `Listener` accepts a 128-deep backlog so genuinely concurrent client storms succeed.

Success means an end user can run repeated MCP-driven sessions for hours without producing zombie daemons or 23 MB log files.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Atomic pre-flight liveness check + advisory lock in `start_daemon()` using `_pid_alive()`, `_cleanup_stale_files()`, AND a new `_try_acquire_pid_lock()` helper that wraps `fcntl.flock(fd, LOCK_EX|LOCK_NB)` on POSIX and `msvcrt.locking(fd, LK_NBLCK, 1)` on Windows. The lock is bound to the open fd, eliminating the 5-60 ms TOCTOU race window between read-PID and spawn.
- BrokenPipeError-safe error path covering all 6 daemon-side `send_bytes` call sites (handshake at `:426`, streaming pair at `:436`/`:439`, non-streaming reply at `:441`, plus 2 sites under `_search_with_wait`).
- Daemon-side socket-unlink guard at `daemon.py:613-615`. Refuse to unlink the AF_UNIX socket if `_pid_alive(stored_pid)` is True for a PID different from `os.getpid()`. Unix-only by construction (already inside `if sys.platform != 'win32':`).
- Move `pid_path.write_text(str(os.getpid()))` from its current unconditional location at `daemon.py:568` to inside the lock-held region established by `_try_acquire_pid_lock()`, so PID-write cannot race with another concurrent spawn.
- Replace `logging.FileHandler` at `daemon.py:572-575` with `logging.handlers.RotatingFileHandler(maxBytes=10*1024*1024, backupCount=5)` (60 MB total cap).
- Pass `backlog=128` (or `socket.SOMAXCONN`) explicitly to `Listener(...)` at `daemon.py:619` (currently uses stdlib default `backlog=1`).
- Fix `ensure_daemon()` version-mismatch path at `client.py:413-443` so the stop+restart sequence holds the advisory lock across both phases.
- Pytest cases under `mcp-coco-index/mcp_server/tests/` (NEW files; tests do not currently exist).
- Operator-facing 6-step recovery checklist documented in the implementation summary.
- One-time recovery: kill the leaked PID 98364 and restart the active PID 24938 cleanly.

### Out of Scope

- Cross-platform IPC redesign (Unix socket to TCP, Windows named pipes).
- Daemon multi-tenancy (one daemon per workspace vs shared).
- Indexing-correctness changes.
- Embedding model changes.
- Performance tuning beyond the targeted bug fixes.
- Shutdown `asyncio.gather()` per-task timeout (P1-2 deferred follow-up).
- `cocoindex.db` Rust-binding opacity audit (P2-3 orthogonal).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py` | Modify | Add `_try_acquire_pid_lock()` helper. Modify `start_daemon()` to acquire lock before spawn. Update `ensure_daemon()` version-mismatch path to hold lock across stop+restart. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py` | Modify | Wrap all 6 `send_bytes` sites in `_safe_send_bytes()` helper. Add socket-unlink guard at `:613-615`. Move `pid_path.write_text` inside lock-held region. Replace `FileHandler` with `RotatingFileHandler`. Pass `backlog=128` to `Listener`. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_daemon.py` | CREATE | Add unit tests for `_try_acquire_pid_lock`, `_safe_send_bytes`, socket-unlink guard, lock-held PID-write. File does not currently exist. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_e2e_daemon.py` | CREATE | Add E2E concurrency stress test (8 process spawn assert count=1), backlog stress (16 simultaneous connects), version-mismatch race, log-rotation. File does not currently exist. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `start_daemon()` is atomic-idempotent across N concurrent callers | Calling `start_daemon()` from N concurrent processes (N up to 8) produces EXACTLY ONE daemon. All other callers acquire-fail on the advisory lock and either wait for the live daemon OR return without spawning. Pytest stress case forks 8 processes, asserts process count=1 via `pgrep -fc 'ccc run-daemon'`. |
| REQ-002 | Stale `daemon.pid` is cleaned at startup | If `daemon.pid` exists with a dead PID, `start_daemon()` calls `_cleanup_stale_files()` before spawning. Pytest case writes a fake stale PID, calls `start_daemon()`, asserts the new PID overwrites and the daemon is reachable. |
| REQ-003 | Broken pipe on any `send_bytes` site logs once | Client disconnect on any of the 6 `send_bytes` sites produces at most ONE log line at INFO or WARNING level. No `ERROR`/`CRITICAL` records. No second `send_bytes` attempt. Pytest case parameterized over each of the 6 send_bytes locations. |
| REQ-004 | Broken pipe on error response is silently ignored | Client disconnect during the error-response path does NOT propagate to the outer except. The connection terminates cleanly. Pytest case patches both `send_bytes` calls to raise and asserts no second stack trace in the log. |
| REQ-007 | Daemon-side socket-unlink guard prevents severing a live sibling | Pytest case starts daemon A, then runs `_async_daemon_main` from a second process. The second daemon must exit cleanly with `RuntimeError` without unlinking A's socket. Daemon A's `daemon.sock` mtime unchanged. |
| REQ-009 | `ensure_daemon()` version-mismatch path is race-safe | Pytest case starts daemon at version A, simulates 3 concurrent `ensure_daemon()` calls expecting version B. Exactly ONE stop+restart sequence runs. All 3 callers eventually see version B. |
| REQ-010 | `Listener` is bound with `backlog=128` | Pytest stress case opens 16 simultaneous connections. All 16 complete handshake without `ECONNREFUSED`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Operator recovery 6-step checklist documented | `implementation-summary.md` Known Limitations section includes the 6-step operator workflow: (1) `pkill -f "ccc run-daemon"`, (2) verify `pgrep -fc "ccc run-daemon"` returns 0, (3) optional resource_tracker check, (4) inspect `~/.cocoindex_code/` for stale files, (5) `ccc run-daemon` to start fresh (Patch 1 cleans stale state), (6) `ccc status` to confirm reachable. |
| REQ-006 | `daemon.log` size advisory met | After the fix, BrokenPipeError frequency drops to zero on disconnect. The log should not grow faster than legitimate index activity. |
| REQ-008 | `daemon.log` rotates at 10 MB with 5 backups | Pytest case writes more than 10 MB of synthetic log content. Asserts presence of `daemon.log.1` and that `daemon.log` size is under 10 MB after rollover. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A 24-hour soak test with 100 simulated client connections (each opening, sending one request, closing mid-stream on each of the 6 `send_bytes` sites) produces zero `BrokenPipeError` lines in `daemon.log`.
- **SC-002**: Calling `ccc run-daemon` from 8 concurrent processes produces exactly ONE daemon process. Verified via `pgrep -fc 'ccc run-daemon'`.
- **SC-003**: Existing test suite under `mcp-coco-index/mcp_server/tests/` continues to pass. All new tests authored under REQ-001..REQ-010 pass.
- **SC-004**: Daemon log rotates at 10 MB with 5 backups. After 60 MB of synthetic log churn, the live `daemon.log` is under 10 MB and `daemon.log.1` through `daemon.log.5` exist.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Race window between read-PID and spawn is 5-60 ms warm, multi-second cold (P0-4). Documented caveat is INSUFFICIENT — race directly produces the leaked-zombie bug observed at PID 98364. | High. The race IS the leak mechanism. | `fcntl.flock` advisory lock + atomic write to `daemon.pid`, with `msvcrt.locking` translation on Windows. |
| Risk | PID-reuse hazard if PID file content matches a recycled PID for an unrelated process | Low. Mitigated by binding the lock to the open fd. | Lock auto-releases when the holding process dies, so a recycled PID cannot inherit a stale lock. Process-name match is no longer needed as a fallback. |
| Risk | Race between `daemon.py:568` PID-write and concurrent `start_daemon()` calls | Medium. New daemons can step on each other's PID files. | PID-write moved inside lock-held region (P0-5). |
| Risk | Tests require process spawn which is slow in CI | Medium. Each idempotency test forks a real daemon. | Use small subset of cases. Mock `subprocess.Popen` for the unit-level idempotency check. Reserve real-spawn for one E2E case. |
| Dependency | `cocoindex_code.client._pid_alive()` and `_cleanup_stale_files()` already exist | Internal | No external dependency added. |
| Dependency | Cross-platform abstraction patterns: `sys.platform == 'win32'` branching | Internal | Already used 8+ times in `client.py` and `daemon.py`. New `_try_acquire_pid_lock()` follows the same pattern. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Atomic pre-flight liveness check adds under 10 ms overhead to `start_daemon()` cold-start path.
- **NFR-P02**: Broken-pipe handling produces no measurable CPU difference vs the success path on a healthy disconnect.
- **NFR-P03**: Log rotation completes in under 100 ms on a 10 MB rollover.

### Reliability
- **NFR-R01**: Daemon survives 1000 abrupt client disconnects in a tight loop without leaking memory or file descriptors.
- **NFR-R02**: Daemon shutdown via `stop_daemon()` cleans the PID file, socket file, and any zombie children even if interrupted.
- **NFR-R03**: Daemon survives 8 concurrent `start_daemon()` calls. Lock acquisition is atomic, no partial state visible to other callers.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- `daemon.pid` is empty file. Treat as "no PID known", proceed to spawn.
- `daemon.pid` contains non-integer text. Log warning, treat as stale, clean and spawn.
- PID exists but belongs to a different user. `_pid_alive()` returns True (PermissionError catch). Skip spawn and log a warning.

### Error Scenarios
- Client opens connection then immediately closes (no handshake). Handler should detect and skip without crash.
- Client sends partial request then disconnects. `recv_bytes` raises `EOFError`, the surrounding except handles it.
- Server runs out of memory during streaming. Caught by the outer `except Exception` at line 444.
- Lock-fd inherited by child process via fork. Child does not own the lock and cannot release it. Lock auto-releases when the original opener exits.

### State Transitions
- Pre-flight finds alive daemon. Return immediately, no spawn, no log.
- Pre-flight finds stale daemon (dead PID). Acquire lock, clean files, then spawn fresh.
- Pre-flight encounters a corrupt PID file. Log, clean files, spawn fresh.
- Concurrent N callers race the lock. ONE acquires, N-1 see EWOULDBLOCK, return without spawn.
- Daemon startup detects an alive sibling via the unlink guard. Exits with RuntimeError, sibling continues serving.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 2 source files + 2 NEW test files. ~50 LOC of net production change. ~200 LOC of tests. 7 patches across the 2 source files. |
| Risk | 12/25 | Cross-platform lock helper is a new pattern. Failure mode of the unlink guard could prevent legitimate restarts if mishandled. |
| Research | 10/20 | Five iterations of deep research completed. 21 findings shipped. All 10 key questions answered. Three hypotheses formally refuted. |
| **Total** | **34/70** | **Level 2** (was 18/70 before research; growth reflects expanded patch surface) |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the pre-flight check log the existing-daemon detection at INFO or DEBUG level? Default: INFO once, DEBUG on subsequent same-PID re-detections.
- Decision: YES, `fcntl.flock` advisory lock is required (race produces observed bug). See REQ-001 + Patch 1.
- Confirmed: 6 `send_bytes` sites total, all need wrapping. See REQ-003 acceptance criteria.
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-001
REQ-002
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
REQ-009
REQ-010
**Given** start_daemon called once with no daemon running
**Given** start_daemon called twice in succession
**Given** stale daemon.pid pointing at dead PID
**Given** corrupt daemon.pid with non-integer content
**Given** client disconnects mid-stream after partial response
**Given** client disconnects during error-response path
**Given** 8 concurrent start_daemon callers stress the advisory lock
**Given** log rolls over at 10 MB after synthetic content writes
**Given** version-mismatch race with 3 concurrent ensure_daemon callers
**Given** 16 simultaneous connections stress the listen backlog
**Given** second daemon exits cleanly when sibling holds socket
-->
