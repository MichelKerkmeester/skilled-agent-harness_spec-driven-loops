---
title: "MCP launcher owner-disposal relaunch gate"
description: "The mk-spec-memory launcher aborts a scheduled daemon relaunch when its owning MCP runtime has exited, stopping the SIGTERM/relaunch flap that dropped bridged transports, while leaving crash-recovery and RSS-recycle relaunch intact."
trigger_phrases:
  - "launcher owner disposal relaunch gate"
  - "daemon relaunch flap guard"
  - "owner ppid changed relaunch abort"
  - "mcp transport drop on session end"
  - "shouldAbortRelaunchOnFire"
---

# MCP launcher owner-disposal relaunch gate

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The launcher owns the shared mk-spec-memory daemon for the MCP host that spawned it. When that host disposes its session it sends SIGTERM to the daemon child, and the launcher's child-exit supervisor schedules a relaunch on a short backoff. When that relaunch fired under the disposing runtime, the fresh daemon was killed again about a second later, and every session bridged to that daemon lost its MCP transport.

The owner-disposal relaunch gate re-checks reality at the moment the backoff fires. If the launcher is shutting down, or its owning runtime has gone away, it releases the owner lease and exits cleanly instead of respawning. Crash-recovery and RSS-recycle are untouched: both run with the owner alive, so the gate is a no-op for them and the daemon relaunches as before.

## 2. HOW IT WORKS

### Owner identity capture

The launcher captures `LAUNCHER_INITIAL_PPID` once at module load. The MCP host (Claude Code / OpenCode) spawns the launcher directly, so the initial parent pid is the owning runtime. A later parent pid that no longer matches it, or has reparented to the init/subreaper pid 1, is a reliable "owning runtime gone" signal.

### Fire-time relaunch gate

`scheduleRelaunch` still schedules the normal child-exit backoff. When the timer fires it evaluates `shouldAbortRelaunchOnFire({ shuttingDown, currentPpid, initialPpid })`. When that returns true the launcher logs the abort, calls `clearAllLeaseFiles`, and exits 0; otherwise it calls `launchServer` and the daemon respawns.

### Pure, testable predicate

`shouldAbortRelaunchOnFire` lives in the supervision library `model-server-supervision.cjs` next to the other pure relaunch-decision helpers (`shouldSkipLaunch`, `superviseChildExit`), and the launcher re-exports it. Keeping it pure, it takes the shutdown flag and both pids as arguments rather than reading process globals, so the watchdog suite asserts every branch without spawning a process.

### Recovery paths stay active

The gate is additive. Crash-recovery and the in-place RSS-recycle (`recycleDaemonInPlace`) both schedule their relaunch with the owner process alive and no shutdown in progress, so the predicate returns false and relaunch proceeds through `launchServer`.

## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `.opencode/bin/lib/model-server-supervision.cjs` | Defines and exports the pure `shouldAbortRelaunchOnFire` predicate alongside `shouldSkipLaunch` and `superviseChildExit` |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Captures `LAUNCHER_INITIAL_PPID`, calls `shouldAbortRelaunchOnFire` inside the `scheduleRelaunch` timer, releases leases via `clearAllLeaseFiles`, and re-exports the predicate; the crash and `recycleDaemonInPlace` paths still reach `launchServer` |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/launcher-watchdog.vitest.ts` | Automated test | Unit-tests `shouldAbortRelaunchOnFire` across owner-alive, shutdown, changed-ppid, orphan-to-1, and crash/recycle cases alongside the watchdog helpers |
| `mcp_server/stress_test/durability/daemon-recycle-transparency-stress.vitest.ts` | Automated test | Daemon-recycle transparency under load, where bridged clients survive an in-place recycle |

## 4. SOURCE METADATA
- Group: Pipeline Architecture
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `14--pipeline-architecture/mcp-launcher-owner-disposal-relaunch-gate.md`
Related references:
- [mcp-launcher-front-proxy.md](mcp-launcher-front-proxy.md) — MCP launcher front-proxy (reconnecting session proxy)
