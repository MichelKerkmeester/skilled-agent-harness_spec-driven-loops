---
title: "Launcher supervision for the hf model server"
description: "The mk-spec-memory launcher now lazily spawns and supervises the hf model server as a launcher-owned sibling child with a second crash-loop guard, generalized RSS watchdog, and health probe."
trigger_phrases:
  - "launchModelServer"
  - "modelServerPid lease"
  - "probeModelServer"
  - "lazy sibling-child spawn"
  - "launcher supervision hf model server"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/004-launcher-supervision` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server`

### Summary

The mk-spec-memory launcher now lazily spawns and supervises hf-model-server.cjs as a launcher-owned sibling child (not detached), reusing the F1 and F3 algorithms with separate model-server state. A tiny demand listener on the embed Unix Domain Socket triggers the spawn when the daemon-side hf-local client first requests an embed. A second crash-loop guard and relaunch timer supervise the child independently of the daemon guard. The RSS watchdog was generalized to accept a target pid and model-server memory ceilings. An additive modelServerPid lease field and signal cascade ensure both trees are reaped cleanly. A single-winner hf-embed-respawn.lock prevents double-spawn on rapid restart.

### Added

- launchModelServer() function with lazy demand-triggered sibling-child spawn.
- modelServerPid lease field in teardown and reap paths.
- probeModelServer() in the bridge for socket-keyed model-server health probing.
- hf-embed-respawn.lock single-winner with stale reclaim for double-spawn prevention.
- Second crash-loop guard and relaunch timer for independent model-server supervision.
- Generalized RSS watchdog accepting a target pid and SPECKIT_HF_MODEL_SERVER_MAX_RSS_MB ceiling env.

### Changed

- RSS watchdog now accepts a target pid and model-server-specific memory ceiling env vars, decoupling it from the daemon watchdog.
- Demand listener on the embed Unix Domain Socket now retries unlink on EADDRINUSE to handle stale sockets from prior crashes.

### Fixed

- None.

### Verification

- node --check launcher and bridge - PASS
- vitest run F1 launcher-watchdog (non-regression) - PASS (14/14)
- vitest run F3 launcher-ipc-bridge-probe (non-regression) - PASS (4/4)
- vitest run new launcher-model-server suite - PASS (6/6)
- 5-lens opus adversarial review covering F1/F3 non-regression, lazy-spawn, supervision, and wx-lock scope - PASS (0 confirmed defects, 1 P2 demand-listener EADDRINUSE fixed)
- validate.sh --strict on this packet - PASS
- SC: live first-embed spawn and RSS recycle - DEFERRED (requires running daemon and model server)

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | Lazy demand listener, launchModelServer, 2nd crash-loop guard and relaunch timer, generalized RSS watchdog, modelServerPid lease, reap and teardown paths, hf-embed-respawn.lock, and EADDRINUSE unlink-retry fix |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Modify | probeModelServer(socketPath) GET /api/health probe separate from probeDaemon |
| `mcp_server/tests/embedders/launcher-model-server.vitest.ts` | Create | 6 tests covering lazy no-spawn, demand-to-spawn, 2nd-guard relaunch and give-up, generalized watchdog targeting model pid, modelServerPid additive and reaped behavior, probeModelServer ready and loading equals alive |

### Follow-Ups

- Live first-embed spawn not exercised. Lazy demand-to-spawn, RSS recycle, and reap-before-respawn are covered by injected-spawn and ps tests. A live daemon plus model server is the natural follow-up.
- Remaining P2 review notes (non-blocking): the async signal-teardown end-to-end path and the give-up-to-re-arm demand-listener path have thin behavioral coverage validated by code review rather than a dedicated test.
- Sidecar still present. Both the old sidecar path and the new model-server path coexist until phase 005 retires the sidecar. SPECKIT_EMBEDDER_EXECUTION is still honored until then.
