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
- Review Target: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration (spec-folder)
- Started: 2026-11-15T13:09:08.871Z
- Status: COMPLETE
- Iteration: 1 of 1
- Provisional Verdict: FAIL
- Failed required gates at stop: coverage
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-fable-medium-1794748073879-re9m5r
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
| P1 (Required) | 0 |
| P2 (Suggestions) | 5 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | all four dimensions in one pass over the nine named commits, the changelog section and the three unlisted files | correctness/security/traceability/maintainability | 1.00 | 0/0/5 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 5 |
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
- Last 3 ratios: 1.00
- convergenceScore: 0.00
- openFindings: 5
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
- candidateCoverage: covered=5, ruledOut=3, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 state_transition (ruled_out): verified by direct read of recordsFromEntries and its new test; evidence=.skilled/hooks/shared/session-readers/claude.mjs:146, .skilled/hooks/shared/session-readers/claude.mjs:158, .skilled/hooks/shared/session-readers/claude.mjs:170
- iteration 1 injection (ruled_out): verified by direct read; evidence=.skilled/skills/system-spec-kit/runtime/hooks/lib/history/lookup-offer.ts:53, .skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:291, .skilled/hooks/session-handover/lib/relaunch-core.cjs:686
- iteration 1 dead_code (ruled_out): verified by exact search and the commit diff; evidence=.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:22, .skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:211

### Clean Search Proof
- iteration 1 state_transition (ruled_out): verified by direct read of recordsFromEntries and its new test; evidence=.skilled/hooks/shared/session-readers/claude.mjs:146, .skilled/hooks/shared/session-readers/claude.mjs:158, .skilled/hooks/shared/session-readers/claude.mjs:170
- iteration 1 injection (ruled_out): verified by direct read; evidence=.skilled/skills/system-spec-kit/runtime/hooks/lib/history/lookup-offer.ts:53, .skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:291, .skilled/hooks/session-handover/lib/relaunch-core.cjs:686
- iteration 1 dead_code (ruled_out): verified by exact search and the commit diff; evidence=.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:22, .skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:211

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none scheduled. The iteration cap is reached and the loop goes to synthesis. - Focus area if the review is reopened: run finding 1 against a sandbox with `CLAUDE_CONFIG_DIR` set, and read the catalog, playbook and README changes of f320d9d9bcd line by line. - Reason: finding 1 is the only one whose severity depends on a fact this pass could not run. - Rotation status: all four dimensions touched once. - Blocked or productive carry-forward: reading both the producer and the verifier of the locator was productive and found findings 1 and 2. - Required evidence: a claim-then-redeem run through `bin/history-lookup.mjs`. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 5 active P2 finding(s) — advisory only; release is not blocked by P2 alone, but the debt is tracked here so it does not disappear.

<!-- /ANCHOR:active-risks -->
