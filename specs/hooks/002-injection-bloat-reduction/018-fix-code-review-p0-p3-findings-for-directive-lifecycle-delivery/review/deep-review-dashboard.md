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
- Review Target: Review the completed phase 018 directive-lifecycle implementation and packet evidence for correctness, security, traceability, maintainability, and regression-proof honesty. Treat unrelated dirty-tree changes as out of scope. Bind all review state to the packet and do not modify implementation files. (spec-folder)
- Started: 2026-08-11T20:09:17.000Z
- Status: COMPLETE
- Iteration: 6 of 7
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: 2026-08-11T20:09:17.000Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: converged

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
| P2 (Suggestions) | 19 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | - | 1.00 | 0/0/0 | complete |
| 2 | correctness | - | 0.75 | 0/0/0 | complete |
| 3 | security | - | 0.33 | 0/0/0 | complete |
| 4 | traceability | - | 0.32 | 0/0/0 | complete |
| 5 | maintainability | - | 0.13 | 0/0/0 | complete |
| 6 | overlay protocols + final checklist closeout | - | 0.07 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 15 |
| security | covered | 0 |
| traceability | covered | 4 |
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
- Last 3 ratios: 0.32 -> 0.13 -> 0.07
- convergenceScore: 0.93
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
**Dimension:** closeout synthesis **Focus Area:** Metadata regeneration + final checklist satisfaction **Why:** P1-001 (graph-metadata.json status stale `"planned"` vs `"in_progress"`) is the single remaining active P1. It blocks CHK-140, CHK-141, and CHK-142. All code review is complete — no active P0, no new P1, convergence achieved (newFindingsRatio=0.07 < 0.10). The last action is metadata regeneration through the canonical save path (`generate-context.js` or equivalent), which is a maintenance action, not a review action. **Rotation Status:** Synthesis — all dimensions complete, overlay protocols complete, checklist evidence reviewed. **Blocked/Productive Carry-Forward:** Productive — P1-001 has a clear, non-code resolution path (regenerate metadata). **Required Evidence:** Run `validate.sh --strict` after metadata regeneration; verify CHK-140/141/142 can be checked; confirm P1-001 resolved. **Recovery Note:** N/A (not in recovery mode)

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
