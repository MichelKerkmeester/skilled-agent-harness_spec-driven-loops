# Deep Review Dashboard

## Status

- Session: fanout-gpt55-p017c004-2-1781757625173-xsur7n
- Lineage: gpt55-p017c004-2
- Iteration: 1 of 1
- Stop reason: maxIterationsReached
- Provisional verdict: CONDITIONAL
- hasAdvisories: false
- Release readiness: in-progress

## Findings Summary

| Severity | Active | New In Iteration 1 |
|----------|--------|--------------------|
| P0 | 0 | 0 |
| P1 | 1 | 1 |
| P2 | 0 | 0 |

## Progress Table

| Iteration | Focus | Dimensions | New Findings Ratio | Status |
|-----------|-------|------------|---------------------|--------|
| 1 | Correctness | correctness | 1.00 | complete |

## Coverage

| Dimension | Covered | Notes |
|-----------|---------|-------|
| correctness | yes | Loader/starter data path reviewed. |
| security | no | Not reached before maxIterations. |
| traceability | partial | Protocol status inferred from correctness evidence only. |
| maintainability | no | Not reached before maxIterations. |

## Trend

- Last ratios: 1.00
- Stuck count: 0
- Composite stop score: 0.00

## Active Risks

- P1 F001 blocks a clean PASS verdict.
- Coverage is incomplete because this fan-out lineage was capped at one iteration.
- Target spec strict validation passed after synthesis: 0 errors, 0 warnings.
