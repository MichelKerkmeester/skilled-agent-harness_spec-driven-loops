# Iteration 005 — correctness / A4 (shutdown durability & resource lifecycle)

## Dispatcher
- **Run:** 5 of 20
- **Mode:** review (read-only — findings only, no code modification)
- **Dimension:** correctness
- **Angle:** A4 shutdown durability & resource lifecycle
- **Budget profile:** verify (target 11-13 tool calls; used 12)
- **Review target:** git range `a9e9bdb0a5^..HEAD` (HEAD `12de3d3a7e`)
- **Parallel-safety:** wrote ONLY `iterations/iteration-005.md` + `deltas/iter-005.jsonl`. Did NOT touch `deep-review-state.jsonl`, strategy, registry, or config. Iters 3/4 run concurrently; JSONL iteration-count derivation deferred to the orchestrator/reducer.

## Files Reviewed
- `mcp_server/lib/runtime/shutdown-hooks.ts` (1-149, full) — hook registry, timeout race, signal handling.
- `mcp_server/context-server.ts` 1538-1703 (fatalShutdown drain sequence + signal wiring), 2079-2113 (job-queue + file-watcher init), 2149-2175 (periodic checkpoint), 81/113/142/225/1592/2169 (anchors).
- `mcp_server/shared/ipc/socket-server.ts` (1-403, full) — close()/dispose, unlink, module-global re-entrancy.
- `mcp_server/lib/search/vector-index-store.ts` 1605-1716 (`close_db`, `reopenActiveDatabase`, `checkpointAllWal`, `get_db`), 499-503/1562/707-790 (WAL pragmas, unclean-shutdown marker).
- `mcp_server/lib/ops/job-queue.ts` 685-785 (drainQueue, enqueueIngestJob, initIngestJobQueue/crash-recovery) + full shutdown-guard grep.

## Findings — New

### P0 Findings
None. The charter's headline A4 P0 (no final WAL checkpoint on shutdown → data-loss/corruption window) is **REFUTED** — see Ruled Out.

### P1 Findings

1. **Ingest job worker is not drained or fenced on shutdown — can reopen the DB after `close_db()` and defeat the at-rest WAL/clean-marker guarantee** — `mcp_server/context-server.ts:1586-1592` + `lib/ops/job-queue.ts:694-722,746-752` + `lib/search/vector-index-store.ts:1706-1708,1562,1644-1664` — The shutdown drain (`fatalShutdown`) deliberately closes the file watcher FIRST (1586-1591) precisely because its in-flight tasks write through `get_db()`, which **reopens** a closed DB (`get_db` → `initialize_db()`, 1706-1708) and would leave fresh WAL frames after the TRUNCATE checkpoint (the comment at 1578-1585 spells this out). The ingest job worker is the unguarded twin of that hazard: `drainQueue` runs fire-and-forget via `setImmediate(() => void drainQueue())` (746-752), each job calls `processFile` → `indexSingleFile` (context-server.ts:2080-2082) which writes through the same `get_db()` reopen path, and the worker has **no `shuttingDown` / abort guard** (confirmed by grep — only unrelated overflow-`abort` tokens exist) and is **absent from the cleanup sequence** (1563-1610). A SIGTERM/SIGINT that lands while a job is mid-`indexSingleFile` therefore (a) can reopen the DB after `close_db()` ran, re-writing the `.unclean-shutdown` marker (initialize_db, 1562) and leaving a non-empty WAL at rest — exactly the corruption window `close_db` works to close — and (b) is force-killed at the 5000 ms deadline (1546, 1624-1628). Real window, not theoretical: the diff added the durable file-watcher fence but left the structurally identical job-queue path unfenced.

   Mitigant (caps severity at P1, not P0): durable crash recovery exists — `initIngestJobQueue` → `resetIncompleteJobsToQueued()` re-enqueues incomplete jobs on next boot (job-queue.ts:763-768), and `boot` repairs the unclean marker (context-server.ts:376-426). So the *job* is not lost and the DB is repaired on next start; the defect is a real but recoverable durability/consistency regression (dirty marker + non-empty/uncheckpointed WAL at rest, force-kill mid-write), not unrecoverable data loss.

   ```json
   {
     "id": "F-A4-01",
     "type": "correctness",
     "claim": "The ingest job worker writes through get_db() (which reopens a closed DB) and is neither stopped nor included in the shutdown drain, so a signal during a job can reopen the DB after close_db(), re-create the unclean-shutdown marker, and leave a non-empty WAL at rest.",
     "evidenceRefs": [
       "context-server.ts:1578-1592 (fileWatcher drained first BECAUSE getDb reopens; closeDb after)",
       "context-server.ts:1563-1610 (cleanup list has sessionManager/retryManager/fileWatcher/vectorIndex/transport/ipcBridge/shutdownHooks — NO job-queue stop/drain)",
       "context-server.ts:2080-2082 (processFile -> indexSingleFile)",
       "job-queue.ts:746-752 (setImmediate(() => void drainQueue()) fire-and-forget; no await)",
       "job-queue.ts:694-722 (drainQueue loop has no shuttingDown/abort guard)",
       "vector-index-store.ts:1706-1708 (get_db -> initialize_db reopens)",
       "vector-index-store.ts:1562 (initialize_db writes .unclean-shutdown marker on every open)",
       "vector-index-store.ts:1644-1664 (close_db TRUNCATE + marker removal — the guarantee a post-close reopen defeats)"
     ],
     "counterevidenceSought": "Searched job-queue.ts for shuttingDown/abort/signal/stopWorker guards (none in the worker); checked the full cleanup sequence for any job-queue stop/drain call (none); confirmed crash-recovery re-enqueue exists so the job is not lost.",
     "alternativeExplanation": "If indexSingleFile happened to use try_get_db()/requireDb() (non-reopening) the reopen risk would vanish — but it calls get_db() which is the reopen path, matching the exact hazard the fileWatcher drain defends against.",
     "finalSeverity": "P1",
     "confidence": 0.78,
     "downgradeTrigger": "If a separate shutdown path stops the ingest worker before closeDb (none found in this range), or if jobs are rare/idle at shutdown in practice, drop toward P2.",
     "skepticPass": "Skeptic challenged 'is the window real or does crash recovery erase it?' — Referee: window is real (dirty marker + non-empty WAL at rest + force-kill mid-write) but recovery downgrades impact from data-loss to recoverable durability regression; P1 not P0.",
     "findingClass": "shutdown-ordering / resource-lifecycle gap",
     "scopeProof": "All cited lines inside the A4 declared targets (context-server.ts shutdown region, job-queue.ts, vector-index-store close path).",
     "affectedSurfaceHints": ["fatalShutdown cleanup sequence", "ingest drainQueue worker", "vectorIndex.closeDb at-rest WAL guarantee", "boot unclean-marker repair"]
   }
   ```

### P2 Findings

2. **Two parallel, divergent SIGTERM/SIGINT handler stacks — `shutdown-hooks.ts` is wired but its registry is effectively unused by the daemon shutdown path** — `mcp_server/lib/runtime/shutdown-hooks.ts:129-148` + `context-server.ts:1681-1692,1607-1609` — `shutdown-hooks.ts` installs its OWN `process.once('SIGTERM'/'SIGINT')` handlers (129-134) that call `handleShutdownSignal` → `exitProcess(143|130)`, while `context-server.ts` installs `process.on('SIGTERM'/'SIGINT')` (1681-1692) → `fatalShutdown(...,0)` → `process.exit(0)`. Both fire on the same signal. `fatalShutdown` does call `runShutdownHooks()` as step 9 (1607-1609), so the registered hooks usually run via the context-server path; but the shutdown-hooks module ALSO races to exit on its own handler. Exit-code disagreement (0 vs 143/130) and double-exit ordering are non-deterministic. Lower severity because `fatalShutdown` guards re-entrancy via `shuttingDown` (1559) and `runShutdownHooks` guards via `running` (63), so the hooks themselves don't double-run; the observable defect is an inconsistent process exit code on signal and a redundant handler stack. Note: only `shutdown-hooks.ts` registers via `process.once`, and its handler is `installProcessHooks()`-gated on first `registerShutdownHook`, so it only arms when something registers a hook.

   Finding class: redundant/divergent signal-handler wiring.
   Scope proof: both files are A4 declared targets; lines cited verbatim.
   Affected surface hints: process exit-code contract on SIGTERM/SIGINT; supervisor/launcher that reads exit code.

3. **`startIpcSocketServer` is not re-entrant: module-global `activeServer`/`activeSocketPath`/`activeSockets` are overwritten without disposing the prior server, leaking the previous listener + sockets on a repeat call** — `mcp_server/shared/ipc/socket-server.ts:49-52,357-358,361-388` — `activeServer`/`activeSocketPath` are module singletons set unconditionally at 357-358 on each successful start. A second `startIpcSocketServer()` in the same process (e.g., bridge re-init after a transient teardown) overwrites these references with no dispose of the prior `net.Server`; the only `close()` is the one returned to the *current* caller (361-388), so the prior server keeps listening and its `activeSockets` membership is shared/clobbered. The returned `close()` does guard `if (activeServer === server)` before nulling (372-375) — good for the stale-close case — but there is no guard at *start* preventing a leaked prior instance. Real but low-frequency leak window (single-start is the normal path); flagged for the dispose()-idempotency / re-entrancy concern in the charter. Parent-dir-fsync-on-unlink (close() at 378 unlinks without an fsync of the dir) is a durability nicety not a correctness bug here: the bind path re-creates the socket and `canUnlinkExistingSocket` (147-179) safely reclaims a stale node on restart, so a crash-orphaned socket does NOT cause permanent EADDRINUSE (the ownership-fenced unlink at 335-346 reclaims it) — the charter's "stale-socket EADDRINUSE on restart" hypothesis is therefore mitigated, see Ruled Out.

   Finding class: module-global re-entrancy leak.
   Scope proof: socket-server.ts is an A4 declared target; lines cited verbatim.
   Affected surface hints: repeated startIpcSocketServer in one process; activeServer/activeSockets singletons; dispose idempotency.

## Traceability Checks
- **Iteration number:** dispatch says 5. JSONL currently has 2 `type:"iteration"` lines (iters 1-2) + deltas iter-001/iter-002; iters 3-4 run concurrently (parallel-safety). Honoring dispatch number 5 per the parallel-safety contract; main-state reconciliation is the reducer's job. Recorded as an expected-under-parallel discrepancy, not an error.
- **Range integrity:** A4 target files all resolve inside the diff range (`git diff --name-only` confirmed context-server.ts, shutdown-hooks.ts, socket-server.ts ×4 copies, job-queue.ts changed).
- **Charter vs code:** charter A4 hypotheses tested directly against `close_db` (1617-1665) and the drain order (1586-1592); two hypotheses refuted, one new defect (F-A4-01) surfaced that the charter did not anticipate (job-queue twin of the file-watcher fence).

## Integration Evidence
- `context-server.ts:1607-1609` calls `runShutdownHooks()` from `lib/runtime/shutdown-hooks.ts` — confirmed the two signal-handler stacks both observe SIGTERM/SIGINT (F-A4-02). No other cross-module integration surface inspected (job-queue→indexSingleFile→vector-index get_db chain verified by call-site reads, not by running).

## Edge Cases
1. **closeDb is synchronous and runs to completion once reached** (comment 1582-1585; `close_db` is sync, 1617). The 5000 ms `SHUTDOWN_DEADLINE_MS` (1546) only bounds the awaited drains BEFORE it (fileWatcher, ipcBridge, shutdownHooks). If those starve past 5 s, `Promise.race` force-exits (1624-1628) and `closeDb` may never run → relies on next-boot unclean-marker repair. This is the slow-drain tail risk that F-A4-01's job-worker reopen makes worse.
2. **`checkpointAllWal` periodic (300 s, unref'd, 2169)** is a no-op if `!db` (vector-index-store.ts:1689). Periodic checkpoint is a backstop, not the shutdown guarantee; the shutdown guarantee is `close_db`'s explicit TRUNCATE (1644-1664), which exists. So "periodic only, no final checkpoint" is false.
3. **TCP-fallback close() path** (322-329) destroys sockets but never unlinks (correct — TCP has no node); only the unix path unlinks (376-385). No defect.
4. **Concurrent-session context:** this checkout is shared by multiple sessions (Known Context + memory). A SIGTERM to one daemon during another session's ingest is plausible, making F-A4-01's window operationally reachable, not just theoretical.

## Confirmed-Clean Surfaces
- **Final WAL checkpoint on shutdown:** PRESENT and correct. `close_db` runs `wal_checkpoint(TRUNCATE)` on the active db AND every non-active tracked connection before `.close()` (vector-index-store.ts:1623-1659), and removes the `.unclean-shutdown` marker only after a confirmed-successful main checkpoint (1660-1661). Ordering vs better-sqlite3's passive-only `.close()` is explicitly handled.
- **Shutdown-hook timeout enforcement:** correct. `runOneHook` races each hook against a per-hook timeout with `unref`'d timer and always clears it in `finally` (shutdown-hooks.ts:95-118). `runShutdownHooks` is re-entrancy-guarded (`running`, 63) and clears the map in `finally` (71-74).
- **Socket close() idempotency for the stale-instance case:** the returned `close()` guards `if (activeServer === server)` before nulling globals (socket-server.ts:372-375), and unlink tolerates ENOENT (379-384). A stale handle's close() won't clobber a newer server's globals.
- **Stale-socket reclaim on restart:** `canUnlinkExistingSocket` ownership/type-fenced reclaim (147-179) + the bind-time EADDRINUSE unlink (335-346) safely reclaim a crash-orphaned unix socket, so a missing parent-dir fsync does NOT cause permanent EADDRINUSE.

## Ruled Out
- **Charter A4 P0 "WAL-checkpoint-on-close data-loss window (only periodic, no final checkpoint)":** REFUTED. `close_db` performs an explicit final `wal_checkpoint(TRUNCATE)` before `.close()` for all connections (vector-index-store.ts:1644-1664). Do not re-raise as P0.
- **Charter A4 "socket close() missing parent-dir fsync → stale-socket EADDRINUSE on restart":** DOWNGRADED out of P0/P1. The unlink lacks a dir fsync (durability nicety), but restart safely reclaims a stale node via the ownership-fenced `canUnlinkExistingSocket` + bind-time unlink (socket-server.ts:147-179, 335-346). No permanent EADDRINUSE. Residual is at most a P2 durability note folded into F-A4-03.

## Next Focus
- **Dimension:** correctness | **Angle:** revisit A1+A2 hotspots (charter iter 6) with the lifecycle lens, then hand A4∩A5 lifecycle-security overlap to iter 8.
- **Focus area:** (1) carry F-A4-01 into the adversarial-verify pass (iters 14-20) to settle P1-vs-P2 by checking whether any boot-time or supervisor path stops the ingest worker before SIGTERM. (2) iter 8 (A4∩A5): re-examine the socket-server unlink/fsync + `canUnlinkExistingSocket` TOCTOU under the security lens (tail-symlink re-append from A5).
- **Reason:** A4 surfaced one real recoverable durability regression (F-A4-01) and refuted the headline P0; the highest remaining lifecycle risk is the job-worker fence, which needs a supervisor-path check before final severity.
- **Rotation status:** correctness A1-A4 complete (A4 this iter). Charter iter 6 = revisit A1/A2; then security rotation (iters 7-8).
- **Blocked/productive carry-forward:** Productive — F-A4-01 feeds adversarial-verify; F-A4-03 socket re-entrancy feeds A5 (iter 7-8) security TOCTOU surface. BLOCKED: do not re-raise "no final checkpoint" or "permanent EADDRINUSE on stale socket" as P0/P1 (both refuted/mitigated this iter).
- **Required evidence (next):** any call site that stops/awaits the ingest worker before `closeDb`; whether `indexSingleFile` could be made to use `try_get_db()` (non-reopen) instead of `get_db()`; dir-fsync behavior on the socket unlink under the A5 symlink-TOCTOU lens.
