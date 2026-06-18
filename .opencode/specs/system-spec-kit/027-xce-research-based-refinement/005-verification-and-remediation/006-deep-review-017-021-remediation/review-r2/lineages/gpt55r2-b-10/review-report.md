# Deep Review Report - gpt55r2-b-10

## 1. Verdict

FAIL. The one-iteration review found two active P1 lifecycle correctness issues in the `B-rest-of-002` store/index scope.

## 2. Scope

- Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002`
- Artifact directory: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/lineages/gpt55r2-b-10`
- Target: non-search memory store/index/lifecycle code under `.opencode/skills/system-spec-kit/mcp_server/`
- Constraint honored: `resolveArtifactRoot` was not run; artifact_dir was bound directly.

## 3. Executive Summary

The reviewed lifecycle surface has two confirmed success-reporting gaps. First, soft-delete tombstones can leave records active in projections and retrieval/listing paths. Second, async ingest ignores non-throwing `IndexResult` failures and can mark rejected files as successfully processed.

## 4. Findings

### DR-B-002-GPT55R2-B10-001 - P1 - Soft-delete tombstones remain visible through active retrieval and listing surfaces

`memory_delete` and `memory_bulk_delete` can take a feature-gated soft-delete branch that only updates `memory_index.deleted_at`. The branch does not call the hard-delete cleanup path and therefore leaves active projection, vector, FTS, BM25, ancillary, and cache state intact. Active consumers then omit `deleted_at IS NULL`.

Evidence:

- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:78-99`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:50-70,245-248`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:727-779`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:410-455,553-568,273-283,1332-1337`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:197-204`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:720-743,2207-2223`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:169-187,270-282`

Impact:

A deleted memory can remain searchable, listable, or rank-influential in soft-tombstone mode. This is a retention and privacy correctness bug because callers receive delete semantics while active read surfaces can still expose the record.

Recommended fix:

Centralize active-row filtering and deletion side effects. Either tombstone and remove active projection/vector/FTS/BM25/ancillary surfaces, or make every active read path require `deleted_at IS NULL` and ensure active projections cannot point at tombstoned rows. Add tests for single and bulk delete with `SPECKIT_SOFT_DELETE_TOMBSTONES=true`.

### DR-B-002-GPT55R2-B10-002 - P1 - Async ingest reports rejected/error indexing results as successful files

The async ingest callback in `context-server.ts` awaits `indexSingleFile` but ignores its returned `IndexResult`. The queue records a per-file failure only when the callback throws. `processPreparedMemory` returns `status: rejected` or `status: error` for several meaningful failures, so the job can finish as `complete` with no errors even when files were not indexed.

Evidence:

- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2199-2210`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:325-343,1073-1085,1141-1166`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2200-2217,2362-2378,2438-2453,2496-2501,2880-2901`
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:632-649,657-663`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:105-121,310-313`

Impact:

Operators can poll `memory_ingest_status` and see a complete job while quality/sufficiency/reconsolidation failures prevented indexing. The status response loses rejection reasons, no retry is signaled, and memory coverage silently drops.

Recommended fix:

Inspect `IndexResult.status` in the async ingest callback using the same successful-status set as `memory_index_scan`. Convert non-success statuses to queue errors with `rejectionCode`, `rejectionReason`, and `error` details; do not count them as successful processed files. Add tests where `indexSingleFile` resolves to `rejected` or `error` without throwing.

## 5. Non-Findings And Boundaries

- `indexMemoryFile` still throws for parsed validation invalidity at `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2853-2856`; the async ingest issue is specifically about returned failure statuses that do not throw.
- The soft-delete issue is feature-gated by `SPECKIT_SOFT_DELETE_TOMBSTONES`, but schema and tests include `deleted_at`, so the mode is a supported lifecycle path, not dead code.
- Broad search ranking quality was not reviewed outside mutation-effect verification.

## 6. Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/recovery-payload.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`

## 7. Verification

- Evidence was verified by direct file reads with line numbers.
- Artifact JSON and JSONL should be parsed as part of final verification.

## 8. Convergence

Not converged. The loop stopped because `maxIterations` was 1 and active P1 findings remain.

## 9. Recommended Next Action

Create a remediation packet or implementation task for the two P1s before considering `B-rest-of-002` release-ready.
