# Deep Review Dashboard

## Status

| Field | Value |
|-------|-------|
| Session | `fanout-gpt-2-1781151207242-p6s19u` |
| Lineage | `gpt-2` |
| Iterations | 6 of 6 |
| Stop Reason | `converged` |
| Provisional Verdict | `CONDITIONAL` |
| hasAdvisories | true |

## Findings Summary

| Severity | Active | New in Final Iteration |
|----------|--------|------------------------|
| P0 | 0 | 0 |
| P1 | 1 | 0 |
| P2 | 1 | 0 |

## Dimension Coverage

| Dimension | Covered |
|-----------|---------|
| correctness | yes |
| security | yes |
| traceability | yes |
| maintainability | yes |

## Progress

| Iteration | Focus | Ratio | New P0 | New P1 | New P2 | Verdict |
|-----------|-------|-------|--------|--------|--------|---------|
| 001 | correctness | 1.00 | 0 | 1 | 0 | CONDITIONAL |
| 002 | security | 0.00 | 0 | 0 | 0 | PASS |
| 003 | traceability | 0.50 | 0 | 0 | 0 | CONDITIONAL |
| 004 | maintainability | 1.00 | 0 | 0 | 1 | PASS |
| 005 | stabilization | 0.00 | 0 | 0 | 0 | PASS |
| 006 | convergence-replay | 0.00 | 0 | 0 | 0 | PASS |

## Next Focus

Fix F001 and add a same-process post-repair vector query regression.

## Active Risks

- F001 keeps release readiness conditional because repaired shard data may not be visible to the live DB connection after the atomic swap.
