---
title: "Daemon ownership re-election"
description: "An experimental, flag-gated, default-off foundation that lets the shared mk-spec-memory daemon outlive its owner. When enabled, the owner spawns the daemon detached and on shutdown releases it for a live secondary to adopt instead of killing it. Default off is byte-identical to prior behavior, and a released daemon reparents to pid 1 so the orphan sweeper bounds any leak."
trigger_phrases:
  - "daemon ownership re-election"
  - "shared daemon outlive owner experimental"
  - "release daemon for secondary adoption"
  - "SPECKIT_DAEMON_REELECTION"
  - "daemonReelectionEnabled"
---

# Daemon ownership re-election

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

This feature is experimental and default-off. It is the flag-gated foundation for letting the shared mk-spec-memory daemon outlive the owner that spawned it, rather than dying when that owner's session ends.

When `SPECKIT_DAEMON_REELECTION` is enabled, the owner spawns the daemon detached, and on shutdown it releases the daemon instead of killing it: it keeps the daemon lease and socket, drops only the owner lease, and detaches the exit handler so shutdown does not wipe the lease. A live secondary can then adopt the released daemon. With the flag off, behavior is byte-identical to before. Secondary ownership adoption and terminal idle-death of an unadopted daemon are still runtime-validation-gated, and a released daemon reparents to pid 1 so the orphan sweeper bounds any leak if no secondary adopts it.

## 2. HOW IT WORKS

### Flag gate, default off

`daemonReelectionEnabled` reads `SPECKIT_DAEMON_REELECTION`, which is off by default and turns on with `1` or `on`. With the flag off the owner kills the daemon on shutdown exactly as before, so the default path is byte-identical to prior behavior and carries no new risk.

### Detached spawn under the flag

When re-election is enabled, `contextServerSpawnIo` spawns the daemon detached so the child is not bound to the owner's process group lifetime. Detaching is what makes it possible for the daemon to keep running after the owner exits.

### Release instead of kill on shutdown

`shutdownLauncherForSignal` consults `shouldReleaseDaemonForReelection`. When that returns true, the owner releases the daemon: it keeps the daemon lease and socket, drops only the owner lease, and detaches the exit handler so the normal shutdown teardown does not wipe the lease the secondary needs to adopt.

### Bounded leak via reparenting

A released daemon whose owner has exited reparents to pid 1. If no live secondary adopts it, the existing orphan sweeper can reap it as an ownerless process, so even the unadopted case has a bounded cleanup path. Secondary adoption and terminal idle-death remain runtime-validation-gated rather than on by default.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Script | Defines `daemonReelectionEnabled` over `SPECKIT_DAEMON_REELECTION`, spawns the daemon detached via `contextServerSpawnIo` and releases rather than kills the daemon through `shouldReleaseDaemonForReelection` inside `shutdownLauncherForSignal` |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/launcher-daemon-reelection.vitest.ts` | Automated test | Unit-tests the default-off no-change path, the detached spawn under the flag, the release-instead-of-kill shutdown decision and lease handling |

## 4. SOURCE METADATA
- Group: Pipeline Architecture
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `14--pipeline-architecture/daemon-ownership-reelection.md`
Related references:
- [mcp-launcher-owner-disposal-relaunch-gate.md](mcp-launcher-owner-disposal-relaunch-gate.md) — MCP launcher owner-disposal relaunch gate
- [mcp-launcher-front-proxy.md](mcp-launcher-front-proxy.md) — MCP launcher front-proxy (reconnecting session proxy)
