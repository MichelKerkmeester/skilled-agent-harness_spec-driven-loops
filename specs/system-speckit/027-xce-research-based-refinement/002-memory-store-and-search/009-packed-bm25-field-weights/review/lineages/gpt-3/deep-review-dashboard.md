# Deep Review Dashboard

## Status
| Field | Value |
|-------|-------|
| Session | `fanout-gpt-3-1781151823427-s19oy4` |
| Iterations | 6 / 6 |
| Stop Reason | `maxIterationsReached` |
| Provisional Verdict | CONDITIONAL |
| hasAdvisories | true |

## Findings Summary
| Severity | Active | New In Last Iteration |
|----------|--------|-----------------------|
| P0 | 0 | 0 |
| P1 | 2 | 0 |
| P2 | 1 | 0 |

## Progress Table
| Iteration | Focus | Ratio | New Findings | Status |
|-----------|-------|-------|--------------|--------|
| 001 | correctness | 1.00 | P1=1 | complete |
| 002 | security | 0.00 | none | complete |
| 003 | traceability | 1.00 | P1=1 | complete |
| 004 | maintainability | 1.00 | P2=1 | complete |
| 005 | traceability stabilization | 0.00 | none | complete |
| 006 | cross-dimension stabilization | 0.00 | none | complete |

## Coverage
| Area | Status |
|------|--------|
| Dimensions | 4 / 4 covered |
| Core protocols | `spec_code` partial, `checklist_evidence` pass |
| Overlay protocols | `feature_catalog_code` partial, `playbook_capability` pass |
| Resource map coverage | skipped, no `resource-map.md` at init |

## Trend
Last three `newFindingsRatio` values: `1.00 -> 0.00 -> 0.00`. Finding discovery stabilized, but active P1 findings keep the verdict CONDITIONAL.

## Active Risks
- F001: startup rebuild does not clear mutable packed postings after the last batch.
- F002: fallback scoped search can under-return because filtering happens after the top-N limit.
- F003: tests miss the startup rebuild finalization path.
