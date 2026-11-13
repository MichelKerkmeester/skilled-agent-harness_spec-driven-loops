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
- Topic: SEGMENT THREE, cross-CLI lane: after phases 011, 012 and 013 are built and committed, what still limits command surfacing across runtimes — the OpenCode plugin brief beside the hook brief, the Claude Code 32-of-44 command visibility collapse, and whether phase 013's delivery and attribution now read true per runtime.
- Started: 2026-11-13T07:40:00.000Z
- Status: INITIALIZED
- Iteration: 6 of 6
- Session ID: fanout-cross-cli-3-1794550139177-nft9c6
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | (d) OpenCode plugin brief beside the hook brief after the mapper fix | cross-cli | 0.90 | 9 | complete |
| 2 | (e) Options that restore Claude's 44 of 44 without renaming a command | cross-cli | 0.75 | 10 | complete |
| 3 | Does phase 013's delivery and attribution read true per runtime | attribution | 0.80 | 7 | complete |
| 4 | Rank the cross-CLI options by gain per unit of floor risk | cross-cli | 0.60 | 5 | complete |
| 5 | The degraded path: what it loses, who hits it, and the smallest fix | cross-cli | 0.70 | 8 | complete |
| 6 | Floor-input map and the close of question coverage | floors | 0.30 | 6 | insight |

- iterationsCompleted: 6
- keyFindings: 45
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] (d) After the plugin mapper fix, what still differs between the OpenCode plugin brief and the hook brief for the same prompt — wording, fields, order, bytes, command line, policy, fail-open path — rendered side by side from code or a renderer run?
- [x] (e) Claude Code lists 32 of 44 commands because a command file named `skill.md` collapses its folder: which options keep every operator-facing command name intact, what does each cost per runtime (claude, codex, opencode, pi, devin, dsh), and what check proves 44 of 44?
- [x] Does phase 013's delivery and attribution now read true per runtime on the committed after arm, and where does it still overstate or understate reach?
- [x] Which remaining cross-CLI gap ranks first by started-when-useful gain per unit of floor risk, and what file does each fix change?
- [x] What does the degraded (daemon-unreachable) path lose per runtime that the live path keeps, and what is the smallest change that makes the fallback carry the same command?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ██▇▇▆▆▇▇▇▆▅▅▅▅▅▆▅▃▂▁
- score sparkline: ██▇▇▆▆▇▇▇▆▅▅▅▅▅▆▅▃▂▁
- Last 3 ratios: 0.60 -> 0.70 -> 0.30
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.30
- coverageBySources: {"other":71}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Comparing against the `~/.claude` transcript brief. That is a delivered brief after host formatting, so a difference could be the host rather than the caller. (iteration 1)
- Looking for a wording or field difference in the head: there is none left after the mapper fix. Any further gain in this area is in the extra block, the channel, or the threshold source, not in the brief text. (iteration 1)
- Rendering the plugin brief from a fixture alone. The committed probe offered a fixture case, but the mapper fix is only proven against a real CLI payload, so the nine-prompt real run carried the conclusion and the fixture was used only as a control. (iteration 1)
- Counting the private root command in the 44. `local-skilled-alignment.md` is untracked and outside the foldered set; including it would change every published number. (iteration 2)
- Looking for a runtime that already solves this by a second namespace: none of the six has a folder-plus-`skill.md` layout, because only Claude mirrors the canonical folder structure. (iteration 2)
- Treating the cursor 44/44 line as proof for all runtimes. It is computed as `visible = total` for cursor regardless of tree content, so it proves the cursor path only. (iteration 2)
- Re-running the arm to answer OpenCode delivery. The brief never becomes a session part, so a rerun would produce the same 24 `unknown`; the only fix is a written marker, which the phase deliberately declined because a plugin-written marker proves the plugin ran, not that the host delivered. (iteration 3)
- Reading `briefDelivered: true` as obedience. It is a delivery fact; every start rate in this iteration is computed from the scorer's own start rows. (iteration 3)
- Trying to derive the DSH unknown from the store: the row has no session id, so there is nothing to open. The row needs the runner to record a session id, not the reader to guess one. (iteration 3)
- Building a reader for `effectiveThresholds` in the plugin. No override exists in the tree; the restraint rule says not to build for a hypothetical. Recorded as a latent hazard in iteration 1 finding 4 instead. (iteration 4)
- Pricing rank 2 by tokens rather than bytes: at four characters per token the block is 18-21 tokens, which no cap binds; the gain is parity and noise, not budget. (iteration 4)
- Putting the `create` skill in the canonical `.skilled/skills` tree. It would add a fifteenth skill to every runtime and to the advisor graph, which is the one route by which rank 1 could move the floors. (iteration 4)
- Looking for an OpenCode-side fallback record: the plugin's answer is in memory only, so a degraded OpenCode prompt leaves no trace at all. Its rate can only be inferred from an operator's own session, never from an arm. (iteration 5)
- Starting a daemon or a second socket directory to measure the fallback live. The reproduction above reaches the same two functions without one, and a second daemon is forbidden in this lane. (iteration 5)
- Treating the 012 note as the current behaviour. Two of its three claims do not reproduce at HEAD, and the third (mode label and doctor hand-off lost) does. (iteration 5)
- None. The floor-input trace is short and conclusive. (iteration 6)
- Running the floor scripts to re-measure. They write into the phase scratch directories, which are outside this lineage; the committed after files are the evidence, and the input trace answers the risk question without a run. (iteration 6)
- Treating the missing tick on (e) as a research gap. It is an exact-match bookkeeping difference — the record omitted the backticks around `skill.md` — and is corrected by this iteration's record, not by new evidence. (iteration 6)

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
