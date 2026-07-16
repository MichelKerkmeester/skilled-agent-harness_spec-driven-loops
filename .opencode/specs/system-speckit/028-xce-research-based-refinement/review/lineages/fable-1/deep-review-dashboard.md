# Deep Review Dashboard — fable-1

> Auto-generated from `deep-review-state.jsonl` + `deep-review-findings-registry.json`. Lineage `fanout-fable-1-1781112180955-4japyt` (cli-claude-code / claude-fable-5).

## Verdict

**CONDITIONAL** | Release readiness: `in-progress` | hasAdvisories: true

## Iterations

| # | Focus | Status | New P0 | New P1 | New P2 | newFindingsRatio |
|---|-------|--------|--------|--------|--------|------------------|
| 1 | correctness | insight | 0 | 2 | 1 | 0.60 |
| 2 | security | complete | 0 | 0 | 1 | 0.15 |
| 3 | traceability + resource-map gate | insight | 0 | 1 | 1 | 0.45 |
| 4 | maintainability | complete | 0 | 0 | 2 | 0.35 |
| 5 | stabilization (all dims) | complete | 0 | 0 | 0 | 0.08 |

## Findings by Severity

| Severity | Active | Resolved |
|----------|--------|----------|
| P0 | 0 | 0 |
| P1 | 3 (F001, F002, F005) | 0 |
| P2 | 5 (F003, F004, F006, F007, F008) | 0 |

## Dimension Coverage

| Dimension | Covered | Iteration |
|-----------|---------|-----------|
| Correctness | yes | 1 (+5 replay) |
| Security | yes | 2 (+5 replay) |
| Traceability | yes | 3 (+5 replay) |
| Maintainability | yes | 4 (+5 replay) |
| Resource Map Coverage (mandatory gate) | yes | 3 |

## Protocol Coverage

| Protocol | Class | Status |
|----------|-------|--------|
| spec_code | core/hard | partial (F001, F002) |
| checklist_evidence | core/hard | pass |
| feature_catalog_code | overlay/advisory | partial (F005) |
| playbook_capability | overlay/advisory | n/a |

## Convergence

- newFindingsRatio: 0.60 → 0.15 → 0.45 → 0.35 → 0.08
- Stop reason: `maxIterationsReachedWithFullDimensionCoverage` (cap 5)
- Convergence score: 0.78
- Stabilization: iteration 5 clean (0 new findings; 1 P2 scope refinement)

## Stop State

Loop ended at maxIterations with full dimension + protocol coverage. Three P1 findings keep the verdict at CONDITIONAL; remediation is docs/metadata-only (see review-report.md §4).
