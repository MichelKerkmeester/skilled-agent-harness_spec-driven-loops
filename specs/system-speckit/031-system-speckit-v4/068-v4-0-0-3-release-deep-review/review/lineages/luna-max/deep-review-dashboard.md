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
- Review Target: specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review (spec-folder)
- Started: 2026-10-06T04:31:39Z
- Status: INITIALIZED
- Iteration: 3 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: fanout-luna-max-1791260058145-vgna23
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

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
| P2 (Suggestions) | 1 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 0.00 | 0/0/0 | complete |
| 2 | security | security | 1.00 | 0/1/0 | complete |
| 3 | traceability | traceability | 0.17 | 0/1/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 0 |
| security | covered | 1 |
| traceability | covered | 1 |
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
- Last 3 ratios: 0.00 -> 1.00 -> 0.17
- convergenceScore: 0.83
- openFindings: 2
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
- candidateCoverage: covered=2, ruledOut=5, deferred=1, blocked=0

### Search Debt
- iteration 3 checklist_evidence (deferred): Reconcile the T003/CHK-003 smoke evidence at packet closure without treating this in-progress summary as a code failure.; evidence=specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/goal.md:82-83, specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/tasks.md:106

### Ruled-Out Candidates
- iteration 1 path_traversal (ruled_out): No confirmed bypass was found; concurrency races were not exercised because tests were not run.; evidence=.skilled/commands/doctor/scripts/release-update.cjs:218-258
- iteration 1 rollback_integrity (ruled_out): No ordering defect was confirmed by direct read.; evidence=.skilled/commands/doctor/scripts/release-update.cjs:1817-1941, .skilled/commands/doctor/scripts/release-update.cjs:2178-2197
- iteration 1 rename_apply (ruled_out): No confirmed stale-path defect was found.; evidence=.skilled/commands/doctor/scripts/release-update.cjs:681-701, .skilled/commands/doctor/scripts/tests/release-update.test.cjs:541-590
- iteration 2 shared_gate_consistency (ruled_out): The entry points converge on one shared validator.; evidence=.skilled/skills/sk-git/scripts/validate-message.mjs:147-169, .skilled/scripts/git-hooks/commit-msg:76-79, .skilled/scripts/git-hooks/pre-push:247-249, .github/workflows/message-contract.yml:61,79
- iteration 3 per_lineage_iteration_cap (ruled_out): The prompt and stop-policy validator both consume lineage.iterations rather than the root maximum.; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1506-1529, .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1012-1063, specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/review/lineages/luna-max/deep-review-config.json:17-20, specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/review/lineages/deepseek-flash-max/deep-review-config.json:13-17, specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/review/lineages/swe2-max/deep-review-config.json:14-18

### Clean Search Proof
- iteration 1 path_traversal (ruled_out): No confirmed bypass was found; concurrency races were not exercised because tests were not run.; evidence=.skilled/commands/doctor/scripts/release-update.cjs:218-258
- iteration 1 rollback_integrity (ruled_out): No ordering defect was confirmed by direct read.; evidence=.skilled/commands/doctor/scripts/release-update.cjs:1817-1941, .skilled/commands/doctor/scripts/release-update.cjs:2178-2197
- iteration 1 rename_apply (ruled_out): No confirmed stale-path defect was found.; evidence=.skilled/commands/doctor/scripts/release-update.cjs:681-701, .skilled/commands/doctor/scripts/tests/release-update.test.cjs:541-590
- iteration 2 shared_gate_consistency (ruled_out): The entry points converge on one shared validator.; evidence=.skilled/skills/sk-git/scripts/validate-message.mjs:147-169, .skilled/scripts/git-hooks/commit-msg:76-79, .skilled/scripts/git-hooks/pre-push:247-249, .github/workflows/message-contract.yml:61,79
- iteration 3 per_lineage_iteration_cap (ruled_out): The prompt and stop-policy validator both consume lineage.iterations rather than the root maximum.; evidence=.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1506-1529, .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1012-1063, specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/review/lineages/luna-max/deep-review-config.json:17-20, specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/review/lineages/deepseek-flash-max/deep-review-config.json:13-17, specs/system-speckit/033-system-speckit-v4/068-v4-0-0-3-release-deep-review/review/lineages/swe2-max/deep-review-config.json:14-18

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: maintainability - Focus area: inspect shared fan-out and executor-routing boundaries for duplicated configuration or unclear ownership, expanding into changed callers only where the evidence points. - Reason: the initial correctness, security and traceability passes now cover separate release surfaces. - Rotation status: fresh dimension; no maintainability pass has run. - Blocked/productive carry-forward: no blocked review direction; direct source reads and manifest-scoped diffs were productive. - Required evidence: source-of-truth executor configuration, its fan-out consumers and the matching changed tests or documentation.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 1 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
