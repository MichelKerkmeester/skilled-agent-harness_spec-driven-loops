# Deep Review Dashboard - gpt55r2-a-9

## Status

| Field | Value |
| --- | --- |
| Session | `fanout-gpt55r2-a-9-1781761314338-6u1ztm` |
| Iterations | 1 / 1 |
| Stop Reason | `maxIterationsReached` |
| Provisional Verdict | CONDITIONAL |
| Release Readiness | in-progress |
| hasAdvisories | false |

## Findings

| Severity | Active | Resolved |
| --- | ---: | ---: |
| P0 | 0 | 0 |
| P1 | 2 | 0 |
| P2 | 0 | 0 |

## Dimension Coverage

| Dimension | Covered |
| --- | --- |
| correctness | yes |
| security | no |
| performance | no |
| concurrency-cancellation | no |
| maintainability | no |
| spec-vs-code-drift | yes |

## Gate Blockers

| Gate | Status | Notes |
| --- | --- | --- |
| convergenceGate | stopped | Max iteration cap reached before convergence. |
| dimensionCoverageGate | blocked | Only 2 of 6 requested dimensions covered. |
| p0ResolutionGate | pass | No active P0 findings. |
| claimAdjudicationGate | blocked | Active P1 findings remain. |
| evidenceDensityGate | pass | Each finding has file:line evidence. |

## Trend

| Iteration | New Findings Ratio | P0 | P1 | P2 |
| --- | ---: | ---: | ---: | ---: |
| 001 | 1.00 | 0 | 2 | 0 |
