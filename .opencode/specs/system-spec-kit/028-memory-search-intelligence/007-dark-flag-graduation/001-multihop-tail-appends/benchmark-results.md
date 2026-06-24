---
title: "Benchmark Results: Multi-Hop Tail-Appends"
description: "Benchmarks SPECKIT_DETERMINISTIC_MULTIHOP and SPECKIT_LANE_CHAMPION_BACKFILL on the production search path. completeRecall@K for K of 3, 5 and 8 is byte-identical with the append flags off and on (prod recall 0.4375 at every K, delta 0, zero run-to-run variance) because the append stages never run on the prod executePipeline path. The prod path returns the full requested limit of ten, so the documented three-result floor is a never-cut-below-three minimum not a cap, and the real prod-limiting stage is token-budget truncation which trims the legacy path to three and strips every appended row. Verdict REFINE: the features are sound and byte-identical-when-off but unreachable as wired, the refinement that would reach the prod reader touches shared pipeline code and is designed for a follow-up."
trigger_phrases:
  - "multihop tail appends benchmark"
  - "tail append recall verdict"
  - "three result floor is not a cap"
  - "token budget truncation strips appends"
importance_tier: "important"
contextType: "general"
---
# Benchmark Results: Multi-Hop Tail-Appends

## Question
Two finished features ship dark behind default-off flags. `SPECKIT_DETERMINISTIC_MULTIHOP` appends a hub doc's cross-referenced sibling spec.md docs to the result tail with no LLM and no re-embedding. `SPECKIT_LANE_CHAMPION_BACKFILL` appends each base lane's top candidate that missed the fused top-K into empty tail slots with no new query. Do they lift multi-target recall on the PRODUCTION path, and is the documented three-result-floor blocker real? The `ENV_REFERENCE` holds them off because "the prod default route truncates to a 3-result floor, so a tail-additive append never reaches the prod reader." The packet's `005-spec-data-quality/benchmark-and-test-status.md` says the opposite, that `DEFAULT_MIN_RESULTS = 3` is a never-cut-below-three floor not a cap and the real prod-limiting stage is token-budget truncation.

## Method
- **Metric:** completeRecall@K = the fraction of a query's labeled target spec.md ids present in the top-K results, for K of 3, 5 and 8. A target set spans the sibling and cross-referenced spec folders the hub doc names in its own prose, which is exactly the recall the multi-hop append claims to extend.
- **Query set:** 8 labeled multi-target queries, each targeting a hub spec doc that cross-references sibling folders. The targets resolve to 24 indexed spec.md ids across the 8 queries, re-resolved against the corpus each run so a stale label is reported not scored.
- **Corpus:** a read-only backup of the live memory database (17605 rows) and its active vector shard, embedder `nomic-embed-text-v1.5` (768-dim). No reindex, no write to the live database.
- **Two production paths.** The `prod` path is `executePipeline`, the function the live `memory_search` MCP handler calls. The `legacy` path is `searchWithFallback`, the older entry point that actually runs the append stages C3 and C4 inside `enrichFusedResults`. Both requested the prod default limit of ten. Each measurement repeated three times.
- **Flag postures:** both append flags off, then both on. The prod path output ids were compared off vs on for byte-identity.

## Results: the prod path is unchanged because the appends never run there

| Metric | appends OFF | appends ON |
|--------|-------------|------------|
| prod completeRecall@3 | 0.4375 | **0.4375** |
| prod completeRecall@5 | 0.4375 | **0.4375** |
| prod completeRecall@8 | 0.4375 | **0.4375** |
| prod recall delta (on minus off), every K | | **0.000** |
| prod result ids byte-identical off vs on | | **true** |
| prod append-stage ever applied | | **false** |
| run-to-run stdev, every cell | | **0.000** |

The prod recall is identical off vs on at every K, with zero run-to-run variance. The prod path append-stage metadata is absent: `executePipeline` carries no `multihop` or `laneChampionBackfill` key on its Stage-3 metadata at all, because those stages live in `enrichFusedResults` and the pipeline's Stage-1 `collectRawCandidates` runs the fusion plan with `stopAfterFusion`, which returns the fused set without entering `enrichFusedResults`. Flipping the flags is a no-op on the production path.

### The legacy path runs the appends and token-budget truncation strips them

| Metric | appends OFF | appends ON |
|--------|-------------|------------|
| legacy completeRecall@3 (and @5, @8) | 0.15625 | **0.15625** |
| legacy result count, every query | 3 | **3** |
| legacy appended rows surviving to the reader, total across 8 queries | | **0** |

The legacy `searchWithFallback` path does run the append stages, but it overflows the token budget on every labeled query and truncates to the three-result floor. A tail-appended row is scored below every baseline hit, so it is the first cut. Zero appended rows survived across all 8 queries, so even on the path where the appends execute the reader never sees one. The legacy recall is lower than the prod recall (0.15625 vs 0.4375) precisely because the legacy path returns three results while the prod path returns ten.

### Per-query (prod path, limit 10, identical off vs on)
| query | targets | recall@3 | recall@5 | recall@8 | prod count | legacy count | legacy appends survived |
|-------|---------|----------|----------|----------|------------|--------------|-------------------------|
| speckit-memory-foundation | 4 | 0.25 | 0.25 | 0.25 | 10 | 3 | 0 |
| spec-data-quality-program | 4 | 0.25 | 0.25 | 0.25 | 10 | 3 | 0 |
| local-embeddings-foundation | 4 | 0.75 | 0.75 | 0.75 | 10 | 3 | 0 |
| spec-memory-stack-adapter | 1 | 1.00 | 1.00 | 1.00 | 10 | 3 | 0 |
| memory-store-and-search | 1 | 0.00 | 0.00 | 0.00 | 10 | 3 | 0 |
| memory-leak-remediation | 4 | 0.75 | 0.75 | 0.75 | 10 | 3 | 0 |
| hybrid-rag-fusion-epic | 2 | 0.50 | 0.50 | 0.50 | 10 | 3 | 0 |
| compact-code-graph-hooks | 4 | 0.00 | 0.00 | 0.00 | 10 | 3 | 0 |

Recall is identical across K of 3, 5 and 8 on the prod path because the appends never run, so the result set is the same ten fused docs and a present target sits at its fused rank rather than being lifted by an append.

## The floor-blocker question, resolved with data

**The documented blocker is a myth in its stated form, and the appends genuinely never reach the reader, for two real reasons the data separates.**

1. **The three-result floor is NOT a cap.** The prod `executePipeline` path returned the full requested limit of ten on every query (prod count 10 across all 8). The `DEFAULT_MIN_RESULTS = 3` is the never-cut-below-three minimum the token-budget truncation floors against (`Math.max(1, Math.min(limit, 3))`), not a top-three window. The 005 status spine is correct.

2. **The real prod blocker is structural, not truncation.** On the actual production path the appends never run at all, because Stage-1 `collectRawCandidates` sets `stopAfterFusion` and the append stages live in the `enrichFusedResults` branch that flag skips. So the flags are byte-identical on prod (delta 0, prodByteIdenticalOnVsOff true) and the append-stage metadata is absent.

3. **Token-budget truncation is the secondary blocker, on the path where the appends do run.** The legacy `searchWithFallback` path runs the append stages but overflows the token budget on every query and truncates to the three-result floor, stripping every appended tail row (surviving-append count 0). This confirms the 005 claim that token-budget truncation, not a hard top-three window, is the prod-limiting stage.

## Verdict: REFINE

The two features are sound and byte-identical when off, but they are unreachable as wired. They are dead code on the production `executePipeline` path because `stopAfterFusion` skips the branch they live in, and they are stripped by token-budget truncation on the legacy path where they do run. No measured recall win survives the prod path because the appends never execute there. This is not a CUT, because the features are not measured-and-lost, they are measured-and-unreached: the recall opportunity they target is real (the multi-target queries do under-recall, prod recall 0.4375 leaves siblings unrecalled), and a structural change inside the flag's reach would expose them to measurement.

**The named refinement, designed and left for a follow-up.** To make the appends reach the prod reader, the append stages must move from the legacy `enrichFusedResults` branch into the pipeline's Stage-3 rerank, positioned ahead of the token-budget truncation, and the appended tail rows must be exempted from token-budget truncation or carried through progressive disclosure so a relevant sibling is not cut for being cheap-to-defer. That change touches shared pipeline code (`stage3-rerank.ts`, the truncation stage in `hybrid-search.ts`) outside this phase's write scope, so it is designed here and left for a follow-up rather than implemented in this benchmark pass. Until that change lands, flipping either flag is a confirmed no-op on the production path, so neither flag should graduate.

## Reproduce
`node scripts/multihop-tail-appends-benchmark.mjs` rebuilds `results/metrics.json` from a read-only backup of the live corpus, exit 0. The harness flips only the two append flags, reads the corpus read-only, and writes no production file.
