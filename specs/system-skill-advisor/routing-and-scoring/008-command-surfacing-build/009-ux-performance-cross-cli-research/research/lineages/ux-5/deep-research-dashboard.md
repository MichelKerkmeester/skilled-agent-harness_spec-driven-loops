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
- Topic: Segment five, command surfacing on the built state after phases 016 to 033 (HEAD 84de3d600fa): what still limits UX, performance and cross-CLI usefulness. UX lane (ux-5): offer fit, decline and refusal safety, and the brief's wording.
- Started: 2026-11-16T03:58:25Z
- Status: COMPLETE
- Iteration: 7 of 8
- Session ID: fanout-ux-5-1794801313778-3ys69o
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: converged

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Built-state map of the offer, ask and start split after phases 016 to 033 | ux-offer-fit | 0.60 | 10 | complete |
| 2 | The decline taxonomy, and what a declined or refused offer does | ux-decline-safety | 0.75 | 8 | complete |
| 3 | What the brief's wording costs, measured against what models did | ux-brief-wording | 0.70 | 8 | complete |
| 4 | The remaining UX gaps and what would confirm each fix | ux-gap-inventory | 0.45 | 8 | complete |
| 5 | Verification pass, two corrections and one withdrawal | ux-verification | 0.40 | 7 | insight |
| 6 | Offer coverage on the fresh plain rows, and the inverted depth gate | ux-offer-coverage | 0.85 | 6 | complete |
| 7 | Claims audit, each load-bearing claim against two sources | ux-claims-audit | 0.20 | 6 | insight |

- iterationsCompleted: 7
- keyFindings: 53
- openQuestions: 0
- resolvedQuestions: 4

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 4/4
- [x] Which offer, ask and start decisions does the built brief make today, and which of them phase 020's fit guard or phase 021's head parity already settled?
- [x] Why did an ask offer of `/deep:review` reach the refusal decline row fresh-decline-refusal-02, and what does a declined or refused offer do on each runtime?
- [x] What does the brief's wording cost a model that would otherwise start a workflow: head line, directive block, command-line order and length?
- [x] Which offer-fit or decline-path UX gaps remain after phases 016 to 033 that no planned or built phase already covers?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▅▆▆▇▇▇▆▆▅▄▄▃▃▄▅▇█▅▃▁
- score sparkline: ▅▆▆▇▇▇▆▆▅▄▄▃▃▄▅▇█▅▃▁
- Last 3 ratios: 0.40 -> 0.85 -> 0.20
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.20
- coverageBySources: {"code":64}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Re-measuring typed recall, false offers or the sealed holdout: those are the performance and routing lanes' numbers, and 033 already prints the floor lines. (iteration 1)
- Reading holdout prompts to explain the offer: banned by the lead's ruling, and unnecessary here because the refusal row is a `fresh` row. (iteration 1)
- Searching for a policy legend in the hook or plugin text: none. The plugin forwards the rendered brief; the legend does not exist anywhere in the render path. (iteration 1)
- Searching for a prose-level refusal guard: none exists. The only refusal vocabulary in `command-attach.ts` operates on the typed command name, which the refusal row does not contain. (iteration 1)
- Treating the 033 `offeredAs` field as a record of model behaviour: it names what the brief offered, not what the model did; the run line has no started-command field. (iteration 1)
- A per-row declaration of what the model did with the offer: the run line records the offer and the changed paths, not the action; the action only appears in the scorer's per-start list. (iteration 2)
- A prose refusal vocabulary anywhere in the attach path: the only refusal lists operate on a typed command name, and `isNoEditRequest` covers change wording, not workflow refusal. (iteration 2)
- Counting the `startedOfOffered` aggregate as a decline-row rate: that counter only increments when a row's expected command was offered and then started, and decline rows have no expected command, so it cannot describe them. (iteration 2)
- Re-checking phase 020's question-shape limitation: it is already recorded there and restated here only as mechanism, not as a new finding. (iteration 2)
- Treating an offer on a decline row as a safety failure by itself: 49 of the 50 decline-row offers in the run lines produced no start. (iteration 2)
- A per-row brief text in the 033 run lines: they carry the offer fields, not the rendered string, so byte cost has to come from the separate captures. (iteration 3)
- A policy-legend test in the repository: no test asserts that a reader can interpret `(ask)` or `(start)`. (iteration 3)
- Cutting the scores and pass mark: settled in segment three section 4 (f), not reopened here. (iteration 3)
- Head parity as a per-runtime explanation: phase 021 fixed it and the render is shared. (iteration 3)
- Truncation as a wording defect: the cap is far above the measured head size. (iteration 3)
- A decline-row guard that could stop a substituted start: the start came from the model's own route, not from the offer. (iteration 4)
- A head rewrite as this lane's recommendation: B-5 already holds that decision with the operator. (iteration 4)
- A phase after 033 that owns these gaps: none exists in the packet. (iteration 4)
- A policy legend as a standalone build: it costs bytes on every brief and belongs inside B-5. (iteration 4)
- Presenting the 8-of-24 decline offer count as new: phase 023 recorded it and left it untuned on purpose. (iteration 4)
- A brief legend (R3): the root doc carries the definition and every arena reads it. (iteration 5)
- A policy-legend gap on any measured runtime: all five read the root doc. (iteration 5)
- A test that pins "change the release date" as a small edit: none exists, which is why the row still draws an offer. (iteration 5)
- Gating `/create:changelog` by command name (R2): the row carries no small-edit wording, so the gate would not fire. (iteration 5)
- A stored head for `fresh-fit-18`: the run line records the offer fields, not the rendered string, so the cause of the missing command needs one hook replay of that prompt. (iteration 6)
- Blaming the runner for the missing offers: `replayOffer` spawns the hook with the row's prompt and reads the head it returns, so the run line records the hook's own output. (iteration 6)
- Treating 13 of 20 as 13 failures: the arm's metric follows a skill path, so the count is about the offer surface only. (iteration 6)
- A second measured source for the directive's effect on attention: none exists in the packet. (iteration 7)
- Registering the attention-dilution inference as a verified claim: its evidence is one byte measurement and no behavioural contrast. (iteration 7)
- Using a single source class for C3: the run lines and the corpus labels are independent records of the same row. (iteration 7)

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
