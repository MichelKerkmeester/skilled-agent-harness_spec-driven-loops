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
- Started: 2026-11-24T19:03:02.477Z
- Status: COMPLETE
- Iteration: 7 of 7
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-deepseek-max-1-1795546920757-7pyjry
- Parent Session: 2026-11-24T19:01:50.000Z
- Lifecycle Mode: new
- Generation: 7
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
| P2 (Suggestions) | 5 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | traceability | traceability | 1.00 | 0/1/1 | complete |
| 2 | traceability | traceability | 0.14 | 0/0/1 | complete |
| 3 | traceability | traceability | 0.14 | 0/0/1 | complete |
| 4 | correctness | correctness | 0.38 | 0/1/0 | complete |
| 5 | security | security | 0.00 | 0/0/0 | complete |
| 6 | maintainability | maintainability | 0.14 | 0/0/2 | complete |
| 7 | traceability | traceability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 1 |
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
- Last 3 ratios: 0.00 -> 0.14 -> 0.00
- convergenceScore: 1.00
- openFindings: 7
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
- candidateCoverage: covered=32, ruledOut=26, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 requirement_without_code (ruled_out): verified by direct read plus a built-dist probe; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:949
- iteration 1 stale_generated_artifact (ruled_out): digest comparison over both contracts; evidence=.skilled/commands/deep/assets/compiled/deep-review.contract.markdown:1
- iteration 1 cross_copy_vocabulary_drift (ruled_out): independent extraction and comparison; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:688
- iteration 2 requirement_without_code (ruled_out): verified by direct read plus twelve built-dist probes; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:897
- iteration 2 parity_gap (ruled_out): direct read of both copies; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:888
- iteration 2 stale_count (ruled_out): counted from the files; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json:1
- iteration 2 reducer_regression (ruled_out): direct read plus the strategy file's numbering after the first reducer pass; evidence=.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2386
- iteration 3 dangling_citation (ruled_out): name resolution against the tree; evidence=.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1
- iteration 3 unbacked_waiver (ruled_out): direct read of the decision record; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:128
- iteration 3 unchecked_box_drift (ruled_out): counted from the file; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:1
- iteration 3 comment_label_leak (ruled_out): comment-hygiene sweep over every in-scope code file; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:688
- iteration 4 adversarial_input_crash (ruled_out): probe with outcome check; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1537
- iteration 4 catastrophic_backtracking (ruled_out): timed probes; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:748
- iteration 4 case_folding (ruled_out): probe; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:648
- iteration 4 guard_under_noise (ruled_out): probe; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:949
- iteration 5 policy_escalation (ruled_out): table read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:71
- iteration 5 command_injection (ruled_out): fuzz over all fixture prompts and crafted strings; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1537
- iteration 5 unvetted_degraded_command (ruled_out): direct read; evidence=.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489
- iteration 5 input_boundary (ruled_out): direct read of each point; evidence=.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257
- iteration 5 credential_read (ruled_out): direct read of every changed read site; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:136
- iteration 6 dead_code (ruled_out): reachability check rather than reference count; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:897
- iteration 6 duplicate_heading (ruled_out): heading count in the produced artefact; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-1/deep-review-strategy.md:171
- iteration 6 documentation_drift (ruled_out): read of every changed comment block in iterations 1 to 6; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4816
- iteration 7 overlay_protocol_gap (ruled_out): three-surface read; evidence=.skilled/skills/system-deep-loop/hub-router.json:34
- iteration 7 mirror_drift (ruled_out): directory read plus the crosswalk; evidence=.codex/agents/deep-review.toml:1
- iteration 7 artefact_inconsistency (ruled_out): per-iteration cross-check; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-1/deep-review-strategy.md:171
- iteration 7 citation_regression (ruled_out): re-resolution pass; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:1

### Clean Search Proof
- iteration 1 requirement_without_code (ruled_out): verified by direct read plus a built-dist probe; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:949
- iteration 1 stale_generated_artifact (ruled_out): digest comparison over both contracts; evidence=.skilled/commands/deep/assets/compiled/deep-review.contract.markdown:1
- iteration 1 cross_copy_vocabulary_drift (ruled_out): independent extraction and comparison; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:688
- iteration 2 requirement_without_code (ruled_out): verified by direct read plus twelve built-dist probes; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:897
- iteration 2 parity_gap (ruled_out): direct read of both copies; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:888
- iteration 2 stale_count (ruled_out): counted from the files; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json:1
- iteration 2 reducer_regression (ruled_out): direct read plus the strategy file's numbering after the first reducer pass; evidence=.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2386
- iteration 3 dangling_citation (ruled_out): name resolution against the tree; evidence=.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1
- iteration 3 unbacked_waiver (ruled_out): direct read of the decision record; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:128
- iteration 3 unchecked_box_drift (ruled_out): counted from the file; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:1
- iteration 3 comment_label_leak (ruled_out): comment-hygiene sweep over every in-scope code file; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:688
- iteration 4 adversarial_input_crash (ruled_out): probe with outcome check; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1537
- iteration 4 catastrophic_backtracking (ruled_out): timed probes; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:748
- iteration 4 case_folding (ruled_out): probe; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:648
- iteration 4 guard_under_noise (ruled_out): probe; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:949
- iteration 5 policy_escalation (ruled_out): table read; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:71
- iteration 5 command_injection (ruled_out): fuzz over all fixture prompts and crafted strings; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1537
- iteration 5 unvetted_degraded_command (ruled_out): direct read; evidence=.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489
- iteration 5 input_boundary (ruled_out): direct read of each point; evidence=.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257
- iteration 5 credential_read (ruled_out): direct read of every changed read site; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:136
- iteration 6 dead_code (ruled_out): reachability check rather than reference count; evidence=.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:897
- iteration 6 duplicate_heading (ruled_out): heading count in the produced artefact; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-1/deep-review-strategy.md:171
- iteration 6 documentation_drift (ruled_out): read of every changed comment block in iterations 1 to 6; evidence=.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4816
- iteration 7 overlay_protocol_gap (ruled_out): three-surface read; evidence=.skilled/skills/system-deep-loop/hub-router.json:34
- iteration 7 mirror_drift (ruled_out): directory read plus the crosswalk; evidence=.codex/agents/deep-review.toml:1
- iteration 7 artefact_inconsistency (ruled_out): per-iteration cross-check; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-1/deep-review-strategy.md:171
- iteration 7 citation_regression (ruled_out): re-resolution pass; evidence=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:1

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- None. The run reaches `maxIterations` at this iteration, so the loop stops with stop reason `maxIterationsReached` and the synthesis phase compiles the report. - What synthesis should carry forward: the two active P1 rows (`R1-P1-001`, `R4-P1-001`) and the five P2 rows, with the CONDITIONAL verdict they force. - Rotation status: every configured dimension covered at least once. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
