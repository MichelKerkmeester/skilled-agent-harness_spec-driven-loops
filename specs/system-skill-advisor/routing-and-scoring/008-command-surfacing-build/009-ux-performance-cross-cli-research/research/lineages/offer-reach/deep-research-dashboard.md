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
- Topic: SEGMENT TWO offer-reach lane: find the next improvements to command surfacing now that phases 005, 006, 008 and 010 are built and committed and phase 011 (typed command delivery 44 of 44, policy on hub-attached commands, visibility guard, hook health, brief cost script) is being built, without re-recommending what those phases built or plan. Explain and improve the measured offer bottleneck: the expected command was offered on only 3 of the 16 plain tune rows, /doctor:helper on 2 more and nothing on 11, while a command that was offered was usually taken; plain recall on the tune split is 9 of 45 on phrases and 14 of 45 with the real embedder. Lane label offer-reach covers hub mode vocabulary and deferral (/deep:review and /deep:research defer, so three runtimes improvise), a default command for a hub that defers, semantic lane weight and embedding text, the doctor family, and scoring thresholds, while false offers stay 0 of 35 and typed recall stays at least 24 of 44 and the scorer floors stay [159,50,20,5].
- Started: 2026-11-13T10:00:00.000Z
- Status: COMPLETE
- Iteration: 4 of 4
- Session ID: fanout-offer-reach-1794539443568-6stapj
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
| 1 | Which plain tune rows get no offer because a hub returns defer or routes to a mode with no command, and the smallest rule that turns a deferring hub prompt into an offer without adding a false offer | offer-reach | 0.90 | 6 | complete |
| 2 | Placement versus evidence absence on the five wrong-top plain rows, and what the semantic lane actually buys | offer-reach | 0.85 | 6 | complete |
| 3 | The doctor handoff and the deep-family route: whether naming the matched doctor command and widening deep vocabulary closes the remaining misses | offer-reach | 0.88 | 6 | complete |
| 4 | Verify every proposed phrase and mechanism against the none rows and hub canary, compute expected exact-offer gain, check floors and rank the recommendations | offer-reach | 0.70 | 6 | complete |

- iterationsCompleted: 4
- keyFindings: 24
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Which plain tune rows get no offer because a hub returns `defer` (or routes to a mode with no command), and what is the smallest rule that turns a deferring hub prompt into an offer without adding a false offer?
- [x] How much of the 3-of-16 plain offer rate is score placement (the command row or owner below the top-1 threshold) versus evidence absence (no lane, no phrase, no embedding text), measured per row?
- [x] What does the semantic lane contribute to the plain tune rows, and does a wording or weight change raise offers without moving the scorer floors?
- [x] Which doctor-family strings can ever score a document read, and how much plain recall is lost to the argued-route/document lookup rather than to scoring?
- [x] Which threshold or ranking constant could move the plain offer rate, and what is its measured risk to false offers 0 of 35 and typed recall 24 of 44?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ██▇▇▇▇▆▆▇▇▇▇▇▇▆▅▄▃▂▁
- score sparkline: ██▇▇▇▇▆▆▇▇▇▇▇▇▆▅▄▃▂▁
- Last 3 ratios: 0.85 -> 0.88 -> 0.70
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.70
- coverageBySources: {"other":40}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Asking the doctor helper handoff to cover doctor-deep-loop: the helper is chosen only for a "problem" prompt and the deep-loop row is a diagnostic request; extending the handoff would have to suppress the expected `/doctor:deep-loop`, which is worse. (iteration 1)
- Lowering `COMMAND_MEANING_MIN_COSINE` (0.72) to lift the create rows: the misses are explicit-lane and hub decides, and the meaning lane needs the real embedder, so a lower bar spends false-offer risk without touching a hub `defer`. (iteration 1)
- Making `attachCommand` ignore `selectionKind` for a multi-target route: a bundle names several modes, so any single command would be a guess; that is exactly the defer case the hub reports. (iteration 1)
- Ranking a top-3 command row into the brief instead of the top skill: the renderer deliberately prints one top label plus a doctor companion, and phase 005 froze that head shape; a second arbitrary line is a new brief surface, not a scoring fix. (iteration 1)
- Treating the capture's `offered` as delivered: shown false on create-agent-01 in finding 1. (iteration 1)
- A second meaning lane with a lower cosine bar: it would spend false-offer risk on the doctor and speckit rows that already pass, not on the chat rows. (iteration 2)
- Lowering `COMMAND_MEANING_MIN_COSINE` below 0.72: it cannot reach a row with no cosine evidence, and the 5 real-embedder gains are outside the chat set. (iteration 2)
- Raising the semantic lane weight: the lane is live at 0.05 and its gains are already counted; a weight change would reorder rows the floor depends on without adding evidence. (iteration 2)
- Re-adding "persona file": measured regression in phase 003 (finding 4). (iteration 2)
- Threshold tuning as a substitute for evidence: four of five rows are below top-3, so no threshold reaches them. (iteration 2)
- Treating `doctor-deep-loop` as a scoring miss: the deep hub declares no doctor mode, so there is no command candidate to rank. (iteration 2)
- A generic "problem" cue for the doctor helper row: the none row "what are the doctor commands actually used for" is a question about the family, and a bare problem word is the weak cue that already must not fire when a skill passes. (iteration 3)
- Adding a new doctor mode to the deep hub: the command row and the matcher entry already exist, so a mode would duplicate a working lookup. (iteration 3)
- An `ask`-only default command on a deferring hub (finding 5): it would fire on the deep-loop near-miss where the hub legitimately has no mode. (iteration 3)
- Treating `/doctor:deep-loop` as a scoring problem: the matcher ranks it first at 16.249; the blocker is the cue gate, not the score. (iteration 3)
- A single "one rule" for all 11 rows: the causes split across three layers (hub vocabulary, doctor cue/matcher, scorer anchors), and each layer has its own verification surface. (iteration 4)
- Editing the compiled policy snapshot by hand: the deriver/compiler owns it; only `hub-router.json` is authored. (iteration 4)
- Folding the metadata re-embed into the same phase: it needs a capture this lineage cannot run and would hide the smaller items' measured gains. (iteration 4)
- Shipping a phrase that was not grepped against the none set: the measurement is cheap and the floor is pinned at 0 of 35. (iteration 4)

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
