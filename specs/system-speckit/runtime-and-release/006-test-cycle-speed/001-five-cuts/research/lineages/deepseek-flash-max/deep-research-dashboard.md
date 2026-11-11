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
- Started: 2026-11-10T17:50:00Z
- Status: COMPLETE
- Iteration: 10 of 10
- Session ID: fanout-deepseek-flash-max-1794329077802-xnltbi
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
| 1 | What sets the cli lane's time inside tests/upgrade-legacy.vitest.ts | cli-lane | 0.93 | 9 | complete |
| 2 | Which of the twelve serial deep-loop files actually need serial execution | serial-group | 0.86 | 7 | complete |
| 3 | Where the core lane's import time comes from and whether it can be cut | core-lane | 0.92 | 6 | complete |
| 4 | Do the ledger read-caching ideas buy measurable time, and what risk do they carry | ledger-caching | 0.95 | 6 | complete |
| 5 | Which remaining cuts still pay on a smaller CI runner, and how to measure each | ci-scaling | 0.92 | 6 | complete |
| 6 | Whether upgrade-legacy's cost is spread across its 65 tests or concentrated | cli-lane | 0.88 | 6 | complete |
| 7 | The change surface for splitting upgrade-legacy, and why native sharding cannot do it | cli-lane | 0.90 | 5 | complete |
| 8 | Whether fanout-run's 171 tests can be split across workers | serial-group | 0.90 | 5 | complete |
| 9 | The measurement protocol each surviving cut must pass | measurement | 0.35 | 5 | insight |
| 10 | Whether the parallel group has headroom, and what the surviving cuts add up to | consolidation | 0.25 | 6 | insight |

- iterationsCompleted: 10
- keyFindings: 61
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Which of the 12 serial deep-loop files actually need serial execution, and what would shrink that group?
- [x] What sets the time of the cli lane's tests/upgrade-legacy.vitest.ts, and can it be cut without dropping assertions?
- [x] Where do the roughly 300 s of import time in the spec-kit core lane come from, and which parts can be cut?
- [x] Do the ledger read-caching ideas (singleWriterReadCache, gateway rescans) buy measurable time, and what runtime risk do they carry?
- [x] Which remaining cuts still pay off on a smaller CI runner, and how should each be measured before it is claimed as a win?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▇▇██████▇▇▇██▇▄▂▁▁
- score sparkline: █▇▇▇██████▇▇▇██▇▄▂▁▁
- Last 3 ratios: 0.90 -> 0.35 -> 0.25
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.25
- coverageBySources: {"code":133,"other":13}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **Cutting node startup.** Measured at 0.020 s per start, so even eliminating every spawn saves seconds, not minutes. `[SOURCE: measured: /usr/bin/time -p node -e ""]` (iteration 1)
- **Merging `validate.sh`'s freshness check into the orchestrator.** It would save one 20 ms process per validation while changing a guard that fails closed on a stale build; not worth the risk for seconds. (iteration 1)
- **Removing the second validation pass.** It is the proof that a repair worked; removing it would drop an assertion the file exists to make. `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:1190]` (iteration 1)
- **Shrinking the sandbox copy.** The payload is 35.8 MB of 3115 files, paid once in `beforeAll`, so it cannot explain a 400 s file. (iteration 1)
- No checked-in timing profile for the cli lane was found in the packet or the skill tree, so the per-test split of the 400 s is not yet known. A profile is the next evidence needed before any saving is claimed. `[SOURCE: fd -e json 'profile|timing|slow' .skilled/skills/system-deep-loop/runtime → no results]` (iteration 1)
- **Merging the seven 7-line stress wrappers into one file.** It would change which `describe` a failure is reported under and save no measurable time; the wrappers are cheap. (iteration 2)
- **Removing `db-open-close` from the serial set.** Its second test exists to make two writers contend for one lock; parallel neighbours would make the race uncontrolled rather than asserted. `[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/lifecycle/db-open-close.vitest.ts:70]` (iteration 2)
- **Removing `lineage-timestamp-window` from the serial set.** It bounds a child at 60 s and was already raised once for load; it is the clearest genuine timing dependency in the group. `[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/lineage-timestamp-window.vitest.ts:128]` (iteration 2)
- **Treating "it spawns children" as a reason to stay serial.** Parallel workers spawn children normally; only an upper bound on the child's duration is threatened by load, and three of the six files have none. (iteration 2)
- No record exists of *which* files failed when every file ran in parallel, so the current twelve-file set cannot be justified file by file from the packet. The blanket set was a precaution taken before the per-file evidence existed. `[SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:83]` (iteration 2)
- **Blaming one pathological import graph.** The largest graph is 747 KB over 38 modules, and the median file is 46 KB, so there is no outlier to fix. (iteration 3)
- **Cutting import time as a wall-clock lever.** At 18 workers the summed figure is a small fraction of the lane's wall; the critical path is the heavy tail. `[SOURCE: measured: os.availableParallelism() = 18]` (iteration 3)
- **Raising `maxWorkers`.** It is already unbounded and resolves to the core count; raising it past 18 would oversubscribe a machine that also runs child processes. (iteration 3)
- **Turning on `isolate: false` to make imports free.** It would cut the summed import figure but share module state across 129 files, which trades a measured metric for unmeasured flakiness and changes what each test proves. (iteration 3)
- No per-file timing exists for the core lane in the packet, so finding 5 rests on the pre-cut profile's three numbers plus worker arithmetic rather than a current measurement. (iteration 3)
- **Blaming fsync for the ledger tests' time.** The fsync is one `appendFileSync` per event; the double process and the 79-module load happen once per invocation and dominate a short test. (iteration 4)
- **Enabling `singleWriterReadCache` in the gateway.** One append per process plus a nulled memo on append leaves nothing to reuse. `[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:516]` (iteration 4)
- **Extending the cache across appends.** A memo that survives an append would let a reader return a head another writer already advanced, which is the durability contract the ledger exists to enforce. (iteration 4)
- **Treating the caching idea as unbuilt work.** It is built, has its own test, and is enabled where a process reads repeatedly. (iteration 4)
- No compiled `dist/` exists for the deep-loop runtime, so there is no cheap alternative to tsx loading today; building one is a packaging change, not a test change, and is out of this packet's scope. (iteration 4)
- **A CI shard matrix as the first move.** Both jobs already fit inside their timeouts, and sharding multiplies setup and build cost before any file gets faster. (iteration 5)
- **Optimising for the 18-core Mac.** The measured machine is not the machine that gates merges; a cut that only pays at 18 workers is a local convenience. (iteration 5)
- **Treating summed import work as the small-runner lever.** It becomes material only below a handful of cores, and the serial group dominates before that point. (iteration 5)
- No CI timing history is checked in, so the `ubuntu-latest` wall for either suite is unknown; the four-worker proxy is the only way to estimate it from this repository. (iteration 5)
- **`describe.concurrent` inside one file.** The tests share one sandbox by construction, so concurrency inside the file would make the shared baseline the assertion. (iteration 6)
- **Cutting individual heavy tests.** The top ten are 36% of the calls, so even removing them entirely would not halve the file, and removing tests is out of scope. (iteration 6)
- **Raising the 180 s per-test timeouts.** No test is timing out; the file is slow in aggregate, not blocked on a cap. (iteration 6)
- **Trimming the sandbox copy to fund more shards.** At 35.8 MB the copy is affordable once per shard; the cost that multiplies is small next to the work it parallelises. (iteration 6)
- The file's own per-test timing still does not exist in the packet, so the split between process chains and resets in finding 4 is inferred from counts rather than measured seconds. (iteration 6)
- **Renaming the file to a glob match.** It would break the loud-failure guarantee that the exact path provides. (iteration 7)
- **Sharding the cli lane in parallel with native `--shard`.** It would leave the heavy file whole and, per the existing runner's header, risks harness-owned failures from shared temp roots. (iteration 7)
- **Using `npm run test:sharded` for the cli lane.** It shards by file and runs shards serially, so it neither splits the heavy file nor shortens the lane's critical path. (iteration 7)
- No Vitest option splits one file's tests across workers; `describe.concurrent` is the only test-level concurrency, and iteration 6 ruled it out because the tests share a sandbox. (iteration 7)
- **`describe.concurrent` inside the file.** It would run 171 tests at once inside one worker against shared temp-dir bookkeeping, which is more concurrency than the file was written for and gains nothing over separate files. (iteration 8)
- **Moving the file without splitting it.** It would shorten the serial group but leave a 157 s block on one worker, which caps the suite's floor. (iteration 8)
- **Splitting fanout-run without moving it to the parallel project.** The serial project runs one file at a time, so four files would take the same wall time as one. (iteration 8)
- No per-describe timing exists, so the four-way split's balance is inferred from test counts rather than measured seconds. (iteration 8)
- **Claiming a saving from a summed metric.** Iterations 1 and 3 showed import is a sum over files, so the wall is the only number that proves a cut. (iteration 9)
- **Measuring under load.** The packet already recorded a false failure from a run under load; the baseline has to be quiet. (iteration 9)
- **One run as proof.** The packet's own three-run spread is 1.4%, so a single before/after pair cannot separate a real saving from noise without the 10% floor. (iteration 9)
- No CI wall-clock history exists, so the four-worker check is a proxy for `ubuntu-latest` rather than the real thing; a follow-up could record the first CI run's timing as the real baseline. (iteration 9)
- **Adding a third cut to the set.** Import sums and ledger caching are both off the critical path, and no other candidate survived eight iterations of checks. (iteration 10)
- **Presenting the totals as measured.** They are estimates built from measured baselines, and the protocol exists because that distinction matters. (iteration 10)
- **Reordering the cuts.** Cut A is smaller but cheaper to prove; Cut B is larger but needs a harness extraction. Either order works; Cut A first costs less if the operator stops after one. (iteration 10)
- No measurement can be taken inside this lineage's write surface, so the estimates cannot be upgraded to measurements here. (iteration 10)

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
