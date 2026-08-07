# Iteration 3: Memory Correctness Impact

## Focus

Determine whether entity-density cache staleness and atomic-save ordering corrupt retrieval or graph-channel routing under normal single-user operation.

## Actions Taken

- Inspected `memory_update`, shared mutation hooks, vector-index mutation helpers, entity-density cache implementation, and query-router graph preservation.
- Inspected atomic save ordering across pending-file write, DB indexing, final promotion, rollback, and memory-save commit flow.
- Cross-checked the original review findings and existing entity-density tests.

## Findings

1. `memory_update` can change exactly the fields used by entity-density, but the update path does not invalidate the entity-density cache. It builds `UpdateMemoryParams` from `title` and `triggerPhrases`, calls `vectorIndex.updateMemory`, and later runs shared post-mutation hooks. Those hooks clear trigger, tool, constitutional, graph-signal, degree, and coactivation caches, but they do not call `invalidateEntityDensityCache()`. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:90] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:304] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:20] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:68]

2. The stale-cache impact is graph-channel routing, not durable data corruption. Entity-density caches title and trigger tokens from memory rows with at least three outgoing causal edges, and `query-router` uses a score of at least 2 to preserve the graph channel and degree channel. A stale cache can therefore over-route or under-route graph/degree for short entity-rich queries until TTL expiry or another invalidation. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:4] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts:21] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts:85] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts:247]

3. Save, bulk-delete, relation-backfill, and lower-level single delete already invalidate entity-density; update is the remaining confirmed gap. The existing integration test explicitly notes that memory-save end-to-end coverage is deferred and proves direct invalidation behavior, while bulk-delete has an end-to-end assertion. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2703] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:699] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tests/integration/entity-density-commit-hooks.vitest.ts:64] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tests/integration/entity-density-commit-hooks.vitest.ts:79]

4. Atomic save has a durable consistency window. `atomicIndexMemory` writes a pending file, then calls `indexPrepared`, and only after that promotes the pending file to the final path. The `indexPrepared` implementation calls `processPreparedMemory`, whose write transaction commits the new `memory_index` row before returning. A process crash between DB success and final `renameSync` leaves a committed index row for content that was never promoted to the canonical file path. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:360] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:362] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:378] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2637]

5. Promotion failure after index success is retried, but there is no compensating DB cleanup in the wrapper. The catch path cleans pending files and restores the original final file only if promotion had already happened. If promotion throws before `promotedToFinalPath` is true, the DB row created by `indexPrepared` remains outside the wrapper's rollback scope. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:387] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:394] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:430] [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:444]

## Questions Answered

- Q3 is answered. Entity-density staleness is a transient routing correctness bug under normal single-user operation; atomic-save ordering is a durable consistency risk whenever the process crashes or promotion fails in the DB-committed-before-rename window.

## Questions Remaining

- Q4 P0 severity calibration.
- Q5 deep-loop blast radius.

## Reflection

What worked: separating cache freshness from durable file/index ordering avoided overstating the entity-density bug.

What failed: the original review language sometimes bundled update/delete together; direct code reads show lower-level delete already invalidates entity-density.

Ruled out: "all memory mutation paths miss entity-density invalidation" is too broad. The confirmed gap is update, plus incomplete save-path end-to-end test coverage.

## Recommended Next Focus

Q4 severity calibration: inspect scope-governance enforcement, local MCP threat assumptions, and the two P0 scope/auth findings.

## Assessment

- newInfoRatio: 0.76
- Novelty justification: Distinguishes transient graph routing staleness from a durable DB/file inconsistency window and narrows the entity-density gap to update.
- Confidence: High on code-path ordering and cache invalidation surface; medium on runtime probability because crash-window likelihood is operational rather than deterministic.
