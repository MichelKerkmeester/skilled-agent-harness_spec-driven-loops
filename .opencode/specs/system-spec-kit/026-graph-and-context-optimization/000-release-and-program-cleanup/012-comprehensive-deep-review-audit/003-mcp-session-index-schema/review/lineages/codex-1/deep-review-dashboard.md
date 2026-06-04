# Deep Review Dashboard

## Status

Final verdict: FAIL

hasAdvisories: false

Stop reason: converged with active release-blocking findings.

## Findings Summary

| Severity | Active | Delta |
|---|---:|---:|
| P0 | 1 | +1 |
| P1 | 1 | +1 |
| P2 | 1 | +1 |

## Progress Table

| Iteration | Focus | newFindingsRatio | Findings | Status |
|---|---|---:|---:|---|
| 001 | security | 0.50 | 1 | complete |
| 002 | correctness | 0.25 | 1 | complete |
| 003 | traceability | 0.13 | 1 | complete |
| 004 | maintainability | 0.00 | 0 | complete |
| 005 | stabilization | 0.00 | 0 | complete |

## Coverage

Dimensions covered: 4/4 (`security`, `correctness`, `traceability`, `maintainability`)

Traceability protocols: `spec_code=pass_with_findings`, `checklist_evidence=not_applicable_missing`, `feature_catalog_code=pass_with_findings`, `playbook_capability=not_applicable_missing`

## Trend

Last ratios: 0.50, 0.25, 0.13, 0.00, 0.00

## Active Risks

- Active P0 blocks release readiness.
- Scoped `memory_index_scan` cleanup can mutate stale/orphan index rows outside the requested spec folder.
- The review slice has only `spec.md`; no plan, tasks, checklist, implementation summary, description metadata, or graph metadata were present for evidence reconciliation.
- Code Graph unavailable; graphless fallback review is active.
- No reviewed source files were modified.
