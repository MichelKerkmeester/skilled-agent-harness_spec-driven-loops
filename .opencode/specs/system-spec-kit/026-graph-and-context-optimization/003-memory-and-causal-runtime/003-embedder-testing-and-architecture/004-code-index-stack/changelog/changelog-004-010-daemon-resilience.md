

---
title: "CocoIndex daemon resilience"
description: "Nine-patch defense-in-depth fix for the cocoindex daemon. The daemon was leaking zombie processes, burning CPU on every client disconnect, and producing unbounded log growth. The fix removes the leak surface, eliminates the disconnect-loop CPU spike, caps the log at 60 MB, and gives operators a single recovery procedure for any stuck-duplicated state."
trigger_phrases:
  - "cocoindex daemon resilience"
  - "fcntl flock daemon pid"
  - "BrokenPipeError send_bytes"
  - "daemon.log rotation 60mb"
  - "operator recovery daemon"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/010-daemon-resilience` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack`

### Summary

The cocoindex daemon was leaking zombie processes and burning CPU on every client disconnect. Two stale daemon zombies held 244 open file descriptors, the live daemon spent 90 percent CPU formatting tracebacks, and daemon.log had grown to 23 MB with 564 BrokenPipeError entries. The nine-patch fix removes the leak surface, eliminates the disconnect-loop CPU spike, caps the log at 60 MB, and gives operators a single recovery procedure that works whether the daemon is half-stuck, fully stuck, or duplicated.

### Added

- Cross-platform advisory lock on daemon.pid enables atomic spawn idempotency across fcntl.flock on POSIX and msvcrt.locking on Win32. Three concurrent start_daemon callers now converge on one daemon.
- Sibling-check at daemon startup reads the previous PID before overwriting it. A freshly started daemon detects an alive sibling and exits with RuntimeError: daemon already running at PID N, refusing to start instead of binding the shared socket.
- Socket-unlink guard reads daemon.pid before removing daemon.sock. If the stored PID is alive and not the current process, the daemon raises RuntimeError and refuses to unlink the socket of a live sibling.
- Operator recovery procedure documents a 6-step checklist for cleaning up after a hard crash or signal kill. The procedure clears stuck-duplicated daemon state in under 10 seconds.

### Changed

- _safe_send_bytes wrapper covers all six conn.send_bytes call sites in daemon.py. Client disconnects now produce one INFO line instead of two ERROR-level traceback dumps. The change eliminates the double-crash that generated 564 BrokenPipeError lines in production logs and the 90 percent CPU spike from traceback formatting.
- PID file write now runs inside the lock-held window. The PID file now holds the invariant that it exists only when the daemon is alive.
- RotatingFileHandler replaces logging.FileHandler. Total disk use for daemon logs caps at 60 MB instead of growing unbounded toward 23 MB and beyond.
- Listener backlog increased from the stdlib default of 1 to 128. Concurrent client storms with 16 simultaneous connects now queue at the OS level instead of failing with connection-refused or timing out.
- StreamHandler attached only when sys.stderr.isatty() returns True. The spawned daemon stderr is redirected to daemon.log by the client launcher, so the handler previously wrote every line twice. The conditional attach eliminates the duplication while preserving interactive terminal output.

### Fixed

- No fixes recorded.

### Verification

- verify_alignment_drift.py on cocoindex_code/ - PASS, 0 errors, 16 warnings (all PY-SHEBANG on pre-existing fork files, not introduced by this packet)
- verify_alignment_drift.py on tests/ - PASS, 0 errors, 0 warnings
- Unit pytest test_daemon.py - 9 of 9 PASS in 0.25 seconds under mcp_server/.venv/bin/python
- E2E pytest test_e2e_daemon.py (5 original tests) - 5 of 5 PASS in 3.96 seconds under the rebuilt venv
- New integration test test_concurrent_run_daemon_integrated_flow - PASS in 2.77 seconds. Confirms sibling-check: 1 winner, 2 losers with exit code 7 or 8
- Full local suite - 15 of 15 PASS in well under 5 seconds
- Live T1b (3 concurrent ccc status) - Pre-fix: 2 daemons. Post-fix: 1 daemon, daemon.pid points to the winner
- Live T5 (second ccc run-daemon while live) - Pre-fix: second listened anyway. Post-fix: exits in under 3 seconds with RuntimeError: daemon already running at PID N, refusing to start

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/cocoindex_code/client.py` | Modified | Patch 1 atomic spawn plus four new private helpers (_try_acquire_pid_lock, _pid_alive, _spawn_daemon_process, plus _cleanup_stale_files integration) |
| `mcp_server/cocoindex_code/daemon.py` | Modified | Patches 2-6 (_safe_send_bytes, _unlink_stale_socket, in-lock PID write, RotatingFileHandler, backlog=128) plus Patches 8-9 (sibling-check reorder, conditional StreamHandler) |
| `mcp_server/tests/test_daemon.py` | Created | 9 unit tests covering Patches 1-3 helpers in isolation |
| `mcp_server/tests/test_e2e_daemon.py` | Created | 5 integration tests covering Patches 1-6 end-to-end, plus test_concurrent_run_daemon_integrated_flow for the Patch 8 race |
| `changelog/changelog-011-cocoindex-daemon-resilience.md` | Created | Phase 2 changelog plus Phase 3 entry covering Patches 8-9 |

### Follow-Ups

- None.
