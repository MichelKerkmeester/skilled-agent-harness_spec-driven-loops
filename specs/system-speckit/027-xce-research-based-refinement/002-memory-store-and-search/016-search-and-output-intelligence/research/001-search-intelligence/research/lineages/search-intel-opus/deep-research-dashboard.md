# Deep Research Dashboard — search-intel-opus

_Auto-generated from JSONL + strategy + registry. Do not edit by hand._

## Iteration Table

| run | focus | newInfoRatio | findings | status |
|-----|-------|-------------|----------|--------|
| 1 | Generic-query recall (gating root cause) | 1.0 | 5 | complete |
| 2 | Request-quality aggregation redesign | 0.7 | 4 | complete |
| 3 | Token-budget 5→1 truncation mechanism + fix | 0.6 | 4 | complete |
| 4 | Reranker value + FSRS cold-tier | 0.5 | 6 | complete |
| 5 | Calibration headroom + cross-cutting synthesis | 0.2 | 5 | insight |

## Question Status

6/6 answered (Q1–Q6). No open questions.

## Convergence Trend

newInfoRatio: 1.0 → 0.7 → 0.6 → 0.5 → 0.2 (monotonic descending). Converged at iter 5
(below 0.05 marginal-novelty intent; all questions answered). Stop reason: **converged**.

## Dead Ends

- Flags-off; weak embedding model; topScore-only gate; "budget OFF = no truncation";
  state-limits cause count:1; re-add cross-encoder first; retune cold-tier; raise 0.88 cap.

## Blocked Stops

None.

## Graph Convergence

Not tracked (lineage run; coverage-graph events not emitted in this fan-out lineage).

## Next Focus

CONVERGED → synthesis complete (`research.md`). Implementation is a separate follow-up.

## Active Risks

- Live `count:1` per-row token accounting not captured (needs `budgetTruncated` trace to confirm
  greedy-break vs few-survivors). MEDIUM-confidence item flagged in iteration 3.
