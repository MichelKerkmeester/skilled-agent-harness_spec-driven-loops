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
- Topic: How can the Skilled test cycle get faster after the five cuts already built? Measured state on an 18-core Mac: the system-deep-loop suite takes 504-511 s (161 files in parallel, then 12 timing-sensitive files serially, about 265 s: tests/stress/**, tests/lifecycle/**, unit/fanout-run, unit/lineage-timestamp-window, integration/deep-research-postflip-fanout). The system-spec-kit npm test takes 841-911 s: the core lane 348-399 s (about 300 s of it is import time), the cli lane about 400 s set by tests/upgrade-legacy.vitest.ts alone, and validation about 90 s. Open items: (1) the cli lane's upgrade-legacy file sets its time; (2) the 12 serial deep-loop files; (3) the 300 s import time in the spec-kit core lane; (4) ledger read caching ideas in production code (singleWriterReadCache, gateway rescans) that change runtime behavior; (5) a smaller CI runner gains less from parallel files. Prioritize changes that keep every assertion, measure before claiming and avoid overengineering.
- Started: 2026-11-10T16:49:27Z
- Status: COMPLETE
- Iteration: 10 of 10
- Session ID: fanout-luna-max-1794329077802-xnltbi
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
| 1 | Inspect tests/upgrade-legacy.vitest.ts and its harness to identify the measured work behind the roughly 400-second cli lane. | cli-test-harness | 1.00 | 3 | complete |
| 2 | Check whether existing packet evidence or runner instrumentation separates the upgrade-legacy file time into copy, reset, CLI subprocess, and validation costs. | test-measurement | 0.75 | 2 | complete |
| 3 | Which twelve timing-sensitive system-deep-loop files make up about 265 seconds, what shared-state or timing assumptions keep them serial, and can any safe scheduling change retain all assertions? | deep-loop-test-scheduling | 1.00 | 3 | complete |
| 4 | What accounts for about 300 seconds of import time in the spec-kit core lane, how is that time produced, and which test-process or module-loading changes can reduce it without changing coverage? | spec-kit-import-cost | 0.83 | 3 | complete |
| 5 | What evidence would justify production changes involving singleWriterReadCache or gateway rescans, and how should their runtime-behavior risk be separated from test-only speed work? | ledger-performance-risk | 0.88 | 4 | complete |
| 6 | How do worker count and file parallelism affect elapsed time on smaller CI runners, and what runner-specific measurements should guide any concurrency change? | ci-scaling | 0.88 | 4 | complete |
| 7 | Synthesize the five answered speed questions into an evidence-backed next-measurement queue and reconcile the workflow stop contract. | synthesis-readiness | 0.63 | 4 | insight |
| 8 | Check whether the historical JSON timing profile is retained in the packet, without rerunning tests. | performance-artifact-availability | 0.50 | 1 | insight |
| 9 | Check whether CI retains timing artifacts and whether test lanes run sequentially within one job. | ci-job-topology | 0.75 | 2 | insight |
| 10 | Inspect the runner for existing lane timing and safe command boundaries for a CI scheduling experiment. | ci-job-topology | 0.75 | 2 | insight |

- iterationsCompleted: 10
- keyFindings: 28
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Which fixture setup, waits, subprocesses, and assertions account for the roughly 400-second cli lane in tests/upgrade-legacy.vitest.ts, and what test-only changes can reduce elapsed time while retaining every assertion?
- [x] Which twelve timing-sensitive system-deep-loop files make up about 265 seconds, what shared-state or timing assumptions keep them serial, and can any safe scheduling change retain all assertions?
- [x] What accounts for about 300 seconds of import time in the spec-kit core lane, how is that time produced, and which test-process or module-loading changes can reduce it without changing coverage?
- [x] What evidence would justify production changes involving singleWriterReadCache or gateway rescans, and how should their runtime-behavior risk be separated from test-only speed work?
- [x] How do worker count and file parallelism affect elapsed time on smaller CI runners, and what runner-specific measurements should guide any concurrency change?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▆▅▆█▇▆▆▆▆▆▆▄▂▂▁▃▅▅▅
- score sparkline: █▆▅▆█▇▆▆▆▆▆▆▄▂▂▁▃▅▅▅
- Last 3 ratios: 0.50 -> 0.75 -> 0.75
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.75
- coverageBySources: {"code":63,"other":41}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None. Static inspection identified measurable phases; it did not establish their relative costs. (iteration 1)
- Raising the CLI file-level worker count by itself: the runner already executes the slow file concurrently with the rest of the CLI project. (iteration 1)
- Static packet and runner inspection cannot produce per-case elapsed time. A controlled instrumented run is the next evidence needed. (iteration 2)
- Treating the lane total or the slow file total as evidence of which internal phase dominates; the current timers measure broader invocations. (iteration 2)
- Moving any of the twelve files to parallel based only on filenames or source structure; the current evidence does not demonstrate independence under load. (iteration 3)
- Repeating static inspection to infer the upgrade-legacy phase split; reducer marks that direction blocked, and the controlled test is outside this lineage’s execution boundary. (iteration 3)
- The reported aggregate 265-second serial time does not provide per-file costs. Source inspection identifies the scheduling premise but cannot rank candidates. (iteration 3)
- Attributing the remaining import time to deep-loop test imports; the recorded 302-second figure remained after those tests were excluded. (iteration 4)
- The packet and runner do not identify slow modules or the method behind the reported import-time value. A per-worker/module profile is required before a specific loading change can be justified. (iteration 4)
- Treating the sequential shard runner as a proven import-time optimization; its source documents a different purpose and separate process starts. (iteration 4)
- Counting source-level reads alone cannot show the elapsed-time saving; the scan cost must be measured on the target workload. (iteration 5)
- Enabling the cache at the CLI gateway solely because repeated ledger reads are visible in source; there is no test-cycle profile showing their cost and the gateway can have concurrent process writers. (iteration 5)
- Removing the locked append rescan or post-append projection reads without evidence that the replacement preserves current-head, idempotency, fencing, and projection behavior. (iteration 5)
- Treating the single-writer cache as wholly unimplemented; the current code already enables it in the per-lineage single-writer effect dispatcher. (iteration 5)
- Choosing a maxWorkers value from runner-label assumptions without capturing the actual runner resources. (iteration 6)
- Increasing worker count as a way to reduce the serial 12-file group. (iteration 6)
- The workflow runner label and current source files do not contain a CPU-count measurement or worker-count benchmark. (iteration 6)
- Treating the 18-core Mac timings as a measurement of the current ubuntu-latest CI jobs. (iteration 6)
- Assuming the all-questions-answered STOP branch proves that the separate low-novelty rule passed. (iteration 7)
- Source-text timing totals alone cannot choose an implementation change or establish savings; the next useful evidence is a controlled profile of the corresponding workload. (iteration 7)
- Treating the packet's 834-second and 841-second lower bounds as interchangeable without checking run records. (iteration 7)
- Re-running the test suite to regenerate the historical profile; this research run is limited to existing evidence. (iteration 8)
- The searched packet file inventory did not expose the historical profile, so it cannot supply per-file timings from the available packet artifacts. (iteration 8)
- Treating a profile description in prose as access to the profile's per-file measurements. (iteration 8)
- Claiming a wall-time reduction from step order alone without accounting for repeated setup/build and measuring the complete workflow. (iteration 9)
- The inspected workflows provide no CI artifact-upload path for the historical profile and no per-step duration report in the source checked here. (iteration 9)
- Treating the two inspected workflows as proof that no profile exists in any external artifact store. (iteration 9)
- Claiming per-test or per-phase timing from the runner's existing whole-lane timer. (iteration 10)
- The existing npm runner provides lane-level elapsed logs only; it cannot identify which case or import phase dominates a lane. (iteration 10)
- Treating separate commands as proof that a parallel CI job split will be faster. (iteration 10)

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
