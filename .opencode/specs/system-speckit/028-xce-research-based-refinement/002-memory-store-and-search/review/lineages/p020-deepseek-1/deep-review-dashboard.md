# Deep Review Dashboard

## Status

- **Verdict**: CONDITIONAL
- **hasAdvisories**: false
- **Iteration**: 1 of 1

## Findings Summary

| Severity | Active | New | Refined |
|----------|--------|-----|---------|
| P0 | 0 | 0 | 0 |
| P1 | 1 | 1 | 0 |
| P2 | 0 | 0 | 0 |

## Progress Table

| Run | Focus | Dimensions | New Ratio | Status |
|-----|-------|------------|-----------|--------|
| 1 | Correctness + Security + Traceability + Maintainability | correctness,security,traceability,maintainability | 1.00 | complete |

## Coverage

| Dimension | Covered |
|-----------|---------|
| Correctness | Yes |
| Security | Yes |
| Traceability | Yes |
| Maintainability | Yes |

## Trend

- Iteration 1: newFindingsRatio = 1.00 (first iteration, all findings are new)

## Active Risks

- F001 (P1): State inconsistency in beginMaintenance — writeMarker called after state mutation. `maintenance-marker.ts:59-61`
