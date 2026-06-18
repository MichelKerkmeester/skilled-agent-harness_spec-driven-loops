# Deep Review Dashboard

## Status

| Field | Value |
|-------|-------|
| Session | `fanout-gpt55-p020-1-1781756632158-pqwfer` |
| Iteration | 1 of 1 |
| Provisional verdict | PASS |
| hasAdvisories | true |
| Stop reason | maxIterations |
| Release readiness | in-progress |

## Findings Summary

| Severity | Active | New This Iteration |
|----------|--------|--------------------|
| P0 | 0 | 0 |
| P1 | 0 | 0 |
| P2 | 1 | 1 |

## Dimension Coverage

| Dimension | Covered | Notes |
|-----------|---------|-------|
| correctness | yes | Iteration 001 |
| security | no | Not reached in maxIterations=1 |
| traceability | partial | Protocol sample only |
| maintainability | partial | P2 test coverage advisory |

## Progress

| Iteration | Focus | Ratio | Findings | Status |
|-----------|-------|-------|----------|--------|
| 001 | correctness | 0.10 | P0=0 P1=0 P2=1 | complete |

## Next Focus

Max iterations reached. If continued, run traceability over verification claims and decide whether direct retry-manager marker integration coverage should remain advisory.

## Active Risks

- Code graph was stale and not used as finding evidence.
- Full legal STOP gates did not pass because only 1/4 dimensions were covered; synthesis proceeds because `maxIterations=1` is the configured stop condition.
