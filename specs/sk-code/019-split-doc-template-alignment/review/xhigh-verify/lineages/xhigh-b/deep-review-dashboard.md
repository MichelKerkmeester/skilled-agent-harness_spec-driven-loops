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
- Review Target: .opencode/specs/sk-code/019-split-doc-template-alignment (spec-folder)
- Started: 2026-07-13T04:08:25.979Z
- Status: COMPLETE
- Iteration: 4 of 4
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-xhigh-b-1783915428096-y929h9
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
| P1 (Required) | 4 |
| P2 (Suggestions) | 1 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/2/0 | complete |
| 2 | security | security | 0.00 | 0/2/0 | complete |
| 3 | traceability | traceability | 0.50 | 0/4/0 | complete |
| 4 | maintainability | maintainability | 0.05 | 0/4/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 2 |
| security | covered | 0 |
| traceability | covered | 2 |
| maintainability | covered | 1 |

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
- Last 3 ratios: 0.00 -> 0.50 -> 0.05
- convergenceScore: 0.95
- openFindings: 5
- persistentSameSeverity: 2
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 2

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=14, ruledOut=6, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 2 secrets_exposure (ruled_out): Exact target-root scan returned no matches; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:65-68
- iteration 2 unsafe_command_guidance (ruled_out): Exact target-root scan returned no matches; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:55-60
- iteration 2 xss_instruction_safety (ruled_out): Direct context read confirms safe framing; evidence=.opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:37-63, .opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:127-168
- iteration 2 scope_mutation (ruled_out): Changed-path and direct diff inspection; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/plan.md:43-47, .opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:79-83
- iteration 4 deterministic_replay (ruled_out): Terminal replay matches prior outputs; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:47-95
- iteration 4 scope_isolation (ruled_out): Scoped Git status empty; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:55-60

### Clean Search Proof
- iteration 2 secrets_exposure (ruled_out): Exact target-root scan returned no matches; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:65-68
- iteration 2 unsafe_command_guidance (ruled_out): Exact target-root scan returned no matches; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:55-60
- iteration 2 xss_instruction_safety (ruled_out): Direct context read confirms safe framing; evidence=.opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:37-63, .opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:127-168
- iteration 2 scope_mutation (ruled_out): Changed-path and direct diff inspection; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/plan.md:43-47, .opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:79-83
- iteration 4 deterministic_replay (ruled_out): Terminal replay matches prior outputs; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:47-95
- iteration 4 scope_isolation (ruled_out): Scoped Git status empty; evidence=.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:55-60

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Synthesis at `maxIterationsReached`: preserve four active P1 findings, one P2 advisory, failed hard traceability protocols, and the scope-lock caveat for graph/continuity writes. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 4 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
