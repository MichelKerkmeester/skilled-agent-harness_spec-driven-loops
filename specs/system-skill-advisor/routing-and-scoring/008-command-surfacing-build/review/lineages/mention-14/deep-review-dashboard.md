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
- Started: 2026-11-16T22:37:01Z
- Status: COMPLETE
- Iteration: 8 of 8
- Provisional Verdict: FAIL
- Failed required gates at stop: coverage
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-mention-14-1794868189353-tsxtos
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
| P2 (Suggestions) | 1 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness - the pass-fourteen pronoun-refusal end anchor and the document-naming then guard | correctness | 1.00 | 0/2/1 | complete |
| 2 | security - the guard as a trust-boundary filter over prompt text | security | 0.00 | 0/0/0 | complete |
| 3 | traceability - the phase-040 decision record and AC-005 against the two changed rules | traceability | 0.00 | 0/0/0 | complete |
| 4 | maintainability - line-level branch audit and fixture durability after a recovery trigger | maintainability | 0.00 | 0/0/0 | complete |
| 5 | correctness replay - reproduce both P1s and sweep the two new boundaries | correctness | 0.00 | 0/0/0 | complete |
| 6 | correctness consumer cross-reference - attachCommand, typedCommandForTop and routeNeedsMode against the generated tables | correctness | 0.00 | 0/0/0 | complete |
| 7 | correctness fixture invariance - wrapper matrix, retired-name loop and the missing mention rows | correctness | 0.00 | 0/0/0 | complete |
| 8 | traceability - last under the cap; re-record both core protocols and verify lineage artifacts | traceability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 3 |
| security | covered | 0 |
| traceability | covered | 0 |
| maintainability | covered | 0 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

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
- openFindings: 3
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
- candidateCoverage: covered=3, ruledOut=5, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 typed_command_boundary (ruled_out): The boundary and its tests already reject the doc path and the longer command name; no new input was found.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:456
- iteration 2 regex_injection (ruled_out): no prompt substring is interpolated into a pattern; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:316-318, .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:455
- iteration 2 backtracking_dos (ruled_out): measured linear behavior on the adversarial shapes; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:415
- iteration 2 markup_fold_consent (ruled_out): the fold only removes marks and cannot insert a lead; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:443-451
- iteration 2 command_name_escaping (ruled_out): escaping covers the whole name before either pattern is built; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:455, .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:466

### Clean Search Proof
- iteration 1 typed_command_boundary (ruled_out): The boundary and its tests already reject the doc path and the longer command name; no new input was found.; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:456
- iteration 2 regex_injection (ruled_out): no prompt substring is interpolated into a pattern; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:316-318, .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:455
- iteration 2 backtracking_dos (ruled_out): measured linear behavior on the adversarial shapes; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:415
- iteration 2 markup_fold_consent (ruled_out): the fold only removes marks and cannot insert a lead; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:443-451
- iteration 2 command_name_escaping (ruled_out): escaping covers the whole name before either pattern is built; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:455, .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:466

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none; the loop reaches `maxIterations`. - Focus area: synthesis compiled the eight iterations into `review-report.md`; the verdict is `FAIL` because the required terminal `coverage` gate is still failing, with two active P1s and one P2. - Reason: the cap is reached with two open P1s and a closed traceability gate; the workflow's verdict rule makes the failed required gate a FAIL. - Rotation status: all dimensions complete. - Blocked/productive carry-forward: `spec_code` and `checklist_evidence` remain partial; the operator owns the fix decision. - Required evidence: the registry counts, the terminal gates output, and the eight iteration files.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
