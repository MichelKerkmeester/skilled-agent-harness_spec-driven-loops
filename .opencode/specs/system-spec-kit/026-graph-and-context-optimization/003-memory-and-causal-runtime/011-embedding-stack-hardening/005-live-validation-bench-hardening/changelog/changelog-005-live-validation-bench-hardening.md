# Changelog — 005: Live validation + bench + perimeter hardening

**Shipped**: 2026-05-29
**Commit**: 4b2c5de6a3

## What Changed
- Modified `.opencode/bin/lib/model-server-supervision.cjs` to add perimeter helpers (assertSunPathLimit, assertSocketDirOwnership) and idle-eviction monitor gated on lastSuccessfulEmbedAt
- Modified `.opencode/bin/lib/launcher-ipc-bridge.cjs` to add additive probeModelServer health field
- Modified `.opencode/bin/mk-skill-advisor-launcher.cjs` to add SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN in CHILD_ENV_ALLOWLIST
- Modified `shared/embeddings/registry.ts` to drop dead RERANKER_CANONICAL block
- Modified `mcp_server/ENV_REFERENCE.md` to add idle/live-test/flag-gate/perimeter env docs and remove SIDECAR rows
- Added perimeter, idle-eviction, and real-process live two-launcher integration tests
- Added self-skipping q8-vs-fp16 bench harness (scripts/bench-dtype-q8-fp16.cjs)
- Advisor flag-flip, dtype decision, and live perf/cache numbers gated on working onnxruntime tree (documented blocker)

## Why
The cross-launcher residency, spawn→bind window, real EADDRINUSE/wx races, SIGKILL reclaim, and the 404 contract have never been validated live. The dtype choice is unmeasured, idle eviction does not exist, the socket dir is not ownership-checked, an over-long sun_path is not caught fast, and dead/deprecated envs still linger.

## Verification
- `tsc` (@spec-kit/shared + @spec-kit/mcp-server): PASS
- `node --check` (supervision, bridge, advisor-launcher, hf-model-server cjs): PASS
- Embedder/launcher vitest suites (8): PASS — 72 passed / 2 skipped (live model-path cases)
- Live test transport subset (real spawned binary): PASS (bind/health-200, route-404, SIGKILL stale-socket)
- Bench harness self-skip: exit 0 with model-unavailable notice
- 4-lens adversarial review: 7 raised, 5 confirmed (1 P0 + 2 P1 + 2 P2); all fixed or reverted; 2 refuted
- `validate.sh --strict` on this packet: PASS
