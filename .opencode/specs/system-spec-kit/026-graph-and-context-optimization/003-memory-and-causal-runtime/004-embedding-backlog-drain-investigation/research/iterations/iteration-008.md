# Iteration 8: Acceptance Spec for `memory_embedding_reconcile`

## Focus

Convert the validated iteration 6 and iteration 7 evidence into an implementation-ready acceptance spec for `memory_embedding_reconcile()`. This iteration is consolidation only: no new investigation threads, no fixes implemented.

## Actions Taken

1. Re-read the reducer-owned next-focus block for iteration 8.
2. Re-read iteration 6 and iteration 7 evidence for active-vector coverage, failed-row masking, and the safe reconcile-before-reset ordering.
3. Checked the code anchors that define active vector source resolution, success metadata writes, reindex vector-only behavior, retry queue selection, retry retention parking, and failed-row reset behavior.
4. Synthesized the exact dry-run schema, guarded mutation SQL, masked-row policy, tests, and operator verification commands.

## Findings

### F1. `memory_embedding_reconcile()` should expose one guarded maintenance surface with dry-run as the default.

Recommended tool arguments:

```json
{
  "mode": "dry-run",
  "activeOnly": true,
  "resetMissing": true,
  "missingFailureScope": "retry-retention",
  "maskedFailedPolicy": "reconcile",
  "providerFailurePolicy": "report-only",
  "requireActiveShard": true
}
```

`mode` accepts `"dry-run"` or `"apply"`. `activeOnly` and `requireActiveShard` must default to `true`: the tool must resolve the active embedder from runtime metadata and attach the active vector shard, not accept an arbitrary shard path from the caller. Runtime active-shard resolution already derives the shard path from the active profile slug under `database/vectors/context-vectors__${profile.slug}.sqlite`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:364`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:369`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:372`]

Dry-run output must use action buckets plus one diagnostic overlap bucket:

```json
{
  "mode": "dry-run",
  "activeEmbedder": {
    "provider": "ollama",
    "name": "nomic-embed-text-v1.5",
    "dim": 768,
    "shard": "database/vectors/context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite"
  },
  "safety": {
    "activeShardVerified": true,
    "vectorPresenceSource": "vec_memories_rowids",
    "dimensionTableChecked": "vec_768"
  },
  "buckets": {
    "vector_present_status_stale": {
      "count": 17326,
      "byStatus": {
        "failed": 16344,
        "pending": 957,
        "retry": 25
      }
    },
    "missing_active_vector_retry_eligible": {
      "count": 0
    },
    "missing_active_vector_provider_failure": {
      "count": 0
    },
    "failed_masked_by_newer_latest_path_anchor_row": {
      "count": 15152,
      "overlapsBucket": "vector_present_status_stale",
      "policy": "reconcile"
    }
  },
  "plannedMutations": [
    {
      "name": "reconcile_vector_present_to_success",
      "rows": 17326
    },
    {
      "name": "reset_missing_active_vector_to_retry_eligible",
      "rows": 0
    }
  ]
}
```

The current expected counts are `17326 / 0 / 0 / 15152`. Iteration 7 measured `failed=16344`, `pending=957`, `retry=25`, and every one of those non-success rows had active `vec_768` and `vec_memories_rowids` coverage. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-007.md:112`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-007.md:150`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-007.md:181`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-007.md:206`]

### F2. Apply mode must reconcile vector-present rows before resetting any missing-vector rows.

The ordering is not cosmetic. The retry manager processes only `pending` and `retry` rows, retention runs before queue selection, and retry success writes `embedding_status='success'` only after a vector write succeeds. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:536`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:539`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:541`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:727`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:730`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:743`]

`embedder_set` / reindex can populate vectors and flip the active embedder without repairing `memory_index.embedding_status`, so vector-present stale rows need metadata reconciliation rather than another embed attempt. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:431`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:432`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:440`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:441`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:442`]

Guarded dry-run SQL for the current active 768d shard:

```sql
ATTACH 'file:.opencode/skills/system-spec-kit/mcp_server/database/vectors/context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite?mode=ro' AS active_vec;

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
),
active_ok AS (
  SELECT
    active_main.name = active_shard.name
    AND active_main.dim = active_shard.dim
    AND (active_main.provider IS NULL OR active_main.provider = active_shard.provider) AS ok
  FROM active_main, active_shard
),
latest AS (
  SELECT
    COALESCE(canonical_file_path, file_path) AS canonical_path,
    COALESCE(anchor_id, '') AS anchor_key,
    MAX(id) AS latest_id
  FROM memory_index
  GROUP BY COALESCE(canonical_file_path, file_path), COALESCE(anchor_id, '')
),
candidates AS (
  SELECT
    m.id,
    m.embedding_status,
    m.failure_reason,
    CASE WHEN r.rowid IS NULL THEN 0 ELSE 1 END AS has_vec_memories,
    CASE WHEN v.id IS NULL THEN 0 ELSE 1 END AS has_vec_768,
    latest.latest_id
  FROM memory_index m
  LEFT JOIN active_vec.vec_memories_rowids r ON r.rowid = m.id
  LEFT JOIN active_vec.vec_768 v ON v.id = m.id
  LEFT JOIN latest
    ON latest.canonical_path = COALESCE(m.canonical_file_path, m.file_path)
   AND latest.anchor_key = COALESCE(m.anchor_id, '')
  WHERE m.embedding_status IN ('failed', 'pending', 'retry')
)
SELECT 'vector_present_status_stale' AS bucket, COUNT(*) AS rows
FROM candidates, active_ok
WHERE active_ok.ok = 1
  AND has_vec_memories = 1
  AND has_vec_768 = 1
UNION ALL
SELECT 'missing_active_vector_retry_eligible' AS bucket, COUNT(*) AS rows
FROM candidates, active_ok
WHERE active_ok.ok = 1
  AND (has_vec_memories = 0 OR has_vec_768 = 0)
  AND (
    embedding_status IN ('pending', 'retry')
    OR (embedding_status = 'failed' AND failure_reason LIKE 'Retry retention%')
  )
UNION ALL
SELECT 'missing_active_vector_provider_failure' AS bucket, COUNT(*) AS rows
FROM candidates, active_ok
WHERE active_ok.ok = 1
  AND (has_vec_memories = 0 OR has_vec_768 = 0)
  AND embedding_status = 'failed'
  AND (failure_reason IS NULL OR failure_reason NOT LIKE 'Retry retention%')
UNION ALL
SELECT 'failed_masked_by_newer_latest_path_anchor_row' AS bucket, COUNT(*) AS rows
FROM candidates, active_ok
WHERE active_ok.ok = 1
  AND embedding_status = 'failed'
  AND id <> latest_id;
```

Apply SQL must run inside one transaction and in this order:

```sql
ATTACH 'file:.opencode/skills/system-spec-kit/mcp_server/database/vectors/context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite' AS active_vec;
BEGIN IMMEDIATE;

-- 1. Rows that already have active vectors are metadata-stale, not retry work.
UPDATE memory_index
SET embedding_status = 'success',
    embedding_generated_at = COALESCE(embedding_generated_at, CURRENT_TIMESTAMP),
    failure_reason = NULL,
    updated_at = CURRENT_TIMESTAMP
WHERE embedding_status IN ('failed', 'pending', 'retry')
  AND EXISTS (
    SELECT 1 FROM active_vec.vec_memories_rowids r WHERE r.rowid = memory_index.id
  )
  AND EXISTS (
    SELECT 1 FROM active_vec.vec_768 v WHERE v.id = memory_index.id
  )
  AND EXISTS (
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
    SELECT 1
    FROM active_main, active_shard
    WHERE active_main.name = active_shard.name
      AND active_main.dim = active_shard.dim
      AND (active_main.provider IS NULL OR active_main.provider = active_shard.provider)
  );

-- 2. Only rows still missing active vectors are reset to retry-eligible state.
UPDATE memory_index
SET embedding_status = CASE
      WHEN embedding_status = 'failed' THEN 'retry'
      ELSE embedding_status
    END,
    retry_count = 0,
    last_retry_at = NULL,
    failure_reason = NULL,
    updated_at = CURRENT_TIMESTAMP
WHERE embedding_status IN ('failed', 'pending', 'retry')
  AND NOT EXISTS (
    SELECT 1 FROM active_vec.vec_memories_rowids r WHERE r.rowid = memory_index.id
  )
  AND NOT EXISTS (
    SELECT 1 FROM active_vec.vec_768 v WHERE v.id = memory_index.id
  )
  AND (
    embedding_status IN ('pending', 'retry')
    OR (embedding_status = 'failed' AND failure_reason LIKE 'Retry retention%')
  );

COMMIT;
```

The second mutation deliberately scopes failed-row reset to retry-retention failures. Non-retention provider failures with no active vector are reported, not reset by default. That prevents a maintenance tool from erasing real provider-error evidence. Retention failures use `failure_reason = 'Retry retention max age exceeded'` or `failure_reason = 'Retry retention pending cap exceeded'`, both written by `enforceRetryRetentionLimits()` before retry processing. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:484`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:487`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:489`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:493`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:505`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:508`]

### F3. Masked failed rows should be reconciled to success, not pruned, in this tool.

Recommendation: `maskedFailedPolicy` must default to `"reconcile"`. Do not prune the 15,152 masked failed rows inside `memory_embedding_reconcile()`.

The reason is scope. Those rows are already active-vector-present stale-status rows, and this tool's invariant is embedding metadata convergence: if a row has an active vector, its `embedding_status` should not remain `failed`, `pending`, or `retry`. Iteration 7 counted 15,152 failed rows older than the latest row for the same canonical path and anchor; that count overlaps the 17,326 vector-present stale rows. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-007.md:213`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-007.md:253`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-007.md:286`]

Pruning is a separate data-retention/dedup operation with different risks: it would delete historical memory rows and would need to coordinate vector rows, active projections, chunk parent/child relationships, and any lineage that points at `memory_index.id`. Nothing in the validated evidence proves those rows are safe to delete; it only proves they should stop blocking embedding-status convergence. So the acceptance criterion is: the masked bucket is diagnostic and policy-visible, but it must not filter the success reconciliation update.

One explicit negative test should protect this: if a failed row is older than the latest row for the same path and anchor and has active vector coverage, apply mode must update it to `success`; it must not delete it and must not leave it `failed`.

### F4. Tests and operator verification should prove dry-run counts, mutation order, and idempotency.

Implementation tests should cover:

1. Dry-run counts active-vector-present `failed`, `pending`, and `retry` rows as `vector_present_status_stale`, including the current expected status split `16344 / 957 / 25`.
2. Apply mode updates vector-present stale rows to `success`, clears `failure_reason`, preserves the row, and does not enqueue them.
3. Missing-vector retention failures count as `missing_active_vector_retry_eligible`; apply mode moves failed rows to `retry` with `retry_count=0`, `last_retry_at=NULL`, and `failure_reason=NULL`. This mirrors the internal failed-row retry reset shape. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:833`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:844`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:846`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:847`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:848`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:849`]
4. Missing-vector provider failures count as `missing_active_vector_provider_failure` and remain unchanged by default.
5. Active-shard mismatch or missing shard metadata fails closed: dry-run reports `activeShardVerified=false`, and apply mutates zero rows or raises a typed guard error.
6. Masked failed rows with active vectors are reconciled to `success`, not pruned.
7. Apply is idempotent: a second dry-run after apply reports `vector_present_status_stale=0`, `missing_active_vector_retry_eligible=0`, and `missing_active_vector_provider_failure=0` for the repaired backlog.

Operator verification commands:

```bash
DB=".opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite"
SHARD=".opencode/skills/system-spec-kit/mcp_server/database/vectors/context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite"

# Before: current expected status counts are failed=16344, pending=957, retry=25, success=9652.
sqlite3 "$DB" "
SELECT embedding_status, COUNT(*)
FROM memory_index
GROUP BY embedding_status
ORDER BY embedding_status;
"

# Before: current expected dry-run buckets are 17326 / 0 / 0 / 15152.
memory_embedding_reconcile '{
  "mode": "dry-run",
  "activeOnly": true,
  "resetMissing": true,
  "missingFailureScope": "retry-retention",
  "maskedFailedPolicy": "reconcile",
  "providerFailurePolicy": "report-only",
  "requireActiveShard": true
}'

# Apply only after the dry-run bucket counts match expectation.
memory_embedding_reconcile '{
  "mode": "apply",
  "activeOnly": true,
  "resetMissing": true,
  "missingFailureScope": "retry-retention",
  "maskedFailedPolicy": "reconcile",
  "providerFailurePolicy": "report-only",
  "requireActiveShard": true
}'

# After: expected failed=0, pending=0, retry=0, success=26978 for the current DB.
sqlite3 "$DB" "
SELECT embedding_status, COUNT(*)
FROM memory_index
GROUP BY embedding_status
ORDER BY embedding_status;
"

# After: no non-success backlog should remain.
sqlite3 "$DB" "
SELECT COUNT(*) AS non_success_backlog
FROM memory_index
WHERE embedding_status IN ('failed', 'pending', 'retry');
"

# After: active sqlite-vec rowid coverage should remain complete for success rows.
sqlite3 "$DB" "
ATTACH 'file:$SHARD?mode=ro' AS active_vec;
SELECT COUNT(*) AS success_missing_active_vec_memories_rowid
FROM memory_index m
LEFT JOIN active_vec.vec_memories_rowids r ON r.rowid = m.id
WHERE m.embedding_status = 'success'
  AND r.rowid IS NULL;
"
```

The runbook should still require a fresh daemon with safe retry-retention env before any missing-vector reset is applied. The present DB has zero missing-vector rows, but the tool should be safe for future runs where `missing_active_vector_retry_eligible > 0`. Retention runs before retry queue selection, so stale default retention settings can re-park reset rows before embedding work starts. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:997`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:1001`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:1009`]

## Sources Consulted

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/deep-research-strategy.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-006.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation/research/iterations/iteration-007.md`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`

## Questions Answered

- Q3 consolidated: forced indexing/reindex can leave failed rows stale because the active vector shard already has embeddings while `memory_index.embedding_status` is not repaired.
- Q4 consolidated: `embedder_set`/reindex writes vectors and flips the active pointer, but does not make `memory_index.embedding_status` stick to `success`.
- Q6 advanced to an implementation acceptance spec: dry-run first, reconcile vector-present rows to `success`, then reset only missing-vector retry-retention rows.

## Questions Remaining

- The implementation packet still needs to add the MCP handler, CLI/wrapper surface if desired, typed result object, and tests.
- A separate follow-up should decide whether to add a prune/dedup maintenance tool for superseded path-anchor rows. That is intentionally out of scope for `memory_embedding_reconcile()`.
- Retry-retention defaults remain a product decision: raise destructive defaults or make retention non-destructive before embedding attempts.

## Assessment

`newInfoRatio: 0.24`.

Novelty is low-to-medium by design: this iteration did not discover new root-cause evidence, but it converted the validated counts and predicates into an implementation-ready contract. Confidence is high for the current expected dry-run counts and mutation order because they are directly grounded in iteration 7 SQL and the retry/reindex code paths.

## Next Focus

Iteration 9 should turn this acceptance spec into the follow-up implementation packet shape: target files, handler registration point, tests to add, and verification gate. It should still avoid mutating production DB state until `memory_embedding_reconcile()` exists and dry-run output matches the expected buckets.
