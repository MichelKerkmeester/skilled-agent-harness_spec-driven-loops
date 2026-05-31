# Changelog — 004: Add launcher supervision for the hf model server

**Shipped**: 2026-05-29
**Commit**: 4b2c5de6a3

## What Changed
- Modified `.opencode/bin/mk-spec-memory-launcher.cjs` to lazily spawn and supervise hf-model-server.cjs as a launcher-owned sibling child
- Added lazy demand listener on embed UDS; first /api/health triggers spawn via launchModelServer
- Added second createCrashLoopGuard + relaunch timer for model-server (independent of daemon guard)
- Generalized startRssWatchdog to take target pid + model-server ceiling env (SPECKIT_HF_MODEL_SERVER_MAX_RSS_MB/_RSS_SELF_EXIT)
- Added additive modelServerPid lease field and signal cascade to reap both trees
- Added reap-before-respawn + hf-embed-respawn.lock (wx + stale reclaim) for single-winner
- Modified `.opencode/bin/lib/launcher-ipc-bridge.cjs` to add probeModelServer(socketPath) GET /api/health probe (separate from probeDaemon)
- Created `mcp_server/tests/embedders/launcher-model-server.vitest.ts` with 6 tests
- Fixed demand-listener EADDRINUSE unlink-retry (F-001 fix)

## Why
A standalone model server solves the execution boundary but not lifecycle. Without launcher ownership, crash-loop handling, RSS enforcement, lease state, and dead-socket respawn would be reimplemented or absent, undermining the F1/F3 reuse mandate.

## Verification
- `node --check` launcher + bridge: PASS
- `vitest run` F1 launcher-watchdog (non-regression): PASS (14/14)
- `vitest run` F3 launcher-ipc-bridge-probe (non-regression): PASS (4/4)
- `vitest run` new launcher-model-server: PASS (6/6)
- 5-lens opus adversarial review (F1 / F3 non-regression, lazy-spawn, supervision, wx-lock/scope): PASS — 0 confirmed defects; 1 P2 (demand-listener EADDRINUSE) fixed
- `validate.sh --strict` on this packet: PASS
