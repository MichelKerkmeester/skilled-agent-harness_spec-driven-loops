# Iteration 6: Close Q3 and Finalize the Drain Runbook

## Focus

Close Q3 and turn the runbook into an operator-safe sequence.

The concrete targets were:

- explain why `memory_index_scan({ force: true })` or reindex can report `Indexed/Updated: 0` while thousands of rows remain `pending`, `retry`, or `failed`;
- confirm whether those rows are visited by file discovery, incremental categorization, and same-path dedup;
- define the safe reset/reconcile operation without clobbering rows that already have active vectors;
- quantify the default retry-retention failure mode;
- order the end-to-end runbook.

## Actions Taken

1. Re-read the iteration 5 runbook draft and the reducer-owned strategy next-focus block.
2. Traced `memory_index_scan` through discovery, force handling, incremental categorization, and `indexSingleFile`.
3. Traced `checkExistingRow()` and `indexMemoryFile()` to determine what `force` bypasses and what it still leaves in place.
4. Queried the live `context-index.sqlite` status distribution, failure reasons, latest-row status per canonical path, and active-vector coverage by attaching the active `vec_768` shard.
5. Re-checked retry retention defaults, background-job ordering, and daemon restart/env behavior for the final runbook ordering.

## Findings

### F1. `force:true` is file-reindexing force, not status-repair force.

`memory_index_scan` discovers files from constitutional memory directories, canonical spec documents, and graph metadata. It builds `mergedFiles`, canonical-deduplicates paths, and only then decides which files to index. It does not enumerate `memory_index` rows by `embedding_status`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:273`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:301`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:105`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:114`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:281`]

`force:true` skips the mtime categorizer because that branch only runs when `incremental && !force`. With force enabled, discovered files go straight to `indexSingleFile(filePath, force, ...)`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:441`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:444`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:476`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:489`]

The runtime dist mirror has the same control points: force skips the incremental branch and still passes through `indexSingleFile`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/handlers/memory-index.js:213`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/handlers/memory-index.js:318`]

So Q3's direct answer: `force` is not a global `UPDATE memory_index SET embedding_status='pending'`. It only forces discovered files into the save/index pipeline.

### F2. Same-path dedup still runs during force and treats `pending` as unchanged-eligible.

`indexMemoryFile()` always delegates to `processPreparedMemory()`, and that path always calls `checkExistingRow()` before embedding generation. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2700`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2726`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2248`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2259`]

`checkExistingRow()` selects the latest row for the same canonical path and anchor, then returns `status: 'unchanged'` when content hash and metadata match and the existing status is in `success`, `pending`, or `partial`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/dedup.ts:15`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/dedup.ts:101`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/dedup.ts:255`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/dedup.ts:259`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/dedup.ts:268`]

The comment explicitly says this applies "even during force reindex" to prevent duplicate row accumulation. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/dedup.ts:265`] The dist mirror confirms the same status set and same-path return condition. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/handlers/save/dedup.js:8`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/handlers/save/dedup.js:144`]

This explains one zero-count path: a forced scan can visit discovered files and still count them as `unchanged`, leaving `indexed=0` and `updated=0`.

### F3. Most failed rows are masked by a newer latest row for the same canonical path.

The live DB currently has `failed=16344`, `pending=962`, `retry=20`, and `success=9652`. [SOURCE: sqlite SELECT on `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite`]

For failed rows grouped by canonical path, the latest row for that same path is usually not failed:

```text
latest_status success: 14234 failed rows masked
latest_status failed:   1796 failed rows latest
latest_status pending:   280 failed rows masked
latest_status retry:      34 failed rows masked
```

[SOURCE: sqlite SELECT on `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite`]

That matters because `checkExistingRow()` looks at the latest row for a path. A forced scan of a file with an older failed row and a newer unchanged success/pending row will return `unchanged` for the newer row and never directly repair the older failed row.

The live latest-row distribution is also narrow: latest rows are `success=8519`, `failed=1192`, `pending=121`, and `retry=17`. [SOURCE: sqlite SELECT on `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite`]

### F4. The current backlog is vector-present but status-stale.

Attaching the active 768-dimensional shard shows every `failed`, `pending`, and `retry` row has an active `vec_768` row:

```text
failed: 16344 rows, 16344 with vec_768, 0 missing
pending:   962 rows,   962 with vec_768, 0 missing
retry:      20 rows,    20 with vec_768, 0 missing
```

[SOURCE: sqlite ATTACH/SELECT on `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite` + `.opencode/skills/system-spec-kit/mcp_server/database/vectors/context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite`]

The shard metadata matches `provider=ollama`, `model=nomic-embed-text-v1.5`, `dim=768`. [SOURCE: sqlite SELECT on `.opencode/skills/system-spec-kit/mcp_server/database/vectors/context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite`]

This reconciles the apparent contradiction from prior iterations. `embedder_set`/`startReindex` selected all `memory_index` rows, wrote vectors, then marked the embedder job complete and flipped the active pointer; it did not commit `memory_index.embedding_status='success'`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:420`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:431`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:432`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:440`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:441`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:442`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/embedders/reindex.js:308`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/embedders/reindex.js:318`]

So the immediate safe surface is not a blind failed-row reset. It is status reconciliation for rows that already have active vectors, followed by retry reset only for rows missing active vectors.

### F5. Safe maintenance operation should be a guarded MCP tool, with SQL documented as the emergency path.

The best implementation surface is a guarded MCP maintenance tool, for example `memory_embedding_reconcile({ dryRun: true|false, activeOnly: true, resetMissing: true })`, because the runtime already knows the active embedder profile and attached vector source. Raw operator SQL has to duplicate that logic and can attach the wrong shard.

The tool should dry-run these buckets before mutation:

- `status IN ('failed','pending','retry') AND active vector exists`: reconcile metadata to `success`;
- `status IN ('failed','pending','retry') AND active vector missing AND failure_reason LIKE 'Retry retention%'`: reset to retry-eligible;
- non-retention provider failures with no active vector: leave alone unless explicitly requested.

Emergency SQL for the current active shard, after a backup and with the daemon stopped, is:

```sql
ATTACH '.opencode/skills/system-spec-kit/mcp_server/database/vectors/context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite' AS av;
BEGIN IMMEDIATE;

-- Rows already embedded in the active shard: repair stale metadata, do not requeue.
UPDATE memory_index
SET embedding_status = 'success',
    embedding_generated_at = COALESCE(embedding_generated_at, CURRENT_TIMESTAMP),
    failure_reason = NULL,
    updated_at = CURRENT_TIMESTAMP
WHERE embedding_status IN ('failed', 'pending', 'retry')
  AND EXISTS (
    SELECT 1 FROM av.vec_768 v WHERE v.id = memory_index.id
  );

-- Rows without an active vector: make only retention-parked failures and stuck queue rows retry-eligible.
UPDATE memory_index
SET embedding_status = 'pending',
    retry_count = 0,
    last_retry_at = NULL,
    failure_reason = NULL,
    updated_at = CURRENT_TIMESTAMP
WHERE embedding_status IN ('failed', 'pending', 'retry')
  AND NOT EXISTS (
    SELECT 1 FROM av.vec_768 v WHERE v.id = memory_index.id
  )
  AND (
    failure_reason LIKE 'Retry retention%'
    OR embedding_status IN ('pending', 'retry')
  );

COMMIT;
```

For this live DB, the first update would target 17,326 rows (`16344 failed + 962 pending + 20 retry`) and the second update should target 0 rows, because no failed/pending/retry rows are missing `vec_768`. [SOURCE: sqlite SELECT on `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite`]

### F6. The default retention limits are unsafe for bulk backlog repair.

Retention runs before queue selection in both `getRetryQueue()` and `runBackgroundJob()`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:529`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:536`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:986`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:997`]

The default cap and age are parsed at module load: `SPECKIT_RETRY_QUEUE_MAX_PENDING` defaults to `1000`, and `SPECKIT_RETRY_QUEUE_MAX_AGE_MS` defaults to 24 hours. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:342`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:343`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:344`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js:313`]

The current DB proves both failure modes: `9239` rows were parked by pending-cap retention and `7105` by max-age retention. [SOURCE: sqlite SELECT on `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite`]

If an operator reset all currently stale failed/pending/retry rows to retry-eligible under the default cap, the queue would be 17,326 rows. Retention would immediately keep 1,000 and re-park 16,326 before embedding work starts. That is 94.2% of the reset backlog failed again without an embedding attempt.

The defaults should change or become non-destructive. My recommendation:

- short term operator default: `SPECKIT_RETRY_QUEUE_MAX_PENDING=300000` and `SPECKIT_RETRY_QUEUE_MAX_AGE_MS=3153600000000`;
- product default: make retention warn/defer rather than mark `failed` before first embedding attempt, or raise defaults to a bulk-safe floor and only fail rows after retry exhaustion;
- separate follow-up fix: `context-server` currently calls `startBackgroundJob({ intervalMs: 5 * 60 * 1000, batchSize: 5 })`, overriding the env-parsed retry interval and batch size. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1828`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1829`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1830`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:351`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:352`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:353`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:943`]

### F7. Definitive runbook order.

The correct order is:

1. Stop the lease-owning daemon and sidecar workers. Do not rely on `/mcp` reconnect.
2. Set env before the next launch: provider, short IPC socket dir, raised cap, long max age, and desired retry interval/batch.
3. Start a fresh daemon so `retry-manager` module-scope constants read the new env.
4. Run the guarded reconcile/reset maintenance operation in dry-run mode, then apply mode.
5. Let retry-manager drain only rows still missing active vectors. In the current DB, this should be zero after active-vector reconciliation.
6. Verify `failed=0`, `pending=0`, `retry=0`, and `success=total`, then verify active-vector coverage for all success rows.

Evidence for the ordering: the launcher loads `.env.local` / `.env` before spawning `context-server.js`, passes `process.env` into the child, and bridges to an existing lease holder instead of spawning a fresh process when the lease is held. [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:18`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:49`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:343`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:346`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:348`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:412`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:415`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:416`] [SOURCE: `.opencode/bin/lib/launcher-ipc-bridge.cjs:121`] [SOURCE: `.opencode/bin/lib/launcher-ipc-bridge.cjs:127`]

## Sources Consulted

- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/save/dedup.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts`
- `.opencode/bin/mk-spec-memory-launcher.cjs`
- `.opencode/bin/lib/launcher-ipc-bridge.cjs`
- `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite`
- `.opencode/skills/system-spec-kit/mcp_server/database/vectors/context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite`

## Questions Answered

- Q3 answered: `reindex --force` / `memory_index_scan({ force:true })` is file-driven. It does not reset `embedding_status`, does not enumerate failed rows, and still has same-path dedup that can return `unchanged` for latest `success`, `pending`, or `partial` rows.
- Q6 mostly answered: the minimal runbook is stop stale daemon, set env, fresh restart, active-vector status reconciliation, retry reset for missing-vector retention failures only, drain, verify.
- Defaults recommendation answered: the current `1000` pending cap and 24h max age are unsafe for bulk repair because retention parks before embedding. They should be raised for operators and redesigned to be non-destructive before first retry work.

## Questions Remaining

- The implementation packet should choose the exact public surface for `memory_embedding_reconcile`: new guarded MCP tool is the recommended path, but a documented SQLite emergency path should remain for disaster recovery.
- A follow-up implementation should make `context-server` honor `SPECKIT_RETRY_BATCH_SIZE` and `SPECKIT_RETRY_INTERVAL_MS` instead of hardcoding 5 rows / 5 minutes.
- After reconcile/reset is implemented, run one end-to-end operator dry run and record before/after counts.

## Assessment

`newInfoRatio: 0.64`.

Novelty was high because this iteration closed the exact Q3 zero-count path and changed the reset recommendation: the live backlog is not missing vectors, it is mostly status-stale after a vector-only reindex. The runbook therefore starts with active-vector reconciliation, not blind requeue. Confidence is high for the code-path claims and live DB counts; the only implementation-level caveat is that the guarded tool still needs to be built in a follow-up packet.

## Next Focus

Iteration 7 should convert this into implementation-ready acceptance criteria: `memory_embedding_reconcile` dry-run/apply contract, exact counters, safety rails, and tests. It should also decide whether the retry-retention defaults change directly or whether retention becomes warn-only/non-destructive before first embedding attempts.
