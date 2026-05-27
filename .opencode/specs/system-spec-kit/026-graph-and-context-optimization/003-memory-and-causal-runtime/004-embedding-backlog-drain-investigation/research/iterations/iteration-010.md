# Iteration 10: Final Consolidation for Embedding Backlog Drain

## Focus

Final consolidation only. This pass closes Q1-Q6, gives the operator runbook, separates one-time repair from durable prevention, and records residual risk for synthesis. No implementation or production DB mutation was performed.

## Actions Taken

1. Re-read the deep-research output contract and prior iteration trail for iterations 7-9.
2. Verified source anchors in retry retention, retry queue selection, retry success, reindex completion, `embedder_set`, `memory_index_scan --force`, daemon launcher/bridge, and sidecar worker spawn.
3. Ran one read-only status-count spot check against `context-index.sqlite`; current shape still shows non-success rows with stable success count rather than a completed drain to success.
4. Consolidated Q1-Q6, the operator runbook, durable fixes, and residual risks into this final synthesis feeder.

## Findings

### F1. Q1: pending rows become `failed` through retry-retention parking before queue work.

`enforceRetryRetentionLimits()` parks rows in two passes. First it marks old `embedding_status IN ('pending', 'retry')` rows as `failed` with `failure_reason = 'Retry retention max age exceeded'`; then it selects remaining `pending`/`retry` rows ordered by `COALESCE(last_retry_at, created_at, updated_at), id`, skips the first `maxPending`, and marks overflow rows `failed` with `failure_reason = 'Retry retention pending cap exceeded'`. The defaults are file-scope constants: `SPECKIT_RETRY_QUEUE_MAX_PENDING` defaults to `1000`, and `SPECKIT_RETRY_QUEUE_MAX_AGE_MS` defaults to 24h. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:343`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:344`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:474`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:484`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:489`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:493`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:508`]

Crucial detail: retention runs before embedding work in both `getRetryQueue()` and `runBackgroundJob()`, so a clean large backlog can be parked before it is claimed. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:536`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:997`]

### F2. Q2: retry-manager can embed clean `pending` rows, but only after retention lets them through.

The retry queue selects `embedding_status IN ('pending', 'retry')`, orders `pending` rows first, and treats `pending` as immediately eligible. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:539`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:541`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:544`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:563`] `processRetryQueue()` then claims each candidate before loading content and embedding. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:870`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:889`]

Initial `pending -> success` is not owned only by retry-manager. Normal save/index writes `success` when an embedding and vector insert succeed, or writes/deferred-updates `pending` when embedding is absent. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:165`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:173`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:262`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:286`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:345`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:369`] Retry success separately updates `memory_index.embedding_status = 'success'` and inserts the vector in one transaction. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:727`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:730`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:743`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:744`]

### F3. Q3: `reindex --force` is scan/save driven; it is not a DB status reset.

The CLI `reindex --force` simply passes `force` into `handleMemoryIndexScan()`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/cli.ts:442`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/cli.ts:470`] `memory_index_scan` defaults `incremental = true`, but skips incremental categorization when `force` is true and sends every discovered file to `indexSingleFile(filePath, force, ...)`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:213`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:218`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:444`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:489`]

That still does not mean "set all failed rows to success." The save path passes `force` into preflight with duplicate checking disabled, but the scan result still counts only `indexed`, `updated`, `unchanged`, `reinforced`, `duplicate`, or `deferred` statuses returned by the save pipeline. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2977`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2979`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:510`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:528`] Older failed rows can also be masked by newer rows for the same canonical path and anchor; iteration 7 measured 15,152 such masked failed rows. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-007.md:220`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-007.md:236`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/deltas/iter-007.jsonl:1`]

### F4. Q4: `embedder_set(name)` queues vector reindex and flips the active pointer, but statuses do not stick because the completion transaction omits `memory_index`.

The handler validates the manifest, ensures the vector table, and queues `startReindex({ toName: manifest.name })`; it does not update `memory_index.embedding_status`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts:63`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts:69`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-set.ts:71`]

The reindex worker selects rows from `memory_index` without an `embedding_status` predicate, writes vectors to both vector surfaces, then completes by setting the active embedder and job status only. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:219`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:221`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:431`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:432`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:440`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:441`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:442`] The compiled hot path shows the exact durable-fix anchor: `reindex.js:316-318` completes the job with no metadata success commit. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/embedders/reindex.js:316`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/embedders/reindex.js:317`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/embedders/reindex.js:318`]

Iteration 7 validated the effect: all 17,326 non-success rows in that snapshot already had active `vec_768` and `vec_memories` coverage, so the immediate repair is metadata reconciliation, not bulk embedding work. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-007.md:112`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-007.md:181`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-007.md:206`]

### F5. Q5: reconnect does not reload daemon env; sidecars respawn from the stale daemon env.

The launcher loads `.env.local` / `.env` before spawning the context server and passes `process.env` to the child. [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:49`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:346`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:348`] If the lease is already held, the launcher bridges to the existing daemon and returns instead of spawning a new process. [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:414`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:416`] The bridge connects stdio to the existing socket; it has no env reload hook. [SOURCE: `.opencode/bin/lib/launcher-ipc-bridge.cjs:121`] [SOURCE: `.opencode/bin/lib/launcher-ipc-bridge.cjs:127`] [SOURCE: `.opencode/bin/lib/launcher-ipc-bridge.cjs:128`]

Inside that long-lived daemon, retry config is frozen at module load for the retention cap/age and background config. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:343`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:351`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:354`] The normal context-server startup also hardcodes retry loop interval and batch size to 5 minutes and 5 items, bypassing the env-derived background defaults. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1828`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1829`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1830`] Sidecar workers inherit the daemon's env snapshot when forked, so killing only a sidecar lets the stale daemon respawn another stale sidecar. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:467`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:575`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:578`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:579`]

### F6. Q6: the minimal operator procedure is reconcile first, then restart with raised retention/env, then verify zero non-success rows.

The current incident should be repaired in this order:

1. Record the starting status count:

```bash
sqlite3 -readonly .opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite \
  "SELECT embedding_status, COUNT(*) FROM memory_index GROUP BY embedding_status ORDER BY embedding_status;"
```

Expected prompt baseline: `pending 10199 | success 9623 | failed 7105 | retry 40` for total `26967`. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/deep-research-strategy.md:104`] A later iteration-7 snapshot reported `failed 16344 | pending 957 | retry 25 | success 9652` for total `26978`, and this iteration's read-only spot check showed `failed 16344 | pending 932 | retry 50 | success 9652`; treat the exact total as snapshot-dependent, but the expected end state is still `failed/pending/retry = 0` and `success ~= total rows`. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-007.md:126`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-007.md:129`]

2. Preferred path once implemented: run guarded dry-run, then apply:

```bash
memory_embedding_reconcile '{
  "mode": "dry-run",
  "activeOnly": true,
  "resetMissing": true,
  "missingFailureScope": "retry-retention",
  "maskedFailedPolicy": "reconcile",
  "providerFailurePolicy": "report-only",
  "requireActiveShard": true
}'

memory_embedding_reconcile '{
  "mode": "apply",
  "activeOnly": true,
  "resetMissing": true,
  "missingFailureScope": "retry-retention",
  "maskedFailedPolicy": "reconcile",
  "providerFailurePolicy": "report-only",
  "requireActiveShard": true
}'
```

Expected dry-run buckets from iteration 8: `vector_present_status_stale = 17326`, split `failed=16344`, `pending=957`, `retry=25`; `missing_active_vector_retry_eligible = 0`; `missing_active_vector_provider_failure = 0`; masked failed diagnostic `15152`. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-008.md:51`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-008.md:59`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-008.md:253`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-008.md:259`]

3. Emergency SQL fallback if the MCP tool is not available: attach the active shard, verify provider/model/dim, update only rows with both active vector surfaces, then reset only missing-vector retry-retention failures. Use `BEGIN IMMEDIATE`; do not run this concurrently with a drain.

```sql
ATTACH 'file:.opencode/skills/system-spec-kit/mcp_server/database/vectors/context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite' AS active_vec;
BEGIN IMMEDIATE;

WITH active_main AS (
  SELECT
    MAX(CASE WHEN key = 'active_embedder_name' THEN value END) AS name,
    CAST(MAX(CASE WHEN key = 'active_embedder_dim' THEN value END) AS INTEGER) AS dim,
    NULLIF(MAX(CASE WHEN key = 'active_embedder_provider' THEN value END), '') AS provider
  FROM vec_metadata
),
active_shard AS (
  SELECT
    MAX(CASE WHEN key IN ('model', 'embedding_model') THEN value END) AS name,
    CAST(MAX(CASE WHEN key IN ('dim', 'embedding_dim') THEN value END) AS INTEGER) AS dim,
    MAX(CASE WHEN key = 'provider' THEN value END) AS provider
  FROM active_vec.vec_metadata
)
UPDATE memory_index
SET embedding_status = 'success',
    embedding_generated_at = COALESCE(embedding_generated_at, CURRENT_TIMESTAMP),
    failure_reason = NULL,
    updated_at = CURRENT_TIMESTAMP
WHERE embedding_status IN ('failed', 'pending', 'retry')
  AND EXISTS (SELECT 1 FROM active_vec.vec_memories_rowids r WHERE r.rowid = memory_index.id)
  AND EXISTS (SELECT 1 FROM active_vec.vec_768 v WHERE v.id = memory_index.id)
  AND EXISTS (
    SELECT 1 FROM active_main, active_shard
    WHERE active_main.name = active_shard.name
      AND active_main.dim = active_shard.dim
      AND (active_main.provider IS NULL OR active_main.provider = active_shard.provider)
  );

UPDATE memory_index
SET embedding_status = CASE WHEN embedding_status = 'failed' THEN 'retry' ELSE embedding_status END,
    retry_count = 0,
    last_retry_at = NULL,
    failure_reason = NULL,
    updated_at = CURRENT_TIMESTAMP
WHERE embedding_status IN ('failed', 'pending', 'retry')
  AND NOT EXISTS (SELECT 1 FROM active_vec.vec_memories_rowids r WHERE r.rowid = memory_index.id)
  AND NOT EXISTS (SELECT 1 FROM active_vec.vec_768 v WHERE v.id = memory_index.id)
  AND (
    embedding_status IN ('pending', 'retry')
    OR (embedding_status = 'failed' AND failure_reason LIKE 'Retry retention%')
  );

COMMIT;
```

4. Raise daemon env before any retry drain or reset of genuinely missing vectors:

```bash
SPECKIT_RETRY_QUEUE_MAX_PENDING=300000
SPECKIT_RETRY_QUEUE_MAX_AGE_MS=3153600000000
SPECKIT_RETRY_BATCH_SIZE=100
SPECKIT_RETRY_INTERVAL_MS=5000
SPECKIT_RETRY_ENABLED=true
SPECKIT_IPC_SOCKET_DIR=/tmp/mk-spec-memory
```

Then fully restart the lease owner, not just `/mcp` reconnect and not just sidecar kill:

```bash
ps -axo pid,ppid,lstart,command | rg 'mk-spec-memory-launcher|context-server.js|sidecar-worker'
kill <mk-spec-memory-launcher-pid>
sleep 2
ps -axo pid,ppid,lstart,command | rg 'mk-spec-memory-launcher|context-server.js|sidecar-worker'
```

If no matching process remains but the lease file still exists, remove only the stale lease file:

```bash
rm -f .opencode/skills/system-spec-kit/mcp_server/database/.mk-spec-memory-launcher.json
```

Restart through the normal MCP launcher path so `.env.local` is loaded at spawn. Verify the new process start time is after the env edit, then trigger health/drain through the MCP surface.

5. Verify after apply and restart:

```bash
sqlite3 -readonly .opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite \
  "SELECT embedding_status, COUNT(*) FROM memory_index GROUP BY embedding_status ORDER BY embedding_status;"
```

Expected prompt-baseline end state: `success ~= 26967`, `failed = 0`, `pending = 0`, `retry = 0`. Expected current-snapshot end state if totals remain at the iteration-7/10 count: `success ~= 26978`, `failed = 0`, `pending = 0`, `retry = 0`. If `missing_active_vector_retry_eligible > 0`, do not let the daemon run with the default cap/age before embedding those rows, or they can be re-parked.

### Durable Prevention Fixes

1. Highest priority: commit reindex metadata success at `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:440` and compiled anchor `.opencode/skills/system-spec-kit/mcp_server/dist/lib/embedders/reindex.js:316-318`. Minimal change: inside the completion transaction, after `setActiveEmbedder(...)` and before `setJobStatus(..., 'completed', ...)`, mark only target-profile vector-present rows `success`, clear `failure_reason`, and set `embedding_generated_at` if absent. This one fix alone would have prevented the active-vector/status-stale half of the incident: a completed `embedder_set` reindex would not leave already-written rows as `failed`, `pending`, or `retry`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:440`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:441`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:442`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/embedders/reindex.js:316`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/dist/lib/embedders/reindex.js:318`]

2. Next priority: make retention non-destructive for never-attempted clean `pending` rows in `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:474-508`, and remove or move the pre-drain retention call at `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:536` / `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:997`. Minimal change: apply retention only to `embedding_status = 'retry' OR COALESCE(retry_count,0) > 0`, then process the retry queue before any cap enforcement. This one fix alone would have prevented the re-parking of clean backlog rows, but not the stale metadata left by vector-only reindex. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:474`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:489`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:495`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:508`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:536`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:997`]

3. Third priority: re-read retry config per drain/start and stop hardcoding daemon retry options. Minimal change: replace module-scope retry constants with a `readRetryRuntimeConfig()` used by retention, background job, and startBackgroundJob; remove context-server's hardcoded `{ intervalMs: 5 * 60 * 1000, batchSize: 5 }` except in tests. Also document that `.env.local` edits require a lease-owner restart unless an explicit daemon env reload is implemented. This one fix alone would have prevented stale-config respawn after env tuning, but not the missing reindex success commit. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:343`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:351`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1828`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1830`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:49`] [SOURCE: `.opencode/bin/mk-spec-memory-launcher.cjs:416`]

The single fix that most directly would have prevented the observed "bulk re-embed completed but success count did not rise" incident is fix 1, the reindex metadata success commit. Fixes 2 and 3 prevent the retry system from re-parking rows and from ignoring raised env, which are required for durable backlog draining when actual missing-vector rows exist.

### Residual Risks and Open Questions

- `memory_embedding_reconcile()` is not implemented in the current codebase; iteration 8/9 define its acceptance contract, but the public MCP registration path and tests still need an implementation packet. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-009.md:99`]
- Snapshot counts drifted between prompt baseline, iteration 7, and this iteration's read-only spot check. The runbook must use live preflight counts and dry-run buckets, not hard-coded counts as mutation predicates.
- The emergency SQL assumes the active 768d ollama/nomic shard path and `vec_768` table; the tool implementation must resolve and verify these dynamically from active metadata.
- Partial-vector states, zero/mismatched dimensions, profile mismatch, and concurrent drain must fail closed. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-009.md:70`]
- Pruning masked failed rows is explicitly not covered. Reconcile should mark vector-present stale rows `success`; dedup/prune is a separate maintenance tool with different safety checks. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-008.md:241`]
- This research did not benchmark drain throughput after raising batch/interval, did not validate behavior on a DB with genuinely missing active vectors, and did not test restart behavior through every host MCP client.

## Questions Answered

- Q1 answered: retention max-age parks first, then pending-cap overflow parks remaining `pending`/`retry` rows.
- Q2 answered: retry-manager can embed clean `pending` rows, but retention runs before selection; normal save/index and retry success both own `success` transitions.
- Q3 answered: `reindex --force` is file scan/save driven and does not reset DB status labels.
- Q4 answered: `embedder_set` queues vector reindex; reindex writes vectors and flips the active pointer/job status but does not commit `memory_index.embedding_status`.
- Q5 answered: `/mcp` bridge reconnect does not reload daemon env; sidecars respawn from the stale daemon env snapshot.
- Q6 answered: reconcile vector-present stale rows first, restart the lease owner with raised retry env, then verify `success ~= total` and zero non-success rows.

## Questions Remaining

No research questions remain for synthesis. Implementation follow-up remains: add `memory_embedding_reconcile()`, patch reindex status commit, make retention non-destructive for clean pending rows, and make daemon retry config dynamic or explicitly restart-bound.

## Next Focus

Proceed to final synthesis in `research.md` and then open an implementation packet for the durable fixes plus the guarded reconcile maintenance tool.
