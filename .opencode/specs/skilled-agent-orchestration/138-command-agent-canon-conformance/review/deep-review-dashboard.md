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
- Review Target: .opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance (spec-folder)
- Started: 2026-07-14T19:26:13Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: 2026-07-14T19:26:13Z
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
| P1 (Required) | 11 |
| P2 (Suggestions) | 2 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | inventory | inventory | 1.00 | 0/1/1 | complete |
| 2 | correctness | correctness | 0.75 | 0/3/1 | complete |
| 3 | security | security | 0.50 | 0/5/0 | complete |
| 4 | traceability | traceability | 0.40 | 0/7/0 | complete |
| 5 | maintainability | maintainability | 0.00 | 0/7/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 6 |
| security | covered | 0 |
| traceability | covered | 7 |
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
- Last 3 ratios: 0.50 -> 0.40 -> 0.00
- convergenceScore: 1.00
- openFindings: 13
- persistentSameSeverity: 9
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 9

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
- dimension: traceability - focus area: Reconcile these security findings with checklist evidence, runtime parity claims, and parent/child completion contracts. - reason: Security found two active P1s and refined P2-002; the next pass must prove packet-wide traceability. - rotation status: queued - blocked/productive carry-forward: P1-001, P1-002, P1-003, P1-004, P1-005. - required evidence: child checklists, implementation summaries, cross-runtime permission/tool maps, and parent metadata. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 11 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
