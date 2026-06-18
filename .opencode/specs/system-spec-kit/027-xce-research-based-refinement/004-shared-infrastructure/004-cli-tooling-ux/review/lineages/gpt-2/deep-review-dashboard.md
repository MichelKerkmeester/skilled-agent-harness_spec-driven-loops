# Deep Review Dashboard

## Status
| Field | Value |
| --- | --- |
| Session | `fanout-gpt-2-1781144891515-7jxn7r` |
| Artifact root | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/016-cli-tooling-ux/review/lineages/gpt-2` |
| Iterations | 6 / 6 |
| Stop reason | `maxIterationsReached` |
| Provisional verdict | CONDITIONAL |
| hasAdvisories | true |

## Findings Summary
| Severity | Active | IDs |
| --- | ---: | --- |
| P0 | 0 | none |
| P1 | 1 | F001 |
| P2 | 2 | F002, F003 |

## Progress Table
| Iteration | Focus | Ratio | New Findings | Status |
| ---: | --- | ---: | --- | --- |
| 1 | correctness | 1.00 | P1=1 | complete |
| 2 | security | 1.00 | P2=1 | complete |
| 3 | traceability | 1.00 | P2=1 | complete |
| 4 | maintainability | 0.00 | none | complete |
| 5 | traceability stabilization | 0.00 | none | complete |
| 6 | max-iteration replay | 0.00 | none | complete |

## Coverage
| Coverage Area | Status |
| --- | --- |
| Correctness | covered |
| Security | covered |
| Traceability | covered |
| Maintainability | covered |
| Core traceability protocols | partial |
| Resource map coverage | skipped, no `resource-map.md` present |

## Trend
Last three `newFindingsRatio` values: `0.00 -> 0.00 -> 0.00`. Finding set stabilized, but active P1 prevents PASS.

## Active Risks
- F001 keeps final verdict at CONDITIONAL.
- Code graph readiness was stale, so structural graph answers were not used.
- F002 and F003 are advisory but should be fixed before declaring the CLI UX packet fully polished.
