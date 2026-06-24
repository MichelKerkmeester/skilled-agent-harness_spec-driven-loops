# 007 Dark Flag Graduation: Benchmark and Test Status

Single-pane record for the dark-flag-graduation suite. One row per child benchmark phase. This is a supplementary record, not a canonical spec doc.

> **STATUS: COMPLETE.** All eight benchmark phases ran against the real corpus or graph on the production path and returned verdicts. No production default was flipped inside this program. Each graduate or refine recommendation is evidence for a separate flip decision, not the flip itself.

## The truncation-law finding, resolved

The 001 benchmark settled the long-standing question. The documented claim that the search appends are held off because the production route truncates to a three-result floor is a **myth in its stated form**. The data shows three facts. First, `DEFAULT_MIN_RESULTS = 3` is a never-cut-below-three minimum, not a cap, and the production path returns the full requested limit of ten. Second, the real reason the appends never reach the reader on the production path is structural, not budgetary: Stage-1 sets `stopAfterFusion`, which skips the enrich branch where the append stages live, so flipping the flags is a confirmed no-op on prod. Third, on the legacy path where the appends do run, token-budget truncation strips the below-baseline appended rows first. The recall opportunity is real (multi-target queries under-recall at 0.4375), so the fix is a structural rewire, not a result-budget change.

## Benchmark and verdict table

| Phase | Dark flag(s) | Benchmark result | Verdict |
|-------|--------------|------------------|---------|
| 001 multihop-tail-appends | `SPECKIT_DETERMINISTIC_MULTIHOP`, `SPECKIT_LANE_CHAMPION_BACKFILL` | completeRecall@K 0.4375 off and on (delta 0.000), appends never execute on the prod path (stopAfterFusion), truncation-myth busted, byte-identical off | **REFINE** rewire the appends into Stage-3 ahead of token-budget truncation |
| 002 retrieval-class-weights | `SPECKIT_RETRIEVAL_CLASS_ROUTING` | single-hop precision@1 0.90 to 0.80 (delta -0.10), multi-hop recall 0.75 unchanged, suppression hurts and the cost it guards does not exist | **CUT** unless made density-aware |
| 003 true-citation-ledger | `SPECKIT_TRUE_CITATION_EMITTER` | emit pipe proven separable, but 0 of 1711 shown rows carry a session id, reference detector 7.24% (mostly id-vs-prose collisions), live ledger density zero | **REFINE** plumb sessionId into the shown write and re-anchor the reference key |
| 004 save-reconsolidation | `SPECKIT_RECONSOLIDATION_ENABLED` | merge precision 0.017 (32 true dupes vs 1816 distinct false positives), no threshold rescues it, gate machinery sound 12/12 | **CUT** replace cosine-band with a content-hash exact-dup merge |
| 005 codegraph-seeded-ppr | `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` | PPR ties the flat walk on every metric at every K (deltas 0.0), no damping beats it, uniform-weight CALLS edges give centrality nothing to differentiate, flag already removed in source | **CUT** confirmed by measurement |
| 006 codegraph-edge-lifecycle | staleness `REVERSE_DEP_FORCE_PARSE`, `EDGE_BITEMPORAL_READS`, `EDGE_GOVERNANCE_VOCAB` | staleness rebind-correct 3/3 (cost unmeasured), bitemporal schema sound but 0 edges carry invalid_at and the reader has no caller, governance guards nothing the type system does not already reject | **REFINE** staleness (degree-cap) · **REFINE** bitemporal (needs a close-and-insert writer) · **CUT** governance |
| 007 advisor-rrf-fusion | `SPECKIT_ADVISOR_RRF_FUSION`, conflict-rerank, `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD` | RRF top-1 28/33 to 29/33 (+1, zero regressions, 0.97 agreement, deterministic), self-guard inert and conflict seam dormant (no conflicts_with edges in the corpus) | **REFINE** widen the labeled set and seed conflict data |
| 008 deeploop-finding-dedup | `SPECKIT_FANOUT_NEAR_DUP_DEDUP`, lag-ceiling, progress-heartbeat | dedup precision 1.0 and distinct-finding recall 1.0 (0 false collapses, 7/17 noise removed, strongest severity kept), lag fires one warning, heartbeat 43 steady records, all byte-identical off | **GRADUATE** all three |

## Graduation roadmap

- **Graduate now (1 cluster, 3 flags):** the deep-loop finding dedup and the lag and heartbeat gauges. Clean wins, byte-identical off.
- **Refine then re-bench (4 clusters):** the multi-hop appends (structural rewire), the true-citation ledger (sessionId plus reference key), the code-graph staleness repair (degree cap) and bitemporal reads (a writer), and the advisor RRF core (wider set plus conflict data).
- **Cut (4 flags):** the retrieval-class weights, save reconsolidation (the cosine band, not the idea), the seeded PageRank, and the edge governance vocab.
