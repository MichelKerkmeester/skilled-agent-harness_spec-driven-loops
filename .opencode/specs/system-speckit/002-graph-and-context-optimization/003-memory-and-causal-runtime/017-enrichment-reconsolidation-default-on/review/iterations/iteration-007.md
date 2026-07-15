# Iteration 7 — security — async-bg-safety

**Verdict:** FAIL

Scope: Async background enrichment safety (0060a097b3). `setImmediate` runs DB writes (entities, summaries, causal edges, marker) after the save response returned and after the spec-folder lock released.

## Findings

- **[P1] Background enrichments are scheduled with no concurrency bound or backpressure**
  - File: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` (line 2693)
  - Evidence: `setImmediate(() => { runPostInsertEnrichment(database, backgroundId, backgroundParsed) ... })` schedules one enrichment per save; there is no queue, limiter, pending-count guard, or backpressure before DB/embedding work starts.
  - Recommendation: Route async enrichment through a bounded worker queue with a small concurrency cap, explicit retry/backoff for SQLITE_BUSY, and observable queue/failure metrics; keep the pending marker repairable when work cannot be queued.

- **[P1] Async task captures a DB handle that may be closed or swapped before enrichment finishes**
  - File: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` (line 2694)
  - Evidence: `runPostInsertEnrichment(database, backgroundId, backgroundParsed)` captures the current `database` object for later async work; the enrichment path includes awaited summary embedding before later DB writes, so shutdown/reopen can invalidate that handle while the task is still pending.
  - Recommendation: Do not retain the live handle across deferred async work. Re-acquire/validate the active DB inside the worker immediately before writes, register/drain in-flight enrichments during shutdown, and leave/revert the marker to a retryable failed/pending state on closed-handle errors.

- **[P1] Summary failures can be downgraded to skipped and allow a complete marker**
  - File: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/post-insert.ts` (line 355)
  - Evidence: `if (summaryResult.stored) { ... return { status: 'ran' }; } return makeSkipped('summary_not_stored');` treats `stored:false` as a benign skip, while `buildExecutionStatus` only promotes `failed` or `partial` steps to repairable status. DB write failures from the summary helper therefore do not necessarily surface as failed enrichment.
  - Recommendation: Make summary storage return a typed success/benign-empty/failure result, or let DB/embedding storage errors throw so `runEnrichmentStep` records `summary_exception` and schedules repair/backfill instead of marking the bundle complete.
