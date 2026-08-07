# Iteration 7: Empirically Validate Active-Vector Coverage

## Focus

Empirically validate F4 with read-only SQL: the current `failed` / `pending` / `retry` backlog is not mostly missing embeddings, but already has rows in the active vector shard. This iteration also tightens F3 with a concrete latest-row masking count and turns the reconciliation recommendation into implementation-ready predicates.

## Actions Taken

1. Re-read the current strategy next-focus block and iteration 6 findings to anchor the claims being tested.
2. Identified the active embedder pointer in `context-index.sqlite` and matched it to the vector shard under `database/vectors/`.
3. Inspected the active shard schema and runtime code to confirm the row-id mapping between `memory_index.id`, `vec_768.id`, and `vec_memories.rowid`.
4. Ran read-only `sqlite3` queries against `context-index.sqlite` with the active shard attached in read-only mode.
5. Recomputed the failed-row latest-path/anchor masking buckets and separated total supersession from dedup-eligible masking.

## Findings

### F1. The active vector shard is `context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite`.

The active pointer in the main DB is:

```sql
SELECT key, value
FROM vec_metadata
WHERE key IN ('active_embedder_name','active_embedder_dim','active_embedder_provider')
ORDER BY key;
```

Result:

```text
active_embedder_dim|768
active_embedder_name|nomic-embed-text-v1.5
active_embedder_provider|
```

[SOURCE: sqlite SELECT on `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite`]

The active shard metadata is:

```sql
ATTACH 'file:.opencode/skills/system-spec-kit/mcp_server/database/vectors/context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite?mode=ro' AS av;
SELECT key, value FROM av.vec_metadata ORDER BY key;
```

Result:

```text
dim|768
embedding_dim|768
model|nomic-embed-text-v1.5
provider|ollama
```

[SOURCE: sqlite ATTACH/SELECT on `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite` + `.opencode/skills/system-spec-kit/mcp_server/database/vectors/context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite`]

Runtime path construction matches that file name: active embedder metadata resolves to an `EmbeddingProfile`, and the shard path is `database/vectors/context-vectors__${profile.slug}.sqlite`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:364`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:369`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:372`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:384`]

The active pointer itself is stored in `vec_metadata` keys `active_embedder_name`, `active_embedder_dim`, and `active_embedder_provider`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts:48`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts:50`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts:162`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts:214`]

### F2. The row mapping is `memory_index.id` -> `vec_768.id` and `memory_index.id` -> `vec_memories.rowid`.

The shard has both the ordinary dimensional table and the sqlite-vec virtual table:

```sql
SELECT type, name, sql
FROM sqlite_master
WHERE name LIKE 'vec_memories%' OR name LIKE '%metadata%' OR name LIKE '%profile%' OR name LIKE '%embed%'
ORDER BY name;
```

Key schema rows:

```text
table|vec_768|CREATE TABLE vec_768 (id INTEGER PRIMARY KEY, vec BLOB NOT NULL)
table|vec_memories|CREATE VIRTUAL TABLE vec_memories USING vec0(embedding FLOAT[768])
table|vec_metadata|CREATE TABLE vec_metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')))
```

[SOURCE: sqlite SELECT on `.opencode/skills/system-spec-kit/mcp_server/database/vectors/context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite`]

The local `sqlite3` binary cannot load the `vec0` module, so direct `SELECT` from `vec_memories` fails. The shadow rowid table is still readable and confirms rowid coverage:

```sql
ATTACH 'file:.opencode/skills/system-spec-kit/mcp_server/database/vectors/context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite?mode=ro' AS av;
SELECT COUNT(*) AS memory_rows FROM memory_index;
SELECT COUNT(*) AS vec_768_rows FROM av.vec_768;
SELECT COUNT(*) AS vec_memories_rowids FROM av.vec_memories_rowids;
SELECT COUNT(*) AS vec_768_orphan_ids
FROM av.vec_768 v LEFT JOIN memory_index m ON m.id = v.id
WHERE m.id IS NULL;
SELECT COUNT(*) AS vec_memories_orphan_rowids
FROM av.vec_memories_rowids r LEFT JOIN memory_index m ON m.id = r.rowid
WHERE m.id IS NULL;
```

Result:

```text
memory_rows|26978
vec_768_rows|28036
vec_memories_rowids|26978
vec_768_orphan_ids|1069
vec_memories_orphan_rowids|0
```

[SOURCE: sqlite ATTACH/SELECT on `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite` + active shard]

Runtime inserts use the memory row id as the vector row id: new memory rows insert into `vec_memories(rowid, embedding)` with `row_id`, and updates delete/insert using `rowid = id` before marking `memory_index.embedding_status='success'`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:277`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:284`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:286`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:540`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:545`]

`embedder_set` reindex also writes both vector surfaces while leaving `memory_index.embedding_status` untouched: it calls `writeVectors(...)` and `writeVectorsToShard(...)`, then flips the active pointer and marks the job complete. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:431`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:432`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:440`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts:443`]

### F3. All 17,326 current non-success rows already have active vectors.

Current status distribution:

```sql
SELECT embedding_status, COUNT(*)
FROM memory_index
GROUP BY embedding_status
ORDER BY embedding_status;
```

Result:

```text
failed|16344
pending|957
retry|25
success|9652
```

[SOURCE: sqlite SELECT on `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite`]

Active `vec_768` coverage for the backlog:

```sql
ATTACH 'file:.opencode/skills/system-spec-kit/mcp_server/database/vectors/context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite?mode=ro' AS av;
SELECT
  m.embedding_status,
  COUNT(*) AS total,
  SUM(CASE WHEN v.id IS NOT NULL THEN 1 ELSE 0 END) AS has_active_vec_768,
  SUM(CASE WHEN v.id IS NULL THEN 1 ELSE 0 END) AS missing_active_vec_768
FROM memory_index m
LEFT JOIN av.vec_768 v ON v.id = m.id
WHERE m.embedding_status IN ('pending','failed','retry')
GROUP BY m.embedding_status
ORDER BY m.embedding_status;
```

Result:

```text
failed|16344|16344|0
pending|957|957|0
retry|25|25|0
```

[SOURCE: sqlite ATTACH/SELECT on `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite` + active shard]

The same rows also have `vec_memories` rowid shadow coverage:

```sql
ATTACH 'file:.opencode/skills/system-spec-kit/mcp_server/database/vectors/context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite?mode=ro' AS av;
SELECT
  m.embedding_status,
  COUNT(*) AS total,
  SUM(CASE WHEN v.id IS NOT NULL THEN 1 ELSE 0 END) AS has_vec_768,
  SUM(CASE WHEN r.rowid IS NOT NULL THEN 1 ELSE 0 END) AS has_vec_memories_rowid,
  SUM(CASE WHEN v.id IS NULL THEN 1 ELSE 0 END) AS missing_vec_768,
  SUM(CASE WHEN r.rowid IS NULL THEN 1 ELSE 0 END) AS missing_vec_memories_rowid
FROM memory_index m
LEFT JOIN av.vec_768 v ON v.id = m.id
LEFT JOIN av.vec_memories_rowids r ON r.rowid = m.id
WHERE m.embedding_status IN ('pending','failed','retry')
GROUP BY m.embedding_status
ORDER BY m.embedding_status;
```

Result:

```text
failed|16344|16344|16344|0|0
pending|957|957|957|0|0
retry|25|25|25|0|0
```

[SOURCE: sqlite ATTACH/SELECT on `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite` + active shard]

Aggregate backlog bucket:

```sql
ATTACH 'file:.opencode/skills/system-spec-kit/mcp_server/database/vectors/context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite?mode=ro' AS av;
SELECT
  CASE WHEN v.id IS NULL THEN 'missing_active_vec_768' ELSE 'has_active_vec_768' END AS active_vector_bucket,
  COUNT(*) AS rows
FROM memory_index m
LEFT JOIN av.vec_768 v ON v.id = m.id
WHERE m.embedding_status IN ('pending','failed','retry')
GROUP BY active_vector_bucket
ORDER BY active_vector_bucket;
```

Result:

```text
has_active_vec_768|17326
```

[SOURCE: sqlite ATTACH/SELECT on `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite` + active shard]

This answers the central F4 claim: the current backlog is 100% vector-present and 0% genuinely missing active vectors.

### F4. F3 is confirmed: 15,152 failed rows are older than the latest row for the same canonical path and anchor.

The precise latest-row query, matching dedup's path-and-anchor shape, is:

```sql
WITH latest AS (
  SELECT
    COALESCE(canonical_file_path, file_path) AS canonical_path,
    COALESCE(anchor_id, '') AS anchor_key,
    MAX(id) AS latest_id
  FROM memory_index
  GROUP BY COALESCE(canonical_file_path, file_path), COALESCE(anchor_id, '')
),
failed_rows AS (
  SELECT
    f.id,
    COALESCE(f.canonical_file_path, f.file_path) AS canonical_path,
    COALESCE(f.anchor_id, '') AS anchor_key,
    latest.latest_id
  FROM memory_index f
  JOIN latest
    ON latest.canonical_path = COALESCE(f.canonical_file_path, f.file_path)
   AND latest.anchor_key = COALESCE(f.anchor_id, '')
  WHERE f.embedding_status = 'failed'
)
SELECT
  CASE
    WHEN failed_rows.id = failed_rows.latest_id THEN 'latest_failed_row_for_path_anchor'
    ELSE 'masked_by_newer_latest_path_anchor_row'
  END AS bucket,
  latest_row.embedding_status AS latest_status,
  COUNT(*) AS failed_rows
FROM failed_rows
JOIN memory_index latest_row ON latest_row.id = failed_rows.latest_id
GROUP BY bucket, latest_row.embedding_status
ORDER BY bucket, latest_status;
```

Result:

```text
latest_failed_row_for_path_anchor|failed|1192
masked_by_newer_latest_path_anchor_row|failed|604
masked_by_newer_latest_path_anchor_row|pending|280
masked_by_newer_latest_path_anchor_row|retry|34
masked_by_newer_latest_path_anchor_row|success|14234
```

[SOURCE: sqlite SELECT on `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite`]

The direct count is:

```sql
WITH latest AS (
  SELECT
    COALESCE(canonical_file_path, file_path) AS canonical_path,
    COALESCE(anchor_id, '') AS anchor_key,
    MAX(id) AS latest_id
  FROM memory_index
  GROUP BY COALESCE(canonical_file_path, file_path), COALESCE(anchor_id, '')
)
SELECT COUNT(*) AS failed_masked_by_newer_latest_path_anchor_row
FROM memory_index f
JOIN latest
  ON latest.canonical_path = COALESCE(f.canonical_file_path, f.file_path)
 AND latest.anchor_key = COALESCE(f.anchor_id, '')
WHERE f.embedding_status='failed'
  AND f.id <> latest.latest_id;
```

Result:

```text
15152
```

[SOURCE: sqlite SELECT on `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite`]

Dedup's unchanged path only applies when the latest row status is `success`, `pending`, or `partial`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/dedup.ts:15`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/dedup.ts:255`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/dedup.ts:268`]

So the more exact dedup-eligible masked count is:

```sql
WITH latest AS (
  SELECT
    COALESCE(canonical_file_path, file_path) AS canonical_path,
    COALESCE(anchor_id, '') AS anchor_key,
    MAX(id) AS latest_id
  FROM memory_index
  GROUP BY COALESCE(canonical_file_path, file_path), COALESCE(anchor_id, '')
),
failed_rows AS (
  SELECT f.id, latest.latest_id
  FROM memory_index f
  JOIN latest
    ON latest.canonical_path = COALESCE(f.canonical_file_path, f.file_path)
   AND latest.anchor_key = COALESCE(f.anchor_id, '')
  WHERE f.embedding_status = 'failed'
)
SELECT COUNT(*) AS failed_masked_by_dedup_eligible_latest_row
FROM failed_rows
JOIN memory_index latest_row ON latest_row.id = failed_rows.latest_id
WHERE failed_rows.id <> failed_rows.latest_id
  AND latest_row.embedding_status IN ('success','pending','partial');
```

Result:

```text
14514
```

[SOURCE: sqlite SELECT on `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite`]

### F5. The fix is mostly free reconciliation for this DB, not real embedding work.

For the current live DB, the dry-run buckets for `memory_embedding_reconcile()` should be:

```text
vector_present_status_stale: 17326
missing_active_vector_retry_eligible: 0
missing_active_vector_provider_failure: 0
```

The implementation predicate should be:

```sql
-- Dry-run bucket: repairable without embedding work.
SELECT COUNT(*) AS vector_present_status_stale
FROM memory_index m
WHERE m.embedding_status IN ('failed','pending','retry')
  AND EXISTS (
    SELECT 1 FROM active_vec.vec_768 v WHERE v.id = m.id
  );

-- Dry-run bucket: actual embedding work remains.
SELECT COUNT(*) AS missing_active_vector
FROM memory_index m
WHERE m.embedding_status IN ('failed','pending','retry')
  AND NOT EXISTS (
    SELECT 1 FROM active_vec.vec_768 v WHERE v.id = m.id
  );
```

The apply path should reconcile vector-present rows to `success` first, then only reset/retry rows that lack active vectors:

```sql
UPDATE memory_index
SET embedding_status = 'success',
    embedding_generated_at = COALESCE(embedding_generated_at, CURRENT_TIMESTAMP),
    failure_reason = NULL,
    updated_at = CURRENT_TIMESTAMP
WHERE embedding_status IN ('failed','pending','retry')
  AND EXISTS (
    SELECT 1 FROM active_vec.vec_768 v WHERE v.id = memory_index.id
  );

UPDATE memory_index
SET embedding_status = 'pending',
    retry_count = 0,
    last_retry_at = NULL,
    failure_reason = NULL,
    updated_at = CURRENT_TIMESTAMP
WHERE embedding_status IN ('failed','pending','retry')
  AND NOT EXISTS (
    SELECT 1 FROM active_vec.vec_768 v WHERE v.id = memory_index.id
  )
  AND (
    failure_reason LIKE 'Retry retention%'
    OR embedding_status IN ('pending','retry')
  );
```

This should be implemented through a guarded MCP maintenance tool that resolves the active shard from runtime metadata. Raw SQL is still useful as an emergency runbook, but it is easy to attach the wrong shard by hand.

## Questions Answered

- Q3 strengthened: 15,152 failed rows are older than a same path-and-anchor latest row; 14,514 of those have a newer dedup-eligible latest status (`success` or `pending` in this DB).
- Q4 strengthened: `embedder_set` wrote active vectors and flipped the active pointer, but the non-success statuses did not stick to success because the reindex path does not update `memory_index.embedding_status`.
- Q6 refined: the next runbook should begin with active-vector reconciliation. For the current DB, there is no real embedding work for the non-success backlog after reconciliation because missing active-vector count is zero.

## Questions Remaining

- Implementation still needs to add `memory_embedding_reconcile()` with dry-run/apply counters and active-shard guardrails.
- The follow-up implementation should decide whether to expose the emergency SQL path in docs or keep it internal to operator notes.
- Retry-retention defaults still need a product decision: raise the destructive caps substantially, or make retention non-destructive before an embedding attempt.

## Next Focus

Iteration 8 should convert this evidence into a concise implementation acceptance spec: `memory_embedding_reconcile()` arguments, dry-run output schema, apply mutations, tests, and runbook verification commands. It should explicitly include the current expected dry-run counts: `vector_present_status_stale=17326`, `missing_active_vector=0`, and `failed_masked_by_newer_latest_path_anchor_row=15152`.

