# Iteration 24 (Round M): Bi-temporal canonical-supersede-writer → dual-truth risk DISSOLVED

## Focus
Resolve the L9 dual-supersede-truth risk: which store is canonical for "current"; migration cost. Read-only.

## Findings (newInfoRatio 0.6)
**CANONICAL-WRITER: LINEAGE owns "current"; causal `invalid_at` is a DERIVED projection of it.** The "dual truth" is actually a one-way pipeline:
- lineage `superseded_by_memory_id` is written by `lineage-state.ts:798-803` (SUPERSEDE COALESCE) + `:1209-1233` (backfill) → `relation-backfill.ts:312-326` promotes it into causal supersedes/CONTRADICTS edges → `contradiction-detection.ts:110` closes via `invalidateEdge`. Arrow points **lineage → causal**.
- Causal currency is barely read: `getValidEdges` has no prod callers; the only live `invalid_at IS NULL` read is contradiction-detection reading its own writes.
- **The real "what memory is current" recall path is a THIRD store neither framing named — `active_memory_projection.active_memory_id`** (JOINed by `hybrid-search.ts:732`, `interference-scoring.ts:141,155,206,242`). So C3-A "currentness = edge presence" is a read-side build layered over a derived store.
- **MIGRATION: additive-M.** Add nullable `expired_at` to lineage (already has valid_from/valid_to + created_at), add txn-time pair to causal_edges, declare the four-timestamp set once in `vector-index-schema.ts`. New columns default NULL → no reader rewrite. LEVERAGE H, EFFORT M.

## Most-likely-wrong
"Additive-M, no reader rewrites" holds only if C3-C "Current" reads stay on lineage/active_memory_projection. If "Current" is meant to REPLACE active_memory_projection with causal edge-presence reads, `hybrid-search.ts:732` + interference-scoring get rewritten → cost crosses into L.

## Next Focus
Designate lineage canonical in the ledger's bi-temporal plan; surface active_memory_projection as the real current-store (the dual-truth framing omitted it). Feeds the 028 roadmap edit (M9).
