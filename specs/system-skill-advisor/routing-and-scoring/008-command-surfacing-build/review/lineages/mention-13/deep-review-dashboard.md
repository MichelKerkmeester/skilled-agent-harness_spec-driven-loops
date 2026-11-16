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
- Started: 2026-11-16T21:51:12Z
- Status: INITIALIZED
- Iteration: 8 of 8
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-mention-13-1794865302020-qunumz
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
| P1 (Required) | 2 |
| P2 (Suggestions) | 5 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness - the new tail refusal and document rules, the widened occurrence boundary and the typed start boundary | correctness | 1.00 | 0/2/2 | complete |
| 2 | traceability - the document bullet and REQ-001 against the determiner rule, plus the checklist coverage rows | traceability | 0.14 | 0/2/4 | complete |
| 3 | security - trust boundary of the prompt text, the two new patterns, and the module import and secret surface | security | 0.00 | 0/2/4 | complete |
| 4 | maintainability - the reflowed fold comment and the readability of the two new rules documentation | maintainability | 0.07 | 0/2/5 | complete |
| 5 | correctness re-verification - reproduce F001 to F004 and probe the adjacent request shapes | correctness | 0.00 | 0/2/5 | complete |
| 6 | maintainability re-verification - which comment lines the branch rewrote, checked against b8ebee37d75 | maintainability | 0.00 | 0/2/5 | complete |
| 7 | security recovery pass at line-level granularity - each mark in the fold and the typed start boundary probed on its own | security | 0.00 | 0/2/5 | complete |
| 8 | cross-reference final pass - artifact self-consistency before the cap stop | correctness/security/traceability/maintainability | 0.00 | 0/2/5 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 4 |
| security | covered | 0 |
| traceability | covered | 2 |
| maintainability | covered | 1 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 1.00
- graphDecision: STOP_ALLOWED
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.00 -> 0.00 -> 0.00
- convergenceScore: 1.00
- openFindings: 7
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
- Dimension: none. The cap is reached and synthesis is the next phase. - Focus area: none. - Reason: 8 of 8 iterations used; the stop decision is `maxIterationsReached`. - Rotation status: exhausted. - Blocked/productive carry-forward: productive `probe the exported guards with the concrete prompts a finding names`; blocked `close this pass as converged` until F005 and F006 are fixed by the packet owner. - Required evidence: the recorded stop decision and the synthesis report. - Recovery note: none. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
