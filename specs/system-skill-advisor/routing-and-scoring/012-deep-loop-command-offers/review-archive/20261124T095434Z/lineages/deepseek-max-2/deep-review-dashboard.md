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
- Review Target: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers (spec-folder)
- Started: 2026-11-24T09:08:05.774Z
- Status: COMPLETE
- Iteration: 5 of 5
- Provisional Verdict: FAIL
- Failed required gates at stop: coverage
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: fanout-deepseek-max-2-1795511183570-92w0ez
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
| P1 (Required) | 1 |
| P2 (Suggestions) | 5 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 0.00 | 0/0/0 | complete |
| 2 | security | security | 0.00 | 0/0/0 | complete |
| 3 | traceability | traceability | 1.00 | 0/0/4 | complete |
| 4 | maintainability | maintainability | 1.00 | 0/0/2 | complete |
| 5 | traceability | traceability | 0.33 | 0/1/5 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 0 |
| security | covered | 0 |
| traceability | covered | 6 |
| maintainability | covered | 0 |

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
- Last 3 ratios: 1.00 -> 1.00 -> 0.33
- convergenceScore: 0.67
- openFindings: 6
- persistentSameSeverity: 1
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 1

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graph
- candidateCoverage: covered=11, ruledOut=7, deferred=1, blocked=0

### Search Debt
- iteration 5 stale_evidence_pointer (deferred): carried forward unchanged; remediation is a docs edit outside this lineage; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:58

### Ruled-Out Candidates
- iteration 1 logic_error (ruled_out): verified by live probe and direct read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:326
- iteration 1 state_transition (ruled_out): observed parity at the gate layer; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5306
- iteration 1 boundary_condition (ruled_out): verified by live probe; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:592
- iteration 2 injection (ruled_out): verified by direct read of the policy table and metadata; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:71, .skilled/skills/system-deep-loop/command-metadata.json:9
- iteration 2 unbounded_resource_consumption (ruled_out): measured, not inferred; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:592
- iteration 2 secret_exposure (ruled_out): exact search returned nothing; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:64
- iteration 4 summary_miscount (ruled_out): parsed, not trusted; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:291
- iteration 5 summary_miscount (ruled_out): confirmed by running terminal-gates.cjs; evidence=.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1708

### Clean Search Proof
- iteration 1 logic_error (ruled_out): verified by live probe and direct read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:326
- iteration 1 state_transition (ruled_out): observed parity at the gate layer; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5306
- iteration 1 boundary_condition (ruled_out): verified by live probe; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:592
- iteration 2 injection (ruled_out): verified by direct read of the policy table and metadata; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:71, .skilled/skills/system-deep-loop/command-metadata.json:9
- iteration 2 unbounded_resource_consumption (ruled_out): measured, not inferred; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:592
- iteration 2 secret_exposure (ruled_out): exact search returned nothing; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:64
- iteration 4 summary_miscount (ruled_out): parsed, not trusted; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:291
- iteration 5 summary_miscount (ruled_out): confirmed by running terminal-gates.cjs; evidence=.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1708

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- None. This is the last iteration under `maxIterations: 5`, and the run proceeds to synthesis with stop reason `maxIterationsReached`. - Rotation status: fourth rotation complete; no dimension is uncovered. - Blocked/productive carry-forward: the productive category "producer read, then live exercise" carried the run; the exhausted category "citation resolution" is closed. - Required evidence for synthesis: the seven active findings, the two protocol statuses, the terminal gate rows, and the four-dimension coverage record.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 1 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
