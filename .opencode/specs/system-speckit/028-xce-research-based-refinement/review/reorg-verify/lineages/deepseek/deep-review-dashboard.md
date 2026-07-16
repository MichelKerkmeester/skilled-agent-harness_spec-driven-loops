# Deep Review Dashboard

## Status
- Verdict: CONDITIONAL (2 P1 active)
- hasAdvisories: true
- Iteration: 4/5 (converged)
- Status: complete (convergence: rolling ratio 0.06 < 0.08, 4/4 dimensions)

## Findings Summary
- P0 (Critical): 0 active
- P1 (Major): 2 active (F001, F002)
- P2 (Minor): 5 active (F003-F007)
- Total: 7 active

## Progress Table
| Iteration | Focus | Status | Dimensions | Ratio | Findings |
|-----------|-------|--------|------------|-------|----------|
| 1 | D1 Correctness | complete | correctness | 0.75 | 0 P0, 2 P1, 2 P2 |
| 2 | D2 Security | complete | correctness, security | 0.06 | 0 P0, 0 P1, 1 P2 |
| 3 | D3 Traceability | complete | correctness, security, traceability | 0.06 | 0 P0, 0 P1, 1 P2 |
| 4 | D4 Maintainability | complete | all | 0.06 | 0 P0, 0 P1, 1 P2 |

## Dimension Coverage
| Dimension | Status |
|-----------|--------|
| D1 Correctness | done (CONDITIONAL — 2 P1) |
| D2 Security | done (PASS — 1 P2) |
| D3 Traceability | done (PASS — 1 P2) |
| D4 Maintainability | done (PASS — 1 P2) |

## Trend
| Iteration | Ratio |
|-----------|-------|
| 1 | 0.75 |
| 2 | 0.06 |
| 3 | 0.06 |
| 4 | 0.06 |

Rolling average (last 2): 0.06 — below 0.08 threshold. Stable for 3 iterations. Convergence achieved.

## Active Risks
- 2 P1 findings active: F001 (stale key_files path), F002 (stale resource-map)
- Remediation: metadata refresh pass to update graph-metadata.json key_files, description.json description/specFolder, and resource-map.md
