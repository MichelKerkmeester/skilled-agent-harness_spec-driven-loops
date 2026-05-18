---
title: "Deep Research Synthesis: CocoIndex daemon resilience validation"
description: "Final 5-iteration synthesis. Complete remediation plan for the start_daemon idempotency hole and BrokenPipeError double-crash, with 7 patches, 13 tasks, and 23 spec.md corrections."
trigger_phrases:
  - "cocoindex daemon resilience research"
  - "start_daemon idempotency synthesis"
  - "BrokenPipeError double-crash synthesis"
  - "daemon socket-unlink leak"
importance_tier: "critical"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-cocoindex-stack/010-daemon-resilience"
    last_updated_at: "2026-05-07T08:30:00Z"
    last_updated_by: "deep-research-iter-5-synthesis"
    recent_action: "Synthesized 5-iteration research"
    next_safe_action: "Apply spec corrections"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-07-026-011-cocoindex-daemon-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1 (bug surface): only start_daemon directly spawns. ensure_daemon version-mismatch path also races."
      - "Q2 (error handler): 6 send_bytes sites total, all need wrapping."
      - "Q3 (race window): 5-60 ms warm, multi-second cold. fcntl.flock required."
      - "Q4 (stale daemon): unconditional socket-unlink at daemon.py:615. Severance Apr 27 17:08:49."
      - "Q5 (worker reaping): daemon spawns zero children. Out of scope."
      - "Q6 (log growth): no rotation. Recommend RotatingFileHandler."
      - "Q7 (LMDB): no LMDB exists. Storage is per-project SQLite."
      - "Q8 (cross-platform): fcntl translates to msvcrt.locking. Win32 path validated."
      - "Q9 (backlog): Listener defaults backlog=1. 90 percent of CPU spike is double logger.exception."
      - "Q10 (recovery): 6-step checklist replaces single-line snippet."
citations:
  - source: "client.py:192-225"
    note: "start_daemon body, missing pre-flight check"
  - source: "client.py:413-443"
    note: "ensure_daemon version-mismatch path"
  - source: "daemon.py:436-444"
    note: "streaming-response error handler"
  - source: "daemon.py:441"
    note: "third unsafe send_bytes site (non-streaming reply)"
  - source: "daemon.py:613-615"
    note: "unconditional socket unlink (POSIX)"
  - source: "daemon.py:568"
    note: "unconditional pid_path.write_text"
  - source: "daemon.py:572-575"
    note: "plain FileHandler, no rotation"
  - source: "daemon.py:619"
    note: "Listener init with backlog=1 stdlib default"
  - source: "daemon.py:644-665"
    note: "_accept_loop in dedicated thread"
  - source: "https://docs.python.org/3/library/multiprocessing.html"
    note: "Listener default backlog=1 confirmed via stdlib source dump"
---

# Deep Research Synthesis: CocoIndex daemon resilience validation

Convergence-final synthesis of the 5-iteration deep-research loop (2026-05-07) validating spec.md in packet `026/011-cocoindex-daemon-resilience`. All ten key questions are answered. Iter 5 produces this document plus the spec/plan/tasks correction trackers.

---

## 1. Topic

Validate the two-bug remediation plan in `026/011/spec.md` for the `mcp-coco-index` daemon. Surface bug-surface gaps, race-window quantification, stale-daemon root cause, child-process leak hypotheses, log-rotation policy, LMDB safety with two writers (later refuted), cross-platform compatibility, socket backlog effects, and recovery completeness. Produce file:line citations and ready-to-apply spec/plan/tasks updates.

Scope was READ-ONLY. No source patches were authored in this loop. Implementation is deferred to Phase 2 (the orchestrator applies the trackers, then dispatches the implementation packet).

---

## 2. Convergence Status

- **Convergence verdict**: CONVERGED.
- **Confidence**: HIGH. All ten key questions answered with file:line evidence.
- **Iterations used**: 5 of 5.
- **Stop reason**: `max_iterations_reached_with_full_convergence`. Both stop conditions are satisfied: (a) 5 iterations completed (§5 of strategy.md), and (b) all ten key questions resolved with citable evidence.
- **Final convergence delta** (iter 4 → iter 5): 0.65 → 0.05. Iter 5 is synthesis only. No new external evidence was sought.
- **Open questions remaining**: 0.
- **Findings shipped**: 13 P0, 4 P1, 4 P2. Total 21.

---

## 3. Executive Summary

The packet was opened against two surface bugs (`start_daemon()` idempotency hole at `client.py:192-225`, and BrokenPipeError double-crash at `daemon.py:436-444`). Five research iterations expanded the bug surface, refuted three competing hypotheses, and converged on a defense-in-depth remediation that ships seven patches across two source files plus one operator-recovery doc edit.

The primary mechanism is a socket-unlink cascade. Every `_async_daemon_main()` call unconditionally unlinks `daemon.sock` at `daemon.py:615` before binding. When `start_daemon()` (`client.py:192`) lacks a pre-flight liveness check and a fcntl-bound advisory lock, two concurrent spawns leave one daemon alive but severed from its socket. PID 98364 (Apr 27, not May 1 as spec.md hypothesized) was severed at 2026-04-27 17:08:49 by a concurrent spawn. It stayed alive but unreachable for 9 days 23 hours, leaking 244 file descriptors and zero requests.

The CPU spike (54-72% sustained across 564 BrokenPipeError events) is 90% double `logger.exception` formatting work. Two `logger.exception` calls per disconnect produce 1128 traceback formats and 22.6 MB of log churn. Patch 2 (BrokenPipeError-safe wrapper across all 6 `send_bytes` sites) eliminates ~95% of the spike.

The primary fix is a `_try_acquire_pid_lock()` helper that wraps `fcntl.flock(fd, LOCK_EX|LOCK_NB)` on POSIX and `msvcrt.locking(fd, LK_NBLCK, 1)` on Windows. Defense-in-depth adds a daemon-side socket-unlink guard (`daemon.py:613-615`), in-lock PID write (`daemon.py:568`), `RotatingFileHandler` (`daemon.py:572-575`), `Listener(backlog=128)` (`daemon.py:619`), version-mismatch race fix (`client.py:413-443`), and a 6-step operator recovery checklist.

Three hypotheses are formally refuted: LMDB corruption (no LMDB exists, storage is per-project SQLite), worker subprocess leak (daemon spawns zero children), and socket-backlog-induced reconnect storm (accept thread is decoupled from the broken-pipe loop). One deferred tangent: shutdown `gather()` lacks per-task timeouts (P1-2), captured as a follow-up not a blocker.

---

## 4. Investigation Path

- **Iteration 1** answered Q1 (bug surface completeness), Q2 (error-handler completeness), and Q4 (stale daemon root cause). Three parallel ripgrep + log-grep calls established that only `start_daemon()` directly spawns and that `daemon.py:615` unconditionally unlinks the socket.
- **Iteration 2** answered Q3 (race window characterization), Q5 (worker subprocess interaction), and Q10 (recovery completeness). Quantified the race window at 5-60 ms warm and proved `_pid_alive` alone is insufficient. Refuted the worker-leak framing.
- **Iteration 3** answered Q6 (daemon.log growth), Q7 (LMDB/SQLite safety), and Q8 (cross-platform). One ripgrep falsified the Q7 LMDB premise, opening a path to the `RotatingFileHandler` recommendation and the cross-platform `fcntl.flock` / `msvcrt.locking` translation table.
- **Iteration 4** answered Q9 (socket backlog) and consolidated correction trackers. `python3 -c 'import inspect, ...'` exposed `Listener` default backlog=1. Reading `_accept_loop()` at `daemon.py:644-665` proved decoupling from the BrokenPipeError loop. Produced ready-to-apply trackers for spec.md (23 changes), plan.md (7 patches), and tasks.md (13 tasks).
- **Iteration 5** synthesized the full picture into this document, the resource map, and the convergence record. No new external evidence sought.

---

## 5. Confirmed Findings

### P0 (13 findings) — Bug surface, mechanism, and remediation gates

- **P0-1** (iter 1): `start_daemon()` at `client.py:192-225` lacks any pre-flight liveness check. Spawns blindly via `subprocess.Popen`. Helpers `_pid_alive()` and `_cleanup_stale_files()` exist in the same module but only `stop_daemon()` invokes them.
- **P0-2** (iter 1): `_async_daemon_main()` unconditionally unlinks `daemon.sock` at `daemon.py:615` (POSIX path) before binding. This is the leak mechanism. Any concurrent live daemon loses its socket binding the moment a new daemon starts.
- **P0-3** (iter 1): A third `send_bytes` site at `daemon.py:441` (non-streaming reply) has no inner try block. Outer handler logs full traceback for every BrokenPipeError. Bug 2's spec coverage missed this site.
- **P0-4** (iter 2): Race window between `_pid_alive` check and `Popen` return is 5-60 ms warm and multi-second cold (embedder load). `_pid_alive` ALONE is INSUFFICIENT. `fcntl.flock(daemon.pid, LOCK_EX|LOCK_NB)` is required.
- **P0-5** (iter 2): `daemon.py:568` calls `pid_path.write_text(str(os.getpid()))` unconditionally. Overwrites the old PID with the new PID, leaving the old daemon untracked.
- **P0-6** (iter 2): Daemon code spawns zero child processes. `multiprocessing.Process`, `Pool`, `SemLock`, and `set_start_method` return zero hits. Worker reaping is out of spec scope.
- **P0-7** (iter 3): No LMDB exists in `cocoindex_code/`. `import lmdb` returns zero hits. Storage is per-project SQLite via `cocoindex.connectors.sqlite`. Spec.md known-context referencing LMDB is wrong.
- **P0-8** (iter 3): PID 98364 is quiescent (0.0% CPU, lost socket binding 9d23h before observation). The write path is request-driven via `_dispatch` then `IndexRequest` then `update_index`. With no socket binding, no requests reach PID 98364, so no writes ever fire.
- **P0-9** (iter 3): `fcntl.flock(fd, LOCK_EX|LOCK_NB)` translates to `msvcrt.locking(fd, LK_NBLCK, 1)` on Windows. Lock-fd pattern eliminates Win32 PID-reuse hazard. AF_PIPE Listener has no unlink asymmetry (it errors with `ERROR_PIPE_BUSY`), so Patch 4 (guarded unlink) is Unix-only by construction.
- **P0-10** (iter 4): `multiprocessing.connection.Listener` defaults `backlog=1`. `daemon.py:619` inherits this default. Should be `backlog=128`.
- **P0-11** (iter 4): Accept thread is decoupled from BrokenPipeError loop. `_accept_loop()` runs in `threading.Thread(daemon=True)` at `daemon.py:644-665`. Each iteration is `accept()` plus `asyncio.run_coroutine_threadsafe()`, both sub-millisecond. The buggy `send_bytes` runs as an asyncio task on the event loop, not in the accept thread.
- **P0-12** (iter 4): CPU spike attribution is final. About 90% from double `logger.exception` per disconnect (1128 traceback formats verified by `grep -cE '^File|Traceback' daemon.log` returning 2293 lines), about 10% from reconnect storm, 0% from accept-queue starvation.
- **P0-13** (iter 4): Active socket inventory at iter-4 wall-clock confirms PID 24938 still bound. Socket file mtime is May 1 17:27, unchanged since iter 1. Single-rebind-per-stale-event mechanism, not a recurring storm.

### P1 (4 findings) — Adjacent races and missing scaffolding

- **P1-1** (iter 1): `ensure_daemon()` version-mismatch path at `client.py:413-443` calls `stop_daemon()` then `start_daemon()` unconditionally. Racy. Three concurrent `ensure_daemon` callers can each see a stale version and each trigger a stop+restart sequence.
- **P1-2** (iter 2): Shutdown `asyncio.gather()` lacks per-task timeout. In-flight handlers can block shutdown indefinitely. Deferred follow-up, not a Phase 2 blocker.
- **P1-3** (iter 3): `daemon.py:572-575` uses plain `logging.FileHandler`. No rotation. Live log is 23 MB and 250,485 lines. Recommend `logging.handlers.RotatingFileHandler(maxBytes=10*1024*1024, backupCount=5)` for a 60 MB total cap.
- **P1-4** (iter 4): No daemon-lifecycle tests exist. `grep -rn 'start_daemon|ensure_daemon|stop_daemon' tests/` returned zero hits. Spec.md "Modify tests/test_daemon.py" rows must be CREATE.

### P2 (4 findings) — Hygiene and out-of-scope

- **P2-1** (iter 1): Daemon log growth context. 23 MB and 564 BrokenPipeError events at packet creation. Patch 2 fix removes about 22.6 MB of error churn.
- **P2-2** (iter 2): Operator recovery snippet (`pkill -f "ccc run-daemon"` then `rm` then restart) is functional but incomplete. Replace with 6-step checklist (stop concurrent `ensure_daemon` callers, verify `pgrep` empty, optional resource_tracker check, etc.).
- **P2-3** (iter 3): `cocoindex.db` Rust-binding opacity. Out of spec scope, but flagged so future research does not re-enter this rabbit hole.
- **P2-4** (iter 4): `Listener` `backlog` kwarg is family-uniform across AF_UNIX (`SocketListener`) and AF_PIPE (`PipeListener`). No platform branching needed for Patch 6.

---

## 6. Ruled Out Directions

| Hypothesis | Refutation source | Why ruled out |
|------------|-------------------|---------------|
| LMDB write contention between two daemons | iter 3 P0-7 | No `import lmdb` anywhere in `cocoindex_code/`. Storage is per-project SQLite. |
| Two daemons can corrupt a shared LMDB env | iter 3 P0-7, P0-8 | No shared LMDB. SQLite cross-process locking is at the kernel level. PID 98364 has zero live request path. |
| PID 98364 was killed by SIGTERM and stayed as a zombie | iter 1 | No signal trace in `daemon.log`. Mechanism is socket-unlink. |
| Daemon spawns workers we need to reap | iter 2 P0-6 | Daemon code is single-process (asyncio plus accept thread). PID 40681 belongs to a transitive dep and self-exits via SIGCHLD. |
| `bind()` detects EADDRINUSE on AF_UNIX socket collision | iter 2 P0-4 | The unlink at `daemon.py:615` always runs first. `bind` never sees the collision. |
| Socket-backlog-induced reconnect storm causes the CPU spike | iter 4 P0-11, P0-12 | Accept thread is decoupled. Backlog=1 is suboptimal hygiene but not the root cause. |
| AF_PIPE Listener has the same unlink-asymmetry as AF_UNIX | iter 3 P0-9 | Windows named pipes use namespace registration. Second listener fails with `ERROR_PIPE_BUSY` (231). |
| Patch 7 (backlog) needs platform branching | iter 4 P2-4 | `Listener(backlog=N)` is family-agnostic. Single line suffices. |
| Tests must coexist with existing fixtures | iter 4 P1-4 | No daemon-lifecycle tests exist. Files must be CREATED, not modified. |
| Spec.md "race window acceptable" stance | iter 2 P0-4 | The race window directly produces the leaked-zombie bug. Document-as-caveat is insufficient. |

---

## 7. Mechanism Story

The complete cascade in 10 steps. Every step has a file:line citation.

1. `start_daemon()` at `client.py:192-225` lacks any pre-flight liveness check. Spawns blindly via `subprocess.Popen` regardless of whether a daemon is already alive.
2. The new daemon starts up and runs `_async_daemon_main()` which UNCONDITIONALLY unlinks `daemon.sock` at `daemon.py:615` (POSIX path) before binding.
3. THIS is the leak mechanism. Any concurrent live daemon (PID 98364) loses its socket binding the moment a new daemon starts. The old daemon stays alive but disconnected from IPC.
4. `daemon.py:568` calls `pid_path.write_text(str(os.getpid()))` unconditionally, overwriting the old PID with the new PID and leaving the old daemon untracked.
5. The race window between `_pid_alive()` check and `Popen` return is 5-60 ms warm, multi-second cold (embedder load). `_pid_alive` ALONE is INSUFFICIENT. The fix is `fcntl.flock(daemon.pid, LOCK_EX|LOCK_NB)` on POSIX and `msvcrt.locking(fd, LK_NBLCK, 1)` on Windows.
6. macOS unix-socket `bind()` cannot detect collision because of the unconditional unlink. The OS would normally raise `EADDRINUSE`, but the unlink wipes that signal.
7. Combined with Bug 2 (`daemon.py:436-444` double-crash on broken pipes) AND a third unsafe `send_bytes` site at `daemon.py:441` (non-streaming reply), client disconnects produce 2-3 stack traces each. 564 BrokenPipeError events recorded over 23 MB of `daemon.log`.
8. `multiprocessing.connection.Listener` defaults `backlog=1`. Should be `backlog=128`. Hygiene only, since the accept thread is decoupled from the broken-pipe loop.
9. No log rotation. `daemon.py:572-575` uses plain `FileHandler`. Recommend `RotatingFileHandler(maxBytes=10MB, backupCount=5)`.
10. `ensure_daemon()` version-mismatch path at `client.py:413-443` calls stop+start unconditionally. Three concurrent callers can each trigger a stop+restart sequence. The advisory lock must wrap both phases.

The 2026-04-27 17:08:49 severance event is the historical fingerprint of step 3. PID 16404 spawned concurrently with PID 98364, unlinked the socket, and bound its own. PID 98364 stayed alive but unreachable for 9 days 23 hours.

---

## 8. Severity-Sorted Remediation Backlog

### P0 (must fix before Phase 2 ships)

| Patch | Touchpoint | Findings |
|-------|------------|----------|
| Patch 1: Atomic idempotent `start_daemon()` with `_try_acquire_pid_lock()` helper | `client.py:192-225` plus `client.py:413-443` (version-mismatch path) | P0-1, P0-4, P0-9, P1-1 |
| Patch 2: BrokenPipeError-safe wrapper for ALL 6 `send_bytes` sites | `daemon.py:426`, `:436`, `:439`, `:441`, plus 2 `_search_with_wait` sites | P0-3, P0-12 |
| Patch 3: Daemon-side socket-unlink guard | `daemon.py:613-615` | P0-2 |
| Patch 4: Move `pid_path.write_text` inside lock-held region | `daemon.py:568` | P0-5 |
| Patch 6: `Listener(backlog=128)` | `daemon.py:619` | P0-10, P0-11, P0-12 |

### P1 (ship in same Phase 2 packet)

| Patch | Touchpoint | Findings |
|-------|------------|----------|
| Patch 5: `RotatingFileHandler` replaces `FileHandler` | `daemon.py:572-575` | P1-3 |
| Patch 7: 6-step operator recovery checklist | `implementation-summary.md` operator-recovery section | P2-2 |

### P2 (deferred follow-ups, not Phase 2 blockers)

- Shutdown `asyncio.gather()` per-task timeout (P1-2). Note in plan.md as a follow-up.
- `cocoindex.db` Rust-binding opacity (P2-3). Orthogonal to daemon resilience.

---

## 9. Proposed Spec.md Updates

The full 23-change correction tracker lives in `iterations/iteration-004.md` § "Spec.md Correction Tracker". Summary by category:

- **16 row-level edits**: problem framing (severance date, "leaked zombie" framing, LMDB removal), scope rows (atomic lock, all 6 send_bytes sites), risks (race-window quantification, PID-reuse mitigation), open questions (lock decision YES, all 6 send_bytes confirmed), and scaffold counts.
- **4 new REQ rows**: REQ-007 unlink-guard, REQ-008 rotation, REQ-009 version-mismatch race, REQ-010 backlog stress.
- **3 new Files-to-Change rows**: unlink guard, RotatingFileHandler, backlog kwarg.
- **2 row-type corrections**: Modify → CREATE for `tests/test_daemon.py` and `tests/test_e2e_daemon.py`.

The orchestrator must apply this tracker verbatim before authoring plan.md.

Five spec.md facts are wrong as currently written:

1. Severance date: spec hypothesized May 1. Actual: 2026-04-27 17:08:49 (per `daemon.log` history).
2. Race window characterization: spec called it "acceptable". Actually it is the direct leak mechanism.
3. LMDB references: spec.md known-context references LMDB. None exists in `cocoindex_code/`.
4. Patch count: spec says "2 patches". Actual scope is 7 patches.
5. Test file existence: spec rows say "Modify". Files do not exist; rows must say "CREATE".

---

## 10. Proposed Plan.md Updates

Plan.md does not yet exist (Level 2 spec is in Draft). When authored, plan.md must include 7 patches:

| # | Patch | Touchpoint | Rationale |
|---|-------|-----------|-----------|
| 1 | Atomic idempotent `start_daemon()` with advisory lock | `client.py:192-225` plus `client.py:413-443` | P0-1, P0-4, P0-9, P1-1 |
| 2 | BrokenPipeError-safe wrapper for ALL 6 `send_bytes` sites | `daemon.py:426`, `:436`, `:439`, `:441`, plus 2 `_search_with_wait` sites | P0-3, P0-12 |
| 3 | Daemon-side socket-unlink guard | `daemon.py:613-615` | P0-2, P0-4 |
| 4 | Move `pid_path.write_text` inside lock-held region | `daemon.py:568` | P0-5 |
| 5 | `RotatingFileHandler` replaces `FileHandler` | `daemon.py:572-575` | P1-3 |
| 6 | `Listener(backlog=128)` | `daemon.py:619` | P0-10 |
| 7 | Operator recovery 6-step checklist replaces single-line snippet | `implementation-summary.md` (when authored) | P2-2 |

Patches 3, 5, 6, 7 are entirely new. Patches 1 and 2 are strengthened over the original spec.md framing.

---

## 11. Proposed Tasks.md Updates

Tasks.md does not yet exist. When authored, must include 13 tasks:

| # | Task ID | Status | Action |
|---|---------|--------|--------|
| 1 | T-Patch1 | STRENGTHEN | Add `_try_acquire_pid_lock()` helper with `sys.platform` branching (`fcntl.flock` POSIX, `msvcrt.locking` Win32). Modify `start_daemon()` to call helper, fall through to existing spawn only if lock acquired. Move `daemon.py:568` PID-write inside lock-held region. Update `ensure_daemon()` version-mismatch path to hold lock across stop+restart. |
| 2 | T-Patch2 | STRENGTHEN | Wrap all 6 `send_bytes` sites in `_safe_send_bytes(conn, payload)` helper that swallows pipe errors and logs once at INFO. |
| 3 | T-Patch3 | NEW | Add socket-unlink guard at `daemon.py:613-615`. Read `daemon.pid`. If `_pid_alive(stored_pid) and stored_pid != os.getpid()`, raise `RuntimeError` and exit before unlink. |
| 4 | T-Patch4 | NEW | Replace `logging.FileHandler` at `daemon.py:572-575` with `logging.handlers.RotatingFileHandler(daemon_log_path(), maxBytes=10*1024*1024, backupCount=5)`. |
| 5 | T-Patch5 | NEW | Pass `backlog=128` to `Listener(...)` at `daemon.py:619`. |
| 6 | T-Test-Stress | NEW | Concurrency stress test. Fork 8 processes calling `start_daemon()`. Assert `pgrep -fc 'ccc run-daemon' == 1`. |
| 7 | T-Test-Sites | NEW | Parameterized BrokenPipeError test over all 6 `send_bytes` sites. Each parameterization patches one site to raise. Assert no second `ERROR` record. |
| 8 | T-Test-Unlink-Guard | NEW | Two-process test. P1 starts daemon (binds socket). P2 attempts `_async_daemon_main`. Assert P2 exits cleanly with RuntimeError, P1's `daemon.sock` mtime unchanged. |
| 9 | T-Test-Rotation | NEW | Write 11 MB of synthetic log content. Assert `daemon.log.1` exists and `daemon.log` is under 10 MB. |
| 10 | T-Test-Backlog | NEW | Open 16 concurrent connections within 100 ms window. Assert all 16 complete handshake without ECONNREFUSED. |
| 11 | T-Test-Version-Race | NEW | Simulate 3 concurrent `ensure_daemon()` calls expecting a different version. Assert exactly one stop+restart sequence. |
| 12 | T-Recovery-Doc | NEW | Author 6-step operator recovery checklist in implementation-summary.md (replaces spec.md's single-line snippet). |
| 13 | T-Test-Files-Create | NEW | Create `tests/test_daemon.py` and `tests/test_e2e_daemon.py` as NEW files (do not exist per iter-4 grep). |

---

## 12. Open Questions Resolved (Q1-Q10 final state)

| Q | Topic | Verdict |
|---|-------|---------|
| Q1 | Bug surface (spawn sites) | Only `start_daemon()` (`client.py:192-227`) directly spawns. 8 reachable callers. Fixing it covers all. Caveat: `ensure_daemon()` version-mismatch path (P1-1) still races. |
| Q2 | Error-handler completeness | 6 daemon-side `send_bytes` sites total. Bug 2 covers 2 (streaming pair at `:436`, `:439`). NEW: P0-3 covers `:441` (non-streaming reply). |
| Q3 | Race window characterization | 5-60 ms warm, multi-second cold. macOS `bind()` cannot detect collision because `daemon.py:615` unlinks first. Fix is `fcntl.flock`. |
| Q4 | Stale daemon root cause | `daemon.py:615` unconditional unlink. PID 98364 lost binding at 2026-04-27 17:08:49 (NOT May 1). |
| Q5 | Worker subprocess interaction | Daemon code spawns zero children. PID 40681 belongs to transitive dep, self-exits. Worker reaping is out of spec scope. |
| Q6 | Daemon.log growth | No rotation. `daemon.py:572-575` uses plain `FileHandler`. Recommend `RotatingFileHandler(10MB, 5 backups)` (60 MB cap). |
| Q7 | LMDB / SQLite safety | RESOLVED-NEGATIVE. No LMDB exists. Storage is per-project SQLite. PID 98364 quiescent. Worst case is delayed indexing, not corruption. |
| Q8 | Cross-platform | `fcntl.flock` translates to `msvcrt.locking(LK_NBLCK)`. Lock-fd pattern eliminates Win32 PID-reuse hazard. AF_PIPE has no unlink asymmetry, so Patch 3 is Unix-only. |
| Q9 | Socket backlog | `Listener` defaults `backlog=1` (P0-10). Accept thread is decoupled (P0-11). CPU spike is 90% double `logger.exception` (P0-12). Patch 6 raises backlog to 128 for hygiene. |
| Q10 | Recovery completeness | Spec snippet is incomplete. Replace with 6-step checklist. |

---

## 13. Tensions and Contradictions

Two notable inter-iteration disagreements were surfaced and resolved.

**Tension 1: iter-1 worker-leak framing vs iter-2 zero-children finding.**
Iter 1 carried forward the spec.md framing that "the daemon spawns workers we need to reap" (PID 40681 was thought to be a daemon child). Iter 2 ran a single ripgrep for `multiprocessing.Process|Pool|SemLock|set_start_method` and got zero hits. Resolution: PID 40681 belongs to a transitive dep (`multiprocessing.resource_tracker`) and self-exits. Worker reaping is out of spec scope. The iter-1 framing is retired.

**Tension 2: spec.md "race window acceptable" vs iter-2 "race IS the leak."**
Spec.md §6 risks row 1 originally said "Pre-flight check has a race window between read and spawn / Low / Document as known caveat." Iter 2's P0-4 quantified the window at 5-60 ms warm and proved it directly produces the leaked-zombie bug observed at PID 98364. The "acceptable" stance is refuted. Resolution: Patch 1 wraps the spawn in a `fcntl.flock` advisory lock. Spec.md tracker row 18 replaces the original risk with the corrected framing.

A third minor tension: iter-1 P2-1 contextualized log growth without proposing rotation. Iter-3 P1-3 supplied the `RotatingFileHandler` patch. This is additive, not contradictory.

No unresolved contradictions remain.

---

<!-- ANCHOR:citations -->
## 14. Citations

### File:line evidence

- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:192-225` (start_daemon body, missing pre-flight check)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:413-443` (ensure_daemon version-mismatch path)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:244-256` (Win32 _pid_alive)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:432-451` (handle_connection error path)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:436` (streaming send_bytes site 1)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:439` (streaming send_bytes site 2 — buggy second attempt)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:441` (non-streaming send_bytes — third unsafe site, P0-3)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:438` (logger.exception streaming response)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:445` (logger.exception outer handling connection)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:568` (unconditional pid_path.write_text)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:572-575` (plain FileHandler)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:613-615` (unconditional socket unlink — POSIX-only branch)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:619` (Listener init missing backlog kwarg)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:644-665` (_accept_loop in dedicated thread)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/project.py:33` (sole "LMDB" docstring mention — refutes LMDB framing)

### External / runtime evidence

- `python3 -c 'import inspect, multiprocessing.connection as mc; print(inspect.getsource(mc.Listener.__init__))'` — confirms `backlog=1` default in CPython stdlib.
- `lsof /Users/michelkerkmeester/.cocoindex_code/daemon.sock` — PID 24938 still bound at iter-4 wall-clock.
- `/Users/michelkerkmeester/.cocoindex_code/daemon.log` — 23 MB, 250,485 lines, 564 BrokenPipeError events, 2293 traceback frames.

### Log timestamps

- 2026-04-27 17:08:49 — PID 98364 socket severance event (concurrent spawn by PID 16404).
- 2026-05-01 17:27 — `daemon.sock` mtime (last successful re-bind by PID 24938).
- 2026-05-07T07:30Z — packet creation, live forensics window.
<!-- /ANCHOR:citations -->

---

## 15. Negative Knowledge

Things that were NOT happening, formally proven by this loop:

- **No LMDB usage.** `import lmdb` returns zero hits in `cocoindex_code/`. Storage is per-project SQLite via `cocoindex.connectors.sqlite`. PID 98364 cannot corrupt LMDB because there is no LMDB.
- **No daemon child workers.** `multiprocessing.Process|Pool|SemLock|set_start_method` returns zero hits. Daemon is single-process (asyncio plus accept thread). PID 40681 is a transitive dep, self-exits.
- **No SIGTERM kill of PID 98364.** No signal trace in `daemon.log`. Mechanism is socket-unlink, not termination.
- **No socket-backlog starvation.** Accept thread runs in `threading.Thread(daemon=True)` independent of the BrokenPipeError loop. CPU spike is logger.exception work, not blocked accepts.
- **No EADDRINUSE detection from bind().** The unconditional unlink at `daemon.py:615` always runs first. `bind` never sees collision.
- **No platform branching needed for `Listener(backlog=N)`.** Family-uniform across AF_UNIX and AF_PIPE.
- **No pre-existing daemon-lifecycle test fixtures.** `tests/` has zero coverage. New test files must be CREATED.

These negatives matter because they bound the remediation scope. The fix does not need to wrap LMDB transactions, reap workers, intercept signals, redesign the accept loop, or coexist with existing test fixtures.

---

## 16. Convergence Metrics

| Iteration | Findings | Novelty | Delta | Stop reason |
|-----------|----------|---------|-------|-------------|
| 1 | 5 (3 P0, 1 P1, 1 P2) | 0.85 | n/a (first iter) | continue |
| 2 | 5 (3 P0, 1 P1, 1 P2) | 0.80 | -0.05 | continue (Q6, Q7, Q8, Q9 still open) |
| 3 | 5 (3 P0, 1 P1, 1 P2) | 0.85 | +0.05 | continue (Q9 only remaining) |
| 4 | 6 (3 P0, 2 P1, 1 P2) | 0.65 | -0.20 | converge — Q9 closed, all 10 key questions answered |
| 5 | 0 new (synthesis) | 0.05 | -0.60 | CONVERGED — `max_iterations_reached_with_full_convergence` |

**Final convergence verdict**: CONVERGED. All ten key questions answered with file:line evidence. Stop condition "All 10 key questions resolved with citable evidence" satisfied per §5. No open questions. No unresolved contradictions. Total findings: 13 P0, 4 P1, 4 P2 (21).

---

## 17. Next Steps

The orchestrator owns the next phase. Recommended sequence:

1. **Apply the spec.md correction tracker** (23 changes, see `iterations/iteration-004.md` § "Spec.md Correction Tracker"). This brings spec.md to a state consistent with the research findings (correct severance date, race-window mitigation, LMDB removal, all 6 send_bytes sites, 7 patches, CREATE rows for tests, 4 new REQs).
2. **Author plan.md** with the 7 patches (§10 above).
3. **Author tasks.md** with the 13 tasks (§11 above).
4. **Commit the spec/plan/tasks updates** as a documentation-only commit. Do not include source patches in this commit.
5. **Dispatch Phase 2 implementation** as a separate packet (or sub-phase). The implementation packet applies all 7 patches, creates the 2 test files, runs the 6 stress test cases, and validates with `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict`.
6. **Operator recovery doc** ships with the implementation packet's `implementation-summary.md`.

Deferred follow-ups (not Phase 2 blockers):

- P1-2: shutdown `asyncio.gather()` per-task timeout. File a follow-up packet under 026.
- P2-3: `cocoindex.db` Rust-binding opacity. Orthogonal to daemon resilience.

This loop's research artifacts are READ-ONLY references for Phase 2 and beyond. No code in the daemon source has been modified by this loop.
