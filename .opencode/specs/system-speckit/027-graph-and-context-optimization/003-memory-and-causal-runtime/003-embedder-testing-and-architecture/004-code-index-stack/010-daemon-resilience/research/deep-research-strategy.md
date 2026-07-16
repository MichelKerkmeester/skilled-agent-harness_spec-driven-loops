---
title: "Deep Research Strategy: CocoIndex daemon resilience validation"
description: "Persistent brain for the 5-iteration validation of the two-bug remediation plan. Tracks key questions, hypotheses, evidence, and next focus across iterations."
trigger_phrases:
  - "cocoindex daemon research strategy"
  - "BrokenPipeError validation research"
  - "start_daemon idempotency research"
importance_tier: "important"
contextType: "research"
---

# Deep Research Strategy: CocoIndex daemon resilience validation

Persistent brain for the validation research. The reducer rewrites machine-owned sections after each iteration. Analyst-owned sections (Topic, Key Questions, Non-Goals, Stop Conditions, Known Context) remain stable.

---

## 1. OVERVIEW

### Purpose

Stress-test the spec.md remediation plan for the mcp-coco-index daemon. Two bugs have been identified at packet creation. This research validates whether the proposed patches are complete, whether other bug surfaces exist that share the same patterns, and whether the operator recovery procedure is sufficient.

### Usage

- Each iteration's `@deep-research` agent reads Section 16 (Next Focus), writes evidence to `research/iterations/iteration-NNN.md`, and the reducer refreshes machine-owned sections.

---

## 2. TOPIC

Validate the two-bug remediation in `026/011/spec.md`. Surface bug-surface gaps, race-window quantification, stale-daemon root cause, child-process leak, log-rotation policy, LMDB safety with two writers, cross-platform compatibility, socket backlog effects, and recovery completeness. Produce concrete file:line citations and proposed spec/plan/tasks updates.

---

## 3. KEY QUESTIONS (remaining)

- [x] **Q1 (Bug surface completeness)**: Other `subprocess.Popen` or `start_daemon`-like spawn sites in `mcp-coco-index/` with the same idempotency hole? Tests, CLI, MCP bridge. **(answered iter 1)**
- [x] **Q2 (Error-handler completeness)**: Other `conn.send_bytes` call sites with the same double-crash pattern? Trace ALL send_bytes call sites. **(answered iter 1)**
- [x] **Q3 (Race window characterization)**: Quantify the read-PID-then-spawn race. 1 ms? 100 ms? What if 3 callers race? Does macOS bind() detect collision? **(answered iter 2: 5–60 ms warm window; bind cannot detect because of unconditional unlink at daemon.py:615)**
- [x] **Q4 (Stale daemon root cause)**: Why did PID 98364 lose its socket binding while staying alive? Signal? File deletion? IPC timeout? Capture from `daemon.log` history. **(answered iter 1)**
- [x] **Q5 (Worker subprocess interaction)**: Child `multiprocessing.resource_tracker` (PID 40681). Reaped when parent dies? Or leaked too? Check `daemon.py:624-627` signal handlers. **(answered iter 2: daemon code spawns no children; PID 40681 belongs to transitive dep, out of spec scope)**
- [x] **Q6 (Daemon.log growth)**: 23 MB log. Rotation policy? Does the BrokenPipeError loop directly cause unbounded growth? **(answered iter 3: no rotation handler; daemon.py:572-575 uses plain FileHandler; recommend RotatingFileHandler(maxBytes=10MB, backupCount=5))**
- [x] **Q7 (LMDB/SQLite safety)**: Two daemons holding writable handles to same LMDB. Corruption risk? Actual write path? **(answered iter 3: RESOLVED-NEGATIVE — no LMDB exists; storage is per-project SQLite; PID 98364 quiescent, request-driven write path means zero writes from PID 98364)**
- [x] **Q8 (Cross-platform)**: Win32 fallback in `_pid_alive`. Does it work for both bugs? Validate. **Also**: does `fcntl.flock` recommendation translate to `msvcrt.locking`? Does AF_PIPE Listener have analogous unlink semantics? **(answered iter 3: fcntl.flock translates to msvcrt.locking(LK_NBLCK); lock-fd pattern eliminates Win32 PID-reuse hazard; AF_PIPE has no unlink asymmetry so Patch 4 is Unix-only)**
- [x] **Q9 (Socket backlog)**: Connection backups at OS layer during BrokenPipeError loop. Contribute to perceived CPU spinning? **(answered iter 4: Listener default backlog=1 inherited at daemon.py:619 — P0-10. Accept thread is decoupled from BrokenPipeError loop — P0-11. CPU spike attribution — P0-12 — is ~90% double `logger.exception`, ~10% reconnect storm, 0% backlog starvation. Patch 7 raises backlog to 128 for hygiene.)**
- [x] **Q10 (Recovery completeness)**: `pkill -f "ccc run-daemon"` then restart. Orphans? Should also `rm` the socket file? **(answered iter 2: snippet incomplete — replace with 6-step checklist)**

---

## 4. NON-GOALS

- Cross-platform IPC redesign (Unix socket → TCP, Windows named pipes).
- Daemon multi-tenancy redesign.
- Indexing-correctness changes.
- Embedding model changes.
- Performance tuning beyond the targeted bugs.
- Implementation of the actual fix. This research is READ-ONLY.

---

## 5. STOP CONDITIONS

- 5 iterations completed.
- Convergence delta drops below 0.10 for 2 consecutive iterations after iteration 3.
- 3 consecutive iterations produce zero new findings.
- All 10 key questions resolved with citable evidence.

---

## 6. KNOWN CONTEXT (seeded at init)

### Two confirmed bugs (from packet's spec.md, treat as ground truth)
- Bug 1: `client.py:192-225` `start_daemon()` lacks pre-flight liveness check. No `_pid_alive()` consultation, no stale-PID cleanup. The helpers exist in the same module but only `stop_daemon()` invokes them.
- Bug 2: `daemon.py:436-444` streaming-response error handler tries to send `ErrorResponse` over the same broken pipe that just failed. Double-crashes. Outer except catches the second exception.

### Live evidence at packet creation (2026-05-07T07:30Z)
- 2 daemon processes alive: PID 24938 (May 1, 5d17h, 54.7% CPU), PID 98364 (Apr 27, 9d23h, 0.0% CPU but 244 fds — leaked zombie).
- `daemon.log` 23 MB, 564 BrokenPipeError lines.
- `daemon.pid` content: 24938. Leaked PID 98364 untracked.

### Key file paths
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py` (start_daemon, _pid_alive, _cleanup_stale_files, stop_daemon)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py` (handle_connection, _dispatch, signal handlers)
- `/Users/michelkerkmeester/.cocoindex_code/daemon.log` (live runtime log, 23 MB)
- `.opencode/skills/mcp-coco-index/mcp_server/tests/test_daemon.py`
- `.opencode/skills/mcp-coco-index/mcp_server/tests/test_e2e_daemon.py`
- `.opencode/skills/mcp-coco-index/mcp_server/tests/test_e2e.py`

---

## 7. WHAT WORKED
- Iter 1: Three parallel ripgrep + log-grep calls answered Q1/Q2 structurally without reading every test. Reading `daemon.py:611-620` (Listener init with unlink) was the breakthrough for Q4 — code evidence beat log forensics alone.
- Iter 2: Reading `daemon.py:540-675` + a single ripgrep for multiprocessing primitives pinned both Q5 (no daemon child spawns) and the timing breakdown for Q3 in two tool calls. Reasoning about timing step-by-step (vs. trying to instrument) saved budget. Carrying forward iter-1's mechanism finding (`daemon.py:615` unconditional unlink) made Q3 collapse to "is bind-collision detection ever reachable?" — answer: no.
- Iter 3: A single literal `grep -lE 'lmdb|LMDB|Environment\('` across `cocoindex_code/` falsified the dispatch prompt's Q7 framing in one tool call, before any reasoning happened from a wrong premise. Chained `wc -l` + `grep -cE BrokenPipeError` + `grep -cvE 'Error|Traceback|^\s+|^File\s'` did the entire log-composition forensics in one bash round. Lesson: when a dispatch prompt presupposes a fact (here: "two daemons hold writable LMDB handles"), validate the fact with grep BEFORE reasoning from it.
- Iter 4: `python3 -c 'import inspect, multiprocessing.connection as mc; print(inspect.getsource(mc.Listener.__init__))'` was a single-tool-call refutation of the implicit Q9 hypothesis. The answer ("backlog defaults to 1") lives in CPython stdlib, not packet code, and the dispatch prompt didn't surface that. Reading `daemon.py:644-665` (accept-thread body) in parallel with the stdlib inspection allowed both halves of Q9 (default-backlog AND accept-thread coupling) to converge in one tool round. Carry forward: when a question reduces to "what does this stdlib API default to?", the cheapest evidence is `inspect.getsource()` on the actual stdlib, not docstring guessing.

---

## 8. WHAT FAILED
- Iter 1: `rg -nE` aborted because `-E` is interpreted as encoding by ripgrep, not extended-regex (ripgrep is regex by default). Recovered by dropping `-E`. Carry forward: never use `-E` with `rg`.
- Iter 2: No tool failures. (Initial impulse to chase PID 40681 in process tree was correctly redirected to a code-first ripgrep for `Process(`/`SemLock`/`Pool(`.)
- Iter 3: Initial impulse was to run a CocoIndex semantic search for "LMDB write path" before checking the import list. Course-corrected to direct ripgrep, which immediately showed there is no `import lmdb` anywhere in `cocoindex_code/`. Carry forward: presuppositions in the dispatch prompt are still hypotheses; verify them with the cheapest possible evidence first.
- Iter 4: Initial impulse was `netstat -an | grep daemon.sock` to measure live listen-queue depth. Abandoned because (a) the daemon socket is AF_UNIX, not in TCP namespace, so `netstat` is the wrong tool, and (b) the question is about historical events (Apr 27 storm), not current state. Switched to code reading + `lsof` for active fd inventory. Carry forward: "measure it live" is the wrong instinct when the events of interest already happened; reach for the source code that produced the behavior.

---

## 9. EXHAUSTED APPROACHES (do not retry)
- Searching for additional `subprocess.Popen`/`Popen(` sites in `mcp-coco-index/mcp_server/`. Confirmed only `client.py:212` and `client.py:220` (both inside `start_daemon()`).
- Searching for `multiprocessing.Process`, `Pool`, `SemLock`, `set_start_method` in daemon code. **Iter 2 ripgrep returned zero hits — daemon spawns no child processes.**
- Hypothesis "macOS `bind()` detects EADDRINUSE on AF_UNIX socket collision" — REFUTED by iter 2. The unlink at `daemon.py:615` always runs first, so bind never sees the collision.
- Stance "spec's race window is acceptable, document as caveat" — REFUTED by iter 2 P0-4. The race window directly produces the leak.
- Searching for LMDB usage in `cocoindex_code/` — REFUTED by iter 3. No `import lmdb`, no `lmdb.Environment(`, no `*.mdb` on disk. The only "LMDB" reference is a docstring comment at `project.py:33`. Storage is per-project SQLite via `cocoindex.connectors.sqlite`.
- Hypothesis "two daemons can corrupt a shared LMDB env" — REFUTED by iter 3 (P0-7).
- Hypothesis "PID 98364 holds a live writable handle and could corrupt SQLite if a writer races" — REFUTED by iter 3 (P0-8). Writes are request-driven via `_dispatch` → `IndexRequest` → `update_index`; with no socket binding, no requests reach PID 98364, so no writes ever fire.
- Hypothesis "socket-backlog-induced reconnect storm causes the CPU spike" — REFUTED by iter 4 (P0-11, P0-12). Accept thread runs in a dedicated `threading.Thread(daemon=True)` and is decoupled from the BrokenPipeError loop, which executes inside the asyncio event loop. CPU spike is from double `logger.exception` per disconnect, not accept-queue starvation. Note: backlog default of 1 (P0-10) is still suboptimal hygiene, but it is not the root cause and gets a hygiene-only Patch 7.
- Hypothesis "tests must coexist with existing fixtures" — REFUTED by iter 4 (P1-4). `grep -rn 'start_daemon|ensure_daemon|stop_daemon' tests/` returned zero hits. No daemon-lifecycle coverage exists. Test files must be CREATED, not modified.

---

## 10. RULED OUT DIRECTIONS
- Hypothesis "PID 98364 was killed by SIGTERM and stayed as a zombie" — no signal trace in `daemon.log`; mechanism is socket-unlink.
- Hypothesis "daemon spawns workers we need to reap" — daemon code is single-process (asyncio + accept thread); PID 40681 belongs to a transitive dep and self-exits. Worker-reaping is out of spec scope.
- Hypothesis "LMDB write contention exists" — RULED OUT (iter 3, P0-7). No LMDB used.
- Hypothesis "Dual-daemon situation is a corruption risk" — RULED OUT (iter 3, P0-7 + P0-8). No shared LMDB exists; SQLite cross-process locking is at the kernel level; PID 98364 has no live request path so it never opens write transactions. Worst-case (which never materialised) was delayed indexing, not corruption.
- Hypothesis "AF_PIPE Listener has the same unlink-asymmetry as AF_UNIX" — RULED OUT (iter 3, P0-9). Windows named pipes use namespace registration; second listener fails with `ERROR_PIPE_BUSY` (231). Patch 4 (guarded unlink) is therefore Unix-only by construction; the existing `if sys.platform != "win32":` guard at `daemon.py:613` already isolates it.
- Hypothesis "socket backlog backs up causing accept-queue ECONNREFUSED" — RULED OUT (iter 4, P0-11). Accept thread is decoupled from BrokenPipeError handling; backlog rarely sits at 1 long enough to drop connections. The CPU spike is from `logger.exception` formatting work, not from blocked accepts.
- Hypothesis "Patch 7 needs platform branching" — RULED OUT (iter 4, P2-4). `Listener(backlog=N)` accepts the kwarg uniformly across AF_UNIX (`SocketListener`) and AF_PIPE (`PipeListener`).

---

## 11. ANSWERED QUESTIONS
- [x] **Q1 (Bug surface — spawn sites)**: Only `start_daemon()` (client.py:192-227) directly spawns. 8 reachable callers. Fixing it covers all. Caveat: `ensure_daemon()` version-mismatch path (P1-1) still races; multi-process TOCTOU not solved by `_pid_alive` alone — need fcntl.flock advisory lock on `daemon.pid`.
- [x] **Q2 (Error-handler completeness)**: 6 daemon-side `send_bytes` call sites. Bug 2 covers 2 (streaming pair at daemon.py:436, :439). NEW finding P0-3: `daemon.py:441` (non-streaming reply) has no inner try; outer handler logs full traceback for every BrokenPipeError.
- [x] **Q3 (Race window characterization)**: 5–60 ms warm child-side window between `Popen` return and `Listener` bind. Multi-second cold (embedder load). macOS `bind()` cannot detect collision because `daemon.py:615` unlinks the previous socket file first. Three concurrent dead-PID racers all spawn → only the last unlinker keeps the live socket. **Mitigation**: `fcntl.flock(daemon.pid, LOCK_EX|LOCK_NB)` in `start_daemon()` (primary) + daemon-side PID re-check after bind (secondary).
- [x] **Q4 (Stale daemon root cause)**: `_async_daemon_main()` unconditionally unlinks the socket file at startup (daemon.py:615). PID 98364 lost its binding at **2026-04-27 17:08:49** when PID 16404 spawned concurrently — NOT May 1 as the spec.md hypothesis suggested. Spec.md known-context should be corrected.
- [x] **Q5 (Worker subprocess interaction)**: Daemon code uses no `multiprocessing.Process`/`Pool`/`SemLock` — only `multiprocessing.connection`. Accept loop is a `threading.Thread(daemon=True)`. Connection handlers are asyncio tasks. PID 40681 (resource_tracker) belongs to a transitive dep; self-exits via SIGCHLD. **No code change required for worker reaping.**
- [x] **Q10 (Recovery completeness)**: Spec.md snippet (`pkill` + `rm` + restart) is functional but incomplete. Missing: (a) stop concurrent `ensure_daemon()` callers first, (b) verify `pgrep -f "ccc run-daemon"` empty, (c) optional check on resource_tracker orphans. Replacement 6-step checklist documented in iter 2.
- [x] **Q6 (Daemon.log growth)**: No rotation handler — `daemon.py:572-575` uses plain `FileHandler`. Live log: 23 MB / 250,485 lines / 564 BrokenPipeError events / ~40 KB per error. P0-3 fix removes ~22.6 MB of error churn. Legitimate INFO baseline ≈ 5–10 MB/month under heavy reindex. Recommendation: `RotatingFileHandler(maxBytes=10*1024*1024, backupCount=5)` (60 MB total cap). Drop-in patch sketch in iter 3 finding P1-3.
- [x] **Q7 (LMDB/SQLite safety)**: RESOLVED-NEGATIVE. No LMDB exists in `cocoindex_code/`. Storage is per-project SQLite (`target_sqlite.db` + cocoindex's opaque `cocoindex.db`). PID 98364 was quiescent (0.0% CPU, lost socket binding 9d23h before observation, request-driven write path). Even hypothetically, SQLite's POSIX advisory locks serialize cross-process writers at the kernel level — worst case is delayed indexing, not corruption. Spec.md known-context must be reframed.
- [x] **Q8 (Cross-platform)**: `fcntl.flock(fd, LOCK_EX|LOCK_NB)` translates to `msvcrt.locking(fd, LK_NBLCK, 1)` on Windows. Cross-platform helper sketch in iter 3 finding P0-9. Existing daemon already maintains 8+ Win32 abstractions (AF_PIPE, OpenProcess, named-pipe paths) so the new helper is consistent. Lock-fd pattern eliminates Win32 PID-reuse hazard. AF_PIPE Listener does NOT have the AF_UNIX unlink asymmetry (it errors with `ERROR_PIPE_BUSY` instead), so Patch 4 (guarded unlink) is Unix-only by construction — already isolated by the existing `if sys.platform != "win32":` guard at `daemon.py:613`. Win32 `_pid_alive` (`client.py:244-256`) is correct; PID-reuse is mitigated by binding the lock to the fd, not the PID.
- [x] **Q9 (Socket backlog)**: `multiprocessing.connection.Listener` defaults `backlog=1`; `daemon.py:619` inherits this default (P0-10). However the accept thread is decoupled from the BrokenPipeError handling — `_accept_loop()` runs in `threading.Thread(daemon=True)` and only does `accept()` + non-blocking `run_coroutine_threadsafe()` per iteration; the buggy `send_bytes` runs inside an asyncio task on the event loop (P0-11). Therefore the CPU spike is NOT caused by accept-queue starvation. Final attribution (P0-12): ~90% from double `logger.exception` per disconnect (564 events × 2 traceback formats = 1128 formats, ≈2293 traceback lines verified by log grep); ~10% from reconnect storm; 0% from socket backlog. Patch 7 (NEW): pass `backlog=128` explicitly for hygiene — single-line, family-uniform (P2-4), no platform branching.

---

## 12. EVIDENCE LOG (iteration-by-iteration)
- **Iter 1**: 5 findings (3 P0, 1 P1, 1 P2). Q1+Q2+Q4 answered. New mechanism identified (socket-unlink at daemon.py:615). New send_bytes hole (P0-3 at daemon.py:441). New duplicate-spawn path (P1-1 at client.py:413-443). Recommends spec.md updates for advisory lock, daemon-side unlink guard, and broader send_bytes wrapper.
- **Iter 2**: 5 findings (3 P0, 1 P1, 1 P2). Q3+Q5+Q10 answered. P0-4 quantifies race window (5–60 ms warm) and proves `_pid_alive` alone is insufficient — need `fcntl.flock`. P0-5 flags unconditional `pid_path.write_text` (`daemon.py:568`) as the PID-orphan mechanism. P0-6 contradicts iter-1 framing: daemon code spawns no children, so worker reaping is out of spec scope. P1-2 notes shutdown `gather()` has no per-task timeout. P2-2 supplies a 6-step recovery checklist replacement. Convergence delta = -0.05 (0.85 → 0.80).
- **Iter 3**: 5 findings (3 P0, 1 P1, 1 P2). Q6+Q7+Q8 answered. P0-7 reframes Q7 as RESOLVED-NEGATIVE (no LMDB exists; storage is per-project SQLite). P0-8 reinforces the negative (PID 98364 quiescent, request-driven write path means zero writes). P0-9 supplies cross-platform `fcntl.flock`/`msvcrt.locking` translation, lock-fd pattern, and AF_PIPE-vs-AF_UNIX asymmetry analysis. P1-3 supplies `RotatingFileHandler` drop-in patch sketch + log-composition forensics. P2-3 flags out-of-scope `cocoindex.db` Rust-binding opacity. Convergence delta = +0.05 (0.80 → 0.85, novelty stayed high because Q7 reframing required reasoning across two findings).
- **Iter 4**: 6 findings (3 P0, 2 P1, 1 P2). Q9 answered. P0-10 surfaces `Listener` default `backlog=1` (stdlib inspection); recommends Patch 7 to pass `backlog=128`. P0-11 establishes accept-thread / event-loop decoupling — accept thread runs in `threading.Thread(daemon=True)` independent of `handle_connection` asyncio tasks. P0-12 attributes the CPU spike: ~90% from double `logger.exception` per disconnect (1128 traceback formats), ~10% from reconnect storm, 0% from backlog. P0-13 confirms iter-1 forensics: PID 24938 still socket-bound at iter-4 wall-clock, mtime unchanged. P1-4 surfaces a missing-dependency: no daemon-lifecycle tests exist, so spec.md's "Modify tests/test_daemon.py" rows must be CREATE. P2-4 confirms `backlog` kwarg is family-uniform across AF_UNIX/AF_PIPE — no platform branching. Iter 4 also produces ready-to-apply correction trackers for spec.md (23 changes), plan.md (7 patches, was 2), tasks.md (13 tasks, was 4 implied). Convergence delta = -0.20 (0.85 → 0.65 — drop reflects consolidation work being recombination, not novel evidence; all 10 key questions now answered).

---

## 13. CITATIONS POOL
[Empty — file:line and external citations accumulate here]

---

## 14. TENSIONS / CONTRADICTIONS
[Empty — reducer surfaces inter-iteration disagreements]

---

## 15. CONVERGENCE METRICS

| Iteration | Findings | Novelty | Delta | Stop reason |
|-----------|----------|---------|-------|-------------|
| 1 | 5 (3 P0, 1 P1, 1 P2) | 0.85 | n/a (first iter) | continue |
| 2 | 5 (3 P0, 1 P1, 1 P2) | 0.80 | -0.05 | continue (Q6, Q7, Q8, Q9 still open) |
| 3 | 5 (3 P0, 1 P1, 1 P2) | 0.85 | +0.05 | continue (Q9 only remaining; iter 4 also produces synthesis material) |
| 4 | 6 (3 P0, 2 P1, 1 P2) | 0.65 | -0.20 | converge — Q9 closed, ALL 10 key questions answered. Iter 5 = synthesis only (compose research.md + apply spec.md/plan.md/tasks.md correction trackers). Below 0.10 threshold by formal convergence rule? No — but stop-condition "all key questions resolved with citable evidence" IS satisfied. |
| 5 | 0 new (synthesis) | 0.05 | -0.60 | **CONVERGED** — `max_iterations_reached_with_full_convergence`. research.md (17 sections) and resource-map.md authored. Total cumulative findings: 13 P0 + 4 P1 + 4 P2 = 21. No open questions. No unresolved contradictions. Orchestrator owns next phase (apply correction trackers → commit → dispatch Phase 2 implementation). |

---

## 16. NEXT FOCUS

**CONVERGED — see `research/research.md`.**

Iter 5 synthesis is complete. All 10 key questions are answered with citable evidence. No further @deep-research iterations should be dispatched. The orchestrator owns the next phase per `research/research.md` §17:

1. Apply spec.md correction tracker (23 changes from `iterations/iteration-004.md` § "Spec.md Correction Tracker").
2. Author plan.md with 7 patches (`research/research.md` §10).
3. Author tasks.md with 13 tasks (`research/research.md` §11).
4. Commit the documentation-only update.
5. Dispatch Phase 2 implementation packet (separate spec folder or sub-phase) to apply the 7 patches.

**Historical record (pre-convergence next-focus narrative)** — kept for audit trail:

1. **Compose `research/research.md`** as the canonical research output. Sections:
   - Executive summary (CPU spike root cause, leaked-zombie mechanism, idempotency hole, all bug surfaces).
   - Q1–Q10 verdicts (one paragraph each, with citations).
   - P0/P1/P2 catalog: 10 P0 findings (P0-1 through P0-13 minus retired iter-1 framings), 4 P1 findings (P1-1 through P1-4), 4 P2 findings (P2-1 through P2-4).
   - Race-window quantification table (5–60 ms warm, multi-second cold).
   - Cross-platform translation table (`fcntl.flock` ↔ `msvcrt.locking`).
   - Log forensics breakdown (564 events × ~4 traceback lines × 2 logger.exception calls = ~22.6 MB churn).
   - Three correction trackers (verbatim from iter-4 doc).

2. **Apply Spec.md Correction Tracker** (23 changes — see `iteration-004.md` § "Spec.md Correction Tracker").
   - 16 row-level edits (problem framing, scope, requirements, risks, open questions, scaffold counts).
   - 4 new REQ rows (REQ-007 unlink-guard, REQ-008 rotation, REQ-009 version-mismatch race, REQ-010 backlog stress).
   - 3 new Files-to-Change rows (unlink guard, RotatingFileHandler, backlog kwarg).
   - 2 row-type corrections (Modify → CREATE for tests/).

3. **Author Plan.md** with 7 patches (was 2):
   - Patch 1: Atomic idempotent `start_daemon()` with `_try_acquire_pid_lock()` helper.
   - Patch 2: BrokenPipeError-safe wrapper for all 6 `send_bytes` sites.
   - Patch 3 (NEW): Daemon-side socket-unlink guard.
   - Patch 4: Move `pid_path.write_text` inside lock-held region.
   - Patch 5 (NEW): `RotatingFileHandler` replaces `FileHandler`.
   - Patch 6 (NEW): `Listener(backlog=128)`.
   - Patch 7 (NEW): Operator recovery 6-step checklist in implementation-summary.md.

4. **Author Tasks.md** with 13 tasks (was 4 implied):
   - 5 patch tasks (T-Patch1 through T-Patch5).
   - 6 test-case tasks (T-Test-Stress, -Sites, -Unlink-Guard, -Rotation, -Backlog, -Version-Race).
   - 1 recovery-doc task (T-Recovery-Doc).
   - 1 test-file-creation gate (T-Test-Files-Create — tests/ directory has no daemon coverage).

5. **Convergence call**: DECLARED. All 10 key questions answered. Stop condition "All 10 key questions resolved with citable evidence" satisfied per §5. No further research iterations.

6. **Out-of-scope tangents to defer** (do not block synthesis):
   - P1-2 (shutdown `gather()` without per-task timeout) — note in plan.md as a follow-up, not a blocker.
   - P2-3 (`cocoindex.db` Rust-binding opacity) — orthogonal to daemon resilience.

---

## 17. RESOURCE MAP HINTS

- `mcp_server/cocoindex_code/*.py` — daemon source
- `mcp_server/tests/test_*.py` — existing test coverage
- `/Users/michelkerkmeester/.cocoindex_code/daemon.log` — runtime evidence
- `/Users/michelkerkmeester/.cocoindex_code/daemon.pid`, `daemon.sock` — lock files
