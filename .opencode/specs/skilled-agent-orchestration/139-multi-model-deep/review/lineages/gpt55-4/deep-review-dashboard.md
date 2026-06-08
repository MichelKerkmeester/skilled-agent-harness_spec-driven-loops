# Deep Review Dashboard: gpt55-4

## Status

| Field | Value |
|-------|-------|
| Provisional verdict | CONDITIONAL |
| Stop reason | maxIterationsReached |
| Iterations | 1 / 1 |
| hasAdvisories | true |
| Release readiness | in-progress |

## Findings Summary

| Severity | Active | New This Iteration |
|----------|--------|--------------------|
| P0 | 0 | 0 |
| P1 | 1 | 1 |
| P2 | 1 | 1 |

## Progress Table

| Iteration | Focus | Dimensions | New Findings Ratio | Status |
|-----------|-------|------------|--------------------|--------|
| 001 | correctness with security boundary checks | correctness, security | 1.00 | complete |

## Coverage

| Area | Status |
|------|--------|
| Correctness | covered |
| Security | covered |
| Traceability | partial |
| Maintainability | not covered |
| Core traceability protocols | partial |
| Resource map coverage | skipped, no resource-map.md present |

## Trend

Only one evidence iteration exists, so rolling average and MAD convergence signals have insufficient data. Max iteration cap forced synthesis.

## Active Risks

- P1 F001: stale owner-lease reclaim can race because existing stale owner leases are overwritten rather than atomically claimed.
- P2 F002: live adoption test shells out with interpolated temp paths.

## Gate Blockers

- Full dimension coverage did not pass before maxIterations=1.
- Claim adjudication passed for the single active P1.
