---
title: "Phase 014: Launcher overlap spawn and bridge fix"
description: "Fixed two launcher-overlap failures: internal liveness probes no longer spawn the model server and code-index plus skill-advisor bridge binds now survive a benign concurrent socket removal while keeping the security fence."
trigger_phrases:
  - "launcher overlap spawn fix"
  - "x speckit probe liveness"
  - "race safe canUnlinkExistingSocket"
  - "bridge socket ENOENT reclaim"
  - "code-index advisor secondary wedge"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-04

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/014-launcher-overlap-spawn-and-bridge-fix` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency`

### Summary

This phase shipped two focused launcher-concurrency fixes. The launcher liveness probe now carries `X-Speckit-Probe: liveness`. The model-server demand listener treats that marked probe as non-spawning. The code-index and skill-advisor IPC bridge copies also gained ENOENT-safe reclaim during `EADDRINUSE` recovery, so a benign concurrent-primary socket race no longer aborts the bind.

### Added

- `X-Speckit-Probe: liveness` on the launcher bridge probe request.
- A non-spawning response path for marked liveness probes in the model-server demand listener.
- ENOENT-safe handling inside code-index and skill-advisor `canUnlinkExistingSocket` so a vanished socket node is reclaimable.

### Changed

- Kept the bridge security fence intact while narrowing the race fix to the `EADDRINUSE` recovery path.
- Rebuilt the code-index and skill-advisor TypeScript packages so emitted `dist` files include the socket race fix.
- Recycled the code-index and advisor daemon children so later launcher respawns could load the new code.

### Fixed

- Boot-time liveness probes no longer look like real embed demand and no longer spawn the model server.
- Secondary code-index and skill-advisor sessions no longer wedge because bridge bind recovery threw after a peer removed the stale socket first.
- A touched code-index socket file had its stale finding-id comment reworded for durable comment hygiene.

### Verification

| Check | Result |
|-------|--------|
| `nested-changelog.js --json` draft | Ran and used as the starting draft |
| code-index TypeScript build | Clean per packet artifacts |
| skill-advisor TypeScript build | Clean per packet artifacts |
| launcher IPC vitest suites | 13 passed and 8 skipped |
| `.cjs` syntax checks | `node --check` clean for both launcher libraries |
| Hygiene and alignment | Comment hygiene clean and alignment-drift PASS |
| T2 isolation evidence | Recorded diff proof that the socket change stayed in the `EADDRINUSE` recovery path |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Modified | Added the liveness probe header on internal health checks. |
| `.opencode/bin/lib/model-server-supervision.cjs` | Modified | Returned a non-spawning response when the liveness probe marker is present. |
| `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts` | Modified | Made socket reclaim ENOENT-safe while preserving allowed-root, socket-type and UID refusals. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/ipc/socket-server.ts` | Modified | Applied the same ENOENT-safe socket reclaim behavior. |

### Follow-Ups

- Confirm bridge serving after `/mcp` reconnect or a fresh launcher session.
- Level spec-memory's older socket-server copy up to the same hardened race-safe contract.
- Consolidate the three `socket-server.ts` copies behind a shared module.
