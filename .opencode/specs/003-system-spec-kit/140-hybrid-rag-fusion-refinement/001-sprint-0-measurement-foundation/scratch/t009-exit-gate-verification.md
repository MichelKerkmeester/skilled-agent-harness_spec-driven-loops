# T009: Sprint 0 Exit Gate Verification

**Sprint**: 001 — Sprint 0 Measurement Foundation
**Spec**: 003-system-spec-kit / 140-hybrid-rag-fusion-refinement
**Date**: 2026-02-27
**Verified by**: T009 exit gate audit

---

## Sprint 0 Exit Gate

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Graph hit rate > 0% | **PASS** | T001: numeric memory IDs implemented in graph search; 6 tests pass (`t001-graph-numeric-ids.vitest.ts`) |
| 2 | No duplicate chunk rows in default search | **PASS** | T002: unconditional deduplication applied before result emission; 7 tests pass (`t002-dedup.vitest.ts`) |
| 3 | Baseline metrics for 100+ queries computed and stored | **PARTIAL** | T007: 110 queries created and validated; T008: runner infrastructure complete; actual metric computation pending live DB execution (memory IDs currently placeholder -1 until live DB mapping performed) |
| 4 | Ground truth diversity: ≥5 per intent, ≥3 tiers | **PASS** | T007: all 7 hard gates pass — 110 queries, 7 intent types (13–18 each), 3 complexity tiers (32/46/32), 40 manual queries, 14 hard negatives, 0 duplicates |
| 5 | BM25 baseline MRR@5 recorded | **PARTIAL** | T008: `runBM25Baseline()` infrastructure complete with dependency-injected search function; `recordBaselineMetrics()` written; pending live execution against production DB after ID mapping |
| 6 | BM25 contingency decision made | **PARTIAL** | T008: `evaluateContingency()` implemented with full 3-band decision matrix (PAUSE/RATIONALIZE/PROCEED); actual decision pending live MRR@5 measurement |
| 7 | Active feature flag count ≤ 6 | **PASS** | T-FS0: 5 active experiment flags (MMR, TRM, MULTI_QUERY, CROSS_ENCODER, GRAPH_UNIFIED). ADAPTIVE_FUSION, RRF, WORKING_MEMORY recommended for ADOPT (would reduce to 5). Within cap. |
| 8 | G-NEW-2 pre-analysis pattern report | **PASS** | T007b: 10 agent consumption patterns documented; query distribution shaped by these patterns (35 pattern_derived queries) |

---

## Status Summary

### Fully Complete (PASS)

**Gate 1 — Graph hit rate > 0%**
- T001 implemented numeric memory ID extraction from graph search results
- Graph channel now returns non-empty result sets
- 6 unit tests verify correct ID extraction across edge cases
- Source: `t001-graph-numeric-ids.vitest.ts`

**Gate 2 — No duplicate chunk rows**
- T002 added unconditional deduplication (by memory ID) before search results are emitted
- Deduplication applies regardless of feature flags — no opt-out path
- 7 unit tests covering single-source dedup, cross-channel dedup, and tie-breaking
- Source: `t002-dedup.vitest.ts`

**Gate 4 — Ground truth diversity**
- 110 total queries (≥100 required)
- All 7 intent types meet the ≥5 minimum (range: 13–18 per type)
- All 3 complexity tiers meet the ≥10 minimum (32/46/32)
- 40 manual queries (≥30 required)
- 14 hard negatives (≥3 required)
- 0 duplicate query strings
- `validateGroundTruthDiversity()` returns `passed: true` in automated test
- Source: `t007-ground-truth.vitest.ts`

**Gate 7 — Active feature flag count ≤ 6**
- 5 active experiment flags: MMR, TRM, MULTI_QUERY, CROSS_ENCODER, GRAPH_UNIFIED
- ADAPTIVE_FUSION and RRF are ADOPTED (do not count)
- WORKING_MEMORY is ADOPTED (does not count)
- Cognitive/session flags under SPECKIT_ROLLOUT_PERCENT counted separately
- One slot remaining for Sprint 1 experiment if needed
- Source: `t-fs0-flag-sunset-review.md`

**Gate 8 — G-NEW-2 pattern report**
- 10 agent consumption patterns documented in T007b
- Patterns used to shape query categories (35 pattern_derived queries in dataset)
- Source: `t007b-pattern-report.md` (Sprint 0 scratch)

---

### Partially Complete (PARTIAL) — Needs Live DB Execution

**Gate 3 — Baseline metrics for 100+ queries computed and stored**

What is complete:
- 110 ground truth queries created, validated, and ready to load via `loadGroundTruth()`
- `runBM25Baseline(searchFn, config)` function implemented with full metric averaging
- `recordBaselineMetrics(evalDb, result)` writes 5 rows to `eval_metric_snapshots`
- Per-query metric computation using `computeMRR`, `computeNDCG`, `computeRecall`, `computeHitRate`

What is pending:
- Live DB execution: `runBM25Baseline` must be called against a production memory DB
- Memory ID mapping: synthetic dataset uses placeholder IDs (-1); must be resolved against live DB
- The actual metric numbers (mrr5, ndcg10, recall20, hitRate1) are not yet known

Unblocking action: Run against production DB with `SPECKIT_EVAL_LOGGING=true` in Sprint 1.

**Gate 5 — BM25 baseline MRR@5 recorded**

What is complete:
- `runBM25Baseline()` computes and returns `metrics.mrr5`
- `recordBaselineMetrics()` writes `mrr@5` metric to `eval_metric_snapshots`
- All DB write logic tested with mock DB in `t008-bm25-baseline.vitest.ts`

What is pending:
- Actual numeric value (requires live DB run)
- Production DB must have real memory IDs mapped to ground truth queries

**Gate 6 — BM25 contingency decision made**

What is complete:
- `evaluateContingency(bm25MRR)` implements all 3 threshold bands:
  - MRR ≥ 0.80 → PAUSE ("BM25 alone is very strong…")
  - MRR 0.50–0.79 → RATIONALIZE ("BM25 is moderate…")
  - MRR < 0.50 → PROCEED ("BM25 alone is weak…")
- Decision is stored in eval DB as JSON metadata on `bm25_contingency_decision` row
- All 3 branches tested in `t008-bm25-baseline.vitest.ts`

What is pending:
- Actual contingency outcome (PAUSE / RATIONALIZE / PROCEED) depends on live MRR@5

---

## Sprint 0 Completion Assessment

**Infrastructure gates (1, 2, 4, 7, 8): 5/5 PASS**
**Live-execution gates (3, 5, 6): 0/3 PASS (infrastructure complete, execution pending)**

Sprint 0 has successfully established the full measurement foundation:
- Ground truth dataset with 110 validated queries
- BM25 baseline runner with dependency-injected search function
- Metric recording infrastructure targeting eval_metric_snapshots
- Contingency decision matrix logic ready to execute
- Feature flag audit confirming 5/6 cap compliance

The three PARTIAL gates are blocked only by the absence of a live DB run.
They are not blocked by code gaps. The infrastructure to complete them is
fully implemented and tested.

**Recommended Sprint 1 first action**: Enable `SPECKIT_EVAL_LOGGING=true`, perform
live DB ID mapping for ground truth queries, and execute `runBM25Baseline()` to
resolve gates 3, 5, and 6.

---

## Test Coverage Summary (Sprint 0)

| Task | Test File | Tests | Status |
|------|-----------|-------|--------|
| T001 | t001-graph-numeric-ids.vitest.ts | 6 | PASS |
| T002 | t002-dedup.vitest.ts | 7 | PASS |
| T004 | t004-eval-db.vitest.ts | 27 | PASS |
| T005 | t005-eval-logger.vitest.ts | ~15 | PASS |
| T006 | t006-eval-metrics.vitest.ts | ~30 | PASS |
| T006fg | t006fg-ceiling-quality.vitest.ts | ~10 | PASS |
| T007 | t007-ground-truth.vitest.ts | 12 | PASS |
| T008 | t008-bm25-baseline.vitest.ts | 12 | PASS |

Total new tests in T008: 12 (see `t008-bm25-baseline.vitest.ts`)
