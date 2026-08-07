# Deep Review Dashboard — lineage glm-max

> Auto-generated status view. Source of truth is `deep-review-state.jsonl`. Read-only.

## Findings Summary
- **Active P0: 0** | **Active P1: 1** | **Active P2: 1**
- New (this lineage): F001 (P1, iter 3), F002 (P2, iter 4)
- Refined: 0 | Resolved: 0
- `hasAdvisories: true` (active P2 > 0)

## Provisional Verdict
**CONDITIONAL** — `activeP0 == 0 AND activeP1 > 0` → routes to `/speckit:plan` for F001 remediation.
`releaseReadinessState: release-blocking` (active P1 present).

## Progress Table
| Run | Status | Focus | Dimensions | NewFindingsRatio | Verdict |
|-----|--------|-------|------------|------------------|---------|
| 1 | complete | correctness (C1, C4, REPO_ROOT) | correctness | 0.00 | PASS |
| 2 | complete | security + Cluster 5 | security | 0.00 | PASS |
| 3 | complete | traceability/spec-alignment | traceability | 0.50 | CONDITIONAL |
| 4 | complete | maintainability/completeness | maintainability | 0.17 | CONDITIONAL |
| 5 | complete | adversarial replay + breadth | all | 0.00 | CONDITIONAL |

## Coverage
- **Dimensions**: correctness ✓ | security ✓ | traceability ✓ | maintainability ✓ (4/4)
- **Traceability protocols**: spec_code pass | checklist_evidence partial (F002)
- **Resource-map gate**: skipped (no `resource-map.md` at init)
- **File coverage**: cli-opencode (5 files), 5 deep-loop SKILLs + 2 sub-docs, scan-integration.cjs, plugins/README.md, orchestrate.md, 2× setup-cp-sandbox.sh, fixture dir

## Convergence Trend
- compositeStopScore: 0.78 (≥ 0.60 threshold)
- rollingAverage: STOP (avgRatio 0.0 over iters 4–5)
- madNoiseFloor: STOP (ratios at noise floor)
- dimensionCoverage: STOP (4/4 covered, stabilized)
- semanticVerdict: `all_support_stop` (semanticNovelty 0.06, findingStability 0.93)
- **stopReason: maxIterationsReached** (stopPolicy=max-iterations; convergence is telemetry only per fan-out config)

## Gate Blockers
None. Legal-stop bundle: convergenceGate ✓ | dimensionCoverageGate ✓ | p0ResolutionGate ✓ (activeP0=0) | evidenceDensityGate ✓ | hotspotSaturationGate ✓ | claimAdjudicationGate ✓ | fixCompletenessReplayGate ✓ | candidateCoverageGate ✓ | graphlessFallbackGate ✓

## Active Finding Registry (summary)
| ID | Sev | Dimension | Title | Location |
|----|-----|-----------|-------|----------|
| F001 | P1 | traceability | ai-council "primary" classification contradicts registry/SKILL.md | manual_testing_playbook.md:362 |
| F002 | P2 | maintainability | CHK-010 command non-reproducible | checklist.md:59 |
