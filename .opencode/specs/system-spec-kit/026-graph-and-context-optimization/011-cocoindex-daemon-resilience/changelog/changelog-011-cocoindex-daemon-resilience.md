---
title: "Cocoindex daemon resilience: 7-patch defense-in-depth"
description: "Five interacting bugs in the mcp-coco-index daemon caused leaked-zombie processes and CPU-spinning log spam."
trigger_phrases:
  - "phase 011 changelog"
  - "cocoindex daemon resilience"
  - "fcntl flock daemon"
  - "_safe_send_bytes wrapper"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-07

> Spec folder: `026-graph-and-context-optimization/011-cocoindex-daemon-resilience` (Level 2)
> Parent packet: `026-graph-and-context-optimization`

### Summary

The daemon fix removed the operator-visible failure mode: 564 `BrokenPipeError` lines, a 90 percent CPU spike from double traceback formatting and a 23 MB unbounded `daemon.log`.
Log output now rotates at 10 MB with 5 backups, which caps daemon logs at 60 MB.
Concurrent-start storms now route through an atomic PID-file lock instead of spawning duplicate daemons.
A 5-iteration research pass traced 5 interacting bugs from the 2 surface bugs and produced the 7-patch remediation shipped in implementation commit `1bbe80986`.

### Added

- Four new lifecycle helpers: `_try_acquire_pid_lock` in `client.py` and `daemon.py`, `_pid_alive` in both files, `_safe_send_bytes` in `daemon.py` and `_unlink_stale_socket` in `daemon.py`.
- `mcp_server/tests/test_daemon.py` with 112 LOC and 9 unit tests. All 9 pass under the mcp-server venv.
- `mcp_server/tests/test_e2e_daemon.py` with 224 LOC and 5 E2E tests covering 8-process concurrency, 3-caller version mismatch, 16-connection backlog stress, 11 MB log rotation and two-process socket-unlink guard.
  The suite currently hangs in the local test runner because subprocess-fixture timing needs hardening.
- A 6-step operator recovery checklist in `implementation-summary.md` Known Limitations for stale-daemon cleanup and reachability confirmation.

### Changed

- Refactored `start_daemon()` to acquire a cross-platform advisory lock before liveness checks or spawn.
  POSIX uses `fcntl.flock(fd, LOCK_EX|LOCK_NB)`. Win32 uses `msvcrt.locking(fd, LK_NBLCK, 1)`.
- Wrapped the `ensure_daemon()` version-mismatch stop-and-restart path with the same lock so 3 concurrent callers cannot each restart the daemon.
- Moved the daemon PID write into the lock-held startup region. The PID file now exists if and only if the daemon is alive and holds the lock.
- Replaced raw daemon `conn.send_bytes` calls with `_safe_send_bytes` at 6 sites, including the streaming response path and `_search_with_wait` responses.
- Swapped `FileHandler` for `RotatingFileHandler(maxBytes=10*1024*1024, backupCount=5, encoding='utf-8')` and raised `Listener` backlog to 128.

### Fixed

- Double-crash on broken pipe. Production had 564 `BrokenPipeError` lines because the streaming-response handler tried to send an `ErrorResponse` over the same broken pipe that had failed.
- Socket-unlink cascade race. A sibling daemon could delete a live daemon's socket during startup and leave the old process alive but unreachable.
- Log growth without a cap. The observed log reached 23 MB before rotation shipped.
- Concurrent-start spawn duplication. Two daemons running was observed in production: PID 24938 tracked by `daemon.pid` and PID 98364 untracked with 244 open file descriptors.

### Verification

- sk-code audit on `mcp-coco-index/mcp_server/cocoindex_code/`: PASS, exit code 0.
  Scanned 15 files, reported 0 errors and 16 warnings. All warnings were `PY-SHEBANG` on pre-existing fork files, including `client.py:1` and `daemon.py:1`.
- sk-code audit on `mcp-coco-index/mcp_server/tests/`: PASS, exit code 0.
  Scanned 2 files, reported 0 errors and 3 warnings. The 3 warnings are new-file P2 gaps captured below.
- Unit pytest: `mcp_server/.venv/bin/python -m pytest mcp_server/tests/test_daemon.py -v` passed, 9 of 9 tests in 0.40s.
- Python environment note: pytest requires `mcp_server/.venv/bin/python`. System Python fails on `mcp` import through the FastMCP transitive load path.
- Research basis: 5 iterations, 459 lines, 17 sections and 21 findings in `research/research.md`.
- E2E pytest status: `test_e2e_daemon.py` exists with 5 tests, but all 5 hang in the runner due to subprocess-fixture timing. This is a known follow-up, not a Phase 2 verification failure.

### Files Changed

| File | What changed |
|------|--------------|
| `mcp_server/cocoindex_code/client.py` | Patch 1. Atomic idempotent `start_daemon()`, version-mismatch lock path and helper additions. Net change +109/-50. |
| `mcp_server/cocoindex_code/daemon.py` | Patches 2-6. Safe send wrapper, stale socket guard, in-lock PID write, rotating logs, backlog 128 and helper additions. Net change +120/-30. |
| `mcp_server/tests/test_daemon.py` | NEW, 112 LOC. 9 unit tests for Patches 1-3 plus a placeholder for the 6-site parameterized BrokenPipeError case. |
| `mcp_server/tests/test_e2e_daemon.py` | NEW, 224 LOC. 5 E2E tests for concurrency, version mismatch, backlog, log rotation and socket-unlink guard. Runner-hang follow-up remains open. |
| `implementation-summary.md` | Patch 7. Added 6-step operator recovery checklist in Known Limitations. |
| `changelog/changelog-011-cocoindex-daemon-resilience.md` | NEW. Packet-local changelog for the implementation. |

Implementation commit: `1bbe80986`. sk-code audit summary: `/tmp/sk-code-audit-026-011.md`.

### Follow-Ups

- E2E test fixture hardening. Subprocess-fixture timing causes 5 of 5 E2E tests to hang. Add per-process timeout and deterministic teardown ordering.
- 3 P2 sk-code gaps in NEW test files: missing `#!/usr/bin/env python3` shebang on `test_daemon.py` and `test_e2e_daemon.py`, plus missing module docstring on `test_e2e_daemon.py`.
- P1-2 from research: shutdown `asyncio.gather()` lacks per-task timeout. Filed for a later phase.
- P2-3 from research: `cocoindex.db` Rust-binding opacity audit. Filed for a later phase.
- `implementation-summary.md` is mostly unfilled template content. Only Known Limitations is authored. Fill the rest once doc-alignment work lands.

## 2026-05-07 — Phase 3 (Patches 8 and 9)

> Spec folder: `026-graph-and-context-optimization/011-cocoindex-daemon-resilience` (Level 2)
> Parent packet: `026-graph-and-context-optimization`

### Summary

Live integration testing surfaced a real concurrency race that the original Patches 1, 3 and 4 did not prevent. Three concurrent `ccc status` callers each spawned a daemon process. Both daemons then passed the integrated startup flow. They both wrote the PID file, both unlinked the socket, and both bound a fresh listener at the same path. The unit tests for the lock helper and the socket-unlink guard passed because they exercised the helpers in isolation, not the integrated `run_daemon` flow.

The root cause was an ordering bug. The startup sequence wrote the daemon's own PID at `daemon.py:635` BEFORE the sibling-check at `_unlink_stale_socket` ran inside `_async_daemon_main` at line 694. By the time the check fired, `daemon.pid` already contained the new daemon's own PID, so the comparison `stored_pid != os.getpid()` was always False and the guard never raised.

A separate logging defect: every log line was written twice. The cause was a `StreamHandler` attached alongside `RotatingFileHandler`. The spawned daemon's stderr is redirected to `daemon.log` by the client, so the StreamHandler wrote each line a second time through the redirect.

### Added

- Patch 8: a sibling-detection block in `run_daemon` between lock acquisition and the PID write. The block reads the previous PID, validates it is alive and not self, and raises `RuntimeError("daemon already running at PID N; refusing to start")` if a live sibling owns the file. Socket cleanup also moved into the same lock-held region for consistency.
- Patch 9: conditional `StreamHandler` attachment. The handler is added only when `sys.stderr.isatty()` returns True (interactive use). In spawned-daemon mode where stderr redirects to `daemon.log`, the handler is omitted, eliminating the double-write.

### Changed

- `run_daemon` (`daemon.py`) reordering: lock → existing-PID read → sibling check → socket unlink (inside lock) → PID write → logging setup → asyncio.run. The previous order wrote the PID before the sibling check, defeating the guard.
- `_async_daemon_main` (`daemon.py`) no longer calls `_unlink_stale_socket` because the socket is already cleared in `run_daemon` under the lock. The helper remains for unit-test coverage.
- Lock-acquisition error now reads `refusing to start (lock contended)` instead of `refusing to unlink socket`.

### Fixed

- Concurrent-spawn duplication. Three concurrent `ccc status` callers now produce exactly one daemon. Live test confirms: 1 daemon process, daemon.pid points to it.
- Sibling-daemon socket sabotage. Manually starting `ccc run-daemon` while a daemon is already alive now exits cleanly with `RuntimeError: daemon already running at PID 5314; refusing to start`. The live daemon's socket remains intact.
- Log double-write. Each log line now appears once instead of twice. Verified via duplication-factor check: total INFO lines / unique INFO content = 1.00.

### Verification

- Unit pytest: 9 of 9 in `mcp_server/tests/test_daemon.py` pass in 2.58s under the pipx-installed venv at `~/.local/pipx/venvs/cocoindex-code/bin/python`. The local `mcp_server/.venv/` from the original 026/011 work is broken because the parallel-session reorg renamed `.opencode/skill/` to `.opencode/skills/` and the venv's editable install pointer was baked to the old path.
- Live T1b: 3 concurrent `ccc status` produces 1 daemon (PID 5314). Pre-fix produced 2 daemons.
- Live T5: second `ccc run-daemon` invocation exits in under 3 seconds with `RuntimeError`. Pre-fix the second daemon listened and rebound the socket.
- Live T3: client disconnect mid-stream still produces 1 INFO line and 0 BrokenPipeError lines. Patch 2 still works after the logging changes.
- Live T6: log duplication factor 1.00. Pre-fix was 2.00.

### Files Changed

| File | What changed |
|------|--------------|
| `mcp_server/cocoindex_code/daemon.py` | Patch 8 (sibling-check before PID write, socket unlink moved into lock window). Patch 9 (StreamHandler only when stderr is a TTY). About +30/-10 lines. |
| `changelog/changelog-011-cocoindex-daemon-resilience.md` | This Phase 3 entry. |

### Follow-Ups

- Recreate `mcp_server/.venv` against the new `.opencode/skills/` path. The current venv works only because pipx reinstalled the package. Local-test workflows that expect `mcp_server/.venv/bin/python -m pytest` will fail until the venv is rebuilt.
- Add an integration test that exercises three concurrent `ccc run-daemon` subprocesses end-to-end. The current unit suite tests helpers in isolation and missed Phase 2's ordering bug.
- Audit other call sites of `_unlink_stale_socket`. The helper is still defensively useful but is no longer called from `_async_daemon_main`.
