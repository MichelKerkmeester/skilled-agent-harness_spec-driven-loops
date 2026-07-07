# Deep Review Dashboard - gpt-1

Auto-generated lineage summary from JSONL state and strategy.

## Status
- Review Target: `.opencode/specs/system-skill-advisor/000-migration-from-system-speckit` (spec-folder)
- Status: COMPLETE
- Iteration: 20 of 20
- Stop Reason: maxIterationsReached
- Provisional Verdict: CONDITIONAL
- hasAdvisories: false

## Findings Summary
| Severity | Count | Trend |
|----------|------:|-------|
| P0 | 0 | stable |
| P1 | 3 | stable after iteration 3 |
| P2 | 0 | stable |

## Dimension Coverage
| Dimension | Status | Iterations | Findings |
|-----------|--------|------------|----------|
| correctness | covered | 1, 6, 10, 14, 18, 20 | F001 |
| security | covered | 4, 8, 12, 16, 20 | none |
| traceability | covered | 2, 3, 7, 11, 15, 19, 20 | F002, F003 |
| maintainability | covered | 5, 9, 13, 17, 20 | none |

## Traceability Coverage
| Protocol | Level | Status | Findings |
|----------|-------|--------|----------|
| spec_code | core | partial | F002 |
| checklist_evidence | core | partial | F003 |
| feature_catalog_code | overlay | partial | F003 |
| playbook_capability | overlay | not-applicable | none |

## Progress
| # | Dimension | Ratio | P0/P1/P2 | Status |
|---|-----------|-------|----------|--------|
| 1 | correctness | 1.0 | 0/1/0 | complete |
| 2 | traceability | 1.0 | 0/1/0 | complete |
| 3 | traceability | 1.0 | 0/1/0 | complete |
| 4-20 | mixed/stabilization | 0.0 | 0/0/0 | complete |

## Trend
- Last 3 ratios: 0.0, 0.0, 0.0
- Stuck count: telemetry only; stop policy forced max iterations.
- Gate violations: active P1 findings keep final verdict CONDITIONAL.

## Next Focus
Plan remediation for stale lifecycle metadata, stale retired path references, and validation evidence mismatch.
