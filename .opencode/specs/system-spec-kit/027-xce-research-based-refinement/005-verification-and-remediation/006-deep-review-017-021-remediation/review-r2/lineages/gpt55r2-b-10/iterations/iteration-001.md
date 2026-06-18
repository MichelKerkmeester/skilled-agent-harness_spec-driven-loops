# Iteration 001 - gpt55r2-b-10

## Verdict

FAIL: two active P1 lifecycle correctness findings were confirmed.

## Review Pass

The pass audited delete/tombstone behavior, active retrieval/listing consumers affected by delete semantics, and async ingest job accounting. Search internals were read only where needed to confirm whether store/index mutations are honored by active consumers.

## Finding DR-B-002-GPT55R2-B10-001

Severity: P1

Soft-delete tombstones remain visible through active retrieval and listing surfaces.

Confirmed evidence:

- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:78-99` uses the `SPECKIT_SOFT_DELETE_TOMBSTONES` path to update only `memory_index.deleted_at`.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:50-70` implements the same tombstone helper, and `:245-248` applies it to every selected row.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:727-779` shows what the hard-delete path normally cleans: vector payloads, ancillary rows, embedding cache, the memory row, search caches, and BM25 documents.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:410-455` and `:553-568` perform vector and multi-concept searches without `deleted_at IS NULL`.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:197-204` joins `memory_fts` to `memory_index` without filtering tombstones.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:720-743` and `:2207-2223` build trigger and structural result sets without tombstone filtering.
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:169-187` and `:270-282` seed causal graph results from FTS/LIKE matches without tombstone filtering.

Why it matters:

A successful delete can leave the row searchable or listable when soft tombstones are enabled. This violates deletion and retention expectations and can leak records through multiple active channels.

Recommended remediation:

Either make tombstoning remove active projection/vector/FTS/BM25/ancillary surfaces and invalidate caches, or add consistent `deleted_at IS NULL` filtering across all active consumers and ensure active projections exclude tombstones. Add regression tests for both single and bulk delete in soft-tombstone mode.

## Finding DR-B-002-GPT55R2-B10-002

Severity: P1

Async ingest reports rejected/error indexing results as successful files.

Confirmed evidence:

- `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2199-2210` configures `processFile` to await `indexSingleFile(...)` and discard its result.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:325-343` shows `indexSingleFile` returns `indexMemoryFile`'s `IndexResult`.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2200-2217`, `:2362-2378`, `:2438-2453`, and `:2496-2501` return `rejected` or `error` results for non-throwing failure modes.
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:632-649` appends per-file errors only when `processFileFn` throws, then increments processed. `:657-663` marks the job complete when `failCount` is zero.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts:105-121` and `:310-313` expose only the queue state and `job.errors`, so ignored returned failures are invisible in status.
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1073-1085` and `:1141-1166` demonstrate the synchronous scan path already classifies non-success statuses and records rejection details.

Why it matters:

Batch ingest can silently skip rejected files while reporting `complete` with no errors. Operators lose retry and diagnostics, and the memory index remains incomplete.

Recommended remediation:

Map `IndexResult.status` in the ingest callback using the same successful-status set as `memory_index_scan`. Throw or return a typed failure for non-success results, append rejection details to `job.errors`, and add tests for resolved `rejected` and `error` results.

## Convergence

Not converged. The loop stopped because `maxIterations` was 1 and active P1 findings remain.
