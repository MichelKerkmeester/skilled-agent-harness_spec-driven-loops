---
title: "Lease probe retry reap hardening"
description: "A sibling launcher requires several consecutive deep liveness-probe failures before it reaps the lease owner and respawns, so a busy-but-alive owner mid-FTS-merge is never false-reaped into a duplicate daemon. Any alive result short-circuits, dead sockets fail fast, and the default budget stays under the probe ceiling."
trigger_phrases:
  - "lease probe retry reap hardening"
  - "consecutive liveness probe failures before reap"
  - "busy owner false reap duplicate daemon"
  - "SPECKIT_LEASE_PROBE_RETRIES"
  - "probeLeaseHolderWithRetries"
version: 3.6.0.2
---

# Lease probe retry reap hardening

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

When a sibling launcher considers bridging to an existing daemon, it probes the current lease owner for liveness. A single failed probe used to be enough to treat the owner as dead and reap it. An owner that is alive but momentarily unresponsive, for example mid-FTS-merge, could fail one probe and get reaped into a duplicate daemon.

The reap hardening requires multiple consecutive deep liveness-probe failures before `maybeBridgeLeaseHolder` reaps the owner and respawns. Any single alive result short-circuits the retry loop and the sibling bridges to the live owner instead of reaping it. The default budget of one retry, a 1500ms retry timeout, and a 250ms backoff stays comfortably under the 6999ms probe ceiling, and a dead socket still fails fast rather than waiting out the full budget.

## 2. HOW IT WORKS

### Consecutive-failure reap requirement

`maybeBridgeLeaseHolder` drives `probeLeaseHolderWithRetries` instead of a single probe. The owner is only reaped when every attempt in the retry budget fails consecutively. The first attempt that reports the owner alive short-circuits the loop, so a transiently busy owner survives.

### Configurable retry budget

`resolveLeaseProbeAttempts` reads `SPECKIT_LEASE_PROBE_RETRIES`, which defaults to 1, so the owner gets one extra probe after the first. Setting it to 0 collapses back to a single probe. `SPECKIT_LEASE_PROBE_RETRY_TIMEOUT_MS` defaults to 1500 and bounds each retry attempt, while `SPECKIT_LEASE_PROBE_RETRY_BACKOFF_MS` defaults to 250 and spaces the attempts.

### Budget stays under the probe ceiling

The default budget is sized so the worst-case retry sequence stays under the 6999ms probe ceiling the bridge already enforces. That keeps the harder reap decision from pushing total probe time past the ceiling that protects the rest of the bridge handshake.

### Dead sockets fail fast

A socket that is already dead fails its probe immediately, so the retry loop does not pay the full timeout budget for an owner that is genuinely gone. The hardening adds patience only for owners that respond slowly, not for owners that do not respond at all.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Shared | Defines `probeLeaseHolderWithRetries` and `resolveLeaseProbeAttempts`, drives them from `maybeBridgeLeaseHolder` and reads `SPECKIT_LEASE_PROBE_RETRIES`, `SPECKIT_LEASE_PROBE_RETRY_TIMEOUT_MS` and `SPECKIT_LEASE_PROBE_RETRY_BACKOFF_MS` against the 6999ms probe ceiling |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp-server/tests/launcher-reap-hardening.vitest.ts` | Automated test | Unit-tests consecutive-failure reaping, alive-result short-circuit, the configurable retry budget and dead-socket fast-fail |

## 4. SOURCE METADATA
- Group: Pipeline Architecture
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `pipeline-architecture/lease-probe-retry-reap-hardening.md`
Related references:
- [mcp-launcher-front-proxy.md](../../feature-catalog/pipeline-architecture/mcp-launcher-front-proxy.md) — MCP launcher front-proxy (reconnecting session proxy)
- [mcp-launcher-owner-disposal-relaunch-gate.md](../../feature-catalog/pipeline-architecture/mcp-launcher-owner-disposal-relaunch-gate.md) — MCP launcher owner-disposal relaunch gate
