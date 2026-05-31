# Changelog — 003: Rewrite hf-local as an HTTP model-server client

**Shipped**: 2026-05-29
**Commit**: 4b2c5de6a3

## What Changed
- Rewrote `shared/embeddings/providers/hf-local.ts` from in-process transformers to an ollama-shaped HTTP client against the Phase-002 model server
- No longer imports transformers or loads a model in-process
- Public IEmbeddingProvider surface unchanged (embedDocument/embedQuery/generateEmbedding/warmup/healthCheck/getMetadata/getProfile/canLoad)
- dispose() is now a client no-op (server owns the model)
- Nomic search_query:/search_document: prefixes stay client-side (PREFIX_REGISTRY/getPrefixFor) and are applied once before POST /api/embed
- Two-layer readiness retries ECONNREFUSED/ENOENT/503-loading up to HF_EMBED_SERVER_READY_TIMEOUT_MS (~45s)
- Dim adopted from server (/api/health or embed response); 404 maps to ollama-style model-missing cascade
- Provisional default dim (768 for nomic) seeds getMetadata().dim before server is reached
- Created `mcp_server/tests/embedders/hf-local-client.vitest.ts` with client tests
- Updated embedding tests to HTTP-client provider and removed obsolete in-process dispose tests

## Why
hf-local.ts currently owns in-process transformers execution. After the model server exists, keeping that load path in the provider would duplicate lifecycle, dimension, timeout, and readiness behavior instead of matching the proven ollama client shape.

## Verification
- `npm run build --workspace=@spec-kit/shared` + `@spec-kit/mcp-server` (tsc; factory/importers compile unchanged): PASS
- `vitest run` 11 embedding/embedder/prefix/health/client files: PASS (86 passed / 8 skipped / 0 failed)
- SC-001: no @huggingface/transformers/pipeline( in hf-local.ts: PASS (pure HTTP client)
- 4-lens opus adversarial review (surface / prefixes / readiness / dim-404-transport): PASS functional — 5 stale tests + 1 P1 dim-contract issue found + fixed
- `validate.sh --strict` on this packet: PASS
