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
- Review Target: specs/system-speckit/043-decision-capture (spec-folder)
- Started: 2026-11-02T20:05:07Z
- Status: INITIALIZED
- Iteration: 5 of 7
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: fanout-luna-1793649602423-v8rh6g
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
| P2 (Suggestions) | 3 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| 1 | correctness | correctness | 1.00 | 0/1/1 | complete |
| 2 | security | security | 1.00 | 0/0/1 | complete |
| 3 | traceability | traceability | 1.00 | 0/1/1 | complete |
| 4 | maintainability | maintainability | 0.00 | 0/0/0 | complete |
| 5 | correctness | correctness | 0.00 | 0/0/0 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 3 |
| security | covered | 0 |
| traceability | covered | 2 |
| maintainability | covered | 0 |

<!-- /ANCHOR:dimension-coverage -->
<!-- ANCHOR:blocked-stops -->
## 6. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 7. GRAPH CONVERGENCE
- graphConvergenceScore: 0.96
- graphDecision: STOP_ALLOWED
- graphBlockers: none

<!-- /ANCHOR:graph-convergence -->
<!-- ANCHOR:trend -->
## 8. TREND
- Last 3 ratios: 1.00 -> 0.00 -> 0.00
- convergenceScore: 1.00
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
- graphCoverageMode: graph
- candidateCoverage: covered=14, ruledOut=9, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 2 save_target_resolution (ruled_out): Decision payload values are not passed as destination paths.; evidence=.skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:658, .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:671, .skilled/skills/system-spec-kit/runtime/cli/utils/input-normalizer.ts:222
- iteration 2 source_key_path_injection (ruled_out): The accepted key alphabet excludes slash and backslash.; evidence=.skilled/skills/system-spec-kit/runtime/cli/utils/input-normalizer.ts:222, .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:80
- iteration 3 feature_catalog_path_alignment (ruled_out): Direct comparison shows the catalog and coverage table match current adapter behavior.; evidence=.skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md:29-47, .skilled/hooks/README.md:271-275, .skilled/hooks/coverage-rationale.md:90-92
- iteration 3 runtime_adapter_capability_alignment (ruled_out): The runtime matrix and capability summaries align; only transcript-sweeps prose is stale.; evidence=.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-live-conversation.md:351-384, .opencode/plugins/decision-capture.js:51-79, .devin/hooks.v1.json:161-166, .skilled/hooks/decision-capture/pi/decision-capture.ts:48-117
- iteration 4 shared_core_boundary (ruled_out): Direct read shows a clear shared-core and parser split.; evidence=.skilled/hooks/decision-capture/lib/capture-core.mjs:129-165, .skilled/hooks/decision-capture/lib/capture-core.mjs:254-329, .skilled/hooks/decision-capture/lib/chat-questions.mjs:81-158
- iteration 4 runtime_adapter_duplication (ruled_out): No current behavioral drift was found that a common sweep wrapper would safely remove.; evidence=.skilled/hooks/decision-capture/bin/sweep-opencode.mjs:138-212, .skilled/hooks/decision-capture/bin/sweep-opencode.mjs:255-279, .skilled/hooks/decision-capture/bin/sweep-pi.mjs:234-261, .skilled/hooks/decision-capture/bin/sweep-codex.mjs:311-349
- iteration 4 matcher_cli_separation (ruled_out): The CLI delegates match decisions to the runtime matcher API.; evidence=.skilled/skills/system-spec-kit/runtime/lib/continuity/decision-table-matcher.ts:78-213, .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts:22-33, .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts:255-277
- iteration 4 test_coverage_maintainability (ruled_out): Source inspection found focused suites for both shared behavior and each runtime-specific boundary.; evidence=.skilled/hooks/decision-capture/lib/capture-core.test.mjs:592-889, .skilled/hooks/decision-capture/bin/sweep-opencode.test.mjs:77-410, .opencode/plugins/tests/decision-capture.test.cjs:76-181, .skilled/skills/system-spec-kit/runtime/cli/tests/decision-table-matcher.vitest.ts:36-210, .skilled/skills/system-spec-kit/runtime/cli/tests/decision-record-writer.vitest.ts:162-462
- iteration 4 overengineered_abstraction (ruled_out): Direct source and test inspection found no abstraction without a current correctness role.; evidence=.skilled/hooks/decision-capture/lib/capture-core.mjs:254-329, .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-table-matcher.ts:143-209, .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:636-708, .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:716-765

### Clean Search Proof
- iteration 2 save_target_resolution (ruled_out): Decision payload values are not passed as destination paths.; evidence=.skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:658, .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:671, .skilled/skills/system-spec-kit/runtime/cli/utils/input-normalizer.ts:222
- iteration 2 source_key_path_injection (ruled_out): The accepted key alphabet excludes slash and backslash.; evidence=.skilled/skills/system-spec-kit/runtime/cli/utils/input-normalizer.ts:222, .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:80
- iteration 3 feature_catalog_path_alignment (ruled_out): Direct comparison shows the catalog and coverage table match current adapter behavior.; evidence=.skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md:29-47, .skilled/hooks/README.md:271-275, .skilled/hooks/coverage-rationale.md:90-92
- iteration 3 runtime_adapter_capability_alignment (ruled_out): The runtime matrix and capability summaries align; only transcript-sweeps prose is stale.; evidence=.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-live-conversation.md:351-384, .opencode/plugins/decision-capture.js:51-79, .devin/hooks.v1.json:161-166, .skilled/hooks/decision-capture/pi/decision-capture.ts:48-117
- iteration 4 shared_core_boundary (ruled_out): Direct read shows a clear shared-core and parser split.; evidence=.skilled/hooks/decision-capture/lib/capture-core.mjs:129-165, .skilled/hooks/decision-capture/lib/capture-core.mjs:254-329, .skilled/hooks/decision-capture/lib/chat-questions.mjs:81-158
- iteration 4 runtime_adapter_duplication (ruled_out): No current behavioral drift was found that a common sweep wrapper would safely remove.; evidence=.skilled/hooks/decision-capture/bin/sweep-opencode.mjs:138-212, .skilled/hooks/decision-capture/bin/sweep-opencode.mjs:255-279, .skilled/hooks/decision-capture/bin/sweep-pi.mjs:234-261, .skilled/hooks/decision-capture/bin/sweep-codex.mjs:311-349
- iteration 4 matcher_cli_separation (ruled_out): The CLI delegates match decisions to the runtime matcher API.; evidence=.skilled/skills/system-spec-kit/runtime/lib/continuity/decision-table-matcher.ts:78-213, .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts:22-33, .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts:255-277
- iteration 4 test_coverage_maintainability (ruled_out): Source inspection found focused suites for both shared behavior and each runtime-specific boundary.; evidence=.skilled/hooks/decision-capture/lib/capture-core.test.mjs:592-889, .skilled/hooks/decision-capture/bin/sweep-opencode.test.mjs:77-410, .opencode/plugins/tests/decision-capture.test.cjs:76-181, .skilled/skills/system-spec-kit/runtime/cli/tests/decision-table-matcher.vitest.ts:36-210, .skilled/skills/system-spec-kit/runtime/cli/tests/decision-record-writer.vitest.ts:162-462
- iteration 4 overengineered_abstraction (ruled_out): Direct source and test inspection found no abstraction without a current correctness role.; evidence=.skilled/hooks/decision-capture/lib/capture-core.mjs:254-329, .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-table-matcher.ts:143-209, .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:636-708, .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:716-765

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: correctness coverage stabilized; all four configured dimensions remain covered. - Focus area: Record the existing active findings and synthesize the conditional review result. - Reason: The required stabilization pass followed the iteration that first brought dimension coverage to 100%. - Required evidence: Iteration deltas, reducer registry, legal convergence vote, and graph convergence event. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 2 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
