# Deep Review Dashboard - 009-deep-review-decommission (lineage: deepseek-review)

> Auto-generated. Sole inputs are `deep-review-state.jsonl`, `deep-review-strategy.md` and `deep-review-findings-registry.json`.

## STATUS

| Field | Value |
|-------|-------|
| Provisional verdict | CONDITIONAL |
| hasAdvisories | false (PASS-only field; verdict is CONDITIONAL on 9 active P1) |
| Active findings | P0: 0 · P1: 9 · P2: 8 |
| Iterations run | 6 of 6 |
| Stop policy | max-iterations (cap reached) |
| Stop reason | `maxIterationsReached` - terminal ceiling; synthesis ran without legal-stop veto |
| Lifecycle | sessionId=fanout-deepseek-review-1789148343059-q7g4rk · generation=1 · lineageMode=new |

## FINDINGS SUMMARY

| Severity | Active | New this iteration | Delta |
|----------|-------:|-------------------:|------:|
| P0 | 0 | 0 | 0 |
| P1 | 9 | 0 | 0 |
| P2 | 8 | 0 | 0 |

## PROGRESS TABLE

| Run | Status | Focus | Dimensions | newFindingsRatio | Findings | Duration |
|-----|--------|-------|------------|-----------------:|---------:|---------:|
| 1 | complete | Doctor MCP route + install/debug workflows | correctness, traceability | 1.00 | 3 | 14m 00s |
| 2 | complete | Trust boundary, rehomed env, caller surfaces | security, correctness, maintainability | 0.52 | 4 | 17m 00s |
| 3 | complete | Spec-kit cross-skill surfaces | traceability | 0.41 | 4 | 16m 00s |
| 4 | complete | Bin map, retained names, coverage bookkeeping | maintainability | 0.15 | 3 | 15m 00s |
| 5 | complete | Packet completion claims and retired coverage | traceability | 0.13 | 3 | 16m 00s |
| 6 | complete | Adversarial replay of the P1 set + gates | verification (all four re-read) | 0.047 | 0 new · 1 refined | 7m 00s |

## COVERAGE

| Item | State |
|------|-------|
| Dimensions completed | 4 of 4 (correctness, security, traceability, maintainability) |
| Traceability protocols | core: spec_code pass · checklist_evidence pass (`notApplicable` inside the target) · overlay: feature_catalog_code pass, playbook_capability pass |
| Files reviewed | 60+ across iterations; 14 re-read in the final pass |
| Resource map gate | skipped (`resource-map.md` absent at init). `resource-map.md` emission was not run either: the emitter is `reduce-state.cjs --emit-resource-map`, which also writes reducer anchors into the spec folder, outside this lineage's write containment. |

## TREND

| Signal | Value |
|--------|-------|
| Last 3 ratios | 0.15 → 0.13 → 0.047 |
| Direction | descending |
| Rolling average (weight 0.30) | 0.0885 (above 0.08 -> CONTINUE vote) |
| MAD noise floor (weight 0.25) | 0.284 vs latest 0.047 -> STOP vote |
| Dimension coverage vote (weight 0.45) | stop (4/4 dimensions, 2/2 core protocols, coverage_age 2) |
| Composite stop score | 0.70 (>= 0.60; composite would also have promoted STOP) |
| Legal-stop gates | 9/9 pass - convergenceGate 0.70, dimensionCoverageGate pass, p0ResolutionGate pass (activeP0 0), evidenceDensityGate pass, hotspotSaturationGate pass, claimAdjudicationGate pass (9 active P0/P1, all adjudicated), fixCompletenessReplayGate pass trivially, candidateCoverageGate pass (searchDebt []), graphlessFallbackGate pass (`graphless_fallback`, ledger rows present) |

## ACTIVE RISKS

| Risk | State |
|------|-------|
| Guard violations | none |
| Stuck count | 0 (ratios stayed above `noProgressThreshold` until the final verification pass, then the cap stop applied) |
| Blocked stops | 0 (`blockedBy: []` in every iteration; no `blocked_stop` event persisted) |
| Budget warnings | none |
| Review containment | read-only probes only; executor inline in this process |
| Verification debt | `validate.sh` (phase 008 owes the recursive strict run) and the three daemon states (traced statically) |
| Open remediation | 9 active P1 -> `/speckit:plan` |
