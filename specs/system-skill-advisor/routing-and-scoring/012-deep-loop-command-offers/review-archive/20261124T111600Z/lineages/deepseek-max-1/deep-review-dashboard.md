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
- Review Target: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers (spec-folder)
- Started: 2026-11-24T09:55:25.000Z
- Status: COMPLETE
- Iteration: 5 of 5
- Provisional Verdict: FAIL
- Failed required gates at stop: coverage
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-deepseek-max-1-1795514074741-gl47kr
- Parent Session: 2026-11-24T09:54:34.000Z
- Lifecycle Mode: new
- Generation: 4
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
| P1 (Required) | 0 |
| P2 (Suggestions) | 6 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | traceability | traceability | 1.00 | 0/0/3 | complete |
| 2 | traceability | traceability | 0.14 | 0/0/1 | complete |
| 3 | correctness | correctness | 0.00 | 0/0/0 | complete |
| 4 | traceability | traceability | 0.20 | 0/0/1 | complete |
| 5 | maintainability | maintainability/security | 0.17 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 0 |
| security | covered | 1 |
| traceability | covered | 5 |
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
- Last 3 ratios: 0.00 -> 0.20 -> 0.17
- convergenceScore: 0.83
- openFindings: 6
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
- None. This is the last iteration under `maxIterations: 5`; the run proceeds to synthesis with stop reason `maxIterationsReached`. - Rotation status: all four canonical dimensions covered (traceability 1-2-4, correctness 3, maintainability and security 5). - Blocked/productive carry-forward: the productive category "observed command, then read the cited line" carried the run; the exhausted category "two-language gate divergence" is closed for this tree. - Required evidence for synthesis: six active P2 findings, the two protocol statuses, the terminal gate rows and the four-dimension coverage record. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 6 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
