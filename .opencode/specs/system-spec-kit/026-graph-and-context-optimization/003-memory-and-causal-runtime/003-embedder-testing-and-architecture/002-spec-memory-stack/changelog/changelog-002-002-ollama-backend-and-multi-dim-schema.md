---
title: "016/002: Ollama backend adapter and dim-tagged vec schema"
description: "OllamaAdapter HTTP client and dim-tagged vec_<dim> schema shipped as an additive layer. Seven embedder-ollama tests, six embedder-schema tests and ten registry tests all pass. Existing vec_768 corpus untouched."
trigger_phrases:
  - "016/002 ollama backend"
  - "ollama adapter dim-tagged schema"
  - "vec_dim lazy table creation"
  - "active embedder pointer schema"
  - "embedder registry factory"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-17

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/002-ollama-backend-and-multi-dim-schema`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack`

### Summary

The memory stack had no concrete HTTP adapter for Ollama and no way to store embeddings at multiple dimensionalities. The `EmbedderAdapter` interface from phase 001 existed but had no implementation that could reach a running Ollama daemon. The vec table schema only handled a single fixed dimension.

Phase 002 shipped two complementary pieces as a fully additive layer. `OllamaAdapter` wraps the Ollama HTTP API using Node fetch, honors `OLLAMA_BASE_URL`, prefers `/api/embed` with a single-input fallback to `/api/embeddings`, applies document and query prefixes from the manifest and throws typed errors for unreachable backend, missing model and dimension mismatch. The dim-tagged schema helpers (`ensureVecTableForDim`, `getActiveEmbedder`, `setActiveEmbedder`) lazily create `vec_<dim>` tables on first reference and persist the active embedder name and dimension in the existing `vec_metadata` key/value table. A `getAdapter()` registry factory wires OllamaAdapter manifests and a baseline llama-cpp shim for `embeddinggemma-300m`. All existing retrieval callers, `vec_memories` and the Codex K commit were left untouched. Phase 003 can now route MCP tools through the new factory and schema layer without breaking the current 12,928-memory corpus.

### Added

- `lib/embedders/adapters/ollama.ts`: concrete `OllamaAdapter` with typed errors for unreachable backend, missing model and dimension mismatch
- `lib/embedders/schema.ts`: `ensureVecTableForDim(dim)` for lazy `vec_<dim>` table creation plus `getActiveEmbedder()` and `setActiveEmbedder()` backed by `vec_metadata` rows
- `lib/embedders/registry.ts`: `getAdapter(name)` factory covering Ollama manifests and a baseline llama-cpp shim
- `tests/embedder-ollama.vitest.ts`: 7-test mocked-HTTP suite covering happy path, missing model and prefix wiring
- `tests/embedder-schema.vitest.ts`: 6-test in-memory SQLite suite covering idempotent table creation and active-embedder read/write

### Changed

- `lib/embedders/index.ts`: barrel re-exports updated to expose adapter, schema helpers, factory and typed errors to downstream consumers

### Fixed

- No bugs were targeted in this phase. Work was net-new implementation against a previously absent capability.

### Verification

| Check | Result |
|-------|--------|
| `npm run build` | PASS |
| `npx tsc --noEmit` | PASS |
| `npx vitest run tests/embedder-ollama.vitest.ts` | PASS. 7 tests. |
| `npx vitest run tests/embedder-schema.vitest.ts` | PASS. 6 tests. |
| `npx vitest run tests/embedder-registry.vitest.ts` | PASS. 10 tests. |
| `node dist/cli.js stats` | PASS. Read-only baseline reported 12,928 memories in the llama-cpp 768-dim DB. |
| `validate.sh .../002-ollama-backend-and-multi-dim-schema --strict` | PASS. 0 errors, 0 warnings. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/lib/embedders/adapters/ollama.ts` (NEW) | Created | OllamaAdapter with fetch-based HTTP, prefix handling and typed error hierarchy |
| `mcp_server/lib/embedders/schema.ts` (NEW) | Created | Dim-tagged `vec_<dim>` table helpers and active-embedder pointer backed by `vec_metadata` |
| `mcp_server/lib/embedders/registry.ts` | Updated | `getAdapter()` factory added. Ollama manifests and llama-cpp shim wired. |
| `mcp_server/lib/embedders/index.ts` | Updated | Barrel exports extended to cover new adapter, schema helpers, factory and typed errors |
| `mcp_server/tests/embedder-ollama.vitest.ts` (NEW) | Created | 7-case mocked-HTTP coverage for OllamaAdapter |
| `mcp_server/tests/embedder-schema.vitest.ts` (NEW) | Created | 6-case in-memory SQLite coverage for schema helpers |

### Follow-Ups

- Route existing retrieval traffic through `getAdapter()` in Phase 003 once MCP tools are added.
- Add a live integration test against a real Ollama daemon to complement the mocked HTTP suite.
- Document `brew install ollama` and minimum required model names in the operator guide for contributors who run the full embedder stack locally.
