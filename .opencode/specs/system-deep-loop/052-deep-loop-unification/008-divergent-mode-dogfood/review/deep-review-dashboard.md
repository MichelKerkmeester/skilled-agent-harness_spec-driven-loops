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
- Review Target: .opencode/skills/system-deep-loop (skill)
- Started: 2026-07-11T06:22:25Z
- Status: INITIALIZED
- Iteration: 4 of 10
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: true
- hasAdvisories: false
- Session ID: 2026-07-11T06:22:25Z
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
| P1 (Required) | 7 |
| P2 (Suggestions) | 0 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| run-001 | correctness | correctness | 1.00 | 0/2/0 | complete |
| run-002 | security | security | 1.00 | 0/2/0 | complete |
| run-003 | traceability | traceability | 1.00 | 0/1/0 | complete |
| run-004 | maintainability | maintainability | 1.00 | 0/2/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 5 |
| security | covered | 2 |
| traceability | covered | 0 |
| maintainability | covered | 0 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.66
- graphDecision: STOP_BLOCKED
- graphBlockers: {"type":"uncovered_dimensions","description":"Dimension coverage (0%) is below threshold (80%). 9 gap(s) found. STOP is blocked until all required dimensions have meaningful coverage.","count":9,"severity":"blocking"}

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 1.00 -> 1.00 -> 1.00
- convergenceScore: 0.00
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
- graphCoverageMode: graphless_fallback
- candidateCoverage: covered=9, ruledOut=4, deferred=1, blocked=0

### Search Debt
- iteration 3 checklist_evidence (deferred): Iteration budget prioritized the newly discovered cross-consumer contract split.; evidence=.opencode/specs/system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood/review/deep-review-config.json:9-12

### Ruled-Out Candidates
- iteration 1 state_transition (ruled_out): Three-seat quorum and blocker veto are explicit.; evidence=.opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:685-705, .opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:868-895, .opencode/skills/system-deep-loop/runtime/tests/integration/divergent-pivot.vitest.ts:246-341
- iteration 1 durable_replay (ruled_out): Event IDs and persisted seat discovery gate redispatch.; evidence=.opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:499-573, .opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:1028-1160, .opencode/skills/system-deep-loop/runtime/tests/integration/divergent-pivot.vitest.ts:401-434
- iteration 2 command_injection (ruled_out): spawn/spawnSync receive structured argv arrays.; evidence=.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:874-881, .opencode/commands/deep/assets/deep_review_auto.yaml:1225-1261
- iteration 2 secret_exposure (ruled_out): Source and end-to-end child visibility test agree.; evidence=.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:391-427, .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:730-756, .opencode/skills/system-deep-loop/runtime/tests/executor-audit-receipts.test.ts:159-236

### Clean Search Proof
- iteration 1 state_transition (ruled_out): Three-seat quorum and blocker veto are explicit.; evidence=.opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:685-705, .opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:868-895, .opencode/skills/system-deep-loop/runtime/tests/integration/divergent-pivot.vitest.ts:246-341
- iteration 1 durable_replay (ruled_out): Event IDs and persisted seat discovery gate redispatch.; evidence=.opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:499-573, .opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:1028-1160, .opencode/skills/system-deep-loop/runtime/tests/integration/divergent-pivot.vitest.ts:401-434
- iteration 2 command_injection (ruled_out): spawn/spawnSync receive structured argv arrays.; evidence=.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:874-881, .opencode/commands/deep/assets/deep_review_auto.yaml:1225-1261
- iteration 2 secret_exposure (ruled_out): Source and end-to-end child visibility test agree.; evidence=.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:391-427, .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:730-756, .opencode/skills/system-deep-loop/runtime/tests/executor-audit-receipts.test.ts:159-236

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 7 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 1 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
