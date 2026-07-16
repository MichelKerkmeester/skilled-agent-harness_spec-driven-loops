# Deep Research Dashboard: dq-novel-oob

Auto-generated. Do not edit by hand.

## Iteration Table

| run | focus | newInfoRatio | findings | status |
|-----|-------|--------------|----------|--------|
| 1 | KQ1 context-budget optimizer under the floor | 0.90 | budget-fitting assembler GO-on-cost; score-changing variant NO-GO | complete |
| 2 | KQ2 LLM-judge consumer + auto-gen answerable-questions | 0.80 | judge GO-on-cost(gov)/CONDITIONAL(retr); answerable-qs CONDITIONAL | complete |
| 3 | KQ3 retrieval-driven auto-rewriting | 0.74 | auto NO-GO; suggest-only GO-on-cost | insight |
| 4 | KQ4 KG enrichment + auto-summarization rollups | 0.70 | typed-KG GO-on-cost; rollup NO-GO | complete |
| 5 | KQ5 contradiction/staleness + freshness decay queue | 0.66 | both GO-on-cost (headline) | insight |
| 6 | KQ6 embedding-drift alerting + example/test generation | 0.62 | both GO-on-cost | complete |
| 7 | KQ7 leaderboard/dashboard + per-doc SLAs | 0.34 | leaderboard NO-GO; SLA thin GO-on-cost | complete |
| 8 | KQ8 adversarial convergence | 0.05 | converged; every novel GO is a floor-bypasser | complete |

## Question Status

8/8 key questions answered.

- KQ1-KQ8: RESOLVED (each candidate carries concept + value-per-reader + feasibility + floor-survival + go/no-go).

3 open questions deferred to a build stage: LLM-judge marginal value over form-only (C2-gated); contradiction-detector precision; mixed-embedding-regime corpus census.

## Trend

Last 3 newInfoRatio: 0.62 -> 0.34 -> 0.05 (descending, converged).
Full: 0.90 -> 0.80 -> 0.74 -> 0.70 -> 0.66 -> 0.62 -> 0.34 -> 0.05. Two insight iterations at 3 and 5.

## Verdict Tally (13 candidates)

- GO-on-cost (novel, floor-bypassing): budget-fitting assembler, typed-relation KG (L/nav), cross-doc contradiction+staleness, freshness decay auto-refresh queue, embedding-drift monitoring+alerting, example/test generation from specs, per-doc SLA (thin), LLM-judge (governance), suggest-only rewrite salvage.
- CONDITIONAL (retrieval, C2-gated): LLM-judge as a ranking lever, auto-gen answerable-questions/semantic-intent fused.
- NO-GO: auto-rewriting authored bodies, auto-summarization rollup nodes, doc-quality leaderboard (fold into B1 report), score-changing budget optimizer.

## Dead Ends

All-pairs contradiction scan; embedding-similarity-alone contradiction; closed-loop auto-rewrite; auto-gen answerable-questions without a consumer; parallel KG lane; separate dashboard service; SLA auto-remediation; any novel idea beating the floor on recall.

## Next Focus

None. Lineage converged at iteration 8. Synthesis written to research.md.

## Active Risks

None outstanding. The two hard rails (no body auto-fix, no retrieval promotion without prod@3) held under adversarial re-derivation.
