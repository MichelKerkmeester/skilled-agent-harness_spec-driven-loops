# Iteration 9: External Mining — aionforge audit-subgraph.md + link-evolution.md → Code Graph

## Focus
Round B mining: audit-subgraph + link-evolution for NET-NEW Code Graph candidates beyond Q1-Q8/det-order/CRDT-cluster. Read-only.

## Findings — NET-NEW candidates (6; newInfoRatio 0.80)
| Candidate | Seam | Lev/Eff | Class | Conf |
|---|---|---|---|---|
| edge-bitemporal-lifecycle (RELATES_TO carries valid_from/valid_to + ingested_at/expired_at; one current edge per ordered pair; a different label = close-and-replace revision) | code-graph-db.ts:177-184 (no temporal cols on code_edges, LWW) | H/L | BUILD | CONFIRMED-gap |
| audit-subgraph (every governance op leaves an AuditEvent queryable by subject/kind/time, wired to the affected entity) | code-graph-db.ts:247-260 (delete-only tombstones); 616-679 (global snapshot provenance, not per-decision) | M/M | BUILD | CONFIRMED |
| cascade-guard (confidence floor + per-run caps on links created/revised + per-pair revision cap from closed versions; flip-flop can't rewrite unbounded) | structural-indexer.ts:2045 (uncapped heuristic edge writes) | M/S | BUILD | CONFIRMED |
| monotonic-dedup-latch (single funnel owns dedup; on a hit a one-way latch only UPGRADES blank→signed, never strips/downgrades) | structural-indexer.ts:1919 (dedup DROPS rather than reconciling attrs) | M/S | FIX | INFERRED |
| closed-vocabulary CHECK on edge_type (driver enforces closed relationship vocab even if a future evolver doesn't; OOV dropped) | code-graph-db.ts:181 (edge_type TEXT, no CHECK) vs :205 (parser_skip CHECK pattern exists) | L/S | FIX | CONFIRMED |
| per-row audit verdict + substrate signing (keyring-anchored, per-row verdict at read, tampered row reads invalid) | GAP (db.ts:172 `signature` = CODE sig, not crypto) | L/L | BUILD | CONFIRMED-gap (FLAG: over-eng for local single-writer) |

**Already covered:** Q1-C2 (SUPERSEDES on node rename — distinct from edge-level lifecycle); Q1-C1/views (store-level reindex); Q2-C1 (parser-skip mirrors the CHECK-vocab pattern); per-edge confidence (feeds Q4-C1).

## Key distinction (for synthesis)
**edge-bitemporal-lifecycle is EDGE-granularity versioning + relabel-revision** — neither Q1-C1 (store-level reindex) nor Q1-C2 (node rename) provide it. Pairs with cascade-guard (caps its revision rate). Open: should 1.0-confidence structural edges (CONTAINS/IMPORTS) stay replace-in-place while only heuristic edges (TESTED_BY/CALLS) get versioning?

## Next Focus
edge-bitemporal-lifecycle + cascade-guard + closed-vocab CHECK are a coherent edge-governance cluster; the per-row crypto-signing is flagged over-engineering for a local single-writer code graph. Feeds Round C.
