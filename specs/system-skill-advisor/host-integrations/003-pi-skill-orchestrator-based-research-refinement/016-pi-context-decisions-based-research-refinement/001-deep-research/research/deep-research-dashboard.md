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
- Topic: Mine the pi-context-decisions Pi extension for ideas that could improve system-skill-advisor and its hooks; follow the research brief, RQ1-RQ8 and answer shape in the bound spec.md
- Started: 2026-11-18T06:54:55Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Session ID: 2026-11-18T06:54:55Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Decision model versus local scorer (RQ1, RQ4): thresholds, cap, inventory floor and benchmark method | scoring-calibration | 0.88 | 8 | complete |
| 2 | RQ5/RQ6/RQ8 allowlists, failure policy, observability. | failure-observability | 0.86 | 7 | complete |
| 3 | RQ2 additive advertising and brief churn; RQ3 previous-reply context for short follow-ups | session-context | 0.83 | 6 | complete |
| 4 | RQ7: tool and MCP filtering. | tools | 0.75 | 6 | complete |
| 5 | Consolidation of RQ1-RQ8 verdicts and open confirmations | synthesis | 0.45 | 6 | insight |

- iterationsCompleted: 5
- keyFindings: 38
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Decision model versus local scorer (RQ1, RQ4): where would a hosted per-skill 0-2 relevance score beat or lose to the advisor's five-lane fusion, and what do the extension's thresholds, cap, inventory floor and benchmark method teach about calibrating the advisor?
- [x] Additive per-branch advertising (RQ2): does the advisor brief churn between prompts in one session, does that cost routing quality or prompt cache, and would session memory of already-surfaced skills help?
- [x] Context beyond the prompt (RQ3): do short follow-up prompts route badly today, and would a bounded slice of the previous reply fix that?
- [x] Allowlists, failure policy and observability (RQ5, RQ6, RQ8): pinned always-surface sets, fail-closed versus fail-open, and why-was-this-surfaced history. Which gaps does the advisor have?
- [x] Tool and MCP filtering (RQ7): does any part of our stack over-advertise tools the same way, and would the idea transfer?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ███████▇▇▇▇▇▇▆▆▅▄▃▂▁
- score sparkline: ███████▇▇▇▇▇▇▆▆▅▄▃▂▁
- Last 3 ratios: 0.83 -> 0.75 -> 0.45
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.45
- coverageBySources: {"code":50,"other":31}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Model score as a replacement for fusion (finding 4). (iteration 1)
- None yet. The replacement direction is a candidate for "ruled out", not an exhausted approach. (iteration 1)
- Porting the 0.375 default threshold (finding 6). (iteration 1)
- Porting the inventory floor (finding 8). (iteration 1)
- An operator-pinned always-surface skill set in the brief (finding 5). (iteration 2)
- Default-on persistence of surfaced skills or "why" fields (finding 6). It breaks the prompt-free record invariant. (iteration 2)
- None. The grep for an advisor pin concept was a clean no-hit, which counts as evidence for finding 5, not a dead end. (iteration 2)
- Porting the extension's `failMode: "closed"` default by name (finding 2). The polarity is inverted for an additive advisor. (iteration 2)
- Concatenating previous-reply text into the lexical scorer input (finding 6). (iteration 3)
- Porting additive-only semantics (finding 1). (iteration 3)
- Probing the live advisor CLI from this iteration. The permission layer refused the `printf | node` pipe twice. The routing claims are code traces, and each one names the probe that would confirm it. (iteration 3)
- Skill-level suppression memory (finding 3). (iteration 3)
- The advisor runtime has no `benchmarks/` directory. The grep for follow-up test fixtures found no advisor test that covers "continue" or "do it", so follow-up routing has no test coverage today. That is evidence for finding 5's benchmark recommendation. (iteration 3)
- An advisor-scored `call_tool_chain` gate (finding 4). (iteration 4)
- Porting relevance-scored tool or MCP filtering into our stack. Our only native surface is seven fixed meta-tools, and access control is static by design. (iteration 4)
- Porting the advertisement-side tool filter (`setActiveTools` withholding) to Code Mode (finding 3). (iteration 4)
- None this iteration. (iteration 5)
- Re-litigating any iteration 1-4 REJECT. None had new evidence against it. (iteration 5)

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
