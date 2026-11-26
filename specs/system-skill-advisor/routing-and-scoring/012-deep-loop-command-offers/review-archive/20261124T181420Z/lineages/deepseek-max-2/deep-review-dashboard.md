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
- Started: 2026-11-24T11:17:12.795Z
- Status: COMPLETE
- Iteration: 7 of 7
- Provisional Verdict: PASS
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: fanout-deepseek-max-2-1795518961022-7ms9ak
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
| P2 (Suggestions) | 5 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness of the deep-loop offer gate; gate-layer REQ claims of spec_code | correctness | 1.00 | 0/0/1 | complete |
| 2 | traceability: spec_code over REQ-001..REQ-039 against code and decision record | traceability | 1.00 | 0/0/1 | complete |
| 3 | security: trust boundaries around the offer gate, the fallback child and the brief label | security | 0.00 | 0/0/0 | complete |
| 4 | traceability: checklist_evidence over the 123 task boxes and the 47 criteria rows | traceability | 0.00 | 0/0/0 | complete |
| 5 | maintainability: the reducer's strategy contract, comment truth, parity cost and fixture growth | maintainability | 1.00 | 0/0/2 | complete |
| 6 | correctness second pass: the served head from handler to rendered label | correctness | 1.00 | 0/0/1 | complete |
| 7 | traceability closeout: re-open every filed finding and record the terminal state synthesis reads | traceability | 0.10 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 2 |
| security | covered | 0 |
| traceability | covered | 1 |
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
- Last 3 ratios: 1.00 -> 1.00 -> 0.10
- convergenceScore: 0.90
- openFindings: 5
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
- candidateCoverage: covered=16, ruledOut=19, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 producer_consumer_mismatch (ruled_out): mechanical entry comparison found no drift; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:330, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4600
- iteration 1 boundary_condition (ruled_out): timing evidence shows a linear cost; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:641
- iteration 2 spec_to_code_gap (ruled_out): each REQ mapped to a concrete producer or decision; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:993
- iteration 2 unbacked_waiver (ruled_out): each waiver ADR exists in the decision record; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:33
- iteration 3 injection (ruled_out): spawn is called with an argument array; evidence=.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:283
- iteration 3 input_validation (ruled_out): validation present on the path that renders; evidence=.skilled/skills/system-skill-advisor/runtime/lib/render.ts:208
- iteration 3 unbounded_work (ruled_out): timing evidence on adversarial inputs; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:641
- iteration 3 prompt_echo (ruled_out): label parts are table-derived; evidence=.skilled/skills/system-skill-advisor/runtime/lib/render.ts:227
- iteration 4 unresolved_citation (ruled_out): mechanical resolution of every citation; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:164
- iteration 4 stale_task_claim (ruled_out): content of each cited line matches the claim; evidence=.skilled/commands/deep/review.md:80
- iteration 4 missing_evidence_artifact (ruled_out): existence check on the cited paths; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json
- iteration 5 dead_export (ruled_out): reader counts above one for every added export; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:548
- iteration 5 stale_comment (ruled_out): paragraph-by-paragraph comparison; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:330
- iteration 6 field_loss (ruled_out): schema declares the fields the renderer reads; evidence=.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:296
- iteration 6 shadowed_typed_command (ruled_out): call order proves the overlay is last; evidence=.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:428
- iteration 6 stale_policy (ruled_out): renderer branches on typed and row policy; evidence=.skilled/skills/system-skill-advisor/runtime/lib/render.ts:250
- iteration 7 out_of_scope_finding (ruled_out): set membership check over the registry rows; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2/review-scope-files.txt:1
- iteration 7 uncovered_dimension (ruled_out): every configured dimension true in the registry; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2/deep-review-findings-registry.json:1

### Clean Search Proof
- iteration 1 producer_consumer_mismatch (ruled_out): mechanical entry comparison found no drift; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:330, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4600
- iteration 1 boundary_condition (ruled_out): timing evidence shows a linear cost; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:641
- iteration 2 spec_to_code_gap (ruled_out): each REQ mapped to a concrete producer or decision; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:993
- iteration 2 unbacked_waiver (ruled_out): each waiver ADR exists in the decision record; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:33
- iteration 3 injection (ruled_out): spawn is called with an argument array; evidence=.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:283
- iteration 3 input_validation (ruled_out): validation present on the path that renders; evidence=.skilled/skills/system-skill-advisor/runtime/lib/render.ts:208
- iteration 3 unbounded_work (ruled_out): timing evidence on adversarial inputs; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:641
- iteration 3 prompt_echo (ruled_out): label parts are table-derived; evidence=.skilled/skills/system-skill-advisor/runtime/lib/render.ts:227
- iteration 4 unresolved_citation (ruled_out): mechanical resolution of every citation; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:164
- iteration 4 stale_task_claim (ruled_out): content of each cited line matches the claim; evidence=.skilled/commands/deep/review.md:80
- iteration 4 missing_evidence_artifact (ruled_out): existence check on the cited paths; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json
- iteration 5 dead_export (ruled_out): reader counts above one for every added export; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:548
- iteration 5 stale_comment (ruled_out): paragraph-by-paragraph comparison; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:330
- iteration 6 field_loss (ruled_out): schema declares the fields the renderer reads; evidence=.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:296
- iteration 6 shadowed_typed_command (ruled_out): call order proves the overlay is last; evidence=.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:428
- iteration 6 stale_policy (ruled_out): renderer branches on typed and row policy; evidence=.skilled/skills/system-skill-advisor/runtime/lib/render.ts:250
- iteration 7 out_of_scope_finding (ruled_out): set membership check over the registry rows; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2/review-scope-files.txt:1
- iteration 7 uncovered_dimension (ruled_out): every configured dimension true in the registry; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2/deep-review-findings-registry.json:1

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none - the iteration cap is reached - Focus area: synthesis - Reason: `stopPolicy: max-iterations` with `maxIterations: 7` stops the loop here; the next step compiles `review-report.md` from this registry - Rotation status: every configured dimension covered; correctness and traceability reviewed twice - Blocked/productive carry-forward: nothing blocked - Required evidence: the registry, this narrative and the delta agree on five open P2 rows and no P0/P1 - Recovery note: none Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 5 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
