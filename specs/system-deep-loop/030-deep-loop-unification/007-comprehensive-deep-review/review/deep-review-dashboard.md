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
- Review Target: .opencode/skills/system-deep-loop (skill)
- Started: 2026-07-08T18:59:04.000Z
- Status: INITIALIZED
- Iteration: 20 of 20
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: 2026-07-08T18:59:04.000Z
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
| P1 (Required) | 7 |
| P2 (Suggestions) | 15 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| run-001 | inventory | inventory | 0.00 | 0/0/0 | complete |
| run-002 | correctness-hub | correctness | 1.00 | 0/0/1 | complete |
| run-003 | security-hub | security | 1.00 | 0/0/1 | complete |
| run-004 | traceability-hub | traceability | 0.33 | 0/0/1 | complete |
| run-005 | maintainability-hub | maintainability | 0.20 | 0/0/1 | complete |
| run-006 | correctness-deep-research | correctness | 0.40 | 0/0/2 | complete |
| run-007 | security-deep-research | security | 1.00 | 0/2/0 | complete |
| run-008 | traceability-deep-research | traceability | 0.13 | 0/1/0 | complete |
| run-009 | maintainability-deep-research | maintainability | 0.10 | 0/0/1 | complete |
| run-010 | correctness-deep-review | correctness | 1.00 | 0/0/2 | complete |
| run-011 | security-deep-review | security | 1.00 | 0/1/0 | complete |
| run-012 | traceability-deep-review | traceability | 0.07 | 0/0/1 | complete |
| run-013 | maintainability-deep-review | maintainability | 1.00 | 0/0/1 | complete |
| run-014 | correctness-deep-improvement | correctness | 1.00 | 0/1/0 | complete |
| run-015 | security-deep-improvement | security | 1.00 | 0/1/0 | complete |
| run-016 | traceability-deep-improvement | traceability | 0.06 | 0/0/1 | complete |
| run-017 | maintainability-deep-improvement | maintainability | 0.25 | 0/0/1 | complete |
| run-018 | correctness-security-deep-ai-council | correctness/security | 0.10 | 0/1/1 | complete |
| run-019 | traceability-maintainability-deep-ai-council | traceability | 0.10 | 0/0/2 | complete |
| run-020 | synthesis-final | maintainability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 15 |
| security | covered | 1 |
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
- graphDecision: CONTINUE
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.10 -> 0.10 -> 0.00
- convergenceScore: 1.00
- openFindings: 22
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
- No search-depth state captured (legacy v1 record).
- graphCoverageMode: none

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 7 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
