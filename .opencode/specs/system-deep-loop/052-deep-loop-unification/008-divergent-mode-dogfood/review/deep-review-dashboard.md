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
- Iteration: 9 of 10
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
| P1 (Required) | 13 |
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
| run-005 | traceability stabilization: checklist_evidence and typed adjudication recovery | traceability | 0.50 | 0/1/0 | complete |
| run-006 | traceability overlay protocol coverage: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability | traceability | 0.50 | 0/1/0 | complete |
| run-007 | correctness second pass: deep-ai-council and deep-improvement mode packets | correctness | 0.50 | 0/2/0 | complete |
| run-008 | security second pass: deep-ai-council, deep-improvement, deep-research, and manual-testing-playbook surfaces | security | 1.00 | 0/1/0 | complete |
| run-009 | maintainability second pass: deep-ai-council, deep-improvement, deep-research, and manual-testing-playbook modules | maintainability | 0.08 | 0/1/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 11 |
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
- graphConvergenceScore: 0.65
- graphDecision: STOP_BLOCKED
- graphBlockers: {"type":"uncovered_dimensions","description":"Dimension coverage (0%) is below threshold (80%). 17 gap(s) found. STOP is blocked until all required dimensions have meaningful coverage.","count":17,"severity":"blocking"}

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 0.50 -> 1.00 -> 0.08
- convergenceScore: 0.92
- openFindings: 13
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
- candidateCoverage: covered=15, ruledOut=8, deferred=1, blocked=0

### Search Debt
- iteration 3 checklist_evidence (deferred): Iteration budget prioritized the newly discovered cross-consumer contract split.; evidence=.opencode/specs/system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood/review/deep-review-config.json:9-12

### Ruled-Out Candidates
- iteration 1 state_transition (ruled_out): Three-seat quorum and blocker veto are explicit.; evidence=.opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:685-705, .opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:868-895, .opencode/skills/system-deep-loop/runtime/tests/integration/divergent-pivot.vitest.ts:246-341
- iteration 1 durable_replay (ruled_out): Event IDs and persisted seat discovery gate redispatch.; evidence=.opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:499-573, .opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:1028-1160, .opencode/skills/system-deep-loop/runtime/tests/integration/divergent-pivot.vitest.ts:401-434
- iteration 2 command_injection (ruled_out): spawn/spawnSync receive structured argv arrays.; evidence=.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:874-881, .opencode/commands/deep/assets/deep_review_auto.yaml:1225-1261
- iteration 2 secret_exposure (ruled_out): Source and end-to-end child visibility test agree.; evidence=.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:391-427, .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:730-756, .opencode/skills/system-deep-loop/runtime/tests/executor-audit-receipts.test.ts:159-236
- iteration 6 cross_runtime_parity (ruled_out): Both mirrors carry the same write targets, append rule, and reducer ownership.; evidence=.opencode/agents/deep-research.md:69-73,411-443, .claude/agents/deep-research.md:52-56,394-426
- iteration 8 scoped_auxiliary_write (ruled_out): No untrusted production producer for the output path was identified.; evidence=.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs:1003-1007, .opencode/skills/system-deep-loop/deep-ai-council/references/patterns/command_wiring.md:139-154
- iteration 8 trusted_test_hook_execution (ruled_out): No production producer or untrusted environment assignment was found.; evidence=.opencode/skills/system-deep-loop/deep-ai-council/scripts/replay-graph-from-artifacts.cjs:63-65, .opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/replay-graph-from-artifacts.vitest.ts:278
- iteration 8 destructive_path_escape (ruled_out): Direct read established guards before both destructive calls.; evidence=.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/command-flow-stress-tests/setup-cp-sandbox.sh:45-68, .opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/command-flow-stress-tests/setup-cp-sandbox.sh:95-98

### Clean Search Proof
- iteration 1 state_transition (ruled_out): Three-seat quorum and blocker veto are explicit.; evidence=.opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:685-705, .opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:868-895, .opencode/skills/system-deep-loop/runtime/tests/integration/divergent-pivot.vitest.ts:246-341
- iteration 1 durable_replay (ruled_out): Event IDs and persisted seat discovery gate redispatch.; evidence=.opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:499-573, .opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:1028-1160, .opencode/skills/system-deep-loop/runtime/tests/integration/divergent-pivot.vitest.ts:401-434
- iteration 2 command_injection (ruled_out): spawn/spawnSync receive structured argv arrays.; evidence=.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:874-881, .opencode/commands/deep/assets/deep_review_auto.yaml:1225-1261
- iteration 2 secret_exposure (ruled_out): Source and end-to-end child visibility test agree.; evidence=.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:391-427, .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:730-756, .opencode/skills/system-deep-loop/runtime/tests/executor-audit-receipts.test.ts:159-236
- iteration 6 cross_runtime_parity (ruled_out): Both mirrors carry the same write targets, append rule, and reducer ownership.; evidence=.opencode/agents/deep-research.md:69-73,411-443, .claude/agents/deep-research.md:52-56,394-426
- iteration 8 scoped_auxiliary_write (ruled_out): No untrusted production producer for the output path was identified.; evidence=.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs:1003-1007, .opencode/skills/system-deep-loop/deep-ai-council/references/patterns/command_wiring.md:139-154
- iteration 8 trusted_test_hook_execution (ruled_out): No production producer or untrusted environment assignment was found.; evidence=.opencode/skills/system-deep-loop/deep-ai-council/scripts/replay-graph-from-artifacts.cjs:63-65, .opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/replay-graph-from-artifacts.vitest.ts:278
- iteration 8 destructive_path_escape (ruled_out): Direct read established guards before both destructive calls.; evidence=.opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/command-flow-stress-tests/setup-cp-sandbox.sh:45-68, .opencode/skills/system-deep-loop/deep-research/manual_testing_playbook/command-flow-stress-tests/setup-cp-sandbox.sh:95-98

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 13 active P1 finding(s) — required before release; not a P0 but still blocks PASS.
- 1 search-debt obligation(s) remain deferred or blocked. Verdict is CONDITIONAL until they are covered or ruled out.

<!-- /ANCHOR:active-risks -->
