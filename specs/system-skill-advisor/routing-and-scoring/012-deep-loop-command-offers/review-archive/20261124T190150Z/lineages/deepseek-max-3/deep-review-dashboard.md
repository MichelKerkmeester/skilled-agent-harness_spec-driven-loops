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
- Started: 2026-11-24T18:16:36.264Z
- Status: COMPLETE
- Iteration: 7 of 7
- Provisional Verdict: FAIL
- Failed required gates at stop: coverage
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-deepseek-max-3-1795544069299-46zw3s
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
| P2 (Suggestions) | 8 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | traceability | traceability | 1.00 | 0/3/2 | complete |
| 2 | traceability | traceability | 0.15 | 0/1/1 | complete |
| 3 | traceability | traceability | 0.22 | 0/1/2 | complete |
| 4 | correctness | correctness | 0.03 | 0/0/1 | complete |
| 5 | security | security | 0.00 | 0/0/0 | complete |
| 6 | maintainability | maintainability | 0.06 | 0/0/2 | complete |
| 7 | traceability | traceability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 1 |
| security | covered | 0 |
| traceability | covered | 9 |
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
- Last 3 ratios: 0.00 -> 0.06 -> 0.00
- convergenceScore: 1.00
- openFindings: 12
- persistentSameSeverity: 0
- severityChanged: 1
- repeatedFindings (deprecated combined bucket): 1

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=10, ruledOut=6, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 missing_implementation (ruled_out): direct read of both copies found the lists and their patterns; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:688
- iteration 1 missing_implementation (ruled_out): ADR-005 and the serving test pin the exception; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:412, .skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts:112
- iteration 2 missing_implementation (ruled_out): direct read found every probe file and test case; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json:1, .skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-handoff-command.vitest.ts:206
- iteration 3 missing_implementation (ruled_out): direct read of the pattern and the guard; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:949
- iteration 4 branch_order (ruled_out): direct read of the two patterns and their fixture rows; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:667, .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1090
- iteration 5 command_injection (ruled_out): direct read of the guard and its golden test; evidence=.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489
- iteration 5 untrusted_render (ruled_out): direct read of sanitizeSkillLabel and its call sites; evidence=.skilled/skills/system-skill-advisor/runtime/lib/render.ts:163
- iteration 5 policy_escalation (ruled_out): direct read of every deep command id; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:71
- iteration 6 unguarded_duplication (ruled_out): the guard covers the exported lists and two numeric constants; evidence=.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:80

### Clean Search Proof
- iteration 1 missing_implementation (ruled_out): direct read of both copies found the lists and their patterns; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:688
- iteration 1 missing_implementation (ruled_out): ADR-005 and the serving test pin the exception; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:412, .skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts:112
- iteration 2 missing_implementation (ruled_out): direct read found every probe file and test case; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json:1, .skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-handoff-command.vitest.ts:206
- iteration 3 missing_implementation (ruled_out): direct read of the pattern and the guard; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:949
- iteration 4 branch_order (ruled_out): direct read of the two patterns and their fixture rows; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:667, .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1090
- iteration 5 command_injection (ruled_out): direct read of the guard and its golden test; evidence=.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489
- iteration 5 untrusted_render (ruled_out): direct read of sanitizeSkillLabel and its call sites; evidence=.skilled/skills/system-skill-advisor/runtime/lib/render.ts:163
- iteration 5 policy_escalation (ruled_out): direct read of every deep command id; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:71
- iteration 6 unguarded_duplication (ruled_out): the guard covers the exported lists and two numeric constants; evidence=.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:80

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- None. The run reaches its iteration cap after this pass and enters synthesis. - Synthesis inputs: registry (0 P0, 4 P1, 8 P2), terminal gate rows, verdict, release-readiness state. - Required evidence for the report: every active finding's file:line, the two core protocol statuses, and the measured convergence ratios. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 4 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
