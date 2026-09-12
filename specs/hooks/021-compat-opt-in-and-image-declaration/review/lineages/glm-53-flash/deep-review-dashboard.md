# Deep Review Dashboard - Session Overview

Auto-generated from JSONL state log and strategy file. Regenerated after every iteration evaluation.

## Status
- Review Target: specs/hooks/021-compat-opt-in-and-image-declaration (spec-folder)
- Status: COMPLETE
- Iteration: 1 of 1
- Provisional Verdict: CONDITIONAL
- hasAdvisories: true (4 active P2)

## Findings Summary
| Severity | Count | Trend |
|----------|------:|-------|
| P0 (Blockers) | 0 | - |
| P1 (Required) | 1 | new (F1, adjudicated, held at P1) |
| P2 (Suggestions) | 4 | new (F2, F3, F4, F5) |

## Dimension Coverage
| Dimension | Status | Iteration | Findings |
|-----------|--------|-----------|----------|
| correctness | Covered | 1 | 2 (F1, F2) |
| security | Not covered | - | 0 |
| traceability | Incidental (not counted) | - | 2 (F4, F5) |
| maintainability | Incidental (not counted) | - | 1 (F3) |

## Traceability Coverage
| Protocol | Level | Status | Findings |
|----------|-------|--------|----------|
| spec_code | core | pass (REQ-001..006 verified, REQ-007 supported, REQ-008 recorded-unknown) | - |
| checklist_evidence | core | notApplicable (Level 1, no checklist.md, AC_COVERAGE exempt) | - |
| resource_map | core | notApplicable (resource-map.md absent, coverage gate skipped) | - |

## Progress
| # | Dimension | Ratio | P0/P1/P2 | Status |
|---|-----------|-------|----------|--------|
| 1 | correctness | 1.00 | 0/1/4 | cap reached (stopReason maxIterationsReached) |

## Trend
- Last 3 ratios: [1.0] [single-iteration lineage]
- Stuck count: 0
- Gate violations: 3 (dimensionCoverageGate, hotspotSaturationGate, candidateCoverageGate, recorded as terminal evidence, not vetoing: iteration_count 1 >= max_iterations 1 is a hard stop)

## Next Focus
security (D2), uncovered, first in the risk-ordered queue when the cap permits. Then: responses-API applicability coverage (F2), harness control D (F1).

## Run Notes
- Session: fanout-glm-53-flash-1789146937931-6gxjep · generation 1 · lineageMode new · executor cli-pi (glm-5.3-flash, reasoningEffort max) · detached inline execution
- Telemetry: convergenceScore 0.0 · weightedStopScore 0.0 · newFindingsRatio 1.0 · stuck 0 · coverageAge 0 · claimAdjudication passed (activeP0P1 1)
- Artifacts: deep-review-config.json · deep-review-state.jsonl (5 records) · deep-review-strategy.md · prompts/iteration-001.md · iterations/iteration-001.md · deltas/iter-001.jsonl (9 records) · deep-review-findings-registry.json (5 open, 0 resolved) · review-report.md · this dashboard · invocation-metadata.json · effect/audit ledgers (parent scaffold) · gateway receipts under .executor-state/
- Deviations (detail in review-report.md, Executive Summary): state records hand-authored (direct-write invocation, no review-mode projection), reducer/convergence scripts not run (out-of-lineage writes, graphless), continuity save skipped, executor-dispatch steps satisfied inline
