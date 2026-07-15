# Deep Review Dashboard

## Status

| Field | Value |
|-------|-------|
| Session | `fanout-gpt-1-1781151207242-p6s19u` |
| Iterations | 6 / 6 |
| Stop reason | `maxIterationsReached` |
| Provisional verdict | `CONDITIONAL` |
| Release readiness | `in-progress` |

## Findings Summary

| Severity | Active | IDs |
|----------|--------|-----|
| P0 | 0 | none |
| P1 | 1 | F001 |
| P2 | 0 | none |

## Dimension Coverage

| Dimension | Covered |
|-----------|---------|
| correctness | yes |
| security | yes |
| traceability | yes |
| maintainability | yes |

## Progress

| Run | Focus | Status | New Ratio | Verdict |
|-----|-------|--------|-----------|---------|
| 1 | correctness | complete | 0.00 | PASS |
| 2 | security | complete | 0.00 | PASS |
| 3 | traceability | insight | 1.00 | CONDITIONAL |
| 4 | maintainability | complete | 0.00 | PASS |
| 5 | stabilization-replay | complete | 0.00 | CONDITIONAL |
| 6 | max-iteration-final-replay | complete | 0.00 | CONDITIONAL |

## Next Focus

Resolve F001 before claiming release-ready completion.

## Blocked Stops

| Run | Blocked By | Recovery |
|-----|------------|----------|
| 5 | claimAdjudicationGate | Run one max-iteration carry-forward pass and synthesize CONDITIONAL with F001 active. |

## Graph Convergence

Code graph was stale; graphless fallback used direct Read/Grep evidence.
