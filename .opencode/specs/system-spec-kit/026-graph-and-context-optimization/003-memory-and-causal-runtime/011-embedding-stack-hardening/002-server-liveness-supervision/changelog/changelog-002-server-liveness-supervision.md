# Changelog — 002: Server liveness + supervision hardening

**Shipped**: 2026-05-29
**Commit**: 4b2c5de6a3

## What Changed
- Modified `.opencode/bin/hf-model-server.cjs` to add loadStartedAt, lastSuccessfulEmbedAt, and inFlight health fields and reduce native inference dispose drain to 5000ms
- Modified `.opencode/bin/lib/launcher-ipc-bridge.cjs` to add SPECKIT_HF_MODEL_SERVER_LOADING_MAX_MS loading-wedge classification
- Modified `.opencode/bin/lib/model-server-supervision.cjs` to add persisted give-up cooldown and ENOSPC-safe respawn-lock acquisition
- Modified `.opencode/bin/mk-spec-memory-launcher.cjs` to add ENOSPC-safe lease/shared-pid atomic writes
- Modified `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` to document new HF model-server liveness environment variables
- Added health liveness and dispose-drain coverage to hf-model-server.vitest.ts
- Added cooldown and ENOSPC degradation coverage to launcher-model-server-cross-launcher.vitest.ts
- Added loading-wedge probe coverage to launcher-ipc-bridge-probe.vitest.ts

## Why
The supervision layer cannot tell a healthy server from a wedged one. The launcher treats loading as alive forever so a stuck cold-load is never reaped. Health reflects only serverState so a hung native inference run keeps reporting ready. The demand-listener can spawn-storm a deterministic failure with no give-up. And pid/lease/lock writes crash the launcher on disk-full instead of degrading.

## Verification
- `node --check` on hf-model-server, launcher-ipc-bridge, model-server-supervision, mk-spec-memory-launcher: PASS
- `npm run build --workspace=@spec-kit/shared`: PASS
- `npm run build --workspace=@spec-kit/mcp-server`: PASS
- Requested vitest set: PASS — 5 files, 43 tests
- Scoped alignment drift (.opencode/bin, mcp_server/tests): PASS
- `validate.sh --strict` on this packet: PASS
