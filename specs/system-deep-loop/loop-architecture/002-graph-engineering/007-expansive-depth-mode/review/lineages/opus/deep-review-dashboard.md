---
title: Deep Review Dashboard
description: Auto-generated reducer view over the review packet.
---

# Deep Review Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active review packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Review Target: 17a9ddbcb68..555487146e2 -- .skilled/skills/system-deep-loop .skilled/commands/deep (files)
- Started: 2026-11-20T19:07:06.514Z
- Status: COMPLETE
- Iteration: 24 of 24
- Provisional Verdict: FAIL
- Failed required gates at stop: scope, coverage
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-opus-1795201537192-sq1ivw
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:dimension-expansion -->
## 2A. DIMENSION EXPANSION
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:dimension-expansion -->
<!-- ANCHOR:findings-summary -->
## 3. FINDINGS SUMMARY

| Severity | Count |
|----------|------:|
| P0 (Blockers) | 0 |
| P1 (Required) | 2 |
| P2 (Suggestions) | 10 |
| Resolved | 1 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | Frontier node F-1-001: correctness | correctness | 1.00 | 0/0/2 | complete |
| 2 | Frontier node F-1-003: correctness | correctness | 0.71 | 0/1/0 | complete |
| 3 | Frontier node F-1-005: correctness | correctness | 0.13 | 0/0/1 | complete |
| 4 | Frontier node F-2-006: correctness | correctness | 0.11 | 0/0/1 | complete |
| 5 | Frontier node F-1-001: security | security | 0.10 | 0/0/1 | complete |
| 6 | Frontier node F-1-003: security | security | 0.33 | 0/1/0 | complete |
| 7 | Frontier node F-1-005: security | security | 0.00 | 0/0/0 | complete |
| 8 | Frontier node F-2-006: security | security | 0.06 | 0/0/1 | complete |
| 9 | Frontier node F-1-001: traceability | traceability | 0.06 | 0/0/1 | complete |
| 10 | Frontier node F-1-003: traceability | traceability | 0.00 | 0/0/0 | complete |
| 11 | Frontier node F-1-005: traceability | traceability | 0.05 | 0/0/1 | complete |
| 12 | Frontier node F-2-006: traceability | traceability | 0.00 | 0/0/0 | complete |
| 13 | Frontier node F-1-001: maintainability | maintainability | 0.05 | 0/0/1 | complete |
| 14 | Frontier node F-1-003: maintainability | maintainability | 0.05 | 0/0/1 | complete |
| 15 | Frontier node F-1-005: maintainability | maintainability | 0.05 | 0/0/1 | complete |
| 16 | Frontier node F-2-006: maintainability | maintainability | 0.00 | 0/0/0 | complete |
| 17 | Recovery: traceability protocol replay (spec_code) | traceability | 0.00 | 0/0/0 | complete |
| 18 | Recovery: live confirmation of blocked-stop findings | correctness | 0.00 | 0/0/0 | complete |
| 19 | Recovery: line-level reread of the pid-reuse path | security | 0.00 | 0/0/0 | complete |
| 20 | Recovery: primary evidence for the claude stream-json event shape | correctness | 0.00 | 0/0/0 | complete |
| 21 | Recovery: severity check on the stamp-omission finding | security | 0.00 | 0/0/0 | complete |
| 22 | Recovery: sizing the 20 MB stdout cap against a real run | security | 0.00 | 0/0/0 | complete |
| 23 | Recovery: checklist_evidence replay across the child phases | traceability | 0.00 | 0/0/0 | complete |
| 24 | Recovery: anchor check of every open finding | maintainability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 4 |
| security | covered | 3 |
| traceability | covered | 2 |
| maintainability | covered | 3 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
### Iteration 17 — blocked by [dimensionCoverageGate]
- Recovery: Clear the failed legal-stop gates before stopping: dimensionCoverageGate.
- Gate results: candidateCoverageGate: true, claimAdjudicationGate: true, convergenceGate: true, dimensionCoverageGate: false, evidenceDensityGate: true, fixCompletenessReplayGate: true, graphlessFallbackGate: true, hotspotSaturationGate: true, p0ResolutionGate: true
- Timestamp: 2026-11-20T19:33:55.361Z

### Iteration 19 — blocked by [dimensionCoverageGate]
- Recovery: Clear the failed legal-stop gates before stopping: dimensionCoverageGate.
- Gate results: candidateCoverageGate: true, claimAdjudicationGate: true, convergenceGate: true, dimensionCoverageGate: false, evidenceDensityGate: true, fixCompletenessReplayGate: true, graphlessFallbackGate: true, hotspotSaturationGate: true, p0ResolutionGate: true
- Timestamp: 2026-11-20T19:35:44.789Z

### Iteration 21 — blocked by [dimensionCoverageGate]
- Recovery: Clear the failed legal-stop gates before stopping: dimensionCoverageGate.
- Gate results: candidateCoverageGate: true, claimAdjudicationGate: true, convergenceGate: true, dimensionCoverageGate: false, evidenceDensityGate: true, fixCompletenessReplayGate: true, graphlessFallbackGate: true, hotspotSaturationGate: true, p0ResolutionGate: true
- Timestamp: 2026-11-20T19:37:57.895Z

### Iteration 22 — blocked by [dimensionCoverageGate]
- Recovery: Clear the failed legal-stop gates before stopping: dimensionCoverageGate.
- Gate results: candidateCoverageGate: true, claimAdjudicationGate: true, convergenceGate: true, dimensionCoverageGate: false, evidenceDensityGate: true, fixCompletenessReplayGate: true, graphlessFallbackGate: true, hotspotSaturationGate: true, p0ResolutionGate: true
- Timestamp: 2026-11-20T19:38:34.211Z

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 1.00
- graphDecision: STOP_ALLOWED
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.00 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 12
- persistentSameSeverity: 0
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 0

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=15, ruledOut=16, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 boundary_condition (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts:101
- iteration 2 process_lifecycle (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:321
- iteration 3 idempotency (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-state-contract.ts:221
- iteration 3 dry_run_side_effect (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:2361
- iteration 4 input_validation (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1097
- iteration 5 path_traversal (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1908
- iteration 5 injection (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs:100
- iteration 6 side_effect (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3957
- iteration 7 injection (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:2205
- iteration 7 dry_run_side_effect (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts:404
- iteration 8 input_validation (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:195
- iteration 9 doc_drift (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-salvage.md:84
- iteration 10 doc_drift (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:135
- iteration 11 doc_drift (ruled_out): verified by search; evidence=.skilled/skills/system-deep-loop/runtime/references/script-interface-contract.md:66
- iteration 12 doc_drift (ruled_out): verified by search and read; evidence=.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-pass-evidence.vitest.ts:162
- iteration 13 complexity (ruled_out): no failure tied to size; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1
- iteration 14 duplication (ruled_out): behaviorally equal; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1030
- iteration 15 duplication (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:62
- iteration 16 duplication (ruled_out): restraint rule: two is not a pattern; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:33
- iteration 17 spec_drift (ruled_out): 011 hits concern Next Focus only; evidence=specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/spec.md:146
- iteration 18 state_transition (ruled_out): live case does not involve claimAdjudicationGate; evidence=specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review/lineages/opus/deep-review-state.jsonl:20
- iteration 19 pid_reuse (ruled_out): harm needs pid reuse plus operator --stop; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4357
- iteration 20 input_validation (ruled_out): installed CLI emits the key; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:207
- iteration 21 trust_boundary (ruled_out): finding stands at P2; evidence=.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:470
- iteration 22 resource_exhaustion (ruled_out): about 5x measured headroom; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4791
- iteration 23 spec_drift (ruled_out): rows cover other features; evidence=specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/acceptance-criteria.md:64
- iteration 24 doc_drift (ruled_out): one anchor corrected in narrative; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:384

### Clean Search Proof
- iteration 1 boundary_condition (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts:101
- iteration 2 process_lifecycle (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:321
- iteration 3 idempotency (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-state-contract.ts:221
- iteration 3 dry_run_side_effect (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:2361
- iteration 4 input_validation (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1097
- iteration 5 path_traversal (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1908
- iteration 5 injection (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs:100
- iteration 6 side_effect (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3957
- iteration 7 injection (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:2205
- iteration 7 dry_run_side_effect (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-db.ts:404
- iteration 8 input_validation (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:195
- iteration 9 doc_drift (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-salvage.md:84
- iteration 10 doc_drift (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:135
- iteration 11 doc_drift (ruled_out): verified by search; evidence=.skilled/skills/system-deep-loop/runtime/references/script-interface-contract.md:66
- iteration 12 doc_drift (ruled_out): verified by search and read; evidence=.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-pass-evidence.vitest.ts:162
- iteration 13 complexity (ruled_out): no failure tied to size; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1
- iteration 14 duplication (ruled_out): behaviorally equal; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1030
- iteration 15 duplication (ruled_out): verified by direct read; evidence=.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:62
- iteration 16 duplication (ruled_out): restraint rule: two is not a pattern; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:33
- iteration 17 spec_drift (ruled_out): 011 hits concern Next Focus only; evidence=specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/spec.md:146
- iteration 18 state_transition (ruled_out): live case does not involve claimAdjudicationGate; evidence=specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review/lineages/opus/deep-review-state.jsonl:20
- iteration 19 pid_reuse (ruled_out): harm needs pid reuse plus operator --stop; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4357
- iteration 20 input_validation (ruled_out): installed CLI emits the key; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:207
- iteration 21 trust_boundary (ruled_out): finding stands at P2; evidence=.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:470
- iteration 22 resource_exhaustion (ruled_out): about 5x measured headroom; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4791
- iteration 23 spec_drift (ruled_out): rows cover other features; evidence=specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/acceptance-criteria.md:64
- iteration 24 doc_drift (ruled_out): one anchor corrected in narrative; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:384

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:frontier -->
## 10B. FRONTIER
- Frontier size: 4 nodes (0 open, 0 active, 4 answered, 0 exhausted, 0 blocked, 0 abstained)
- Pruned nodes: 0
- Revisits: 0
- Budget depth1: 12 of 12 iterations spent
- Budget depth2: 4 of 8.4 iterations spent
- Budget depth3: 0 of 8 iterations spent
- Active node: none

<!-- /ANCHOR:frontier -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none; the iteration cap is reached - Focus area: synthesis - Reason: maxIterations 24 - Rotation status: frontier drained; legal convergence is blocked by the hard spec_code fail, so the stop is maxIterationsReached - Required evidence: terminal gates and review report Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- Latest blocked_stop at run 22: dimensionCoverageGate. Recovery: Clear the failed legal-stop gates before stopping: dimensionCoverageGate..

<!-- /ANCHOR:active-risks -->
