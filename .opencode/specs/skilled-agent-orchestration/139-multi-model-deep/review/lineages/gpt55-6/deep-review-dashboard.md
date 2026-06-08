# Deep Review Dashboard: gpt55-6

## Status

- Provisional verdict: `CONDITIONAL`
- Stop reason: `maxIterationsReached`
- Iterations complete: 1 / 1
- Release readiness: `in-progress`
- hasAdvisories: true

## Findings Summary

| Severity | Active | New This Iteration |
|----------|--------|--------------------|
| P0 | 0 | 0 |
| P1 | 2 | 2 |
| P2 | 1 | 1 |

## Progress Table

| Iteration | Focus | Ratio | Status | Verdict |
|-----------|-------|-------|--------|---------|
| 001 | Correctness/security breadth over daemon re-election and hook portability | 1.00 | complete | CONDITIONAL |

## Coverage

| Area | Status |
|------|--------|
| Correctness | Covered, active P1 findings |
| Security | Covered, P2 advisory |
| Traceability | Partial because packet 139 is scaffold-only |
| Maintainability | Covered via reads and lightweight syntax/JSON checks |
| Resource map coverage | Skipped, `resource-map.md` absent at init |

## Trend

- Last ratios: `1.00`
- Stuck count: 0
- Convergence score: 0.45

## Active Risks

- F001 can allow more than one fresh launcher to believe it owns a stale owner-lease handoff.
- F002 can allow replacement spawn after an unconfirmed SIGKILL.
- F003 can make the live test brittle or unsafe under hostile/unusual temp paths.
