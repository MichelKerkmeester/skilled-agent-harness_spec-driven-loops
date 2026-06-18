# Deep Review Dashboard

## Status
- **Verdict**: **CONDITIONAL**
- **Active P0**: 0 | **Active P1**: 1 (F001) | **Active P2**: 15
- **hasAdvisories**: true
- **Dimensions**: 4/4 covered
- **Session**: fanout-deepseek-v4-pro-1781458383576-j9ykio (generation 1)
- **Release Readiness**: converged

## Findings Summary
| Severity | Active | Resolved |
|----------|--------|----------|
| P0 | 0 | 0 |
| P1 | 1 | 0 |
| P2 | 15 | 0 |

## Progress Table
| Iteration | Focus | Dimension | newFindingsRatio | Findings | Status |
|-----------|-------|-----------|-----------------|----------|--------|
| 001 | Correctness | correctness | 1.00 | P0=0 P1=1 P2=4 | complete |
| 002 | Security | security | 0.33 | P0=0 P1=0 P2=3 | complete |
| 003 | Traceability | traceability | 0.29 | P0=0 P1=0 P2=4 | complete |
| 004 | Maintainability | maintainability | 0.23 | P0=0 P1=0 P2=3 | complete |
| 005 | Stabilization | maintainability | 0.08 | P0=0 P1=0 P2=1 | complete |

## Coverage
- **Dimensions Complete**: 4 / 4
- **Files Reviewed**: 18
- **Traceability**: spec_code: pass, checklist_evidence: partial

## Trend
- **Ratios**: 1.00 → 0.33 → 0.29 → 0.23 → 0.08
- **Direction**: Strongly descending (convergence confirmed)

## Active Risks
- F001 (P1): mcp-open-design SKILL.md version field stale at 1.1.0 — single fix needed for PASS

## BLOCKED STOPS
- Run 5: convergenceGate blocked on rolling average (0.155 > 0.08). All other 8 gates passed.

## CORRUPTION WARNINGS
- None.

## GRAPH CONVERGENCE
- graphConvergenceScore: 0
- graphDecision: null
- graphBlockers: []
