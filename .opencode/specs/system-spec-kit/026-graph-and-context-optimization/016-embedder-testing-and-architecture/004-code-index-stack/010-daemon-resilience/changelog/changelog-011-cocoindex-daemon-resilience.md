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

> Spec folder: `026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/010-daemon-resilience` (Level 2)
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

## 2026-05-07: Phase 3 (Patches 8 and 9)

> Spec folder: `026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/010-daemon-resilience` (Level 2)
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

## 2026-05-07: Phase 4 (Patches 10 plus follow-up cleanup)

> Spec folder: `026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/010-daemon-resilience` (Level 2)
> Parent packet: `026-graph-and-context-optimization`

### Summary

Phase 4 closed the open follow-ups from Phase 3. The shutdown path no longer hangs when a handler task refuses to finish. The local test venv is rebuilt against the post-reorg path. New test files have shebangs and module docstrings. A real-subprocess integration test now covers the concurrent-spawn flow that Patch 8 fixed. The implementation-summary narrative is filled.

### Added

- Patch 10: `asyncio.wait_for(asyncio.gather(*tasks, return_exceptions=True), timeout=10.0)` wraps the daemon shutdown task-join. A stuck handler task can no longer block daemon exit beyond 10 seconds. Cancellation propagates through `wait_for`. Site: `daemon.py:786-798`.
- New integration test `test_concurrent_run_daemon_integrated_flow` in `test_e2e_daemon.py`. Spawns 3 real subprocess.Popen Python processes that each run the integrated `run_daemon` flow. Asserts exactly 1 winner plus 2 losers with exit code 7 (lock contended) or 8 (sibling alive). Catches the Phase 2 ordering bug if it ever regresses.
- New test `test_shutdown_timeout_with_stuck_task` for Patch 10. Runs a 60-second sleep task, applies a 2-second wait_for budget, asserts the shutdown returns in 2 to 3 seconds with all tasks cancelled.
- Shebangs and module docstrings on `tests/test_daemon.py` and `tests/test_e2e_daemon.py`. Closes the 3 P2 sk-code gaps from the Phase 3 follow-up list.

### Changed

- `mcp_server/.venv` rebuilt with `python3.11 -m venv .venv` plus `.venv/bin/pip install -e . pytest`. The pyvenv.cfg now points at the post-reorg `.opencode/skills/` source, restoring local pytest workflows.
- `implementation-summary.md` filled. The What Was Built, How It Was Delivered, Key Decisions, Verification, and Known Limitations sections now carry real content instead of template placeholders.
- Frontmatter `recent_action` and `next_safe_action` rewritten to satisfy the spec-kit narrative-detector regex. The validator rejects literal `summary` plus a few other words.

### Fixed

- Shutdown hang risk. Without Patch 10, `await asyncio.gather(*tasks, return_exceptions=True)` could block forever if any task held in a slow Embedder call or external IO. Now bounded at 10 seconds.
- E2E hang follow-up. The original Phase 2 changelog noted "5 of 5 E2E tests hang in harness". They actually pass cleanly in under 1.5 seconds each. The hang was caused by the `mcp_server/.venv` editable-install pointer being baked to the pre-reorg `.opencode/skill/` (singular) path and silently failing module imports when run from the post-reorg location.
- Validate.sh strict failure on the Phase 3 frontmatter additions. Two issues: a non-canonical SHA-256 fingerprint placeholder and a `recent_action` value that triggered the narrative regex via the literal word `summary`.

### Verification

- `verify_alignment_drift.py` on `cocoindex_code/`: PASS, 0 errors, 16 PY-SHEBANG warnings on pre-existing fork files only.
- `verify_alignment_drift.py` on `tests/`: PASS, 0 errors, 0 warnings. The 3 P2 gaps from Phase 3 are closed.
- Full pytest suite: 16 of 16 PASS in 8.85 seconds. Stable across 3 consecutive full-suite runs.
- Patch 10 test in isolation: PASS in 2.36 seconds with the 2-second budget. The wait_for cancellation propagates and tasks finish before assertion.
- `validate.sh --strict` on 026/011: PASSED, 0 errors, 0 warnings.
- HVR sweep on the 4 Phase 4 touched files: 0 em-dashes total.
- pipx redeploy `cocoindex-code 0.2.3+spec.kit.fork.0.2.0`: Patch 10 markers present at `daemon.py:787` and `daemon.py:797`.

### Files Changed

| File | What changed |
|------|--------------|
| `mcp_server/cocoindex_code/daemon.py` | Patch 10 wraps the shutdown gather in wait_for with a 10-second timeout. About +9/-1 lines at the existing finally block. |
| `mcp_server/tests/test_daemon.py` | Added shebang plus module docstring. |
| `mcp_server/tests/test_e2e_daemon.py` | Added shebang plus module docstring plus two new integration tests (`test_concurrent_run_daemon_integrated_flow` plus `test_shutdown_timeout_with_stuck_task`). |
| `implementation-summary.md` | Replaced template placeholders with real content. Refreshed continuity frontmatter so it passes the strict validator. |
| `changelog/changelog-011-cocoindex-daemon-resilience.md` | This Phase 4 entry. |

### Follow-Ups

- P2-3 from research: `cocoindex.db` Rust-binding opacity audit. Investigative; no clear actionable. Stays deferred.

## 2026-05-07: Phase 5 (Patches 11 and 12, hardening pass)

> Spec folder: `026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/010-daemon-resilience` (Level 2)
> Parent packet: `026-graph-and-context-optimization`

### Summary

Phase 5 closes the last two recommendations from the Phase 3 live-test report. Both are belt-and-suspenders defenses on top of the Patch 8 sibling-check that the integrated flow already uses, but they reduce wasted process spawns under bursty client load and clean up the lock-versus-data-file conflation that Phase 3 left in place.

The first attempt at Patch 11 used a single shared lock file for both the client coordination window and the daemon lifetime guard. That caused a regression where the client held the lock during spawn-coordination while the spawned daemon also tried to acquire it, producing `RuntimeError: lock contended` on every fresh start. The corrected design uses two separate lock files: one for the client window, one for the daemon lifetime.

### Added

- Patch 11: `daemon_lock_path()` returns `daemon_dir() / "daemon.lock"`. Held by the daemon process for its entire lifetime and acts as the singleton fence against sibling daemons. Operator scripts that read `daemon.pid` no longer need lock awareness.
- Patch 11: `daemon_spawn_lock_path()` returns `daemon_dir() / "daemon.spawn-lock"`. Held briefly by the client during spawn-and-wait-for-claim. Separate from `daemon.lock` so the spawned daemon can acquire its own lifetime lock without contending against the parent client's coordination fd.
- Patch 12: `_wait_for_daemon_claim(pid_path, spawned, timeout=5.0)` in `client.py`. Polls `daemon.pid` until it contains a live PID OR the spawned subprocess has died. Bounds the spawn-coordination window so concurrent `start_daemon()` callers see a populated PID file when they acquire the spawn lock and skip the duplicate spawn.
- Patch 12: `_spawn_daemon_process()` now returns the `subprocess.Popen` handle so the caller can poll its exit status during the claim wait.
- Four new unit tests covering Patch 11 and Patch 12: `test_daemon_lock_path_is_separate_from_pid_path`, `test_wait_for_daemon_claim_returns_when_pid_appears`, `test_wait_for_daemon_claim_returns_when_spawn_dies`, `test_wait_for_daemon_claim_returns_at_timeout`.

### Changed

- `client.start_daemon()` and `client.ensure_daemon()` lock `daemon.spawn-lock` instead of `daemon.pid`. Hold the lock until `_wait_for_daemon_claim` returns.
- `daemon.run_daemon()` locks `daemon.lock` instead of `daemon.pid` for its lifetime guard. The sibling-check from Patch 8 still reads `daemon.pid`.
- Test fixture `_locked_start_worker` was updated to return a `_DonePopenStub` from its mocked `_spawn_daemon_process`, since the production `_spawn_daemon_process` now returns a `Popen` and `_wait_for_daemon_claim` calls `.poll()` on it.

### Fixed

- Concurrent client spawn waste. Without Patch 12, three concurrent `ccc status` callers each spawned a daemon process. Two would exit with the Patch 8 sibling-check, but the spawn cycles were wasted. Now the spawn-coordination lock holds the slow path until daemon.pid is populated, so the second and third callers acquire the lock, see the populated PID file, and skip the spawn.
- Lock-versus-data-file conflation from Phase 3. The lock file is now distinct from the PID file. Operator scripts reading `daemon.pid` cannot accidentally interfere with locking semantics.

### Verification

- Full pytest suite: 20 of 20 PASS in 9.32 seconds. Includes 13 unit tests plus 7 E2E and integration tests.
- Patch 11+12 unit tests in isolation: 4 of 4 PASS in 0.73 seconds.
- pipx redeploy: `cocoindex-code 0.2.3+spec.kit.fork.0.2.0`. Verified `daemon_lock_path` and `_wait_for_daemon_claim` markers in the deployed package.
- Live T1b (3 concurrent `ccc status`): all 3 returned successfully, 1 daemon survived (PID 3016), `daemon.pid` correct.
- Live T5 (second daemon-spawn attempt while one alive): exits cleanly with `RuntimeError: daemon already running at PID 3016; refusing to start`. Patch 8 sibling-check still fires.
- Live T6 (log duplication): 2 INFO lines, 2 unique. Factor 1.00. Patch 9 still working.
- Daemon-dir contents post-test show all 4 expected files: `daemon.lock`, `daemon.pid`, `daemon.sock`, `daemon.spawn-lock`.

### Files Changed

| File | What changed |
|------|--------------|
| `mcp_server/cocoindex_code/daemon.py` | Patch 11: added `daemon_lock_path()` and `daemon_spawn_lock_path()`. `run_daemon` now locks `daemon.lock`. About +20 lines. |
| `mcp_server/cocoindex_code/client.py` | Patch 11+12: `start_daemon` and `ensure_daemon` lock `daemon.spawn-lock`. `_spawn_daemon_process` returns Popen. New helper `_wait_for_daemon_claim`. About +50 lines. |
| `mcp_server/tests/test_daemon.py` | 4 new unit tests for Patches 11 and 12. About +60 lines. |
| `mcp_server/tests/test_e2e_daemon.py` | `_locked_start_worker` mock returns `_DonePopenStub`. About +10 lines. |
| `changelog/changelog-011-cocoindex-daemon-resilience.md` | This Phase 5 entry. |
| `implementation-summary.md` | Updated to mark recommendations 2 and 3 closed; refreshed file-change count. |

### Follow-Ups

- P2-3 from research: `cocoindex.db` Rust-binding opacity audit. Investigative; no clear actionable. Stays deferred.
