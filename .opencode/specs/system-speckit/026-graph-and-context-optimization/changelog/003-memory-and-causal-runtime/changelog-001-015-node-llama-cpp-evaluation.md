---
title: "Evaluation: node-llama-cpp as an opt-in Memory MCP embedding backend"
description: "Shipped an opt-in LlamaCppProvider for the Memory MCP embeddings surface. Parity failed at all three GGUF precision tiers, blocking a default flip. Latency and RSS improvements were real and documented."
trigger_phrases:
  - "node-llama-cpp evaluation"
  - "llama-cpp memory mcp provider"
  - "embeddinggemma gguf parity"
  - "llama-cpp default flip decision"
  - "local embeddings llama-cpp benchmark"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-13

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/015-node-llama-cpp-evaluation` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

The Memory MCP local embedding path defaulted to `hf-local` backed by ONNX EmbeddingGemma q8. Prior cocoindex evaluation had been rejected after measurement. The open question was whether a Node-native `node-llama-cpp` provider could improve single-query latency and RSS without corrupting vector-index compatibility with the existing `hf-local` index.

An opt-in `LlamaCppProvider` was built and evaluated. The provider implements `IEmbeddingProvider`, lazy-loads `node-llama-cpp` via dynamic import (CJS failed under Node 25 ESM/TLA), creates a GGUF embedding context, reuses the existing prefix registry, L2-normalizes output. It reports a profile slug that keeps llama-cpp sqlite indexes separated from `hf-local` indexes. Factory wiring is opt-in only.

Benchmark results were decisive on latency: llama-cpp p50 query latency was 6.45 ms vs 39.54 ms for `hf-local`. Query RSS was 1209 MB vs 1798 MB. However parity failed at every GGUF precision tier tested: Q8_0 reached mean cosine 0.9677 against the 0.995 threshold. BF16 reached 0.9939 against the same gate. The default was not flipped. The provider was shipped as opt-in and later purged when the `016/002/007` commit removed the llama-cpp surface in favor of the Ollama-backed cascade.

### Added

- `LlamaCppProvider` implementing `IEmbeddingProvider` with lazy dynamic import, singleton runtime, prefix-aware document/query helpers, dimension coercion to 768 with L2 normalization (file later purged)
- Factory registration in `shared/embeddings/factory.ts` for explicit `EMBEDDINGS_PROVIDER=llama-cpp` opt-in
- Smoke test confirming a normalized 768-dimensional `Float32Array` is returned (file later purged)
- Factory wire-up test confirming explicit opt-in resolves `LlamaCppProvider` and default resolution remains unchanged (file later purged)
- Parity test comparing 50-sample cosine similarity between llama-cpp and `hf-local` reference vectors (file later purged)
- Benchmark harness `scratch/bench-llama-cpp-vs-hf-local.ts` supporting `--mode=query` plus `--mode=load` with 1000 query iterations, RSS tracking, watts capture (requires sudo)

### Changed

- `shared/embeddings/factory.ts` extended with `llama-cpp` in `SUPPORTED_PROVIDERS`, startup-profile handling for the new dtype. A lazy import path for `./providers/llama-cpp.js` was added.
- `.env.example` updated with opt-in guidance and GGUF download command for the llama-cpp backend
- `.opencode/skills/system-spec-kit/mcp_server/README.md` updated with experimental provider documentation

### Fixed

- Install hint added to `loadNodeLlamaCpp()` so a missing optional dependency produces a clear message pointing at `npm install node-llama-cpp@3.17.1 --save-optional` rather than a raw module-not-found error
- Profile slug from `getProfile()` returns a provider-model-dim-dtype slug, preventing vector mixing with existing `hf-local` sqlite indexes

### Verification

| Check | Command | Result |
|-------|---------|--------|
| Build | `cd .opencode/skills/system-spec-kit/mcp_server && npm run build` | PASS |
| Dynamic import | `node --input-type=module -e "const m = await import('node-llama-cpp'); ..."` | PASS: `getLlama`, `LlamaEmbeddingContext` exposed |
| CJS probe | `node -e "const m = require('node-llama-cpp'); ..."` | FAIL: `ERR_REQUIRE_ASYNC_MODULE` under Node 25 |
| Metal dylibs | `find node_modules/node-llama-cpp/node_modules/@node-llama-cpp/mac-arm64-metal ...` | PASS: dylibs and `llama-addon.node` present |
| Smoke/factory | `EMBEDDINGS_PROVIDER=llama-cpp npx vitest run tests/embeddings-llama-cpp-smoke.vitest.ts tests/embeddings-llama-cpp-factory.vitest.ts` | PASS: 2 files, 3 tests |
| Parity | `EMBEDDINGS_PROVIDER=llama-cpp npx vitest run tests/embeddings-llama-cpp-parity.vitest.ts` | FAIL: mean cosine 0.9677 below 0.995 gate |
| Benchmarks | `node --import ../scripts/node_modules/tsx/dist/loader.mjs scratch/bench-llama-cpp-vs-hf-local.ts` | PASS: four result rows in `scratch/bench-results.json` |
| Strict validate | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .../015-node-llama-cpp-evaluation --strict` | PASS: exit 0 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts` | Created (purged in 016/002/007) | Opt-in llama-cpp provider implementing `IEmbeddingProvider` |
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Modified | Provider registration. Lazy import. Startup-profile support for llama-cpp. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embeddings-llama-cpp-smoke.vitest.ts` | Created (purged in 016/002/007) | Runtime smoke test for normalized 768d output |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embeddings-llama-cpp-factory.vitest.ts` | Created (purged in 016/002/007) | Factory opt-in regression test |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embeddings-llama-cpp-parity.vitest.ts` | Created (purged in 016/002/007) | 50-sample parity gate against `hf-local` |
| `.env.example` | Modified | Opt-in env guidance and GGUF download command |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Modified | Experimental provider documentation |
| `scratch/bench-llama-cpp-vs-hf-local.ts` | Created | Benchmark harness with load and query modes |
| `scratch/bench-results.json` | Generated | Load and query results for `hf-local` and `llama-cpp` |
| `scratch/model-info.json` | Generated | GGUF model provenance and SHA-256 for `unsloth/embeddinggemma-300m-GGUF` Q8_0 |
| `scratch/parity-results.txt` | Generated | 50-sample cosine similarity log |

### Follow-Ups

- Investigate whether a GGUF export or tokenizer alignment path can reach mean cosine >= 0.995 and min cosine >= 0.99 against the `hf-local` q8 reference before reconsidering a default flip.
- Consider comparing search-ranking overlap rather than raw embedding cosine to determine whether the ranking order is functionally equivalent even when cosine similarity falls below the hard gate.
- Metal GPU path initialized with warnings (`ggml_metal_library_init_from_source: error compiling source`) and tensor API was disabled on this host. A follow-up should test Metal initialization on a supported environment to confirm whether GPU acceleration is available.
- Wire `powermetrics` into the benchmark harness with a sudo-optional path so peak watts are captured when the runner has elevated privileges.
