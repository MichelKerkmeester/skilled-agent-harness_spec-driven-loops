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
- Started: 2026-11-24T09:08:04.000Z
- Status: COMPLETE
- Iteration: 5 of 5
- Provisional Verdict: FAIL
- Failed required gates at stop: coverage
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-deepseek-max-3-1795511183570-92w0ez
- Parent Session: 2026-11-24T09:06:03.000Z
- Lifecycle Mode: new
- Generation: 3
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
| P2 (Suggestions) | 4 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/1/1 | complete |
| 2 | security | security | 0.00 | 0/0/0 | complete |
| 3 | traceability | traceability | 0.17 | 0/0/1 | complete |
| 4 | traceability/checklist_evidence | traceability | 0.14 | 0/0/1 | complete |
| 5 | maintainability | maintainability | 0.13 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 5 |
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
- graphConvergenceScore: 0.00
- graphDecision: none
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.17 -> 0.14 -> 0.13
- convergenceScore: 0.88
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
- candidateCoverage: covered=19, ruledOut=12, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 gate_predicate_correctness (ruled_out): read at the gate and pinned by fixture controls; evidence=command-attach.ts:1320, command-attach.ts:1347, deep-loop-offer-cases.json:136, deep-loop-offer-cases.json:137
- iteration 2 prompt_injection (ruled_out): read at the renderer and the hand-off; evidence=render.ts:163, subprocess.ts:306
- iteration 2 policy_downgrade (ruled_out): read at both layers; evidence=command-attach.ts:137, render.ts:250
- iteration 2 secret_exposure (ruled_out): out-of-contract hardening; no caller sends a failing value; evidence=subprocess.ts:283
- iteration 3 probe_regression (ruled_out): direct result-file comparison; evidence=results-after.json:1
- iteration 3 corpus_regression (ruled_out): read from the committed baseline; evidence=command-routing-baseline.json:1
- iteration 4 waiver_backing (ruled_out): read the decision record headings and the waiver cells; evidence=decision-record.md:33
- iteration 4 checklist_count (ruled_out): counted every CHK line; evidence=tasks.md:291
- iteration 4 test_row_claim (ruled_out): read each cited line; evidence=typed-on-stuck-serving.vitest.ts:107, test_skill_advisor.py:2902, command-brief-golden.vitest.ts:353
- iteration 5 dead_branch (ruled_out): walked each call site; evidence=command-attach.ts:1319
- iteration 5 stale_comment (ruled_out): read each comment against the branch below it; evidence=command-attach.ts:591

### Clean Search Proof
- iteration 1 gate_predicate_correctness (ruled_out): read at the gate and pinned by fixture controls; evidence=command-attach.ts:1320, command-attach.ts:1347, deep-loop-offer-cases.json:136, deep-loop-offer-cases.json:137
- iteration 2 prompt_injection (ruled_out): read at the renderer and the hand-off; evidence=render.ts:163, subprocess.ts:306
- iteration 2 policy_downgrade (ruled_out): read at both layers; evidence=command-attach.ts:137, render.ts:250
- iteration 2 secret_exposure (ruled_out): out-of-contract hardening; no caller sends a failing value; evidence=subprocess.ts:283
- iteration 3 probe_regression (ruled_out): direct result-file comparison; evidence=results-after.json:1
- iteration 3 corpus_regression (ruled_out): read from the committed baseline; evidence=command-routing-baseline.json:1
- iteration 4 waiver_backing (ruled_out): read the decision record headings and the waiver cells; evidence=decision-record.md:33
- iteration 4 checklist_count (ruled_out): counted every CHK line; evidence=tasks.md:291
- iteration 4 test_row_claim (ruled_out): read each cited line; evidence=typed-on-stuck-serving.vitest.ts:107, test_skill_advisor.py:2902, command-brief-golden.vitest.ts:353
- iteration 5 dead_branch (ruled_out): walked each call site; evidence=command-attach.ts:1319
- iteration 5 stale_comment (ruled_out): read each comment against the branch below it; evidence=command-attach.ts:591

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- None. This is the terminal iteration: the cap is reached and synthesis follows. - Rotation status: correctness, security, traceability (`spec_code` and `checklist_evidence`) and maintainability all reviewed. - Carry-forward for synthesis: `R1-P1-001` active (docs claim), `R1-P2-002`, `R3-P2-003`, `R4-P2-004` and `R5-P2-005` active; protocol statuses `spec_code: partial`, `checklist_evidence: partial`. - Required evidence for the report: the five finding ids, the protocol table, the acceptance counts, and this run's own terminal gates. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
