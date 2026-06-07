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
- Review Target: git commit 531dd53028 work across 005-runtime-mirror-parity, 006-native-default-executor-pool, 007-deep-command-gate-hardening (spec-folder)
- Started: 2026-06-07T11:00:50Z
- Status: COMPLETE
- Iteration: 10 of 10
- Provisional Verdict: FAIL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: rvw-2026-06-07-dc134
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:findings-summary -->
## 3. FINDINGS SUMMARY

| Severity | Count |
|----------|------:|
| P0 (Blockers) | 1 |
| P1 (Required) | 13 |
| P2 (Suggestions) | 6 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | claude-mirror | security/correctness | 0.33 | 1/0/0 | complete |
| 2 | codex-mirror | correctness | 0.20 | 0/1/0 | complete |
| 3 | canonical-and-config | correctness/consistency | 0.10 | 0/0/1 | complete |
| 4 | context-pool | correctness/consistency | 0.60 | 0/2/2 | complete |
| 5 | context-gates | correctness | 0.40 | 0/2/0 | complete |
| 6 | research-review-gates | consistency | 0.00 | 0/0/0 | complete |
| 7 | aicouncil-skillbench-gates | correctness/consistency | 0.20 | 0/1/0 | complete |
| 8 | crosscommand-uniformity | consistency/maintainability | 0.50 | 0/2/1 | complete |
| 9 | yaml-skill-readme | correctness/consistency | 0.70 | 0/3/1 | complete |
| 10 | specdoc-accuracy | traceability/completeness | 0.50 | 0/2/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 20 |
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
- Last 3 ratios: 0.50 -> 0.70 -> 0.50
- convergenceScore: 0.50
- openFindings: 20
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
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P0 finding(s) blocking release.
- 13 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
