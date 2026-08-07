# Iteration 004: Deep Benchmark Analysis — Contradictions and Gaps

## Focus
Deep-dive into actual benchmark result files for highest-severity gaps: per-query distributions, specific conflict edges, cluster compositions, and cross-cutting contradictions.

## Key Findings

### 1. MULTIHOP — The K=12 Gap
**Per-query distribution:** 2 queries already at 1.0 recall OFF (no-op), 4 gained 1 target, 1 gained 3, 1 gained 4.
**Critical contradiction:** completeRecall@12 = 0.625 (line 41), but the "deep-K GRADUATE" headline uses K=20 at 0.9375. At the more realistic K=12 (past limit=10), gain is modest +0.0625. The K=20 number is an outlier, not representative.
**The compact-code-graph-hooks query (0.00→1.00):** canonical use case — hub doc references 4 siblings invisible to lexical/vector search. Multi-hop is the ONLY path to recover them.
**Structural root cause busted:** `DEFAULT_MIN_RESULTS=3` is a floor (never cut below 3), not a cap. Prod path returns full limit of 10. The real blocker was Stage-1 `stopAfterFusion` skipping the branch containing appends.

### 2. RRF — The Conflict Masking
**Single moved prompt q02 ("codex pr review"):** lexical lane magnitude swamped explicit-author signal. RRF preserved rank order — canonical advantage against magnitude outliers.
**Plain RRF regresses on conflict band:** 4/5 correct vs baseline 5/5. The main table shows RRF+seam at 5/5, masking that plain RRF is WORSE than weighted-sum on conflict-bearing prompts.
**Self-guard root cause:** Generic explainer floor (pins every skill to same floor) + `auditRecsAdvisorPenalty` already fires un-flagged. Guard duplicates penalty that already runs.
**CUT safety risk:** If `auditRecsAdvisorPenalty` is ever removed, the advisor could self-recommend on audit prompts with no guard — the guard was the only explicit safety mechanism.

### 3. DEDUP — Synthetic-Only
**Exact clusters:** 5 NEAR_DUP clusters (cache-ttl, retry-backoff, tombstone-scan, cyclic-traversal, sql-injection) collapsed from 17→10 records. 7 noise records = surplus restatements.
**Severity preservation proven:** cyclic-traversal P0 (worker 1) kept over P1 (workers 2,3). sql-injection P0 kept.
**Content keys distinguishable on synthetic set:** 1.0 precision, 1.0 recall. But "reads no corpus or database" — hand-crafted 17 records.
**Heartbeat contradiction:** "cannot flood" claimed but tested on single pool at 50ms cadence. Concurrent 10-pool run = 430 records/2s. Production cadence undefined (line 81: "tuning question the benchmark does not settle").

### 4. STALENESS + BITEMPORAL — Unwired Graduations
**Staleness cap:** Cap=10 on 30-importers = 37ms→21ms (43% reduction). Low-fan-in (2 importers) still rebinds. Cap defaults to 0 (uncapped) — safety mechanism has no production default.
**Bitemporal consumer unwired:** `closeEdgesForSources` and `insertEdgeWithValidity` NEVER called in production. "This is a small wiring change behind the same flag." Graduated with explicit unmet pre-condition.
**Three of five flags graduate with unresolved production gaps:** bitemporal writer unwired, degree cap undefined, citation ledger zero density.

### 5. TRUE-CITATION — Zero Density
**13417 turns, 1711 search_shown rows, 0 session-scoped.** All predate firing-trigger fix.
**7 emits on scratch copy:** 4 used (assistant echoed title/content), 3 not-used (prose counts or absent paraphrase). Anchor detector: 15.79% coverage vs bare-id 7.24%.
**9 suppressed false positives:** `16`, `26`, `20924`, `21800`, etc. — prose-count collisions rejected by anchor-aware detector.
**Contradiction:** "The design is sound and the signal is now trustworthy" but "measured density a reranker would consume is still zero." Theoretically correct, practically useless until traffic accumulates.

### Cross-Cutting Pattern
**Multiple flags graduate with caveats that would normally block graduation.** Bitemporal "GRADUATE... once a reindex caller wires [the writer]." Staleness cap "GRADUATE... with the degree cap set to a sensible ceiling." Heartbeat "GRADUATE" with undefined production cadence. These are conditional graduations dressed as unqualified verdicts.

**Biggest cross-cluster risk:** All benchmarks run against synthetic data, read-only corpus copies, or in-memory overlays — never against live, mutating production state.

### Sources
[SOURCE: 001 benchmark-results.md:28, 36-41, 49-61, 71-72]
[SOURCE: 003 benchmark-results.md:27, 35-41, 44-77, 96, 101]
[SOURCE: 006 benchmark-results.md:25-38, 48-53, 58-69, 71-84]
[SOURCE: 007 benchmark-results.md:20, 22, 29-40, 43-48, 52-64, 78-87, 102]
[SOURCE: 008 benchmark-results.md:22, 38, 42-58, 64-70, 75, 81, 84]

## Novelty
- newInfoRatio: 0.65 — Deep analysis uncovered specific contradictions the high-level verdicts mask: multihop K=12 only 0.625 (not 0.9375), RRF main table masks plain-RRF regression (4/5 vs baseline 5/5), heartbeat "cannot flood" claim contradicted by undefined production cadence, three of five flags graduate with unmet production pre-conditions, all benchmarks run against synthetic/read-only data never touching live production state. Cross-cutting pattern: conditional graduations dressed as unqualified verdicts.
