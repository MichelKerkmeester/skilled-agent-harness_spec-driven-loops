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
- Started: 2026-11-24T11:16:48.000Z
- Status: COMPLETE
- Iteration: 7 of 7
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-deepseek-max-1-1795518961022-7ms9ak
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
| 1 | traceability/spec_code over REQ-001..REQ-039 | traceability | 1.00 | 0/2/1 | complete |
| 2 | traceability/checklist_evidence over AC-001..AC-047 and T001..T092 | traceability | 0.21 | 0/0/3 | complete |
| 3 | correctness: refusal, mode-cue and stuck-run paths on the served gate | correctness | 0.30 | 0/1/1 | complete |
| 4 | security: untrusted prompt handling, regex cost, bounded window, degraded trust boundary | security | 0.05 | 0/0/1 | complete |
| 5 | maintainability: drift guard coverage, mode vocabulary surfaces, comment hygiene | maintainability | 0.09 | 0/0/2 | complete |
| 6 | correctness follow-up: no-edit guard, typed doctor, re-verification of active P1s | correctness | 0.19 | 0/1/1 | complete |
| 7 | traceability overlay: skill_agent and agent_cross_runtime, plus finding-line re-resolution | traceability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 3 |
| security | covered | 1 |
| traceability | covered | 6 |
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
- Last 3 ratios: 0.09 -> 0.19 -> 0.00
- convergenceScore: 1.00
- openFindings: 12
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
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=9, ruledOut=10, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 boundary_input (ruled_out): the loop-name pattern excludes word, slash, dot and hyphen continuations; evidence=command-attach.ts:843
- iteration 2 missing_evidence (ruled_out): every citation resolves to an existing file and in-range line; evidence=tasks.md:309
- iteration 3 state_transition (ruled_out): the fallback never reads cues; evidence=skill_advisor.py:5452
- iteration 4 redos (ruled_out): bounded windows and precompiled patterns keep it linear; evidence=command-attach.ts:641
- iteration 4 command_injection (ruled_out): tracked table and owner check gate the string; evidence=skill-advisor-cli.ts:1489
- iteration 5 comment_hygiene (ruled_out): no ticket or spec path in any changed comment; evidence=command-attach.ts:1489
- iteration 7 document_drift (ruled_out): sets are equal; evidence=ROUTER.md:63
- iteration 7 mirror_drift (ruled_out): no depth trigger remains; evidence=.skilled/agents/deep-review.md

### Clean Search Proof
- iteration 1 boundary_input (ruled_out): the loop-name pattern excludes word, slash, dot and hyphen continuations; evidence=command-attach.ts:843
- iteration 2 missing_evidence (ruled_out): every citation resolves to an existing file and in-range line; evidence=tasks.md:309
- iteration 3 state_transition (ruled_out): the fallback never reads cues; evidence=skill_advisor.py:5452
- iteration 4 redos (ruled_out): bounded windows and precompiled patterns keep it linear; evidence=command-attach.ts:641
- iteration 4 command_injection (ruled_out): tracked table and owner check gate the string; evidence=skill-advisor-cli.ts:1489
- iteration 5 comment_hygiene (ruled_out): no ticket or spec path in any changed comment; evidence=command-attach.ts:1489
- iteration 7 document_drift (ruled_out): sets are equal; evidence=ROUTER.md:63
- iteration 7 mirror_drift (ruled_out): no depth trigger remains; evidence=.skilled/agents/deep-review.md

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- None: `maxIterations=7` is reached. The synthesis phase compiles `review-report.md` from the registry.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 4 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
