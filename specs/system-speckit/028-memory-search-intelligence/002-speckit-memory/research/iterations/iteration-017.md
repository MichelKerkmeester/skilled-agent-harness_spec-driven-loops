# Iteration 17: Round C Feasibility — Memory Determinism / Rank-Time FIX Cluster (baseline-first)

## Focus
Round C feasibility for the Memory determinism cluster: C-X1, M-decay-defensive-guards, C6-A-clock, C5-B, M-competition-rank-neutrality, M-pin-rank-time, M-recency-decay-dual-axis, M-never-truncate-always-surface. Which are byte-identical-by-default vs which CHANGE ordering/result-set and need a captured baseline. Read-only.

## Feasibility verdicts (newInfoRatio 0.75)
| Candidate | Verdict | Ordering impact |
|---|---|---|
| C-X1 ({bonusOverChannels}) | **GO** (byte-identical-by-default) | none if default = current `overlapRatio` math; don't flip default in the same change |
| M-decay-defensive-guards | **GO** (byte-identical for well-formed data) | only changes degenerate rows (zero stability/null half-life → NaN/Inf today); SQL already guards divide-by-zero, gap is the JS recency path |
| C6-A-clock (thread one nowMs) | **GO** (near-byte-identical) | removes intra-query skew (Date.now at :934/987/1016/1199 + julianday('now')); land EARLY — enables reproducible baselines downstream |
| C5-B + M-competition-rank-neutrality | **CAUTION** (bundle as ONE re-baseline) | CHANGE tie order (final tiebreak is `a.id - b.id` today) |
| M-pin-rank-time | **CAUTION** (baseline first) | CHANGES order — SQL honors pins but the JS recency path (:1195-1218) doesn't |
| M-recency-decay-dual-axis | **NEEDS-BENCHMARK** | changes the CORE score for every row (not just ties) — judged sweep |
| M-never-truncate-always-surface | **NEEDS-BENCHMARK** | changes RESULT-SET cardinality/membership — downstream limit/token-budget consumers speak the "≤limit" contract |

## Sequencing — baseline-FIRST
(1) **Capture baseline**: run the ranking gate [unit-rrf-fusion, calibrated-overlap-bonus, score-normalization, constitutional-filtering, hybrid-decay-policy, score-resolution-consistency, adaptive-ranking-e2e, search-limits-scoring, k-value-judged-sweep] + save a representative ranked-id fixture (no ranking golden snap exists today). (2) byte-identical pair: C-X1 + decay-guards. (3) C6-A-clock early (enables reproducible baselines). (4) tiebreak bundle C5-B + competition-rank (single re-baseline). (5) M-pin-rank-time. (6) behind judged benchmark: dual-axis → never-truncate (verify limit/token consumers).

## Next Focus
Clean GO spearhead (C-X1 + decay-guards + C6-A-clock, all near-byte-identical). The ordering-changers are correctly gated behind a captured baseline per the regression-baseline rule. Open: does any caller size token budgets on `limit` (breaks under never-truncate)? Is the JS smartRanking path live-default or opt-in (affects pin/dual-axis blast)?
