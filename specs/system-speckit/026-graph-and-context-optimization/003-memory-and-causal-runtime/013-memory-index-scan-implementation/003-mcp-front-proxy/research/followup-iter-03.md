# Follow-up Design Iteration 03: `memory_save` Enrichment Replay Repair

## Current Gap

The primary row write is transactional, but post-insert enrichment is not part of that transaction. The relevant path is:

| Step | Evidence |
|---|---|
| Dedup can return early before any repair. | `memory-save.ts:2333-2343`, `memory-save.ts:2487-2497` |
| Same-path unchanged returns the existing id and no enrichment state. | `dedup.ts:268-279` |
| Content-hash duplicate returns the existing id and no enrichment state. | `dedup.ts:330-351` |
| Primary create/update transaction commits row and lineage. | `memory-save.ts:2500-2604` |
| Post-insert enrichment runs after commit. | `memory-save.ts:2648-2655` |
| Post-insert has typed status but only in the response. | `post-insert.ts:565-592`, `response-builder.ts:430-435` |

If a daemon is killed after the row commit and before `runPostInsertEnrichmentIfEnabled()` completes, replay sees the row and returns `unchanged` or `duplicate`. That is safe for primary-row dedup but not safe for secondary indexes and graph-side enrichment.

## Options

| Option | Description | Pros | Cons |
|---|---|---|---|
| A. Put enrichment in the write transaction | Run post-insert enrichment before committing the primary row. | No marker needed. | Not recommended. The enrichment path is async, may call embedding-backed summaries, graph lifecycle, entity linking, and can hold the SQLite writer too long. |
| B. Add a durable marker and repair on replay | Mark enrichment pending in the primary transaction; mark completed after enrichment; repair incomplete markers before returning dedup no-ops. | Smallest safe fix; preserves commit-before-enrichment latency; directly targets the replay hole. | Requires schema migration and careful status semantics. |
| C. Backfill only on `memory_index_scan` | Let replay return unchanged, but scan repairs rows later. | Simple user-visible behavior unchanged. | Leaves replay unsafe for the exact front-proxy replay case. Repair may be delayed. |

## Recommended Approach

Use option B, plus bounded scan backfill as a secondary safety net.

### Schema Marker

Add marker fields to `memory_index`:

```sql
post_insert_enrichment_status TEXT DEFAULT 'pending'
  CHECK(post_insert_enrichment_status IN ('pending', 'complete', 'partial', 'failed', 'deferred')),
post_insert_enrichment_state TEXT,
post_insert_enrichment_completed_at TEXT,
post_insert_enrichment_version INTEGER DEFAULT 1
```

Concrete schema changes:

| File | Change |
|---|---|
| `vector-index-schema.ts:427` | Bump `SCHEMA_VERSION` from `29` to `30`. |
| `vector-index-schema.ts:2408-2470` | Add the new columns to fresh `memory_index` DDL. |
| `vector-index-schema.ts:439-599` and the latest migration region | Add an idempotent v30 migration that adds the columns and an index such as `idx_post_insert_enrichment_pending ON memory_index(post_insert_enrichment_status, id) WHERE parent_id IS NULL AND post_insert_enrichment_status IN ('pending','partial','failed')`. |

### State Helpers

Create a small helper module, for example `handlers/save/enrichment-state.ts`:

| Helper | Behavior |
|---|---|
| `markPostInsertEnrichmentPending(database, memoryId)` | Set marker to `pending`, clear state/completed timestamp. Must run inside the primary write transaction. |
| `recordPostInsertEnrichmentResult(database, memoryId, enrichmentStatus, executionStatus)` | Persist `complete`, `partial`, `failed`, or `deferred`, plus serialized step state. |
| `needsPostInsertEnrichmentRepair(database, memoryId)` | True for `pending`, `partial`, or `failed`. Usually false for `deferred` unless explicit backfill mode is requested. |
| `repairPostInsertEnrichmentForReplay(database, memoryId, parsed, options)` | Run `runPostInsertEnrichmentIfEnabled()` and persist the result before returning a dedup no-op. |

### Save Path Changes

Concrete save changes:

| File | Change |
|---|---|
| `memory-save.ts:2333-2343` | When `duplicatePrecheck` exists, call `repairPostInsertEnrichmentForReplay()` with `duplicatePrecheck.id` and `routedParsed` before returning. Append a warning/result field if repair ran. |
| `memory-save.ts:2487-2497` | Same repair call for `dupResult`. |
| `memory-save.ts:2500-2604` | After the new or append-only `memoryId` is known, call `markPostInsertEnrichmentPending(database, memoryId)` before returning from the write transaction. |
| `memory-save.ts:2648-2655` | Immediately after `runPostInsertEnrichmentIfEnabled()` returns, call `recordPostInsertEnrichmentResult(...)`; then invalidate entity density cache as today. |
| `response-builder.ts:430-435` | No structural response change required; optionally include `postInsertEnrichment.repairedFromReplay` when replay repair ran. |

### Backfill Safety Net

Add a bounded backfill at scan startup:

| File | Change |
|---|---|
| `memory-index.ts:249-333` | After restore-barrier checks and scan lease acquisition, call `repairIncompletePostInsertEnrichmentBacklog(database, { specFolder: spec_folder, limit })`. Keep it bounded and non-fatal. |
| `memory-index.ts:883-907` | Include backfill counts in `data` and hints. |

Backfill should prefer reading and parsing `file_path` so causal links and metadata are interpreted by the same parser as save. If the file is missing, leave status as `failed` with a clear warning rather than inventing parsed state from `content_text`.

## Risks

| Risk | Mitigation |
|---|---|
| Re-running enrichment duplicates causal edges or graph edges. | Use existing idempotent inserts where available; tests should cover no duplicate causal edge for repeated repair. The marker only gates retries, not primary row creation. |
| `deferred` is confused with incomplete. | Treat `deferred` as intentional when post-insert enrichment is disabled or planner-first mode is active. Only explicit backfill should rerun deferred rows. |
| Schema migration affects checkpoint restore. | New columns live in `memory_index`, already part of checkpoint snapshots. Older checkpoints restore with defaults after schema bootstrap. |
| Dedup helper becomes async. | Keep dedup helpers synchronous. The caller performs repair after receiving the dedup result. |

## Test Strategy

1. Unit test schema migration v30: fresh DB has the marker columns and pending index; migrated DB gains them idempotently.
2. Unit test save path: new save marks pending in the write transaction and records complete after post-insert enrichment.
3. Unit test replay repair: mock `checkContentHashDedup()` to return `unchanged` or `duplicate`, seed marker `pending`, and verify `runPostInsertEnrichmentIfEnabled()` is called before return.
4. Unit test no-op replay: marker `complete` returns unchanged without enrichment.
5. Unit test deferred semantics: marker `deferred` does not repair during normal replay but is picked up by explicit backfill mode.
6. Add a failure test where enrichment throws or returns failed: marker remains `failed`, response carries the existing follow-up action, and replay can try again if policy allows.
