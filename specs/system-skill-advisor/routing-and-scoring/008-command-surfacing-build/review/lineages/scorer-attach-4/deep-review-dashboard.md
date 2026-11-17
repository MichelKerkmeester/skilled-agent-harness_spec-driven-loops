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
- Started: 2026-11-14T15:16:34Z
- Status: COMPLETE
- Iteration: 4 of 4
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: fanout-scorer-attach-4-1794669272137-9v23rz
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
| P2 (Suggestions) | 7 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/3/0 | complete |
| 2 | security | security | 1.00 | 0/0/1 | complete |
| 3 | traceability | traceability | 1.00 | 0/0/3 | complete |
| 4 | maintainability | maintainability | 1.00 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 3 |
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
- Last 3 ratios: 1.00 -> 1.00 -> 1.00
- convergenceScore: 0.00
- openFindings: 8
- persistentSameSeverity: 0
- severityChanged: 2
- repeatedFindings (deprecated combined bucket): 2

<!-- /ANCHOR:trend -->
<!-- ANCHOR:corruption-warnings -->
## 9. CORRUPTION WARNINGS
No corrupt JSONL lines detected.

<!-- /ANCHOR:corruption-warnings -->
<!-- ANCHOR:search-debt -->
## 10. SEARCH DEBT
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=6, ruledOut=7, deferred=3, blocked=0

### Search Debt
- iteration 1 state_transition (deferred): The security iteration reviews the path split and needs a compiled-hub read-only route to prove reach.; evidence=fusion.ts:1223, command-attach.ts:472
- iteration 3 checklist_evidence (deferred): The maintainability iteration records the test-gap finding.; evidence=tests/command-attach-guards.vitest.ts:181, 020-command-offer-fit-guards/tasks.md:200
- iteration 4 doc_code_drift (deferred): Recorded as a traceability note in iteration 3 and as part of the coverage gap here.; evidence=tests/command-attach-guards.vitest.ts:181, 020-command-offer-fit-guards/tasks.md:200

### Ruled-Out Candidates
- iteration 1 boundary_parsing (ruled_out): The changed boundary tests pass and the probe finds no prefix or suffix leak.; evidence=command-attach.ts:228-232, tests/command-attach-guards.vitest.ts:390-420
- iteration 2 no_edit_policy (ruled_out): The gate behaves as required on the three classes; no writing row survived the probe.; evidence=fusion.ts:1223, tests/command-meaning-anchor.vitest.ts:425-482
- iteration 2 holdout_leak (ruled_out): Tune-id selection plus explicit split assertion; no prompt text is printed.; evidence=tests/advisor-recommend-compiled-route-option.vitest.ts:155-166, tests/scorer/doctor-handoff-command.vitest.ts:125-137
- iteration 2 runtime_branch (ruled_out): The changed modules are runtime-neutral; the renderer surface is a sibling lineage.; evidence=handlers/advisor-recommend.ts:429-488
- iteration 3 doc_code_drift (ruled_out): The deriver reports fresh; no hand-edit.; evidence=runtime/scripts/command-bridges/derive-command-bridges.cjs
- iteration 4 vacuous_assertion (ruled_out): Each changed case passes its table row into the function and asserts the returned value.; evidence=tests/command-attach-guards.vitest.ts:135-432

### Clean Search Proof
- iteration 1 boundary_parsing (ruled_out): The changed boundary tests pass and the probe finds no prefix or suffix leak.; evidence=command-attach.ts:228-232, tests/command-attach-guards.vitest.ts:390-420
- iteration 2 no_edit_policy (ruled_out): The gate behaves as required on the three classes; no writing row survived the probe.; evidence=fusion.ts:1223, tests/command-meaning-anchor.vitest.ts:425-482
- iteration 2 holdout_leak (ruled_out): Tune-id selection plus explicit split assertion; no prompt text is printed.; evidence=tests/advisor-recommend-compiled-route-option.vitest.ts:155-166, tests/scorer/doctor-handoff-command.vitest.ts:125-137
- iteration 2 runtime_branch (ruled_out): The changed modules are runtime-neutral; the renderer surface is a sibling lineage.; evidence=handlers/advisor-recommend.ts:429-488
- iteration 3 doc_code_drift (ruled_out): The deriver reports fresh; no hand-edit.; evidence=runtime/scripts/command-bridges/derive-command-bridges.cjs
- iteration 4 vacuous_assertion (ruled_out): Each changed case passes its table row into the function and asserts the returned value.; evidence=tests/command-attach-guards.vitest.ts:135-432

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining; synthesis - Focus area: the compiled review report, the planning packet and the final verdict. - Reason: all four dimensions are covered; one active P1 and six P2s are recorded. - Rotation status: correctness, security, traceability and maintainability complete (CONDITIONAL). - Blocked/productive carry-forward: no blocked approach; the four iteration trail is complete. - Required evidence: the registry's active counts, the iteration final lines and the synthesis report. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 3 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
