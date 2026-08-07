# Deep Review Dashboard — glm-high lineage

## Status
Provisional verdict: CONDITIONAL | hasAdvisories: true

## Findings Summary
| Severity | Active | New (iter 5) |
|----------|--------|--------------|
| P0 | 0 | 0 |
| P1 | 1 | 1 |
| P2 | 9 | 1 |

## Dimension Coverage
- correctness: ✅ covered (iter 1)
- security: ✅ covered (iter 2)
- traceability: ✅ covered (iter 3)
- maintainability: ✅ covered (iter 4-5)

## Progress
| Run | Status | Focus | Dimensions | newFindingsRatio | Findings |
|-----|--------|-------|------------|------------------|---------|
| 1 | complete | correctness | correctness | 0.43 | P0=0 P1=0 P2=3 |
| 2 | complete | security | security | 0.25 | P0=0 P1=0 P2=1 |
| 3 | complete | traceability | traceability | 0.17 | P0=0 P1=0 P2=1 |
| 4 | complete | maintainability | maintainability | 0.60 | P0=0 P1=0 P2=3 |
| 5 | complete | CI wiring | maintainability | 0.70 | P0=0 P1=1 P2=1 |

## Trend
Last 3 ratios: [0.17, 0.60, 0.70] → ascending (stopPolicy=max-iterations → broaden angles, no early stop)

## Active Risks
- 1 P1 (F009): CI trigger gap for command-metadata.json — release-line regression path.
- 9 P2 advisories (defensive hardening + test honesty).

## Next Focus
Synthesis — compile review-report.md, finalize state.
