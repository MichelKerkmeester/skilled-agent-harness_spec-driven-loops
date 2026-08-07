# Council brief: daemon re-election fresh-session double-writer

## Repo
`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`

## Background
`SPECKIT_DAEMON_REELECTION` makes the shared mk-spec-memory daemon survive its owning
session: on owner disposal the launcher RELEASES the detached daemon (keeps it alive)
instead of killing it, so a live secondary keeps MCP transport. It was just defaulted
ON in all 3 runtime configs (`.claude/mcp.json`, `opencode.json`, `.codex/config.toml`)
and shipped as changelog v3.5.0.4, which claims: "the downside is bounded ... an
unadopted released daemon self-exits at the idle timeout, so the worst case matches the
prior kill-on-disposal behavior."

## The finding to verify/refute (CLAIM)
A FRESH session started AFTER the owner disposed does NOT adopt the released daemon.
Instead the fresh launcher treats the kept lease as stale (because lease liveness keys
on the dead OWNER pid, not the alive daemon childPid), RECLAIMS it, and spawns a SECOND
daemon on the SAME DB dir WITHOUT reaping the orphan. Result: two daemons holding the
same `context-index.sqlite` (WAL) open simultaneously for up to the idle timeout
(default 30 min). Before re-election, owner disposal KILLED the daemon, so a cold
restart got a single clean writer -> this is a regression that default-on introduced,
contradicting the "worst case matches prior behavior" claim.

## Evidence already gathered
- Post-dispose lease `.mk-spec-memory-launcher.json` = `{pid: <ownerPid, DEAD>, ownerPid:
  <DEAD>, childPid: <daemon, ALIVE>, socketPath: ...}`. The daemon is still listening.
- Fresh launcher logs `staleReclaimed: true`, then spawns a new daemon (different pid).
- `lsof` over 60s shows BOTH the orphan daemon and the new daemon holding
  `context-index.sqlite` + `-wal` + `-shm` open at the same time.
- The daemon has its own idle monitor: `dist/context-server.js` ~L1818
  `onIdle: () => fatalShutdown('Launcher idle timeout reached...', 0)` (default 30 min),
  so the orphan is bounded, not a permanent leak.

## Key code locations (`.opencode/bin/mk-spec-memory-launcher.cjs`)
- `shutdownLauncherForSignal` ~L1357: the release path ~L1366-1383 keeps the daemon
  lease "for adoption", drops only ownership, exits without killing the daemon.
- `leaseHeldFromFile` ~L554-569: `process.kill(lease.pid, 0)` — keys liveness on
  `lease.pid` (= owner launcher pid), returns `staleReclaimable` when owner is dead.
- `isLeaseHeld` ~L572; `main()` startup branches: lease held -> `bridgeOrReportLeaseHeld`
  (bridge to daemon); not held but staleReclaimable -> reclaim + become owner + spawn.
- `respawnAfterDeadSocket` ~L747 + `reapLeaseChildBeforeRespawn` ~L689: an EXISTING path
  that DOES reap a recorded childPid before respawn — but only on the "lease held, socket
  dead" branch, NOT on the "stale owner, daemon alive" reclaim branch.

## Reproduce (isolated, production-safe — uses a temp fake-root, never touches the real lease/DB)
```
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
node .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/028-live-session-reelection-validation/scratch/reelect-doublewriter.cjs
```
(Other harnesses in the same scratch dir: `reelect-live-test.cjs` runs both arms of the
live two-session adoption test; the permanent vitest is
`mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts`.)

## Questions to answer
1. VERIFY/REFUTE: is the fresh-session double-writer real as described? Cite the exact
   code paths and (if you can run shell) the repro output.
2. SEVERITY: how bad under SQLite WAL multi-process (corruption risk? checkpoint/WAL
   growth? lock contention?), and is it genuinely a regression vs the pre-re-election
   kill behavior?
3. FIX: the minimal correct launcher change. Candidate options:
   (a) on stale-lease reclaim, if `lease.childPid` is alive, reap it before spawning
       (mirror `reapLeaseChildBeforeRespawn`);
   (b) true adoption: if `childPid` alive + socket live, BRIDGE instead of reclaim
       (key `isLeaseHeld` partly on childPid liveness for the bridge decision);
   (c) keep default-OFF until fixed.
   Recommend ONE primary approach with exact function/line targets, edge cases (races
   between two fresh launchers, the respawn lock, the owner-lease), and what test proves it.

Return a structured verdict: VERDICT (confirmed/refuted), SEVERITY (low/med/high + why),
RECOMMENDED FIX (approach + locations + risks + test). Be concise and specific.
READ-ONLY: do not edit/create/delete any repo file.
