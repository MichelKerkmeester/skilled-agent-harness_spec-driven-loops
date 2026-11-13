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
- Topic: Performance and cost of command surfacing after the planned phases 005 to 008: where Claude hook wall time goes, what the brief and a started command cost in tokens, which cold-start path can exceed a runtime hook budget, and which caching or precompute change pays for itself across claude, codex, opencode, pi, devin and dsh.
- Started: 2026-11-12T23:50:00.000Z
- Status: COMPLETE
- Iteration: 5 of 5
- Session ID: fanout-performance-1794523629654-v541y3
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: max_iterations

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Hook wall-time decomposition and the cold prompt path | performance | 0.90 | 5 | complete |
| 2 | Cold embedder, keep-alive and the p95 tail | performance | 0.85 | 5 | complete |
| 3 | Token cost of the brief, the command read and the ask turn | performance | 0.90 | 6 | complete |
| 4 | Cache, precompute and the per-runtime cost architecture | performance | 0.85 | 8 | complete |
| 5 | Overlap audit, aggregate gain and the one measurement gap | performance | 0.45 | 7 | insight |

- iterationsCompleted: 5
- keyFindings: 31
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Where does the ~205 ms Claude hook wall time go, and which part can be removed without changing the recommendation?
- [x] What does command surfacing cost in tokens per prompt, per session and per started command, and where is the largest avoidable cost?
- [x] Which cold-start paths (daemon, embedder, first prompt of a session) can exceed the runtime's hook budget, and what removes the stall?
- [x] Which caching or precompute change pays for itself across the six CLIs, and which does not?
- [x] Which per-runtime architecture spends the least per prompt, and what should the other runtimes copy?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ████▇▇▇██████▇▇▆▅▄▂▁
- score sparkline: ████▇▇▇██████▇▇▆▅▄▂▁
- Last 3 ratios: 0.90 -> 0.85 -> 0.45
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.45
- coverageBySources: {"code":35,"other":9}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- No live cold-daemon measurement was taken. Starting or stopping the advisor daemon writes outside this lineage and the hard rules forbid process control. The cap mismatch in finding 3 is read from source and corroborated by an existing sandbox record, and the missing number is recorded as a gap with its verification path: a sandbox socket and DB, as the launcher tests already do, then `hook-latency.mjs` once cold. (iteration 1)
- Raising the shim timeout to the CLI's 5000 ms cold wait. It would trade a fast fail-open for a 5 s stall on the first prompt, which is worse for the person than a brief that arrives on the second prompt. (iteration 1)
- Replacing the exact prompt cache with a longer TTL as a first fix. The cache is process-local and keyed on the exact prompt, so unique prompts miss regardless of TTL; the lever is process count, not TTL. (iteration 1)
- Treating the brief length as the first performance lever. The measured full brief is about 85 tokens and a reduced head about 17 tokens, while one command document read costs about 1,131 tokens at the median. Trimming the brief is noise beside the document read; that comparison moves to iteration 2. (iteration 1)
- No live idle-and-reload measurement was taken. Forcing the model to unload needs a 5-minute wait with no prompt or an ollama lifecycle action, and the steer forbids touching ollama. The measured `expires_at` plus the adapter's missing `keep_alive` is the evidence; the live check is named in the recommendation's verification. (iteration 2)
- Preloading the model once at daemon start *instead of* a keep-alive. A preload is itself a cold call, and the server still unloads after five idle minutes, so a session that pauses mid-way pays the tax anyway. Keep-alive plus a session-start warm covers both. (iteration 2)
- Recommending a blanket longer deadline to absorb a cold load. It would spend the hook budget on a call that already fits inside 750 ms. (iteration 2)
- Treating the p95 tail as an embedding-lane regression to be engineered away. Its absolute size is tens of milliseconds and its cause is variance, not a cold branch. (iteration 2)
- A per-prompt token budget mechanism. The 80-token cap already binds and the measured brief is 64 tokens. (iteration 3)
- Caching rendered briefs to save tokens. Rendering costs well under a millisecond and tokens are charged for context, not render time. (iteration 3)
- Following the reducer's p95-tail pointer again. Iteration 2 answered it with a bounded variance claim; re-investigating it would repeat exhausted work. (iteration 3)
- No per-start token measurement exists in any phase packet. Phase 007 measures whether a command starts, never what the start costs. The doc-size measurement here stands in for it; a live token count from a started session would need a runtime run, which the steer forbids. (iteration 3)
- Trimming the brief head or the directive block as a token saving. The head is 41 characters and the block is already suppressed on repeats; the ceiling is 54 tokens per session. (iteration 3)
- A semantic or near-duplicate prompt cache. It pays one embedding to decide a hit and risks a wrong recommendation. (iteration 4)
- Any new precompute of command or skill vectors. Both are already built and the brief's constant block is already deduped. (iteration 4)
- No field cache hit rate exists to report. The diagnostics and metrics surfaces are opt-in and this checkout has no persisted diagnostics file, so the hit-rate question is closed as unmeasured rather than answered with a guess. (iteration 4)
- Persisting the exact cache across daemon restarts. The daemon recycles on build staleness, not per prompt, so the saving is rare. (iteration 4)
- Treating all six runtimes as one cold-start risk. Only Claude and Codex have a budget tighter than the CLI's cold wait. (iteration 4)
- A performance explanation for the uneven start rates across runtimes. The same hook cost applies to every runtime and the spread is behavioural. (iteration 5)
- Any further cache or precompute project. The evidence does not support a payoff and the telemetry needed to justify one is off by default. (iteration 5)
- Cold daemon start remains unmeasured inside the hard rules. Starting or stopping the live daemon is out of scope, and no existing packet records the number. The procedure is named instead of guessed. (iteration 5)
- Re-opening the brief's token budget. The measured brief is below the cap and the constant block is already suppressed. (iteration 5)

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
