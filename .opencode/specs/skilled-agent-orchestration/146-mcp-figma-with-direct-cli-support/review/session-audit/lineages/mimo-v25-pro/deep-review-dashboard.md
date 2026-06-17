# Deep Review Dashboard

Auto-generated. Overwritten each iteration.

## Status
- **Provisional Verdict**: CONDITIONAL
- **hasAdvisories**: true
- **Release Readiness**: in-progress
- **Iteration**: 4 of 10
- **Mode**: review
- **Stop Reason**: maxIterationsReached (all dimensions covered)

## Findings Summary
| Severity | Active | New This Iteration |
|----------|--------|-------------------|
| P0 | 0 | 0 |
| P1 | 2 | 0 |
| P2 | 7 | 2 |

## Progress Table
| Run | Status | Focus | Dimensions | Ratio | Duration |
|-----|--------|-------|------------|-------|----------|
| 1 | complete | Correctness | D1 | 1.0 | ~5min |
| 2 | complete | Security | D2 | 0.29 | ~5min |
| 3 | complete | Traceability | D3 | 0.0 | ~5min |
| 4 | complete | Maintainability | D4 | 0.29 | ~5min |

## Coverage
- **Dimensions completed**: 4/4
- **Files reviewed**: 14
- **Traceability protocols**: core=pass, overlay=pass

## Trend
- Rolling average: 0.145 (above 0.08 threshold)
- Composite stop score: 0.45 (below 0.60 threshold)
- Trajectory: declining (1.0 → 0.29 → 0.0 → 0.29)

## Active Risks
- 2 P1 findings block PASS verdict (F001: yolo running-state gap, F002: install error handling)
- 7 P2 advisory findings

## BLOCKED STOPS
| Run | Blocked By | Recovery |
|-----|-----------|----------|
| 4 | p0ResolutionGate | 2 active P1 findings remain. All dimensions covered. |

## Lifecycle
- sessionId: fanout-mimo-v25-pro-1781459141456-y67ab1
- parentSessionId: null
- lineageMode: new
- generation: 1
- continuedFromRun: null
