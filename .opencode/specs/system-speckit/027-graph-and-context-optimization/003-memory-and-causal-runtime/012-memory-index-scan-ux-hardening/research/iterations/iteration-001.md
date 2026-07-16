# Iteration 1: A1 Scan Lifecycle and Caller Contract

## Focus

This iteration traced the current `memory_index_scan` lifecycle, the lease and cooldown behavior, the existing embedder re-index job surface, and the retry/degraded-embedding paths. The goal was to recommend a future-proof caller-facing scan contract where repeated calls are safe and idempotent, the scan cooldown stays internal, and raw `E429` never becomes normal UX.

## Actions Taken

- Read the deep-research iteration/state rules and the packet's current state/strategy files.
- Traced `memory_index_scan` from argument handling through lease acquisition, discovery, batching, stale cleanup, and final response.
- Traced `acquireIndexScanLease()` and `completeIndexScanLease()` to confirm active-lease and cooldown semantics.
- Traced the existing embedder re-index job table, async runner, `embedder_status` poll surface, and ETA/progress model.
- Checked embedding degraded-mode building blocks: async embedding, `pending`/`retry` statuses, retry manager circuit breaker/backoff, and embedding circuit breaker.

## Findings

1. The current scan contract is synchronous and exposes internal coordination as caller-visible `E429`.

   `memory_index_scan` reserves the lease before file discovery and batch processing by calling `acquireIndexScanLease({ now, cooldownMs: INDEX_SCAN_COOLDOWN })` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:238]. If the lease is not acquired, the handler returns an MCP error with `error: 'Rate limited'`, `code: 'E429'`, `waitSeconds`, and user-facing recovery text [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:245]. The cooldown is a hardcoded `30000` ms constant, while only scan batch size is env-configurable through `SPEC_KIT_BATCH_SIZE` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/core/config.ts:116] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/core/config.ts:126].

   The lease layer has two distinct "not now" reasons: an active scan lease returns `reason: 'lease_active'` while the previous scan is still within expiry [SOURCE: .opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:443], and the post-completion cooldown returns `reason: 'cooldown'` when `lastIndexScan` is too recent [SOURCE: .opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:456]. Both collapse into the same raw caller error in the handler. `completeIndexScanLease()` then writes `last_index_scan` and deletes `scan_started_at`, which is what makes the cooldown fire after successful completion [SOURCE: .opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:501].

   Design implication: the lease is valuable as an internal thrash guard, but the caller contract is wrong. A second caller should receive "your scan request has joined the active job" or "recent scan is current" with a job id and status, not an error requiring human retry choreography.

2. The current request can do unbounded work under one MCP deadline.

   After acquiring the lease, the handler discovers constitutional files, spec docs, and graph metadata across the configured workspace/scope [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:270]. It merges and canonical-dedups the discovered paths in memory [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:301], then applies incremental categorization only when `incremental && !force` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:444]. For files selected for indexing, it calls `processBatches(filesToIndex, ...)` and awaits the full result before response construction [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:474]. `processBatches()` itself loops every batch until all items are processed, awaiting `Promise.all()` inside each batch and optional inter-batch delay before returning [SOURCE: .opencode/skills/system-spec-kit/mcp_server/utils/batch-processor.ts:138].

   The embedding path is also synchronous by default for scan-triggered indexing: `indexMemoryFile()` defaults `asyncEmbedding = false` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2700], `memory_index_scan` calls it without overriding async mode [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:489], and `generateOrCacheEmbedding()` calls `generateDocumentEmbedding()` on cache miss when async mode is false [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:154]. This explains why a large `force:true` scan can time out: `force` disables the incremental skip path and makes the request wait for every parse/index/embed batch.

   A2 initial conclusion: the timeout class is structural, not a tuning issue. Smaller `BATCH_SIZE` reduces concurrency but not request boundedness. The future contract needs chunked/resumable scan jobs with per-tick work caps, and vector embedding should be deferred when needed.

3. The embedder re-index job model is the right reusable pattern for scan jobs.

   The existing embedder job table already has `id`, `total`, `processed`, `status`, timestamps, and error columns [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:78]. Jobs are enqueued without awaiting the long-running work in the caller path [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:418]. The runner marks jobs `running`, processes batches, updates `processed`, yields with `setImmediate`, and eventually marks `completed` or `failed` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:473]. `startReindex()` inserts a queued job and returns the generated job id immediately [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:592]. It can also resume queued/running jobs on startup [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:658].

   The poll surface is already caller-friendly: `embedder_status` accepts an optional `jobId`, otherwise reports the active job, and returns `jobId`, `status`, `total`, `processed`, `eta`, error, and embedding provider health in a success envelope [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts:25] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts:117]. ETA is estimated from processed count and elapsed time [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:683].

   Design implication: scan should not invent a new UX model. It should reuse the job-id plus polling pattern, adapted to scan-specific units: discovered files, indexed files, stale rows deleted, failed files, pending embeddings, and current phase.

4. The system already has the degraded-mode pieces needed to separate "scan indexed text" from "vectors are caught up."

   The embedding pipeline's result type already distinguishes `status: 'success' | 'pending'` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:27]. Async embedding mode returns a cache hit as success or defers embedding without calling the provider [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:140]. The save response already tells callers that pending embeddings will complete when the provider becomes available [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:3387].

   The retry manager treats `pending` and `retry` as queue states [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:117], atomically claims pending rows so multiple workers do not double-process the same embedding [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:303], prioritizes pending before retry rows [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:557], and applies backoff for retry rows [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:579]. It also has a provider-level circuit breaker that opens after repeated failures and cools down for 120 seconds [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:386]. Separately, shared embedding calls have a circuit breaker controlled by `SPECKIT_EMBEDDING_CB_COOLDOWN_MS`, defaulting to 60000 ms, and return `null` immediately while open [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings.ts:49] [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings.ts:59] [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings.ts:676].

   Design implication: the scan contract can report `status: complete_with_pending_embeddings` or `status: indexed_degraded` as a success state. Search can keep lexical/FTS coverage while vectors catch up through the existing retry path.

5. Primary recommendation: make `memory_index_scan` an idempotent async scan-job contract with automatic coalescing.

   Recommended caller contract:

   - `memory_index_scan(args)` always returns a success envelope unless input validation fails.
   - The response includes `jobId`, `scanKey`, `status`, `phase`, `progress`, `eta`, `coalesced`, `degraded`, `warnings`, and `nextPollAfterMs`.
   - `scanKey` is a stable hash of normalized scope and options that materially change work: `specFolder`, `force`, `incremental`, `includeSpecDocs`, `includeConstitutional`, governance scope, and active workspace/db profile.
   - If a matching job is queued/running, the call returns that job with `coalesced: true`.
   - If the lease is active or the 30s cooldown would currently reject the request, the caller still receives the active/recent/coalesced job. The cooldown remains an internal guard that prevents duplicate worker starts, not a user-visible error.
   - If no matching job exists, the call creates or schedules one and returns immediately.
   - Polling should be done through a scan status surface that mirrors `embedder_status`; either `memory_index_scan_status({ jobId })` or an additive `memory_index_scan({ jobId })` status mode. I would choose `memory_index_scan_status` for clarity and keep `embedder_status` focused on vector re-index/provider health.
   - Optional compatibility: allow `waitForCompletionMs` with a small default cap for tiny scans, but when the cap is reached the response returns the job instead of timing out. Blocking completion should become an optimization, not the contract.

   Tradeoffs:

   - Latency: callers get a fast acknowledgement and no retry foot-gun. They may need a poll loop for completion, but `nextPollAfterMs` can make this mechanical.
   - Complexity: requires a scan job table/state machine, scan-key coalescing, job resume, and bounded worker steps. This is real complexity, but it maps cleanly onto the embedder job model already present.
   - Migration cost: moderate. The safest path is additive: keep current fields in the eventual completed response, but wrap them in job metadata and return early for large or contended scans.
   - MCP deadline safety: strong. The MCP request never owns unbounded tree walking, indexing, and embedding to completion.

6. Ruled out as primary contracts: current sync+cooldown, pure async without coalescing, and streaming-first progress.

   The current sync contract has the lowest migration cost, but it preserves both observed failure classes: raw `E429` on contention/cooldown and request timeout on large forced scans. Pure async job creation without coalescing fixes deadlines but still lets repeated callers enqueue duplicate work or fight the lease. Streaming progress gives the richest UX, but it depends on transport/client capabilities and does not by itself solve idempotency or resume. Streaming should be an optional enhancement layered on the job model, not the primary contract.

## Questions Answered

- A1 is answered. The recommended primary contract is an idempotent async scan job with scan-key coalescing and a `jobId` polling surface. The existing 30s cooldown should be retained only as an internal worker-start guard.
- A2 is partially answered. The current timeout risk comes from synchronous, request-bound discovery/indexing/embedding over all selected files, especially when `force:true` disables incremental skips. The design direction is chunked/resumable scan jobs plus deferred vectors.

## Questions Remaining

- A2 still needs a concrete resumable work-queue design: job schema, cursor/checkpoint fields, per-tick limits, failure recovery, and exact completion semantics.
- A3 needs concurrency analysis across multiple MCP clients, daemon IPC bridge clients, separate sessions, and worktrees.
- A4 needs a detailed degraded-mode policy for slow/absent embedders, circuit breaker UX, retry queue saturation, and batch sizing.
- A5 needs a self-healing design for moved spec folders, orphan-row GC, freshness telemetry, and operator-facing health/doctor surfaces.

## Next Focus

A2 UNBOUNDED-WORK / TIMEOUT HARDENING: design the scan-job work queue and resumable checkpoint contract. Specifically, define the phases, progress counters, per-invocation work cap, failure/retry semantics, and how lexical rows commit before vector embedding drains asynchronously.
