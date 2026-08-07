# Adversarial Fix Verification — live-237 (daemon single-instance DB lock)

VERDICT: INCOMPLETE

**Scope of the verdict.** The corruption core — the kernel-fcntl sidecar lock and its adoption in
`vector-index-store` / `context-server` (fix components 1–4, 6) — verifies sound: I found no path by
which two processes can both hold the lock, no self-deadlock, no release-by-non-holder, and no save-lane
regression. That half would be CLOSED. The verdict is INCOMPLETE because fix component 5 (the launcher's
exit-86 handler) is structurally wrong in its primary supervised-mode flow: the launcher always sees its
**own** lease as "held by a live owner", attempts to bridge to itself, and ends up SIGTERM-ing its own
pid via the dead-socket respawn path. The designed "bounded retry for non-daemon holders" branch is
unreachable dead code in supervised mode. This is a liveness defect, not a corruption defect — but it
fires in exactly the live-237 scenario (a standalone Step 11.5 save holding the lock during a daemon
cold boot) and should be fixed before commit.

Verifier: fresh Fable 5 session, 2026-06-12. All file:line references are to the uncommitted working tree.

---

## 1. Failure-class evidence

### (a) Any path where TWO processes both believe they hold the lock — NONE FOUND

- **Acquire recipe is correct.** `db-instance-lock.ts:154-172`: `busy_timeout` → `journal_mode=DELETE` →
  `locking_mode=EXCLUSIVE` → `BEGIN IMMEDIATE` → insert → `COMMIT`. Under EXCLUSIVE locking mode the
  winner's COMMIT retains the kernel EXCLUSIVE lock for the life of the connection; a loser's *first
  touch* — even the read implied by the `journal_mode` pragma — returns `SQLITE_BUSY`, mapped to
  `DB_LOCK_HELD` at `db-instance-lock.ts:185-195`. The shared-lock-only first-touch trap is explicitly
  avoided by `BEGIN IMMEDIATE` (`db-instance-lock.ts:20-23, 160`); two contenders racing between open and
  `BEGIN IMMEDIATE` arbitrate on the RESERVED→EXCLUSIVE upgrade — exactly one commits.
- **The `.lock` file is never unlinked by any code path.** The module never unlinks it
  (`db-instance-lock.ts:213-224` closes the connection and removes only the token-guarded
  `lock-info.json`). The two sidecar-cleanup helpers remove only `-wal`/`-shm`:
  `vector-index-store.ts:1100-1104` and `checkpoints.ts:820-824`. Checkpoint restore copies/renames
  specific snapshot files only (`checkpoints.ts:2683, 2695`; `vector-index-store.ts:1444-1462`). A grep
  across `mcp_server/{lib,handlers,core}` for `<anything>.lock` string construction finds only the
  unrelated embedder auto-select lock (`lib/embedders/schema.ts:109`). The inode-keyed ABA hole that
  killed the previous lease design (backlog `verify_proof2`: unlink-by-path reclaim) is closed.
- **POSIX close-drops-locks audited.** No in-process code opens `<db>.lock` outside the module's single
  better-sqlite3 connection (which SQLite's unix VFS inode-tracks), so no `fs.readFileSync`/copy of the
  lock file can drop the daemon's own kernel lock. Diagnostics read/write a *different* file
  (`db-instance-lock.ts:61-63, 85-91, 99-114`).
- **Path-keying between eager probe and `initialize_db` is consistent.** The boot probe keys on
  `vectorIndex.getDbPath() || DATABASE_PATH` (`context-server.ts:1741`, barrel export
  `lib/search/vector-index.ts:144`); `initialize_db` keys on the exact string it passes to
  `new Database()` (`vector-index-store.ts:1996-2000`). Both derive from
  `resolve_database_path()`/`resolveDatabasePaths()`, and the config realpaths the database dir
  (`core/config.ts:75` `realpathAllowMissing`). The launcher spawns the child with plain `process.env`
  (no `MEMORY_DB_PATH` injection, `mk-spec-memory-launcher.cjs:1308-1312`), so daemon and standalone
  script lanes compute identical canonical strings. Even if keys diverged, every main-DB open goes
  through `initialize_db`, which acquires for its actual target before `new Database()` — divergence
  delays refusal, it cannot create two writers.
- **Residual (hardening follow-on, not a live hole):** the `MEMORY_DB_PATH` branch returns the env value
  verbatim, not realpath'd (`vector-index-store.ts:372, 381`), and `lock_path_for` uses `path.resolve`
  only (`db-instance-lock.ts:57-59, 141`). Two processes naming the same DB file through different
  symlink spellings of `MEMORY_DB_PATH` would key different lock inodes. The default deploy does not set
  `MEMORY_DB_PATH`, so this is not reachable today.
- **The 700ms dead-window anomaly is correct behavior, not a hole.** The kernel releases the fcntl lock
  at holder death; between death and the successor's acquire the lock is genuinely unheld, so a contender
  proceeding in that window is the design working. At no instant can two processes hold it
  simultaneously — the only ways to fake that are the kill switch (`SPECKIT_DB_LOCK_DISABLE=1`,
  `db-instance-lock.ts:130-138`) or out-of-band `.lock` inode replacement (no code path; see MEGA-sync
  follow-on F3).

### (b) Self-deadlock — NONE FOUND

- Reentrancy is a per-process `Map` keyed by resolved path (`db-instance-lock.ts:141-143`); a second
  acquire returns the held handle without opening a new fd.
- `reopenActiveDatabase` → `close_db({retainLocks:true})` → swap → `initialize_db` re-enters acquire as a
  map no-op (`vector-index-store.ts:2229-2231, 1996-2000`); the swap window stays lock-protected —
  verified by the integration test (`tests/db-instance-lock.vitest.ts:212-230`, passes).
- `get_db()` lazy path → `initialize_db` → map hit (`vector-index-store.ts:2252-2254`).
- Checkpoint-restore crash recovery runs *after* acquire in the same process
  (`vector-index-store.ts:1999-2004`) and touches only the main/shard files and `-wal`/`-shm`.
- `db-state.reinitializeDatabase` does `closeDb()` (full release) then `initializeDb()`
  (`core/db-state.ts:269-272`). Not a deadlock, but a release→re-acquire gap: a contender can win the
  lock mid-reinit and `initializeDb` then throws `DB_LOCK_HELD` up to the reinit caller. Exclusion is
  preserved; the daemon recovers on the next `get_db()` after the contender exits. Liveness note only (F6).
- No `worker_threads` usage anywhere in `mcp_server/{lib,api,handlers,core}` source — the
  same-pid/different-module-instance lock question is moot.

### (c) Wedge risk — SAFE-BOUNDED, BUT THE LAUNCHER HANDLER IS STRUCTURALLY WRONG (must-fix F1)

- Lock lifetime equals connection lifetime: released in `close_db` only after the DB is fully closed
  (`vector-index-store.ts:2206-2210`), and by the kernel at process death otherwise. A dead-but-not-reaped
  daemon cannot strand the lock.
- Exit-86 never feeds the crash loop: intercepted before `superviseChildExit`
  (`mk-spec-memory-launcher.cjs:1331-1334`). Retry bounds exist and terminate: ≤3 relaunches at 2s/4s/8s,
  plus a hard cap (`retries > MAX+2` → report + `clearAllLeaseFiles` + exit 0)
  (`mk-spec-memory-launcher.cjs:1382-1394, 1400-1413`). No contender is stranded forever.
- **DEFECT:** `leaseHeldFromFile` has no self-pid exclusion (`mk-spec-memory-launcher.cjs:564-580`), and
  the pid-lease's `pid` field is the *launcher's own pid* (`clearLeaseFile` compares
  `lease.pid === process.pid`, `mk-spec-memory-launcher.cjs:970`; lease written at spawn,
  `mk-spec-memory-launcher.cjs:1324`). So whenever a supervised child exits 86,
  `handleDbLockHeldChildExit` sees `leaseResult.held === true` with `ownerPid === process.pid` and takes
  the bridge branch (`mk-spec-memory-launcher.cjs:1395-1398`) — **the non-daemon-holder bounded-retry
  branch (1400-1409) is unreachable in supervised mode.** The bridge then deep-probes the launcher's own
  session-proxy socket; the child is dead so the probe fails and returns `{action:'respawn'}`
  (`.opencode/bin/lib/launcher-ipc-bridge.cjs:421-423`), which routes into `respawnAfterDeadSocket` →
  `reapOwnerBeforeRespawn(ownerPid)` → **`SIGTERM` to the launcher's own pid**
  (`mk-spec-memory-launcher.cjs:810, 753-758`). Net effect when a short-lived non-daemon holder (e.g. a
  standalone generate-context Step 11.5 run — the canonical live-237 race) holds the DB lock during a
  cold boot: instead of the designed in-place 2–8s retry, the launcher kills itself, the MCP client sees
  a disconnect, and the cycle repeats on reconnect until the holder exits. Bounded, lease files are
  cleaned by the exit handler, no corruption — but it is the fix's own primary degraded-mode flow and it
  was never exercised by the live evidence (the observed exit-86 came from a directly spawned daemon, not
  from a supervised child losing to a non-daemon holder).
  **Required fix before commit:** in `handleDbLockHeldChildExit`, treat
  `leaseResult.ownerPid === process.pid` as the non-bridgeable case and fall through to the bounded
  retry branch.

### (d) Release-by-non-holder — STRUCTURALLY IMPOSSIBLE

- `release_db_instance_locks` closes only connections in this process's own map
  (`db-instance-lock.ts:213-224`); a process that never acquired has an empty map. The kernel will not
  release another pid's fcntl lock through any userland file operation short of inode replacement.
- The diagnostic `lock-info.json` is never used for arbitration (`db-instance-lock.ts:96-98`) and its
  cleanup is token-guarded (`db-instance-lock.ts:217-220`). The lease-wipe regression guard test
  (`tests/db-instance-lock.vitest.ts:174-185`) proves a failed acquirer's release is a no-op while the
  real holder's exclusion persists. Passes.

### (e) Regressions to existing flows — NONE FOUND

- **Step 11.5 save lane degrades correctly.** The outer catch converts *any* throw — including a
  `DB_LOCK_HELD` `VectorIndexError` from `initializeIndexingRuntime`/`reindexSpecDocs` — into a warning
  and returns `{warning}`; the save itself succeeds (`scripts/core/workflow.ts:739-746`; inner init catch
  at 661-669 is also non-fatal). Cosmetic only: `isStep115DaemonContentionError`
  (`scripts/core/workflow.ts:613-618`) does not recognize the new message, so it prints the generic
  "auto-index skipped" wording instead of the contention-formatted one (F5).
- **The standalone lane is genuinely lock-adopted.** `@spec-kit/mcp-server` resolves to
  `file:../mcp_server` with `main: dist/...` (`scripts/package.json:21`, `mcp_server/package.json:6`);
  Step 11.5's indexing API calls `vectorIndex.initializeDb()` (`mcp_server/api/indexing.ts:36`), which
  acquires the lock. No bundled stale copy of the store exists under `scripts/dist`. The pre-existing
  TOCTOU between the daemon-alive check (`workflow.ts:649-654`) and the DB open is now closed by the
  lock — an improvement, not a regression.
- **Deployed artifacts are fresh.** `dist/` rebuilt 2026-06-12 13:31, after every source edit
  (sources 13:26–13:29); `dist/lib/search/db-instance-lock.js` exists, `dist/context-server.js` carries
  the exit-86 code, `dist/lib/search/vector-index-store.js` carries the acquire calls. The launcher is
  run directly as `.cjs`.
- **Maintenance scripts that open the DB raw** (outside `initialize_db`) are unchanged in behavior —
  known follow-on (F2), not a regression. `mcp_server/cli.ts` *is* adopted (it opens via `initializeDb`,
  `cli.ts:149`) and now refuses with `DB_LOCK_HELD` while the daemon runs instead of double-writing —
  an intended behavior change.

### (f) SIGBUS — NO PLAUSIBLE MECHANISM FROM THIS CHANGE

The lock sidecar connection sets no mmap pragma; the only `mmap_size` pragmas are pre-existing and on the
main DB / vector shard (`vector-index-store.ts:799` — shard, 32MB; `vector-index-store.ts:2062` — main,
256MB). SIGBUS on an mmap'd SQLite file occurs when the mapped file is truncated or replaced underneath
the process — consistent with deploy-time file replacement or an external sync client touching the live
DB, and the precedent predates this change (launcher log 2026-06-12T05:20Z). If anything, the lock
*narrows* this class by excluding concurrent in-repo writers; external sync (F3) remains the open vector.

---

## 2. Test run summary

Run from `mcp_server/` on the working tree, temp dirs only (no live-daemon interaction):

| Suite | Result |
|---|---|
| `tests/db-instance-lock.vitest.ts` | **8/8 passed** (1.06s) — incl. cross-process refusal, SIGKILL self-release, lease-wipe guard, store integration (reopen retains, close releases) |
| `tests/launcher-clean-close-barrier.vitest.ts` | 4/4 passed |
| `tests/launcher-daemon-reelection.vitest.ts` | 5/5 passed |
| `tests/launcher-ipc-bridge.vitest.ts` | 8 skipped — pre-existing `describe.skip` at line 170, file untouched by this diff; not a fix regression, but it means the bridge path central to the exit-86 handler has no active automated coverage |

---

## 3. Follow-ons

- **F1 (P1, fix before commit):** launcher self-bridge/self-SIGTERM on supervised exit-86 — add an
  `ownerPid === process.pid` guard in `handleDbLockHeldChildExit` so a self-held lease routes to the
  bounded-retry branch instead of `bridgeOrReportLeaseHeldAndExit`. Evidence in §1(c). Add a unit test
  for the handler with a self-pid lease.
- **F2 (P2, known/acknowledged):** adopt the lock in maintenance scripts that open the DB with raw
  better-sqlite3 outside `initialize_db`.
- **F3 (P2, deploy config — from the backlog's own fix_sketch, still undone):** exclude
  `mcp_server/database/` from MEGA sync. A sync client that replaces `context-index.sqlite.lock` with a
  new inode silently breaks inode-keyed exclusion for a live holder; it is also the leading suspect for
  the mmap SIGBUS class. The code fix cannot deliver this.
- **F4 (P3, hardening):** realpath the lock key (`lock_path_for`/acquire) or realpath the
  `MEMORY_DB_PATH` branch of `resolve_database_path`, so symlink-spelling divergence between processes
  cannot key different lock inodes for the same DB file.
- **F5 (P3, cosmetic):** teach `isStep115DaemonContentionError` the `DB_LOCK_HELD` /
  "single-writer lock" message so Step 11.5 emits the contention-formatted warning.
- **F6 (P3, note):** `db-state.reinitializeDatabase`'s release→re-acquire gap can throw `DB_LOCK_HELD`
  under active contention (recovers after the contender exits); `dbLockHeldRetries` never resets after a
  healthy boot. Both benign, worth tidying alongside F1.
