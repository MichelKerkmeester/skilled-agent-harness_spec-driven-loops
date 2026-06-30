# Deep Review Dashboard

## Status
- Verdict: PASS
- Release readiness: converged
- hasAdvisories: true
- Stop reason: converged
- Iterations: 5 of 6

## Findings Summary
| Severity | Active | New | Refined |
|----------|--------|-----|---------|
| P0 | 0 | 0 | 0 |
| P1 | 0 | 0 | 0 |
| P2 | 3 | 3 | 0 |

## Progress Table
| Iteration | Focus | Dimensions | New Findings Ratio | New Findings | Status |
|-----------|-------|------------|--------------------|--------------|--------|
| 001 | correctness | correctness | 0.00 | P0=0 P1=0 P2=0 | complete |
| 002 | security | security | 0.00 | P0=0 P1=0 P2=0 | complete |
| 003 | traceability | traceability | 1.00 | P0=0 P1=0 P2=1 | complete |
| 004 | maintainability | maintainability | 1.00 | P0=0 P1=0 P2=2 | complete |
| 005 | stabilization | all | 0.00 | P0=0 P1=0 P2=0 | complete |

## Coverage
- Dimensions covered: 4/4.
- Core protocols: `spec_code=pass`, `checklist_evidence=pass`.
- Overlay protocols: `feature_catalog_code=pass`, `playbook_capability=pass`.
- Resource map coverage: skipped because no `resource-map.md` existed at init.

## Trend
- Last 3 `newFindingsRatio` values: 1.00 -> 1.00 -> 0.00.
- Stabilization pass found no new P0/P1 findings.

## Active Risks
- P2 F001: shipped spec has an unresolved open question.
- P2 F002: causal boost comments still refer to the removed CTE path.
- P2 F003: latency assertion uses wall-clock comparison and may be noisy.

## Graph Convergence
- graphDecision: STOP_ALLOWED.
- graphBlockers: none.

## Corruption Warnings
- None.
