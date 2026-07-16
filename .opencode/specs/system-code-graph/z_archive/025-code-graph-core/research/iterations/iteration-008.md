# Iteration 8: External Mining — aionforge graph-signals.md + crdt-model.md → Code Graph

## Focus
Round B external mining: two unread aionforge docs (graph-signals, crdt-model) for NET-NEW Code Graph candidates beyond Q1-Q8/det-order. Read-only; proposals only.

## Actions Taken
1. Read aionforge `docs/graph-signals.md` + `docs/crdt-model.md`.
2. Confirmed internal seams: `code-graph-db.ts:921 replaceNodes`/`:972 replaceEdges` (destructive per-file replace), `:276` tombstone prune (`ORDER BY deleted_at DESC, id DESC` = arrival-order), `code-graph-context.ts:512 expandAnchor` (1-hop DIRECTED BFS), `seed-resolver.ts:187` (lexical only, no dense), `compact-merger.ts:81` (priority dedup, not rank fusion).

## Findings — NET-NEW candidates (9; rich CRDT + graph-signals surface, newInfoRatio 0.62)
| Candidate | Seam | Lev/Eff | Class | Conf |
|---|---|---|---|---|
| crdt-order-independent-reindex-merge (resolved state = fn of the SET of assertions, not arrival order) | code-graph-db.ts:921,972 | H/L | BUILD | CONFIRMED |
| orset-dedup-key-distinct-from-content-id ((subj,pred,obj) add-tag dedup key; re-assert reuses node) | code-graph-db.ts:921,934 | H/M | BUILD | CONFIRMED |
| derived-logical-clock-supersession-winner (K1=(valid_from DESC,obj ASC); no stored counter/rowid) | code-graph-db.ts:276 | M/M | FIX | CONFIRMED |
| mv-register-contested-symbol-preservation (keep both conflicting defs; CONTRADICTS edge; quarantine low-trust) | GAP (cross-file-edge-resolver) | M/L | BUILD | INFERRED |
| convergence-property-test-reordered-scan (replay randomized arrival orders → identical recall + node count) | tests/code-graph-scan.vitest.ts | M/M | BUILD | INFERRED |
| class-gated-graph-expansion-router (run PPR/expansion ONLY for MultiHop/Entity; off for SingleHop precision) | code-graph-context.ts:19 | H/M | BUILD | CONFIRMED |
| undirected-projection-for-associative-reach (PPR undirected so seed mass reaches callers, not a sink) | code-graph-context.ts:512 | M/S | BUILD | CONFIRMED |
| lexical-plus-vector-union-seed-with-degrade (BM25 seeds UNION vector seeds; lexical keeps expansion alive embedder-down) | seed-resolver.ts:187 | M/M | BUILD | CONFIRMED |
| reciprocal-rank-fusion-position-only (fuse by list POSITION not raw score; PPR-score vs cosine combine w/o normalization) | compact-merger.ts:81 | M/S | PROMOTE | CONFIRMED |

**Already covered:** Q1-C1 overlaps OR-set retire-not-delete; Q1-C2 overlaps SUPERSEDED_BY; Q3-C1 (PPR) is the base the class-gate/undirected/seed-union REFINE (Q3-C1 lacked the precision gate); Q4-C1 = the recomputable-LWW-stat case; Q8 likely home of reciprocal-rank-fusion-position-only.

## Questions Answered
- Net-new Code Graph surface in graph-signals/CRDT? SUBSTANTIAL (0.62). The biggest: **class-gated-graph-expansion-router** closes the precision-gate gap Q3-C1 left open; **CRDT order-independent reindex** + OR-set dedup attack the destructive `replaceNodes` churn; undirected-projection corrects a directed-PPR under-reach.

## Questions Remaining
- Does Q8's fuser adapter do position-based RRF or score-normalized (decides PROMOTE vs BUILD for RRF-position)? Is the reindex path ever run multi-worker (latent-bug vs future-proof for CRDT-merge)? Does cross-file-edge-resolver pick-one or error on ambiguous (confirms mv-register gap)?

## Next Focus
Strong yield. The class-gate + undirected + seed-union trio REFINES Q3-C1 into a precision-safe PPR; the CRDT cluster (order-independent merge + OR-set + derived-clock) targets reindex determinism. Feeds Round C feasibility (shared txn cluster).
