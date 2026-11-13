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
- Topic: Cross-CLI delivery, proof of delivery and obedience after phases 005, 006, 008, 010 and during 011: per-runtime evidence that an offered command reaches the model, that delivery is provable from a committed record, and that the model takes the offer without an unsafe write.
- Started: 2026-11-13T04:20:00.000Z
- Status: COMPLETE
- Iteration: 4 of 4
- Session ID: fanout-cross-cli-2-1794539443568-6stapj
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
| 1 | Q1: which runtime loses the Gate 2 policy before the model sees it, and which single file per runtime decides that (Codex hook approval key, Claude instruction file, shared session readers) | delivery-reachability | 0.80 | 7 | complete |
| 2 | Q2: prove brief delivery for every runtime from a record the runtime itself writes | delivery-proof | 0.85 | 6 | complete |
| 3 | Q3+Q4: attribute the four unsafe runs and test the COMMAND line as an obedience signal | obedience-and-safety | 0.90 | 7 | complete |
| 4 | Q5: rank the cross-cli-2 changes by expected gain per unit of risk and name the file, gain, verify and floor risk for each | recommendation-ranking | 0.75 | 5 | complete |

- iterationsCompleted: 4
- keyFindings: 25
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Which runtime loses the Gate 2 policy before the model sees it, and which single file per runtime decides that: Codex's hook approval key, Claude's instruction file, or the shared session readers?
- [x] Can brief delivery be proven for every runtime from a record the runtime itself writes, and what exactly must be recorded at hook time?
- [x] Why do 4 unsafe runs remain, and are they delivery failures, obedience failures, or routing deferrals?
- [x] What makes a model emit the COMMAND: line or take an offered command, and which contract change raises obedience without raising false offers?
- [x] Which change per runtime raises measured starts for the least risk to the floors (typed recall 24 of 44, false offers 0 of 35, scorer [159,50,20,5])?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▃▄▄▄▅▅▆▆▆▇▇▇██▇▅▄▃▂▁
- score sparkline: ▃▄▄▄▅▅▆▆▆▇▇▇██▇▅▄▃▂▁
- Last 3 ratios: 0.85 -> 0.90 -> 0.75
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.75
- coverageBySources: {"other":47}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **"Add a project `CLAUDE.md` and the Claude start rate rises."** The g2 arm had the pointer and still started 0 of 6, so the file fix is necessary for reach but not sufficient for a start. Rejected as a start-rate claim. (iteration 1)
- **"Codex declined two offered commands."** The two `offered` rows come from replaying the hook in the checkout; the model received no brief. Rejected as a model behaviour claim. (iteration 1)
- **"Pi delivery is already proven in the committed arm."** The committed rows say `unknown`; only an out-of-band probe says otherwise. Rejected as committed evidence. (iteration 1)
- Reading the Codex `trusted_hash` value to derive it. The check deliberately keeps the hash out of output, and pre-seeding it would defeat the product's approval control. The operator step stays the only lawful path; the recommendation must make the arm *honest*, not bypass the control. (iteration 1)
- Treating `offeredCommand` as delivered. It is a replay artifact. Any rate built on it without `briefDelivered` overstates reach. (iteration 1)
- **"Add the brief to the session by editing the hook's output."** The hook output is the host's contract; a second copy written by the advisor would prove only that the advisor ran, not that the host delivered it. Rejected as circular evidence. (iteration 2)
- **"Re-run the whole after arm to recover delivery numbers."** Not needed for pi, devin and dsh: re-running the committed `backfillRunLog` over the existing log recovers the field without a model run, and no CLI session is allowed here anyway. (iteration 2)
- **"The brief is not stored, so delivery cannot be proven."** False for pi, devin and dsh: all three store it and the readers drop it. Only opencode has no store. (iteration 2)
- Reading the OpenCode SQLite part table for the brief. The brief never becomes a part; the transform is applied to the system prompt after the parts are written. Confirmed by the plugin's hook name and the reader's part filter. (iteration 2)
- Using the model's own quotation of the brief as the delivery signal. It scores the model's obedience, not the host's delivery, and would undercount. (iteration 2)
- **"Delivery fixes will remove the remaining unsafe runs."** All four had no offer, so no delivery change reaches them. Rejected. (iteration 3)
- **"Raise the `COMMAND:` line rate and obedience becomes visible."** The line already appears more often than some runtimes start and less often than others; raising it adds brief bytes without a metric that tracks starts. Rejected as a lever. (iteration 3)
- **"Treat the Codex 0 of 2 as a refusal."** Both offers are replay artifacts. Rejected (carried from iteration 1). (iteration 3)
- Reconstructing a per-row `COMMAND:` correlation without running the scorer per row. The aggregate inversion (OpenCode 2 lines, 1 start) already proves the point, so the extra calls were not spent. (iteration 3)
- Using `mns-chat-03` as evidence about command surfacing. It expects no command; it is a write-discipline case and is now recorded as out of lane. (iteration 3)
- **"Fix Codex by pre-seeding the approval hash."** The hash is a product trust control; the ranked change makes the arm honest rather than bypassing it. (iteration 4)
- **"Rank delivery proof below the instruction-file fix."** Delivery proof gates every rate the next phase will quote, and it costs reader-only changes; it ranks first. (iteration 4)
- **"Rank the Claude instruction-file fix as a start-rate gain."** The pointer was present and proven loaded in the g2 arm, which started 0 of 6. Rank it as reach and safety only. (iteration 4)
- Deriving the Codex `trusted_hash` from the command string. The check keeps the value out of output by design, and a fabricated approval would defeat the control the phase exists to respect. (iteration 4)
- Using the global `~/.claude/CLAUDE.md` as the Claude delivery evidence. Its hash and size differ from the arena's `AGENTS.md`, and the unique bullet line proves which file loaded. (iteration 4)

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
