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
- Review Target: specs/system-speckit/032-relocate-specs-folder/005-readme-migration-audit (spec-folder)
- Started: 2026-08-07T19:46:00Z
- Status: COMPLETE
- Iteration: 10 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-deepseek-flash-1786124587346-0du5cu
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
| P1 (Required) | 10 |
| P2 (Suggestions) | 30 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| run-001 | correctness | correctness | 1.00 | 0/2/10 | complete |
| run-002 | security | security | 1.00 | 0/3/10 | complete |
| run-003 | traceability | traceability | 1.00 | 0/4/12 | complete |
| run-004 | maintainability | maintainability | 1.00 | 0/5/13 | complete |
| run-005 | symlink-correctness-negative-baseline | correctness/security/traceability/maintainability | 0.00 | 0/5/14 | complete |
| run-006 | historical-classification+root-split | correctness/security/traceability/maintainability | 0.00 | 0/5/15 | complete |
| run-007 | hit-file-completeness-sweep | correctness/security/traceability/maintainability | 0.00 | 0/5/15 | complete |
| run-008 | canonicalization-target-feasibility | correctness/security/traceability/maintainability | 0.00 | 0/5/15 | complete |
| run-009 | topology-drift-variant-scan | correctness/security/traceability/maintainability | 0.00 | 0/5/15 | complete |
| run-010 | adversarial-p0p1-replay | correctness/security/traceability/maintainability | 0.00 | 0/5/15 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 3 |
| security | covered | 12 |
| traceability | covered | 3 |
| maintainability | covered | 4 |

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
- openFindings: 40
- persistentSameSeverity: 20
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 20

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
Synthesis: compile review-report.md from 10 iterations, derive verdict, reconcile findings.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 10 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
