# Research: code-index daemon reclaim hardening (prevent the wedge recurrence)

**Subject:** Prevent recurrence of the Code Graph daemon wedge — a PID-alive-but-socket-dead daemon the launcher does not reclaim, causing MCP reconnect `-32000`.
**Method:** 10-iteration deep research, executor `zai-coding-plan/glm-5.2 --variant high` (max thinking), COSTAR. Iters 1-9 converged; iter 10 (test-design) timed out but its content is recoverable from the design below.
**Target file:** `.opencode/bin/mk-code-index-launcher.cjs` (+ `launcher-ipc-bridge.cjs`, child `system-code-graph/mcp_server/dist/index.js` `initDb`).

## Root cause (converged)

Liveness is **bidimensional** — `processLiveness` proves only `process.kill(pid,0)` (PID exists), and the heartbeat is written by the **launcher**, not gated on the daemon's ability to serve. There is **zero socket-health correlation**. So a wedged daemon (PID alive, 0% CPU, socket never (re)created) classifies as `live-owner` / `held:true`. The inert branch is `maybeBridgeLeaseHolder`'s no-socket path (bridge `L405-408`): when the lease says "held" but the socket FILE is missing, it `report`s instead of respawning. Two compounding axes in the incident: (a) the lease file had also vanished from an empty socket dir, so the heartbeat-reclaim (which needs a lease file with an aging `lastHeartbeatIso`) never had anything to age out; (b) a 17 MB orphaned WAL from the unclean crash.

**Liveness must be tridimensional: PID-alive AND socket-serving AND heartbeat-fresh.**

## Converged hardening design

1. **Reuse the existing probe.** `launcher-ipc-bridge.cjs:probeDaemon({deepProbe:true})` (~L150-236) already connects the UDS + sends a JSON-RPC `initialize`. Wrap it as `probeExistingService(socketPath)` returning `{status, kind}` where `kind ∈ {enoent, econnrefused, timeout, json-rpc-reply}`.
2. **Socket-health gate in classification.** Add a `live-but-dead-socket` state to `classifyOwnerLease` and mirror it in `leaseHeldFromFile` (after the `process.kill(pid,0)` success at `~L602`): if `socketPath` is missing/dead (fast-path `!existsSync`, else N-consecutive deep-probe failures), return `staleReclaimable:true` instead of `held:true`. Extend the reclaimable allowlist (`~L479-484`) — the existing `unlink + O_EXCL` CAS handles it atomically, no CAS change.
3. **No-bridge-socket → respawn, not report.** Change bridge `L405-408` to route a socketless-but-live owner into the existing `respawnAfterDeadSocket → reapOwnerBeforeRespawn` pipeline.
4. **Startup grace window** (so a *starting* daemon isn't killed): `STARTUP_GRACE_MS=30000`, `MAX_INIT_MS=120000` (env-overridable), keyed on a new `childSpawnedAtIso` stamped right after the child PID is known — NOT `startedAtIso` (which precedes the bootstrap-lock wait + first build). `age ≤ grace` → still-starting (report); `grace < age ≤ max` → bounded socket re-poll; `age > max` → respawn (`startup-deadline-exceeded`).
5. **Socket-gated heartbeat.** Refresh `lastHeartbeatIso` only when the socket is actually serving; on probe failure, stop heartbeating so a dead-socket daemon ages out into `stale-heartbeat-reclaim` within 2 min. Ideally move heartbeat ownership into the daemon child (refresh only after its IPC listener echoes).
6. **Crash-surviving PID registry + self-heal on acquire.** Write `.code-graph-daemon-pid.json` (`{daemonPid, launcherPid, socketPath, startedAt, canonicalDbDir}`) right after the child PID is known; unlink only on clean child exit. On acquire, discover the orphan via `reclaimedOrphanPid → that registry → lsof on the WAL`, and reap (SIGTERM→grace→SIGKILL) **only** when `alive AND socket provably dead (N consecutive failures)**, then checkpoint, then spawn.
7. **WAL startup hygiene.** Before spawn: if `code-graph.sqlite-wal` exceeds a threshold (~8 MB) or an orphan was just reaped, run `wal_checkpoint(TRUNCATE)` (no other writer holds it). Set `wal_autocheckpoint=500` (~2 MB, tunable) in `initDb`. Checkpoint before the migration copy so a giant `-wal` is never propagated.
8. **Race + permission safety.** Apply the uid check to the PRIMARY lease (not just `legacyPath`) and to the socket owner — never unlink/bridge/kill a foreign-owned lease. Before any SIGKILL, verify PID identity (cmdline basename + process start-time vs `startedAtIso`) to avoid killing a PID-reuse victim; on mismatch log `pid-reuse-suspected` and abort. Re-stat the lease between classify and unlink (abort if changed). Gate self-heal behind a one-shot `.self-heal-attempted` marker so a failed heal never loops into a kill storm.
9. **One-line diagnostics.** Emit `LAUNCHER_DIAGNOSTIC: reason=<token> ownerPid=<n> socketPath=<p> walHeldBy=<pid|none>` on every failure exit. Tokens: `dead-socket-reclaimed`, `startup-timeout`, `foreign-owner`, `wal-locked-by-orphan`, `bridge-socket-refused`, `pid-reuse-suspected`, `stale-heartbeat-reclaimed`. Replaces manual lsof/ps forensics.

## Test plan (deterministic wedge simulation)

- **Wedge → reclaim:** spawn a fake owner that writes the lease + holds a live PID but never opens the socket; past `MAX_INIT_MS`, assert the launcher reclaims (reaps + respawns) and emits `dead-socket-reclaimed`.
- **Still-starting → not killed:** owner within `STARTUP_GRACE_MS` with no socket yet → assert NOT killed (`still-starting`).
- **Foreign-owner → not killed:** lease/socket owned by a different uid → assert no signal, `foreign-owner` diagnostic.
- **PID-reuse → not killed:** live PID whose cmdline/start-time mismatch the lease → `pid-reuse-suspected`, abort.
- **Oversized WAL → checkpointed:** seed an 8MB+ `-wal` with no holder → assert `wal_checkpoint(TRUNCATE)` runs pre-spawn and WAL shrinks.
- **Healthy owner → bridged:** live PID + serving socket → assert bridge, no reclaim.

## Recommendation

Implement components **1-3 + 4 + 7** as the P0 core (they directly close the incident class), then **6, 8, 9** as the durability/safety layer, then **5** (heartbeat) as defense-in-depth. The minimal P0 (socket-health gate + reclaim-on-dead-socket past a grace window + startup WAL hygiene + diagnostics) collapses both failure axes from the incident.

---

<!-- ANCHOR:sources -->
## Sources

- Launcher under study: `.opencode/bin/mk-code-index-launcher.cjs`, `.opencode/bin/launcher-ipc-bridge.cjs`, and the child `system-code-graph/mcp_server/dist/index.js` (`initDb`).
- source: live incident forensics, 2026-06-29 — orphaned PIDs 37269/37358 at 0% CPU, empty `/tmp/mk-code-index/`, a 17 MB `code-graph.sqlite-wal` with no holder, DB integrity ok; manual recovery via `kill` + `PRAGMA wal_checkpoint(TRUNCATE)` + socket-dir clean.
- source: 10-iteration GLM-5.2 (max thinking) deep research, iterations `iteration-001` through `iteration-010` in this folder; per-angle insights/recommendations in `angles.json`.
<!-- /ANCHOR:sources -->

