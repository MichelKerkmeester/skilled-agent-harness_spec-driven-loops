# Deep Review Dashboard: gpt-2

## Status

- Verdict: CONDITIONAL
- Stop reason: maxIterationsReached
- Iterations: 3 / 3
- hasAdvisories: true
- Release readiness: in-progress

## Findings Summary

| Severity | Active | New In Last Iteration |
|----------|--------|-----------------------|
| P0 | 0 | 0 |
| P1 | 2 | 1 |
| P2 | 1 | 1 |

## Dimension Coverage

| Dimension | Covered |
|-----------|---------|
| correctness | yes |
| security | yes |
| traceability | yes |
| maintainability | yes |

## Progress

| Iteration | Focus | Ratio | Status | Findings |
|-----------|-------|-------|--------|----------|
| 001 | correctness | 1.00 | complete | F002 |
| 002 | security | 0.00 | complete | none |
| 003 | traceability-maintainability | 1.00 | complete | F001, F003 |

## Next Focus

Remediate F001 and F002 or amend specs if the observed scope narrowing was intentional.

## Active Risks

- Core traceability remains partial because active P1 findings contradict or narrow checked spec claims.
- Code Graph MCP structural query tool was unavailable in this runtime; Grep/Read fallback was used.
