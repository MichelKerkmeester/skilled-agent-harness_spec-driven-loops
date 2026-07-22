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
- Review Target: .opencode/specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/013-compiled-coverage-buildout (spec-folder)
- Started: 2026-07-22T03:54:41.300Z
- Status: COMPLETE
- Iteration: 10 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-luna-xhigh-1784691838667-iv78vk
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
| P1 (Required) | 2 |
| P2 (Suggestions) | 2 |
| Resolved | 1 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness: manifest refresh and resolver gates | correctness | 1.00 | 0/1/0 | complete |
| 2 | correctness: per-hub routing and parity invariants | correctness | 0.00 | 0/1/0 | complete |
| 3 | security: path, flag, and serving boundaries | security | 0.00 | 0/1/0 | complete |
| 4 | traceability: completion and evidence reconciliation | traceability | 0.67 | 0/2/1 | complete |
| 5 | maintainability: cohort and runtime synchronization | maintainability | 0.25 | 0/2/2 | complete |
| 6 | correctness adjudication: refresh generation races | correctness | 0.00 | 0/2/2 | complete |
| 7 | integration: resolver, parity, and promoted closure | correctness/security | 0.00 | 0/2/2 | complete |
| 8 | resilience: malformed inputs and fail-closed recovery | security/correctness | 0.00 | 0/2/2 | complete |
| 9 | regression evidence: tests and scope boundaries | traceability/correctness | 0.00 | 0/2/2 | complete |
| 10 | final convergence: whole-packet disposition | correctness/security/traceability/maintainability | 0.00 | 0/2/2 | complete |

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
- Last 3 ratios: 0.00 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 4
- persistentSameSeverity: 4
- severityChanged: 0
- repeatedFindings (deprecated combined bucket): 4

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
- dimension: convergence - focus area: whole-packet disposition and finding persistence - reason: regression evidence is adequate; final pass must ensure findings are neither duplicated nor silently dropped Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
