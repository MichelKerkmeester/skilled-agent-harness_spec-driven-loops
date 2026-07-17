# Iteration 012 — correctness / A4-verify (adversarial settle of F-A4-01)

## Dispatcher
- **Run:** 12 (adversarial-verify pass) of 20
- **Mode:** review (read-only — verdict only, no code modification)
- **Dimension:** correctness
- **Angle:** A4-verify — settle F-A4-01 (P1 vs P2) by tracing shutdown end-to-end for ANY supervisor/boot/cleanup path that stops or fences the ingest worker before `closeDb`.
- **Budget profile:** adjudicate (target 8-10 tool calls; used 9)
- **Review target:** git range `a9e9bdb0a5^..HEAD` (HEAD `12de3d3a7e` — confirmed unchanged since iter-005)
- **Parallel-safety:** wrote ONLY `iterations/iteration-012.md` + `deltas/iter-012.jsonl`. Did NOT touch `deep-review-state.jsonl`, strategy, registry, or config.

## Files Reviewed
- `mcp_server/context-server.ts` 1537-1629 (`fatalShutdown` full cleanup sequence + module-private `shuttingDown`), 1681-1703 (signal wiring), 2077-2090 (`initIngestJobQueue` + inline `processFile`), 147 (import surface).
- `mcp_server/lib/ops/job-queue.ts` 692-722 (`drainQueue` worker loop), 724-753 (`enqueueIngestJob` fire-and-forget `setImmediate`), 759-771 (`initIngestJobQueue` crash recovery), 777-785 (full export surface).
- `mcp_server/lib/search/vector-index-store.ts` 1491-1565 (`initialize_db` reopen + marker write), 1617-1665 (`close_db` TRUNCATE + marker removal), 1706-1716 (`get_db`/`try_get_db`), 1975-1977 (`get_db as getDb` / `try_get_db as tryGetDb` aliases), 769-787 (`write_unclean_shutdown_marker`).
- `mcp_server/handlers/memory-index.ts` 14, 216-279, 541, 883 (`indexSingleFile` DB-write path via `requireDb`).
- `mcp_server/utils/db-helpers.ts` 27-33 (`requireDb` definition — the pivotal link).

## Findings — New
None new. This is a verification pass; the verdict on the carried finding follows.

### Carried-Finding Verdict

**F-A4-01 — CONFIRMED at P1.** The ingest job worker is neither stopped nor fenced before `closeDb`, and the reopen hazard is real. The iter-005 mitigant's escape hatch is **falsified** (it made the hazard slightly weaker than reality), but crash-recovery + boot-marker-repair still cap impact at *recoverable*, so the severity stays **P1** (not downgraded to P2, not escalated to P0).

#### Decider result: is there ANY supervisor/boot/cleanup path that stops/fences the worker before `closeDb`? — NO.

| Candidate fence | Result | Evidence |
|---|---|---|
| `fatalShutdown` cleanup sequence | ABSENT | context-server.ts:1563-1610 — steps cover sessionManager/retryManager/shadowEval/scheduledGraphRefresh/accessTracker/toolCache/launcherIdleMonitor/fileWatcher/vectorIndex/transport/ipcBridge/shutdownHooks/registeredTimers. NO job-queue / drainQueue / worker stop. |
| Any callable stop fn in job-queue | DOES NOT EXIST | job-queue.ts:777-785 exports only `initIngestJobQueue, createIngestJob, getIngestJob, cancelIngestJob, enqueueIngestJob, resetIncompleteJobsToQueued, MAX_PENDING_INGEST_JOBS` — no `stopWorker`/`drainAndStop`/`shutdownJobQueue`. |
| context-server import surface | ONLY init | context-server.ts:147 imports `{ initIngestJobQueue }` and nothing else from job-queue — there is no stop function in scope to call. |
| In-worker `shuttingDown`/abort guard | ABSENT | job-queue.ts:694-722 — loop guards only on `workerActive` (a re-entrancy latch, 695/720) and `pendingQueue.length`. Grep for `shuttingDown\|abort\|signal\|stopWorker\|fence` finds only an overflow-cap error string (737) and an unrelated comment (658). |
| Cross-module signal of shutdown | UNREADABLE | the `shuttingDown` flag is module-private to context-server.ts:1537 and is never passed into or imported by job-queue.ts. |
| Global sweep (whole mcp_server) | NONE | `rg "stopWorker\|drainAndStop\|stopIngest\|shutdownJobQueue\|stopJobQueue"` → no hits (only the worker's own `drainQueue` self-reference). |

#### Pivotal correction to iter-005 (alternativeExplanation FALSIFIED — finding strengthened)

iter-005 left a downgrade door open: *"If `indexSingleFile` happened to use `try_get_db()`/`requireDb()` (non-reopening) the reopen risk would vanish."* Tracing the actual write path closes that door against a downgrade:

- `processFile` = `async (filePath, governance) => indexSingleFile(...)` (context-server.ts:2080-2082).
- `indexSingleFile` (memory-index.ts:279) takes its DB handle from **`requireDb()`** (imported memory-index.ts:14; used at 216, 541, 883), NOT from `tryGetDb()`.
- `requireDb()` (db-helpers.ts:27-33) = `const db = vectorIndex.getDb(); if (!db) throw …; return db;`.
- **`vectorIndex.getDb` is an alias of the REOPEN path:** `export { get_db as getDb }` (vector-index-store.ts:1975). `get_db()` (1706-1707) = `return initialize_db()`.
- The non-reopening accessor is `tryGetDb` (`try_get_db as tryGetDb`, 1976; `try_get_db`, 1714 returns `db | null`) — and the worker does **not** use it.

So `requireDb()` IS the reopen path; its `if (!db) throw` guard is effectively dead for this hazard because `initialize_db()` opens a fresh connection and never returns null. The reopen risk does NOT vanish — it is the live path. This makes F-A4-01 marginally stronger than iter-005 stated (no benign-accessor escape), confirming P1 rather than allowing the P2 downgrade.

#### Concrete failure trace (file:line)

1. SIGTERM/SIGINT/SIGHUP/SIGQUIT lands → `fatalShutdown(..., 0)` (context-server.ts:1681-1692). A job is mid-flight: `drainQueue` is inside `await processQueuedJob(jobId)` → `processFile` → `indexSingleFile` (job-queue.ts:703 → context-server.ts:2081 → memory-index.ts:279).
2. `fatalShutdown` sets the private `shuttingDown=true` (1560) and runs the cleanup list (1563-1610). The worker cannot observe `shuttingDown` and is not in the list, so it **keeps running**.
3. `close_db()` runs (vectorIndex step, 1592): TRUNCATE-checkpoints all connections (1644-1649), `db.close()` (1659), removes the `.unclean-shutdown` marker on checkpoint success (1660-1662), sets `db = null` (1663).
4. The still-live worker's next DB access calls `requireDb()` → `getDb()` → `get_db()` → `initialize_db()` (vector-index-store.ts:1706-1707 → 1491). Because `db === null` now, the `if (db && !custom_path) return db` short-circuit (1492-1494) is bypassed; a NEW `Database` opens (1520), `journal_mode=WAL` is re-set (1554), and `write_unclean_shutdown_marker(target_path)` re-creates the dirty marker (1562 → 772-787).
5. The reopened connection writes fresh WAL frames (the FTS/vector upsert in `indexSingleFile`) with **no subsequent TRUNCATE checkpoint** — `close_db` already ran and won't run again. Result at rest: `.unclean-shutdown` marker present (dirty) + non-empty/uncheckpointed WAL — exactly the corruption window `close_db` exists to close (1638-1643).
6. Tail variant (same dirty outcome): if the awaited drains starve past `SHUTDOWN_DEADLINE_MS=5000` (1546), `Promise.race` force-exits (1613-1628) and `close_db` may never run — also leaving the marker set. Either branch exits dirty.

#### Why P1, not P0 (severity holds)

Crash recovery makes the *job* recoverable and the DB *repairable on next boot*, so this is a recoverable durability/consistency regression, not unrecoverable data loss:
- `initIngestJobQueue` → `resetIncompleteJobsToQueued()` re-enqueues incomplete jobs on next boot (job-queue.ts:765-768) — the job is not lost.
- Boot reads the `.unclean-shutdown` marker (present == dirty, by design comment 1650-1657) and the next-open repair path remediates. The "present == dirty / removed only on clean close" invariant (1650-1657, 1660-1662) plus `wal_autocheckpoint=256` (1560) keep the at-rest WAL bounded and the dirty state detectable.

The `downgradeTrigger` ("a separate shutdown path stops the ingest worker before `closeDb`, or jobs are rare/idle in practice") is definitively NOT satisfied: no such path exists, and concurrent multi-session daemon use makes the window operationally reachable. P1 confirmed.

## Traceability Checks
- **Iteration number:** dispatch says 12; honored per parallel-safety contract (writing only iteration-012.md + iter-012.jsonl). Main-state/JSONL reconciliation is the reducer's job.
- **Range integrity:** all five files resolve inside the diff range; HEAD `12de3d3a7e` matches iter-005, so the iter-005 anchors are still valid line-for-line (verified against current file contents, not stale).
- **Anchor re-verification (all iter-5 anchors re-read at current HEAD):** context-server.ts:1586-1592 (file-watcher-first drain + reopen comment) ✓; context-server.ts:1563-1610 (cleanup list, no job-queue) ✓; job-queue.ts:746-752 (`setImmediate(() => void drainQueue())`) ✓ (now at 747-751); job-queue.ts:694-722 (no shuttingDown guard) ✓; vector-index-store.ts:1706-1708 (`get_db -> initialize_db`) ✓; vector-index-store.ts:1562 (marker write on open) ✓; vector-index-store.ts:1644-1664 (close_db TRUNCATE + marker removal) ✓.

## Integration Evidence
- `context-server.ts:2080-2082` → `memory-index.ts:279` (`indexSingleFile`) → `db-helpers.ts:28` (`requireDb`) → `vector-index-store.ts:1975` (`get_db as getDb`) → `1706/1491` (`get_db`/`initialize_db` reopen). Full reopen chain confirmed by call-site reads (not by running). This is the load-bearing integration surface that settles the verdict.

## Edge Cases
1. **`initialize_db` connection-map cache (1505-1511):** even if a stale connection lingered in `db_connections`, `close_db` clears the map (`db_connections.clear()`, 1635) before nulling `db`, so the reopen genuinely opens fresh and re-writes the marker — the cache does not accidentally rescue cleanliness.
2. **Deadline-vs-reopen race:** the 5000 ms deadline (1546) does not fence the worker; it only bounds the awaited drains. A reopen can land either before the deadline (after `close_db`) or the deadline can fire first (`close_db` skipped). Both exit dirty — there is no clean branch where an in-flight job is present.
3. **Concurrent-session reachability:** this checkout shares one daemon across sessions (Known Context). SIGTERM to the daemon during another session's ingest makes the window operationally reachable, not theoretical.

## Confirmed-Clean Surfaces
- **`close_db` final-checkpoint correctness:** unchanged from iter-005 — TRUNCATE on active + all tracked connections before `.close()`, marker removed only after confirmed checkpoint success (1644-1662). The defect is the *reopen after* this runs, not this code.
- **Crash-recovery re-enqueue:** present and correct (job-queue.ts:765-768) — the basis for capping severity at P1.

## Ruled Out
- **Downgrade F-A4-01 to P2:** REFUTED. No worker fence exists anywhere in the shutdown/boot/supervisor paths, and the `requireDb`/`try_get_db` benign-accessor escape is falsified (`requireDb` uses the reopen alias). The `downgradeTrigger` is not met.
- **Escalate F-A4-01 to P0:** REFUTED. Crash recovery re-enqueues the job and boot repairs the marker; impact is recoverable durability/consistency, not unrecoverable data loss.

## Next Focus
- **Dimension:** correctness | **Angle:** A4 settled — no further adversarial passes needed on F-A4-01.
- **Focus area:** Synthesis should carry F-A4-01 forward as a **confirmed P1** with the strengthened rationale (reopen-via-`requireDb` falsifies the prior escape hatch). Suggested fix surface for the Planning Packet: add a job-queue `stopWorker()`/drain-and-fence export and call it in `fatalShutdown` BEFORE `vectorIndex.closeDb()` (mirror the file-watcher-first ordering at 1586-1592), and/or have the worker observe a shared `shuttingDown` signal and switch its DB access to `tryGetDb()` (non-reopen) during shutdown.
- **Reason:** the single highest remaining lifecycle correctness risk is now fully adjudicated; verdict is stable.
- **Rotation status:** correctness A1-A4 complete; A4 adversarial-verify (this iter) complete.
- **Blocked/productive carry-forward:** BLOCKED — do not re-raise "no final checkpoint" (refuted iter-5), "permanent EADDRINUSE" (mitigated iter-5), F-A4-01 P0-escalation, or F-A4-01 P2-downgrade. Productive — F-A4-01 confirmed P1 feeds synthesis/Planning Packet.
- **Required evidence (next):** none for F-A4-01; it is settled. Synthesis only.
