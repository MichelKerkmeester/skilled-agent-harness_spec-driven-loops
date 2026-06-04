---
iteration: 032
rq: RQ-N3
phase_target: 004-causal-edge-tombstones
newInfoRatio: 0.72
verdict: ADAPT
---

# Iteration 032 — RQ-N3: Causal-Graph Lifecycle Tombstones — Post-012 State Audit

## Research Question

Has commit d232da4ee (012-causal-graph-channel-routing) or any other recent change (since 2026-05-09) changed: (A) which code paths perform causal-edge deletion, (B) whether tombstone infrastructure already exists, (C) the risk profile for unprotected deletions? Produce a revised risk table for phase 004.

---

## Findings

### (A) Code Paths That Perform Causal-Edge Deletion

Three distinct call sites perform hard causal-edge deletion in the current codebase. All three call `causalEdges.deleteEdgesForMemory()` or `deleteEdge()`, which issue unconditional `DELETE FROM causal_edges` SQL with no tombstone or audit row written.

**Call site 1 — memory_delete (single memory):**
`handlers/memory-crud-delete.ts:117-118` — inside a `database.transaction()` wrapper, after `vectorIndex.deleteMemory()` succeeds, the handler calls `causalEdges.init(database)` then `causalEdges.deleteEdgesForMemory(String(numericId))`. This is within an explicit SQLite transaction, so the edge deletion is atomic with the memory row deletion. No tombstone row is written before or after the delete. The degree cache is invalidated via `clearDegreeCacheForDb(database)` at line 120.

**Call site 2 — memory_bulk_delete (tier-based bulk):**
`handlers/memory-bulk-delete.ts:248-252` — inside a bulk transaction loop, per-memory `causalEdges.deleteEdgesForMemory(String(memory.id))` is called. The d232da4ee commit message (`memory-bulk-delete.ts:8/27-41/149/256`) explicitly wired `invalidateEntityDensityCache()` into the post-commit branch for this handler. The cache invalidation is now reliable (warn-once helper added). Still: no tombstone row, no audit row for the edge deletions themselves. The mutation ledger records the parent memory bulk-delete, but the edge deletions are not separately audited.

**Call site 3 — memory_health autoRepair:**
`handlers/memory-crud-health.ts:701-714` — when `autoRepair=true` and the reportMode is "full", the handler calls `causalEdges.init(database)` then `causalEdges.cleanupOrphanedEdges()` (line 705). `cleanupOrphanedEdges()` is defined in `lib/storage/causal-edges.ts:829-846` and internally calls `deleteEdge(edge.id)` (line 836) for each orphaned edge found by `findOrphanedEdges()` (lines 812-825). Orphaned edges are edges whose source_id or target_id no longer exists in memory_index. This path is fully hard-delete, no tombstone, no audit row. The comment at line 698-699 confirms this path was previously "never invoked at runtime" and was wired in as an autoRepair step — it is now active.

**`deleteEdgesForMemory` implementation:**
`lib/storage/causal-edges.ts:764-775` — issues `DELETE FROM causal_edges WHERE source_id = ? OR target_id = ?`. No snapshot is taken, no audit table is written, no tombstone record is produced. The function comment at line 761-763 explicitly notes that errors now propagate to callers (previously swallowed) to avoid leaving orphan edges when the transaction fails, but correctness-of-deletion visibility was not addressed.

**`deleteEdge` implementation:**
`lib/storage/causal-edges.ts:743-759` — issues `DELETE FROM causal_edges WHERE id = ?`. Same pattern: no tombstone, no audit.

---

### (B) Whether Tombstone Infrastructure Already Exists

**Tombstone infrastructure for causal edges: absent.**

A search across all TypeScript files in `mcp_server/` for `tombstone`, `causal_audit`, `edge_tombstone`, and `tombstone_edge` returns zero results. There is no `causal_edge_tombstones` table, no `causal_audit` table, no `edge_tombstone` function, and no schema migration that adds any of these. The word "tombstone" does not appear anywhere in `lib/storage/causal-edges.ts`.

**Governance audit infrastructure exists, but not for causal edges:**
The `governance_audit` table is present and used for memory-tier changes (constitutional downgrades, checkpoint restore events, and retention sweep decisions). See `tests/cleanup-script-audit-emission.vitest.ts:67` and `tests/memory-retention-sweep.vitest.ts:119`. However, causal-edge deletions are not routed through this table. The governance_audit table covers memory row tier mutations, not graph edge mutations.

**Weight history exists for causal edges (not tombstones):**
`lib/storage/causal-edges.ts:1075-1078` exports `logWeightChange`, `getWeightHistory`, and `rollbackWeights`. These provide edge weight mutation history but not a deletion audit trail. A weight history row is not a tombstone: it records that a weight changed, not that an edge was deleted.

**Conclusion:** No tombstone infrastructure exists for causal edges as of the current HEAD in the worktree. Phase 004 needs to build it from scratch.

---

### (C) Risk Profile for Unprotected Deletions — Revised Assessment

The d232da4ee commit (012-causal-graph-channel-routing) did NOT change the causal-edge deletion logic itself. It changed:
- `memory-save.ts` and `memory-bulk-delete.ts`: wired `invalidateEntityDensityCache()` post-commit (P1-C-001).
- `entity-density.ts`: JSDoc, cache/concurrency/size/safety notes preserved.
- `query-router.ts`: pre-computed intent dedup, flag self-gate, JSDoc on 3 exports, env-flag tightening, routing reasons clamp, warn-once Set for `safeGetDb`.
- `routing-telemetry.ts`: SOURCE OF TRUTH comment on ChannelName dup, rolling telemetry changes.

None of these touched `deleteEdgesForMemory`, `deleteEdge`, `cleanupOrphanedEdges`, or added tombstone infrastructure.

The pt-04 audit's REVISE_SCOPE verdict was correct: the 012 commit brought the channel-routing and entity-density invalidation work but left the causal-edge lifecycle (deletion, tombstones, sweeps) entirely unaddressed. The risk profile is therefore unchanged from what phase 004 originally scoped.

---

### Revised Risk Table for Phase 004

| Risk | Severity | Evidence | Mitigated by 012? |
|------|----------|----------|--------------------|
| R1: Hard-delete in memory_delete loses edge lineage permanently | HIGH | `memory-crud-delete.ts:118` `causal-edges.ts:764-775` | No |
| R2: Hard-delete in memory_bulk_delete loses batch edge lineage | HIGH | `memory-bulk-delete.ts:252` | No (invalidateEntityDensityCache added, not tombstone) |
| R3: autoRepair orphan sweep silently deletes edges with no audit | HIGH | `memory-crud-health.ts:705` `causal-edges.ts:829-846` | No |
| R4: No causal audit table — governance_audit covers memory tiers only | HIGH | Zero tombstone hits in all TS files; `governance_audit` scope confirmed | No |
| R5: deleteEdgesForMemory errors now propagate (good) but deletion itself unaudited | MEDIUM | `causal-edges.ts:761-763` (comment confirms prior swallow removed) | Partial — error propagation fixed, audit still missing |
| R6: Weight-history rollback exists but not deletion rollback | MEDIUM | `causal-edges.ts:1075-1078` | No |
| R7: cleanupOrphanedEdges loops through findOrphanedEdges then calls deleteEdge per row — no batch tombstone | MEDIUM | `causal-edges.ts:829-846` | No |

**Net assessment:** Phase 004 scope is valid and undiminished. The pt-04 REVISE_SCOPE verdict was specifically about whether 012 had already done some of this work. The answer is no — 012 is routing/telemetry infrastructure; it does not touch the deletion paths. The original plan (tombstone audit rows + unified sweep helper routed through all three deletion call sites) is correct and still needed.

---

## Summary

Commit d232da4ee is a routing-telemetry and entity-density-cache package. It did not change deletion paths (A), did not introduce tombstone infrastructure (B — which remains entirely absent), and did not reduce the risk profile (C — all three unprotected deletion call sites remain hard-deletes). Phase 004 should proceed with its original scope: add a tombstone audit table, route `deleteEdgesForMemory`, `deleteEdge`, and `cleanupOrphanedEdges` through a sweep helper that writes tombstone rows before executing the `DELETE`, and wire `memory_health.autoRepair` through the same helper.
