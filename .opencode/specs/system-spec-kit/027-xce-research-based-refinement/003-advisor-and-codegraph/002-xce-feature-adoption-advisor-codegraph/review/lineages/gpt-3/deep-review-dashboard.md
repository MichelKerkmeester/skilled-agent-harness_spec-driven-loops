# Deep Review Dashboard: gpt-3 lineage

## Status
- Provisional verdict: CONDITIONAL
- Stop reason: maxIterationsReached
- Release readiness state: in-progress
- hasAdvisories: false

## Findings Summary
| Severity | Active | New In Latest Iteration |
|----------|--------|-------------------------|
| P0 | 0 | 0 |
| P1 | 3 | 1 |
| P2 | 0 | 0 |

## Progress Table
| Iteration | Focus | Dimensions | New Findings Ratio | Status | Verdict |
|-----------|-------|------------|---------------------|--------|---------|
| 1 | code_graph_query blast_radius trace reachability | correctness, traceability | 1.000000 | complete | CONDITIONAL |
| 2 | advisor observability public schema reachability | security, correctness | 0.500000 | complete | CONDITIONAL |
| 3 | phase-parent state and release-readiness traceability | traceability, maintainability | 0.333333 | complete | CONDITIONAL |

## Coverage
- Dimensions covered: 4/4.
- Core protocols: `spec_code=fail`, `checklist_evidence=partial`.
- Overlay protocols: `feature_catalog_code=partial`, `playbook_capability=partial`.

## Trend
- Ratios: 1.000000 -> 0.500000 -> 0.333333.
- Trend: descending, but active P1 findings prevent PASS.

## Active Risks
- Public schema and descriptor drift means shipped handler paths are not reliably reachable by MCP/CLI callers.
- Parent phase metadata can mislead resume/search and aggregate release readiness.
