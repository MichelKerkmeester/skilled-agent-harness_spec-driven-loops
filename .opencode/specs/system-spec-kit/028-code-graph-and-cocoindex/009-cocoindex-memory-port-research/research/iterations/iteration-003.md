# Iteration 003 - K1.2 causal-edge lifecycle port

## Focus

K1.2 asks whether CocoIndex's `ChildExistence` plus `ChildComponentTombstone` lifecycle model can be ported into our flat `causal_edges` table to give causal edges automatic cleanup when source or target memories are deleted or renamed.

Verdict preview: yes with adaptation. The lifecycle invariant transfers, but the storage shape should not. Active causal edges should remain hard-deleted for query simplicity, with a separate tombstone/audit table and sweep path for orphan recovery.

## Actions Taken

- Read CocoIndex lifecycle writes in `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/external/cocoindex-main/rust/core/src/engine/execution.rs`.
- Read CocoIndex stable-path schema in `.opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/external/cocoindex-main/rust/core/src/state/db_schema.rs`.
- Searched CocoIndex core for tombstone, sweep, compact, cleanup, and vacuum paths.
- Read our causal-edge schema in `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`.
- Read our causal graph handler in `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts`.
- Read our causal edge storage module in `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`.
- Read memory delete, bulk delete, index stale-delete, health auto-repair, and retention sweep paths.

## Findings

### CocoIndex lifecycle mechanics

CocoIndex uses existence rows plus tombstones as a reconciliation state machine, not as a general soft-delete mechanism. The schema stores `ChildExistencePrefix`, `ChildExistence(StableKey)`, `ChildComponentTombstonePrefix`, and `ChildComponentTombstone(StablePath)` under stable-path entry keys (`db_schema.rs:35-41`). Their encoded prefixes are `0xa0` and `0xb0` (`db_schema.rs:55-63`).

The child-existence payload is intentionally tiny: `ChildExistenceInfo` only carries `node_type`, with a TODO noting that generation should be added to avoid deletion races during asynchronous child cleanup and reinsertion (`db_schema.rs:311-319`). That is the clearest signal for our port: lifecycle needs an explicit generation or event id if delete/recreate can race.

During commit, CocoIndex diffs current children against stored `ChildExistence` rows by prefix iteration (`execution.rs:612-620`). Missing stored children are deleted from existence state and routed through `del_child` (`execution.rs:631-646`, `execution.rs:654-660`). If the missing child is a component, `del_child` buffers a relative path tombstone (`execution.rs:746-768`), and `flush_component_tombstones` writes the tombstone rows (`execution.rs:771-780`).

The tombstone is then consumed by a GC pass. After the write transaction commits, `launch_child_component_gc` scans the tombstone prefix, resolves each relative path to a child component, creates a delete context, and dispatches `component.delete` (`execution.rs:570-573`, `execution.rs:725-742`). A successful child delete/build miss removes its tombstone through `cleanup_tombstone` (`execution.rs:1472-1498`, `component.rs:841-843`).

Live component deletion follows the same contract: it removes the child existence row and writes the tombstone synchronously before dispatch (`live_component.rs:541-575`). Live installation writes `ChildExistence` so future parent reruns can reconcile children and target states (`live_component.rs:795-815`). I found no separate global vacuum-style tombstone compactor in the target core search; tombstones are processed through the component GC/delete path.

### Our causal-edge lifecycle today

The current `causal_edges` schema is a flat relational table with text source and target ids, anchors, constrained relation, strength, evidence, creator, and access timestamps (`vector-index-schema.ts:607-622`). It has source, target, relation, strength, and anchor indexes (`vector-index-schema.ts:631-637`). There is no persisted lifecycle column, tombstone table, generation column, or foreign key to `memory_index`.

The relation set in the live schema is `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, and `supports` (`vector-index-schema.ts:613-615`). The stats-facing relation coverage layer still names `produced` and `cited_by` (`causal-graph.ts:112-119`, `relation-coverage.ts:36-43`). That mismatch is adjacent to K1.2: lifecycle migration should avoid widening the relation contract until the relation vocabulary is reconciled.

Normal single-memory deletes already hard-delete edges in the same transaction. `memory_delete` deletes the memory, initializes causal edges, and calls `deleteEdgesForMemory(String(numericId))` (`memory-crud-delete.ts:94-118`). Bulk delete by folder does the same per deleted memory (`memory-crud-delete.ts:190-212`). Tier-based `memory_bulk_delete` also calls `deleteEdgesForMemory` inside its transaction and intentionally propagates cleanup errors so the memory delete does not silently leave orphan edges (`memory-bulk-delete.ts:221-255`).

The storage module implements hard deletion as `DELETE FROM causal_edges WHERE source_id = ? OR target_id = ?` (`causal-edges.ts:761-774`). It also has orphan detection and cleanup: `findOrphanedEdges` anti-joins `causal_edges` against `memory_index` (`causal-edges.ts:812-820`), and `cleanupOrphanedEdges` deletes the orphan edge ids in a transaction (`causal-edges.ts:829-840`). The health handler wires that orphan cleanup into `memory_health({ autoRepair: true })` (`memory-crud-health.ts:555-567`).

Not every delete path currently calls causal-edge cleanup. `memory_index_scan` deletes stale indexed records through `vectorIndex.deleteMemory(staleRecordId)` (`memory-index.ts:310-325`), and `deleteMemory` only cleans ancillary rows plus the `memory_index` row (`vector-index-mutations.ts:614-631`). `deleteAncillaryMemoryRows` covers degree snapshots, community assignments, summaries, entities, and lineage, but not `causal_edges` (`vector-index-mutations.ts:103-110`). That means stale-file deletion can leave orphan edges until stats or health repair notices them.

Rename is less dangerous than delete because causal edges are keyed by memory id, not path. `memory_update` can update `file_path` and `canonical_file_path` while keeping the same memory id (`memory-crud-update.ts:186-191`), so existing edges do not need to move. A delete-plus-recreate reindex is different: it creates a new memory id, so old id edges are correctly treated as endpoint deletion unless a future identity-alias layer explicitly remaps them.

## Decision Matrix

| Approach | Pros | Cons | Fits our stack? |
|----------|------|------|-----------------|
| Hard cascade (FK ON DELETE CASCADE) | Simple query semantics; atomic if true FK is possible; no tombstone filters in traversal | Current ids are text and tests use synthetic ids; no audit trail; FK migration would be breaking | Partly. Keep hard-delete semantics, but implement via application helper and optional SQLite triggers rather than immediate FK conversion |
| Soft tombstone column (`deleted_at`, `tombstone_reason`) | Recoverable; audit trail on the edge row itself | Every query, traversal, stats, relation coverage, and unique constraint needs filters; existing queries assume all rows are active | Poor fit for active `causal_edges`; too easy to regress traversal and stats |
| Separate tombstone table (CocoIndex pattern, adapted) | Preserves audit and sweep/retry metadata without polluting active queries; supports orphan repair and delete/recreate generations | More schema and handler code; requires explicit writer path or trigger | Best fit. Active table stays simple; tombstone/audit table records deleted edge snapshots and lifecycle reason |
| Generation counters | Cheap invalidation and race protection; matches CocoIndex's own TODO | Conceptually separate from cleanup; process-local generation already exists but is not persisted | Useful as an addition. Persist `lifecycle_generation` or `event_id` in tombstones and mutation ledger, not as the only cleanup mechanism |

## Verdict on K1.2 + Schema Sketch

YES-WITH-ADAPTATION. Port the lifecycle invariant, not the exact data model. CocoIndex tombstones are short-lived reconciliation markers over a hierarchical component tree; our causal graph is a flat SQL edge table where normal reads should only see active edges. The right adaptation is hard-delete active `causal_edges`, add a separate `causal_edge_tombstones` audit/sweep table, and route every memory deletion path through one helper that snapshots affected edges, deletes them, bumps the causal generation, and lets health repair sweep any legacy or direct-DB orphans.

Recommended SQLite additions:

```sql
CREATE TABLE IF NOT EXISTS causal_edge_tombstones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  edge_id INTEGER,
  source_id TEXT NOT NULL,
  target_id TEXT NOT NULL,
  source_anchor TEXT,
  target_anchor TEXT,
  relation TEXT NOT NULL,
  strength REAL,
  evidence TEXT,
  created_by TEXT,
  extracted_at TEXT,
  tombstoned_at TEXT NOT NULL DEFAULT (datetime('now')),
  tombstone_reason TEXT NOT NULL CHECK(tombstone_reason IN (
    'memory_deleted',
    'endpoint_rekeyed',
    'orphan_sweep',
    'manual_unlink'
  )),
  triggering_memory_id TEXT,
  lifecycle_generation INTEGER NOT NULL DEFAULT 1,
  restored_at TEXT,
  metadata_json TEXT
);

CREATE INDEX IF NOT EXISTS idx_causal_edge_tombstones_source ON causal_edge_tombstones(source_id);
CREATE INDEX IF NOT EXISTS idx_causal_edge_tombstones_target ON causal_edge_tombstones(target_id);
CREATE INDEX IF NOT EXISTS idx_causal_edge_tombstones_reason ON causal_edge_tombstones(tombstone_reason);
CREATE INDEX IF NOT EXISTS idx_causal_edge_tombstones_tombstoned_at ON causal_edge_tombstones(tombstoned_at);
```

Trigger/handler mechanism:

- Add `tombstoneAndDeleteEdgesForMemory(memoryId, reason, metadata)` in `lib/storage/causal-edges.ts`.
- Inside one transaction, `INSERT INTO causal_edge_tombstones SELECT ... FROM causal_edges WHERE source_id = ? OR target_id = ?`, then `DELETE FROM causal_edges WHERE source_id = ? OR target_id = ?`.
- Replace `deleteEdgesForMemory` calls in `memory-crud-delete.ts` and `memory-bulk-delete.ts` with the tombstoning helper.
- Fix `memory-index.ts` stale-delete path by calling the same helper before or inside the stale record delete transaction.
- Extend `cleanupOrphanedEdges` to tombstone with `tombstone_reason = 'orphan_sweep'` before deleting orphan rows.
- Optional safety triggers can snapshot edges on `memory_index` delete for direct SQL deletes, but application-level writes should remain the source of truth because current edge endpoints are text ids and test databases use synthetic ids.

Migration plan:

1. Add the tombstone table behind a new schema migration. Existing active edges remain active; no backfill needed because `deleted_at` is not added to `causal_edges`.
2. Add the tombstoning helper and route `memory_delete`, `memory_bulk_delete`, stale index deletion, manual unlink, and orphan sweep through it.
3. Keep current `causal_edges` queries unchanged because the active table only contains live edges.
4. Add a one-time health/autoRepair action that finds current orphaned edges, tombstones them with `orphan_sweep`, then deletes them.
5. Add retention for old tombstones, likely through `memory_retention_sweep`, with a default long TTL or governed retention policy.

Sweep/GC handler:

- No new public MCP tool is required initially. Extend `memory_health({ autoRepair: true })` and `memory_retention_sweep({ dryRun })`.
- `memory_health` should report `orphan_edges_tombstoned:N` instead of only `orphan_edges_cleaned:N`.
- `memory_retention_sweep` should optionally purge tombstones older than policy while preserving recent audit rows.
- A future `memory_causal_tombstones` read-only diagnostic tool could be useful, but it is not required for lifecycle correctness.

## Questions Answered

- K1.2 answered: causal-edge lifecycle should adopt CocoIndex's reconciliation invariant with adaptation: hard-delete active edges, snapshot into a separate tombstone table, and fix stale-index deletion to participate in the same lifecycle.

## Questions Remaining

- K1.3: determine whether CocoIndex target-state/action-sink abstractions map to our embedding, BM25, graph, and cache mutation paths.
- K1.4: assess stable path identity across spec folder moves, phase renames, symlinks, canonical path migrations, and delete-plus-recreate reindex behavior.
- K1.5: assess code-hash or logic-hash generation strategy for TypeScript modules.
- K1.6: determine how much of the DAG and lifecycle state should be exposed through MCP tool responses versus internal telemetry only.
- K2.1, K2.2, K2.3, K2.5 remain open from the strategy.

## Next Focus

Recommend K1.3 next: target-state/action-sink transfer. K1.1 established memo/DAG viability, and K1.2 establishes lifecycle semantics for causal edges; the next uncertainty is how downstream state reconciliation should apply across embedding, FTS/BM25, graph, and cache mutation paths.
