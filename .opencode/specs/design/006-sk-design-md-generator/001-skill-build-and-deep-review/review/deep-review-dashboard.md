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
- Review Target: .opencode/skills/sk-design-md-generator (skill)
- Started: 2026-06-21T10:32:25Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: 2026-06-21T10:32:25Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:findings-summary -->
## 3. FINDINGS SUMMARY

| Severity | Count |
|----------|------:|
| P0 (Blockers) | 0 |
| P1 (Required) | 13 |
| P2 (Suggestions) | 30 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | extraction pipeline | correctness | 0.44 | 0/1/3 | complete |
| 2 | clustering + validation | correctness | 0.25 | 0/2/1 | complete |
| 3 | network/fs/cli robustness | security | 1.00 | 0/4/1 | complete |
| 4 | per-feature extractors | correctness | 0.45 | 0/1/9 | complete |
| 5 | output generators | correctness | 0.15 | 0/0/4 | complete |
| 6 | refactor quality + types | maintainability | 0.16 | 0/0/5 | complete |
| 7 | SKILL.md claims vs code | traceability | 0.14 | 0/4/1 | complete |
| 8 | skill docs accuracy + de-attribution | traceability | 0.08 | 0/1/2 | complete |
| 9 | advisor registration | correctness | 0.00 | 0/0/0 | complete |
| 10 | skill structure vs sk-doc standards | maintainability | 0.09 | 0/0/4 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 43 |
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
- Last 3 ratios: 0.08 -> 0.00 -> 0.09
- convergenceScore: 0.91
- openFindings: 43
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
- 13 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
