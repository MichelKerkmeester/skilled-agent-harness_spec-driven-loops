# Deep Review Dashboard - gpt55r2-b-10

| Field | Value |
| --- | --- |
| Session | `fanout-gpt55r2-b-10-1781761339355-o7qylx` |
| Executor | `cli-opencode model=openai/gpt-5.5-fast` |
| Iterations | 1 / 1 |
| Stop reason | `max_iterations` |
| Verdict | FAIL |
| Active P0 | 0 |
| Active P1 | 2 |
| Active P2 | 0 |

## Findings

| ID | Severity | Status | Title |
| --- | --- | --- | --- |
| DR-B-002-GPT55R2-B10-001 | P1 | active | Soft-delete tombstones remain visible through active retrieval and listing surfaces |
| DR-B-002-GPT55R2-B10-002 | P1 | active | Async ingest reports rejected/error indexing results as successful files |

## Coverage

| Area | Evidence |
| --- | --- |
| Delete/tombstone lifecycle | `memory-crud-delete.ts`, `memory-bulk-delete.ts`, `vector-index-mutations.ts` |
| Active query/list consumers | `vector-index-queries.ts`, `sqlite-fts.ts`, `hybrid-search.ts`, `graph-search-fn.ts` |
| Async ingest lifecycle | `context-server.ts`, `job-queue.ts`, `memory-ingest.ts`, `memory-index.ts`, `memory-save.ts` |

## Synthesis

The reviewed surface is not release-ready. Both findings are active P1 issues because they make lifecycle operations report success while stale or absent memory state remains observable to callers.
