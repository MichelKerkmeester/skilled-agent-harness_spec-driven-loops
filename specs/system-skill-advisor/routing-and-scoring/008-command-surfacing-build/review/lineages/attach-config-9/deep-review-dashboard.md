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
- Review Target: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build (spec-folder)
- Started: 2026-11-16T13:43:33Z
- Status: COMPLETE
- Iteration: 4 of 8
- Provisional Verdict: PASS
- hasSearchDebt: false
- hasAdvisories: true
- Session ID: fanout-attach-config-9-1794835877856-5ghgm4
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
| P2 (Suggestions) | 1 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 0.00 | 0/0/0 | complete |
| 2 | security | security | 0.00 | 0/0/0 | complete |
| 3 | traceability | traceability/maintainability | 1.00 | 0/0/1 | complete |
| 4 | confirmation | correctness/security/traceability/maintainability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 0 |
| security | covered | 0 |
| traceability | covered | 0 |
| maintainability | covered | 1 |

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
- Last 3 ratios: 0.00 -> 1.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 1
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
- Dimension: none remaining; all four configured dimensions are complete. - Focus area: synthesis -- compile `review-report.md` from the registry and the iteration files, derive the verdict from the registry, and close the run. - Reason: the convergence signals and the coverage-age signal are both satisfied at this record; the remaining work is synthesis, not another review pass. - Rotation status: correctness, security, traceability and maintainability complete; one active P2 advisory. - Blocked/productive carry-forward: nothing blocked; the direct-read, sweep and variant-comparison approaches were productive from the first pass. - Required evidence: none further; the single P2 carries file:line, a concrete input and a reproduction. - Recovery note: not in recovery. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
