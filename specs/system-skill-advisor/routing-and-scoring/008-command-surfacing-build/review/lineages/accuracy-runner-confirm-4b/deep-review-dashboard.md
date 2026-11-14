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
- Started: 2026-11-14T18:24:38Z
- Status: COMPLETE
- Iteration: 3 of 3
- Provisional Verdict: PASS
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: fanout-accuracy-runner-confirm-4b-1794680176420-xvj4ed
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
| P2 (Suggestions) | 2 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 0.00 | 0/0/0 | complete |
| 2 | security | security | 0.00 | 0/0/0 | complete |
| 3 | RECOVERY (least-covered traceability and maintainability) | traceability/maintainability | 1.00 | 0/0/2 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 2 |
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
- Last 3 ratios: 0.00 -> 0.00 -> 1.00
- convergenceScore: 0.00
- openFindings: 2
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
- candidateCoverage: covered=2, ruledOut=8, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 field_persistence (ruled_out): The field is present on every branch that writes an offer.; evidence=command-offer.mjs:496, command-offer.mjs:80, run-command-behaviour.mjs:824
- iteration 1 writer_parity (ruled_out): No writer path drops the field.; evidence=run-command-behaviour.mjs:820-827, run-command-behaviour.mjs:1203, tests/command-behaviour-guards.vitest.ts:110-124
- iteration 1 partner_semantics (ruled_out): No input in the changed surface makes a partner command count as an offer.; evidence=score-command-transcripts.mjs:1471-1476, command-offer.mjs:80
- iteration 2 symlink_escape (ruled_out): A link to an outside file is refused before the open.; evidence=identity.mjs:104-116, codex.mjs:153-169
- iteration 2 resolved_path_toctou (ruled_out): No path leaves the caller's locator as the read target.; evidence=codex.mjs:169, codex.test.mjs:117-127
- iteration 2 holdout_leak (ruled_out): No holdout id is reachable through the runner.; evidence=run-command-behaviour.mjs:633-634, run-command-behaviour.mjs:782, run-command-behaviour.mjs:721-760
- iteration 2 untrusted_checkout_execution (ruled_out): No untrusted checkout reaches a hook or a child.; evidence=command-offer.mjs:458-460, run-command-behaviour.mjs:590-610
- iteration 3 checklist_evidence (ruled_out): No contradiction between the A11 advice and the checker or embed.; evidence=doctor-agents-md-presentation.txt:267-268, agents-md-check.cjs:776-778, agents-md-embed.cjs:373-410

### Clean Search Proof
- iteration 1 field_persistence (ruled_out): The field is present on every branch that writes an offer.; evidence=command-offer.mjs:496, command-offer.mjs:80, run-command-behaviour.mjs:824
- iteration 1 writer_parity (ruled_out): No writer path drops the field.; evidence=run-command-behaviour.mjs:820-827, run-command-behaviour.mjs:1203, tests/command-behaviour-guards.vitest.ts:110-124
- iteration 1 partner_semantics (ruled_out): No input in the changed surface makes a partner command count as an offer.; evidence=score-command-transcripts.mjs:1471-1476, command-offer.mjs:80
- iteration 2 symlink_escape (ruled_out): A link to an outside file is refused before the open.; evidence=identity.mjs:104-116, codex.mjs:153-169
- iteration 2 resolved_path_toctou (ruled_out): No path leaves the caller's locator as the read target.; evidence=codex.mjs:169, codex.test.mjs:117-127
- iteration 2 holdout_leak (ruled_out): No holdout id is reachable through the runner.; evidence=run-command-behaviour.mjs:633-634, run-command-behaviour.mjs:782, run-command-behaviour.mjs:721-760
- iteration 2 untrusted_checkout_execution (ruled_out): No untrusted checkout reaches a hook or a child.; evidence=command-offer.mjs:458-460, run-command-behaviour.mjs:590-610
- iteration 3 checklist_evidence (ruled_out): No contradiction between the A11 advice and the checker or embed.; evidence=doctor-agents-md-presentation.txt:267-268, agents-md-check.cjs:776-778, agents-md-embed.cjs:373-410

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining within the cap; synthesis - Focus area: compile the lineage report from the registry, the three deltas and the documentation findings. - Reason: three iterations are complete, two clean code dimensions and two P2 doc drifts; the cap is reached without a legal convergence stop. - Rotation status: correctness and security complete; traceability and maintainability covered by the recovery pass (partial, because the packet's checklist is still open). - Required evidence: the registry's active counts, the three iteration final lines and the synthesis report. - Blocked/productive carry-forward: no blocked approach. - Recovery note: the recovery pass changed granularity to line-level doc claims and produced the two findings.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
