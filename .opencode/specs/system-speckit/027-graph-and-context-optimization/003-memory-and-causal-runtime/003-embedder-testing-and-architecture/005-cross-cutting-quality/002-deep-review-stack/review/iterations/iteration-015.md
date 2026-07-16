# Iteration 015 — TRACEABILITY (production debug-ability)

## P0 Findings

### P0-1: Reindex job has NO progress logging during long-running batch operations
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts`
- **Lines:** 272-291 (while loop in runJob function)
- **Issue:** The reindex job processes memory_index in batches (default 50 rows) but emits NO logging during the long-running operation. The while loop at lines 272-291 updates the database status but provides no console/logger output for progress visibility. An SRE cannot tell if the job is stuck, making progress, or how long it will take.
- **Reproduction (SRE scenario):** Production reindex job for 100K memories appears stuck. SRE checks logs and finds NO progress indicators - only the initial job start and final completion. Cannot determine if the job is actually processing or hung. No visibility into batch completion rate, embedder latency per batch, or ETA beyond the estimateEta function which requires a separate DB query.
- **Recommendation:** Add structured progress logging at each batch completion: log batch number, processed count, total count, batch size, embedder latency, and calculated ETA. Use a configurable log level (info/warn) so SREs can enable in production without noise.

### P0-2: Retrieval rescue layer has NO decision logging
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts`
- **Lines:** 346-375 (applyRetrievalRescueLayer function)
- **Issue:** The rescue layer makes critical decisions about which queries trigger rescue, how many backfill rows to consider, and which rows get rescued - but emits NO logging at all. The entire function is silent. An SRE cannot debug rescue behavior (e.g., "rescue is rescuing too much" or "rescue is missing relevant rows") because there is no visibility into the decision process.
- **Reproduction (SRE scenario):** Production alerts show search latency increased after a deployment. SRE suspects the rescue layer is triggering too often, adding DB queries for sibling/backfill fetch. Checking logs, there is NO record of which queries triggered rescue, how many backfill rows were fetched, or which rows were actually rescued. Cannot correlate the latency spike to rescue behavior.
- **Recommendation:** Add structured decision logging at key points: log when rescue is enabled for a query, log the count of backfill rows fetched, log the count of sibling rows fetched, log the count of rows that passed the rescue score threshold (0.24), and log the final rescued count. Include query hash/fingerprint for correlation.

## P1 Findings

### P1-1: Stage2 fusion lacks input fingerprinting for output correlation
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- **Lines:** 480-1478 (entire fusion pipeline, especially the main fusion function)
- **Issue:** The stage2-fusion pipeline applies 13 signal application steps but does NOT log or record an input query fingerprint/hash. Without an input fingerprint, an SRE cannot correlate fusion output (scores, ranking order) back to the specific input query that produced it. This makes debugging ranking issues impossible in production - you see the output but cannot tie it to the input.
- **Reproduction (SRE scenario):** Production user reports "search results changed unexpectedly" for a specific query. SRE has access to fusion output logs (scores, graph contributions, rescue signals) but cannot determine which input query produced that output because no query hash/fingerprint is logged. Cannot reproduce the issue or correlate the output to the user's reported query.
- **Recommendation:** Compute and log a query fingerprint/hash at the start of stage2-fusion (e.g., SHA-256 of normalized query string + config hash). Include this fingerprint in all subsequent logging within the fusion pipeline so output can be correlated back to input.

### P1-2: No correlation ID propagation across the search pipeline
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- **Lines:** Entry point and all signal application steps
- **Issue:** The search pipeline (stage1 → stage2-fusion → stage3-rerank → stage4-filter) does NOT propagate a correlation ID across stages. Each stage operates independently without a shared request identifier. An SRE cannot trace a single request end-to-end through the pipeline to debug where latency or ranking issues occur.
- **Reproduction (SRE scenario):** Production alert shows high p99 latency for search requests. SRE needs to trace a slow request through all pipeline stages to identify the bottleneck (e.g., is it stage1 vector search, stage2 fusion graph signals, stage3 rerank, or stage4 filtering?). Without a correlation ID, logs from each stage cannot be linked together, making root cause analysis impossible.
- **Recommendation:** Implement correlation ID propagation: generate or accept a correlation ID at pipeline entry, pass it through all stages (stage2-fusion, stage3-rerank, stage4-filter), and log it at each stage boundary. This enables end-to-end request tracing in production logs.

## P2 Findings

### P2-1: No slow-query detection and logging in stage2-fusion hot path
- **File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- **Lines:** Entire fusion pipeline execution
- **Issue:** The stage2-fusion hot path has no slow-query detection or logging. While individual signal failures are logged (console.warn), there is no timing instrumentation to detect when the overall fusion pipeline or individual signal steps exceed a latency threshold. An SRE cannot proactively identify slow queries before they impact users.
- **Reproduction (SRE scenario):** Production latency metrics show increased p95 for search, but SRE cannot identify which specific queries are slow because there is no per-query timing instrumentation. Cannot tell if the slowness is caused by graph signals, co-activation spreading, community boost, or another signal step.
- **Recommendation:** Add timing instrumentation around the overall fusion pipeline and around expensive individual signal steps (graph signals, co-activation spreading, community boost). Log queries that exceed configurable latency thresholds (e.g., >500ms for fusion, >100ms for individual signals) with timing breakdown.

### P2-2: No metrics/counter integration for observability
- **File:** All three in-scope files (reindex.ts, stage2-fusion.ts, retrieval-rescue.ts)
- **Lines:** Entire codebase
- **Issue:** None of the in-scope files integrate with a metrics/counter system (e.g., Prometheus, StatsD, CloudWatch). All observability is ad-hoc console.warn logging. An SRE cannot build dashboards or set alerts based on structured metrics like "reindex job progress rate", "rescue trigger rate", "fusion latency percentiles", or "signal failure rates".
- **Reproduction (SRE scenario):** SRE wants to set up a dashboard for reindex job health (progress rate, ETA accuracy, failure rate) and search pipeline health (rescue trigger rate, fusion latency p99, signal failure rate). Without metrics integration, this requires parsing unstructured logs, which is fragile and high-latency. Cannot set real-time alerts on metric thresholds.
- **Recommendation:** Integrate a metrics/counter library (choose one already used in the codebase) and emit structured metrics for key operations: reindex batch completions, rescue triggers, fusion latency, signal application success/failure, slow queries. This enables observability dashboards and real-time alerting.
