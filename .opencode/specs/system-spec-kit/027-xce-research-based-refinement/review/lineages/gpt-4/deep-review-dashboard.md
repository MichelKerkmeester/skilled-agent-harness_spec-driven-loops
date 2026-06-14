# Deep Review Dashboard

## Status

- Provisional verdict: CONDITIONAL
- Stop reason: maxIterationsReached
- Release readiness: in-progress
- hasAdvisories: true
- Active blockers: none P0, three P1 remediation items

## Findings Summary

| Severity | Active | Latest Delta |
|---|---:|---:|
| P0 | 0 | 0 |
| P1 | 3 | 0 |
| P2 | 1 | 0 |

## Dimension Coverage

| Dimension | Covered | Iterations |
|---|---|---|
| correctness | yes | 001, 005 |
| security | yes | 002 |
| traceability | yes | 003, 005 |
| maintainability | yes | 004, 005 |

## Progress

| Run | Focus | Ratio | New P0/P1/P2 | Status |
|---:|---|---:|---|---|
| 1 | correctness | 1.00 | 0/2/0 | complete |
| 2 | security | 0.00 | 0/0/0 | complete |
| 3 | traceability | 1.00 | 0/1/0 | complete |
| 4 | maintainability | 1.00 | 0/0/1 | complete |
| 5 | stabilization replay | 0.00 | 0/0/0 | complete |

## Next Focus

Remediate parent control-plane drift in parent `spec.md`, `description.json`, `resource-map.md`, and continuity metadata. Re-run strict validation and a focused traceability review after remediation.

## Active Risks

- F001 and F002 can misroute resume/search/phase traversal from parent surfaces.
- F003 leaves parent resource-map coverage incomplete for current child scope.
- F004 is an advisory stale-handoff issue.
