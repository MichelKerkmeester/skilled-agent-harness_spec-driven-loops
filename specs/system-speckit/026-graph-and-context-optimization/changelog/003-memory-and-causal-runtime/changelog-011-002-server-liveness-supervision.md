

---
title: "Server liveness + supervision hardening"
description: "Health now carries loadStartedAt and inference-liveness fields so the launcher can reap wedged-but-loading servers and bound the dispose drain. A crash-loop give-up cooldown is persisted and returns 503 during cooldown. pid/lease/lock writes are ENOSPC-resilient."
trigger_phrases:
  - "server liveness supervision implementation summary"
  - "wedged but loading detection"
  - "inference liveness health fields"
  - "crash-loop cooldown ENOSPC resilient writes"
  - "phase changelog"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/002-server-liveness-supervision` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening`

### Summary

Implemented the phase-002 liveness hardening without changing the provider cascade or eager-spawn behavior. Health now carries loadStartedAt, lastSuccessfulEmbedAt, and inFlight, launcher probes reap over-age loading servers only when loadStartedAt is valid and older than the configured bound. The supervisor persists a crash-loop give-up cooldown and returns 503 with reason during cooldown. pid/lease/lock writes degrade gracefully on ENOSPC/EDQUOT/EROFS instead of crashing the launcher.

### Added

- Health payload now carries loadStartedAt so the launcher can reap a stuck cold-load before it wedges
- Health payload now carries lastSuccessfulEmbedAt and inFlightRawRuns.size with a bounded dispose drain
- SPECKIT_HF_MODEL_SERVER_LOADING_MAX_MS loading-wedge threshold is now classified in the launcher IPC bridge

### Changed

- Crash-loop give-up cooldown is now persisted to hf-embed-giveup.json and returns 503 with reason during cooldown instead of spawning again
- pid/lease/lock writes are now ENOSPC/EDQUOT/EROFS-resilient and degrade to no-op with temp cleanup instead of crashing the launcher

### Fixed

- None.

### Verification

- node --check on hf-model-server, launcher-ipc-bridge, model-server-supervision, mk-spec-memory-launcher - PASS
- npm run build --workspace=@spec-kit/shared - PASS
- npm run build --workspace=@spec-kit/mcp-server - PASS
- requested vitest set - PASS, 5 files, 43 tests
- scoped alignment drift (.opencode/bin, mcp_server/tests) - PASS
- validate.sh --strict on this packet - PASS

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/bin/hf-model-server.cjs` | Modified | Added load/inference health fields and reduced native inference dispose drain to 5000ms |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Modified | Added SPECKIT_HF_MODEL_SERVER_LOADING_MAX_MS loading-wedge classification |
| `.opencode/bin/lib/model-server-supervision.cjs` | Modified | Added persisted give-up cooldown and ENOSPC-safe respawn-lock acquisition |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | Added ENOSPC-safe lease/shared-pid atomic writes |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | Documented the new HF model-server liveness environment variables |
| `mcp_server/tests/embedders/hf-model-server.vitest.ts` | Modified | Added health liveness and dispose-drain coverage |
| `mcp_server/tests/embedders/launcher-model-server-cross-launcher.vitest.ts` | Modified | Added cooldown and ENOSPC degradation coverage |
| `mcp_server/tests/launcher-ipc-bridge-probe.vitest.ts` | Modified | Added loading-wedge probe coverage |

### Follow-Ups

- None.
