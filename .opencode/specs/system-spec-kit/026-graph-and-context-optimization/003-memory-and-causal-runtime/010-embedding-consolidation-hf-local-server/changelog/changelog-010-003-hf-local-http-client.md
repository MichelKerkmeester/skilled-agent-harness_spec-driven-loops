---
title: "hf-local rewritten as HTTP model-server client"
description: "The in-process transformers embedding pipeline was replaced with an ollama-shaped HTTP client against the model server, keeping the public provider surface stable."
trigger_phrases:
  - "hf-local HTTP client"
  - "ollama shaped hf-local"
  - "HF_EMBED_SERVER_READY_TIMEOUT_MS"
  - "server-adopted dimension"
  - "hf-local prefix registry"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/003-hf-local-http-client` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server`

### Summary

hf-local.ts was rewritten from an in-process `@huggingface/transformers` provider into an ollama-shaped HTTP client against the Phase-002 model server. It no longer imports transformers or loads a model in-process. The public `IEmbeddingProvider` surface is unchanged so the factory and all importers compile without modification. `dispose()` is now a client no-op because the server owns model lifecycle. Client-side nomic prefixes are applied once before POST. A two-layer readiness retry handles connection and loading errors up to `HF_EMBED_SERVER_READY_TIMEOUT_MS`. The dimension is adopted from the server at runtime and a provisional default dim seeds the metadata contract before the server is reached. All 86 embedding tests pass with no regressions.

### Added

- HTTP client transport against the Phase-002 model server via POST `/api/embed`, supporting both HTTP and Unix socket endpoints.
- Two-layer readiness retry bounded by `HF_EMBED_SERVER_READY_TIMEOUT_MS`. `ECONNREFUSED`, `ENOENT`, and `503`-loading responses are retried during the connection phase. `EMBEDDING_TIMEOUT` applies only to post-ready requests.
- Server-adopted dimension resolution via `/api/health` or the first embed response.
- `404`-to-model-missing cascade following the ollama-style error convention.

### Changed

- The in-process model loading via `@huggingface/transformers` was removed from `hf-local.ts`. It is now a pure HTTP client.
- `dispose()` is now a client no-op. The server owns the model lifecycle.
- `EMBEDDING_TIMEOUT` is scoped to post-ready requests only. The connection and loading phase uses a separate bounded retry.
- Nomic `search_query:` and `search_document:` prefixes are applied client-side via `PREFIX_REGISTRY`/`getPrefixFor` before POST `/api/embed`.

### Fixed

- `getMetadata().dim` contract restored to `768` via a provisional default-dim seed that is overridden by server adoption at runtime.
- Stale in-process dispose tests removed from the provider-dispose test file.
- Health-reporting test T2 rewritten to probe server health instead of the deprecated in-process pipeline.

### Verification

- `npm run build --workspace=@spec-kit/shared` and `@spec-kit/mcp-server` (tsc) - PASS (exit 0)
- `vitest run` across 11 embedding, embedder, prefix, health, and client test files - PASS (86 passed, 8 skipped, 0 failed)
- SC-001: no `@huggingface/transformers` or `pipeline(` in `hf-local.ts` - PASS (pure HTTP client)
- 4-lens opus adversarial review (surface, prefixes, readiness, dim-404-transport) - PASS
- `validate.sh --strict` on this packet - PASS
- Live embed against a running server - DEFERRED to phase 004

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `shared/embeddings/providers/hf-local.ts` | Modified | Rewritten as an ollama-shaped HTTP client with readiness retry, server-adopted dim, client-side prefixes, and provisional default-dim seed |
| `mcp_server/tests/embedders/hf-local-client.vitest.ts` | Created | Client tests covering prefix-before-POST, readiness retry, dim adoption, 404 cascade, and canLoad health probe |
| `mcp_server/tests/embeddings.vitest.ts` | Modified | Updated to work with the HTTP-client provider |
| `mcp_server/tests/embedder-provider-dispose.vitest.ts` | Modified | Removed obsolete in-process HfLocalProvider.dispose tests |
| `mcp_server/tests/local-llm-features/health-reporting.vitest.ts` | Modified | T2 rewritten to probe server health. T1 and T3 pass via the provisional default-dim seed. |

### Follow-Ups

- Not wired to a live server yet. Phase 004 adds launcher supervision of the 002 server.
- Provisional default dim (768) is a startup convenience for the canonical nomic model. The server-reported dim is the runtime authority.
- Live embed round-trip is deferred to phase 004. Readiness retry, 404 cascade, and dim adoption are covered by mocked-transport tests.
