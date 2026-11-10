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
- Review Target: skill:sk-create-goal (.skilled/skills/sk-doc/sk-create-goal) plus every cross-repo surface that names it (skill)
- Started: 2026-09-26T17:35:08Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: 2026-09-26T17:35:08Z
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
| P1 (Required) | 3 |
| P2 (Suggestions) | 18 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | - | 0.00 | 0/0/0 | complete |
| 2 | security | - | 0.00 | 0/0/0 | complete |
| 3 | traceability | - | 0.00 | 0/0/0 | complete |
| 4 | maintainability | - | 0.00 | 0/0/0 | complete |
| 5 | traceability | - | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | pending | 19 |
| security | pending | 0 |
| traceability | pending | 2 |
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
- Last 3 ratios: N/A
- convergenceScore: 0.00
- openFindings: 21
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
- No search-depth state captured (legacy v1 record).
- graphCoverageMode: none

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- dimension: none remaining (4 of 4 covered); iteration 5 runs the agent definition's cross-reference fallback. - focus area: cross-repo surfaces naming the mode that no iteration has line-audited - the three runtime prompt mirrors (`.codex/prompts/create-goal.md`, `.hermes/prompts/create-goal.md`, `.pi/prompts/create-goal.md`) and `.skilled/commands/create/assets/create-goal-presentation.txt` against the mode's six operations and the budget-and-handoff send rule. - reason: cross-repo naming agreement is the one review direction no dimension covered end to end. - rotation status: fallback (no dimension left to rotate). - blocked/productive carry-forward: productive - iteration 3's section-pointer sweep isolated one stale row in 23 citations in one pass, and the same technique applies to the prompt mirrors. - required evidence: quoted prompt text against the canonical operation names and the send rule.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 3 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
