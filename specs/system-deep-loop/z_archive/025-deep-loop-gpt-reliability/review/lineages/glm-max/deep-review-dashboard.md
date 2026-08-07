# Deep Review Dashboard - glm-max Lineage

> Auto-generated. Never manually edited.

## STATUS
- Provisional verdict: CONDITIONAL
- hasAdvisories: true

## FINDINGS SUMMARY
- P0: 0 active | P1: 3 active | P2: 12 active
- Total active: 15
- New last iteration: P0=0 P1=0 P2=0 (stabilization)

## PROGRESS TABLE
| Run | Status | Focus | Dimensions | newFindingsRatio |
|-----|--------|-------|-----------|------------------|
| 1 | complete | D3 Traceability | traceability | 0.62 |
| 2 | complete | D1 Correctness | correctness | 0.20 |
| 3 | complete | D2 Security | security | 0.18 |
| 4 | complete | D4 Maintainability | maintainability | 0.09 |
| 5 | complete | Benchmark precision | correctness | 0.08 |
| 6 | complete | Phase 002 metadata drift | correctness,traceability | 0.45 |
| 7 | complete | Systemic drift sweep | traceability | 0.40 |
| 8 | complete | Mode-D fix + prompt.md | correctness | 0.09 |
| 9 | complete | Adversarial P0 hunt + status | correctness,traceability | 0.18 |
| 10 | complete | Coverage verification | all | 0.00 |

## COVERAGE
- Dimensions complete: 4/4 (correctness, security, traceability, maintainability)
- Files reviewed: ~30 (spec.md, graph-metadata.json, timeline.md, before-vs-after.md, phases 002/006/008/010/012/013/017 docs, mk-deep-loop-guard.js, mode-registry.json, deep.md/ai-council.md mirrors, prompt.md, post-dispatch-validate.ts)
- Traceability: core=partial (spec_code, checklist_evidence), overlay=executed (feature_catalog_code partial, agent_cross_runtime pass)

## TREND
- Last 3 ratios: 0.18 -> 0.00 (only 2 values post-iter-8); full series: 0.62, 0.20, 0.18, 0.09, 0.08, 0.45, 0.40, 0.09, 0.18, 0.00
- Trajectory: two productive spikes (iter 6-7 systemic drift discovery) then stabilization
- Composite stop score (telemetry): dimension coverage 1.0, last-2-avg 0.09 ≈ threshold 0.08 — would converge under convergence policy, but run is max-iterations (telemetry only)

## ACTIVE RISKS
- Blocked stops: 0
- Stuck count: 0
- Stop reason: maxIterationsReached (10/10)
- Verdict driver: 3 active P1 (no P0) → CONDITIONAL
