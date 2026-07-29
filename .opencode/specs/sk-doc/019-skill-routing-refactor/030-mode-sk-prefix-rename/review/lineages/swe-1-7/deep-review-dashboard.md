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
- Review Target: .opencode/specs/sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename (spec-folder)
- Started: 2026-07-28T12:00:00.000Z
- Status: COMPLETE
- Iteration: 10 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-swe-1-7-1785217654899-ls3rh2
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
| P2 (Suggestions) | 7 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| run-swe-1-7-001 | Correctness: mode-registries, hub-routers, leaf-manifests vs rename map | correctness | 1.00 | 0/1/1 | complete |
| run-swe-1-7-002 | Correctness: remaining registries and router consistency | correctness | 0.00 | 0/0/0 | complete |
| run-swe-1-7-003 | Traceability: shared references and docs for stale workflowMode strings | traceability | 0.60 | 0/0/3 | complete |
| run-swe-1-7-004 | Maintainability: description keywords and test fixtures | maintainability | 0.38 | 0/0/3 | complete |
| run-swe-1-7-005 | Security: secrets and permissions in changed files | security | 0.00 | 0/0/0 | complete |
| run-swe-1-7-006 | Correctness: command bindings and agent definitions | correctness | 0.00 | 0/0/0 | complete |
| run-swe-1-7-007 | Traceability: advisor and skill consumer realignment | traceability | 0.00 | 0/0/0 | complete |
| run-swe-1-7-008 | Maintainability: benchmark gold and historical reports | maintainability | 0.00 | 0/0/0 | complete |
| run-swe-1-7-009 | Correctness: final runtime mirror sweep | correctness | 0.00 | 0/0/0 | complete |
| run-swe-1-7-010 | Synthesis: aggregate findings and final verdict | synthesis | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 2 |
| security | covered | 0 |
| traceability | covered | 3 |
| maintainability | covered | 3 |

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
- Last 3 ratios: 0.00 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 8
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
Synthesis: aggregate findings and emit final state Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
