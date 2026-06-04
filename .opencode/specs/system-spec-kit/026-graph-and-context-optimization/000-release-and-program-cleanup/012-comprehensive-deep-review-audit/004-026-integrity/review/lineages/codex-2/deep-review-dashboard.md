# Deep Review Dashboard: codex-2

## Status

Provisional verdict: CONDITIONAL

hasAdvisories: false

Synthesis: complete

## Findings Summary

| Severity | Active | Delta |
|---|---:|---:|
| P0 | 0 | 0 |
| P1 | 6 | 0 |
| P2 | 0 | 0 |

## Progress Table

| Iteration | Focus | newFindingsRatio | New Findings | Status |
|---:|---|---:|---:|---|
| 0 | init | 0 | 0 | initialized |
| 1 | correctness | 1.00 | 4 | insight |
| 2 | security | 0.00 | 0 | complete |
| 3 | traceability | 0.20 | 1 | insight |
| 4 | maintainability | 0.1667 | 1 | insight |
| 5 | stabilization | 0.00 | 0 | complete |

## Coverage

Dimensions covered: 4/4.

Traceability protocols covered: 4/4.

## Trend

Last ratios: 1.00, 0.00, 0.20, 0.1667, 0.00.

## Active Risks

- Code graph unavailable; direct file discovery used.
- Nested `cli-codex` dispatch skipped by self-invocation guard.
- Active P1 findings block a PASS verdict.
- Convergence stop recorded after stabilization replay; final synthesis verdict should be CONDITIONAL.
