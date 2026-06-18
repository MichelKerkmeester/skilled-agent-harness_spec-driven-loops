# Deep Review Dashboard — fable-2 lineage

Session: `fanout-fable-2-1781112180955-4japyt` | Target: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement` | Executor: cli-claude-code / claude-fable-5

## Run Summary

| Metric | Value |
|--------|-------|
| Iterations | 5 / 5 (max) |
| Stop reason | maxIterationsReachedWithFullDimensionCoverage |
| Verdict | **CONDITIONAL** |
| Release readiness | in-progress |
| Active P0 / P1 / P2 | 0 / 3 / 5 |
| hasAdvisories | true |
| Convergence score | 0.79 |
| newFindingsRatio series | 0.60 → 0.15 → 0.45 → 0.20 → 0.05 |

## Dimension Coverage

| Dimension | Iteration | Status | Findings |
|-----------|-----------|--------|----------|
| Correctness | 1 (+5 replay) | ✅ | F001 (P1), F002 (P1), F003 (P2) |
| Security | 2 (+5 replay) | ✅ | F004 (P2) |
| Traceability | 3 (+5 replay) | ✅ | F005 (P1), F006 (P2) |
| Maintainability | 4 (+5 replay) | ✅ | F007 (P2), F008 (P2) |

## Protocol Status

| Protocol | Class | Status |
|----------|-------|--------|
| spec_code | core/hard | partial (F001, F002) |
| checklist_evidence | core/hard | pass |
| feature_catalog_code | overlay/advisory | partial (F005) |
| playbook_capability | overlay/advisory | n/a |
| Resource-map coverage gate | mandatory | executed iter 3 (F005) |

## Notable Run Event

Phases 012–015 were created by a concurrent session mid-review (2026-06-10 ~17:48 UTC); spec.md map and graph-metadata were updated to include 011–015 between iterations 1 and 5, while description.json was not — F001 narrowed accordingly rather than closed.
