# Deep Review Dashboard

## Status
Provisional verdict: CONDITIONAL

hasAdvisories: true

Stop reason: converged

Release readiness: in-progress

## Findings Summary
| Severity | Active | New in Last Iteration |
|---|---:|---:|
| P0 | 0 | 0 |
| P1 | 2 | 0 |
| P2 | 1 | 0 |

## Progress Table
| Iteration | Focus | New Findings Ratio | New Findings | Verdict |
|---:|---|---:|---:|---|
| 1 | correctness | 1.00 | 2 | CONDITIONAL |
| 2 | security | 0.00 | 0 | PASS |
| 3 | traceability | 0.09 | 1 | PASS |
| 4 | maintainability | 0.00 | 0 | PASS |

## Coverage
| Dimension | Covered |
|---|---|
| correctness | yes |
| security | yes |
| traceability | yes |
| maintainability | yes |

## Traceability Protocols
| Protocol | Status |
|---|---|
| spec_code | partial |
| checklist_evidence | pass |
| feature_catalog_code | partial |
| playbook_capability | partial |

## Trend
Last three new-findings ratios: 0.00 -> 0.09 -> 0.00.

The loop stabilized after all dimensions were covered. Active P1 findings force a CONDITIONAL verdict.

## Active Risks
- F001: release docs overclaim catalog-code traceability coverage.
- F002: stale phase-style labels remain despite the catalog cleanup claim.
- F003: playbook scenario 136 prose is malformed but command steps remain usable.
