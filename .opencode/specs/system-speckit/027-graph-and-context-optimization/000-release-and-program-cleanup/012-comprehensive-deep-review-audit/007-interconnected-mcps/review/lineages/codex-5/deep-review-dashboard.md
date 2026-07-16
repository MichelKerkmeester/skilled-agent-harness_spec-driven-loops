# Deep Review Dashboard

## Status
| Field | Value |
|---|---|
| Verdict | FAIL |
| Release readiness | release-blocking |
| hasAdvisories | true |
| Iterations | 7 |
| Stop reason | maxIterationsReached |
| Blocking gate | p0ResolutionGate |

## Findings Summary
| Severity | Active | New in last iteration |
|---|---:|---:|
| P0 | 1 | 0 |
| P1 | 3 | 0 |
| P2 | 5 | 0 |

## Progress Table
| Iteration | Focus | Dimensions | Ratio | New Findings |
|---:|---|---|---:|---|
| 1 | fan-out orchestration | correctness | 1.000 | P0=1 P1=2 P2=0 |
| 2 | executor contracts | security | 0.231 | P0=0 P1=1 P2=1 |
| 3 | code-graph traceability | traceability | 0.071 | P0=0 P1=0 P2=2 |
| 4 | docs and code hygiene | maintainability | 0.067 | P0=0 P1=0 P2=2 |
| 5 | fan-out replay | correctness, maintainability | 0.000 | P0=0 P1=0 P2=0 |
| 6 | MCP degradation replay | traceability, security | 0.000 | P0=0 P1=0 P2=0 |
| 7 | final saturation | all | 0.000 | P0=0 P1=0 P2=0 |

## Coverage
| Dimension | Covered |
|---|---|
| correctness | yes |
| security | yes |
| traceability | yes |
| maintainability | yes |

## Trend
Last three `newFindingsRatio` values: 0.000 -> 0.000 -> 0.000. Finding discovery stabilized, but F001 keeps the release verdict at FAIL.

## Active Risks
- F001 means fan-out can report `ok` when child CLI processes fail.
- F002 means configured concurrency does not produce actual process overlap for CLI lineages.
- F003 means per-lineage review depth is not enforced.
- Code Graph was unavailable in this session; graphless fallback evidence was used.
