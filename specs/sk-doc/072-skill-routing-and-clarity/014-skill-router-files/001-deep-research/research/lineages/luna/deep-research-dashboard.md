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
- Topic: Moving every skill's MACHINE ROUTER section out of SKILL.md into a sibling ROUTER.md. Answer RQ-1 to RQ-5 in spec.md: every reader of the machine router with file:line; how each of the seven runtimes loads a skill; what the agent needs at run time versus what only scripts read; how a hub's MACHINE ROUTER joins its existing root ROUTER.md without breaking the router replay mode projection; and a migration that holds the routing baseline with a measured token saving.
- Started: 2026-10-29T08:01:27Z
- Status: COMPLETE
- Iteration: 3 of 3
- Session ID: fanout-luna-1793260568789-n4qwe0
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
| 1 | RQ-1: inventory machine-router readers and their relocation impacts | reader-inventory | 1.00 | 6 | complete |
| 2 | RQ-2 and RQ-3: seven runtime loaders, Hermes copy contents, and runtime versus parser context | runtime-loader-context | 0.82 | 6 | complete |
| 3 | RQ-1, RQ-4, and RQ-5: reader inventory, hub-root projection, measured savings, and baseline conflicts | - | 0.76 | 7 | complete |

- iterationsCompleted: 3
- keyFindings: 19
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] RQ-1: Which scripts, tests, generators, runtime adapters and other tools read a SKILL.md MACHINE ROUTER section or its markers, and what sibling ROUTER.md change does each require?
- [x] RQ-2: How do Claude Code, OpenCode, Codex, Cursor, Pi, Devin and Hermes load a skill, and do they load sibling files automatically? What does the Hermes copy step include?
- [x] RQ-3: Which machine-router facts does an agent need in context at runtime, which facts only scripts need, and what pointer must remain in SKILL.md?
- [x] RQ-4: How can a hub MACHINE ROUTER join its existing root ROUTER.md without changing the router replay mode projection?
- [x] RQ-5: What migration preserves advisor accuracy 155/195, 49/66 and 19/24, router replay and compiled-route hashes while measuring token savings per skill and tracking debt?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▇▆▆▅▅▄▄▃▃▂▂▂▂▂▂▁▁▁
- score sparkline: █▇▇▆▆▅▅▄▄▃▃▂▂▂▂▂▂▁▁▁
- Last 3 ratios: 1.00 -> 0.82 -> 0.76
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.76
- coverageBySources: {"code":30,"code.claude.com":1,"cursor.com":1,"developers.openai.com":1,"opencode.ai":1,"pi.dev":1}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Treating every root ROUTER.md parser as a current reader of the SKILL.md appendix. The root-router checks read the separate stage-two router; their merge behavior is examined in RQ-4. (iteration 1)
- Treating the leaf-manifest generator as a direct MACHINE ROUTER reader. Its source walks configured leaf roots and does not parse SKILL.md. (iteration 1)

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
