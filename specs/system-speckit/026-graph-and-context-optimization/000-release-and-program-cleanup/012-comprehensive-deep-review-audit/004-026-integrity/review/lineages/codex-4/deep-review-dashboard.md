# Deep Review Dashboard

## Status

- Verdict: CONDITIONAL
- Release readiness: converged with required fixes
- hasAdvisories: true
- Stop reason: converged
- Iterations: 5 of 7

## Findings Summary

| Severity | Active | New in Final Pass |
|----------|--------|-------------------|
| P0 | 0 | 0 |
| P1 | 2 | 0 |
| P2 | 2 | 0 |

## Progress Table

| Iteration | Focus | Ratio | New Findings | Status |
|-----------|-------|-------|--------------|--------|
| 1 | correctness | 0.50 | P1:1 | complete |
| 2 | security | 0.00 | none | complete |
| 3 | traceability | 0.38 | P1:1 P2:1 | complete |
| 4 | maintainability | 0.06 | P2:1 | complete |
| 5 | stabilization | 0.00 | none | complete |

## Coverage

- Dimensions: 4 of 4 complete
- Stabilization passes: 1
- Core traceability: partial because F001 and F002 remain active
- Overlay traceability: partial because F003 remains active
- Graph coverage mode: graphless fallback with direct read and exact grep evidence

## Trend

Last three ratios: 0.38 -> 0.06 -> 0.00. Trend is descending and below the rolling stop band.

## Active Risks

- F001 and F002 are P1 integrity issues and should be remediated before treating the 026 control surface as reconciled.
- F003 and F004 are advisories that can be batched with the P1 cleanup.
