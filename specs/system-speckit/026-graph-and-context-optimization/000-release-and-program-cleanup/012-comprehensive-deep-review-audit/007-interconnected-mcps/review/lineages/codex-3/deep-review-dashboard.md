# Deep Review Dashboard

## Status
| Field | Value |
|---|---|
| Session | `fanout-codex-3-1780596001496-57ueol` |
| Verdict | CONDITIONAL |
| Stop Reason | converged |
| hasAdvisories | false |
| Release Readiness | in-progress |

## Findings Summary
| Severity | Active | Delta |
|---|---:|---:|
| P0 | 0 | 0 |
| P1 | 3 | 0 |
| P2 | 2 | 0 |

## Coverage
| Dimension | Covered | Iteration |
|---|---|---:|
| correctness | yes | 1 |
| security | yes | 2 |
| traceability | yes | 3 |
| maintainability | yes | 4 |

## Progress
| # | Focus | Ratio | P0/P1/P2 | Status |
|---:|---|---:|---|---|
| 1 | correctness | 1.000000 | 0/1/0 | complete |
| 2 | security | 0.500000 | 0/1/0 | complete |
| 3 | traceability | 0.333333 | 0/1/0 | complete |
| 4 | maintainability | 0.117647 | 0/0/2 | complete |
| 5 | stabilization | 0.000000 | 0/0/0 | complete |

## Traceability Coverage
| Protocol | Level | Status |
|---|---|---|
| spec_code | core | pass after coverage pass |
| checklist_evidence | core | pass, no checklist present |
| feature_catalog_code | overlay | partial |
| playbook_capability | overlay | partial |

## Trend
- Last 3 ratios: 0.333333 -> 0.117647 -> 0.000000
- Rolling average of last two ratios: 0.0588235
- Stuck count: 1
- Gate violations: none blocking synthesis

## Active Risks
- F001, F002, and F003 require fixes before a clean PASS verdict.
- F004 and F005 are advisory documentation/contract cleanup.
