# Deep Review Dashboard

## Status

| Field | Value |
|---|---|
| Session | `fanout-gpt55r2-b-1-1781761339355-o7qylx` |
| Iteration | 1 of 1 |
| Stop reason | `maxIterationsReached` |
| Provisional verdict | `CONDITIONAL` |
| hasAdvisories | false |
| Release readiness | `in-progress` |

## Findings Summary

| Severity | Active | New | Refined |
|---|---:|---:|---:|
| P0 | 0 | 0 | 0 |
| P1 | 1 | 1 | 0 |
| P2 | 0 | 0 | 0 |

## Progress Table

| Run | Status | Focus | Dimensions | Ratio |
|---:|---|---|---|---:|
| 1 | complete | correctness, data-integrity, security, traceability | 4/4 | 1.00 |

## Coverage

| Area | Status |
|---|---|
| Dimensions | complete for single-pass scope |
| Core traceability | partial/pass mix |
| Resource map | not present at init |
| Stabilization | not run; maxIterations=1 |

## Trend

- Last ratios: 1.00.
- Rolling average STOP vote unavailable because only one evidence iteration ran.
- Dimension coverage vote true, but active P1 yields `CONDITIONAL`.

## Active Risks

- F001: DB/file atomicity gap can leave `memory_index` ahead of disk if final pending-file promotion fails.
