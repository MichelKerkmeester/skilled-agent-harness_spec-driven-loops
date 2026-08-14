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
- Review Target: specs/system-speckit/034-spec-template-context-optimizations (spec-folder)
- Started: 2026-08-12T16:30:48Z
- Status: COMPLETE
- Iteration: 10 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-pi-flash-review-1786551828250-nkwps1
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
| P1 (Required) | 16 |
| P2 (Suggestions) | 18 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | D1 Correctness - Requirement logic, acceptance criteria, gate integrity | correctness | 0.72 | 0/2/2 | complete |
| 2 | D2 Security - Trust boundaries of uncommitted implementation changes | security | 0.60 | 0/3/3 | complete |
| 3 | D3 Traceability - Core protocols spec_code + checklist_evidence | traceability | 0.73 | 0/5/4 | complete |
| 4 | D4 Maintainability - Cross-doc structure, template consolidation quality, naming clarity | maintainability | 0.64 | 0/6/6 | complete |
| 5 | REQ-001 gating completeness - per-level render contract for research.md.tmpl | correctness | 0.55 | 0/7/7 | complete |
| 6 | AC_COVERAGE behavior verification - F008 claim adjudication | traceability | 0.33 | 0/7/7 | complete |
| 7 | REQ-006 memory_search budget - test verification and acceptance check | correctness | 0.00 | 0/7/7 | complete |
| 8 | REQ-005 scope-adherence rule - behavior verification and false-positive analysis | correctness | 0.50 | 0/8/7 | complete |
| 9 | Checklist evidence protocol + traceability protocol closure | traceability | 0.17 | 0/8/8 | complete |
| 10 | Decision-record completeness, open questions, stabilization pass | traceability | 0.17 | 0/8/9 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 10 |
| security | covered | 4 |
| traceability | covered | 14 |
| maintainability | covered | 6 |

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
- Last 3 ratios: 0.50 -> 0.17 -> 0.17
- convergenceScore: 0.83
- openFindings: 34
- persistentSameSeverity: 16
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 16

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
Synthesis — dedup findings, replay convergence, compile review-report.md. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 16 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
