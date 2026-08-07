# Deep Review Dashboard

## Status
- Session: `fanout-codex-2-1780596675702-cpi67p`
- Target: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`
- Iterations: 5
- Provisional verdict: CONDITIONAL
- hasAdvisories: true
- Stop reason: converged with required remediation

## Findings Summary
| Severity | Active | New in Final Iteration |
|----------|--------|------------------------|
| P0 | 0 | 0 |
| P1 | 3 | 0 |
| P2 | 2 | 0 |

## Progress Table
| Iteration | Focus | New Findings Ratio | New P0/P1/P2 | Status |
|-----------|-------|--------------------|--------------|--------|
| 1 | correctness | 0.35 | 0/1/0 | complete |
| 2 | security | 0.22 | 0/1/0 | complete |
| 3 | traceability | 0.28 | 0/1/1 | complete |
| 4 | maintainability | 0.05 | 0/0/1 | complete |
| 5 | stabilization | 0.00 | 0/0/0 | complete |

## Coverage
| Area | Status |
|------|--------|
| Correctness | covered |
| Security | covered |
| Traceability | covered |
| Maintainability | covered |
| `spec_code` | partial |
| `checklist_evidence` | pass |

## Active Risks
- P1: status truth drift for phases 003-006.
- P1: stale reducer dependency path in 002.
- P1: stale top-level child `specId` values after renumbering.
- P2: placeholder child advertised in parent metadata.
- P2: lean-parent wording ambiguity.

## Trend
Ratios: 0.35 -> 0.22 -> 0.28 -> 0.05 -> 0.00. Stabilization found no new issues.
