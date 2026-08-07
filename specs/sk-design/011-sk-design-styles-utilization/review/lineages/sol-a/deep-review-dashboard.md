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
- Started: 2026-07-18T14:43:50.582Z
- Status: INITIALIZED
- Iteration: 5 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-sol-a-1784385520599-ecg4bg
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

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
| P1 (Required) | 4 |
| P2 (Suggestions) | 0 |
| Resolved | 3 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness lifecycle/status inventory | correctness | 1.00 | 0/1/0 | complete |
| 2 | security boundaries across corpus retrieval, STUDY prompting, shared authority, and Open Design transport | security | 0.83 | 0/2/0 | complete |
| 3 | traceability across requirement closure, checklist evidence, dependency handoffs, and parent metadata | traceability | 0.50 | 0/4/0 | complete |
| 4 | maintainability across ownership clarity, schema reuse, generated metadata, and change amplification | maintainability | 0.20 | 0/5/0 | complete |
| 5 | cross-dimension stabilization and adversarial replay of all five authoritative P1 claims | correctness/security/traceability/maintainability | 0.00 | 0/5/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 1 |
| security | covered | 2 |
| traceability | covered | 0 |
| maintainability | covered | 1 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 1.75
- graphDecision: STOP_ALLOWED
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.50 -> 0.20 -> 0.00
- convergenceScore: 1.00
- openFindings: 4
- persistentSameSeverity: 4
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 4

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=5, ruledOut=2, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 3 checklist_evidence (ruled_out): All phase-004–010 checklist rows reviewed by exact grep are unchecked.; evidence=.opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/checklist.md:54-121, .opencode/specs/sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars/checklist.md:53-130
- iteration 4 schema_duplication (ruled_out): The producer/consumer contracts consistently preserve phase-007 ownership and reuse.; evidence=.opencode/specs/sk-design/011-sk-design-styles-utilization/007-shared-context-seam/spec.md:99-121, .opencode/specs/sk-design/011-sk-design-styles-utilization/009-foundations-motion/plan.md:100-105, .opencode/specs/sk-design/011-sk-design-styles-utilization/010-open-design-transport/tasks.md:55

### Clean Search Proof
- iteration 3 checklist_evidence (ruled_out): All phase-004–010 checklist rows reviewed by exact grep are unchecked.; evidence=.opencode/specs/sk-design/011-sk-design-styles-utilization/004-retrieval-substrate/checklist.md:54-121, .opencode/specs/sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars/checklist.md:53-130
- iteration 4 schema_duplication (ruled_out): The producer/consumer contracts consistently preserve phase-007 ownership and reuse.; evidence=.opencode/specs/sk-design/011-sk-design-styles-utilization/007-shared-context-seam/spec.md:99-121, .opencode/specs/sk-design/011-sk-design-styles-utilization/009-foundations-motion/plan.md:100-105, .opencode/specs/sk-design/011-sk-design-styles-utilization/010-open-design-transport/tasks.md:55

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- dimension: orchestrator-owned convergence decision - focus area: reduce stable replay state and evaluate synthesis eligibility - reason: all dimensions and the required stabilization replay are complete with zero new/refined findings and five unchanged P1s - rotation status: stabilization complete; no further LEAF dimension rotation required - blocked/productive carry-forward: do not retry exhausted inventories; preserve five authoritative IDs and three placeholder resolutions - required evidence: iteration-005 narrative, matching canonical delta/state record, and reducer-confirmed registry durability Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 4 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
