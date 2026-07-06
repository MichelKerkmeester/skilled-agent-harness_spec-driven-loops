# Iteration 7: Adversarial Verification — Impact-Walk Run-Stability (det-impact-order is NOT a no-op)

## Focus
Round A verification: is the Code Graph impact-walk output ALREADY stable across runs, or does it rely on SQLite row order (i.e., does the det-impact-order candidate address real non-determinism)? Read-only.

## Actions Taken
1. Read the impact case + finalize in `code-graph-context.ts` (`:627-671` impact push, `:398-435` finalize).
2. Read the underlying query `queryEdgesTo` (`code-graph-db.ts:1294-1308`) + the index (`:218-220`).
3. Compared to paths that DO sort (outline `:1161`, call-rank `:1208,:1219`) and the dependency/callees path (`queryEdgesFrom`, `:1271-1285`).

## Findings (file:line)

**Impact walk has NO explicit content sort — [REFUTED that it's stable].** The impact case pushes edges/nodes in raw `queryEdgesTo` return order with no `.sort()` [code-graph-context.ts:627-671]; `finalize()` returns `nodes`/`edges` as-is [`:398-435`]; the query `SELECT * FROM code_edges WHERE target_id=? AND edge_type=?` has NO `ORDER BY` [code-graph-db.ts:1294-1308]. The ONLY deterministic ordering is the fixed outer loop `['CALLS','IMPORTS']` (`:630`); within each group the order is implicit SQLite index/rowid order. [REFUTED — output is NOT explicitly ordered.]

**det-impact-order addresses REAL non-determinism — [CONFIRMED].** Equal-key rows on `idx_edges_target ON code_edges(target_id, edge_type)` (`:218-220`) resolve in rowid/insertion order, so within-group edge order can shuffle across a `code_graph_scan` rebuild (rowids change). Contrast: the outline path DOES sort (`ORDER BY start_line` `:1161`) and call-rank sorts (`ORDER BY call_count DESC, start_line ASC` `:1208,:1219`) — proving impact *deliberately* lacks a sort. Output is stable only within an unchanged DB snapshot. [CONFIRMED — candidate is NOT a no-op.]

**Stronger NET-NEW candidate:** the SAME unsorted gap is on the dependency/callees path (`queryEdgesFrom`, no ORDER BY at db.ts:1271-1285). A single shared content tiebreak in `finalize()` (`:415-434`, sort edges/nodes by sourceId/targetId/fqName) covers impact + dependency + outline-export in ONE seam. leverage HIGH, effort LOW (~5-10 LOC comparator on already-present fields).

## Questions Answered
- Is impact output already stable? **NO** — no ORDER BY; within-group order is SQLite rowid order, shuffles across rescans. det-impact-order is a real fix.

## Questions Remaining
- (new) Does any downstream consumer (deep-loop coverage-graph, detect_changes diffing) already re-sort context output, making the tiebreak cosmetic vs load-bearing?

## Next Focus
det-impact-order CONFIRMED real and should be GENERALIZED to one `finalize()` tiebreak covering all walk modes (new candidate det-context-order-global). Feeds the determinism spine.
