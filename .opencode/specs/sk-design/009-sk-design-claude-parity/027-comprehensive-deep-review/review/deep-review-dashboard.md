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
- Review Target: .opencode/skills/sk-design (skill)
- Started: 2026-07-09T05:15:59.000Z
- Status: IN_PROGRESS
- Iteration: 20 of 20
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: 2026-07-09T05:15:59.000Z
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
| P1 (Required) | 14 |
| P2 (Suggestions) | 16 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| run-001 | inventory | inventory | 1.00 | 0/1/0 | complete |
| run-002 | correctness-traceability-skdoc-hub | correctness/traceability | 0.40 | 0/0/2 | complete |
| run-004 | correctness-traceability-catalog-changelog-playbook | correctness/traceability | 1.00 | 0/1/0 | complete |
| run-005 | security-traceability-cross-hub-routing | security/traceability | 1.00 | 0/1/0 | complete |
| run-003 | security-maintainability-shared-benchmark | security/maintainability | 1.00 | 0/2/0 | complete |
| run-006 | correctness-security-design-interface | correctness/security | 1.00 | 0/1/1 | complete |
| run-007 | traceability-maintainability-skdoc-design-interface | traceability/maintainability | 0.60 | 0/0/3 | complete |
| run-008 | correctness-security-design-foundations | correctness/security | 0.00 | 0/0/0 | complete |
| run-009 | traceability-maintainability-skdoc-design-foundations | traceability/maintainability | 1.00 | 0/1/2 | complete |
| run-012 | correctness-security-design-motion | correctness/security | 1.00 | 0/1/0 | complete |
| run-013 | traceability-maintainability-skdoc-design-motion | traceability/maintainability | 0.14 | 0/1/0 | complete |
| run-011 | traceability-maintainability-skdoc-design-audit | traceability/maintainability | 0.40 | 0/1/1 | complete |
| run-010 | correctness-security-design-audit | correctness/security | 1.00 | 0/3/1 | complete |
| run-016 | traceability-maintainability-skdoc-md-generator-backend | traceability/maintainability | 0.75 | 0/1/2 | complete |
| run-015 | correctness-security-md-generator-backend | correctness/security | 0.00 | 0/0/0 | complete |
| run-017 | correctness-traceability-md-generator-nonbackend | correctness/traceability | 0.25 | 0/0/1 | complete |
| run-014 | combined-design-mcp-open-design | correctness/security/traceability/maintainability | 0.08 | 0/0/1 | complete |
| run-020 | synthesis-final | correctness/security/traceability/maintainability | 0.29 | 0/0/2 | complete |
| run-019 | correctness-traceability-cross-hub-reverify | correctness/traceability | 0.20 | 0/1/0 | complete |
| run-018 | security-maintainability-md-generator-gapfill | security/maintainability | 0.20 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 23 |
| security | covered | 1 |
| traceability | covered | 6 |
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
- Last 3 ratios: 0.29 -> 0.20 -> 0.20
- convergenceScore: 0.80
- openFindings: 30
- persistentSameSeverity: 2
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 2

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
- 14 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
