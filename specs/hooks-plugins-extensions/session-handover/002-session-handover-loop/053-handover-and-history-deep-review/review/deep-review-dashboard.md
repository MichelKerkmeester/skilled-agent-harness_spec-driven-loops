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
- Review Target: .skilled/hooks/session-handover/ and .skilled/bin/skilled-loop (files)
- Started: 2026-11-17T06:46:29Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Provisional Verdict: FAIL
- Failed required gates at stop: coverage
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: 2026-11-17T06:46:29Z
- Parent Session: 2026-11-17T06:45:14Z
- Lifecycle Mode: restart
- Generation: 3
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
| P1 (Required) | 0 |
| P2 (Suggestions) | 4 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/0/1 | complete |
| 2 | security | security | 0.00 | 0/0/0 | complete |
| 3 | traceability | traceability | 0.50 | 0/0/1 | complete |
| 4 | maintainability | maintainability | 0.33 | 0/0/1 | complete |
| 5 | traceability | traceability | 0.25 | 0/0/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 1 |
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
- graphConvergenceScore: 0.79
- graphDecision: STOP_BLOCKED
- graphBlockers: {"count":10,"description":"Dimension coverage (75%) is below threshold (80%). 10 gap(s) found. STOP is blocked until all required dimensions have meaningful coverage.","severity":"blocking","type":"uncovered_dimensions"}

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.50 -> 0.33 -> 0.25
- convergenceScore: 0.75
- openFindings: 4
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
- candidateCoverage: covered=2, ruledOut=8, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 state_transition (ruled_out): verified by direct read; evidence=.skilled/bin/skilled-loop:1388, .skilled/hooks/session-handover/bin/session-handover.cjs:812, .skilled/hooks/session-handover/bin/session-handover.cjs:588
- iteration 1 input_escaping (ruled_out): verified by direct read; evidence=.skilled/hooks/session-handover/lib/relaunch-core.cjs:1897
- iteration 1 boundary_value (ruled_out): documented at runtime-behavior.md:73; evidence=.skilled/hooks/session-handover/runtime-behavior.md:73
- iteration 2 signal_targeting (ruled_out): verified by direct read; pid-reuse residual acknowledged in code; evidence=.skilled/hooks/session-handover/lib/killer.cjs:784, .skilled/hooks/session-handover/lib/killer.cjs:839
- iteration 2 path_traversal (ruled_out): verified by direct read; evidence=.skilled/hooks/session-handover/bin/session-handover.cjs:166, .skilled/hooks/session-handover/bin/session-handover.cjs:829
- iteration 2 privilege_escalation (ruled_out): verified by direct read; evidence=.skilled/bin/skilled-loop:266
- iteration 2 command_injection (ruled_out): verified by exhaustive exact search; evidence=.skilled/hooks/session-handover/claude/handover-stop-arm.mjs:62, .skilled/hooks/session-handover/lib/killer.cjs:689
- iteration 4 doc_code_drift (ruled_out): handoff-protocol.md:115 and :177 match the code; evidence=.skilled/hooks/session-handover/handoff-protocol.md:115, .skilled/hooks/session-handover/handoff-protocol.md:177

### Clean Search Proof
- iteration 1 state_transition (ruled_out): verified by direct read; evidence=.skilled/bin/skilled-loop:1388, .skilled/hooks/session-handover/bin/session-handover.cjs:812, .skilled/hooks/session-handover/bin/session-handover.cjs:588
- iteration 1 input_escaping (ruled_out): verified by direct read; evidence=.skilled/hooks/session-handover/lib/relaunch-core.cjs:1897
- iteration 1 boundary_value (ruled_out): documented at runtime-behavior.md:73; evidence=.skilled/hooks/session-handover/runtime-behavior.md:73
- iteration 2 signal_targeting (ruled_out): verified by direct read; pid-reuse residual acknowledged in code; evidence=.skilled/hooks/session-handover/lib/killer.cjs:784, .skilled/hooks/session-handover/lib/killer.cjs:839
- iteration 2 path_traversal (ruled_out): verified by direct read; evidence=.skilled/hooks/session-handover/bin/session-handover.cjs:166, .skilled/hooks/session-handover/bin/session-handover.cjs:829
- iteration 2 privilege_escalation (ruled_out): verified by direct read; evidence=.skilled/bin/skilled-loop:266
- iteration 2 command_injection (ruled_out): verified by exhaustive exact search; evidence=.skilled/hooks/session-handover/claude/handover-stop-arm.mjs:62, .skilled/hooks/session-handover/lib/killer.cjs:689
- iteration 4 doc_code_drift (ruled_out): handoff-protocol.md:115 and :177 match the code; evidence=.skilled/hooks/session-handover/handoff-protocol.md:115, .skilled/hooks/session-handover/handoff-protocol.md:177

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none; max-iterations reached, synthesis next. - Focus area: if a later run reopens, `claude/README.md`, `pi/README.md`, `lib/README.md` against code, and the 100 ms poll claim at `troubleshooting.md:58`. - Reason: these are the only `spec_code` surfaces not reached. - Rotation status: all four dimensions covered (4/4). - Productive carry-forward: enumerate every emitter of a documented event, then diff the doc's cause column against the gate that precedes the emitter. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 4 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
