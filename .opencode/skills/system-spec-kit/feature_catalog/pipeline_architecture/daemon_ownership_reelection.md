---
title: "Daemon ownership re-election"
description: "A default-on path that lets the shared mk-spec-memory daemon outlive its owner. The owner spawns the daemon detached and on shutdown releases it for a live secondary to keep instead of killing it. A fresh session that finds the released daemon under a stale lease reaps it before respawn, so the database keeps a single writer."
trigger_phrases:
  - "daemon ownership re-election"
  - "shared daemon outlive owner"
  - "release daemon for secondary adoption"
  - "SPECKIT_DAEMON_REELECTION"
  - "daemonReelectionEnabled"
version: 3.6.0.4
---

# Daemon ownership re-election

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

This feature is default-on in the launcher code. It lets the shared mk-spec-memory daemon outlive the owner that spawned it, rather than dying when that owner's session ends, so concurrent sessions keep their MCP transport.

When `SPECKIT_DAEMON_REELECTION` is enabled, the owner spawns the daemon detached, and on shutdown it releases the daemon instead of killing it: it keeps the daemon lease and socket, drops only the owner lease, and detaches the exit handler so shutdown does not wipe the lease. A connected live secondary keeps its transport across the owner's exit. A fresh session started after the owner is gone reaps the released daemon before it spawns a replacement, so the database is never left with two writers. On by default in the launcher code; set `0` or `off` to revert to kill-on-disposal.

## 2. HOW IT WORKS

### Flag gate, default on

`daemonReelectionEnabled` reads `SPECKIT_DAEMON_REELECTION`, which defaults to on and is disabled only by an explicit `0` or `off`. The launcher code is the source of the default, and a one-character edit reverts to the kill-on-disposal behavior.

### Detached spawn under the flag

When re-election is enabled, `contextServerSpawnIo` spawns the daemon detached so the child is not bound to the owner's process group lifetime. Detaching is what makes it possible for the daemon to keep running after the owner exits.

### Release instead of kill on shutdown

`shutdownLauncherForSignal` consults `shouldReleaseDaemonForReelection`. When that returns true, the owner releases the daemon: it keeps the daemon lease and socket, drops only the owner lease, and detaches the exit handler so the normal shutdown teardown does not wipe the lease a secondary still uses.

### Reap before respawn on stale-lease reclaim

A fresh session started after the owner has exited finds the daemon lease stale, because lease liveness keys on the owner pid. Before this path spawned a replacement directly, which left the still-live released daemon as a second writer on the same WAL database. The stale-lease reclaim branch now reaps the recorded daemon child before respawn, under the owner-lease exclusive acquisition, and bails to a lease-held report if it cannot confirm the child is gone. The result is a single writer, matching the pre-re-election cold-restart behavior.

### Bounded leak via idle self-exit

A released daemon that no live secondary keeps and no fresh session reaps is bounded by the daemon's own idle self-exit at `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN`. The orphan sweeper can also reap an ownerless daemon when enabled.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Script | Defines `daemonReelectionEnabled` over `SPECKIT_DAEMON_REELECTION`, spawns the daemon detached via `contextServerSpawnIo`, releases rather than kills the daemon through `shouldReleaseDaemonForReelection` inside `shutdownLauncherForSignal`, and reaps the recorded child on stale-lease reclaim before respawn |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/launcher-daemon-reelection.vitest.ts` | Automated test | Unit-tests the flag-gating, the detached spawn, and the release-instead-of-kill shutdown decision and lease handling |
| `mcp_server/stress_test/durability/daemon-reelection-release-integration.vitest.ts` | Automated test | Drives the real release-vs-kill decision functions and OS reparent semantics with a detached stand-in |
| `mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts` | Automated test | Runs two real launchers in an isolated root: a live secondary keeps transport, the daemon dies with the flag off, and a fresh session after disposal reaps the released daemon to stay the single writer |

## 4. SOURCE METADATA
- Group: Pipeline Architecture
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `pipeline_architecture/daemon_ownership_reelection.md`
Related references:
- [mcp-launcher-owner-disposal-relaunch-gate.md](mcp_launcher_owner_disposal_relaunch_gate.md) — MCP launcher owner-disposal relaunch gate
- [mcp-launcher-front-proxy.md](mcp_launcher_front_proxy.md) — MCP launcher front-proxy (reconnecting session proxy)
