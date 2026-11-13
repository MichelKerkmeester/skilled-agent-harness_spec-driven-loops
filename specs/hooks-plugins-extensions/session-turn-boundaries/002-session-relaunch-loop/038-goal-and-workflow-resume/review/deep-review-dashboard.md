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
- Review Target: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume (spec-folder)
- Started: 2026-11-13T04:30:08Z
- Status: INITIALIZED
- Iteration: 3 of 3
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: 2026-11-13T04:30:08Z
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
| P1 (Required) | 1 |
| P2 (Suggestions) | 8 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/1/3 | complete |
| 2 | security (D2) then traceability (D3) start | security/traceability | 0.27 | 0/0/3 | complete |
| 3 | maintainability (D4) plus remaining correctness and the active-P1 adversarial recheck | maintainability/correctness | 0.15 | 0/0/2 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 9 |
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
- graphConvergenceScore: 0.76
- graphDecision: STOP_BLOCKED
- graphBlockers: {"count":7,"description":"Dimension coverage (57%) is below threshold (80%). 7 gap(s) found. STOP is blocked until all required dimensions have meaningful coverage.","severity":"blocking","type":"uncovered_dimensions"}

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 1.00 -> 0.27 -> 0.15
- convergenceScore: 0.85
- openFindings: 9
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
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=5, ruledOut=2, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 state_transition (ruled_out): verified by direct read of every branch; evidence=relaunch-core.cjs:1245-1267
- iteration 1 injection (ruled_out): validated path shape and escaping inspected; evidence=relaunch-core.cjs:111-131, relaunch-core.cjs:1437-1441
- iteration 2 injection (ruled_out): verified by direct read of the trust derivation; evidence=skilled-loop-shell.sh:63-66, skilled-loop-shell.sh:328
- iteration 2 injection (ruled_out): fixed vocabulary confirmed; evidence=relaunch-core.cjs:645-647, session-relaunch.cjs:410

### Clean Search Proof
- iteration 1 state_transition (ruled_out): verified by direct read of every branch; evidence=relaunch-core.cjs:1245-1267
- iteration 1 injection (ruled_out): validated path shape and escaping inspected; evidence=relaunch-core.cjs:111-131, relaunch-core.cjs:1437-1441
- iteration 2 injection (ruled_out): verified by direct read of the trust derivation; evidence=skilled-loop-shell.sh:63-66, skilled-loop-shell.sh:328
- iteration 2 injection (ruled_out): fixed vocabulary confirmed; evidence=relaunch-core.cjs:645-647, session-relaunch.cjs:410

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining — maintainability (D4) completed this iteration; max iterations reached. - Focus area: none for this run. - Reason: `maxIterations: 3` is exhausted. The terminal synthesis should treat R1-P1-001 as open, finding 8 as the duplication follow-up, and finding 9 as the documentation follow-up. - Rotation status: correctness `partial`; security `partial`; traceability `partial` (core); maintainability `covered` (this iteration). - Blocked/productive carry-forward: productive = full reads of the nudge/CLI pair and the producer/consumer event-name path; blocked = none. - Required evidence for a future run: the unchecked child packets 001/003/004/007, every `acceptance-criteria.md` row, `commands/speckit/handoff.md`, the goal-hook playbook, and a captured Claude startup payload set. - Recovery note: the overlays and checklist evidence remain deferred rather than silently passed; a resumed run must start there, not at the dimensions already recorded. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 1 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
