I have everything I need. Here is my focused analysis.

---

# Q1 SANITY-CHECK — VERDICT: **CONFIRMED**

The fresh-session double-writer is real. The full chain checks out in code:

1. **Release leaves a live daemon under a dead-owner lease.** `shutdownLauncherForSignal` L1370–1382: when `daemonReelectionEnabled()` && live daemon, it reaps only the model-server, **removes the `exit→clearAllLeaseFiles` listener** (L1379) so the daemon lease survives, calls `clearOwnerLeaseFile()` (L1380, drops only the owner lease), and `process.exit(0)` **without killing the context-server** (which was `unref()`'d at L1300). Result: `.mk-spec-memory-launcher.json` persists with `{pid: deadOwner, ownerPid: deadOwner, childPid: aliveDaemon, socketPath}`.

2. **Liveness keys on the dead owner pid.** `leaseHeldFromFile` L562: `process.kill(lease.pid, 0)` where `lease.pid` is the owner launcher pid → `ESRCH` → returns `staleReclaimable: true` (L565). The alive `childPid` is never consulted.

3. **The reclaim branch spawns without reaping.** `main()` L1480–1482 logs `staleReclaimed: true` and **falls straight through** to L1487 `acquireBootstrapLock` → L1502 `writeLeaseFile` → L1510 `launchServer`. There is **no reap of the recorded `childPid`** anywhere on this branch.

4. **`launchServer` can't save it.** L1272–1280 only checks this launcher's *own* in-process `childProcess` (`shouldSkipLaunch`); it has no knowledge of the orphan recorded in the lease, so it spawns unconditionally.

Net: orphan daemon (alive, idle-bounded to ~30 min) + new daemon both hold `context-index.sqlite` (+WAL/SHM). The dead-socket respawn path (`respawnAfterDeadSocket` L760–815) *does* reap via `reapLeaseChildBeforeRespawn` (L810), but the **stale-owner/daemon-alive reclaim branch does not** — exactly the asymmetry the brief names. This is a genuine regression vs. pre-re-election (which killed-on-dispose → cold restart got a single clean writer), so the changelog's "worst case matches prior behavior" is **false for fresh sessions after dispose**.

---

# RECOMMENDED FIX

**Primary: Option (a) — reap the recorded `childPid` on stale-lease reclaim before spawning.** Reuse the existing, tested `reapLeaseChildBeforeRespawn` helper. ~12 lines, deterministic, restores the single-writer invariant, and makes the "worst case matches prior kill behavior" claim true (fresh-after-dispose → reap orphan → one clean spawn).

I reject **(b) true adoption/bridge** as the *fix*: the lease's recorded `socketPath` is the **owner's session-proxy socket**, which dies with the released owner. Adopting would require the detached context-server to be directly bridgeable on its own `getIpcSocketPath` and re-pointing the lease — unverified topology, real risk. It's a worthwhile *follow-up feature* to extend re-election value to fresh sessions, but not a minimal fix. **(c) default-OFF** is a mitigation, not a fix, and gives up the shipped feature.

### Exact location & change

`/.opencode/bin/mk-spec-memory-launcher.cjs`, `main()`, the `if (leaseResult.staleReclaimable)` block at **L1480–1482**. All helpers (`readLeaseFile`, `reapLeaseChildBeforeRespawn`, `clearOwnerLeaseFile`, `writeLeaseHeldJsonRpcError`) are already in scope and `main()` is `async`.

```js
if (leaseResult.staleReclaimable) {
  log(`staleReclaimed: true${leaseResult.legacyPath ? ' (legacy path)' : ''}`);
  // A released (re-election) daemon can still be listening under this stale owner lease.
  // Reap its recorded child before spawning a replacement, or two daemons hold the same
  // WAL DB until the orphan's idle timeout. Mirrors the dead-socket respawn reap.
  const staleLease = readLeaseFile(leaseResult.legacyPath || leasePath());
  const orphanChildPid = staleLease?.childPid;
  if (Number.isInteger(orphanChildPid) && orphanChildPid > 0) {
    const reap = await reapLeaseChildBeforeRespawn(orphanChildPid);
    if (!reap.allowed) {
      // Cannot confirm the orphan is gone (e.g. EPERM); spawning now risks a double writer.
      log(`stale-reclaim aborted: ${reap.reason} for childPid=${orphanChildPid}; reporting lease held`);
      clearOwnerLeaseFile();
      writeLeaseHeldJsonRpcError({ ownerPid: leaseResult.ownerPid, startedAt: leaseResult.startedAt }, reap.reason);
      process.exit(0);
    }
  }
}
```

This mirrors `respawnAfterDeadSocket` L760–815 exactly (re-read lease → `childPid` → `reapLeaseChildBeforeRespawn` → handle `!allowed`), so it inherits the SIGTERM→grace→SIGKILL ladder, the `reapProcessTreeGroups` sweep, and the `.unclean-shutdown` clean-close barrier (orphan that didn't checkpoint → replacement daemon self-heals the FTS shadow at boot) for free.

### Edge cases

| Case | Behavior | Why safe |
|---|---|---|
| **Two fresh launchers race after dispose** | Only the winner reaches this branch. | `acquireOwnerLeaseFile` (L1467) → `writeOwnerLeaseFileExclusive` uses `O_EXCL` (`'wx'`, L378). The loser hits `!acquired` (L1468) → `bridgeOrReportLeaseHeldAndExit`, never spawns. The reap runs **under exclusive owner-lease ownership** — the spawn mutex. No double-reap, no double-spawn. |
| **Respawn lock** | Not required here. | Existing bridged secondaries do **not** re-run `main()` (they sit in their bridge loop), so no concurrent `respawnAfterDeadSocket` targets this orphan. Owner-lease exclusivity already serializes the cold-start spawn. *(Optional defense-in-depth: wrap reap+spawn in `acquireRespawnLockFile()` for parity with the dead-socket path — costs a lock acquire on every cold start; owner-lease already covers it, so I'd skip it.)* |
| **Owner-lease** | Clean acquisition. | The released owner cleared it (L1380); the orphan **context-server never touches the owner lease**. We hold it from L1467. After reap, L1502 `writeLeaseFile()` overwrites the stale daemon lease; `launchServer`→`writeLeaseFile(childPid)` records the new child. |
| **Orphan already dead** (idle-exited, or ordinary non-re-election stale lease) | `processLiveness==='dead'` → helper returns `{allowed:true, reaped:false}` immediately. | **No-op fast path** — fix is invisible to normal cold starts; zero regression to the common stale-lease case. |
| **EPERM / `unknown-eperm` on child** | Bail: release owner lease + retryable JSON-RPC error + exit 0. | Can't confirm the orphan died → refuse to spawn a competitor. (Owner-pid EPERM never reaches here: `leaseHeldFromFile` maps owner EPERM to `held:true` → bridge path, not stale-reclaim.) Host reconnects. |

### Risks

- **Latency on the rare branch only**: SIGTERM + up to `RESPAWN_REAP_GRACE_MS` + possible SIGKILL before spawn — bounded, and *only* when a live orphan exists. Dead-orphan cold starts stay instant.
- **PID-recycle**: signalling a recycled `childPid` is the *same* pre-existing risk class as today's `reapLeaseChildBeforeRespawn`/dead-socket path (same helper, same lease-freshness assumption) — **no new risk introduced**.

### Test that proves it

Extend `mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts` (it already has the fake-root, real dual launchers, `leaseDaemonPid`, `isAlive`, `pgrepContains`, `waitForExit`). Add a **third** case — *fresh session started AFTER dispose* (distinct from the existing "secondary joins while owner alive" cases, which exercise the bridge path and stay green):

```ts
it('flag ON: a FRESH session after owner disposal reaps the released daemon (single writer)', async () => {
  const paths = buildFakeRoot();
  const owner = await startSession(paths, true);
  expect(await statsOk(owner.client)).toBe(true);
  const orphanPid = leaseDaemonPid(paths.base)!; track(orphanPid);

  owner.child.kill('SIGTERM');                 // dispose -> daemon RELEASED (survives)
  await waitForExit(owner.child.pid!, 8_000);
  await delay(1_200);
  expect(isAlive(orphanPid)).toBe(true);       // released, not killed

  const fresh = await startSession(paths, true);   // FRESH launcher AFTER dispose
  expect(await statsOk(fresh.client)).toBe(true);
  const newPid = leaseDaemonPid(paths.base)!; track(newPid);
  await delay(500);

  // Single-writer invariant — RED today, GREEN after the fix:
  expect(isAlive(orphanPid)).toBe(false);      // orphan reaped (today: still ALIVE -> fails)
  expect(newPid).not.toBe(orphanPid);
  expect(isAlive(newPid)).toBe(true);
});
```

For a rigorous co-residency proof, also assert **exactly one** pid holds the sqlite open, reusing the repro's `lsof +D <dbDir>` opener-count technique (`reelect-doublewriter.cjs:43` `dbOpeners`) → distinct pids over `*.sqlite*` must be `1`. The `isAlive(orphanPid) === false` assertion is the minimal RED→GREEN signal; the lsof count is the airtight version.

---

**Summary** — VERDICT: **CONFIRMED**. RECOMMENDED FIX: **Option (a)**, reap `lease.childPid` via `reapLeaseChildBeforeRespawn` inside `main()`'s `staleReclaimable` branch (L1480–1482), guarded by the owner-lease `O_EXCL` mutex, with an EPERM bail-out; proven by a new fresh-session-after-dispose case in `daemon-reelection-adoption-live.vitest.ts` asserting the orphan is reaped and a single writer remains. Option (b) is a future enhancement, not the fix. *(Read-only analysis — no files edited.)*
