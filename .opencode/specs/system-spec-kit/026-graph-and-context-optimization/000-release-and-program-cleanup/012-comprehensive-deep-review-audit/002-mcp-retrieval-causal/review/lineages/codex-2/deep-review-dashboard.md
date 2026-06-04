# Deep Review Dashboard

## Status
Final verdict: FAIL

Release readiness: release-blocking

hasAdvisories: true

## Findings Summary
P0: 1
P1: 1
P2: 1

## Progress Table
| Iteration | Focus | New Findings Ratio | Findings | Status |
|---|---|---:|---:|---|
| 0 | init | 0.00 | 0 | initialized |
| 1 | security/correctness | 1.00 | 2 | insight |
| 2 | traceability/contracts | 0.33 | 1 | insight |
| 3 | causal/maintainability | 0.00 | 0 | clean |
| 4 | stabilization/replay | 0.00 | 0 | release-blocking |

## Coverage
Dimensions covered: 4/4

Traceability: partial

## Trend
Last ratios: 1.00, 0.33, 0.00, 0.00

Convergence: saturated after all dimensions covered; active P0 prevents release readiness.

## Active Risks
- Code Graph unavailable; review is using graphless fallback evidence.
- Active P0: community fallback can bypass scoped retrieval.
- Active P1: direct memory_search session state lacks trusted-session validation.
- Active P2: trigger matching limit contract drifts from runtime behavior.
