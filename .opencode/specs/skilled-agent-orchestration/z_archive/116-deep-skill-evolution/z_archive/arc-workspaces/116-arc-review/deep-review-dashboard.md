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
- Review Target: .opencode/specs/skilled-agent-orchestration/116-deep-review-complexity (spec-folder)
- Started: 2026-05-22T16:45:00Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Provisional Verdict: FAIL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: 116-deep-review-dogfood-2026-05-22
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
| P1 (Required) | 1 |
| P2 (Suggestions) | 2 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 116-deep-review-dogfood-2026-05-22 | correctness | correctness | 1.00 | 1/1/1 | complete |
| 116-deep-review-dogfood-2026-05-22 | security | security | 0.33 | 0/0/1 | complete |
| 116-deep-review-dogfood-2026-05-22 | traceability | traceability | 0.00 | 0/0/0 | complete |
| 116-deep-review-dogfood-2026-05-22 | maintainability | maintainability | 0.00 | 0/0/0 | complete |
| 116-deep-review-dogfood-2026-05-22 | correctness-deep | correctness | 0.20 | 0/0/1 | complete |
| 116-deep-review-dogfood-2026-05-22 | security-deep | security | 0.20 | 0/0/1 | complete |
| 116-deep-review-dogfood-2026-05-22 | traceability-cross-surface | traceability | 0.20 | 0/0/1 | complete |
| 116-deep-review-dogfood-2026-05-22 | maintainability-sustainability | maintainability | 0.20 | 0/1/0 | complete |
| 116-deep-review-dogfood-2026-05-22 | correctness-p0-adversarial | correctness | 0.00 | 0/0/0 | complete |
| 116-deep-review-dogfood-2026-05-22 | insight-cross-cutting | insight | 0.00 | 0/0/0 | insight |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 4 |
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
- Last 3 ratios: 0.20 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 4
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
- graphCoverageMode: graphless_fallback

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Iteration 9: correctness (round 3, focused on hotspots from prior rounds). The correctness dimension had the highest finding density (P0=1, P1=1 across iterations 1 and 5). Review verdict: CONDITIONAL (P1 finding present, no P0)

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P0 finding(s) blocking release.
- 1 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
