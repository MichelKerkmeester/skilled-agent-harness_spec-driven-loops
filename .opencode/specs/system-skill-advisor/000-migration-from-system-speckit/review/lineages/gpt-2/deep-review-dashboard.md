# Deep Review Dashboard

## Status
- Session: `fanout-gpt-2-1783433085887-cah79b`
- Iterations: 20 / 20
- Stop reason: maxIterationsReached
- Provisional verdict: CONDITIONAL
- hasAdvisories: true

## Findings Summary
| Severity | Active | Notes |
|----------|--------|-------|
| P0 | 0 | None found. |
| P1 | 2 | Stale plan and continuity surfaces. |
| P2 | 3 | Stale metadata/status wording. |

## Dimension Coverage
| Dimension | Covered |
|-----------|---------|
| correctness | yes |
| security | yes |
| traceability | yes |
| maintainability | yes |

## Progress
| Iteration | Focus | New Ratio | New Findings | Verdict |
|-----------|-------|-----------|--------------|---------|
| 001 | traceability-current-state | 0.35 | P1=2 P2=1 | CONDITIONAL |
| 002 | maintainability-metadata | 0.08 | P2=1 | PASS |
| 003 | correctness-live-paths | 0.00 | none | PASS |
| 004 | traceability-track-map | 0.04 | P2=1 | PASS |
| 005 | security-boundary | 0.00 | none | PASS |
| 006 | checklist-evidence | 0.00 | none | PASS |
| 007 | validation-wording | 0.04 | P2=1 | PASS |
| 008-020 | stabilization/broadened replays | 0.00 | none | PASS |

## Next Focus
Remediate active P1s by synchronizing `plan.md` and frontmatter continuity with the completed state, then refresh metadata/status wording.
