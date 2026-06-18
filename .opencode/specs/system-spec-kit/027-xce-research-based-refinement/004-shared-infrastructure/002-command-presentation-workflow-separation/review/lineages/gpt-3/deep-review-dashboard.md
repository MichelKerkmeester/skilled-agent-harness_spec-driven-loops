# Deep Review Dashboard - gpt-3

## Status
Provisional verdict: CONDITIONAL

Release readiness: in-progress

Stop reason: maxIterationsReached

hasAdvisories: false

## Findings Summary
| Severity | Active | New In Last Iteration |
|----------|--------|-----------------------|
| P0 | 0 | 0 |
| P1 | 1 | 0 |
| P2 | 0 | 0 |

## Dimension Coverage
| Dimension | Covered | Iterations |
|-----------|---------|------------|
| correctness | yes | 1,5 |
| security | yes | 2 |
| traceability | yes | 3,5,6 |
| maintainability | yes | 4,6 |

Required protocols: partial because F001 remains active.

## Progress
| Iteration | Focus | Ratio | New Findings | Verdict |
|-----------|-------|-------|--------------|---------|
| 1 | correctness | 0.00 | 0 | PASS |
| 2 | security | 0.00 | 0 | PASS |
| 3 | traceability | 1.00 | 1 P1 | CONDITIONAL |
| 4 | maintainability | 0.00 | 0 | PASS |
| 5 | stabilization-reference-integrity | 0.00 | 0 | PASS |
| 6 | final-stabilization | 0.00 | 0 | PASS |

## Next Focus
Remediate F001 by updating root phase-parent status and graph metadata to reflect completed child families.

## Active Risks
No P0. One P1 traceability drift can mislead resume/search/release readiness but does not indicate command runtime breakage.
