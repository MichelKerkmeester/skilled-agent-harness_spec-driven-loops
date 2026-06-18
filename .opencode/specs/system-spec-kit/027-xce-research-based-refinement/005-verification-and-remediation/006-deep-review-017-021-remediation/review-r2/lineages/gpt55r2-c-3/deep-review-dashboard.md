# Deep Review Dashboard

## Status
| Field | Value |
| --- | --- |
| Session | `fanout-gpt55r2-c-3-1781761364358-6qni37` |
| Iterations | 1 / 1 |
| Stop reason | `maxIterationsReached` |
| Provisional verdict | CONDITIONAL |
| Release readiness | in-progress |
| hasAdvisories | false |

## Findings Summary
| Severity | Active | New |
| --- | ---: | ---: |
| P0 | 0 | 0 |
| P1 | 1 | 1 |
| P2 | 0 | 0 |

## Progress Table
| Iteration | Focus | Dimensions | New Findings Ratio | Status |
| --- | --- | --- | ---: | --- |
| 001 | IPC configuration contract | correctness, security | 1.00 | complete |

## Coverage
| Area | Status |
| --- | --- |
| Correctness | covered |
| Security | covered |
| Traceability | partial |
| Maintainability | not covered |
| spec_code | partial |
| checklist_evidence | skipped - no checklist.md in scope folder |

## Trend
Only one evidence-bearing iteration exists; rolling and MAD convergence signals have insufficient data.

## Active Risks
| Risk | Status |
| --- | --- |
| Active P0 | none |
| Active P1 | F001 blocks PASS |
| Coverage gate | incomplete due maxIterations=1 |
| Graph fallback | not used |
