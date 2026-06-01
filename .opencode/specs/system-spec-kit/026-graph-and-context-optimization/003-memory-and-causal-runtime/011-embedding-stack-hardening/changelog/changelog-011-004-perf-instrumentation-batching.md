# Changelog , , ,  004: Perf instrumentation + batching (measure-first)

**Shipped**: 2026-05-29
**Commit**: 4b2c5de6a3

## What Changed
- Modified `.opencode/bin/hf-model-server.cjs` to add timing ring (256-sample recentInferMs), timingSummary (p50Ms/p95Ms/lastMs/count), and health timing/queueDepth fields
- Modified `.opencode/bin/hf-model-server.cjs` to add real /api/embed batching with runExtractorBatch and sliceBatchOutput
- Modified `shared/embeddings/providers/hf-local.ts` to add client timing fields, embedPrepared(string[]) + embedBatch, and ready-once latch with invalidation
- Modified `shared/types.ts` to add optional inferenceP50Ms/inferenceP95Ms/lastInferenceMs/queueDepth to ProviderMetadata
- Modified `mcp_server/lib/embedders/execution-router.ts` to use embedBatch-when-available with count + byte chunking
- Modified `mcp_server/ENV_REFERENCE.md` to document SPECKIT_EMBED_CLIENT_MAX_BATCH and SPECKIT_HF_READY_LATCH_TTL_MS
- Updated tests for timing, batch slice/shape-halt, capability fallback, transient-no-latch, byte-budget split, and latch hold/invalidate
- Cache-into-reindex and live throughput bench deferred to phase 005

## Why
The perf items were guesses without instrumentation. A 50-row reindex issues 50 sequential POSTs instead of one batched call. waitForReady runs on every embed instead of latching once. The cache is wired into the query path but not into reindex, so reindex re-embeds rows the cache already holds.

## Verification
- `tsc` (@spec-kit/shared + @spec-kit/mcp-server): PASS
- `node --check` hf-model-server.cjs: PASS
- Embedder vitest suites (8): PASS , , ,  103 passed / 8 skipped
- 4-lens adversarial review: 6 raised, 4 confirmed (2 P1 + 1 P2 + 1 P2 doc), all fixed, 2 refuted
- `validate.sh --strict` on this packet: PASS
