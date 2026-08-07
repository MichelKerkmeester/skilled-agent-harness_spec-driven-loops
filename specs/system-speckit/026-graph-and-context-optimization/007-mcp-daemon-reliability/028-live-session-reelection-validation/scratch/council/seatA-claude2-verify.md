I have everything needed. Both code-path analysis and a full live repro run confirm the finding. Here is my structured verdict.

---

# VERDICT: CONFIRMED — fresh-session double-writer is real

## Q1 — VERIFY/REFUTE: **CONFIRMED** (code + live repro)

The fresh launcher reclaims the kept lease without reaping the still-alive released daemon, then spawns a second daemon on the same DB. Verified two ways:

**Code path (the gap is structural, not config-dependent):**

1. **Release keeps the daemon + drops only owner lease** — `shutdownLauncherForSignal` L1370–1383: when re-election is enabled it `removeListener('exit', clearAllLeaseFiles)`, calls `clearOwnerLeaseFile()` only, and `process.exit(0)` **without killing the daemon**. Post-state: child lease `.mk-spec-memory-launcher.json` survives with `{pid: <dead owner>, ownerPid: <dead>, childPid: <ALIVE daemon>}`.
2. **Liveness keys on the dead owner pid** — `leaseHeldFromFile` L561–565: `process.kill(lease.pid, 0)` where `lease.pid` is the **owner** launcher pid. Owner dead → `ESRCH` → returns `{held: false, staleReclaimable: true}`. The alive `childPid` is never consulted for the held/bridge decision.
3. **Fresh `main()` takes the reclaim branch, which never reaps** — L1474–1482: `leaseResult.held` is `false`, so the bridge branch (L1475) is skipped; `leaseResult.staleReclaimable` is `true`, so it only `log('staleReclaimed: true')` and **falls straight through** to `writeLeaseFile()` (L1502) + `launchServer()` (L1510) → spawns D2.
4. **The reap-before-respawn guard does not cover this branch** — `reapLeaseChildBeforeRespawn` (L689) has exactly one caller: `respawnAfterDeadSocket` L810, reachable only via `bridgeOrReportLeaseHeld` (L845) when `leaseResult.held === true`. In the stale-reclaim case `held === false`, so the reap is **never reached**. This is exactly the brief's L42–44 claim.

**Live repro** (`reelect-doublewriter.cjs`, isolated temp fake-root, real lease/DB untouched):
```
daemon D1 = 41362, alive=true          # owner A spawns D1
>>> dispose OWNER A <<<
after dispose: A.launcher alive=false, D1 alive=true     # released, NOT killed
daemon D2 = 41505 (D1 was 41362); D2===D1 ? false        # fresh B spawns a SECOND daemon
t+1s … t+60s: D1(orphan)=ALIVE D2(new)=ALIVE
  dbOpenersD1/D2 = [41362|context-index.sqlite(-shm/-wal), 41505|context-index.sqlite(-shm/-wal), …]
```
For the entire 60s window both pids held `context-index.sqlite` + `-wal` + `-shm` open simultaneously. The orphan is bounded by its own idle monitor — `dist/context-server.js` L1815–1818, `onIdle → fatalShutdown(...)`, default 30 min — so it's a bounded window, not a permanent leak.

## Q2 — SEVERITY: **MEDIUM** for data integrity, **HIGH** for the safety claim (net: regression that should gate default-on)

**It is genuinely a regression.** Pre-re-election, owner disposal ran the kill path (L1385–1417: kill children + `clearAllLeaseFiles`), so a fresh session afterward found no lease and a dead daemon → one clean cold writer. Default-on re-election introduces a window of up to the idle timeout (~30 min) in which a fresh-after-dispose session runs **two** daemons on one DB — a state the prior behavior could never reach. The changelog's *"worst case matches the prior kill-on-disposal behavior"* is **false**: it models the orphan as an untouched ghost that self-exits, but a fresh session doesn't leave it idle — it actively adds a second writer. **The safety claim that justified default-on is refuted.**

**Calibrating the actual harm (not overstating):**
- **Catastrophic main-DB page corruption: LOW.** SQLite WAL explicitly supports multiple processes on one DB on a local filesystem, coordinated via the `-shm` file + POSIX advisory locks (multiple readers + serialized single writer). Two well-behaved `better-sqlite3` connections on a local FS will not corrupt the core B-tree by themselves. I will not claim otherwise.
- **Write contention → SQLITE_BUSY: MED.** Both daemons carry independent write traffic (embedding reconcile, job queue, causal-graph, index scans). `busy_timeout` is only low-single-digit seconds (`checkpoints.ts` 5000/1000ms). Under concurrent writes one side can time out → failed `memory_save`/index ops surfacing as errors.
- **WAL growth / checkpoint starvation: MED.** A checkpoint can only reset the WAL when no other connection holds an older-snapshot read lock. Two continuously-active daemons (each running `checkpointAllWal()` every 300s, L1814) frequently can't fully reset → WAL bloats for the window.
- **Application-level single-writer invariant violation: the real driver, MED–HIGH.** The whole lease/owner machinery + `MK_SPEC_MEMORY_STRICT_SINGLE_WRITER` (default on, L1452) exists precisely because the system assumes exactly one writer. Two writers break invariants SQLite's transaction isolation does *not* protect:
  - **FTS5 external-content shadow** + boot integrity rebuild (`scheduleBootFtsIntegrityCheck`, L1813): concurrent shadow maintenance can desync the shadow / duplicate rows — the boot auto-heal exists *because* dirty shadows occur.
  - **`ingest_jobs` queue**: two daemons polling/claiming → double-processing races.
  - **`.unclean-shutdown` marker**: a single-file flag; when the orphan self-exits and runs checkpoint+close, it can clear the marker the live daemon set (or checkpoint mid-write of the live daemon), defeating the clean-close detection that `reapLeaseChildBeforeRespawn` relies on elsewhere.
  - **Entity-density / graph-routing caches**: each daemon caches independently → stale cross-writes until TTL (degraded results, not corruption).

**Net:** real data-loss/corruption probability is low on local FS, but the change ships a state the architecture is explicitly built to forbid, with concrete functional failure modes (SQLITE_BUSY, WAL bloat, FTS desync, job double-claim) for up to 30 min — and it invalidates the specific safety claim used to default it ON. Treat as **release-blocking for default-on**.

## Q3 — RECOMMENDED FIX (brief; my focus was Q1/Q2)

Primary: **option (a)** — on the stale-reclaim branch in `main()` (L1480, right after `staleReclaimed: true`), read the surviving lease's `childPid` and, if alive, run the existing `reapLeaseChildBeforeRespawn(childPid)` before `writeLeaseFile()`/`launchServer()`. This mirrors the proven dead-socket guard, is minimal, and closes the window deterministically. Edge cases to cover: the reclaim must hold the respawn/owner lock (as `respawnAfterDeadSocket` does, L771–807) so two fresh launchers don't both reap/spawn; honor the `unknown-eperm` non-allowed result; and preserve the clean-close/`.unclean-shutdown` barrier so D2 rebuilds the FTS shadow if D1 didn't close cleanly. Option (b) (true bridge-on-childPid) is the nicer long-term behavior but is a larger change to the held/bridge decision; option (c) (default-OFF) is the safe immediate mitigation if a fix can't land now. Proof: extend `daemon-reelection-adoption-live.vitest.ts` to assert that after dispose+fresh-start, `lsof` shows exactly one pid on `context-index.sqlite-wal` (the orphan reaped before D2 boots).

---

**Note:** repro ran fully isolated in a temp fake-root; the real lease/DB were never touched, and no repo files were created, edited, or deleted.
