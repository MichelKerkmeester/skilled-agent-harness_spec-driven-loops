# Iteration 1: Embedding Status State Machine

## Focus

Trace the `embedding_status` state machine end-to-end for the embedding backlog drain. The pass focused on status writes in `retry-manager.ts`, the scan/reindex path, and `embedder_set` / `embedder_status`.

## Actions Taken

1. Read the deep-research strategy and current JSONL state to confirm iteration 1 scope.
2. Searched source for `embedding_status`, retry retention, reindex, and embedder swap paths under `.opencode/skills/system-spec-kit/mcp_server`.
3. Read the primary source paths: `lib/providers/retry-manager.ts`, `lib/search/vector-index-mutations.ts`, `handlers/memory-index.ts`, `handlers/memory-save.ts`, `handlers/save/dedup.ts`, `lib/embedders/reindex.ts`, `handlers/embedder-set.ts`, and `handlers/embedder-status.ts`.
4. Queried the live sqlite status/failure distribution to verify whether failed rows match a retention reason.

## Findings

1. The exact parking path is `enforceRetryRetentionLimits()`. It first marks aged rows as `failed` where `embedding_status IN ('pending', 'retry')` and `COALESCE(last_retry_at, created_at, updated_at)` is older than `maxAgeMs`, with failure reason `Retry retention max age exceeded`. It then selects remaining `pending` / `retry` rows ordered oldest first and parks every row after `OFFSET maxPending` as `failed` with reason `Retry retention pending cap exceeded`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:474-523]

2. The live DB matches the max-age branch, not the pending-cap branch: `failed=7105`, `pending=10199`, `retry=40`, `success=9623`, and all 7,105 failed rows have failure reason `Retry retention max age exceeded`. This confirms the parked rows in the observed backlog were aged `pending` / `retry` rows. [SOURCE: sqlite query on `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite`]

3. The retry manager does process clean `pending` rows. `getRetryQueue()` selects `embedding_status IN ('pending','retry')`, orders `pending` ahead of `retry`, and treats `pending` as immediately eligible. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:529-577]

4. The clean retry-manager success path is not direct `pending -> success`. `claimRetryCandidate()` first atomically claims a `pending` row by setting it to `retry`; `retryEmbedding()` then writes `embedding_status = 'success'` only after generating or loading an embedding and inserting `vec_memories`. So the retry-manager path is `pending -> retry -> success`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:293-329,645-750]

5. Retry failures move through two paths: transient failures call `incrementRetryCount()` and set `embedding_status = 'retry'` until `MAX_RETRIES`; once exhausted, `markAsFailed()` writes `embedding_status = 'failed'`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:770-831]

6. The initial indexing path can write clean `success` without the retry manager. `index_memory()` inserts `success` when sqlite-vec is available; otherwise it inserts `pending`. On update with an embedding, `update_memory()` temporarily sets `pending`, writes the vector row, then marks `success` after the vector write is confirmed. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts`:259-297,509-546]

7. Deferred indexing writes or resets rows to `pending`. Existing deferred records are updated to `pending`, `retry_count = 0`, `last_retry_at = NULL`; new deferred records insert with `embedding_status = 'pending'`. This is the source of backlog rows when embedding generation is skipped, fails, or async embedding is requested. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts`:300-383]

8. `memory_index_scan({ force: true })` is not a global status reset. Force disables the incremental categorizer, but each file still flows through `indexSingleFile()` / `indexMemoryFile()`. The dedup precheck still returns `unchanged` during force when same-path content and metadata match and the existing status is `success`, `pending`, or `partial`; `failed` is not in that unchanged-eligible set. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`:444-493; `.opencode/skills/system-spec-kit/mcp_server/handlers/save/dedup.ts`:15-16,255-279]

9. `embedder_set(name)` does not directly write `memory_index.embedding_status`. It validates the embedder, ensures the vector table, and queues `startReindex()`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts`:54-94]

10. The embedder reindex job writes vectors to the target vec table and shard, then flips the active embedder and marks the job completed only after all rows are processed. It selects all `memory_index` rows and has no `embedding_status` filter or `embedding_status` update, so it can populate a new active shard while leaving `pending`, `retry`, or `failed` metadata untouched. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts`:219-225,392-448]

11. `embedder_status` is read-only for the embedding metadata state machine. It maps queued/running/completed job state from `embedder_jobs` and does not commit `memory_index.embedding_status`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts`:68-86]

## Questions Answered

- Q1 answered for the observed failure: aged `pending` / `retry` rows were parked by `enforceRetryRetentionLimits()` through the max-age branch before retry processing.
- Q2 answered: the retry manager does embed clean `pending` rows, but it claims them as `retry` first. The initial direct `pending/success` write belongs to the save/indexing path.
- Q4 partially answered: `embedder_set()` and the embedder reindex job write vectors and job/active-embedder state, but do not update `memory_index.embedding_status`; statuses cannot "stick" there because they are never written there.

## Questions Remaining

- Q3 still needs a focused pass on why an observed force reindex reported `Indexed/Updated: 0` against the full backlog. The code shows force is file-discovery and dedup driven, not a status reset, but the exact observed zero-update path likely depends on file discovery, same-path dedup, or rows whose source files are no longer discovered.
- Q5 remains open: daemon lifecycle and stale worker respawn were not inspected in this iteration.
- Q6 remains open: the minimal operator drain procedure depends on the daemon lifecycle and a reliable trigger that writes `memory_index.embedding_status`, not just a vector shard.

## Next Focus

Trace `memory_index_scan({ force: true })` and the CLI reindex flow against file discovery, dedup, and failed-row handling. The target question is why a force scan can report `Indexed/Updated: 0` while thousands of rows remain `failed` / `pending`, and whether those rows are undiscovered, deduped, or not status-reset by design.
