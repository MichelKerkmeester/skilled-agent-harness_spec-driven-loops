---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: devin-hooks-claude-opencode-plugin-portability: Investigate every Claude Code hook and every OpenCode plugin currently defined in this repo (.claude settings hooks, .opencode plugin registrations, the 7 repo guard hooks referenced by cli-codex hook-contract.md: spec-gate-enforce/classify, dispatch-preflight-lint, post-edit-quality, code-graph-freshness, dispatch-audit, completion-evidence-sentinel, mcp-route-guard) against Devin CLI real current hook contract (PreToolUse/PostToolUse/PermissionRequest/UserPromptSubmit/Stop/PostCompaction/SessionStart/SessionEnd via .devin/hooks.v1.json, confirmed in 001-devin-contract-pin/implementation-summary.md). For each hook or plugin determine: portable 1:1, needs adaptation, or cannot port and why. Also evaluate whether Devin native read_config_from.claude:true import could substitute for some ports instead of hand-built adapters. Produce a concrete per-hook per-plugin port verdict table with rationale, to directly inform phase 004-devin-hook-adapter-layer ADR-001.
- Started: 2026-07-24T04:06:41.346Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Session ID: dr-devin-hooks-portability-2026-07-24-001
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| undefined | Iteration 1 — exhaustive Claude/OpenCode/Devin hook inventory and initial portability matrix | - | 0.94 | 0 | insight |
| undefined | Iteration 2 — Devin subagent dispatch tool and Task-guard portability | - | 0.78 | 0 | insight |
| undefined | Iteration 3 — 7 guard cores reusability audit | - | 0.82 | 0 | insight |
| undefined | Iteration 4 — native Claude import coverage matrix | - | 0.86 | 0 | insight |
| undefined | Iteration 5 — full per-hook per-plugin port verdict table | - | 0.88 | 0 | insight |
| undefined | Iteration 6 — bash-only hooks cwd/env and exit/stdout contract | - | 0.84 | 0 | insight |
| undefined | Iteration 7 — PreCompact → PostCompaction substitution | - | 0.90 | 0 | insight |
| undefined | Iteration 8 — OpenCode plugins that cannot port + alternatives | - | 0.92 | 0 | insight |
| undefined | Iteration 9 — ADR-001 evidence package assembly | - | 0.31 | 0 | insight |
| undefined | Iteration 10 — final convergence report and remaining gaps | - | 0.08 | 0 | convergence |

- iterationsCompleted: 10
- keyFindings: 53
- openQuestions: 6
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/6
- [ ] Q1. Enumerate every Claude Code hook registered in this repo's .claude settings (settings.json hooks.* keys, plus any plugin-bundled hooks), with event name + matcher + cwd + handler command for each. [legacy-import]
- [ ] Q2. Enumerate every OpenCode plugin registered under .opencode/ (plugin manifests, hook registrations, runtime-neutral cores referenced by cli-codex hook-contract.md: spec-gate-enforce/classify, dispatch-preflight-lint, post-edit-quality, code-graph-freshness, dispatch-audit, completion-evidence-sentinel, mcp-route-guard). [legacy-import]
- [ ] Q3. Enumerate Devin CLI's 8 lifecycle hooks (PreToolUse, PostToolUse, PermissionRequest, UserPromptSubmit, Stop, PostCompaction, SessionStart, SessionEnd), the JSON schema each receives on stdin, and the .devin/hooks.v1.json entry shape (type, matcher, command|prompt, timeout). [legacy-import]
- [ ] Q4. Per hook + per plugin: classify portable 1:1 / needs adaptation / cannot port, with rationale grounded in matching shapes, missing payload fields, cwd/env differences, and Devin's missing equivalent events. [legacy-import]
- [ ] Q5. Evaluate whether Devin native read_config_from.claude:true import could substitute for hand-built adapters in part or in full (which hooks it covers vs misses, and why). [legacy-import]
- [ ] Q6. Produce a per-hook per-plugin port verdict table ready to be cited as ADR-001 evidence by phase 004-devin-hook-adapter-layer/plan.md. [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 6
- [ ] Q1. Enumerate every Claude Code hook registered in this repo's .claude settings (settings.json hooks.* keys, plus any plugin-bundled hooks), with event name + matcher + cwd + handler command for each.
- [ ] Q2. Enumerate every OpenCode plugin registered under .opencode/ (plugin manifests, hook registrations, runtime-neutral cores referenced by cli-codex hook-contract.md: spec-gate-enforce/classify, dispatch-preflight-lint, post-edit-quality, code-graph-freshness, dispatch-audit, completion-evidence-sentinel, mcp-route-guard).
- [ ] Q3. Enumerate Devin CLI's 8 lifecycle hooks (PreToolUse, PostToolUse, PermissionRequest, UserPromptSubmit, Stop, PostCompaction, SessionStart, SessionEnd), the JSON schema each receives on stdin, and the .devin/hooks.v1.json entry shape (type, matcher, command|prompt, timeout).
- [ ] Q4. Per hook + per plugin: classify portable 1:1 / needs adaptation / cannot port, with rationale grounded in matching shapes, missing payload fields, cwd/env differences, and Devin's missing equivalent events.
- [ ] Q5. Evaluate whether Devin native read_config_from.claude:true import could substitute for hand-built adapters in part or in full (which hooks it covers vs misses, and why).
- [ ] Q6. Produce a per-hook per-plugin port verdict table ready to be cited as ADR-001 evidence by phase 004-devin-hook-adapter-layer/plan.md.

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▇▇▇▇▇▇▇▇▇▇███▇▅▃▂▁
- score sparkline: █▇▇▇▇▇▇▇▇▇▇▇███▇▅▃▂▁
- Last 3 ratios: 0.92 -> 0.31 -> 0.08
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.08
- coverageBySources: {"code":20,"other":11}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None yet

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Capture one live `PreToolUse(run_subagent)` event to confirm required fields and the runtime representation of `resume`.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
