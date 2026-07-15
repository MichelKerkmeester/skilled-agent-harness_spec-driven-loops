---
title: "MCP Daemon Reliability Phase 005: Dispose the Embedding Provider's Native ONNX Session on Swap"
description: "The native ORT session is now freed deterministically on every provider swap across all three provider-holding sites, behind a raw-native-run in-flight gate that prevents use-after-free. Fixes RC-1, the primary OOM driver."
trigger_phrases:
  - "provider dispose native ONNX session"
  - "embedding provider memory leak RC-1"
  - "HfLocalProvider dispose in-flight gate"
  - "invalidateProviderSingleton native session orphan"
  - "sidecar provider recycle on model swap"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-28

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/005-provider-dispose` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability`

### Summary

The MCP daemon's embedding system had a native memory leak on every provider swap. `invalidateProviderSingleton()` in `shared/embeddings.ts` nulled the provider reference without calling any dispose method, leaving the underlying native ONNX/ORT session (held transitively via `extractor.model.sessions`) orphaned in memory that the JavaScript GC cannot reclaim and `--max-old-space-size` cannot bound. This was RC-1, the primary out-of-memory driver.

There are three distinct sites that hold a provider: the in-process singleton used for search and self-heal, the forked sidecar process that handles bulk embedding under the default `auto` policy, and the `direct`-policy adapter held in `execution-router.ts`. A fix covering only one site would leave the leak active in the other two.

This phase shipped `HfLocalProvider.dispose()` gated on the raw native-run lifetime, wired the dispose call into all three holding sites, and added headless regression tests for the swap-during-inference and swap-during-cold-load windows. The gate tracks the unwrapped `model()` promise rather than the `withTimeout` wrapper because the wrapper rejects without cancelling the underlying native run. A `disposePromise` single-owner funnel and a synchronous `disposed` flag guarantee exactly one owner reaches the native free. The drain timeout uses `MODEL_LOAD_TIMEOUT` (120 seconds) so a cold-load swap still frees the freshly-loaded session. Sidecar cleanup uses process recycle keyed on the job's `backend:model` string rather than an in-worker dispose, which is simpler and guaranteed to return native RSS to the OS.

Builds, vitest and a 6-lens adversarial review all passed. Live-daemon RSS observation (SC-001) remains deferred pending a running daemon.

### Added

- Optional `dispose?(): Promise<void>` on the `IEmbeddingProvider` interface in `shared/types.ts`
- Raw-native-run in-flight gate in `generateEmbedding` tracking the unwrapped `model()` promise with a `.finally` decrement
- `HfLocalProvider.dispose()` with drain timeout, single-owner claim, single-session assert and native ORT free chain
- `recycleActiveSidecars(key)` in `execution-router.ts` for auto/sidecar policy teardown keyed on `backend:model`
- Headless test suite `embedder-provider-dispose.vitest.ts` covering swap-during-inference, swap-during-cold-load, auto-recycle and direct-dispose scenarios

### Changed

- `invalidateProviderSingleton()` now captures the outgoing provider reference and fires `void dispose().catch(log)` before nulling
- `resetForTesting()` and `setProviderForTesting()` in `shared/embeddings.ts` dispose the outgoing provider to prevent native session accumulation across test runs
- `execution-router.ts` clears the `directAdapters` provider under `direct` policy and calls the policy-correct teardown branch based on `shouldUseSidecar(job.backend)`
- `reindex.ts` swap-completion path wired to the policy-correct teardown keyed on the job's `backend:toName`

### Fixed

- Native ONNX/ORT sessions orphaned on every provider swap by `invalidateProviderSingleton()`. The outgoing provider is now disposed before the reference is dropped.
- Forked sidecar under default `auto` policy accumulated native RSS across repeated `embedder_set` calls without any recycle. Process recycle on model swap now bounds the dominant footprint.
- `direct`-policy reindex adapter was dropped by `directAdapters.clear()` without disposing its factory-backed provider. The third provider site is now freed on swap.

### Verification

| Check | Result |
|-------|--------|
| `npm run build --workspace=@spec-kit/shared` (tsc) | PASS (exit 0) |
| `npm run build --workspace=@spec-kit/mcp-server` (tsc) | PASS (exit 0) |
| `vitest run` dispose + adjacent embedder suites | PASS (38 passed / 8 skipped across adjacent suites) |
| 6-lens adversarial review (native-gate, double-free, 3-site, drain-timeout, scope, test-quality) | PASS 6/6. 0 confirmed defects, 0 P0/P1 |
| `validate.sh --strict` on this packet | PASS |
| SC-001/SC-002 live-daemon RSS + no-segfault under real native runs | DEFERRED (needs running daemon, not drivable headlessly) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `shared/types.ts` | Modify | Added optional `dispose?(): Promise<void>` to `IEmbeddingProvider` |
| `shared/embeddings/providers/hf-local.ts` | Modify | `dispose()` + raw-native-run in-flight gate + `disposePromise` single-owner teardown + single-session assert |
| `shared/embeddings.ts` | Modify | `invalidateProviderSingleton` + `resetForTesting`/`setProviderForTesting` dispose the outgoing provider (fire-and-forget) |
| `mcp_server/lib/embedders/execution-router.ts` | Modify | `recycleActiveSidecars(key)` for auto/sidecar + direct-adapter dispose with policy-branch teardown |
| `mcp_server/lib/embedders/reindex.ts` | Modify | Reindex-completion swap wired to the policy-correct teardown |
| `mcp_server/tests/embedder-provider-dispose.vitest.ts` | Create (NEW) | Headless tests: swap-during-inference, swap-during-cold-load, auto-recycle, direct-dispose |

### Follow-Ups

- Run SC-001 (RSS bounded across N swaps) and SC-002 (no native segfault under real ONNX runs) in a live-daemon session with a running sidecar. The headless tests mock the native run/dispose so full confidence still requires a real daemon.
- Track SC-001/SC-002 completion as T011 before closing out the daemon-reliability track.
- Consider adding an in-worker dispose protocol to `sidecar-worker.ts` as an alternative to process recycle if future profiling shows recycle latency is unacceptable.
