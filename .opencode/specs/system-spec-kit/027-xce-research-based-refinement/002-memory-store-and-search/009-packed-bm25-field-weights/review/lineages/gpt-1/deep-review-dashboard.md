# Deep Review Dashboard

| Field | Value |
|-------|-------|
| Session | `fanout-gpt-1-1781151823427-s19oy4` |
| Lineage | `gpt-1` |
| Iterations | 6 / 6 |
| Stop Reason | `maxIterationsReached` |
| Release Readiness | `release-blocking` |
| Verdict | FAIL |

## Severity Totals
| Severity | Active |
|----------|--------|
| P0 | 2 |
| P1 | 0 |
| P2 | 1 |

## Dimension Coverage
| Dimension | Covered | Latest Iteration |
|-----------|---------|------------------|
| Correctness | yes | 005 |
| Traceability | yes | 006 |
| Security | yes | 003 |
| Maintainability | yes | 004 |

## Gate Blockers
| Gate | Status | Detail |
|------|--------|--------|
| convergenceGate | blocked | Active P0 findings prevent legal STOP by convergence. |
| dimensionCoverageGate | pass | All configured dimensions covered. |
| p0ResolutionGate | fail | Active P0 count: 2. |
| evidenceDensityGate | pass | Every active finding has file:line evidence. |
| claimAdjudicationGate | fail | Shipped claims conflict with active P0 findings. |
| graphlessFallbackGate | pass | Code graph was stale; direct file evidence used. |

## Trend
| Iteration | Dimension | New Findings Ratio | P0 | P1 | P2 |
|-----------|-----------|--------------------|----|----|----|
| 001 | correctness | 1.0000 | 1 | 0 | 0 |
| 002 | traceability | 0.5000 | 1 | 0 | 0 |
| 003 | security | 0.0000 | 0 | 0 | 0 |
| 004 | maintainability | 0.0909 | 0 | 0 | 1 |
| 005 | correctness-stabilization | 0.0000 | 0 | 0 | 0 |
| 006 | traceability-stabilization | 0.0000 | 0 | 0 | 0 |
