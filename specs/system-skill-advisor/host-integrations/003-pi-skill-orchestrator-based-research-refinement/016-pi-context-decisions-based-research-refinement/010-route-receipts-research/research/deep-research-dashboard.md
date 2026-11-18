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
- Topic: Answer Q1-Q5 of the Research Brief in the bound spec.md (stored route receipts for weak follow-ups). Q0 is closed and must not be rerun: over-suppresses branch, stripped H=5, raw H=4, Hsame=2, C=19, N=9, recorded in implementation-summary.md.
- Started: 2026-11-18T19:04:03Z
- Status: INITIALIZED
- Iteration: 3 of 3
- Session ID: 2026-11-18T19:04:03Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q1 Receipt contents and the guard's action, with Q2 The state store if budget allows | design | 0.83 | 9 | complete |
| 2 | Q2 The state store (closure), with the lifecycle clock as the bridge into Q3 | - | 0.81 | 8 | complete |
| 3 | Q3 Expiry (closure), Q4 Runtime reach and Q5 The measurement | expiry-reach-measurement | 0.78 | 9 | complete |

- iterationsCompleted: 3
- keyFindings: 61
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Q1 Receipt contents and the guard's action: what a receipt holds, which turns write one, reuse versus suppress on a weak follow-up, and the test that separates a weak follow-up from a floored topic change
- [x] Q2 The state store: reuse the directive-lifecycle store, a sibling folder beside Vibe's head receipts, or `.skilled/skills/.state/`, with atomicity and concurrency
- [x] Q3 Expiry: by turn count, by time or by a lifecycle event (startup, resume, compact, clear, shrinking transcript)
- [x] Q4 Runtime reach: Claude, Pi, DSH, Vibe, Codex and the OpenCode plugin, including Vibe head-receipt interaction
- [x] Q5 The measurement: the harness, the success threshold on the nine follow-up pairs, why C does not apply without a receipt, the scorer-isolation check and one false-carry case

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ██▇▇▇▇▆▆▆▅▅▅▄▄▃▃▂▂▁▁
- score sparkline: ██▇▇▇▇▆▆▆▅▅▅▄▄▃▃▂▂▁▁
- Last 3 ratios: 0.83 -> 0.81 -> 0.78
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.78
- coverageBySources: {"code":42,"other":3}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **A raw meaningful-token cut.** It separates pair 7 (7 tokens) from the refactor task (8) by one token, too narrow to hold. (iteration 1)
- **Floored-passing-set membership as the separator.** The refactor task's floored passing set also holds `sk-doc` (spec Measured Behavior, third block), so "receipt skill is in the follow-up's floored set" would carry a topic change. (iteration 1)
- **Reusing the hook's `skippedResult` as the guard's policy reason.** It is computed on raw text (finding 1). (iteration 1)
- The in-process probe through `dist/` was refused by the permission layer in this unattended run. Not a dead end for the question, only for this iteration's tool path. (iteration 1)
- **Clearing receipts from the boundary adapter.** Storing the clock expires them with no change to the boundary path (finding 7). (iteration 2)
- **Riding the helper's `flock`.** It needs a new helper op and an extra spawn, and the guard's fail-to-deliver direction makes a lock unnecessary (findings 2, 3 and 6). (iteration 2)
- **Storing the receipt inside the lifecycle record.** The helper rebuilds and copies only fixed keys, so an extra field would not survive a matched turn (finding 1). (iteration 2)
- None new. The `dist/` probe from iteration 1 was not retried. This iteration needed no runtime probe. (iteration 2)
- **A turn-count expiry.** It cuts off a legitimate run of weak follow-ups and needs a write on guarded turns. (iteration 3)
- **An age limit on top of the clock.** It adds no safety on hosts where the clock rotates, and it adds a field. (iteration 3)
- **Putting OpenCode in scope.** The guard runs in the hook, and the plugin calls the CLI. (iteration 3)
- None. No runtime probe was attempted in this iteration, so the iteration 1 permission dead end was not retried. (iteration 3)

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
