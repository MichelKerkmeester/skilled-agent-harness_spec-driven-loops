# Iteration 23 (Round M): C4-B FK blast-radius full re-sweep → additive-UNIQUE confirmed

## Focus
Re-verify (proper grep) all dependents on `causal_edges.id` to finalize the C4-B PK strategy. Read-only.

## Findings (newInfoRatio 0.6)
**RESOLUTION: weight_history is the sole DURABLE FK — but the prior seat's dependent set was incomplete.** Full set on `causal_edges.id`:
- Durable FK (only one): `weight_history.edge_id … REFERENCES causal_edges(id) ON DELETE CASCADE` (`vector-index-schema.ts:1423`).
- **Missed before:** checkpoints snapshot `causal_edges.id` + scope/delete `weight_history` via `edgeIds` (`checkpoints.ts:3004→1727`) — restore correctness depends on id stability; and a read-only display JOIN (`search-results.ts:526-548`).
- NOT dependents (key off source_id/target_id): traversal/search JOINs (`graph-search-fn.ts:182,186`). Every other `REFERENCES causal_edges(id)` hit is test-fixture DDL (21 hits), zero second production FK.
**PK-STRATEGY: additive `derived_id TEXT UNIQUE`, keep autoincrement PK** — replacing it = INTEGER→TEXT FK migration + checkpoint `edgeIds:number[]` retype + JOIN rewrite, zero gain. Bonus: `derived_id` can replace the 5-column natural-key re-SELECT (`causal-edges.ts:441-452`). LEVERAGE M, EFFORT S.

## Most-likely-wrong
That checkpoint restore re-inserts causal_edges preserving exact `id` — inferred from the SELECT* snapshot + getEdgeIds, did NOT open the restore INSERT path (`checkpoints.ts:2471,3076`); if restore reassigns autoincrement ids that's a pre-existing latent linkage bug independent of C4-B.

## Next Focus
C4-B finalized as S-effort additive. Flag the stale `last_insert_rowid()` comment (`causal-edges.ts:346-347` contradicts the actual natural-key re-SELECT) as a 027-internal note.
