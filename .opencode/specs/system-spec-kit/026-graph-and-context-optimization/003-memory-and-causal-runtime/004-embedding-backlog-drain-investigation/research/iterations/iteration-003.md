# Iteration 3: Retry Retention Parking Mechanism

## Focus

Q1: Trace the exact mechanism by which `pending` embeddings become `failed` in `enforceRetryRetentionLimits()` in `retry-manager.js`: which rows are parked by max-age vs pending-cap, in what order, and against which `embedding_status` set.

## Actions Taken

1. Read the deep-research quick reference and output contract, then checked the current state log and iteration 2 narrative to avoid drifting from the reducer focus.
2. Inspected the TypeScript source in `lib/providers/retry-manager.ts` around retention configuration, retention enforcement, queue selection, batch processing, and background job startup.
3. Inspected the compiled runtime mirror in `dist/lib/providers/retry-manager.js` to confirm the JS actually used by Node preserves the same SQL and ordering.
4. Read the retry-retention test to separate intended contract from accidental behavior.
5. Queried the live `context-index.sqlite` for current status counts, failure reasons, and the default-cap overflow projection.

## Findings

1. The runtime `retry-manager.js` matches the TypeScript source for retention parking. `enforceRetryRetentionLimits()` is exported from the compiled JS, and the compiled function keeps the same two SQL branches: max-age update first, pending-cap overflow selection second, then guarded overflow updates. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js`:313] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js`:319] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js`:327] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js`:335] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js`:822]

2. Max-age parking runs first. It computes `oldestAllowedIso = now - maxAgeMs`, then marks rows `failed` with `failure_reason = 'Retry retention max age exceeded'` when `embedding_status IN ('pending', 'retry')` and `COALESCE(last_retry_at, created_at, updated_at) < oldestAllowedIso`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:474] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:482] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:484] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:489]

3. Pending-cap parking runs after max-age parking, against the remaining queue only. The cap query re-selects rows still in `embedding_status IN ('pending', 'retry')`, orders them by `COALESCE(last_retry_at, created_at, updated_at) ASC, id ASC`, and selects every row after `OFFSET maxPending`; each selected id is then updated to `failed` with `failure_reason = 'Retry retention pending cap exceeded'`, guarded again by `embedding_status IN ('pending', 'retry')`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:493] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:495] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:496] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:502] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:508]

4. The parking status set is narrow: both retention branches only touch rows whose current `embedding_status` is `pending` or `retry`. They do not touch `success`, pre-existing `failed`, or `partial` rows. The pending-cap branch also has no `retry_count` predicate, so clean `pending` rows and previously retried `retry` rows compete in the same age-ordered queue. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:489] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:495] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:508]

5. Retention is a pre-drain failure writer, not retry exhaustion. `runBackgroundJob()` calls `enforceRetryRetentionLimits()` before it reads queue stats or calls `processRetryQueue()`. `processRetryQueue()` then calls `getRetryQueue()`, and `getRetryQueue()` calls `enforceRetryRetentionLimits()` again before selecting candidates. A background drain pass can therefore park rows as `failed` before any embedding generation attempt happens in that pass. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:986] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:997] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:1001] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:1009] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:865] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:870] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:536]

6. The defaults are module-load constants: `SPECKIT_RETRY_QUEUE_MAX_PENDING` falls back to `1000`, and `SPECKIT_RETRY_QUEUE_MAX_AGE_MS` falls back to 24 hours. A process that loaded the module before env changes keeps the old constants until a full process/module reload. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:342] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:343] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:344] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`:389]

7. The live DB still points to max-age as the observed parking mechanism. Current counts are `failed=7105`, `pending=10179`, `retry=60`, and `success=9623`; every failed row has `failure_reason = 'Retry retention max age exceeded'`. Under the default cap, the remaining queue would keep 1000 `pending` rows and park 9179 `pending` plus 60 `retry` rows as overflow. [SOURCE: sqlite query on `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite`]

8. The test suite treats both retention branches as intentional. `retry-retention.vitest.ts` calls `enforceRetryRetentionLimits(1, 1000, fixedDate)`, expects both expired and overflow changes, and asserts both failure-reason SQL branches are issued. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tests/providers/retry-retention.vitest.ts`:44] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tests/providers/retry-retention.vitest.ts`:47] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tests/providers/retry-retention.vitest.ts`:49]

## Questions Answered

- Q1 is answered. `pending` embeddings become `failed` through retention parking before retry embedding work: max-age parks old `pending` / `retry` rows first; pending-cap then parks remaining `pending` / `retry` rows after queue rank `maxPending`, ordered by queue age key and `id`.
- The observed failed backlog was parked by max-age, not pending-cap. The current remaining unfailed backlog would be vulnerable to pending-cap parking if processed by a daemon using the default `maxPending=1000`.

## Questions Remaining

- Q2 is mostly answered by iterations 1-3, but a standalone pass could document the clean `pending -> retry -> success` path if the reducer still treats it as open.
- Q3 remains the best next target: trace `reindex --force` / `memory_index_scan({ force: true })` through file discovery, dedup, and status writes.
- Q5 remains important because retention constants are loaded at module evaluation, so stale daemon workers can keep stale cap and age defaults.
- Q6 depends on Q3 and Q5: the final runbook must avoid stale retention defaults and use a trigger that commits `memory_index.embedding_status`, not only vector shards.

## Next Focus

Q3: Trace `reindex --force` / `memory_index_scan({ force: true })` through file discovery, dedup, and status writes. Determine why a force reindex can report `Indexed/Updated: 0` while thousands of rows remain `failed` / `pending`, and whether status reset is part of force semantics.
