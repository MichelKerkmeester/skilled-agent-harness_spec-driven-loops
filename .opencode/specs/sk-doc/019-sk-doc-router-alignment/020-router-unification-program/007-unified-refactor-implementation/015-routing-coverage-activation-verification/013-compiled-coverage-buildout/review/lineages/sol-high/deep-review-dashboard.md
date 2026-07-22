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
- Started: 2026-07-22T03:46:22.267Z
- Status: COMPLETE
- Iteration: 10 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-sol-high-1784691838667-iv78vk
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
| P1 (Required) | 5 |
| P2 (Suggestions) | 2 |
| Resolved | 2 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness: manifest refresh safety | correctness | 1.00 | 0/1/0 | complete |
| 2 | correctness: cutover action semantics | correctness | 1.00 | 0/2/0 | complete |
| 3 | security: resolver and manifest trust boundaries | security | 0.00 | 0/2/0 | complete |
| 4 | traceability: completion and evidence integrity | traceability | 1.00 | 0/1/1 | complete |
| 5 | maintainability: duplicated matcher and cutover telemetry drift | maintainability | 1.00 | 0/1/1 | complete |
| 6 | correctness: boundary matcher same-class sweep | correctness | 0.50 | 0/1/0 | insight |
| 7 | traceability: live completion-evidence replay | traceability | 1.00 | 0/1/0 | complete |
| 8 | correctness: authored and promoted closure root cause | correctness | 0.50 | 0/1/0 | insight |
| 9 | security: kill-switch and fail-safe stabilization | security | 0.00 | 0/0/0 | complete |
| 10 | maintainability: final adversarial replay and synthesis readiness | maintainability | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 2 |
| security | covered | 0 |
| traceability | covered | 3 |
| maintainability | covered | 2 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 2.50
- graphDecision: STOP_ALLOWED
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.50 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 7
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
- Hard ceiling reached: synthesize the deduplicated registry. - Aggregate verdict: CONDITIONAL because five active P1 findings remain. - Stop reason: `maxIterationsReached`. - Required follow-up: remediation planning before a release-complete claim. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 5 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
