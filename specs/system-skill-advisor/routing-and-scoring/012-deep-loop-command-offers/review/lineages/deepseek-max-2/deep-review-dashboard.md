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
- Started: 2026-11-24T20:42:23Z
- Status: COMPLETE
- Iteration: 7 of 7
- Provisional Verdict: PASS
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: fanout-deepseek-max-2-1795552859377-13gxwk
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
| P2 (Suggestions) | 6 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 0.00 | 0/0/0 | complete |
| 2 | security | security | 1.00 | 0/0/1 | complete |
| 3 | maintainability | maintainability | 1.00 | 0/0/2 | complete |
| 4 | traceability (spec_code) | traceability | 1.00 | 0/0/1 | complete |
| 5 | traceability (checklist_evidence) | traceability | 1.00 | 0/0/1 | complete |
| 6 | traceability (overlay protocols) | traceability | 1.00 | 0/0/1 | complete |
| 7 | traceability (closeout) | traceability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 0 |
| security | covered | 1 |
| traceability | covered | 3 |
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
- Last 3 ratios: 1.00 -> 1.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 6
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
- candidateCoverage: covered=13, ruledOut=16, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 branch_order_precedence (ruled_out): branch order matches the documented contract for every route shape the hub maps; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1596
- iteration 1 bounded_window_off_by_one (ruled_out): window exceeds the pattern's maximum span; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:763
- iteration 1 unsupported_route_shape (ruled_out): unobservable on the hub's own mode table; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:36
- iteration 2 policy_downgrade_bypass (ruled_out): child sessions cannot start a run under either policy word; evidence=.skilled/skills/system-skill-advisor/runtime/lib/render.ts:198
- iteration 2 unbounded_input (ruled_out): input is capped ahead of the gate; evidence=.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257
- iteration 3 guard_coverage_gap (ruled_out): the guard's coverage test reads the fallback's compiled names; evidence=.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:571
- iteration 4 requirement_without_owner (ruled_out): the reverse mapping covers all 53; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:58
- iteration 4 symbol_missing_from_tree (ruled_out): REQ-011 requires both names to leave the tree; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:235
- iteration 4 unbacked_waiver (ruled_out): four non-Met rows, four existing ADRs; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:33
- iteration 5 checklist_tick_without_evidence (ruled_out): the checklist's command-bearing ticks hold; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:36
- iteration 5 open_item_mismatch (ruled_out): one blocker, recorded three times consistently; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:166
- iteration 6 skill_agent_mismatch (ruled_out): one row names the packet, command and agent consistently; evidence=.skilled/skills/system-deep-loop/SKILL.md:31
- iteration 6 mirror_missing (ruled_out): mirror files exist on both runtime trees; evidence=.claude/agents/deep-review.md:1
- iteration 7 unclosed_prior_finding (ruled_out): nine findings, nine closed traces; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:95
- iteration 7 dimension_gap (ruled_out): all four dimensions carry a completed review; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2/deep-review-findings-registry.json:1
- iteration 7 verdict_misclassification (ruled_out): no finding's case produces wrong runtime output; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2/deep-review-findings-registry.json:1

### Clean Search Proof
- iteration 1 branch_order_precedence (ruled_out): branch order matches the documented contract for every route shape the hub maps; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1596
- iteration 1 bounded_window_off_by_one (ruled_out): window exceeds the pattern's maximum span; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:763
- iteration 1 unsupported_route_shape (ruled_out): unobservable on the hub's own mode table; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:36
- iteration 2 policy_downgrade_bypass (ruled_out): child sessions cannot start a run under either policy word; evidence=.skilled/skills/system-skill-advisor/runtime/lib/render.ts:198
- iteration 2 unbounded_input (ruled_out): input is capped ahead of the gate; evidence=.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257
- iteration 3 guard_coverage_gap (ruled_out): the guard's coverage test reads the fallback's compiled names; evidence=.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:571
- iteration 4 requirement_without_owner (ruled_out): the reverse mapping covers all 53; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:58
- iteration 4 symbol_missing_from_tree (ruled_out): REQ-011 requires both names to leave the tree; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:235
- iteration 4 unbacked_waiver (ruled_out): four non-Met rows, four existing ADRs; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:33
- iteration 5 checklist_tick_without_evidence (ruled_out): the checklist's command-bearing ticks hold; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:36
- iteration 5 open_item_mismatch (ruled_out): one blocker, recorded three times consistently; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:166
- iteration 6 skill_agent_mismatch (ruled_out): one row names the packet, command and agent consistently; evidence=.skilled/skills/system-deep-loop/SKILL.md:31
- iteration 6 mirror_missing (ruled_out): mirror files exist on both runtime trees; evidence=.claude/agents/deep-review.md:1
- iteration 7 unclosed_prior_finding (ruled_out): nine findings, nine closed traces; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:95
- iteration 7 dimension_gap (ruled_out): all four dimensions carry a completed review; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2/deep-review-findings-registry.json:1
- iteration 7 verdict_misclassification (ruled_out): no finding's case produces wrong runtime output; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2/deep-review-findings-registry.json:1

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining (all four recorded; 7 of 7 iterations used).
- Focus area: synthesis — compile the review report from this run's registry and iteration files, and record the terminal synthesis event.
- Reason: the iteration cap is reached; `stopPolicy=max-iterations` makes convergence telemetry only.
- Rotation status: complete.
- Required evidence: the registry counts, the six finding ids, and the run's dimension coverage.
- Blocked/productive carry-forward: none blocked.
- Recovery note: not applicable.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 6 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
