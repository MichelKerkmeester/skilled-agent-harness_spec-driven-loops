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
- Topic: SEGMENT FIVE, cross-CLI lane: on the built state after phases 016 to 033 at HEAD 84de3d600fa, which per-runtime delivery, follow-through and reader gaps still limit command surfacing on claude, codex, opencode, pi, devin and dsh? Inputs include the untuned arm scored in phase 033 (scratch/arm-evidence.txt: pooled gained 25 lost 15 p 0.0769; an ask offer of /deep:review reached the refusal decline row fresh-decline-refusal-02 and dsh started /create:sk-skill; devin on-arm lost rows acted with no workflow and no offer; OpenCode delivery reads unknown in both arms; 41 capped turns; sk-git rows that move HEAD cannot be measured by the runner). Read only: edit no tracked file outside the research packet.
- Started: 2026-11-16T03:57:28.000Z
- Status: COMPLETE
- Iteration: 8 of 8
- Session ID: fanout-cross-cli-5-1794801313778-3ys69o
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
| 1 | What the 033 arm's per-runtime follow-through numbers actually measure | cross-cli | 0.75 | 5 | complete |
| 2 | Every reader gap, ranked by whether a fix would move a published number | cross-cli | 0.80 | 5 | complete |
| 3 | The ask path two accepted shapes and which runtimes can produce them | cross-cli | 0.70 | 5 | complete |
| 4 | What the missing OpenCode reader actually costs and the rank order | cross-cli | 0.65 | 5 | complete |
| 5 | What a start is on each runtime and why the two start functions disagree | cross-cli | 0.70 | 5 | complete |
| 6 | What capped means per runtime and the row the scorer cannot see | cross-cli | 0.85 | 6 | complete |
| 7 | The two remaining limit lines tested against the files | cross-cli | 0.80 | 6 | complete |
| 8 | Coverage close-out and the lane final order | cross-cli | 0.35 | 8 | insight |

- iterationsCompleted: 8
- keyFindings: 45
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] (a) Why does the 033 untuned arm's follow-through vary so widely per runtime — claude 4 of 28 followed off and 6 of 28 on, opencode 11 of 28 and 13 of 28, pi 13 of 28 and 14 of 28, devin 24 of 28 twice, dsh 18 of 28 and 23 of 28 — and which part of each gap is a runner artifact rather than a product gap?
- [x] (b) OpenCode reads delivery unknown on 36 of 36 off runs and 44 of 44 on runs: what does that cost the arm's evidence, and is a prompt-free plugin receipt the smallest fix that moves those rows?
- [x] (c) Which runtimes still have a reader or attribution gap the arm cannot see — codex unmeasured under Q075, devin and dsh one unknown row each, opencode all unknown — and what file line proves each gap?
- [x] (d) The ask path put `/deep:review` in front of the refusal row fresh-decline-refusal-02 and dsh started `/create:sk-skill` on a decline row: what per-runtime surface decides whether an ask offer is representable, and which runtime's reader loses it?
- [x] (e) Which remaining cross-CLI gap ranks first by commands started when useful per unit of floor risk, and what measurement would confirm the fix on claude, codex, opencode, pi, devin and dsh?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▇▇▇▇▇▆▆▅▅▅▆▆▇███▇▆▃▁
- score sparkline: ▇▇▇▇▇▆▆▅▅▅▆▆▇███▇▆▃▁
- Last 3 ratios: 0.85 -> 0.80 -> 0.35
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.35
- coverageBySources: {"code":51,"other":18}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Comparing the arm's followed rate with the step reader as two estimates of one quantity. They are not: one is pre-write access, the other is post-hoc step grading on a different row sample (the 20 `fresh-fit-*` rows, not the 28 paired rows). (iteration 1)
- Reading the arm's per-runtime followed rate as a UX or fit measure. The classifier's contract and its helper both define it as a pre-write document read, so the label overstates what the number is. (iteration 1)
- Treating opencode's `deliveryUnknown 44` as evidence that the plugin failed to emit. No reader exists to observe either outcome. (iteration 1)
- Reading the `offerUnknown: 1` on devin and dsh as a lost offer. The field is absent from the line; it is not a recorded non-offer. (iteration 2)
- Searching the run logs for opencode rows that carry a delivery answer. All 80 lines read unknown by construction, so no per-row inspection can recover a delivery fact from them. (iteration 2)
- Treating Codex as a sixth measured runtime. No row exists, and the gate that stops it is a runner refusal with an operator repair path, not a scoring gap. (iteration 2)
- Attributing dsh's decline-row start to a delivery or representation failure. The run line records the brief as delivered and the session records the offer as declined, so the mechanism is present and the outcome still violates the row. (iteration 3)
- Counting ask-policy rows that ended in prose questions without a `?`. The classifier requires the mark, so no such run can be recovered after the fact. (iteration 3)
- Reading the near-zero `asked` count as evidence that models do not ask. The classifier only accepts two transcript shapes, so the count measures representability at least as much as behaviour. (iteration 3)
- Ranking by claimed start gain. No pair of per-runtime intervals separates, so the gain column cannot carry a rank. (iteration 4)
- Treating the OpenCode receipt as a delivery-only improvement. It also changes which offers count as reached, because the tally reads the same field. (iteration 4)
- Trying to recover a per-runtime brief effect from the `byPolicy` blocks. Five ask rows and ten start rows per runtime per arm leave nothing separable once the capped rows are removed. (iteration 4)
- Comparing runtimes on start rate without naming the shape mix, while the shape vocabulary differs by runtime. (iteration 5)
- Searching the run logs for a start-shape field. No such field exists in the line schema; only `changedPaths`, `offeredCommand`, `offeredPolicy`, `offeredAs`, `briefDelivered`, `restored` and `exit` are written. (iteration 5)
- Treating the printed start rate as "the model took the workflow". A document read alone earns it, and on Claude an expansion the model never chose also earns it. (iteration 5)
- Reading the `capped` column as a wall-clock count on every runtime. On devin it is a missing-exit-code count. (iteration 6)
- Searching for a scored-row field that records the restore fault. `restored` and `headMoved` exist on the run line and are never read by the scorer. (iteration 6)
- Treating the runner's `restore_failed` verdict as reaching the score. It does not: only `exit` is consulted. (iteration 6)
- Looking for a `pointerRestored` or `leftoverPaths` event in the logs to show a turn disturbing the pointer. No line carries either field, so no turn touched it. (iteration 7)
- Reading the off arm's offer field as counterfactual and the on arm's as observed. Both are replays; only the model's own line distinguishes them. (iteration 7)
- Treating the arm's five-runtime comparison as holding the framework constant. It holds the arena's pointer constant and leaves the home file in place on one runtime. (iteration 7)
- A sixth answer question. The lane's five questions are answered; the four extra findings are measurement facts about the instrument, and folding them into a new question would hide that they were found while testing the answers. (iteration 8)
- Ranking by any per-runtime start delta. Recomputed intervals overlap for all five runtimes, so that column cannot carry an order. (iteration 8)

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
