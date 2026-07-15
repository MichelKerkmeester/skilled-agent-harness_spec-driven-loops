---
title: "Live validation, bench, and perimeter hardening for the embedding stack"
description: "Socket perimeter hardening, default-off idle eviction, a live two-launcher integration test, a dtype benchmark harness, and deprecated-code cleanup shipped. The advisor flag flip and live performance numbers are gated until a working onnxruntime tree is available in this checkout."
trigger_phrases:
  - "live two-launcher integration test flag flip"
  - "q8 fp16 bench idle eviction"
  - "socket perimeter hardening sun_path guard"
  - "embedding stack deprecated env cleanup"
  - "model server supervision fstat symlink rejection"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/005-live-validation-bench-hardening` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening`

### Summary

The final phase of embedding-stack hardening shipped socket perimeter guards, default-off idle eviction, a real-process live integration test, a dtype benchmark harness, and staged deprecated-code cleanup. The advisor flag flip and live performance numbers remain gated on a working onnxruntime tree in this checkout. Runnable test and benchmark artifacts ship now so the gate is explicit and the one-line flip recipe is documented.

### Added

- A live two-launcher integration test that spawns the real model server binary and verifies bind with a health-200 response, route-404 contract, and SIGKILL stale-socket reclaim. Model-path embed cases auto-skip when no loadable model is available.
- A self-skipping q8-versus-fp16 benchmark harness that spawns the server on a cached ONNX model and reports p50, p95, and a cosine recall delta. The harness exits cleanly with a model-unavailable notice when the model cannot load.

### Changed

- The launcher IPC bridge `probeModelServer` now resolves a `health` field from the model server `/api/health` response so downstream monitors can read `lastSuccessfulEmbedAt` and `inFlight`.
- Dead `RERANKER_CANONICAL` provider code was removed from the embeddings registry. Two deprecated `SPECKIT_EMBEDDER_SIDECAR` environment variable rows were deleted from the reference documentation.
- The advisor launcher now passes `SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN` through the child environment allowlist.

### Fixed

- The model server supervision module now validates socket directory ownership via `fstat`, rejects symlinks, and fails fast when the socket path exceeds 103 bytes, preventing privilege confusion and truncation bugs before a listener is bound.
- A default-off idle eviction monitor gates on `lastSuccessfulEmbedAt` and safely reaps the model server when no embeddings have run for the configured timeout. Lazy re-arm is preserved so the server re-spawns on next demand. A caught re-arm rejection prevents a launcher crash when a sibling reclaim or perimeter trip already handled the socket.

### Verification

- `tsc` (@spec-kit/shared and @spec-kit/mcp-server) - PASS
- `node --check` (supervision, bridge, advisor-launcher, hf-model-server cjs) - PASS
- Embedder and launcher vitest suites (8) - PASS with 72 passed and 2 skipped (model-path cases gated)
- Live test transport subset (real spawned binary) - PASS for bind, health-200, route-404, and SIGKILL stale-socket
- Bench harness self-skip - exit 0 with a model-unavailable notice
- 4-lens adversarial review - 7 raised, 5 confirmed (1 P0, 2 P1, 2 P2). All fixed or reverted. 2 refuted.
- `validate.sh --strict` on this packet - PASS with 0 errors

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/bin/lib/model-server-supervision.cjs` | Modified | perimeter helpers and wiring, idle eviction monitor with re-arm catch and sun_path guard |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Modified | additive health field on `probeModelServer` |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modified | `SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN` in child environment allowlist |
| `.opencode/skills/system-spec-kit/shared/embeddings/registry.ts` | Modified | dead `RERANKER_CANONICAL` block removed |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | idle, live-test, flag-gate, and perimeter environment documentation. SIDECAR rows removed. |
| `mcp_server/tests/embedders/model-server-perimeter.vitest.ts` | Created | perimeter guard unit tests |
| `mcp_server/tests/embedders/launcher-model-server-idle-eviction.vitest.ts` | Created | idle eviction unit tests |
| `mcp_server/tests/embedders/launcher-model-server-live-two-launcher.vitest.ts` | Created | real-process live two-launcher integration test |
| `mcp_server/scripts/bench-dtype-q8-fp16.cjs` | Created | self-skipping dtype benchmark harness |

### Follow-Ups

- The flag flip, the dtype decision, and live performance and recall numbers are gated on repairing the `onnxruntime-common` dependency tree so a loadable model is available. Runnable test and benchmark artifacts ship now.
- Cache-into-reindex remains deferred pending resolution of a reindex-versus-query normalization divergence. The cache cannot hit in production until reindex keys and embeddings use the same normalized content that the query path uses.
- Reindex-versus-query normalization divergence (pre-existing, surfaced by the review) needs its own follow-up packet. It also affects search-vector consistency beyond the cache.
