# Iteration 16: Round G Completeness Critic — Code Graph (cross-file edge staleness gap)

## Focus
Round G completeness critic for CODE GRAPH: what did the WHOLE campaign MISS? Read-only.

## Missed items (newInfoRatio 0.48; RESIDUAL_CONFIDENCE 0.55)
| Item | Type | Lev | Evidence |
|---|---|---|---|
| **Cross-file edge staleness under incremental mtime-skip** — reindex skips read+parse for any file with unchanged mtime (`skipFreshFiles`, default ON); cross-file edges are derived ONLY from the parsed batch, so when dependency B changes but dependent A is untouched, A's outbound edges aren't re-derived → `pruneDanglingEdges` deletes the now-dangling A→B → the relationship **silently vanishes** until A itself changes. Q1-C2 (SUPERSEDES) fixes a symbol's own rename, NOT orphaned inbound edges from unchanged dependents. NO campaign candidate addresses this | internal-gap | **H** | structural-indexer.ts:2171-2177 (mtime skip), :2199/:2045 (cross-file edges from batch only); code-graph-db.ts:1027/1031 (prune) |
| RRF never surfaced as the trust-COMBINATION mechanism — Q4-C1 chose multiplicative `structuralWeight × reliability` (requires comparable scales, can demote); RRF is scale-free by construction (position not raw score) | unread-external | H | graph-signals.md:14; research.md:9 (Q4-C1 multiplicative) |
| Additive-never-replacement expansion lesson un-weighed — graph-signals' second signal ADDS associative weight without narrowing the dense pass ("evidence AND precision floor, not a trade"); Q4-C1's multiplicative factor trades the precision floor | unread-external | M | graph-signals.md:71-73 |
| research.md is a 35-line STUB (Candidate Catalog is an empty heading) — verdicts live in findings-registry.json + iterations, not the synthesis artifact | unverified-claim | M | research.md EOF at line 35 |
| within-batch relative score_band for impact (results hardcode score=null today) never proposed; cheaper than the Q4-C1 multiplier | unread-external | L | data-model.md:294; code-graph-context.ts score=null |

## Key correction
A genuine **NEW high-leverage internal gap**: cross-file edge staleness under mtime-skip (a renamed dependency silently orphans an unchanged dependent's edge) — no candidate covered it; it is the code-graph analog of aionforge's "over-segmentation, no merge-repair." Also: RRF (scale-free) is a better trust-combination than Q4-C1's multiplicative re-rank. research.md is a stub.

## Next Focus
NEW candidate for synthesis: **CG-incremental-edge-staleness-repair** (re-derive inbound edges to changed symbols, or mark dependents stale on dependency change). Reconsider Q4-C1 multiplicative vs RRF-additive. Feeds the roadmap addendum + the research.md-stub flag.
