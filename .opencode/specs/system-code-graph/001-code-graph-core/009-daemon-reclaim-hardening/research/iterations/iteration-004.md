[0m
> build · glm-5.2
[0m
[0m→ [0mRead .opencode/bin/mk-code-index-launcher.cjs
[0m→ [0mRead .opencode/bin/lib/launcher-ipc-bridge.cjs
```json
{
  "angle": "startup-grace-window",
  "insights": [
    "The wedge lives in maybeBridgeLeaseHolder's no-socket branch (launcher-ipc-bridge.cjs:405-408): when the PID lease says 'held' but the socket FILE is absent, it only emits LEASE_HELD_BY…(no-bridge-socket) and returns {action:'report'}. It never reaches the respawn path, so a live-but-socketless PID is reclaimed by NOTHING. The deep-probe/respawn machinery (bridge:418-429 → launcher respawnAfterDeadSocket L668-717) only fires on an existing-but-dead socket, not a missing one.",
    "classifyOwnerLease's stale-heartbeat-reclaim (launcher.cjs:465-468) does NOT cover this wedge: it needs the owner lease FILE present and keys off lastHeartbeatIso > ttlMs*2 (120s). The heartbeat proves only the LAUNCHER process is alive (startOwnerLeaseHeartbeat L399-406 runs in the launcher), NOT that the spawned MCP child ever bound its socket. A wedged child behind a live launcher keeps heartbeating forever and never trips stale-heartbeat-reclaim. Heartbeat advancing ≠ socket readiness; do not use lastHeartbeatIso to gate the no-socket decision.",
    "The lease's single usable startup timestamp is startedAtIso (buildOwnerLease L410-421, written once at acquire). It is already flowed into the bridge via launcher.cjs:1077 (startedAt: holder.startedAtIso), so maybeBridgeLeaseHolder has the age signal in hand at the no-socket branch.",
    "A legitimately-starting daemon writes both lease files BEFORE spawning the child (writeLeaseFile L1182 precedes launchServer L1189), and the child creates the socket asynchronously after spawn. So 'lease present + no socket' is the expected transient state for every cold start; reclaiming it eagerly would kill healthy spawns. The 2-min stale-heartbeat threshold (ttlMs*2, L467) and BOOTSTRAP_LOCK_TIMEOUT_MS=120000 (L870) already establish 120s as the house ceiling for init lateness — reuse it as the max-init deadline.",
    "The incident's 'lease file gone + orphan WAL' is a distinct, worse failure mode: with no owner lease file, acquireOwnerLeaseFile (L474-515) sees nothing to reclaim, reclaimedOrphanPid stays null (L1066), and the second writer spawns against a DB the orphan still holds. A grace window cannot help when the source-of-truth file is missing — that needs a separate DB-level 'writer-present without live lease' probe (wal/journal-holder check), out of scope for this angle but must be flagged."
  ],
  "recommendations": [
    {
      "change": "In the no-bridge-socket branch of maybeBridgeLeaseHolder, replace the unconditional report with a 3-state classifier keyed on owner-lease age (now − startedAtIso): (1) age <= STARTUP_GRACE_MS → {action:'report', reason:'still-starting'} (do NOT kill); (2) STARTUP_GRACE_MS < age <= MAX_INIT_MS → retry fs.existsSync(socketPath) on a short bounded poll (e.g. 3× @ 1s) and only report if still absent; (3) age > MAX_INIT_MS → return {action:'respawn', reason:'startup-deadline-exceeded'} so it flows into the existing respawnAfterDeadSocket reap+respawn path.",
      "where": ".opencode/bin/lib/launcher-ipc-bridge.cjs:maybeBridgeLeaseHolder (lines ~405-408, the `if (!fs.existsSync(socketPath))` block)",
      "why": "This is the exact point where the wedge currently dead-ends. Routing the over-deadline case to action:'respawn' reuses the proven reap (SIGTERM→RESPAWN_REAP_GRACE_MS→SIGKILL, launcher.cjs:640-666) + lease re-acquire + relaunch instead of inventing a second kill path."
    },
    {
      "change": "Add constants STARTUP_GRACE_MS=30000 and MAX_INIT_MS=120000, both env-overridable via SPECKIT_LAUNCHER_STARTUP_GRACE_MS / SPECKIT_LAUNCHER_MAX_INIT_MS (mirror the existing parsePositiveInteger pattern at bridge L21-25). Rationale: 30s grace > observed healthy socket-bind latency (child binds within seconds; 30s absorbs FTS/model-init jitter); 120s max-init aligns with ttlMs*2 (L467) and BOOTSTRAP_LOCK_TIMEOUT_MS (L870) so the system has one init-latency ceiling.",
      "where": ".opencode/bin/lib/launcher-ipc-bridge.cjs (top-level consts near L14-16) + parsed in resolveProbeTimeoutMs siblings",
      "why": "Concrete, tunable bounds instead of magic numbers; 120s matches the existing house ceiling so a socketless PID is never tolerated longer than a bootstrap lock or a stale heartbeat."
    },
    {
      "change": "Add childSpawnedAtIso to the owner lease, stamped in launchServer right after the child pid is known (refreshOwnerLeaseFile call at launcher.cjs:974-978), and prefer it over startedAtIso as the grace-window clock. startedAtIso is set at lease acquire (L415) which precedes bootstrap-lock wait + npm/tsc build (acquireBootstrapLock L921-953, buildIfNeeded L847-867) — using it would let a slow first-build consume the entire grace window before the child even exists.",
      "where": ".opencode/bin/mk-code-index-launcher.cjs:buildOwnerLease (L410-421 schema), launchServer (L974-978 stamp), readOwnerLeaseFile validation (L327-336 add field as optional-but-preferred)",
      "why": "The grace window must measure time since the CHILD was spawned (the thing that creates the socket), not since the launcher took the lease. Without childSpawnedAtIso, MAX_INIT_MS can false-positive on a cold-machine first build."
    },
    {
      "change": "Make the respawn decision in the no-socket branch pass the ownerPid explicitly (it is already in leaseResult.ownerPid, surfaced by leaseHeldFromFile L582-610 and ownerSocketPath L371-379) so respawnAfterDeadSocket's reapOwnerBeforeRespawn (L640-666) targets the correct pid — the recorded child/owner, not a recomputed guess.",
      "where": ".opencode/bin/lib/launcher-ipc-bridge.cjs:maybeBridgeLeaseHolder return at the new deadline-exceeded branch → consumed by bridgeOrReportLeaseHolder (launcher.cjs:719-754) → respawnAfterDeadSocket (launcher.cjs:668-717, uses options.respawnChildPid)",
      "why": "respawnAfterDeadSocket already requires options.respawnChildPid (L674-679) and aborts as 'missing-child-pid' if absent; the no-socket branch must supply it from the lease or the reclaim silently no-ops."
    },
    {
      "change": "Before force-reclaim in the deadline-exceeded branch, re-run classifyOwnerLease on the live lease (launcher.cjs:455-472) as a belt-and-suspenders cross-check: if it already returned stale-heartbeat-reclaim or ppid-1-orphan, the reclaim is corroborated and should proceed unconditionally; if it returns live-owner (heartbeat fresh) despite the missing socket, that is the strongest possible wedge signature (launcher alive, child socketless) — reclaim and log it loudly as 'launcher-alive-socketless-child'.",
      "where": "Plumb the current owner lease into the bridge call (launcher.cjs:1075 already has holder), or do the classify in bridgeOrReportLeaseHolder (launcher.cjs:728-744) before dispatching respawn",
      "why": "Avoids a single timestamp being the only thing between a healthy daemon and a SIGKILL; the dual signal (age > MAX_INIT_MS AND classifyOwnerLease non-live-or-socketless) is the safe gate."
    }
  ],
  "risks": [
    "A genuinely slow first init (large repo, cold npm ci + tsc + first scan) on an underpowered machine could exceed MAX_INIT_MS=120s and get force-killed mid-build. Mitigation: childSpawnedAtIso gates the clock to post-spawn only, and the env override lets operators raise it; log the reclaim reason so it is diagnosable.",
    "Polling fs.existsSync in the grace-to-deadline middle zone (recommendation 1, state 2) adds latency to MCP reconnect for a socketless owner; bound it to <=3s total and fall through to report if still absent so the runtime sees LEASE_HELD_BY promptly.",
    "tcp:// socket endpoints bypass the existence check (bridge L405 short-circuits on startsWith('tcp://')), so the grace-window logic only applies to UDS file-backed sockets; a tcp owner that never binds is still a no-bridge-socket dead-end and needs the same age-based treatment via a connect probe instead of existsSync.",
    "If the owner lease file itself was deleted (the incident's 'lease file gone'), startedAtIso/childSpawnedAtIso are unrecoverable and the grace window cannot fire — acquireOwnerLeaseFile (L474-515) will simply take a fresh lease and spawn a second writer against the orphan-held DB. This angle does NOT fix that; it requires a separate DB-holder liveness probe (journal/WAL owner check) and must be tracked as its own hardening item.",
    "Reaping a launcher whose child is mid-write could leave the 17MB WAL orphan again unless wal_checkpoint(TRUNCATE) runs after reap and before respawn; respawnAfterDeadSocket (L668-717) currently does no DB checkpoint — add an explicit checkpoint step after reapOwnerBeforeRespawn succeeds."
  ]
}
```
