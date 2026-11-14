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
- Topic: What do the checked-in route patches under .dsh/patches/ declare for endpoint, model id and reasoning effort? Read the files and answer in under 150 words.
- Started: 2026-11-14T13:20:45.000Z
- Status: COMPLETE
- Iteration: 1 of 1
- Session ID: fanout-dsh-rc3-1794662312097-eo5r8r
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Route patch declarations: endpoint, model id and reasoning effort in .dsh/patches/ | - | 1.00 | 3 | complete |

- iterationsCompleted: 1
- keyFindings: 3
- openQuestions: 0
- resolvedQuestions: 4

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 4/4
- [x] Which checked-in route patches under .dsh/patches/ declare an endpoint, model id and reasoning effort?
- [x] What endpoint, model id and reasoning effort does the llmgateway route patch declare?
- [x] What endpoint, model id and reasoning effort does the opencode-go route patch declare?
- [x] Do the remaining .dsh/patches/ files declare any routing values?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
- score sparkline: ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
- Last 3 ratios: 1.00
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 1.00
- coverageBySources: {"code":5,"other":5}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Inferring a base default route: both route patches override `agent-default-model`; the base default is not declared in these files, so no claim is made about it. (iteration 1)
- Searching outside `.dsh/patches/` for route declarations: the question is explicitly scoped to the checked-in patches, and no other source was needed. (iteration 1)
- Treating `mcp-code-mode.patch.yml` as a route patch: it declares an MCP server (`serverName: code_mode`, `transport: stdio`) and no provider, endpoint, model, or reasoning keys. [SOURCE: .dsh/patches/mcp-code-mode.patch.yml:6] (iteration 1)

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
[All tracked questions are resolved]

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
