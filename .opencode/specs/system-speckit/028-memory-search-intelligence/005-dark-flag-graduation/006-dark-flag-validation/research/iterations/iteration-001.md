# Iteration 001: Identify GRADUATE Winners

## Focus
Identify which dark flags from the 005-dark-flag-graduation suite returned GRADUATE verdicts, and read the benchmark evidence for each.

## Findings

### GRADUATE Winners (4 clusters, 9 flags)

#### 1. 001-MULTIHOP-TAIL-APPENDS → GRADUATE (deep-K only)
**Flags:** `SPECKIT_DETERMINISTIC_MULTIHOP`, `SPECKIT_LANE_CHAMPION_BACKFILL`
**Metric:** completeRecall@20 improved from 0.5625 → 0.9375 (+0.375, zero variance)
**Limitation:** Only at deep K (12, 20); shallow K (3, 5, 8) unchanged at 0.4375 — tail appends sit beyond the top-10 window
**Prod path:** Yes, via `executePipeline` with production default limit
**Test set:** 8 labeled queries, 24 resolved target spec.md IDs, one corpus snapshot
**Key fix:** Post-fusion tail-append stage added after the stage-4 cap, so appends extend capped baseline results

#### 2. 006-CODEGRAPH-EDGE-LIFECYCLE → 2 sub-GRADUATE + 1 CUT
**a) Staleness repair → GRADUATE:** `SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE`, `SPECKIT_CODE_GRAPH_REVERSE_DEP_DEGREE_CAP`
- Correctness: 3/3 rebinds across rename/type-flip/move scenarios
- Cost: Hot importer of 30 deps reduced from 30 forced re-parses to 0; incremental scan from 37ms → 21ms
- Prod path: Yes, via `dist/handlers/scan.js` + `dist/lib/code-graph-db.js`
- Cost data from synthetic fixture, not live graph

**b) Bitemporal reads → GRADUATE:** `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS`
- Verification queries passed: as-of-time reads return old target, current reads return new target
- Consumer built and benchmarked, but NOT YET connected to the re-index edge-replacement path
- Small wiring change still behind flag

#### 3. 007-ADVISOR-RRF-FUSION → GRADUATE
**Flags:** `SPECKIT_ADVISOR_RRF_FUSION` + conflict-rerank seam
**Metric:** Top-1 correctness from 37/42 (0.8810) → 38/42 (0.9048) — +1 prompt, zero regressions
**Precision band:** 0.8667 → 0.9333; **Conflict band:** 4/5 → 5/5 correct
**Prod path:** Yes, via `scoreAdvisorPrompt` + `loadAdvisorProjection` on live projection copy
**Test set:** 42 broad prompts with in-memory conflict overlay
**Limitation:** Conflict seam benchmarked against synthetic edges only — live corpus carries zero `conflicts_with` edges

#### 4. 008-DEEPLOOP-FINDING-DEDUP → GRADUATE (all 3)
**Flags:** `SPECKIT_FANOUT_NEAR_DUP_DEDUP`, lag ceiling, progress heartbeat
**Dedup precision:** 1.00; **Distinct recall:** 1.00; **Noise reduction:** 7 of 17 source records removed
**Prod path:** Yes, via `mergeResearchRegistries` / `mergeReviewRegistries` + `fanout-run.cjs` CLI
**Limitation:** Synthetic labeled set, not captured production runs; heartbeat cadence not chosen; lag-ceiling threshold depends on deployment timeout budget

### REFINE (1 flag)
- **003 True-Citation Ledger:** Code fixed, signal reasonable, but live density remains zero due to traffic backlog. Anchor-based detector improved reference coverage from 0.0724 → 0.1579 on 13417 real assistants.

### CUT (5 flags)
- 002 Retrieval class routing: precision@1 dropped 0.90→0.80
- 004 Save reconsolidation: merge precision 0.017 (56 false positives per correct one)
- 005 Code-graph seeded PPR: Δ=0.0 across all metrics vs flat walk
- 006 Edge governance vocab: zero violators, flag guards nothing
- 007 Self-recommendation guard: moved zero top-1s, structurally redundant

### Sources
[SOURCE: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-dark-flag-graduation/benchmark-and-test-status.md:15-22`]
[SOURCE: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-dark-flag-graduation/001-multihop-tail-appends/benchmark-results.md:67-69`]
[SOURCE: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-dark-flag-graduation/006-codegraph-edge-lifecycle/benchmark-results.md:71-84`]
[SOURCE: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-dark-flag-graduation/007-advisor-rrf-fusion/benchmark-results.md:97-102`]
[SOURCE: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-dark-flag-graduation/008-deeploop-finding-dedup/benchmark-results.md:72-78`]
[SOURCE: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/before-vs-after.md:157-169`]

## Novelty
- newInfoRatio: 0.95 — Nearly all information was new. Established the full verdict landscape (4 graduate, 1 refine, 5 cut) with per-flag metrics, margins, test sets, and prod-path coverage.
- Ruled out: 5 flags confirmed CUT, no further investigation needed for these.

## New Questions
- For each graduate: what does the implementation code actually change? Where does the flag guard live?
- What scenario classes did the 007 benchmark NOT test for each graduate?
- Where could each graduate be a no-op on the production path?
- Where could each graduate hurt (precision cost, latency, destructive operations)?

## Next Focus
Read the implementation code for the 4 GRADUATE clusters to understand exactly what each flag gates on the production path, then map tested vs untested scenario classes.
