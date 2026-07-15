# Deep Review Dashboard

## Status
| Field | Value |
|-------|-------|
| Session | `fanout-gpt-2-1781151823427-s19oy4` |
| Artifact Dir | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/014-packed-bm25-field-weights/review/lineages/gpt-2` |
| Iterations | 6 / 6 |
| Stop Reason | maxIterationsReached |
| Provisional Verdict | CONDITIONAL |
| hasAdvisories | true |

## Findings Summary
| Severity | Active | New In Last Iteration |
|----------|--------|-----------------------|
| P0 | 0 | 0 |
| P1 | 1 | 0 |
| P2 | 2 | 0 |

## Progress Table
| Iteration | Focus | Dimensions | New Findings Ratio | New Findings | Status |
|-----------|-------|------------|---------------------|--------------|--------|
| 1 | correctness | correctness | 1.00 | P1=1 | complete |
| 2 | security | security | 0.00 | none | complete |
| 3 | traceability | traceability | 1.00 | P2=1 | complete |
| 4 | maintainability | maintainability | 1.00 | P2=1 | complete |
| 5 | traceability-stabilization | traceability | 0.00 | none | complete |
| 6 | final-stabilization | all | 0.00 | none | complete |

## Coverage
- Dimensions complete: correctness, security, traceability, maintainability.
- Core protocols: spec_code partial, checklist_evidence N/A for Level 1 packet with no checklist.
- Overlay protocols: feature_catalog_code partial, playbook_capability partial.
- Resource map coverage: skipped because target packet has no `resource-map.md`.

## Trend
- Last 3 new findings ratios: 1.00 -> 0.00 -> 0.00.
- Rolling yield stabilized, but active P1 prevents PASS.

## Active Risks
- F001 keeps the verdict CONDITIONAL until the current-corpus budget proof is corrected or REQ-001 is narrowed.
