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
- Review Target: worktree diff .worktrees/0118-skilled-hook-runtime-relocation (branch skilled/0118-hook-runtime-relocation) vs skilled/v4.0.0.0, commit 40d5f0d2b3 (files)
- Started: 2026-07-28T12:28:12Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Provisional Verdict: CONDITIONAL
- hasSearchDebt: false
- hasAdvisories: false
- Session ID: 2026-07-28T12:28:12Z
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
| P1 (Required) | 6 |
| P2 (Suggestions) | 4 |
| Resolved | 0 |

<!-- /ANCHOR:findings-summary -->
<!-- ANCHOR:progress -->
## 4. PROGRESS

| # | Focus | Dimensions | Ratio | P0/P1/P2 | Status |
|---|-------|------------|-------|----------|--------|
| run-001 | inventory | inventory | 1.00 | 0/0/3 | complete |
| run-002 | correctness | correctness | 1.00 | 0/1/3 | complete |
| run-003 | security | security | 1.00 | 0/3/3 | complete |
| run-004 | traceability | traceability | 0.67 | 0/2/0 | complete |
| run-005 | maintainability | maintainability | 0.67 | 0/1/1 | complete |

<!-- /ANCHOR:progress -->
<!-- ANCHOR:dimension-coverage -->
## 5. DIMENSION COVERAGE

| Dimension | Status | Open findings |
|-----------|--------|--------------:|
| correctness | covered | 10 |
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
- Last 3 ratios: 1.00 -> 0.67 -> 0.67
- convergenceScore: 0.33
- openFindings: 10
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
- candidateCoverage: covered=10, ruledOut=9, deferred=0, blocked=0

### Search Debt
[None yet]

### Ruled-Out Candidates
- iteration 1 relative_import_depth (ruled_out): No import-resolution failure was reproduced in the inventory surfaces.; evidence=.opencode/runtime-hooks/README.md:113-116, .opencode/runtime-hooks/dispatch/lib/dispatch-audit.test.mjs:1-2
- iteration 1 runtime_wiring (ruled_out): All inventoried wiring targets and mirrors resolve.; evidence=.claude/settings.json:21-61, .codex/hooks.json:59-106, .cursor/hooks.json:55-96, .devin/hooks.v1.json:57-119, .opencode/runtime-hooks/README.md:93-94
- iteration 2 relative_import_depth (ruled_out): Exact import review, loader tests, and syntax checks passed.; evidence=.opencode/runtime-hooks/task-dispatch/devin/task-dispatch-guard.cjs:23-24, .opencode/runtime-hooks/mcp-route-guard/codex/mcp-route-guard.cjs:25-26, .opencode/runtime-hooks/dispatch/codex/dispatch-audit-posttooluse.mjs:21-29, .opencode/runtime-hooks/mcp-route-guard/cursor/mcp-route-guard.mjs:29-30
- iteration 2 runtime_payload_translation (ruled_out): Direct adapter/config comparison found matching registered tool names and normalized inputs.; evidence=.opencode/runtime-hooks/mcp-route-guard/cursor/mcp-route-guard.mjs:62-99, .opencode/runtime-hooks/task-dispatch/devin/task-dispatch-guard.cjs:51-70, .opencode/runtime-hooks/dispatch/codex/dispatch-preflight-lint.mjs:59-80
- iteration 2 fail_open_contract (ruled_out): Direct branch inspection and malformed-envelope regression tests passed.; evidence=.opencode/runtime-hooks/dispatch/codex/dispatch-preflight-lint.mjs:44-64,112, .opencode/runtime-hooks/post-edit-quality/codex/post-edit-quality.cjs:96-107,139-163, .opencode/runtime-hooks/task-dispatch/devin/task-dispatch-guard.cjs:30-53,105
- iteration 2 shared_core_regression (ruled_out): 46 Node tests and 38 Vitest tests passed.; evidence=.opencode/runtime-hooks/dispatch/lib/dispatch-rule-checks.test.mjs:1, .opencode/runtime-hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs:1, .opencode/plugins/tests/claude-task-dispatch-guard.test.cjs:1, .opencode/plugins/tests/mk-post-edit-quality.test.cjs:1, .opencode/runtime-hooks/dispatch/lib/dispatch-audit.test.mjs:1-2
- iteration 3 path_escape (ruled_out): Direct control-flow inspection confirmed the descendant guard precedes dispatch selection.; evidence=.opencode/runtime-hooks/post-edit-quality/lib/post-edit-router.cjs:89-98, .opencode/runtime-hooks/post-edit-quality/lib/post-edit-router.cjs:156-165
- iteration 3 shell_execution_injection (ruled_out): The executable and argv are passed separately to spawnSync.; evidence=.opencode/runtime-hooks/post-edit-quality/lib/post-edit-router.cjs:320-379
- iteration 4 feature_catalog_alignment (ruled_out): Direct source-table and command review aligned with the relocated tree.; evidence=.opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md:44-69, .opencode/skills/mcp-code-mode/manual-testing-playbook/plugins-and-hooks/mcp-route-guard.md:24-31,44-113,231-239
- iteration 5 concern_policy_duplication (ruled_out): Policy calls are centralized in concern-local cores; adapter-specific branches are runtime envelope translation.; evidence=.opencode/runtime-hooks/dispatch/codex/dispatch-preflight-lint.mjs:21-38,71-105, .opencode/runtime-hooks/post-edit-quality/codex/post-edit-quality.cjs:21,96-150

### Clean Search Proof
- iteration 1 relative_import_depth (ruled_out): No import-resolution failure was reproduced in the inventory surfaces.; evidence=.opencode/runtime-hooks/README.md:113-116, .opencode/runtime-hooks/dispatch/lib/dispatch-audit.test.mjs:1-2
- iteration 1 runtime_wiring (ruled_out): All inventoried wiring targets and mirrors resolve.; evidence=.claude/settings.json:21-61, .codex/hooks.json:59-106, .cursor/hooks.json:55-96, .devin/hooks.v1.json:57-119, .opencode/runtime-hooks/README.md:93-94
- iteration 2 relative_import_depth (ruled_out): Exact import review, loader tests, and syntax checks passed.; evidence=.opencode/runtime-hooks/task-dispatch/devin/task-dispatch-guard.cjs:23-24, .opencode/runtime-hooks/mcp-route-guard/codex/mcp-route-guard.cjs:25-26, .opencode/runtime-hooks/dispatch/codex/dispatch-audit-posttooluse.mjs:21-29, .opencode/runtime-hooks/mcp-route-guard/cursor/mcp-route-guard.mjs:29-30
- iteration 2 runtime_payload_translation (ruled_out): Direct adapter/config comparison found matching registered tool names and normalized inputs.; evidence=.opencode/runtime-hooks/mcp-route-guard/cursor/mcp-route-guard.mjs:62-99, .opencode/runtime-hooks/task-dispatch/devin/task-dispatch-guard.cjs:51-70, .opencode/runtime-hooks/dispatch/codex/dispatch-preflight-lint.mjs:59-80
- iteration 2 fail_open_contract (ruled_out): Direct branch inspection and malformed-envelope regression tests passed.; evidence=.opencode/runtime-hooks/dispatch/codex/dispatch-preflight-lint.mjs:44-64,112, .opencode/runtime-hooks/post-edit-quality/codex/post-edit-quality.cjs:96-107,139-163, .opencode/runtime-hooks/task-dispatch/devin/task-dispatch-guard.cjs:30-53,105
- iteration 2 shared_core_regression (ruled_out): 46 Node tests and 38 Vitest tests passed.; evidence=.opencode/runtime-hooks/dispatch/lib/dispatch-rule-checks.test.mjs:1, .opencode/runtime-hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs:1, .opencode/plugins/tests/claude-task-dispatch-guard.test.cjs:1, .opencode/plugins/tests/mk-post-edit-quality.test.cjs:1, .opencode/runtime-hooks/dispatch/lib/dispatch-audit.test.mjs:1-2
- iteration 3 path_escape (ruled_out): Direct control-flow inspection confirmed the descendant guard precedes dispatch selection.; evidence=.opencode/runtime-hooks/post-edit-quality/lib/post-edit-router.cjs:89-98, .opencode/runtime-hooks/post-edit-quality/lib/post-edit-router.cjs:156-165
- iteration 3 shell_execution_injection (ruled_out): The executable and argv are passed separately to spawnSync.; evidence=.opencode/runtime-hooks/post-edit-quality/lib/post-edit-router.cjs:320-379
- iteration 4 feature_catalog_alignment (ruled_out): Direct source-table and command review aligned with the relocated tree.; evidence=.opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md:44-69, .opencode/skills/mcp-code-mode/manual-testing-playbook/plugins-and-hooks/mcp-route-guard.md:24-31,44-113,231-239
- iteration 5 concern_policy_duplication (ruled_out): Policy calls are centralized in concern-local cores; adapter-specific branches are runtime envelope translation.; evidence=.opencode/runtime-hooks/dispatch/codex/dispatch-preflight-lint.mjs:21-38,71-105, .opencode/runtime-hooks/post-edit-quality/codex/post-edit-quality.cjs:21,96-150

<!-- /ANCHOR:search-debt -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 12. ACTIVE RISKS
- 6 active P1 finding(s) — required before release; not a P0 but still blocks PASS.

<!-- /ANCHOR:active-risks -->
