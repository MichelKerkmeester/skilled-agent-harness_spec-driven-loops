# Iteration 1: Source-File Indexing Caller Audit

## Focus

Audit every production caller of `indexMemoryFile()` and `indexSingleFile()` for scan-like execution that can still persist quality-loop auto-fixes to source documents, with specific checks for async ingestion, retry processing, checkpoint rebuilds, and memory scripts.

## Actions Taken

1. Enumerated all `indexMemoryFile()` and `indexSingleFile()` definitions and call sites across the repository, then separated production paths from tests, fixtures, and historical scratch artifacts.
2. Traced the `memory_ingest_start` request through job creation, the sequential async worker, crash recovery, and the `context-server.ts` `processFile` callback.
3. Traced `persistQualityLoopContent` from origin resolution to both post-index source-file write sites.
4. Inspected the scripts workflow retry queue and checkpoint restore/repair rebuilds to determine whether either re-enters source-file indexing.
5. Checked existing tests for an assertion that async ingestion is non-persisting or scan-originated.

## Findings

### F-001: Async ingestion remains a destructive write-back caller

`memory_ingest_start` accepts existing spec-document paths and returns a queued job, rather than performing an explicit canonical save. Its worker callback calls `indexSingleFile(filePath, false, ...)` without `fromScan: true`; `indexSingleFile()` forwards the missing value, and `resolveIndexingOrigin()` consequently selects `direct`. That makes `indexMemoryFile()` set `persistQualityLoopContent: true`, and successful indexing can call `finalizeMemoryFileContent()` after the database operation. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-ingest.ts:128-132] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/context-server.ts:2440-2453] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts:537-555] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts:2217-2222] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts:2966-2976] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts:2785-2791]

The prior rationale that ingestion is caller-initiated does not establish save consent. The tool contract says it "begins batch ingestion ... from disk," and the response says the job was queued; neither surface says source files may be rewritten. The closest behavioral match is a requested scan over an explicit path set, not `memory_save`. Confidence: high. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-ingest.ts:128-130] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-ingest.ts:252-276]

### F-002: Crash recovery amplifies the ingest write-back exposure

Incomplete ingest jobs are reset to `queued`, their progress is reset to zero, and the original path list is replayed from the beginning after daemon restart. Therefore the unsafe direct-origin callback is not limited to the initial caller's live request; it can run later during unattended startup recovery and revisit already processed files. Indexing is intended to be idempotent at the database level, but source-file auto-fix persistence is still an external side effect. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/ops/job-queue.ts:224-249] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/ops/job-queue.ts:612-648] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/ops/job-queue.ts:739-750]

### F-003: No other production source-indexing caller was found

The production caller set is closed and small: explicit `memory_save`; startup scan; file watcher; `memory_index_scan` including force reindex; and async ingest. Startup, watcher, and index scan now pass scan origin. `indexMemoryFileFromScan()` is exported but has no production caller outside its definition/export; its remaining uses are tests. Direct `indexMemoryFile()` calls outside these paths are tests or script fixtures. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/context-server.ts:1726-1743] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/context-server.ts:2477-2501] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts:1515-1543] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts:2994-3001] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts:3779-3791]

### F-004: Existing ingest test does not guard origin or source immutability

The context-server test only regex-checks that ingest calls `indexSingleFile()` with synchronous semantics. It does not require `fromScan: true`, a non-persisting origin, or unchanged source content. A focused regression test is needed during implementation. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/tests/context-server.vitest.ts:2568-2574]

### Recommended follow-up fix boundary

Implementation should make async ingest non-persisting without changing explicit `memory_save`. The smallest current change is to classify the ingest callback as scan-originated; a more semantically precise future option is an `ingest` origin whose policy is also `persistQualityLoopContent: false`. The latter avoids conflating provenance and reconsolidation policy, but is broader than required for this bug. No implementation was performed in this research iteration.

## Questions Answered

1. **Key Question 1: answered.** The write-back bug class is not fully closed. `memory_ingest_start` is one residual production caller because its asynchronous and restart-replayed indexing defaults to direct-save origin. No retry-manager, checkpoint rebuild, or scripts/memory source-indexing caller was found.

## Questions Remaining

1. What exact launcher sequence exceeds OpenCode's MCP startup timeout during cold or contended boot?
2. Is the model-server socket fallback reachable outside bare-shell invocation, and what short fallback is safest?
3. What holds the SQLite writer lock during the observed long scan stall?
4. Which incremental daemon lease, re-election, and lock-arbitration changes have the best concurrency payoff?

## Sources Consulted

- `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts`
- `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts`
- `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-ingest.ts`
- `.opencode/skills/system-spec-kit/mcp-server/context-server.ts`
- `.opencode/skills/system-spec-kit/mcp-server/lib/ops/job-queue.ts`
- `.opencode/skills/system-spec-kit/mcp-server/lib/providers/retry-manager.ts`
- `.opencode/skills/system-spec-kit/mcp-server/lib/storage/checkpoints.ts`
- `.opencode/skills/system-spec-kit/scripts/core/workflow.ts`
- `.opencode/skills/system-spec-kit/mcp-server/tests/context-server.vitest.ts`

## Assessment

- `newInfoRatio`: 0.82
- Novelty justification: the iteration closed the full production caller inventory, confirmed one previously debated residual write-back path, and ruled out three named but structurally unrelated path classes.
- Confidence: high for caller completeness within repository text search; high for the ingest write-back mechanism; medium-high for the recommended minimal classification because implementation must also verify provenance/reconsolidation expectations.

## Reflection

- Worked: exact symbol enumeration followed by end-to-end call tracing produced a bounded caller set and direct source-write evidence.
- Ruled out: embedding retry processing does not call either file indexer; it reads stored/file content only to update an existing row's embedding. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/providers/retry-manager.ts:989-1061]
- Ruled out: checkpoint restore and needs-rebuild repair rebuild database-derived entities, degree/community artifacts, FTS, BM25/cache state, and trigger caches; they do not parse or rewrite source documents. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/storage/checkpoints.ts:1943-2027] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/checkpoints.ts:564-583]
- Ruled out: the scripts workflow's retry queue delegates to the same embedding retry manager and reports pending embeddings, not source-file reindexing. [SOURCE: .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1886-1905]

## SCOPE VIOLATIONS

None. The researched code requires a follow-up implementation change and test, but both are outside this iteration's allowed write paths and were not modified.

## Next Focus

Iteration 2 should trace `mk-spec-memory-launcher.cjs` from process entry through live-owner probing, bootstrap-lock acquisition, daemon spawn/lease bridge, and demand-listener setup, assigning elapsed-time and blocking behavior to each step against OpenCode's observed approximately 1.2-second failure window.
