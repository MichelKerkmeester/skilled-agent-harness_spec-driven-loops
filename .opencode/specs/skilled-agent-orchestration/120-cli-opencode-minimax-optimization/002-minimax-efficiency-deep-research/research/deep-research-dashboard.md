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
- Topic: How can we improve/update sk-prompt-small-model and cli-opencode to make best use and maximize the efficiency of MiniMax 2.7 dispatched through cli-opencode via the direct MiniMax.io API provider? Cover: MiniMax-2.7 context-budget defaults, output-verification recipe, prompt-quality/RCAF patterns, --variant/reasoning-effort mapping for the minimax provider, quota-pool + fallback wiring (minimax-api), permissions-matrix applicability, cost/latency profile, and routing heuristics vs deepseek/qwen/glm. Extend the 114 small-model infrastructure rather than rebuilding it. Output concrete file-level deltas for sk-prompt-small-model and cli-opencode.
- Started: 2026-05-28T08:59:28Z
- Status: INITIALIZED
- Iteration: 1 of 10
- Session ID: research-20260528-105928
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| undefined | Q1 - Establish MiniMax 2.7 API characteristics (context window, reasoning/--variant controls, tool-calling, pricing, latency) | - | 0.92 | 0 | insight |

- iterationsCompleted: 1
- keyFindings: 0
- openQuestions: 5
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/5
- [ ] Q1: What are MiniMax 2.7's API characteristics (context window, reasoning/`--variant` controls, tool-calling, pricing, latency) that determine its context-budget defaults and cost/latency profile?
- [ ] Q2: What context-budget tuple and output-verification recipe should MiniMax 2.7 adopt, reusing 114's budget engine + 4-stage verification?
- [ ] Q3: What prompt-quality / RCAF patterns and `--variant`/reasoning-effort mapping maximize MiniMax 2.7 efficiency through cli-opencode?
- [ ] Q4: How should quota-pool + fallback wiring (`minimax-api`) and the structured permissions matrix apply to MiniMax 2.7?
- [ ] Q5: What routing heuristics should decide MiniMax 2.7 vs deepseek/qwen/glm, and what concrete file-level deltas to `sk-prompt-small-model` + `cli-opencode` follow?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 5
- [ ] Q1: What are MiniMax 2.7's API characteristics (context window, reasoning/`--variant` controls, tool-calling, pricing, latency) that determine its context-budget defaults and cost/latency profile?
- [ ] Q2: What context-budget tuple and output-verification recipe should MiniMax 2.7 adopt, reusing 114's budget engine + 4-stage verification?
- [ ] Q3: What prompt-quality / RCAF patterns and `--variant`/reasoning-effort mapping maximize MiniMax 2.7 efficiency through cli-opencode?
- [ ] Q4: How should quota-pool + fallback wiring (`minimax-api`) and the structured permissions matrix apply to MiniMax 2.7?
- [ ] Q5: What routing heuristics should decide MiniMax 2.7 vs deepseek/qwen/glm, and what concrete file-level deltas to `sk-prompt-small-model` + `cli-opencode` follow?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.92
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.92
- coverageBySources: {"code":8,"other":5}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None yet

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Q1: What are MiniMax 2.7's API characteristics (context window, reasoning/`--variant` controls, tool-calling, pricing, latency) that determine its context-budget defaults and cost/latency profile?

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
