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
- Topic: Segment five, command surfacing on the built state after phases 016 to 033 (HEAD 84de3d600fa): what still limits UX, performance and cross-CLI usefulness. Performance lane (performance-5): hook latency, turn caps and brief cost.
- Started: 2026-11-16T03:57:11.000Z
- Status: COMPLETE
- Iteration: 8 of 8
- Session ID: fanout-performance-5-1794801313778-3ys69o
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
| 1 | Built-state hook latency and what the arena capped | performance | 0.83 | 11 | complete |
| 2 | What the 300 s cap actually cut, and whether hook cost shares the turn clock | performance | 0.92 | 7 | complete |
| 3 | Which instrument reports the built state's p95, and what it hides | performance | 0.93 | 9 | insight |
| 4 | Two latency modes: cache hit versus real scoring | performance | 0.75 | 4 | complete |
| 5 | The cold first prompt: measured load versus waiting bounds | performance | 0.70 | 5 | complete |
| 6 | Per-session brief cost and the dedup that almost never fires | performance | 0.72 | 4 | complete |
| 7 | What the process chain costs, and what the instrument leaves out | performance | 0.75 | 5 | complete |
| 8 | The lane's per-prompt cost ledger | performance | 0.60 | 6 | complete |

- iterationsCompleted: 8
- keyFindings: 51
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] What does the advisor hook cost per prompt on the built state after phases 016 to 033, and does any measured path exceed its runtime's hook budget?
- [x] What ended the 41 capped turns in the phase 033 untuned arm, and can a runtime-keyed wall-clock cap reduce them without changing the measured outcome?
- [x] What does one brief cost in bytes and tokens on the built state, and which remaining byte is removable without losing the offer contract?
- [x] Does the pre-model hook and brief cost consume a measurable share of a behaviour-runner turn's wall clock, so that it competes with the turn cap?
- [x] Which latency instrument reports the built state's true p95, and which path does it still miss (cold first prompt, in-process plugin, Codex adapter)?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▆▇▇███▇▆▄▄▃▃▃▃▄▄▄▃▂▁
- score sparkline: ▆▇▇███▇▆▄▄▃▃▃▃▄▄▄▃▂▁
- Last 3 ratios: 0.72 -> 0.75 -> 0.60
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.60
- coverageBySources: {"code":18,"other":42}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Counting `null` exits as caps without qualification: one of the 20 null exits is the `fresh-skill-04` rebase row with a failed restore, so the cap count is 19 nulls plus 28 exit-143s. (iteration 1)
- OpenCode SQLite store as a turn-duration source for phase 033: the sessions do not exist in any of the five databases. Candidate for "Exhausted Approaches" only for this arm; a future run must record durations itself. (iteration 1)
- Reading turn duration from the run lines: the record has no duration field and the arena sessions are gone from the store, so the cap's cost per turn is not recoverable. Replaced by the exit census and the cap constants. (iteration 1)
- Reconstructing the brief's token count from a tokenizer: no tokenizer is committed for this brief and the renderer's own 4-characters-per-token estimate is the contract, so a second estimate would add noise, not evidence. (iteration 1)
- Treating the p95 290 ms as the hook's work time: the 240-299 ms plateau with a 300 ms cliff shows a deadline shapes the distribution. Reporting 290 ms as "typical cost" would misstate it. (iteration 1)
- A runtime-keyed cap as the fix: it leaves the misclassification in place and gives zero help to the two runtimes that never capped. (iteration 2)
- Estimating the number of capped turns a longer cap would convert: the arm stores no duration for them, and the two sampled capped sessions disagree in shape (293 s active versus 61 s then waiting). That needs a re-run, not arithmetic. (iteration 2)
- Recovering the durations of the 45 unsampled capped turns from the OpenCode store: iteration 1 already established the sessions are gone; only the step-reader's 20 sampled sessions survive. (iteration 2)
- Treating the 300 s cap as a stuck detector: four sampled completions land within 10 s of it, and one capped session was still emitting messages at 293 s. (iteration 2)
- Using `summary-arm.json`'s `cappedOfferRows` as the cap's cost: it counts only the five offer rows, so it understates the 26 OpenCode caps by an order of magnitude. (iteration 2)
- Measuring cold-start cost from the current record: the unavailable path records 0 ms by construction, so the record cannot carry it. (iteration 3)
- Reading the folder's raw percentiles as hook cost: 86.6 percent of the rows are generated. Any future measurement must filter sweeps or read a single workspace. (iteration 3)
- Separating sweeps from real rows by timestamp: both land in the same minutes, so shape (monotone, exact span, 200 rows) is the only reliable discriminator. (iteration 3)
- Treating the 2,218 ms maximum as a live-path worst case: it is an unavailable row, and the live maximum is 1,538 ms. (iteration 3)
- Using `freshness: stale` (13 rows) as a cold indicator: stale rows have p50 374 ms, but the population is too small and marks a stale brief, not a cold daemon. (iteration 3)
- Comparing a probe median to an organic median directly: 57.8 percent of organic live rows are cache hits, so the two medians measure different work. (iteration 4)
- Reading Vibe's 742 ms p95 as a runtime cost: 49 rows is too small a sample and its rows are not from a controlled arm. (iteration 4)
- The phase 015 `brief-cost-live.json` is not a rows array in the shape the filename suggests, so it could not be joined to the organic brief set; the 1,234 organic brief rows carry the same quantity. (iteration 4)
- Reading a cold first-prompt cost from the health records: the fail-open branch writes 0 ms, so the record cannot carry it. (iteration 5)
- The phase 008 committed cost script needs the model unloaded to reproduce the cold numbers, and unloading is a process action this read-only lane may not take. (iteration 5)
- Treating 2,500 ms as the cold cost: it is the cascade probe's ceiling, and the measured cold work is 690 ms. (iteration 5)
- Measuring the dedup's amortized effect from this data: nine head-only rows cannot support a share. (iteration 6)
- Splitting brief bytes by `cacheHit`: a cache hit describes the recommendation cache, not the directive lifecycle, so the two fields do not partition the same population. (iteration 6)
- Treating 270.6 bytes as a per-session upper bound: it is the per-prompt cost in a fresh-session population. (iteration 6)
- Adding the three hook timeouts as a worst case: `timeout: 3` is a host kill, not a cost. (iteration 7)
- Reading the advisor leg as the prompt's hook cost: two more hook commands run and are not in its record. (iteration 7)
- The shim's compiled dispatcher could not be timed without running it, which this lane may not do. (iteration 7)
- Per-runtime cached medians on Devin and Codex: four and two rows respectively, too few to read. (iteration 8)
- Ranking any performance fix above the turn-cap fix: the cap removed 47 judgeable rows, while every latency cell sits inside its budget. (iteration 8)
- Treating the ledger's hook column as a prompt's total hook latency: two non-advisor hooks run outside it. (iteration 8)

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
