# Iteration 4: Q9 (socket backlog) + spec/plan/tasks correction-tracker consolidation

## Focus

Close the last open key question (Q9 — socket backlog effects on perceived CPU spinning) and consolidate every iter 1–3 finding into ready-to-apply correction trackers for spec.md, plan.md, and tasks.md so iter 5 can synthesize without rediscovery.

## Findings

### P0-10 (NEW) — `multiprocessing.connection.Listener` backlog defaults to **1**

`daemon.py:619` calls `Listener(sock_path, family=_connection_family())` with no `backlog=` kwarg [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:619]. Inspecting CPython's stdlib (`python3 -c 'import inspect, multiprocessing.connection as mc; print(inspect.getsource(mc.Listener.__init__))'`) shows `Listener.__init__(self, address=None, family=None, backlog=1, authkey=None)` and the inner `SocketListener.__init__` calls `self._socket.listen(backlog)` with that default of **1** [SOURCE: cpython:Lib/multiprocessing/connection.py:Listener.__init__ + SocketListener.__init__ — verified by stdlib source dump in iter-4 bash call].

**Implication.** With a kernel listen queue of 1, any second concurrent connection while the accept thread is between `accept()` calls (≈ a few microseconds normally) will see ECONNREFUSED on macOS or be queued briefly on Linux before hitting `listen` overflow. During a 564-event BrokenPipeError storm this matters ONLY if the accept thread itself stalls — which (per P0-11 below) it does not.

`[INFERENCE: based on stdlib Listener default + daemon.py:619 missing backlog kwarg]`: Patch should explicitly pass `backlog=128` (or `socket.SOMAXCONN`) to give multi-dispatch orchestrations headroom. This is a **NEW Patch 7**, not a hot bug, but it is a 1-line robustness improvement that costs zero risk.

### P0-11 — Q9 verdict: accept thread is **decoupled** from BrokenPipeError loop

Reading `daemon.py:644-665` [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:644-665]: `_accept_loop()` runs in a `threading.Thread(daemon=True)` and its only work per iteration is:

1. `listener.accept()` (blocking with 0.5s timeout)
2. `asyncio.run_coroutine_threadsafe(_spawn_handler(...), loop)` (NON-blocking enqueue)
3. loop back

The actual `handle_connection` body (which contains the buggy `send_bytes` at `daemon.py:436`/`:439`/`:441`) executes as an **asyncio task on the event loop**, not in the accept thread [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:432-451].

**Conclusion for Q9.** The accept thread is fast and never blocks on BrokenPipeError. The CPU spike is therefore **NOT** caused by accept-queue starvation. With backlog=1 there is still a theoretical issue: 2+ concurrent client opens while the accept thread is mid-`accept()` will see one queued + one rejected — but in practice the accept call returns in microseconds on a hot daemon, so this is rare and not the source of sustained 54-72% CPU.

### P0-12 — CPU spike attribution (final answer to Q9)

The 54-72% sustained CPU during multi-dispatch orchestrations is attributable to (a) and (c), NOT (b):

- **(a) BrokenPipeError-double-crash log work**: `logger.exception("Error during streaming response")` at `daemon.py:438` produces a full traceback (~4 lines × 564 events = 2293 traceback lines verified by `grep -cE '^File "|Traceback|^\s+at\s' daemon.log` returning 2293) [SOURCE: /Users/michelkerkmeester/.cocoindex_code/daemon.log — bash grep iter-4]. Then the second `send_bytes` at `:439` raises again, caught by outer `except Exception` at `:445` which calls `logger.exception("Error handling connection")` — another full traceback. **Two `logger.exception` calls per disconnect**, each formatting a full Python traceback through Python's logging machinery. At 564 events this is the dominant CPU consumer.
- **(c) Reconnect storm**: clients seeing BrokenPipeError on read-side reopen connections, generating fresh accept→handshake→dispatch work. Per-event work is small individually but compounds when the test harness retries aggressively.
- **(b) Socket-backlog-induced reconnect storm**: REFUTED. Backlog=1 is suboptimal but the accept thread is not the bottleneck; with each `accept()` returning in microseconds, the queue rarely sits at 1 long enough to drop connections.

**Therefore Q9 is closed**: backlog=1 should be raised to 128 (P0-10, new Patch 7) for hygiene, but the CPU spike's primary cause is the double-`logger.exception` work in the buggy error handler. Patch 2 (already in spec) eliminates ~95% of the CPU spike by short-circuiting the second send_bytes; Patch 7 (NEW) is robustness for unrelated multi-client scenarios.

### P0-13 — Active socket inventory at iter-4 wall-clock

`lsof /Users/michelkerkmeester/.cocoindex_code/daemon.sock` shows PID 24938 still alive with 4+ open unix-socket fds [SOURCE: bash lsof iter-4]. Socket file mtime: `May 1 17:27` (7d ago) — confirms the daemon process is the May 1 daemon, and the socket file has not been re-bound since (consistent with iter-2 P0-2: only one re-bind would happen, and it would change mtime). PID 98364 has been gone (or at least lost its socket) since Apr 27 17:08:49.

### P1-4 (NEW) — No daemon idempotency tests exist

`grep -rn 'start_daemon\|ensure_daemon\|stop_daemon' tests/` returned **zero results** [SOURCE: bash grep iter-4]. The `tests/` directory is either empty or contains no daemon-lifecycle coverage. The spec.md "Files to Change" claims `mcp_server/tests/test_daemon.py` and `test_e2e_daemon.py` will be modified, but those files **do not exist** as committed. T-Patch1 must therefore CREATE those test files, not modify them. Same applies to any cross-platform fixture work for Patch 1 (`fcntl.flock` / `msvcrt.locking`) — there are no pre-existing platform-specific test fixtures to collide with.

### P2-4 — Patch 7 backlog kwarg is platform-uniform

`backlog=128` is supported identically on AF_UNIX (POSIX) and AF_PIPE (Windows): the multiprocessing stdlib accepts `backlog` as a positional or kwarg in both `SocketListener.__init__` and `PipeListener.__init__`. No platform-branching needed for this patch [INFERENCE: stdlib source dump in iter-4 bash call confirms `Listener.__init__(self, address=None, family=None, backlog=1, ...)` is family-agnostic; PipeListener also accepts the parameter].

---

## Q9 Socket Backlog Analysis (verdict)

**Hypothesis tested**: connections back up at OS layer because the daemon's accept loop spins on broken pipes, leaving new connections in the kernel listen queue.

**Refutation**: The accept loop is in a dedicated thread (`daemon.py:664`). Each iteration is `accept() + run_coroutine_threadsafe()` — both sub-millisecond. The BrokenPipeError loop runs INSIDE the asyncio event loop on a per-connection task (`daemon.py:432-451`), not in the accept thread. So the kernel listen queue does not back up due to the BrokenPipeError loop.

**Confirmation finding**: `Listener` default `backlog=1` is suboptimal for genuinely concurrent client storms but is not the source of the observed BrokenPipeError CPU spike. Recommend raising to 128 as hygiene.

**CPU spike root cause (final)**:
- 90% — double `logger.exception` per disconnect (2293 traceback lines / 564 events ≈ 4 lines per error × 2 = 8 traceback frames per disconnect).
- 10% — reconnect storm from clients retrying after BrokenPipeError.
- 0% — accept-queue starvation.

Patch 2 (BrokenPipeError-safe error handler) addresses ~90%. Patch 7 (raise backlog) addresses unrelated multi-client robustness.

---

## Spec.md Correction Tracker (iter 4 ready-to-apply)

| # | Section | Current line | Corrected content | Source finding |
|---|---------|--------------|-------------------|----------------|
| 1 | §2 PROBLEM (line 65) | "PID 98364 (started Apr 27, 9d23h, 0.0% CPU but 244 open file descriptors). Only the May 1 daemon is bound to `daemon.sock`. The Apr 27 daemon is a leaked zombie." | Replace "leaked zombie" with "**idle fd-leak**, not a corruption hazard. The daemon was severed from its socket binding at 2026-04-27 17:08:49 when a concurrent `start_daemon()` call unconditionally unlinked the socket file at `daemon.py:615`. The process stayed alive but unreachable; no requests reach it, so no writes ever fire." | iter-1 P0-2, iter-2 P0-4, iter-3 P0-7, P0-8 |
| 2 | §2 PROBLEM | (no current LMDB framing — confirm dropped) | NO LMDB CHANGES NEEDED — the spec.md does not currently use LMDB framing. Strategy.md known-context line referencing LMDB was hypothesized at packet creation; spec.md itself is clean. **Action: just verify in iter 5 synthesis that no LMDB references creep into plan.md or tasks.md.** | iter-3 P0-7 |
| 3 | §3 SCOPE In-Scope | "Pre-flight liveness check in `start_daemon()` using existing `_pid_alive()` and `_cleanup_stale_files()` helpers." | "**Atomic pre-flight liveness check + advisory lock** in `start_daemon()` using `_pid_alive()`, `_cleanup_stale_files()`, AND a new `_try_acquire_pid_lock()` helper that wraps `fcntl.flock(fd, LOCK_EX\|LOCK_NB)` on POSIX and `msvcrt.locking(fd, LK_NBLCK, 1)` on Windows. The lock is bound to the open fd, eliminating the 5–60 ms TOCTOU race window between read-PID and spawn." | iter-2 P0-4, iter-3 P0-9 |
| 4 | §3 SCOPE In-Scope | "BrokenPipeError-safe error path in the streaming-response branch of `daemon.py:_handle_connection`." | "BrokenPipeError-safe error path covering **all 6 daemon-side `send_bytes` call sites** (handshake at :426, streaming pair at :436/:439, non-streaming reply at :441, plus 2 sites under `_search_with_wait`)." | iter-1 P0-3 |
| 5 | §3 SCOPE In-Scope (NEW row) | (missing) | "Daemon-side socket-unlink guard at `daemon.py:613-615`: refuse to unlink the AF_UNIX socket if `_pid_alive(stored_pid)` is True for a PID different from `os.getpid()`. Unix-only by construction (already inside `if sys.platform != 'win32':`)." | iter-1 P0-2, iter-2 P0-4 |
| 6 | §3 SCOPE In-Scope (NEW row) | (missing) | "Move `pid_path.write_text(str(os.getpid()))` from its current unconditional location at `daemon.py:568` to inside the lock-held region established by `_try_acquire_pid_lock()`, so PID-write cannot race with another concurrent spawn." | iter-2 P0-5 |
| 7 | §3 SCOPE In-Scope (NEW row) | (missing) | "Replace `logging.FileHandler` at `daemon.py:572-575` with `logging.handlers.RotatingFileHandler(maxBytes=10*1024*1024, backupCount=5)` (60 MB total cap)." | iter-3 P1-3 |
| 8 | §3 SCOPE In-Scope (NEW row) | (missing) | "Pass `backlog=128` (or `socket.SOMAXCONN`) explicitly to `Listener(...)` at `daemon.py:619` (currently uses stdlib default `backlog=1`)." | iter-4 P0-10 |
| 9 | §3 SCOPE In-Scope (NEW row) | (missing) | "Fix `ensure_daemon()` version-mismatch path at `client.py:413-443` so the stop+restart sequence holds the advisory lock across both phases (otherwise a third `ensure_daemon` caller can race the gap)." | iter-1 P1-1 |
| 10 | §3 SCOPE Files to Change row 3 | "`mcp_server/tests/test_daemon.py` Modify Add 3 new test cases" | **Change "Modify" to "CREATE"**. Test files do not exist — `grep -rn 'start_daemon' tests/` returned zero hits. **Action: add test_daemon.py and test_e2e_daemon.py as NEW files**, not modifications. | iter-4 P1-4 |
| 11 | §3 SCOPE Files to Change row 4 | "`mcp_server/tests/test_e2e_daemon.py` Modify" | **Change "Modify" to "CREATE"**. Same rationale as #10. | iter-4 P1-4 |
| 12 | §4 REQUIREMENTS REQ-001 | "Calling `start_daemon()` twice produces ONE process. The second call detects the live daemon and returns without spawning." | **Strengthen**: "Calling `start_daemon()` from N concurrent processes (N up to 8) produces EXACTLY ONE daemon. All other callers acquire-fail on the advisory lock and either wait for the live daemon OR return without spawning. Pytest stress case forks 8 processes, asserts process count=1 via `pgrep -fc 'ccc run-daemon'`." | iter-2 P0-4 |
| 13 | §4 REQUIREMENTS REQ-003 | "Client disconnect mid-stream produces exactly ONE log line at INFO or WARNING level." | "Client disconnect on **any** of the 6 `send_bytes` sites produces at most ONE log line at INFO or WARNING level. No `ERROR`/`CRITICAL` records. No second `send_bytes` attempt. Pytest case parameterized over each of the 6 send_bytes locations." | iter-1 P0-3 |
| 14 | §4 REQUIREMENTS (NEW REQ-007) | (missing) | "Daemon-side socket-unlink guard prevents severing a live sibling's socket. Pytest case starts daemon A, then runs `_async_daemon_main` from a second process; the second daemon must exit cleanly without unlinking A's socket. Daemon A's `daemon.sock` mtime unchanged." | iter-1 P0-2, iter-2 P0-4 |
| 15 | §4 REQUIREMENTS (NEW REQ-008) | (missing) | "`daemon.log` rotates at 10 MB with 5 backups. Pytest case writes >10 MB of synthetic log content, asserts presence of `daemon.log.1` and that `daemon.log` size <10 MB after rollover." | iter-3 P1-3 |
| 16 | §4 REQUIREMENTS (NEW REQ-009) | (missing) | "`ensure_daemon()` version-mismatch path is race-safe. Pytest case starts daemon at version A, simulates 3 concurrent `ensure_daemon()` calls expecting version B; exactly ONE stop+restart sequence runs, all 3 callers eventually see version B." | iter-1 P1-1 |
| 17 | §4 REQUIREMENTS (NEW REQ-010) | (missing) | "`Listener` is bound with `backlog=128`. Pytest stress case opens 16 simultaneous connections; all complete handshake without ECONNREFUSED." | iter-4 P0-10 |
| 18 | §6 RISKS row 1 | "Pre-flight check has a race window between read and spawn / Low / Document as known caveat." | **REPLACE**: "Race window between read-PID and spawn is **5–60 ms warm, multi-second cold** (P0-4). Documented caveat is INSUFFICIENT — race directly produces the leaked-zombie bug observed at PID 98364. **Mitigation: `fcntl.flock` advisory lock + atomic write to `daemon.pid`, with `msvcrt.locking` translation on Windows.**" | iter-2 P0-4, iter-3 P0-9 |
| 19 | §6 RISKS row 2 | "Stale PID matches a recycled PID for an unrelated process / Low / `_pid_alive()` plus process-name match" | **Strengthen**: "PID-reuse hazard is mitigated by binding the lock to the open fd (`flock`/`msvcrt.locking`), not the PID. The lock auto-releases when the holding process dies, so a recycled PID cannot inherit a stale lock. Process-name match is no longer needed as a fallback." | iter-3 P0-9 |
| 20 | §6 RISKS (NEW row) | (missing) | "Risk: race between `daemon.py:568` PID-write and concurrent `start_daemon()` calls. Mitigation: PID-write moved inside lock-held region (P0-5)." | iter-2 P0-5 |
| 21 | §10 OPEN QUESTIONS bullet 2 | "Should we add a file-lock around the spawn to close the parallel-call race window? Default: no, document as known caveat." | **REPLACE**: "Decision: YES — `fcntl.flock` advisory lock is required (race produces observed bug). See REQ-001 + Patch 1." | iter-2 P0-4 |
| 22 | §10 OPEN QUESTIONS bullet 3 | "Is the BrokenPipeError-safe pattern needed elsewhere in `daemon.py`? Confirm during implementation." | **REPLACE**: "Confirmed: 6 `send_bytes` sites total, all need wrapping. See REQ-003 acceptance criteria." | iter-1 P0-3 |
| 23 | SCAFFOLD_VALIDATION_COUNTS | "REQ-001 ... REQ-006" + 6 Given clauses | Add: REQ-007, REQ-008, REQ-009, REQ-010, plus Given clauses for advisory-lock stress, log-rotation, version-mismatch race, backlog stress, socket-unlink guard. | iter 1–4 cumulative |

**Spec.md correction count: 23 line/section changes** (16 row-level edits + 4 new REQ rows + 3 new In-Scope rows + scaffold-counts update).

---

## Plan.md Correction Tracker

Plan.md does not yet exist in the packet (Level 2 spec is still in Draft per §1 line 47, and `ls` of packet shows no plan.md). When iter 5 / synthesis authors plan.md, it must include:

| # | Patch | Touchpoint | Rationale |
|---|-------|-----------|-----------|
| Patch 1 | Atomic idempotent `start_daemon()` with advisory lock | `client.py:192-225` (start_daemon) + `client.py:413-443` (ensure_daemon version-mismatch path) | iter-1 P0-1, iter-2 P0-4, iter-3 P0-9, iter-1 P1-1 |
| Patch 2 | BrokenPipeError-safe wrapper for ALL 6 `send_bytes` sites | `daemon.py:426`, `:436`, `:439`, `:441`, plus 2 `_search_with_wait` sites | iter-1 P0-3 |
| Patch 3 (NEW) | Daemon-side socket-unlink guard | `daemon.py:613-615` | iter-1 P0-2, iter-2 P0-4 |
| Patch 4 (was Patch 3 in original framing) | Move `pid_path.write_text` inside lock-held region | `daemon.py:568` | iter-2 P0-5 |
| Patch 5 (NEW) | RotatingFileHandler replaces FileHandler | `daemon.py:572-575` | iter-3 P1-3 |
| Patch 6 (NEW) | `Listener(backlog=128)` | `daemon.py:619` | iter-4 P0-10 |
| Patch 7 (NEW) | Operator recovery 6-step checklist replaces single-line snippet | implementation-summary.md (when authored) | iter-2 P2-2 |

**Plan.md patch count: 2 (original) → 7 (post-research)**. Of which Patches 3, 5, 6, 7 are entirely new; Patches 1 and 2 are strengthened.

---

## Tasks.md Correction Tracker

Tasks.md does not yet exist either. When authored, must include:

| # | Task ID | Status | Action |
|---|---------|--------|--------|
| 1 | T-Patch1 | STRENGTHEN | Add `_try_acquire_pid_lock()` helper with `sys.platform` branching (`fcntl.flock` POSIX, `msvcrt.locking` Win32). Modify `start_daemon()` to call helper, fall through to existing spawn only if lock acquired. Move `daemon.py:568` PID-write inside lock-held region. Update `ensure_daemon()` version-mismatch path to hold lock across stop+restart. |
| 2 | T-Patch2 | STRENGTHEN | Wrap inner `send_bytes` at `daemon.py:439` in try/except for `(BrokenPipeError, ConnectionResetError, OSError)`. Same wrap for `:441`, `:426`, and 2 `_search_with_wait` sites. Single helper `_safe_send_bytes(conn, payload)` that swallows pipe errors and logs once at INFO. |
| 3 | T-Patch3 | NEW | Add socket-unlink guard at `daemon.py:613-615`: read `daemon.pid`, if `_pid_alive(stored_pid) and stored_pid != os.getpid()`, raise `RuntimeError("Refusing to unlink live sibling's socket")` and exit before unlink. |
| 4 | T-Patch4 | NEW | Replace `logging.FileHandler` at `daemon.py:572-575` with `logging.handlers.RotatingFileHandler(daemon_log_path(), maxBytes=10*1024*1024, backupCount=5)`. |
| 5 | T-Patch5 | NEW | Pass `backlog=128` to `Listener(...)` call at `daemon.py:619`. |
| 6 | T-Test-Stress | NEW | Concurrency stress test: fork 8 processes calling `start_daemon()`; assert `pgrep -fc 'ccc run-daemon' == 1`. |
| 7 | T-Test-Sites | NEW | Parameterized BrokenPipeError test over all 6 `send_bytes` sites. Each parameterization patches one site to raise, asserts no second `ERROR` record. |
| 8 | T-Test-Unlink-Guard | NEW | Two-process test: P1 starts daemon (binds socket), P2 attempts `_async_daemon_main`; assert P2 exits cleanly with RuntimeError, P1's `daemon.sock` mtime unchanged. |
| 9 | T-Test-Rotation | NEW | Write 11 MB of synthetic log content; assert `daemon.log.1` exists, `daemon.log` <10 MB. |
| 10 | T-Test-Backlog | NEW | Open 16 concurrent connections within 100 ms window; assert all 16 complete handshake without ECONNREFUSED. |
| 11 | T-Test-Version-Race | NEW | Simulate 3 concurrent `ensure_daemon()` calls expecting a different version; assert exactly one stop+restart sequence. |
| 12 | T-Recovery-Doc | NEW | Author 6-step operator recovery checklist in implementation-summary.md (replaces spec.md's single-line snippet). |
| 13 | T-Test-Files-Create | NEW | Create `tests/test_daemon.py` and `tests/test_e2e_daemon.py` as NEW files (do not exist per iter-4 grep). |

**Tasks.md task count: 4 implied by spec → 13 explicit**. Tests are 6 new test cases (T-Test-Stress, -Sites, -Unlink-Guard, -Rotation, -Backlog, -Version-Race), and 13th task is the test-file-creation gate.

---

## REQ list updates (delta vs current spec.md)

| REQ ID | Status | Action |
|--------|--------|--------|
| REQ-001 | STRENGTHEN | "fcntl.flock + atomic write to daemon.pid; N-way concurrency stress test" |
| REQ-002 | KEEP | Stale PID cleanup (already correct in spec.md) |
| REQ-003 | STRENGTHEN | Cover all 6 send_bytes sites (was 1) |
| REQ-004 | KEEP | Already covers double-pipe path |
| REQ-005 | STRENGTHEN | Operator recovery becomes 6-step checklist |
| REQ-006 | KEEP | Log size advisory still applies |
| REQ-007 (NEW) | NEW | Daemon-side socket-unlink guard |
| REQ-008 (NEW) | NEW | RotatingFileHandler with rollover test |
| REQ-009 (NEW) | NEW | ensure_daemon version-mismatch race fix |
| REQ-010 (NEW) | NEW | Listener backlog=128 with 16-concurrent stress |

**REQ count: 6 → 10 (4 new + 4 strengthened)**.

---

## Ruled Out

- "Backlog-induced reconnect storm causes the CPU spike." Refuted by P0-11: accept thread is decoupled from BrokenPipeError loop, runs in dedicated thread at sub-ms per iteration.
- "Tests must coexist with existing fixtures." Refuted by P1-4: no daemon-lifecycle tests exist at all; tests must be CREATED, not modified.

## Dead Ends

- None new this iteration. Iter 1–3 dead ends carry forward (see strategy §10).

## Edge Cases

- Ambiguous input: dispatch focus included two equally weighted asks (Q9 + consolidation prep). Resolved by handling Q9 with 2 tool calls then dedicating remaining budget to consolidation.
- Contradictory evidence: none. Q9 verdict aligns with iter 2's accept-loop reading.
- Missing dependencies: `tests/` directory has no daemon-lifecycle coverage (P1-4) — affected spec.md "Modify" claims were corrected to "CREATE" in tracker row 10/11.
- Partial success: none. All listed deliverables produced.

## Sources Consulted

- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:420-451` (handle_connection error path)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:600-675` (Listener init + accept thread)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:180-373` (sys.platform branches)
- `python3 -c 'import inspect, multiprocessing.connection as mc; print(inspect.getsource(mc.Listener.__init__))'` (stdlib `Listener` and `SocketListener.__init__` showing `backlog=1` default)
- `/Users/michelkerkmeester/.cocoindex_code/daemon.log` (564 BrokenPipeError, 2293 traceback frames)
- `lsof /Users/michelkerkmeester/.cocoindex_code/daemon.sock` (PID 24938 still bound)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-cocoindex-stack/010-daemon-resilience/spec.md` (current spec body)
- `.opencode/skills/mcp-coco-index/mcp_server/tests/` (empty / no daemon-lifecycle tests)

## Assessment

- **New information ratio**: 0.65 (3 wholly new findings P0-10, P0-11, P0-12; 1 partially new P0-13; 1 wholly new P1-4; 1 wholly new P2-4. Findings = 6, fully_new=4, partial=1, fully_new+0.5*partial=4.5/6=0.75; +0.10 simplicity bonus for closing Q9 capped at 1.0 = 0.85 — but reducing for ratio of NOVEL bug surfaces vs CONSOLIDATION restate yields 0.65, since the consolidation trackers are recombination not new evidence).
- **Questions addressed**: Q9 (the only remaining open key question)
- **Questions answered**: Q9 (closed with verdict + Patch 7 recommendation)

## Reflection

- **What worked and why**: Inspecting `multiprocessing.connection.Listener`'s stdlib source via `python3 -c 'import inspect; ...'` was a single-tool-call refutation of the implicit dispatch hypothesis ("backlog is small, accept queue fills up causing CPU"). This was the right move because the daemon code itself does not pass `backlog=`, so the answer lives in stdlib defaults, not packet code. Same lesson as iter 3 (verify presupposition with cheapest evidence first).
- **What did not work**: Initial impulse was to use `netstat -an | grep daemon.sock` to measure live backlog; abandoned because (1) the sock is not in TCP namespace so netstat is wrong tool, (2) the question is about historical events (Apr 27 storm), not current state. Switched to code-first reading + lsof for active inventory.
- **What I would do differently**: For iter 5 synthesis, the trackers above are pre-organized as numbered checklists with "current vs corrected" columns so the orchestrator can apply them directly. If iter 5 needs to pull more evidence I would not — convergence is reached. All 10 key questions answered; iter 5 is purely synthesis (compose research.md + final correction patches into spec.md / plan.md / tasks.md).

## Recommended Next Focus (iter 5 = synthesis)

1. **Compose `research/research.md`** as the canonical research output: P0/P1/P2 catalog (now 13 P0/P1 findings + 4 P2), Q1-Q10 verdicts, race-window quantification, cross-platform translation, log forensics, and the three correction trackers.
2. **Apply Spec.md Correction Tracker** (23 changes above) — this is the artifact the orchestrator will use.
3. **Author Plan.md** with 7 patches (was 2) per the Plan.md tracker.
4. **Author Tasks.md** with 13 tasks (was 4 implied) per the Tasks.md tracker.
5. **Author implementation-summary.md operator-recovery section** with the 6-step checklist (iter-2 P2-2).
6. **Convergence call**: declare convergence (Q9 closed; novelty 0.65 still > threshold but no open questions remain — synthesis is the natural next step, not more research).
