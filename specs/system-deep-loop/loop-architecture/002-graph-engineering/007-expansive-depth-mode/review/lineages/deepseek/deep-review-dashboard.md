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
- Review Target: 17a9ddbcb68..555487146e2 -- .skilled/skills/system-deep-loop .skilled/commands/deep (files)
- Started: 2026-11-20T19:06:54.621Z
- Status: COMPLETE
- Iteration: 16 of 24
- Provisional Verdict: PASS
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: fanout-deepseek-1795201537192-sq1ivw
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
| P1 (Required) | 0 |
| P2 (Suggestions) | 9 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | Frontier node F-1-002: correctness | correctness | 1.00 | 0/0/2 | complete |
| 2 | Frontier node F-1-004: correctness | correctness | 1.00 | 0/0/1 | complete |
| 3 | Frontier node F-1-006: correctness | correctness | 0.38 | 0/0/2 | complete |
| 4 | Frontier node F-1-002: security | security | 0.20 | 0/0/1 | complete |
| 5 | Frontier node F-1-004: security | security | 0.00 | 0/0/0 | complete |
| 6 | Frontier node F-1-006: security | security | 0.00 | 0/0/0 | complete |
| 7 | Frontier node F-1-002: traceability | traceability | 0.00 | 0/0/0 | complete |
| 8 | Frontier node F-1-004: traceability | traceability | 0.17 | 0/0/1 | complete |
| 9 | Frontier node F-1-006: traceability | traceability | 0.00 | 0/0/0 | complete |
| 10 | Frontier node F-1-002: maintainability | maintainability | 0.00 | 0/0/0 | complete |
| 11 | Frontier node F-1-004: maintainability | maintainability | 0.14 | 0/0/1 | complete |
| 12 | Frontier node F-1-006: maintainability | maintainability | 0.13 | 0/0/1 | complete |
| 13 | Frontier node F-2-007: correctness | correctness | 0.11 | 0/0/1 | complete |
| 14 | Frontier node F-2-007: security | security | 0.00 | 0/0/0 | complete |
| 15 | Frontier node F-2-007: traceability | traceability | 0.06 | 0/0/1 | complete |
| 16 | Frontier node F-2-007: maintainability | maintainability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 5 |
| security | covered | 1 |
| traceability | covered | 1 |
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
- Last 3 ratios: 0.00 -> 0.06 -> 0.00
- convergenceScore: 1.00
- openFindings: 9
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
<!-- ANCHOR:frontier -->
## 10B. FRONTIER
- Frontier size: 4 nodes (0 open, 0 active, 4 answered, 0 exhausted, 0 blocked, 0 abstained)
- Pruned nodes: 0
- Revisits: 0
- Budget depth1: 12 of 12 iterations spent
- Budget depth2: 4 of 8.4 iterations spent
- Budget depth3: 0 of 8 iterations spent
- Active node: none

<!-- /ANCHOR:frontier -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining on this node; the frontier is drained (all four nodes answered) - Frontier node: none (F-2-007 is the last open node and this pass completes its fourth dimension) - Focus area: synthesis readiness — the next convergence check should form a `frontier_drained` candidate, and the legal-stop gates decide it. - Reason: every node has all four canonical dimensions covered; no open or active node remains. - Rotation status: all dimensions covered on all four nodes. - Blocked/productive carry-forward: productive (test-coverage tracing closed the maintainability question); no blocked approaches. - Required evidence: the convergence decision after this iteration. - Recovery note: none. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 9 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
