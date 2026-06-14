# Deep Review Dashboard

## Status

- Session: `fanout-gpt-3-1781151207242-p6s19u`
- Iterations: 5 of 6
- Provisional verdict: CONDITIONAL
- Release readiness: in-progress
- hasAdvisories: false

## Findings Summary

| Severity | Active | New In Last Iteration |
|----------|--------|------------------------|
| P0 | 0 | 0 |
| P1 | 1 | 0 |
| P2 | 0 | 0 |

## Progress Table

| Iteration | Focus | Ratio | Status | Verdict |
|-----------|-------|-------|--------|---------|
| 001 | correctness | 1.00 | insight | CONDITIONAL |
| 002 | security | 0.00 | complete | PASS |
| 003 | traceability | 0.00 | complete | PASS |
| 004 | maintainability | 0.00 | complete | PASS |
| 005 | stabilization | 0.00 | complete | PASS |

## Coverage

| Dimension | Covered |
|-----------|---------|
| correctness | yes |
| security | yes |
| traceability | yes |
| maintainability | yes |

## Trend

- Last ratios: `0.00 -> 0.00 -> 0.00`
- Rolling average: `0.00`
- Composite stop score: `0.75`

## Active Risks

- F001: same-process vector search can remain on a stale attached shard after repair swap.

## Gate Blockers

- Release readiness blocked by active P1.
