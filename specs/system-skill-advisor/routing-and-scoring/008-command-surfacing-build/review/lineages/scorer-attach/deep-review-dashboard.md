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
- Review Target: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build (spec-folder)
- Started: 2026-11-13T06:27:27Z
- Status: COMPLETE
- Iteration: 5 of 5
- Provisional Verdict: PASS
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: fanout-scorer-attach-1794550137809-1ecgc7
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
| P1 (Required) | 0 |
| P2 (Suggestions) | 7 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/2 | complete |
| 2 | security | security | 0.33 | 0/0/1 | complete |
| 3 | traceability | traceability | 0.40 | 0/0/2 | complete |
| 4 | maintainability | maintainability | 0.29 | 0/0/2 | complete |
| 5 | stabilization | correctness/security/traceability/maintainability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 2 |
| security | covered | 1 |
| traceability | covered | 2 |
| maintainability | covered | 2 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: none
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.40 -> 0.29 -> 0.00
- convergenceScore: 1.00
- openFindings: 7
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
- candidateCoverage: covered=13, ruledOut=11, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 generated_table_drift (ruled_out): verified by direct data comparison; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:14-42
- iteration 1 state_transition (ruled_out): contract decision, not a defect; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:359-364,394-399
- iteration 1 prototype_pollution (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:247-249,375-377
- iteration 2 policy_misclassification (ruled_out): verified by executed comparison; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:64-122
- iteration 2 policy_misclassification (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1103-1110
- iteration 2 holdout_leak (ruled_out): verified by exact search and direct read; evidence=.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:511-520,588-590
- iteration 2 policy_misclassification (ruled_out): verified against the command own contract; evidence=.skilled/commands/doctor/install.md:5, .skilled/commands/doctor/_routes.yaml:626-645
- iteration 3 cross_reference_integrity (ruled_out): verified by executed existence check; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:14-42
- iteration 3 cross_reference_integrity (ruled_out): verified by executed comparison; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:560-575
- iteration 3 doc_code_drift (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:283-303
- iteration 4 duplicate_policy_sources (ruled_out): verified by executed comparison; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:1180-1223
- iteration 5 finding_staleness (ruled_out): verified by direct reread; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:385, .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:750-751
- iteration 5 severity_inflation (ruled_out): trigger condition unmet; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:353-388
- iteration 5 scope_leak (ruled_out): verified by inventory; evidence=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/scorer-attach/iterations/iteration-005.md

### Clean Search Proof
- iteration 1 generated_table_drift (ruled_out): verified by direct data comparison; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:14-42
- iteration 1 state_transition (ruled_out): contract decision, not a defect; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:359-364,394-399
- iteration 1 prototype_pollution (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:247-249,375-377
- iteration 2 policy_misclassification (ruled_out): verified by executed comparison; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:64-122
- iteration 2 policy_misclassification (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1103-1110
- iteration 2 holdout_leak (ruled_out): verified by exact search and direct read; evidence=.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:511-520,588-590
- iteration 2 policy_misclassification (ruled_out): verified against the command own contract; evidence=.skilled/commands/doctor/install.md:5, .skilled/commands/doctor/_routes.yaml:626-645
- iteration 3 cross_reference_integrity (ruled_out): verified by executed existence check; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:14-42
- iteration 3 cross_reference_integrity (ruled_out): verified by executed comparison; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:560-575
- iteration 3 doc_code_drift (ruled_out): verified by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:283-303
- iteration 4 duplicate_policy_sources (ruled_out): verified by executed comparison; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:1180-1223
- iteration 5 finding_staleness (ruled_out): verified by direct reread; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:385, .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:750-751
- iteration 5 severity_inflation (ruled_out): trigger condition unmet; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:353-388
- iteration 5 scope_leak (ruled_out): verified by inventory; evidence=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/scorer-attach/iterations/iteration-005.md

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining - Focus area: synthesis - Reason: convergence reached at the iteration cap with no P0 or P1 active - Rotation status: complete - Blocked/productive carry-forward: no blocked approaches; correctness and safety were the productive dimensions - Required evidence: the findings registry, the seven iteration records, and the report Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 7 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
