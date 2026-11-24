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
- Started: 2026-11-24T09:56:49.000Z
- Status: COMPLETE
- Iteration: 5 of 5
- Provisional Verdict: FAIL
- Failed required gates at stop: coverage
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-deepseek-max-3-1795514074741-gl47kr
- Parent Session: 2026-11-24T09:54:34.000Z
- Lifecycle Mode: new
- Generation: 4
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
| P1 (Required) | 0 |
| P2 (Suggestions) | 5 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 0.00 | 0/0/0 | complete |
| 2 | security | security | 1.00 | 0/0/1 | complete |
| 3 | traceability | traceability | 0.75 | 0/0/3 | complete |
| 4 | traceability | traceability | 0.00 | 0/0/0 | complete |
| 5 | maintainability | maintainability | 0.20 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 0 |
| security | covered | 1 |
| traceability | covered | 3 |
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
- Last 3 ratios: 0.75 -> 0.00 -> 0.20
- convergenceScore: 0.80
- openFindings: 5
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
- graphCoverageMode: graph
- candidateCoverage: covered=17, ruledOut=15, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 logic_error (ruled_out): verified by live probe of the producer; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:569, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4628
- iteration 1 state_transition (ruled_out): verified by live probe and direct read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1301, .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1074
- iteration 1 boundary_condition (ruled_out): verified by timing the producer; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:629, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4921
- iteration 1 logic_error (ruled_out): verified by live probe and the serving test; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:274, .skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts:107
- iteration 2 trust_boundary (ruled_out): verified by direct read of the row table and the return path; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:64, .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1291
- iteration 2 secret_exposure (ruled_out): grep over all six changed files returned no credential literal; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1
- iteration 2 unbounded_input (ruled_out): verified by probe at 90,000 characters; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:629
- iteration 2 injection (ruled_out): grep over the packet docs and fixture returned no hit; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:1
- iteration 3 spec_code_drift (ruled_out): probe pair and direct searches agree with the rows; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json:1, .skilled/skills/system-deep-loop/hub-router.json:34
- iteration 3 decision_supersession (ruled_out): ADR-001 states the D1 replacement explicitly; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:56
- iteration 4 false_tick (ruled_out): fifteen reruns plus a whole-row read found no false tick; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:36
- iteration 4 missing_adr (ruled_out): three ADRs read in full; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:33
- iteration 4 summary_miscount (ruled_out): counts agree; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:298
- iteration 4 stale_evidence (ruled_out): nine cells read by content; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:93
- iteration 5 comment_hygiene (ruled_out): grep over eight files returned no hit; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:569
- iteration 5 drift_guard_coverage (ruled_out): read of the reader and its assertion; evidence=.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:120

### Clean Search Proof
- iteration 1 logic_error (ruled_out): verified by live probe of the producer; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:569, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4628
- iteration 1 state_transition (ruled_out): verified by live probe and direct read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1301, .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1074
- iteration 1 boundary_condition (ruled_out): verified by timing the producer; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:629, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4921
- iteration 1 logic_error (ruled_out): verified by live probe and the serving test; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:274, .skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts:107
- iteration 2 trust_boundary (ruled_out): verified by direct read of the row table and the return path; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:64, .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1291
- iteration 2 secret_exposure (ruled_out): grep over all six changed files returned no credential literal; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1
- iteration 2 unbounded_input (ruled_out): verified by probe at 90,000 characters; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:629
- iteration 2 injection (ruled_out): grep over the packet docs and fixture returned no hit; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:1
- iteration 3 spec_code_drift (ruled_out): probe pair and direct searches agree with the rows; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json:1, .skilled/skills/system-deep-loop/hub-router.json:34
- iteration 3 decision_supersession (ruled_out): ADR-001 states the D1 replacement explicitly; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:56
- iteration 4 false_tick (ruled_out): fifteen reruns plus a whole-row read found no false tick; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:36
- iteration 4 missing_adr (ruled_out): three ADRs read in full; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:33
- iteration 4 summary_miscount (ruled_out): counts agree; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:298
- iteration 4 stale_evidence (ruled_out): nine cells read by content; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:93
- iteration 5 comment_hygiene (ruled_out): grep over eight files returned no hit; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:569
- iteration 5 drift_guard_coverage (ruled_out): read of the reader and its assertion; evidence=.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:120

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- None. This is the last iteration under `maxIterations: 5`; the run proceeds to synthesis with stop reason `maxIterationsReached`. - Rotation status: fourth rotation complete; all four canonical dimensions are covered and both core protocols are at pass. - Blocked/productive carry-forward: the productive category "resolve the citation against its declared base, then read the line" carried the two traceability passes; the exhausted category "probe with a wrong argument order" from the template's prior run does not apply here. - Required evidence for synthesis: five active P2 findings, two protocol statuses at pass with file:line references, the terminal gate rows, and the four-dimension coverage record.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 5 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
