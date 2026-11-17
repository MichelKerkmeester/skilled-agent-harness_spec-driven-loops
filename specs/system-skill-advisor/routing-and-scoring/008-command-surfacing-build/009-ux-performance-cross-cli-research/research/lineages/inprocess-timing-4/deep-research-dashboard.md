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
- Topic: LANE inprocess-timing-4 (segment three rank 6): measure the cold and warm cost of scoring a degraded prompt with the TypeScript handler in process, the way rank 6 describes (runLocalScorer calling handleAdvisorRecommend). Write a scratch timing script under the lineage folder, run it at least 10 times cold (a fresh node process each time) and 10 times warm, and report median and worst against the hook's 2.5 s budget and against today's fallback scorer timing on the same prompts. Check the floors would hold: typed recall 24 of 44 or more and false offers 0 of 35. The answer is build or decline, with the numbers.
- Started: 2026-11-13T11:45:49Z
- Status: INITIALIZED
- Iteration: 3 of 8
- Session ID: fanout-inprocess-timing-4-1794570002424-6wv97k
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Cold and warm in-process handler cost, and today's fallback baseline | performance | 1.00 | 6 | complete |
| 2 | What the in-process answer changes under the Q026 filter | answer-parity | 1.00 | 5 | complete |
| 3 | Composed degraded-CLI cost and headroom against the 2,500 ms budget | performance | 1.00 | 6 | complete |

- iterationsCompleted: 3
- keyFindings: 17
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] What does one in-process handler call cost from a cold node process, and does its worst case fit the hook's 2.5 s budget?
- [x] What does a warm handler call cost in a process that already loaded the modules, and how much of the cold cost is module load rather than scoring?
- [x] How does the in-process handler compare with today's Python fallback scorer on the same prompts?
- [x] Would the in-process answer change the degraded top, the typed command and the mode label under the Q026 filter, and do the floors hold?
- [x] How much of the hook's 2.5 s budget is left when the degraded CLI path uses the in-process handler instead of the Python spawn?

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
- Last 3 ratios: 1.00 -> 1.00 -> 1.00
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 1.00
- coverageBySources: {"code":11,"other":12}
- WARNING event: novelty_signal_inert metric=newInfoRatio run=3 window=3 sparkline=▄▄▄ — newInfoRatio held flat at 1 across 3 iterations — the novelty signal is uninformative, so convergence and "not exhausted" claims derived from it are untrustworthy.
- Advisory event: trend_flatline metric=score run=3 window=3 sparkline=▄▄▄

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Measuring the in-process handler against the tracked database: the copy plus the copied generation file is what makes `readAdvisorStatus` report `live`, and it keeps every scratch write inside the lineage. Without the generation file the status read `absent` and the handler returned zero recommendations. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/freshness/generation.ts:47] (iteration 1)
- None this iteration. The first scratch run returned zero recommendations because the generation file was missing; copying it fixed the status read and is recorded under Ruled Out rather than treated as a dead end. (iteration 1)
- Timing the warm set on the same prompts used for warm-up: the prompt cache is keyed on prompt text and source signature, so a warm-up call would have filled the measured cache entry. Warm-up used two rows outside the measured set. [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:602] (iteration 1)
- None this iteration. (iteration 2)
- Reporting the synthetic hub prompts as corpus rows. They exist only for the label check, and their ids carry the `synthetic-` prefix in every artifact. (iteration 2)
- Treating `degradedRecommendations` as drop-in compatible with handler rows. It re-derives a command from `commandRowFor(entry.skill)`, so a hub's attached command never survives and a typed command is lost. [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1495] (iteration 2)
- Summing the separately measured medians (CLI startup, handler import, handler call) as if that were a measurement. The composed process run replaces the sum and is the number quoted for the budget. (iteration 3)
- Treating the `--version` spawn as the CLI's import cost. The spawn includes Node boot; the in-process import is 3.85 ms, and both are reported separately. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/inprocess-timing-4/scratch/compose-proposed.jsonl] (iteration 3)

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
