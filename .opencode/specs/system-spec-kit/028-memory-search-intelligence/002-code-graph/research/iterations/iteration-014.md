# Iteration 14: Round E Verify+Feasibility — Code Graph Graph-Signals/Retrieval (Q3-C1 PPR is UNBUILT)

## Focus
Round E verify+feasibility for the iter-8 graph-signals cluster that refines roadmap Q3-C1 (PPR). Read-only.

## Assessments (newInfoRatio 0.75)
| Candidate | Real | Feasibility | Note |
|---|---|---|---|
| CG-class-gated-expansion | PARTIAL | CAUTION | a gate signal exists only as user-supplied `queryMode`; the intent classifier is **structural-only** (query-intent-classifier.ts:6 — NO SingleHop/MultiHop/Entity taxonomy); **and the PPR it would gate is UNBUILT** (grep PPR/PageRank/random-walk = empty) |
| CG-undirected-projection | PARTIAL | NEEDS-BENCHMARK | directionality seam is real (impact is reverse-only by design; neighborhood already bidirectional 1-hop) but there is **NO PPR projection to make undirected** — the sink concern is a property of an unbuilt feature |
| CG-lexical-vector-seed-union | PARTIAL | **NO-GO** | lexical half exists (but disabled fallback, default-off); the VECTOR half does NOT exist — the module explicitly DISOWNED its semantic backend (query-intent-classifier.ts:85-88, structural-only scope) |
| CG-orset-dedup-key | REAL | NEEDS-BENCHMARK | destructive replaceNodes churn is real, BUT file-level `content_hash` skip (code-graph-db.ts:1048-1098) ALREADY short-circuits unchanged files, so an OR-Set CRDT only buys intra-changed-file triple stability — a narrow win at high blast |

## Key correction (major)
**Q3-C1's PPR is UNBUILT** (grep empty) — so class-gated-expansion + undirected-projection **refine a non-existent feature**. AND the code-graph **deliberately disowned its vector/semantic backend** (structural-only scope), making seed-union a scope-violation, not a gap. AND file-level content_hash already gives most of the CRDT idempotency. This substantially deflates the iter-8 graph-signals optimism: these candidates presuppose machinery (PPR, vector seeds) the code-graph chose NOT to have.

## Next Focus
Code Graph graph-signals cluster largely presupposes UNBUILT/disowned machinery (PPR + vector backend). The class-gate/undirected/seed-union candidates are contingent on first building Q3-C1's PPR (which itself is unbuilt). De-scope in synthesis; only orset (narrow) has a partial real seam. Feeds synthesis.
