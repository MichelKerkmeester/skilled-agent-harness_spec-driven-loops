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
- Topic: Residual limits lane, segment four: what still limits the reader's experience of the brief on claude, codex, opencode, pi, devin and dsh, hook latency and brief size, and usefulness across the CLIs, measured on the built state after phases 014 and 015
- Started: 2026-11-13T12:45:00Z
- Status: COMPLETE
- Iteration: 4 of 8
- Session ID: fanout-residual-limits-4-1794570002424-6wv97k
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
| 1 | KQ1: what the reader sees on each of claude, codex, opencode, pi, devin and dsh at HEAD after phases 014 and 015, and which runtime still loses the command, the policy or the skill or cannot prove delivery | reader-experience | 0.80 | 5 | complete |
| 2 | KQ2: live brief size across the 44 typed corpus rows and hook latency from the default health records at HEAD after phase 015 | cost | 0.90 | 5 | complete |
| 3 | KQ3: cross-CLI usefulness, the OpenCode delivery gap, the Claude create start rows and the parity of the plugin request | cross-cli-usefulness | 0.83 | 6 | complete |
| 4 | KQ3 verification: whether the OpenCode session store can prove brief delivery or the plugin must write a new prompt-free receipt | cross-cli-usefulness | 0.75 | 4 | complete |

- iterationsCompleted: 4
- keyFindings: 20
- openQuestions: 0
- resolvedQuestions: 3

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 3/3
- [x] KQ1: What does the reader see on each of claude, codex, opencode, pi, devin and dsh at HEAD after phases 014 and 015, and which runtime still loses the command, the policy or the skill, or reports the brief as unknown?
- [x] KQ2: What is the live brief size per prompt and the hook latency at HEAD after phase 015, and which bytes or milliseconds can be removed without losing the command, the policy or the skill?
- [x] KQ3: Which residual limits still make the advisor less useful across the CLIs, and which change is worth building next, with the files, the measured gain and the check that proves it?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▃▄▅▆▆▇██▇▇▆▆▅▅▄▃▃▂▂▁
- score sparkline: ▃▄▅▆▆▇██▇▇▆▆▅▅▄▃▃▂▂▁
- Last 3 ratios: 0.90 -> 0.83 -> 0.75
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.75
- coverageBySources: {"other":34}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- A per-runtime text comparison of the brief: the render probe shows the same renderer output through both channels, so no content difference exists to measure. (iteration 1)
- Re-opening segment-three rank 4 (OpenCode compiled-routing line): the after probe shows one entry per prompt on all nine labels, so its gain is already taken. (iteration 1)
- Re-running the behaviour arm to get fresh OpenCode or DSH delivery evidence: the lane forbids a live arm and no model session may start. (iteration 1)
- Treating the nine probe heads as a brief-size corpus: it is a render parity probe, and KQ2 needs the full typed corpus measured. (iteration 1)
- Using `summary-final-after.json` alone for delivery: it carries `deliveryUnknown` but not `briefDelivered`, so the per-runtime truth had to come from the run lines. (iteration 1)
- Measuring a new cold-daemon first prompt: that needs a fresh socket and a live arm-like start. The phase 010 figure of 742 ms (30 percent of budget) already covers it and is cited, not rerun. (iteration 2)
- Piping rows through the committed `measure-brief-cost.mjs` with the compiled dist hook: it reads `degraded_brief` on this machine, which is the exact failure phase 015 recorded, so the source handler is the only path that yields live heads without a build. (iteration 2)
- Rebuilding the stale `@spec-kit/cli` dist to make that script pass: a build writes outside this lineage, and the lane forbids it. (iteration 2)
- Treating the cache-hit median as the repeat cost: the repeat head is 88 bytes in the corpus, not zero, because the reduced head still carries the first line. (iteration 2)
- Using `emittedBytes` from health records as the brief size: 82 percent of records are zero because the advisor emitted nothing, so the positive subset is the only size signal and the typed corpus is the only clean population. (iteration 2)
- A plugin request-flag change: 0 of 44 typed rows differ, so the flags buy nothing on the measured corpus. (iteration 3)
- Comparing rendered heads from the plugin itself: the plugin's renderer is the same shared renderer, so the CLI answer is the only place a difference could enter, and the probe found none. (iteration 3)
- Re-opening rank 6 (in-process degraded scorer) or rank 10 (intent signals): separate segment-four lanes own them. (iteration 3)
- Re-ranking the OpenCode turn cap as an advisor fix: it is the arena's cap and lands in the runner, not in the brief. (iteration 3)
- Using the final arm's `startedOfOffered` without removing capped rows: it mixes a model choice with a harness stop, so the judgeable denominator was rebuilt. (iteration 3)
- `instruction_entry` and `instruction_blob`: 0 entries for these sessions, so the injected block is not in the instruction tables either. (iteration 4)
- `part` and `message`: 0 rows for the arena session; the live table is `session_message`. (iteration 4)
- A plugin-local in-memory receipt: the arena turn ends the process, so only a durable write survives to scoring time. (iteration 4)
- A reader-only fix against `session_message`: 10 of 24 sessions would read as delivered on assistant text alone, so the check would be wrong on 14 rows and truthy on model output. (iteration 4)
- Reading message bodies for the brief text: it is model output, and it would put prompt-adjacent text in a score log. (iteration 4)

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
