[0m
> build · glm-5.2
[0m
[0m→ [0mRead .opencode/bin/mk-code-index-launcher.cjs
[0m→ [0mRead .opencode/bin/lib/launcher-ipc-bridge.cjs
```json
{
  "angle": "exact-failure-path",
  "insights": [
    "ROOT: liveness is decided by process.kill(pid,0) + a heartbeat that the LAUNCHER (P1) writes, with ZERO socket-health correlation. leaseHeldFromFile L602-603 and classifyOwnerLease L455-472 both treat a hung daemon that is alive in the process table but never bound/lost its IPC socket as fully healthy. A hung P1 that keeps heartbeating (setInterval L399) while its child daemon C1 is wedged is classified live-owner FOREVER — ppid-1-orphan (L461) only fires when P1 is DEAD; the 2×ttlMs=120s stale-heartbeat window (L467) only trips when the heartbeat stops. So the precise un-reclaimable state is: P1 alive+heartbeating, C1 alive but not serving. None of the three reclaim signals (stale-pid / ppid-1-orphan / stale-heartbeat-reclaim) can fire.",
    "THE WEDGE POINT is launcher-ipc-bridge.cjs maybeBridgeLeaseHolder L405-408: when the holder PID is reported held:true by the launcher (L603) but the socket FILE is absent, fs.existsSync(socketPath) is false → it returns {action:'report', reason:'no-bridge-socket'} and writes LEASE_HELD_BY:<pid> (no-bridge-socket). It NEVER reaches the deep probe at L418-425, so it NEVER returns action:'respawn' (which only comes from probe.status!=='alive' at L426-429). The entire reap+respawn machine (respawnAfterDeadSocket L668, reapOwnerBeforeRespawn L640) is gated BEHIND action:'respawn' — a missing-socket holder short-circuits to report BEFORE the probe that would have authorized a reap.",
    "Consequence in launcherMain: bridgeOrReportLeaseHeld (L719-754) receives decision.action==='report', so it skips the respawn branch (L728), emits a heldByOther metric (L745), returns, and launcherMain returns at L1082 (owner-lease-held path) or L1089 (pid-lease-held path). The runtime is handed LEASE_HELD_BY:<pid> with no usable transport → its MCP client connects to a non-existent/refused socket → JSON-RPC -32000.",
    "Lease-FILE-gone sub-path: if .mk-code-index-launcher.json is absent, leaseHeldFromFile L584 returns held:false immediately, isLeaseHeld (L612-623) falls through, launcherMain skips bridging (L1086) and spawns a successor. BUT this only executes if the OWNER lease (.code-graph-owner.json) was ALSO reclaimable. If the owner lease was wiped too, reclaimedOrphanPid stays null (L1048) so the reap guard at L1174-1180 has nothing to kill → new child C2 opens the same SQLite DB alongside the still-live orphan C1 → writer collision, the 17MB WAL grows unbounded, C2 blocks/errors → -32000 again. The reap guard depends entirely on the prior owner lease having survived to name C1; a double-wipe produces a silent collision.",
    "Even in the recovery-favorable case (P1 dead), there is a 120s blind window: classifyOwnerLease needs Date.now()-heartbeatMs > ttlMs*2 (L467) before it returns stale-heartbeat-reclaim. For the full 120s after P1 dies while C1 is wedged, every secondary reconnect gets live-owner → no-bridge-socket → -32000. The heartbeat is the only freshness signal and it has no socket correlation, so 'fresh heartbeat' does not imply 'serving IPC'.",
    "ownerSocketPath() (L371-379) and buildOwnerLease socketPath (L419) record the computed path at WRITE time, but nothing ever re-validates that the recorded path is bound. The socketPath field is surfaced to the bridge (L587) but only as a connect TARGET, never as a health signal feeding back into held/staleReclaimable.",
    "The deep-probe logic that DOES exist (probeLeaseHolderWithRetries, deepProbe:true L355) is correct and would catch a hung-but-accepting daemon — but it is structurally unreachable for the missing-socket case because of the L405 existence guard that returns 'report' first. The right machinery is present; it is just placed after the wrong early-return."
  ],
  "recommendations": [
    {
      "change": "Treat a held-lease with a missing socket FILE as respawn-eligible, not report-only. Change the L405-408 branch to return {action:'respawn', reason:'no-bridge-socket', socketPath} instead of {action:'report',...} when leaseResult.ownerPid is alive. This routes the existing respawn/reap pipeline (respawnAfterDeadSocket → reapOwnerBeforeRespawn) at a holder whose socket is gone. Keep a single guard: if the holder PID is itself dead (staleReclaimable), keep returning report/stale so the normal reclaim path in launcherMain handles it.",
      "where": "launcher-ipc-bridge.cjs:maybeBridgeLeaseHolder/L405-408",
      "why": "This is the single decision that turned a recoverable dead-socket into a permanent -32000. The probe that authorizes reap is currently placed after an early-return that fires exactly when reap is needed."
    },
    {
      "change": "Add a bounded socket-existence (or connect-ok) check into classifyOwnerLease before returning 'live-owner'. If lease.socketPath is set and fs.existsSync is false (and not tcp://), downgrade 'live-owner' to a new 'live-pid-dead-socket' classification that acquireOwnerLeaseFile treats as reclaimable (reclaim + record orphanPid for reap). Gate it behind the existing uid/legacy guards so foreign-owned paths are not probed.",
      "where": "mk-code-index-launcher.cjs:classifyOwnerLease/L455-472 (and acquireOwnerLeaseFile L478-484 to treat the new class as reclaimable)",
      "why": "The owner-lease gate is the first decision; if it returns live-owner for a hung P1+missing-socket C1, no secondary ever reaches the bridge's probe. Socket-health must feed the SAME decision that grants the single-writer lease."
    },
    {
      "change": "Add the same socket-health correlation to leaseHeldFromFile: after process.kill(pid,0) succeeds (L602), if lease.socketPath is present and not tcp:// and !fs.existsSync, return {held:false, ownerPid, staleReclaimable:true} with a 'dead-socket' reason instead of held:true. This makes the L1086/L1091 branches in launcherMain treat a socket-less holder as reclaimable and emit the staleReclaimed metric + reap path.",
      "where": "mk-code-index-launcher.cjs:leaseHeldFromFile/L601-609",
      "why": "held:true/staleReclaimable:false (L603) is the exact misclassification the incident hinged on; it must reflect IPC servability, not just process-table presence."
    },
    {
      "change": "Add an orphan-detection fallback for the double-wipe case (both lease files gone, live holder still holding the DB). Before writeLeaseFile()/launchServer() in launcherMain (L1182-1189), when isLeaseHeld returned held:false AND no reclaimedOrphanPid was recorded, probe for a live process holding code-graph.sqlite (lsof/fuser or a non-blocking open-with-BUSY check on the -wal). If a holder is found, treat it as reclaimedOrphanPid and run reapOwnerBeforeRespawn before spawning.",
      "where": "mk-code-index-launcher.cjs:launcherMain/L1085-1097 and L1174-1180",
      "why": "The current reap guard is purely lease-driven; with no lease file naming C1, the launcher spawns C2 straight into a SQLite writer collision (the 17MB orphaned WAL). The lease is advisory metadata; the DB lock is ground truth."
    },
    {
      "change": "Move the serving-heartbeat ownership from the launcher (P1) to the daemon (C1), or add a daemon-written 'lastServedIso' field updated from inside the MCP server's event loop (e.g. after each request handled). Have classifyOwnerLease require lastServedIso freshness, not just P1's lastHeartbeatIso. Keep P1's heartbeat as a secondary launcher-alive signal.",
      "where": "mk-code-index-launcher.cjs:startOwnerLeaseHeartbeat/L394-408 + buildOwnerLease/L410-421; daemon side in mcp_server/dist",
      "why": "P1 heartbeating proves P1 is alive, not that C1 is serving. The incident's permanent wedge requires P1 alive+heartbeating while C1 is wedged; a serving heartbeat written only by a responsive C1 makes that state detectable."
    },
    {
      "change": "Reduce the stale-heartbeat blind window (L467 ttlMs*2 = 120s) for the dead-socket sub-signal: once socket-existence is part of the classification (recs above), a missing socket should bypass the heartbeat TTL entirely and reclaim immediately, since a missing socket is not a transient-busy condition the TTL was designed to absorb.",
      "where": "mk-code-index-launcher.cjs:classifyOwnerLease/L465-469",
      "why": "The 120s TTL protects a busy daemon mid-FTS-merge from false reaping; that rationale does not apply to a socket that is simply absent. Conflating the two prolongs every dead-socket outage by the full TTL."
    }
  ],
  "risks": [
    "Reclassifying no-bridge-socket as respawn can false-reap a daemon that is mid-(re)start — socket transiently absent between unlink and rebind. Mitigate with the existing probe-retry discipline (resolveLeaseProbeAttempts, L52-54) applied even on the missing-socket branch: require N consecutive existence/probe failures across a short window before reaping.",
    "Adding fs.existsSync/socket probes to the hot lease path adds latency to every launcher start; bound it (existence check is sub-ms, but a connect probe must keep the <7000ms grace ceiling) and skip for tcp:// and foreign-uid legacy paths.",
    "Downgrading live-owner to reclaimable on a missing socket changes concurrency semantics: two secondaries could both see reclaimable and both unlink+O_EXCL — the existing CAS (acquireOwnerLeaseFile L491-505) already serializes this, but the reap+respawn inside respawnAfterDeadSocket must continue to hold the bootstrap lock so only one reaper kills C1.",
    "lsof/fuser orphan detection (rec 4) is platform-dependent (darwin vs linux) and may itself need elevated permissions under sandbox; a pure-SQLite approach (attempt open with busy_timeout=0) is more portable but can itself block on a wedged writer.",
    "A serving-heartbeat written by C1 (rec 5) couples the daemon binary to the lease format; ensure back-compat read of leases lacking lastServedIso (treat as P1-heartbeat-only, the current behavior) so a rolling upgrade does not classify every existing owner as stale.",
    "If respawn-on-missing-socket is enabled while SPECKIT_BRIDGE_RESPAWN_DISABLED=1 (L669), the respawn is still inert — the env kill-switch must be documented as the only way to suppress the new recovery, otherwise operators expecting the old report-only behavior will see unexpected reaps."
  ]
}
```
