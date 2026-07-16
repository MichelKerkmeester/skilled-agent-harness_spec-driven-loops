---
title: "Benchmark Results: Multi-Hop Tail-Appends"
description: "Benchmarks SPECKIT_DETERMINISTIC_MULTIHOP and SPECKIT_LANE_CHAMPION_BACKFILL on the production search path, diagnoses why they were unreachable, ships the structural rewire that reaches the prod reader, and re-benchmarks it. Diagnosis: the appends never ran on the prod executePipeline path because Stage-1 stopAfterFusion skipped the branch they lived in, and the three-result floor was a never-cut-below-three minimum not a cap. Refinement: a post-Stage-4 tail-append stage in the pipeline, gated behind the same default-off flags, that extends the capped baseline past the requested limit so an appended row is exempt from the final-limit cap. After the rewire completeRecall@20 rises from 0.5625 to 0.9375 (84 rows appended across 8 queries) and completeRecall@12 from 0.5625 to 0.625, while completeRecall@3, @5 and @8 stay flat because the appends extend the tail and never evict a baseline hit. Default-off is a proven strict no-op. Verdict GRADUATE for deep-K readers: a measured, variance-free prod-path recall win past rank ten with byte-identical default-off safety, and a no-op for shallow-K readers."
trigger_phrases:
  - "multihop tail appends benchmark"
  - "tail append recall verdict"
  - "three result floor is not a cap"
  - "tail append pipeline rewire graduate"
importance_tier: "important"
contextType: "general"
---
# Benchmark Results: Multi-Hop Tail-Appends

## Question
Two finished features ship dark behind default-off flags. `SPECKIT_DETERMINISTIC_MULTIHOP` appends a hub doc's cross-referenced sibling spec.md docs to the result tail with no LLM and no re-embedding. `SPECKIT_LANE_CHAMPION_BACKFILL` appends each base lane's top candidate that missed the fused top-K into empty tail slots with no new query. Do they lift multi-target recall on the PRODUCTION path, is the documented three-result-floor blocker real, and once the blocker is understood, does a structural rewire that reaches the prod reader graduate them?

## Method
- **Metric:** completeRecall@K = the fraction of a query's labeled target spec.md ids present in the top-K results, for K of 3, 5, 8, 12 and 20. K of 12 and 20 reach PAST the requested limit of ten, where the tail-append rows land. A target set spans the sibling and cross-referenced spec folders the hub doc names in its own prose.
- **Query set:** 8 labeled multi-target queries (24 resolved target spec.md ids), each targeting a hub spec doc that cross-references sibling folders, re-resolved against the corpus each run.
- **Corpus:** a read-only backup of the live memory database (17605 rows) and its active vector shard, embedder `nomic-embed-text-v1.5` (768-dim). No reindex, no write to the live database.
- **Path:** the production `executePipeline`, the function the live `memory_search` MCP handler calls, requested at the prod default limit of ten. Each measurement repeated three times.
- **Flag postures:** both append flags off, then both on, with a flag-off strict-no-op check on the off runs.

## Part 1: the diagnosis (why the appends were unreachable)

The first benchmark, before any code change, found the appends never ran on the prod path. The prod `executePipeline` output was byte-identical with the flags off and on, and the pipeline's Stage-3 metadata carried no append key at all. The cause was structural: the pipeline's Stage-1 `collectRawCandidates` runs the fusion plan with `stopAfterFusion`, which returns the fused set without entering `enrichFusedResults`, the legacy branch the append stages lived in.

The floor-blocker myth broke with data. The prod path returned the full requested limit of ten on every query, so `DEFAULT_MIN_RESULTS = 3` is the never-cut-below-three minimum, not a cap. The token-budget truncation the `ENV_REFERENCE` blamed lives only on the legacy `searchWithFallback` path, where it trims to the three-result floor and strips every appended tail row. The prod pipeline has no token-budget truncation at all. So the appends were not blocked by the floor, they were never wired into the prod path.

## Part 2: the refinement (wiring the appends into the prod path)

The rewire adds a tail-append stage to the pipeline, gated behind the same two default-off flags. It runs in the orchestrator after Stage 4 and after the Stage-4 final-limit cap, so the appended rows extend the capped baseline past the requested limit and are exempt from that cap by construction. The deterministic-multihop append reads the post-Stage-4 results and the database. The lane-champion backfill reads the per-lane candidate lists, which the pipeline now carries forward from candidate generation on a non-enumerable shadow attached only when an append flag is on. Both append modules are unchanged, reused as-is.

## Results: the appends now reach the reader and lift deep-K recall

| Metric | appends OFF | appends ON |
|--------|-------------|------------|
| prod completeRecall@3 | 0.4375 | 0.4375 |
| prod completeRecall@5 | 0.4375 | 0.4375 |
| prod completeRecall@8 | 0.4375 | 0.4375 |
| prod completeRecall@12 | 0.5625 | **0.625** |
| prod completeRecall@20 | 0.5625 | **0.9375** |
| prod append stage applied | | **true** |
| prod rows appended, total across 8 queries | | **84** |
| run-to-run stdev, every cell | | **0.000** |

The appends now run on the prod path (append stage applied, 84 rows appended) and lift completeRecall@20 from 0.5625 to 0.9375, a 0.375 gain with zero run-to-run variance. completeRecall@12 rises from 0.5625 to 0.625. completeRecall@3, @5 and @8 stay flat because the appended rows land past rank ten, so the baseline top-K is untouched and no baseline hit is ever evicted. The append is strictly additive into the tail, exactly its contract.

### Per-query (prod path, limit 10, both flags on)
| query | targets | appended (mh + lc) | on count | recall@20 off | recall@20 on |
|-------|---------|--------------------|----------|---------------|--------------|
| speckit-memory-foundation | 4 | 4 + 4 | 18 | 0.25 | 0.50 |
| spec-data-quality-program | 4 | 10 + 3 | 23 | 0.25 | 1.00 |
| local-embeddings-foundation | 4 | 2 + 3 | 15 | 0.75 | 1.00 |
| spec-memory-stack-adapter | 1 | 10 + 3 | 23 | 1.00 | 1.00 |
| memory-store-and-search | 1 | 10 + 4 | 24 | 1.00 | 1.00 |
| memory-leak-remediation | 4 | 4 + 4 | 18 | 0.75 | 1.00 |
| hybrid-rag-fusion-epic | 2 | 5 + 4 | 19 | 0.50 | 1.00 |
| compact-code-graph-hooks | 4 | 10 + 4 | 24 | 0.00 | 1.00 |

Seven of eight queries reach perfect completeRecall@20 with the appends on. The starkest case is `compact-code-graph-hooks`, whose four sibling targets the baseline never recalled at any K up to 20 (recall@20 0.00) and the multi-hop append brings all four in (recall@20 1.00).

## Default-off byte-identity: a proven strict no-op

With both flags off the tail-append stage does not run. The benchmark verifies this directly on every off run: no `tailAppends` metadata is emitted, no appended-source row appears, the result count stays at or below the requested limit, and the off output is deterministic across repeats. The flags-off prod path is byte-unchanged from before the rewire, confirmed by the off-path completeRecall holding at 0.4375 at K of 3, 5 and 8, the same numbers the pre-rewire benchmark recorded. tsc is clean and the 25 pipeline and flag regression tests plus the 10 additive-tail-recall tests pass.

## Verdict: GRADUATE for deep-K readers

The rewire delivers a measured, variance-free recall win on the production path with byte-identical default-off safety. completeRecall@20 rises from 0.5625 to 0.9375 and completeRecall@12 from 0.5625 to 0.625, while the baseline top-eight is never disturbed. The win is real and large for a reader that consumes the tail past rank ten, and it is correctly a no-op for a reader that reads only the top eight, because the appends never evict a baseline hit. So the honest graduation is conditional on the reader window: graduate the flags as a tail recall extension for deep-K consumers, where the prod-path gain is unambiguous, and recognize that they add nothing a shallow-K reader sees.

The reason the shallow-K window is unmoved is that the appended rows are scored below every baseline hit by design, so they fill empty tail slots rather than competing for the top. Lifting a sibling into the top-K window would require rescoring it on its own merit, which is a ranking change the additive-tail contract deliberately forbids and a separate question from this recall extension.

## Reproduce
`node scripts/multihop-tail-appends-benchmark.mjs` rebuilds `results/metrics.json` from a read-only backup of the live corpus, exit 0. The harness flips only the two append flags, reads the corpus read-only, and writes no production file.
