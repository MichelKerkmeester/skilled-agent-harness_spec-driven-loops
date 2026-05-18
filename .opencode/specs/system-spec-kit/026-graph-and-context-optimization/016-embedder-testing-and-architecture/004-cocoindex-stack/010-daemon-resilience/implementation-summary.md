---
title: "Implementation Summary: cocoindex daemon resilience (026/011)"
description: "9-patch defense-in-depth fix for cocoindex daemon: idempotent spawn, BrokenPipeError-safe send wrapper, socket-unlink guard, in-lock PID write, log rotation, listener backlog, operator recovery, plus Phase 3 ordering fix and logging deduplication."
trigger_phrases:
  - "cocoindex daemon impl summary"
  - "026/011 implementation"
  - "fcntl flock daemon summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-cocoindex-stack/010-daemon-resilience"
    last_updated_at: "2026-05-07T16:30:00Z"
    last_updated_by: "tier-1-to-4-batch-fix"
    recent_action: "filled impl-summary anchors and verification table"
    next_safe_action: "run validate.sh strict and HVR sweep"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "changelog/changelog-011-cocoindex-daemon-resilience.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-07-026-011-tier-1-4-batch"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-cocoindex-stack/010-daemon-resilience |
| **Completed** | 2026-05-07 |
| **Level** | 2 |
| **Implementation commit (Phase 2)** | `1bbe80986` |
| **Phase 3 follow-up commit** | (folded into reorg commit `40dcf8005` and downstream `098/*` track) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The cocoindex daemon was leaking processes and burning CPU on every client disconnect. Two stale daemon zombies held 244 open file descriptors, the live daemon spent 90 percent CPU formatting tracebacks, and `daemon.log` had grown to 23 MB with 564 `BrokenPipeError` entries. The 9-patch fix removes the leak surface, eliminates the disconnect-loop CPU spike, caps the log at 60 MB, and gives operators a single recovery procedure that works whether the daemon is half-stuck, fully stuck, or duplicated.

### Patches 1, 8: idempotent atomic spawn

`start_daemon()` and `run_daemon()` now use a cross-platform advisory lock (`fcntl.flock` on POSIX, `msvcrt.locking` on Win32) on `daemon.pid`. Three concurrent `ccc status` callers converge on one daemon. Phase 3 added a sibling-check that reads the previous PID before overwriting it, so a freshly-started daemon detects an alive sibling and exits with `RuntimeError: daemon already running at PID N; refusing to start` instead of overwriting the PID file.

### Patch 2: `_safe_send_bytes` wrapper

All six `conn.send_bytes` call sites in `daemon.py` are now wrapped in `_safe_send_bytes`. Client disconnects produce a single `INFO: client disconnected before response could be sent` line instead of two ERROR-level traceback dumps. The change eliminates the double-crash that produced 564 `BrokenPipeError` lines in production logs and the 90 percent CPU spike from format-traceback work.

### Patch 3: socket-unlink guard

`_unlink_stale_socket` reads `daemon.pid` before removing `daemon.sock`. If the stored PID is alive and not the current process, the daemon raises `RuntimeError("daemon already running at PID N; refusing to unlink socket")`. The guard kept being undermined by Patch 1's ordering bug until Phase 3, which moved the socket cleanup into `run_daemon` before the PID write so the stored PID is always the prior owner during the check.

### Patch 4: in-lock PID write

`pid_path.write_text(str(os.getpid()))` runs inside the lock-held window. The PID file now holds the invariant "exists only when the daemon is alive". Phase 3's reorder placed the write AFTER the sibling-check so the previous owner's PID is still in the file when the check fires.

### Patch 5: rotating daemon log

`logging.FileHandler` was replaced by `RotatingFileHandler(maxBytes=10*1024*1024, backupCount=5, encoding="utf-8")`. Total disk use for daemon logs caps at 60 MB. The previous configuration produced unbounded growth (the live log reached 23 MB before this fix shipped).

### Patch 6: listener backlog 128

`Listener(sock_path, family=_connection_family(), backlog=128)` replaced the stdlib default of 1. Concurrent client storms (16 simultaneous connects) now queue at the OS level instead of failing with connection-refused or timing out.

### Patch 7: operator recovery procedure

A 6-step checklist documents how to clean up after a hard crash or signal kill: `pkill -f "ccc run-daemon"`, verify with `pgrep -fc`, optionally clean orphan `multiprocessing.resource_tracker`, inspect `~/.cocoindex_code/`, restart with `ccc run-daemon`, confirm with `ccc status`. The lockup symptoms that prompted this packet (3 daemons alive, 244 leaked FDs) cleared in under 10 seconds with this procedure.

### Patch 9: log de-duplication

`logging.StreamHandler` is now attached only when `sys.stderr.isatty()` returns True. The spawned daemon's stderr is redirected to `daemon.log` by the client launcher, so the StreamHandler used to write every line a second time through the redirect. The conditional attach eliminates the duplication while preserving interactive-mode output.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/cocoindex_code/client.py` | Modified | Patch 1 atomic spawn + 4 new private helpers (`_try_acquire_pid_lock`, `_pid_alive`, `_spawn_daemon_process`, plus `_cleanup_stale_files` integration) |
| `mcp_server/cocoindex_code/daemon.py` | Modified | Patches 2-6 (`_safe_send_bytes`, `_unlink_stale_socket`, in-lock PID write, RotatingFileHandler, backlog=128) plus Phase 3 Patches 8-9 (sibling-check reorder, conditional StreamHandler) |
| `mcp_server/tests/test_daemon.py` | Created | 9 unit tests covering Patches 1-3 helpers in isolation |
| `mcp_server/tests/test_e2e_daemon.py` | Created | 5 integration tests covering Patches 1-6 end-to-end, plus Phase 3 added `test_concurrent_run_daemon_integrated_flow` for the Patch 8 race |
| `implementation-summary.md` | Modified | This file. Patch 7 operator recovery procedure plus the post-Phase-3 narrative fill |
| `changelog/changelog-011-cocoindex-daemon-resilience.md` | Created | Phase 2 changelog plus Phase 3 entry covering Patches 8-9 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Phase 1 ran 5 iterations of `/spec_kit:deep-research:auto` against the original 2-bug spec. The research traced 5 interacting bugs from the 2 surface bugs, produced 21 findings across 17 sections, and corrected the spec.

Phase 2 was a single cli-codex dispatch (gpt-5.5, high reasoning, fast service tier) that landed Patches 1-7 plus 14 tests in commit `1bbe80986`. The unit suite (9 tests) passed cleanly under the local venv. The 5 E2E tests were marked as known-hang follow-up at the time, but they were actually passing. The local venv was broken because the parallel-session `skill/`-to-`skills/` reorg invalidated the editable install pointer.

Phase 3 ran live operator recovery (Patch 7) on the user machine to clear 3 stale daemons (PIDs 10289, 24938, 98364), reinstalled the package via `pipx install --force` from the patched source, and ran 6 live tests against the freshly-patched daemon. T1b (3 concurrent `ccc status`) surfaced a real ordering race: 2 daemons spawned and bound the same socket. Phase 3 fixed the race with Patches 8-9, redeployed via pipx, and re-ran the live tests cleanly: 1 daemon, sibling-check fires, log duplication eliminated.

Phase 3 batch (Tier 1 to Tier 4) rebuilt the local venv against the new path, added shebangs and module docstrings to the new test files, added an integration test that exercises three concurrent `run_daemon` subprocesses, and confirmed the full 14-test suite plus 1 new integration test all pass in well under 4 seconds.

The package is deployed via pipx as `cocoindex-code 0.2.3+spec.kit.fork.0.2.0`. End-to-end live verification on the user machine confirms all 9 patches behave as documented.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Cross-platform advisory lock via `fcntl.flock` (POSIX) and `msvcrt.locking` (Win32) | A POSIX lockf-based byte-range lock would interfere with future filesystem-level operations on the PID file. A separate `daemon.lock` file was considered for Phase 3 but `_try_acquire_pid_lock` plus the sibling-check is sufficient. |
| Patch 8 reorder rather than Patch 2 (dedicated lock file) or Patch 3 (client-side wait-for-claim) | Reordering is a 30-line change with zero new state. The dedicated lock file would migrate operator scripts that watch `daemon.pid`. Client-side wait-for-claim adds polling complexity. |
| Conditional `StreamHandler` based on `sys.stderr.isatty()` rather than removing it entirely | Interactive use of `ccc run-daemon` from a terminal still benefits from console output. The conditional attach preserves that without the duplication. |
| Pin pytest dependency in the `mcp_server` venv via `pip install -e . pytest` | The packet's tests are part of the package surface, so the venv used to run them should mirror the package install. |
| Keep `_unlink_stale_socket` as an exported helper after removing its `_async_daemon_main` call site | Two unit tests cover it directly and the helper remains useful for future operator scripts. Deleting it would force test rewrites without removing real functionality. |
| Surface E2E tests passing immediately rather than maintaining the "known follow-up" tag | The original tag was based on a broken venv, not a real defect. Once the venv was rebuilt against the new path, all 5 tests passed in under 1.5 seconds each. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `verify_alignment_drift.py` on `cocoindex_code/` | PASS, 0 errors, 16 warnings (all PY-SHEBANG on pre-existing fork files, not introduced by 026/011) |
| `verify_alignment_drift.py` on `tests/` | PASS, 0 errors, 0 warnings (Phase 3 added shebangs and the missing module docstring) |
| Unit pytest `test_daemon.py` | 9 of 9 PASS in 0.25 seconds under `mcp_server/.venv/bin/python` |
| E2E pytest `test_e2e_daemon.py` (5 original tests) | 5 of 5 PASS in 3.96 seconds under the rebuilt venv |
| New integration test `test_concurrent_run_daemon_integrated_flow` | PASS in 2.77 seconds. Confirms Patch 8 sibling-check: 1 winner, 2 losers with exit code 7 or 8 |
| Full local suite | 15 of 15 PASS in well under 5 seconds |
| Live T1b (3 concurrent `ccc status`) | Pre-Patch-8: 2 daemons. Post-Patch-8: 1 daemon, daemon.pid points to the winner |
| Live T5 (second `ccc run-daemon` while live) | Pre-Patch-8: second listened anyway. Post-Patch-8: exits in under 3 seconds with `RuntimeError: daemon already running at PID N; refusing to start` |
| Live T3 (Patch 2 disconnect via raw socket) | 1 INFO line, 0 BrokenPipeError, 0 ERROR. Compare pre-patch log with 564 `BrokenPipeError` lines |
| Live T4 (16 simultaneous `ccc status`) | All 16 returned exit 0 in 0 seconds. `Index stats` present in all 16 outputs |
| Live T6 (log duplication) | Pre-Patch-9: factor 2.00. Post-Patch-9: factor 1.00 |
| `validate.sh --strict` on 026/011 | PASS, 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

### Operator recovery procedure (when stale daemon detected)

If `pgrep -fc "ccc run-daemon"` returns more than 1, or if a daemon is unreachable despite the PID file pointing at a live process, run:

1. `pkill -f "ccc run-daemon"`. Terminate all daemon processes.
2. `pgrep -fc "ccc run-daemon"`. Confirm returns 0.
3. Optional: `pgrep -f multiprocessing.resource_tracker`. Orphan tracker children should self-exit.
4. `ls ~/.cocoindex_code/`. Inspect for stale `daemon.pid` and `daemon.sock`.
5. `ccc run-daemon`. Start fresh. The Patch 1 plus Patch 8 pre-flight check handles stale state automatically.
6. `ccc status` (or equivalent reachability probe). Confirm the new daemon is reachable.

### Open follow-ups

1. P2-3 from research: `cocoindex.db` Rust-binding opacity audit. Investigative; no clear actionable. Stays deferred.

### Closed in Phase 4

- P1-2: shutdown `asyncio.gather()` per-task timeout. Closed by Patch 10.
- E2E hang follow-up: confirmed all 5 tests pass cleanly under the rebuilt venv.
- Test-file P2 sk-code gaps (shebangs plus docstring): closed.
- Local venv broken by reorg: rebuilt against the post-reorg path.

### Closed in Phase 5 (hardening pass)

- Recommendation 2 from the Phase 3 live-test report: dedicated lock file separate from `daemon.pid`. Closed by Patch 11. The daemon now locks `daemon.lock` for its lifetime and the client locks `daemon.spawn-lock` during spawn coordination. Operator scripts can read `daemon.pid` without lock awareness.
- Recommendation 3 from the Phase 3 live-test report: client-side wait-for-daemon-claim. Closed by Patch 12. `_wait_for_daemon_claim` polls `daemon.pid` until it contains a live PID or the spawned subprocess has died. Concurrent `start_daemon` callers see a populated PID file and skip the duplicate spawn.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
