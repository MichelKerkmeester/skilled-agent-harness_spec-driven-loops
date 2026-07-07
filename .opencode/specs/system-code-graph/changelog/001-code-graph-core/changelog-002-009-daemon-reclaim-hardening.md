---
title: "Changelog: Code-Graph Daemon Reclaim Hardening [002-code-graph/009-daemon-reclaim-hardening]"
description: "Chronological changelog for the daemon-reclaim-hardening phase: tridimensional-liveness reclaim of a wedged code-index daemon."
trigger_phrases:
  - "phase changelog"
  - "daemon reclaim hardening changelog"
  - "code-index -32000 hardening"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-29

> Spec folder: `.opencode/specs/system-code-graph/001-code-graph-core/009-daemon-reclaim-hardening` (Level 1)
> Parent packet: `.opencode/specs/system-code-graph/001-code-graph-core`

### Summary

The `mk_code_index` MCP server failed to reconnect with `-32000` after the code-index daemon crashed uncleanly: two orphaned processes stayed alive (0% CPU) that had never re-created their IPC socket, the owner-lease file had vanished, and a 17 MB orphaned WAL sat with no holder. Root cause: the launcher decided liveness from `process.kill(pid,0)` plus a launcher-written heartbeat with zero socket-health correlation, so a PID-alive-but-socket-dead daemon classified as a healthy held owner and was never reclaimed. This phase makes liveness **tridimensional** (PID + socket-serving + heartbeat) and self-healing. A 10-iteration GLM-5.2 (max thinking) deep research produced the design; a 5-iteration GPT-5.5 (xhigh) adversarial cross-check refined it (verdict sound-with-fixes); GPT-5.5 high/fast then implemented it across nine small, individually-verified chunks (the two single-shot mega-dispatches timed out mid-edit and were reverted to known-good). 31 tests pass across 6 files with no regression. All new behavior is gated by `reclaimDeadSocketEnabled()` (kill-switch, default on).

### Added

- `probeExistingService(socketPath)` in `lib/launcher-ipc-bridge.cjs` — normalizes `probeDaemon`'s result into `{status, kind}` so the launcher can tell a serving daemon from a dead socket.
- Pure `classifyOwnerReclaim` compound-predicate decision (reclaim only on dead-socket AND aged-heartbeat AND past `MAX_INIT_MS`); `classifyLiveOwnerReclaim` async wrapper.
- `ownerUidMatches` + `verifyPidIdentity` kill-guards (never signal a foreign-uid or PID-reuse process) with a final post-lock socket veto.
- Startup WAL hygiene: `checkpointStaleWalIfNeeded` (truncates an oversized/orphaned WAL pre-spawn, sqlite3-CLI fallback when the better-sqlite3 ABI mismatches) + a `wal_autocheckpoint` cap in the child `initDb`.
- Conditional-CAS guard `staleLeaseUnchanged` (re-stat the stale lease before unlink so a concurrent successor is never clobbered).
- Crash-surviving `.code-graph-daemon-pid.json` registry + `discoverDaemonFromRegistry` so a lingering orphan is reapable even when both lease files vanished.
- `STARTUP_GRACE_MS`/`MAX_INIT_MS`/`SPECKIT_LAUNCHER_RECLAIM_DEAD_SOCKET` env controls, `childSpawnedAtIso` lease field, and a one-line `LAUNCHER_DIAGNOSTIC` emitter.
- A hermetic test suite (decision, guards, reclaim e2e, WAL hygiene, CAS, PID registry).

### Changed

- The launcher acquisition/reclaim path now routes a live-PID-dead-socket owner into the guarded reap+respawn pipeline past the startup grace window, with child-PID threading so respawn reaps instead of reporting `missing-child-pid` — all behind the kill-switch (off restores the prior PID+heartbeat behavior).

### Follow-Ups

- **Production soak**: the new launcher logic activates on the next daemon launch; restart-and-observe would confirm the 30s/120s grace/max-init defaults under a real workload.
- **better-sqlite3 ABI**: the system-code-graph prebuilt targets a different ABI than the v22.23.1 runtime, so the WAL checkpoint uses the sqlite3-CLI fallback; a `npm rebuild better-sqlite3` realigns it (verify the daemon's DB ops first).
