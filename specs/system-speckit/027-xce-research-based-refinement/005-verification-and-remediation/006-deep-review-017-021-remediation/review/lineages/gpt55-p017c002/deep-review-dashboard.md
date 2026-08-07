# Deep Review Dashboard - gpt55-p017c002

## Status

| Field | Value |
|-------|-------|
| Provisional verdict | PASS |
| hasAdvisories | true |
| Stop reason | maxIterationsReached |
| Release readiness state | in-progress |
| Iterations | 1 / 1 |

## Findings Summary

| Severity | Active | New This Iteration |
|----------|--------|--------------------|
| P0 | 0 | 0 |
| P1 | 0 | 0 |
| P2 | 2 | 2 |

## Progress Table

| Iteration | Focus | Dimensions | New Findings Ratio | Status |
|-----------|-------|------------|---------------------|--------|
| 1 | Correctness + traceability | correctness, traceability | 1.00 | complete |

## Coverage

| Dimension | Covered | Notes |
|-----------|---------|-------|
| correctness | yes | Request-quality source, dist, and tests reviewed. |
| security | no | Not reached under maxIterations=1. |
| traceability | yes | Core and overlay protocol pass/partial results recorded. |
| maintainability | no | P2 doc-quality advisories recorded while reviewing traceability. |

## Trend

Single iteration only; rolling average and MAD convergence signals have insufficient data.

## Active Risks

- No active P0 or P1 findings.
- P2 advisories are documentation/traceability cleanup only.
- Full deep-review convergence is not claimed because the configured fanout lineage cap was one iteration.
