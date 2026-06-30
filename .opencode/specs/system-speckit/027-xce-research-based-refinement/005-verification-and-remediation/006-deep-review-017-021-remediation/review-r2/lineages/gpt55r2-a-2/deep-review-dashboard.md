# Deep Review Dashboard

## Status
| Field | Value |
| --- | --- |
| Session | `fanout-gpt55r2-a-2-1781761314338-6u1ztm` |
| Iterations | 1 / 1 |
| Stop reason | maxIterations_reached |
| Provisional verdict | CONDITIONAL |
| hasAdvisories | true |
| Release readiness | in-progress |

## Findings Summary
| Severity | Active | Delta |
| --- | ---: | ---: |
| P0 | 0 | 0 |
| P1 | 1 | +1 |
| P2 | 1 | +1 |

## Progress Table
| Iteration | Focus | New Findings Ratio | Findings | Status |
| --- | --- | ---: | --- | --- |
| 001 | correctness | 0.60 | P1=1, P2=1 | insight |

## Coverage
| Area | Status |
| --- | --- |
| correctness | covered |
| security | not covered |
| performance | not covered |
| concurrency/cancellation | not covered |
| maintainability | not covered |
| spec-vs-code drift | partially covered |
| spec_code protocol | partial |
| checklist_evidence protocol | skipped: no checklist.md in review-scope folder |

## Trend
- Last ratios: 0.60.
- Composite stop score: 0.1667.
- Legal stop source: maxIterations, not convergence.

## Active Risks
- P1 F001 can return cross-scope community fallback results for scoped `memory_search` calls.
- Only one iteration ran, so the dashboard does not claim full search/retrieval release readiness.
- Code graph was stale; review evidence is direct file evidence only.
