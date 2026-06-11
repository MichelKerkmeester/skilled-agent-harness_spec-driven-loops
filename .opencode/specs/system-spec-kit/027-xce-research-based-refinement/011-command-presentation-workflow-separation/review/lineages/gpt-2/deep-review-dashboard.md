# Deep Review Dashboard

## Status

| Field | Value |
| --- | --- |
| Session | `fanout-gpt-2-1781143316976-btnnag` |
| Lineage | `gpt-2` |
| Iterations | 6 / 6 |
| Stop reason | `maxIterationsReached` |
| Provisional verdict | CONDITIONAL |
| hasAdvisories | false |

## Findings Summary

| Severity | Active | New Last Iteration |
| --- | ---: | ---: |
| P0 | 0 | 0 |
| P1 | 1 | 0 |
| P2 | 0 | 0 |

## Progress Table

| Iteration | Focus | Ratio | Findings | Status |
| ---: | --- | ---: | --- | --- |
| 1 | correctness | 0.00 | P0=0 P1=0 P2=0 | complete |
| 2 | security | 0.00 | P0=0 P1=0 P2=0 | complete |
| 3 | traceability | 1.00 | P0=0 P1=1 P2=0 | insight |
| 4 | maintainability | 0.00 | P0=0 P1=0 P2=0 | complete |
| 5 | traceability-stabilization | 0.00 | P0=0 P1=0 P2=0 | complete |
| 6 | max-iteration-final-sweep | 0.00 | P0=0 P1=0 P2=0 | complete |

## Coverage

| Dimension | Covered |
| --- | --- |
| correctness | yes |
| security | yes |
| traceability | yes |
| maintainability | yes |

Core traceability: `spec_code=partial`, `checklist_evidence=pass`.

## Trend

Last three `newFindingsRatio` values: `0.00 -> 0.00 -> 0.00`. Finding set stable with one active P1.

## Active Risks

- F001: aggregate parent status metadata remains planned while every family parent reports completed.
