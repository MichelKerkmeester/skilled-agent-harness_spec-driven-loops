# Iteration 13: Round E Verify+Feasibility — Code Graph Edge-Governance Cluster

## Focus
Round E verify+feasibility for the iter-9 edge-governance cluster (not covered by Round C's bi-temporal/CRDT scope). Read-only.

## Assessments (newInfoRatio 0.75)
| Candidate | Real | Feasibility | Note |
|---|---|---|---|
| CG-edge-bitemporal-lifecycle | REAL | **NO-GO** | edges rebuilt every scan (DELETE-by-source + re-INSERT, replaceEdges:985); bi-temporal "never-delete+supersede" fights the core model; tombstones (:247-260) already record edge history — duplicates it |
| CG-audit-subgraph | PARTIAL | CAUTION | precursor exists (code_graph_tombstones queryable by kind/reason/time) — extend it, NOT a new table; but default-OFF + pruned-to-100, not durable, deletions-only |
| CG-cascade-guard | REAL | CAUTION | per-run cap is a clean additive guard at the 2 heuristic write sites; per-pair churn needs cross-scan edge identity the rebuild model lacks (couples to history); integrate with existing edge-drift.ts |
| CG-closed-vocab-check | REAL | **GO** | lowest-blast: edge_type has no CHECK (vs parser_skip CHECK :205); mirror it with the 10 known types; needs a table-rebuild migration (SQLite can't ALTER-ADD-CHECK) + schema_version bump + clean-edge-type pre-verify |

## Key correction
**edge-bitemporal-lifecycle is NO-GO** — the per-scan rebuild model is fundamentally incompatible with never-delete edge versioning, and the tombstone system already covers edge deletion-history. Only **closed-vocab-CHECK is a clean GO**; audit-subgraph should EXTEND the existing tombstone precursor.

## Next Focus
Code Graph edge-governance: only closed-vocab-CHECK ships cleanly; edge-versioning collides with the rebuild model. Feeds synthesis (de-scope edge-bitemporal-lifecycle).
