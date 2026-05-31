---
title: "Implementation Summary: Perf instrumentation + batching (measure-first)"
description: "Shipped the measure-first instrumentation gate (per-request inference ms + p50/p95 + queue depth in the server health payload, surfaced via embedder_status), real /api/embed batching (one batched extractor call per request; client embedBatch; router count+byte chunking), and a ready-once latch. Cache-into-reindex and the live throughput bench are deferred to phase 005 (live validation), where they can be done shard-correctly and measured."
trigger_phrases:
  - "perf instrumentation batching implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/004-perf-instrumentation-batching"
    last_updated_at: "2026-05-29T17:35:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped 004 instrument + batching + latch; review fixed 2 P1; cache + bench deferred to 005"
    next_safe_action: "Begin phase 005 live validation + flag-flip"
    blockers: []
    key_files:
      - ".opencode/bin/hf-model-server.cjs"
      - "shared/embeddings/providers/hf-local.ts"
      - "mcp_server/lib/embedders/execution-router.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003144"
      session_id: "031-004-impl-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Cache-into-reindex deferred to 005: the cache is co-located in the active vector shard, but reindex stores during the loop before attachActiveVectorShard runs, so entries are stranded in main; roadmap gates it on hit-rate measurement (no live model here)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-perf-instrumentation-batching |
| **Completed** | 2026-05-29 (instrumentation + batching + latch; cache-into-reindex + live bench → 005) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Measure-first: the instrumentation landed and was unit-tested before any optimization edit.

- **Instrumentation (the gate).** `hf-model-server.cjs` records per-inference wall time into a 256-sample ring (`recentInferMs`) and exposes a lazy `timing` summary (`p50Ms`/`p95Ms`/`lastMs`/`count`, null when idle) plus `queueDepth` in the `/api/health` payload — additive alongside the existing `inFlight` (002 back-compat). The `hf-local` client parses these into `getMetadata()`, so `embedder_status` (003) surfaces them. Zero overhead on the embed path; the percentile sort runs only on a health GET.
- **Real `/api/embed` batching.** The server runs the extractor **once per request** over the whole input array (`runExtractorBatch` + `sliceBatchOutput` with an authoritative `dims` shape guard), with a capability fallback to per-text only on an unambiguous array-rejection (transient coded errors never latch it off). The client `embedPrepared` takes a string array and adds a public `embedBatch` (per-text prefix, null-index re-expansion). The router replaces its per-text loop with `embedBatch`, chunking by **both** `SPECKIT_EMBED_CLIENT_MAX_BATCH` (count, default 256) **and** a ~768 KiB byte budget so a batch of large documents stays under the server's 1 MiB `MAX_REQUEST_BYTES`. A 50-row reindex collapses from 50 sequential POSTs to one batched call.
- **Ready-once latch.** `embedPrepared` skips the `/api/health` GET when a recent `waitForReady()` succeeded (within `SPECKIT_HF_READY_LATCH_TTL_MS`, default 30 s / max 120 s). The latch is invalidated immediately on a mid-request reap (`serverState=null` + `readyLatch=null`) and in the catch, so a dead/reaped server is always re-probed; the bounded 001 retry recovers a stale-latch POST.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/hf-model-server.cjs` | modify | timing ring + `timingSummary` + health `timing`/`queueDepth`; `runExtractorBatch`/`sliceBatchOutput`; tightened capability fallback + observability warn |
| `shared/embeddings/providers/hf-local.ts` | modify | client timing fields; `embedPrepared(string[])` + `embedBatch`; ready-once latch + invalidation |
| `shared/types.ts` | modify | `ProviderMetadata` optional `inferenceP50Ms`/`inferenceP95Ms`/`lastInferenceMs`/`queueDepth` |
| `mcp_server/lib/embedders/execution-router.ts` | modify | `embedBatch`-when-available, count + byte chunking |
| `mcp_server/ENV_REFERENCE.md` | modify | `SPECKIT_EMBED_CLIENT_MAX_BATCH` + `SPECKIT_HF_READY_LATCH_TTL_MS` rows |
| tests (`hf-model-server`, `hf-local-client`, `execution-router`) | modify | timing, batch slice/shape-halt, capability fallback, transient-no-latch, byte-budget split, latch hold/invalidate |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Designed via a 3-candidate design workflow → synthesized spec (minimal-diff spine + strict mis-slice/dead-server guards). Implemented via cli-codex (gpt-5.5, fast); codex completed STEP 1–3 and stopped at the STEP-4 cache test failures. The orchestrator diagnosed the cache failure to a shard-co-location bug (a self-lookup diagnostic showed `HIT` during the loop, null after `attachActiveVectorShard`), reverted STEP 4, then ran a 4-lens adversarial-review workflow (6 raised, 4 confirmed) and fixed the confirmed defects.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Cache-into-reindex deferred to 005 | The cache lives in the active vector shard (`cacheTable(db)` is shard-qualified), but reindex stores during the loop BEFORE `attachActiveVectorShard` runs at completion → entries stranded in main, never found post-swap. Needs shard-aware design + the roadmap's hit-rate measurement gate (no live model here) |
| Live throughput bench deferred to 005 | Phase 005 is the live-validation phase; a synthetic POST-counter adds little beyond the router unit tests, and real ms / optimal batch size need the real model |
| Capability fallback never latches off on a transient coded error | A one-off first-batch `ETIMEDOUT`/`ECONNRESET` must not silently degrade the server to per-row inference for its lifetime (review P1); only an unambiguous array-rejection message disables batching, with a one-time warn |
| Router chunks by bytes as well as count | Count-only chunking (256) could exceed the server's 1 MiB `MAX_REQUEST_BYTES` on large documents, failing a batch wholesale where pre-004 per-text succeeded (review P1) |
| Single batched timing sample, not per-row | Keeps the hot path one push per native call; p50/p95 measure per-batch latency (documented) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `tsc` (`@spec-kit/shared` + `@spec-kit/mcp-server`) | PASS |
| `node --check` hf-model-server.cjs | PASS |
| Embedder vitest suites (8) | PASS — 103 passed / 8 skipped |
| 4-lens adversarial review | 6 raised, 4 confirmed (2 P1 + 1 P2 + 1 P2 doc), all fixed; 2 refuted |
| `validate.sh --strict` on this packet | PASS — 0 errors |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live perf numbers.** Batching/latch correctness is unit-proven (one POST for N texts; latch holds within TTL and re-probes after a reap), but absolute p50/p95, the optimal `EMBEDDER_REINDEX_BATCH_SIZE`, and end-to-end throughput need the real model — measured in phase 005.
2. **Cache-into-reindex not shipped.** Deferred to 005 with a shard-aware design (store into the active shard's cache) and a measured hit-rate gate.
<!-- /ANCHOR:limitations -->
