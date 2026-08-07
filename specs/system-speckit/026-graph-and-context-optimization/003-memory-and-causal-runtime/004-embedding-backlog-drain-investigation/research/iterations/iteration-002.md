# Iteration 2: Retry Retention Parking Order

## Focus

Trace the exact mechanism by which `pending` embeddings become `failed` in `enforceRetryRetentionLimits()`: which rows are parked by max-age vs pending-cap, the order those branches run, and the `embedding_status` set each branch touches.

## Actions Taken

1. Read the current deep-research state, strategy, and iteration 1 narrative to avoid repeating the broad status-machine pass.
2. Inspected `retry-manager.ts` and the built `dist/lib/providers/retry-manager.js` around retention, queue selection, batch processing, and exported runtime constants.
3. Checked retry-manager startup callers in `context-server.ts` and opportunistic save response hooks to confirm where retention runs relative to embedding attempts.
4. Queried the live `context-index.sqlite` for current status counts, failure reasons, age keys, and which rows would cross the default pending-cap boundary.
5. Checked the retry-retention unit test to confirm the intended contract covers both retention branches.

## Findings

1. `enforceRetryRetentionLimits()` has two parking branches, and max-age runs first. It computes `oldestAllowedIso = now - maxAgeMs`, then updates rows where `embedding_status IN ('pending', 'retry')` and `COALESCE(last_retry_at, created_at, updated_at) < oldestAllowedIso`, setting `embedding_status = 'failed'`, `failure_reason = 'Retry retention max age exceeded'`, and `updated_at = nowIso`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:474] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:482] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:484]

2. Pending-cap parking runs after max-age, so expired rows are removed from the queue before the cap is calculated. The cap query re-selects only remaining `pending` / `retry` rows, orders them by `COALESCE(last_retry_at, created_at, updated_at) ASC, id ASC`, and selects rows after `OFFSET maxPending`. Those overflow ids are then updated to `failed` with `failure_reason = 'Retry retention pending cap exceeded'`, guarded again by `embedding_status IN ('pending', 'retry')`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:493] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:500] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:502]

3. The status set is narrow: both branches only park rows currently in `pending` or `retry`. They do not touch `success`, `failed`, or `partial`, and the pending-cap branch does not include a `retry_count` predicate. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:489] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:495] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:508]

4. Retention executes before embedding attempts in the background path. `runBackgroundJob()` calls `enforceRetryRetentionLimits()` before reading stats or calling `processRetryQueue()`, and `processRetryQueue()` then calls `getRetryQueue()`, which calls `enforceRetryRetentionLimits()` again before selecting candidates. This makes a drain pass capable of parking rows as failed before it attempts any vector generation. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:865] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:870] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:986] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:997] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:1009]

5. Runtime JS matches the TypeScript retention logic. The built `dist/lib/providers/retry-manager.js` uses the same max-age update, the same overflow selection with `LIMIT -1 OFFSET ?`, and the same second guarded update. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js`:313] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js`:319] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js`:327] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js`:335]

6. The defaults are module-load constants: `SPECKIT_RETRY_QUEUE_MAX_PENDING` defaults to `1_000`, and `SPECKIT_RETRY_QUEUE_MAX_AGE_MS` defaults to 24 hours. Because these are read into constants at module evaluation, a live daemon with stale environment keeps stale retention behavior until the process reloads this module in a new process. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:342] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:343] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:344] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:389]

7. The live database currently has `failed=7105`, `pending=10189`, `retry=50`, and `success=9623`. Every failed row has `failure_reason = 'Retry retention max age exceeded'`; there are no pending-cap failures in the current failed set. [SOURCE: sqlite query on `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite`]

8. The live pending/retry queue is no longer older than 24 hours, but it is still above the default cap. With the default `maxPending=1000`, the cap query would currently select 9,239 overflow rows: 9,184 `pending` plus 55 `retry`, beginning at queue rank 1001. That means the present backlog would re-park by pending-cap if processed by a daemon using default cap settings. [SOURCE: sqlite window query on `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite`]

9. The unit test contract confirms both branches are intentional: the retry-retention test imports `enforceRetryRetentionLimits(1, 1000, fixedDate)`, expects expired and overflow counts, and asserts both failure-reason SQL branches are issued. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tests/providers/retry-retention.vitest.ts`:44]

## Questions Answered

- Q1 is answered. Pending embeddings become `failed` through `enforceRetryRetentionLimits()` before retry embedding runs. The max-age branch parks old `pending` / `retry` rows first; the pending-cap branch then parks all remaining queue rows after the first `maxPending`, ordered by queue age key and `id`.
- The observed 7,105 failed rows came from the max-age branch, not the pending-cap branch. The current unfailed backlog would be vulnerable to pending-cap parking only if a daemon still used the default cap of 1,000.

## Questions Remaining

- Q2 needs a focused pass only if the reducer wants a standalone answer; iteration 1 and this iteration already show the retry-manager embeds clean `pending` rows by first claiming them as `retry`.
- Q3 remains open: `reindex --force` behavior still needs a dedicated trace through file discovery, dedup, and failed-status handling.
- Q5 remains open: daemon lifecycle and stale worker respawn are now more important because retention constants are read at module load.
- Q6 depends on Q3 and Q5: the operator procedure must avoid both stale retention defaults and a reindex path that populates vectors without reconciling metadata status.

## Next Focus

Q3: Trace `reindex --force` / `memory_index_scan({ force: true })` through file discovery, dedup, and status writes. Determine why a force reindex can report `Indexed/Updated: 0` while thousands of rows remain `failed` / `pending`, and whether `failed` rows are skipped, undiscovered, or simply not reset by design.
