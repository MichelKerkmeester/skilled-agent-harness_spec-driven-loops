---
title: "Changelog: Perf instrumentation + batching (measure-first)"
description: "Shipped the measure-first instrumentation gate (per-request inference ms plus p50/p95 plus queue depth in the server health payload), real /api/embed batching (one batched extractor call per request), and a ready-once latch. Cache-into-reindex and the live throughput bench are deferred to phase 005."
trigger_phrases:
  - "perf instrumentation batching implementation summary"
  - "embed path instrumentation p50 p95"
  - "real /api/embed batching"
  - "ready-once latch cache-into-reindex"
  - "phase changelog"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/004-perf-instrumentation-batching` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening`

### Summary

The instrumentation landed and was unit-tested before any optimization edit. This phase shipped real /api/embed batching (one batched call for N texts with count and byte chunking), a ready-once latch that skips redundant health checks within a TTL, and the timing ring exposing p50/p95/queue depth in the server health payload. Cache-into-reindex and live throughput benchmarking are deferred to phase 005 where they can be done with a real model.

### Added

- Real /api/embed batching that passes the whole array and makes one batched extractor call per request, with count chunking (default 256) and a byte budget (~768 KiB) guard
- Ready-once latch that skips the waitForReady health GET when a recent call succeeded, re-validates lazily on error or after a TTL (default 30 s, max 120 s), and invalidates immediately on a reap
- Per-request inference latency instrumentation exposing a 256-sample rolling ring and a lazy timingSummary (p50Ms/p95Ms/lastMs/count) plus queueDepth in the server /api/health payload, surfaced through embedder_status

### Changed

- Measure-first discipline applied: the instrumentation gate was unit-tested before any batching or latch optimization edits were made

### Fixed

- None.

### Verification

- tsc (@spec-kit/shared + @spec-kit/mcp-server) - PASS
- node --check hf-model-server.cjs - PASS
- Embedder vitest suites (8) - PASS, 103 passed / 8 skipped
- 4-lens adversarial review - 6 raised, 4 confirmed (2 P1, 1 P2, 1 P2 doc) all fixed, 2 refuted
- validate.sh --strict on this packet - PASS, 0 errors

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/bin/hf-model-server.cjs` | modify | timing ring and timingSummary with p50/p95/lastMs/count, health timing and queueDepth, runExtractorBatch and sliceBatchOutput, tightened capability fallback and observability warn |
| `shared/embeddings/providers/hf-local.ts` | modify | client timing fields, embedPrepared(string[]) and embedBatch, ready-once latch with immediate invalidation on reap |
| `shared/types.ts` | modify | ProviderMetadata optional inferenceP50Ms, inferenceP95Ms, lastInferenceMs, and queueDepth fields |
| `mcp_server/lib/embedders/execution-router.ts` | modify | embedBatch-when-available with count and byte chunking |
| `mcp_server/ENV_REFERENCE.md` | modify | SPECKIT_EMBED_CLIENT_MAX_BATCH and SPECKIT_HF_READY_LATCH_TTL_MS rows |

### Follow-Ups

- No live perf numbers. Batching and latch correctness are unit-proven (one POST for N texts, latch holds within TTL and re-probes after a reap), but absolute p50/p95, the optimal EMBEDDER_REINDEX_BATCH_SIZE, and end-to-end throughput need the real model, measured in phase 005.
- Cache-into-reindex not shipped. Deferred to 005 with a shard-aware design (store into the active shard cache) and a measured hit-rate gate.
