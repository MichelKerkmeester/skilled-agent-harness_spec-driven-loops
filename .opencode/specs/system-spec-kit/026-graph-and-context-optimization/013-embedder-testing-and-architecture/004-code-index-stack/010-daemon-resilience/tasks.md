---
title: "Tasks: CocoIndex daemon resilience (13 tasks across 7 patches)"
description: "Phase 1 setup, Phase 2 implementation of 7 patches plus 5 new test cases plus operator recovery doc, Phase 3 verification. T001-T013 covering all P0 and P1 requirements."
trigger_phrases:
  - "cocoindex daemon tasks"
  - "fcntl flock implementation tasks"
  - "send_bytes safe wrapper tasks"
  - "socket-unlink guard tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/010-daemon-resilience"
    last_updated_at: "2026-05-07T08:34:00Z"
    last_updated_by: "deep-research-iter-5-synthesis"
    recent_action: "Authored 13-task list from research"
    next_safe_action: "Update checklist + dispatch Phase 2"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-07-026-011-spec-update-post-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: CocoIndex daemon resilience

<!-- SPECKIT_LEVEL: 2 -->

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

*Capture pre-fix baselines and confirm test infrastructure works.*

- [ ] T001 Run `pytest mcp-coco-index/mcp_server/tests/ --collect-only` and `-v` to confirm baseline pass rate. Verify per P1-4 that NO daemon-lifecycle tests exist yet.
- [ ] T002 Capture `pgrep -af "ccc run-daemon"` to a snapshot file under `<packet>/scratch/baseline-processes.txt`
- [ ] T003 [P] Capture `wc -l /Users/michelkerkmeester/.cocoindex_code/daemon.log` and `grep -c BrokenPipeError` and `grep -cE '^File "|Traceback' daemon.log` to `<packet>/scratch/baseline-log.txt`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

*7 patches plus 6 new test cases. About 50 LOC production plus 200 LOC tests.*

- [ ] T004 **Patch 1**: Add `_try_acquire_pid_lock()` helper to `client.py`. Cross-platform via `sys.platform` branching. POSIX uses `fcntl.flock(fd, LOCK_EX|LOCK_NB)`, Win32 uses `msvcrt.locking(fd, LK_NBLCK, 1)`. Modify `start_daemon()` (`client.py:192-225`) to acquire the lock, pre-flight check via `_pid_alive`, call `_cleanup_stale_files` if needed, then fall through to existing spawn logic. Update `ensure_daemon()` version-mismatch path (`client.py:413-443`) to hold the lock across the stop+restart sequence.

- [ ] T005 **Patch 2**: Add `_safe_send_bytes(conn, payload)` helper to `daemon.py` that wraps `conn.send_bytes(payload)` in try/except `(BrokenPipeError, ConnectionResetError)` and logs once at INFO. Replace ALL 6 raw `conn.send_bytes` sites: `daemon.py:426` (handshake), `:436` (streaming first), `:439` (streaming retry, the buggy double-crash site), `:441` (non-streaming reply, NEW from research), plus 2 sites under `_search_with_wait`. Replace the 2 `logger.exception` calls at `:438` and `:445` so disconnects produce ONE INFO line, not two ERROR tracebacks.

- [ ] T006 **Patch 3** (NEW): Add socket-unlink guard at `daemon.py:613-615`. Before the unconditional `socket_path.unlink(missing_ok=True)`, read `daemon.pid` if present. Parse the integer. If `_pid_alive(stored_pid) and stored_pid != os.getpid()`, raise `RuntimeError("daemon already running at PID {stored_pid}")` and exit before unlink. Unix-only by construction (already inside `if sys.platform != 'win32':`).

- [ ] T007 **Patch 4** (NEW): Move `pid_path.write_text(str(os.getpid()))` from its current unconditional location at `daemon.py:568` to inside the lock-held region established by `_try_acquire_pid_lock()`. The lock is opened in the daemon's own startup path. Coordinate with Patch 1 so the client-side lock is released before the daemon's own startup acquires its lock.

- [ ] T008 **Patch 5** (NEW): Replace `logging.FileHandler(daemon_log_path())` at `daemon.py:572-575` with `logging.handlers.RotatingFileHandler(daemon_log_path(), maxBytes=10*1024*1024, backupCount=5, encoding='utf-8')`. Total cap: 60 MB.

- [ ] T009 **Patch 6** (NEW): Pass `backlog=128` to `Listener(...)` at `daemon.py:619`. Use `socket.SOMAXCONN` if more portable. Family-uniform (works on AF_UNIX and AF_PIPE), no platform branching.

- [ ] T010 **Patch 7** (NEW): Author 6-step operator recovery checklist in `implementation-summary.md` Known Limitations section. Steps: (1) `pkill -f "ccc run-daemon"`, (2) verify `pgrep -fc "ccc run-daemon"` returns 0, (3) optional `pgrep -f multiprocessing.resource_tracker` cleanup, (4) inspect `~/.cocoindex_code/` for stale `daemon.pid`/`daemon.sock`, (5) `ccc run-daemon` to start fresh (Patch 1 cleans stale state automatically), (6) `ccc status` or equivalent to confirm reachable.

- [ ] T011 [P] **Tests** (CREATE NEW `tests/test_daemon.py`): unit tests for the new helpers. Cases include `_try_acquire_pid_lock` POSIX path success and EWOULDBLOCK, `_try_acquire_pid_lock` Win32 path (skipped on non-Win32 via `pytest.mark.skipif`), `_safe_send_bytes` swallows `BrokenPipeError` and `ConnectionResetError`, `_safe_send_bytes` logs once at INFO, classifyError-equivalent error categorization. Plus integration test: 6-site parameterized BrokenPipeError test patches each `send_bytes` to raise and asserts no second ERROR record.

- [ ] T012 [P] **Tests** (CREATE NEW `tests/test_e2e_daemon.py`): E2E test cases. Cases include 8-process concurrency stress (assert `pgrep -fc 'ccc run-daemon'` returns 1), version-mismatch race (3 concurrent `ensure_daemon` callers, exactly one stop+restart), backlog stress (16 simultaneous connects, all complete handshake), log rotation (11 MB synthetic log content, assert `daemon.log.1` exists), socket-unlink guard (start daemon A, attempt second daemon spawn, assert second exits cleanly with RuntimeError and A's `daemon.sock` mtime unchanged).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Run focused pytest: `pytest mcp-coco-index/mcp_server/tests/test_daemon.py mcp-coco-index/mcp_server/tests/test_e2e_daemon.py -v`. All new tests + existing tests pass. Run a 100-disconnect soak script (`<packet>/scratch/soak.py`). Open 100 connections, close each mid-stream targeting one of the 6 send_bytes sites. Verify `daemon.log` contains ZERO new `BrokenPipeError` lines. Then run the 8-process concurrency stress, the 16-connection backlog stress, the 11 MB log rotation test, and the version-mismatch race test as separate commands. Capture results in `<packet>/scratch/verification-results.md`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001-T013 marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] checklist.md P0 items 100 percent verified with evidence
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` exits 0
- [ ] `implementation-summary.md` filled (post-implementation per Rule 13)
- [ ] T010 operator recovery action recorded as a separate operator log entry
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` (REQ-001..REQ-010)
- **Plan**: See `plan.md` (7 patches)
- **Research**: See `research/research.md` (5 iterations, 21 findings, 17 sections)
- **Source files**:
  - `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py`
  - `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py`
- **Test files (CREATE NEW)**:
  - `.opencode/skills/mcp-coco-index/mcp_server/tests/test_daemon.py`
  - `.opencode/skills/mcp-coco-index/mcp_server/tests/test_e2e_daemon.py`
- **Live evidence**: `/Users/michelkerkmeester/.cocoindex_code/daemon.log` (23 MB, 564 BrokenPipeError lines, severance event at 2026-04-27 17:08:49)
<!-- /ANCHOR:cross-refs -->
