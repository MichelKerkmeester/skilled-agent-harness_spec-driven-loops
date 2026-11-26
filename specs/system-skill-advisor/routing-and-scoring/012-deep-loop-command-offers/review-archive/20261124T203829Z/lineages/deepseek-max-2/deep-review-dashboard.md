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
- Started: 2026-11-24T20:01:19Z
- Status: COMPLETE
- Iteration: 7 of 7
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: fanout-deepseek-max-2-1795550334883-gjbarh
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
| P1 (Required) | 0 |
| P2 (Suggestions) | 4 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | traceability | traceability | 0.00 | 0/0/0 | complete |
| 2 | traceability | traceability | 1.00 | 0/0/1 | complete |
| 3 | traceability | traceability | 0.00 | 0/0/0 | complete |
| 4 | traceability | traceability | 1.00 | 0/0/2 | complete |
| 5 | traceability | traceability | 0.00 | 0/0/0 | complete |
| 6 | traceability | traceability | 1.00 | 0/0/1 | complete |
| 7 | traceability | traceability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | pending | 0 |
| security | pending | 0 |
| traceability | covered | 4 |
| maintainability | pending | 0 |

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
- Last 3 ratios: 0.00 -> 1.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 4
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
- candidateCoverage: covered=5, ruledOut=15, deferred=1, blocked=0

### Search Debt
- iteration 7 catalog_drift (deferred): out-of-scope surface; recorded as a deferred observation with both lines cited; evidence=.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:33, .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1618

### Ruled-Out Candidates
- iteration 1 spec_code_gap (ruled_out): verified by direct read of both gate copies; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:688, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4639
- iteration 1 doc_code_drift (ruled_out): compiler slice markers declare the boundary; evidence=.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:76
- iteration 1 spec_code_gap (ruled_out): cross-reference count over both files; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:1
- iteration 2 missing_case (ruled_out): prompt-by-prompt lookup; evidence=.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:0
- iteration 3 uncompared_pattern (ruled_out): set comparison by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:676
- iteration 3 mode_surface_drift (ruled_out): direct read of both surfaces; evidence=.skilled/skills/system-deep-loop/hub-router.json:34, .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:539
- iteration 3 reducer_regression (ruled_out): direct read of both helpers; evidence=.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:227, .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2421
- iteration 4 unresolvable_reference (ruled_out): independent checker output; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/citations/evidence-tails.py:1
- iteration 5 dangling_evidence (ruled_out): per-row resolution plus the packet checker; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:12
- iteration 5 unbacked_waiver (ruled_out): id-by-id lookup; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:33
- iteration 5 stale_count (ruled_out): direct read of the baseline; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json:0
- iteration 6 unimplemented_decision (ruled_out): direct read of the named symbols; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:412
- iteration 6 missed_layer (ruled_out): direct read of the test body; evidence=.skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts:112
- iteration 7 mirror_drift (ruled_out): byte comparison; evidence=.opencode/agents/deep-review.md:1, .claude/agents/deep-review.md:1
- iteration 7 playbook_precondition (ruled_out): direct read of the scenario contract; evidence=.skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/command-offer-fit-gates.md:1

### Clean Search Proof
- iteration 1 spec_code_gap (ruled_out): verified by direct read of both gate copies; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:688, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4639
- iteration 1 doc_code_drift (ruled_out): compiler slice markers declare the boundary; evidence=.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:76
- iteration 1 spec_code_gap (ruled_out): cross-reference count over both files; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:1
- iteration 2 missing_case (ruled_out): prompt-by-prompt lookup; evidence=.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:0
- iteration 3 uncompared_pattern (ruled_out): set comparison by direct read; evidence=.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:676
- iteration 3 mode_surface_drift (ruled_out): direct read of both surfaces; evidence=.skilled/skills/system-deep-loop/hub-router.json:34, .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:539
- iteration 3 reducer_regression (ruled_out): direct read of both helpers; evidence=.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:227, .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2421
- iteration 4 unresolvable_reference (ruled_out): independent checker output; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/citations/evidence-tails.py:1
- iteration 5 dangling_evidence (ruled_out): per-row resolution plus the packet checker; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:12
- iteration 5 unbacked_waiver (ruled_out): id-by-id lookup; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:33
- iteration 5 stale_count (ruled_out): direct read of the baseline; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json:0
- iteration 6 unimplemented_decision (ruled_out): direct read of the named symbols; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:412
- iteration 6 missed_layer (ruled_out): direct read of the test body; evidence=.skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts:112
- iteration 7 mirror_drift (ruled_out): byte comparison; evidence=.opencode/agents/deep-review.md:1, .claude/agents/deep-review.md:1
- iteration 7 playbook_precondition (ruled_out): direct read of the scenario contract; evidence=.skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/command-offer-fit-gates.md:1

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
correctness

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
