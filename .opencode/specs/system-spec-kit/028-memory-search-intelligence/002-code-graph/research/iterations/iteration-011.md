# Iteration 11: Round C Feasibility — Code Graph Bi-temporal/Determinism Cluster

## Focus
Round C feasibility + migration-risk for the Code Graph cluster that shares the `code-graph-db.ts` transaction boundary: Q6-C1, Q1-C1, Q1-C1-views, CG-edge-bitemporal-lifecycle, CG-crdt-order-independent-merge. Read-only.

## Feasibility verdicts (newInfoRatio 0.70)
| Candidate | Verdict | Blast | Key migration note |
|---|---|---|---|
| Q6-C1 generation watermark | **GO** (first/standalone) | low, reversible | purely additive metadata via existing `setMetadata` :559-567; bump inside each write txn; provides the monotonic close-out key the others need (today close-outs key on `new Date().toISOString()` — non-monotonic) |
| Q1-C1 columns | **CAUTION** (keystone) | med, reversible | ~20 internal + 5 external reads do `SELECT FROM code_nodes/edges` with NO `invalid_at IS NULL` filter; must land ATOMICALLY with views |
| Q1-C1-views (live chokepoint) | **CAUTION** (co-ships w/ Q1-C1) | med, reversible | repoint reads `FROM code_nodes`→`code_nodes_live`; only ≤6 files touch tables → grep proves completeness |
| CG-edge-bitemporal-lifecycle | **CAUTION** (after Q1-C1+views) | med, reversible | dangling-prune must re-express against LIVE node set; `deferDanglingTargetPrune :957-968` complexity transfers |
| CG-crdt-order-independent-merge | **NEEDS-BENCHMARK** (LAST) | high, reversible-by-rebuild | replaces resolver in-place `UPDATE SET target_id :91-95` with derive-from-assertion-set; re-derivation perf is the unknown |

## Sequencing (the cluster → a 4-step rollout)
**(1) Q6-C1 generation [GO standalone]** → **(2) Q1-C1 columns + Q1-C1-views as ONE atomic SCHEMA_VERSION 5→6 change** (the keystone — DELETE→close-out without repointing reads regresses every reader) → **(3) edge-bitemporal-lifecycle** (bulk edge DELETEs→close-outs) → **(4) CRDT-order-independent-merge** (resolver rewrite, gated on a benchmark). Reversibility backstop: code-graph.sqlite is a rebuildable cache (worst case = `code_graph_scan`, not data loss). All writers already transactional.

## Next Focus
The bi-temporal storage layer can ride ONE migration; behavioral changes cannot all ride one PR. Open: SCHEMA_VERSION consumer bump? resolver cardinality (sizes the CRDT benchmark)? tombstones (SPECKIT_CODE_GRAPH_TOMBSTONES) superseded by bitemporal close-out or coexist?
