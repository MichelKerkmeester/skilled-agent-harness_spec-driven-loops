# Deep Review Dashboard

## Status
- Provisional verdict: CONDITIONAL
- Release readiness: in-progress
- Stop reason: maxIterationsReached
- hasAdvisories: true

## Findings Summary
- P0: 0
- P1: 1
- P2: 1

## Progress Table
| Iteration | Focus | Dimensions | New Findings Ratio | Status |
|-----------|-------|------------|---------------------|--------|
| 1 | correctness | correctness | 0.0 | complete |
| 2 | security | security | 0.0 | complete |
| 3 | traceability | traceability | 1.0 | insight |
| 4 | maintainability | maintainability | 1.0 | complete |
| 5 | stabilization | all | 0.0 | complete |
| 6 | max-iteration replay | all | 0.0 | complete |

## Coverage
- Dimensions covered: 4/4
- Core protocols: partial because F001 remains active
- Overlay protocols: feature_catalog_code pass, playbook_capability partial
- Code graph: stale; direct read/grep fallback used

## Trend
- Last 3 newFindingsRatio values: 1.0 -> 0.0 -> 0.0
- Final two passes found no new findings, but active P1 prevents PASS.

## Active Risks
- F001 keeps parent resume/release-readiness metadata stale.
- F002 leaves two completed child summaries less useful for memory/resume continuity.
