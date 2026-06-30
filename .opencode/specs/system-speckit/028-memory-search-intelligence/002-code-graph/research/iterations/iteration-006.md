# Iteration 6: Adversarial Verification — Q1-C1 Bi-temporal Reindex Conflict-Risk (REFUTED "low")

## Focus
Round A (broadening) adversarial verification of the roadmap's **[INFERRED]** "LOW conflict-risk" rating for Code Graph candidate **Q1-C1** (add `valid_at`/`invalid_at`; replace reindex DELETEs with soft-invalidate + INSERT-new). Trace the cross-file CALLS resolver + `pruneDanglingEdges` interaction end-to-end. Read-only.

## Actions Taken
1. Read the cross-file CALLS resolver `cross-file-edge-resolver.ts` (`:65-89` unfiltered `SELECT FROM code_nodes` + import-targeted CALLS scan; `:98-119` `candidates.length===1` guard; `:91-95` in-place `UPDATE code_edges SET target_id`).
2. Read the dangling-prune sites `code-graph-db.ts` (`:1011-1015` inline prune, `:1030-1034` pruneDanglingEdges, `:1195-1196` CALLS join, `:941-943`/`:985` reindex deletes) — all decide "dangling" via `NOT IN (SELECT symbol_id FROM code_nodes)`.
3. Traced what breaks if old rows are retained (soft-invalidated) instead of deleted.

## Findings (file:line)

**Soft-invalidating reindex rows breaks the prune+resolver pair — [CONFIRMED failure modes].**
With old node rows RETAINED (soft-invalidated): (i) the prune's `NOT IN (SELECT symbol_id FROM code_nodes)` set collapses to ~empty, so TRUE dangling edges go UN-pruned (failure mode b); (ii) every name now has N>1 node rows, so the resolver's `candidates.length===1` guard flips clean single-candidate resolutions to ambiguousSkipped/unresolved; (iii) the resolver's in-place `UPDATE code_edges SET target_id` (`:91-95`) is itself incompatible with the append-only bi-temporal premise. [CONFIRMED — cross-file-edge-resolver.ts:65-119,91-95; code-graph-db.ts:1011-1015,1030-1034.]

**"Q1-C1 is low-conflict-risk" is WRONG — [REFUTED].**
Existence-semantics are read IMPLICITLY by every `IN (SELECT ... FROM code_nodes)` / unfiltered `FROM code_nodes|code_edges` query (db:1012-1014,1031-1033,1195-1196; resolver:65-89) — none filter by validity. The blast radius is the whole read/resolve/prune surface, NOT the 4 DELETE lines the candidate scopes. Conflict-risk is **MEDIUM-HIGH**, not LOW. [REFUTED.]

**De-risking candidate (NET-NEW):** introduce generation-scoped live views/CTEs (`code_nodes_live`/`code_edges_live` = `WHERE invalid_at IS NULL`) and route ALL read/resolve/prune queries through them — localizes the bi-temporal migration to ONE chokepoint instead of every query. leverage HIGH, effort MEDIUM.

**Roadmap impact:** Q1-C1's [INFERRED] LOW rating → **REFUTED → MEDIUM-HIGH**. Closes the roadmap's own untraced caveat ("the cross-file CALLS resolver + pruneDanglingEdges interaction was never read end-to-end") — the interaction IS the failure point. Q1-C1 must be re-scoped to include the live-view chokepoint + the resolver's in-place UPDATE → invalidate+insert.

## Questions Answered
- Is Q1-C1 low-conflict-risk? **NO — REFUTED.** MEDIUM-HIGH: soft-invalidate without a validity-filtered read layer breaks dangling-prune (under-prunes) AND the cross-file resolver (ambiguous-skips), and the in-place `target_id` UPDATE conflicts with append-only.

## Questions Remaining
- (new) Must the resolver's in-place `UPDATE SET target_id` become invalidate+insert under append-only edges, and how is re-resolution idempotency preserved across generations?
- (new) What other in-place UPDATEs on `code_edges`/`code_nodes` (weight, metadata, content_hash) assume row mutability and would conflict?
- (new) Does the dangling-edge tombstone audit (`recordDanglingEdgeTombstones`) double-count once deletes become soft-invalidates?

## Next Focus
Q1-C1 re-scoped from "low / 4-DELETE-sites" to "MEDIUM-HIGH / whole-read-surface + live-view chokepoint." The live-view candidate (Q1-C1-views) is the de-risking move; feeds Round C feasibility (the `code-graph-db.ts` shared-txn cluster) directly.
