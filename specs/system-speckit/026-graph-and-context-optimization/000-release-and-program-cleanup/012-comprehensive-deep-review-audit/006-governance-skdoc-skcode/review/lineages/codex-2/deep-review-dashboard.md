# Deep Review Dashboard

## Status

| Field | Value |
| --- | --- |
| Verdict | CONDITIONAL |
| Release readiness | in-progress |
| Session | fanout-codex-2-1780595350529-qmzg9f |
| Iterations | 5 |
| Stop reason | converged |
| hasAdvisories | true |

## Findings Summary

| Severity | Active | Resolved |
| --- | ---: | ---: |
| P0 | 0 | 0 |
| P1 | 4 | 0 |
| P2 | 1 | 0 |

## Progress Table

| Iteration | Focus | New Ratio | Findings New | Status |
| ---: | --- | ---: | --- | --- |
| 1 | correctness | 1.0000 | P1=1 | complete |
| 2 | security | 0.5000 | P1=1 | complete |
| 3 | traceability | 0.3333 | P1=1 | complete |
| 4 | maintainability | 0.2308 | P1=1, P2=1 | complete |
| 5 | stabilization | 0.0000 | none | complete |

## Coverage

| Coverage Area | Status |
| --- | --- |
| correctness | complete |
| security | complete |
| traceability | complete |
| maintainability | complete |
| spec_code | partial |
| checklist_evidence | pass by absence |
| resource_map | not present at init |

## Trend

Last ratios: 0.3333 -> 0.2308 -> 0.0000. Trend is descending.

## Active Risks

- F001, F002, F003, and F004 remain active P1 findings.
- Final verdict is CONDITIONAL until active P1 drift is remediated or explicitly accepted.
- Code Graph was unavailable; graphless fallback used direct file reads and Grep/Glob evidence.
