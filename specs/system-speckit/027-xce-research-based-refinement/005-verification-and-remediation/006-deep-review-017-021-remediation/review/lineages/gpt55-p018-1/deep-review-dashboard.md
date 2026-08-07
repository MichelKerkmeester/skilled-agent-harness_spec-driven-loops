# Deep Review Dashboard

| Field | Value |
|---|---|
| Session | `fanout-gpt55-p018-1-1781756069362-kvnd8x` |
| Iteration | 1 of 1 |
| Stop Reason | `maxIterationsReached` |
| Provisional Verdict | CONDITIONAL |
| Release Readiness | `in-progress` |
| Active P0 | 0 |
| Active P1 | 1 |
| Active P2 | 0 |
| hasAdvisories | false |

## Dimension Coverage

| Dimension | Covered |
|---|---:|
| Correctness | yes |
| Security | no |
| Traceability | yes |
| Maintainability | no |

## Convergence Trend

| Iteration | newFindingsRatio | Verdict |
|---:|---:|---|
| 001 | 1.00 | CONDITIONAL |

## Gate Blockers

| Gate | Status | Notes |
|---|---|---|
| dimensionCoverageGate | block | Security and maintainability were not reviewed before the max-iteration cap. |
| claimAdjudicationGate | block | One active P1 remains open. |
| graphlessFallbackGate | pass_with_caveat | Code graph status was stale; exact Grep/Read evidence was used. |

## Active Findings

| ID | Severity | Title |
|---|---|---|
| DR018-P1-001 | P1 | Cancellation can still pay one inter-batch pacing delay |
