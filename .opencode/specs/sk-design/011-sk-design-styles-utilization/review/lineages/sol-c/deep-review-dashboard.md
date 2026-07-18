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
- Review Target: .opencode/specs/sk-design/011-sk-design-styles-utilization (spec-folder)
- Started: 2026-07-18T14:44:20Z
- Status: COMPLETE
- Iteration: 6 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-sol-c-1784385520599-ecg4bg
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: converged

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
| P1 (Required) | 3 |
| P2 (Suggestions) | 2 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| sol-c-001 | correctness lifecycle state | correctness | 1.00 | 0/1/0 | complete |
| sol-c-002 | security corpus and transport boundaries | security | 1.00 | 0/2/0 | complete |
| sol-c-003 | traceability protocols and evidence matrices | traceability | 0.75 | 0/3/0 | complete |
| sol-c-004 | maintainability and handoff safety | maintainability | 0.12 | 0/3/2 | complete |
| sol-c-005 | stabilization replay across active findings | correctness/security/traceability/maintainability | 0.00 | 0/3/2 | complete |
| sol-c-006 | graphless-fallback contract replay | correctness/security/traceability/maintainability | 0.00 | 0/3/2 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 2 |
| security | covered | 0 |
| traceability | covered | 1 |
| maintainability | covered | 2 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
### Iteration 5 — blocked by [graphlessFallbackGate]
- Recovery: Repeat stabilization with cited fallback ledger rows using canonical exact_grep, direct_read, or negative_test_inspection methods.
- Gate results: convergenceGate: true, dimensionCoverageGate: true, p0ResolutionGate: true, evidenceDensityGate: true, hotspotSaturationGate: true, claimAdjudicationGate: true, fixCompletenessReplayGate: true, candidateCoverageGate: true, graphlessFallbackGate: false
- Timestamp: 2026-07-18T15:13:36Z

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: none
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.12 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 5
- persistentSameSeverity: 5
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 5

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=16, ruledOut=10, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 phase_order (ruled_out): Parent and child links agree; evidence=.opencode/specs/sk-design/011-sk-design-styles-utilization/spec.md:100-125
- iteration 1 status_consistency (ruled_out): No spec-summary status mismatch; evidence=.opencode/specs/sk-design/011-sk-design-styles-utilization/spec.md:41-47
- iteration 2 rights_reuse (ruled_out): All consumers keep unknown-rights evidence non-authoritative; evidence=.opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/checklist.md:97-102, .opencode/specs/sk-design/011-sk-design-styles-utilization/007-shared-context-seam/spec.md:99-122
- iteration 2 cache_exposure (ruled_out): Offline and live no-cache gates are both required; evidence=.opencode/specs/sk-design/011-sk-design-styles-utilization/010-open-design-transport/plan.md:45-53,101-127, .opencode/specs/sk-design/011-sk-design-styles-utilization/010-open-design-transport/checklist.md:96-102
- iteration 2 authority_override (ruled_out): Each consumer states explicit subordinate behavior; evidence=.opencode/specs/sk-design/011-sk-design-styles-utilization/008-interface-audit-pilots/decision-record.md:51-70,234-250, .opencode/specs/sk-design/011-sk-design-styles-utilization/010-open-design-transport/plan.md:76-87
- iteration 3 checked_evidence (ruled_out): Evidence is present and resolves; evidence=.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/tasks.md:55-84, .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/tasks.md:55-84, .opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/tasks.md:55-84
- iteration 3 phase_coverage (ruled_out): Parent phases 007-010 cover Phase A-D; evidence=.opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/research/lineages/sol/research.md:368-400, .opencode/specs/sk-design/011-sk-design-styles-utilization/spec.md:100-111
- iteration 4 path_precision (ruled_out): All proposed paths use the same styles/_engine and manifest locations.; evidence=.opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/spec.md:104-112, .opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/tasks.md:79-140, .opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/decision-record.md:131-135
- iteration 4 authority_duplication (ruled_out): No contradictory authority assignment was found.; evidence=.opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/plan.md:333-343, .opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/decision-record.md:298-324
- iteration 5 adjacent_variant (ruled_out): Exact searches and direct reads found no adjacent variant requiring a new finding.; evidence=.opencode/specs/sk-design/011-sk-design-styles-utilization/009-foundations-motion/checklist.md:133-141, .opencode/specs/sk-design/011-sk-design-styles-utilization/010-open-design-transport/checklist.md:126-134, .opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/spec.md:104-112
- iteration 6 adjacent_variant (ruled_out): No adjacent variant requires a new finding.; evidence=.opencode/specs/sk-design/011-sk-design-styles-utilization/009-foundations-motion/checklist.md:133-141, .opencode/specs/sk-design/011-sk-design-styles-utilization/010-open-design-transport/checklist.md:126-134, .opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/spec.md:104-112

### Clean Search Proof
- iteration 1 phase_order (ruled_out): Parent and child links agree; evidence=.opencode/specs/sk-design/011-sk-design-styles-utilization/spec.md:100-125
- iteration 1 status_consistency (ruled_out): No spec-summary status mismatch; evidence=.opencode/specs/sk-design/011-sk-design-styles-utilization/spec.md:41-47
- iteration 2 rights_reuse (ruled_out): All consumers keep unknown-rights evidence non-authoritative; evidence=.opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/checklist.md:97-102, .opencode/specs/sk-design/011-sk-design-styles-utilization/007-shared-context-seam/spec.md:99-122
- iteration 2 cache_exposure (ruled_out): Offline and live no-cache gates are both required; evidence=.opencode/specs/sk-design/011-sk-design-styles-utilization/010-open-design-transport/plan.md:45-53,101-127, .opencode/specs/sk-design/011-sk-design-styles-utilization/010-open-design-transport/checklist.md:96-102
- iteration 2 authority_override (ruled_out): Each consumer states explicit subordinate behavior; evidence=.opencode/specs/sk-design/011-sk-design-styles-utilization/008-interface-audit-pilots/decision-record.md:51-70,234-250, .opencode/specs/sk-design/011-sk-design-styles-utilization/010-open-design-transport/plan.md:76-87
- iteration 3 checked_evidence (ruled_out): Evidence is present and resolves; evidence=.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/tasks.md:55-84, .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/tasks.md:55-84, .opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/tasks.md:55-84
- iteration 3 phase_coverage (ruled_out): Parent phases 007-010 cover Phase A-D; evidence=.opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/research/lineages/sol/research.md:368-400, .opencode/specs/sk-design/011-sk-design-styles-utilization/spec.md:100-111
- iteration 4 path_precision (ruled_out): All proposed paths use the same styles/_engine and manifest locations.; evidence=.opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/spec.md:104-112, .opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/tasks.md:79-140, .opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/decision-record.md:131-135
- iteration 4 authority_duplication (ruled_out): No contradictory authority assignment was found.; evidence=.opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/plan.md:333-343, .opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/decision-record.md:298-324
- iteration 5 adjacent_variant (ruled_out): Exact searches and direct reads found no adjacent variant requiring a new finding.; evidence=.opencode/specs/sk-design/011-sk-design-styles-utilization/009-foundations-motion/checklist.md:133-141, .opencode/specs/sk-design/011-sk-design-styles-utilization/010-open-design-transport/checklist.md:126-134, .opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/spec.md:104-112
- iteration 6 adjacent_variant (ruled_out): No adjacent variant requires a new finding.; evidence=.opencode/specs/sk-design/011-sk-design-styles-utilization/009-foundations-motion/checklist.md:133-141, .opencode/specs/sk-design/011-sk-design-styles-utilization/010-open-design-transport/checklist.md:126-134, .opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/spec.md:104-112

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: stabilization - Focus area: replay every active finding against current evidence and search for adjacent variants without opening a new scope. - Reason: all configured dimensions now have evidence; legal convergence requires consecutive iterations without new P0/P1 findings. - Required evidence: active-finding replay, exact adjacent-variant searches, candidate coverage, and final core-protocol status.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 3 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- Latest blocked_stop at run 5: graphlessFallbackGate. Recovery: Repeat stabilization with cited fallback ledger rows using canonical exact_grep, direct_read, or negative_test_inspection methods..

<!-- /ANCHOR:active-risks -->
