---
title: "Deep Research Strategy - Skilled test cycle speed after the five cuts"
description: "Session tracking for the deepseek-flash-max fan-out lineage investigating what makes the Skilled test cycle faster after cuts 1-5."
trigger_phrases:
  - "test cycle speed research strategy"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy

## 1. OVERVIEW

### Purpose
Persistent brain for this lineage. Records what to investigate, what worked, what failed, and where to focus next. Read at every iteration.

### Usage
- Init populated Topic, Key Questions, Known Context and Research Boundaries.
- Per iteration: the agent reads Next Focus, writes iteration evidence, and the reducer refreshes machine-owned sections.
- Mutability: analyst-owned sections stay stable; machine-owned sections are rewritten by the reducer after each iteration.

---

## 2. TOPIC
How can the Skilled test cycle get faster after the five cuts already built? Measured state on an 18-core Mac: the system-deep-loop suite takes 504-511 s (161 files in parallel, then 12 timing-sensitive files serially, about 265 s: tests/stress/**, tests/lifecycle/**, unit/fanout-run, unit/lineage-timestamp-window, integration/deep-research-postflip-fanout). The system-spec-kit npm test takes 841-911 s: the core lane 348-399 s (about 300 s of it is import time), the cli lane about 400 s set by tests/upgrade-legacy.vitest.ts alone, and validation about 90 s. Open items: (1) the cli lane's upgrade-legacy file sets its time; (2) the 12 serial deep-loop files; (3) the 300 s import time in the spec-kit core lane; (4) ledger read caching ideas in production code (singleWriterReadCache, gateway rescans) that change runtime behavior; (5) a smaller CI runner gains less from parallel files. Prioritize changes that keep every assertion, measure before claiming and avoid overengineering.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which of the 12 serial deep-loop files actually need serial execution, and what would shrink that group?
- [x] What sets the time of the cli lane's tests/upgrade-legacy.vitest.ts, and can it be cut without dropping assertions?
- [x] Where do the roughly 300 s of import time in the spec-kit core lane come from, and which parts can be cut?
- [x] Do the ledger read-caching ideas (singleWriterReadCache, gateway rescans) buy measurable time, and what runtime risk do they carry?
- [x] Which remaining cuts still pay off on a smaller CI runner, and how should each be measured before it is claimed as a win?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Deleting or weakening tests to buy speed; every assertion stays.
- Implementing any cut. This lineage produces findings and a ranked recommendation only.
- Changes to CI workflow files.
- Reworking the five cuts already built, unless a measurement shows one of them is wrong.
- Broad refactors of the ledger or gateway beyond what a measured timing win justifies.

---

## 5. STOP CONDITIONS
- Convergence: newInfoRatio below 0.05 at or after the minimum iteration count.
- Hard stop at maxIterations (10).
- A finding that requires changing runtime behavior is recorded, never implemented.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which of the 12 serial deep-loop files actually need serial execution, and what would shrink that group?
- What sets the time of the cli lane's tests/upgrade-legacy.vitest.ts, and can it be cut without dropping assertions?
- Where do the roughly 300 s of import time in the spec-kit core lane come from, and which parts can be cut?
- Do the ledger read-caching ideas (singleWriterReadCache, gateway rescans) buy measurable time, and what runtime risk do they carry?
- Which remaining cuts still pay off on a smaller CI runner, and how should each be measured before it is claimed as a win?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- following one `runUpgrade` call all the way into `validate.sh` turned an opaque "400 s file" into a countable process chain. Counting call sites before reading bodies kept the read budget small and made the structural claim checkable. (iteration 1)
- grepping for upper bounds rather than reading all twelve bodies separated "spawns a child" from "asserts how long the child may take". Only the second kind is threatened by load, and the distinction collapsed a twelve-file precaution into two defensible moves. (iteration 2)
- dividing a summed metric by the worker count is what turned "import is the largest share" into a small wall-clock contribution. The same arithmetic pointed at the three named heavy files as the real floor. (iteration 3)
- reading where the memo is invalidated answered the question in one function. A cache that is dropped on every write cannot serve a write-per-process path, and that is a code fact rather than an argument. (iteration 4)
- reading the CI job before ranking anything turned "a smaller runner gains less" from an assumption into an arithmetic question about the lane's actual parallel efficiency. The efficiency figure then decided the ranking. (iteration 5)
- counting process-shaped calls per test answered a question that reading the file could not, because the file is uniform in shape and only the counts differ. A 36% top-ten share is a decisive answer to "concentrated or spread". (iteration 6)
- grepping for the literal filename produced the whole change surface in one call, including the exclude line that would silently double the work if missed. (iteration 7)
- counting hooks and mutation patterns is the cheapest test of order-dependence, and one `afterEach` over two cleanup arrays is about as clean as a 5925-line file can be. That turned a 157 s block into a divisible one. (iteration 8)
- reusing the packet's own proof shape — a file count plus a wall time — keeps the protocol compatible with the evidence the operator already trusts, and it caught that cut B needs two counts rather than one. (iteration 9)
- one subtraction — suite minus serial group — turned the last assumption into a comparison of two numbers, and 157 against 239 is not close. (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- looking for a checked-in timing profile found nothing, so the per-test split of the 400 s is still inferred rather than measured. No arithmetic over process counts can substitute for that profile. (iteration 1)
- the 265 s figure cannot be split per file from the packet, so the saving is arithmetic over one known number rather than a measured sum. (iteration 2)
- the static walk can size graphs but cannot time module evaluation, so finding 2 bounds the transform work without measuring it. (iteration 3)
- the packet's framing implied the caching was unbuilt, so the first read was aimed at a feature that already exists. Reading the option's default and its one caller corrected the premise. (iteration 4)
- without a CI timing history the four-core prediction stays an inference, and the packet's inconsistent import numbers widen the range instead of narrowing it. (iteration 5)
- the count treats every spawn as equal, so it cannot split seconds between a `runUpgrade` chain and a `git` call. The estimate in finding 6 carries that error bar. (iteration 6)
- the existing sharded runner looked like it might solve the problem outright, and only reading its header showed that it shards by file and runs serially by design. (iteration 7)
- test counts are not seconds, so the four-way balance is a guess about which describes are slow. (iteration 8)
- the protocol cannot supply the missing per-file baseline; it only says how to take one. (iteration 9)
- the totals remain estimates because the per-file baseline was never available inside this run's write surface. (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`describe.concurrent` inside one file.** The tests share one sandbox by construction, so concurrency inside the file would make the shared baseline the assertion. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **`describe.concurrent` inside one file.** The tests share one sandbox by construction, so concurrency inside the file would make the shared baseline the assertion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`describe.concurrent` inside one file.** The tests share one sandbox by construction, so concurrency inside the file would make the shared baseline the assertion.

### **`describe.concurrent` inside the file.** It would run 171 tests at once inside one worker against shared temp-dir bookkeeping, which is more concurrency than the file was written for and gains nothing over separate files. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **`describe.concurrent` inside the file.** It would run 171 tests at once inside one worker against shared temp-dir bookkeeping, which is more concurrency than the file was written for and gains nothing over separate files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`describe.concurrent` inside the file.** It would run 171 tests at once inside one worker against shared temp-dir bookkeeping, which is more concurrency than the file was written for and gains nothing over separate files.

### **A CI shard matrix as the first move.** Both jobs already fit inside their timeouts, and sharding multiplies setup and build cost before any file gets faster. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A CI shard matrix as the first move.** Both jobs already fit inside their timeouts, and sharding multiplies setup and build cost before any file gets faster.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A CI shard matrix as the first move.** Both jobs already fit inside their timeouts, and sharding multiplies setup and build cost before any file gets faster.

### **Adding a third cut to the set.** Import sums and ledger caching are both off the critical path, and no other candidate survived eight iterations of checks. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Adding a third cut to the set.** Import sums and ledger caching are both off the critical path, and no other candidate survived eight iterations of checks.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Adding a third cut to the set.** Import sums and ledger caching are both off the critical path, and no other candidate survived eight iterations of checks.

### **Blaming fsync for the ledger tests' time.** The fsync is one `appendFileSync` per event; the double process and the 79-module load happen once per invocation and dominate a short test. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Blaming fsync for the ledger tests' time.** The fsync is one `appendFileSync` per event; the double process and the 79-module load happen once per invocation and dominate a short test.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Blaming fsync for the ledger tests' time.** The fsync is one `appendFileSync` per event; the double process and the 79-module load happen once per invocation and dominate a short test.

### **Blaming one pathological import graph.** The largest graph is 747 KB over 38 modules, and the median file is 46 KB, so there is no outlier to fix. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Blaming one pathological import graph.** The largest graph is 747 KB over 38 modules, and the median file is 46 KB, so there is no outlier to fix.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Blaming one pathological import graph.** The largest graph is 747 KB over 38 modules, and the median file is 46 KB, so there is no outlier to fix.

### **Claiming a saving from a summed metric.** Iterations 1 and 3 showed import is a sum over files, so the wall is the only number that proves a cut. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Claiming a saving from a summed metric.** Iterations 1 and 3 showed import is a sum over files, so the wall is the only number that proves a cut.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Claiming a saving from a summed metric.** Iterations 1 and 3 showed import is a sum over files, so the wall is the only number that proves a cut.

### **Cutting import time as a wall-clock lever.** At 18 workers the summed figure is a small fraction of the lane's wall; the critical path is the heavy tail. `[SOURCE: measured: os.availableParallelism() = 18]` -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Cutting import time as a wall-clock lever.** At 18 workers the summed figure is a small fraction of the lane's wall; the critical path is the heavy tail. `[SOURCE: measured: os.availableParallelism() = 18]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Cutting import time as a wall-clock lever.** At 18 workers the summed figure is a small fraction of the lane's wall; the critical path is the heavy tail. `[SOURCE: measured: os.availableParallelism() = 18]`

### **Cutting individual heavy tests.** The top ten are 36% of the calls, so even removing them entirely would not halve the file, and removing tests is out of scope. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Cutting individual heavy tests.** The top ten are 36% of the calls, so even removing them entirely would not halve the file, and removing tests is out of scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Cutting individual heavy tests.** The top ten are 36% of the calls, so even removing them entirely would not halve the file, and removing tests is out of scope.

### **Cutting node startup.** Measured at 0.020 s per start, so even eliminating every spawn saves seconds, not minutes. `[SOURCE: measured: /usr/bin/time -p node -e ""]` -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Cutting node startup.** Measured at 0.020 s per start, so even eliminating every spawn saves seconds, not minutes. `[SOURCE: measured: /usr/bin/time -p node -e ""]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Cutting node startup.** Measured at 0.020 s per start, so even eliminating every spawn saves seconds, not minutes. `[SOURCE: measured: /usr/bin/time -p node -e ""]`

### **Enabling `singleWriterReadCache` in the gateway.** One append per process plus a nulled memo on append leaves nothing to reuse. `[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:516]` -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Enabling `singleWriterReadCache` in the gateway.** One append per process plus a nulled memo on append leaves nothing to reuse. `[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:516]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Enabling `singleWriterReadCache` in the gateway.** One append per process plus a nulled memo on append leaves nothing to reuse. `[SOURCE: .skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:516]`

### **Extending the cache across appends.** A memo that survives an append would let a reader return a head another writer already advanced, which is the durability contract the ledger exists to enforce. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Extending the cache across appends.** A memo that survives an append would let a reader return a head another writer already advanced, which is the durability contract the ledger exists to enforce.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Extending the cache across appends.** A memo that survives an append would let a reader return a head another writer already advanced, which is the durability contract the ledger exists to enforce.

### **Measuring under load.** The packet already recorded a false failure from a run under load; the baseline has to be quiet. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Measuring under load.** The packet already recorded a false failure from a run under load; the baseline has to be quiet.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Measuring under load.** The packet already recorded a false failure from a run under load; the baseline has to be quiet.

### **Merging `validate.sh`'s freshness check into the orchestrator.** It would save one 20 ms process per validation while changing a guard that fails closed on a stale build; not worth the risk for seconds. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Merging `validate.sh`'s freshness check into the orchestrator.** It would save one 20 ms process per validation while changing a guard that fails closed on a stale build; not worth the risk for seconds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Merging `validate.sh`'s freshness check into the orchestrator.** It would save one 20 ms process per validation while changing a guard that fails closed on a stale build; not worth the risk for seconds.

### **Merging the seven 7-line stress wrappers into one file.** It would change which `describe` a failure is reported under and save no measurable time; the wrappers are cheap. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Merging the seven 7-line stress wrappers into one file.** It would change which `describe` a failure is reported under and save no measurable time; the wrappers are cheap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Merging the seven 7-line stress wrappers into one file.** It would change which `describe` a failure is reported under and save no measurable time; the wrappers are cheap.

### **Moving the file without splitting it.** It would shorten the serial group but leave a 157 s block on one worker, which caps the suite's floor. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Moving the file without splitting it.** It would shorten the serial group but leave a 157 s block on one worker, which caps the suite's floor.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Moving the file without splitting it.** It would shorten the serial group but leave a 157 s block on one worker, which caps the suite's floor.

### **One run as proof.** The packet's own three-run spread is 1.4%, so a single before/after pair cannot separate a real saving from noise without the 10% floor. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **One run as proof.** The packet's own three-run spread is 1.4%, so a single before/after pair cannot separate a real saving from noise without the 10% floor.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **One run as proof.** The packet's own three-run spread is 1.4%, so a single before/after pair cannot separate a real saving from noise without the 10% floor.

### **Optimising for the 18-core Mac.** The measured machine is not the machine that gates merges; a cut that only pays at 18 workers is a local convenience. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Optimising for the 18-core Mac.** The measured machine is not the machine that gates merges; a cut that only pays at 18 workers is a local convenience.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Optimising for the 18-core Mac.** The measured machine is not the machine that gates merges; a cut that only pays at 18 workers is a local convenience.

### **Presenting the totals as measured.** They are estimates built from measured baselines, and the protocol exists because that distinction matters. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Presenting the totals as measured.** They are estimates built from measured baselines, and the protocol exists because that distinction matters.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Presenting the totals as measured.** They are estimates built from measured baselines, and the protocol exists because that distinction matters.

### **Raising `maxWorkers`.** It is already unbounded and resolves to the core count; raising it past 18 would oversubscribe a machine that also runs child processes. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Raising `maxWorkers`.** It is already unbounded and resolves to the core count; raising it past 18 would oversubscribe a machine that also runs child processes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Raising `maxWorkers`.** It is already unbounded and resolves to the core count; raising it past 18 would oversubscribe a machine that also runs child processes.

### **Raising the 180 s per-test timeouts.** No test is timing out; the file is slow in aggregate, not blocked on a cap. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Raising the 180 s per-test timeouts.** No test is timing out; the file is slow in aggregate, not blocked on a cap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Raising the 180 s per-test timeouts.** No test is timing out; the file is slow in aggregate, not blocked on a cap.

### **Removing `db-open-close` from the serial set.** Its second test exists to make two writers contend for one lock; parallel neighbours would make the race uncontrolled rather than asserted. `[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/lifecycle/db-open-close.vitest.ts:70]` -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Removing `db-open-close` from the serial set.** Its second test exists to make two writers contend for one lock; parallel neighbours would make the race uncontrolled rather than asserted. `[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/lifecycle/db-open-close.vitest.ts:70]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Removing `db-open-close` from the serial set.** Its second test exists to make two writers contend for one lock; parallel neighbours would make the race uncontrolled rather than asserted. `[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/lifecycle/db-open-close.vitest.ts:70]`

### **Removing `lineage-timestamp-window` from the serial set.** It bounds a child at 60 s and was already raised once for load; it is the clearest genuine timing dependency in the group. `[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/lineage-timestamp-window.vitest.ts:128]` -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Removing `lineage-timestamp-window` from the serial set.** It bounds a child at 60 s and was already raised once for load; it is the clearest genuine timing dependency in the group. `[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/lineage-timestamp-window.vitest.ts:128]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Removing `lineage-timestamp-window` from the serial set.** It bounds a child at 60 s and was already raised once for load; it is the clearest genuine timing dependency in the group. `[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/lineage-timestamp-window.vitest.ts:128]`

### **Removing the second validation pass.** It is the proof that a repair worked; removing it would drop an assertion the file exists to make. `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:1190]` -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Removing the second validation pass.** It is the proof that a repair worked; removing it would drop an assertion the file exists to make. `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:1190]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Removing the second validation pass.** It is the proof that a repair worked; removing it would drop an assertion the file exists to make. `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:1190]`

### **Renaming the file to a glob match.** It would break the loud-failure guarantee that the exact path provides. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Renaming the file to a glob match.** It would break the loud-failure guarantee that the exact path provides.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Renaming the file to a glob match.** It would break the loud-failure guarantee that the exact path provides.

### **Reordering the cuts.** Cut A is smaller but cheaper to prove; Cut B is larger but needs a harness extraction. Either order works; Cut A first costs less if the operator stops after one. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Reordering the cuts.** Cut A is smaller but cheaper to prove; Cut B is larger but needs a harness extraction. Either order works; Cut A first costs less if the operator stops after one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reordering the cuts.** Cut A is smaller but cheaper to prove; Cut B is larger but needs a harness extraction. Either order works; Cut A first costs less if the operator stops after one.

### **Sharding the cli lane in parallel with native `--shard`.** It would leave the heavy file whole and, per the existing runner's header, risks harness-owned failures from shared temp roots. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Sharding the cli lane in parallel with native `--shard`.** It would leave the heavy file whole and, per the existing runner's header, risks harness-owned failures from shared temp roots.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Sharding the cli lane in parallel with native `--shard`.** It would leave the heavy file whole and, per the existing runner's header, risks harness-owned failures from shared temp roots.

### **Shrinking the sandbox copy.** The payload is 35.8 MB of 3115 files, paid once in `beforeAll`, so it cannot explain a 400 s file. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Shrinking the sandbox copy.** The payload is 35.8 MB of 3115 files, paid once in `beforeAll`, so it cannot explain a 400 s file.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Shrinking the sandbox copy.** The payload is 35.8 MB of 3115 files, paid once in `beforeAll`, so it cannot explain a 400 s file.

### **Splitting fanout-run without moving it to the parallel project.** The serial project runs one file at a time, so four files would take the same wall time as one. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Splitting fanout-run without moving it to the parallel project.** The serial project runs one file at a time, so four files would take the same wall time as one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Splitting fanout-run without moving it to the parallel project.** The serial project runs one file at a time, so four files would take the same wall time as one.

### **Treating "it spawns children" as a reason to stay serial.** Parallel workers spawn children normally; only an upper bound on the child's duration is threatened by load, and three of the six files have none. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Treating "it spawns children" as a reason to stay serial.** Parallel workers spawn children normally; only an upper bound on the child's duration is threatened by load, and three of the six files have none.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating "it spawns children" as a reason to stay serial.** Parallel workers spawn children normally; only an upper bound on the child's duration is threatened by load, and three of the six files have none.

### **Treating summed import work as the small-runner lever.** It becomes material only below a handful of cores, and the serial group dominates before that point. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Treating summed import work as the small-runner lever.** It becomes material only below a handful of cores, and the serial group dominates before that point.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating summed import work as the small-runner lever.** It becomes material only below a handful of cores, and the serial group dominates before that point.

### **Treating the caching idea as unbuilt work.** It is built, has its own test, and is enabled where a process reads repeatedly. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Treating the caching idea as unbuilt work.** It is built, has its own test, and is enabled where a process reads repeatedly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the caching idea as unbuilt work.** It is built, has its own test, and is enabled where a process reads repeatedly.

### **Trimming the sandbox copy to fund more shards.** At 35.8 MB the copy is affordable once per shard; the cost that multiplies is small next to the work it parallelises. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Trimming the sandbox copy to fund more shards.** At 35.8 MB the copy is affordable once per shard; the cost that multiplies is small next to the work it parallelises.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Trimming the sandbox copy to fund more shards.** At 35.8 MB the copy is affordable once per shard; the cost that multiplies is small next to the work it parallelises.

### **Turning on `isolate: false` to make imports free.** It would cut the summed import figure but share module state across 129 files, which trades a measured metric for unmeasured flakiness and changes what each test proves. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Turning on `isolate: false` to make imports free.** It would cut the summed import figure but share module state across 129 files, which trades a measured metric for unmeasured flakiness and changes what each test proves.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Turning on `isolate: false` to make imports free.** It would cut the summed import figure but share module state across 129 files, which trades a measured metric for unmeasured flakiness and changes what each test proves.

### **Using `npm run test:sharded` for the cli lane.** It shards by file and runs shards serially, so it neither splits the heavy file nor shortens the lane's critical path. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Using `npm run test:sharded` for the cli lane.** It shards by file and runs shards serially, so it neither splits the heavy file nor shortens the lane's critical path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Using `npm run test:sharded` for the cli lane.** It shards by file and runs shards serially, so it neither splits the heavy file nor shortens the lane's critical path.

### No checked-in timing profile for the cli lane was found in the packet or the skill tree, so the per-test split of the 400 s is not yet known. A profile is the next evidence needed before any saving is claimed. `[SOURCE: fd -e json 'profile|timing|slow' .skilled/skills/system-deep-loop/runtime → no results]` -- BLOCKED (iteration 1, 1 attempts)
- What was tried: No checked-in timing profile for the cli lane was found in the packet or the skill tree, so the per-test split of the 400 s is not yet known. A profile is the next evidence needed before any saving is claimed. `[SOURCE: fd -e json 'profile|timing|slow' .skilled/skills/system-deep-loop/runtime → no results]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No checked-in timing profile for the cli lane was found in the packet or the skill tree, so the per-test split of the 400 s is not yet known. A profile is the next evidence needed before any saving is claimed. `[SOURCE: fd -e json 'profile|timing|slow' .skilled/skills/system-deep-loop/runtime → no results]`

### No CI timing history is checked in, so the `ubuntu-latest` wall for either suite is unknown; the four-worker proxy is the only way to estimate it from this repository. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: No CI timing history is checked in, so the `ubuntu-latest` wall for either suite is unknown; the four-worker proxy is the only way to estimate it from this repository.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No CI timing history is checked in, so the `ubuntu-latest` wall for either suite is unknown; the four-worker proxy is the only way to estimate it from this repository.

### No CI wall-clock history exists, so the four-worker check is a proxy for `ubuntu-latest` rather than the real thing; a follow-up could record the first CI run's timing as the real baseline. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: No CI wall-clock history exists, so the four-worker check is a proxy for `ubuntu-latest` rather than the real thing; a follow-up could record the first CI run's timing as the real baseline.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No CI wall-clock history exists, so the four-worker check is a proxy for `ubuntu-latest` rather than the real thing; a follow-up could record the first CI run's timing as the real baseline.

### No compiled `dist/` exists for the deep-loop runtime, so there is no cheap alternative to tsx loading today; building one is a packaging change, not a test change, and is out of this packet's scope. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No compiled `dist/` exists for the deep-loop runtime, so there is no cheap alternative to tsx loading today; building one is a packaging change, not a test change, and is out of this packet's scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No compiled `dist/` exists for the deep-loop runtime, so there is no cheap alternative to tsx loading today; building one is a packaging change, not a test change, and is out of this packet's scope.

### No measurement can be taken inside this lineage's write surface, so the estimates cannot be upgraded to measurements here. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: No measurement can be taken inside this lineage's write surface, so the estimates cannot be upgraded to measurements here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No measurement can be taken inside this lineage's write surface, so the estimates cannot be upgraded to measurements here.

### No per-describe timing exists, so the four-way split's balance is inferred from test counts rather than measured seconds. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: No per-describe timing exists, so the four-way split's balance is inferred from test counts rather than measured seconds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No per-describe timing exists, so the four-way split's balance is inferred from test counts rather than measured seconds.

### No per-file timing exists for the core lane in the packet, so finding 5 rests on the pre-cut profile's three numbers plus worker arithmetic rather than a current measurement. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No per-file timing exists for the core lane in the packet, so finding 5 rests on the pre-cut profile's three numbers plus worker arithmetic rather than a current measurement.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No per-file timing exists for the core lane in the packet, so finding 5 rests on the pre-cut profile's three numbers plus worker arithmetic rather than a current measurement.

### No record exists of *which* files failed when every file ran in parallel, so the current twelve-file set cannot be justified file by file from the packet. The blanket set was a precaution taken before the per-file evidence existed. `[SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:83]` -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No record exists of *which* files failed when every file ran in parallel, so the current twelve-file set cannot be justified file by file from the packet. The blanket set was a precaution taken before the per-file evidence existed. `[SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:83]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No record exists of *which* files failed when every file ran in parallel, so the current twelve-file set cannot be justified file by file from the packet. The blanket set was a precaution taken before the per-file evidence existed. `[SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:83]`

### No Vitest option splits one file's tests across workers; `describe.concurrent` is the only test-level concurrency, and iteration 6 ruled it out because the tests share a sandbox. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: No Vitest option splits one file's tests across workers; `describe.concurrent` is the only test-level concurrency, and iteration 6 ruled it out because the tests share a sandbox.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No Vitest option splits one file's tests across workers; `describe.concurrent` is the only test-level concurrency, and iteration 6 ruled it out because the tests share a sandbox.

### The file's own per-test timing still does not exist in the packet, so the split between process chains and resets in finding 4 is inferred from counts rather than measured seconds. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: The file's own per-test timing still does not exist in the packet, so the split between process chains and resets in finding 4 is inferred from counts rather than measured seconds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The file's own per-test timing still does not exist in the packet, so the split between process chains and resets in finding 4 is inferred from counts rather than measured seconds.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
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

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- 5 of 5 key questions remain open; Q2 is the one this iteration advanced. (iteration 1)
- 4 of 5 key questions remain open. (iteration 2)
- 3 of 5 key questions remain open. (iteration 3)
- 2 of 5 key questions remain open. (iteration 4)
- 1 of 5 key questions remains open (Q2, the cli lane's `upgrade-legacy` file). (iteration 5)
- None of the five key questions remains open. (iteration 6)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Packet `005-test-cycle-speed` is complete at Level 1 with all five cuts built and measured. Measured facts from the packet's own verification table:
- `system-deep-loop` suite: 173 files, 2873 tests, 504-511 s across three runs.
- `system-spec-kit` `npm test`: core lane 126 files, 348-399 s; cli lane 202 files / 2452 tests, 397-430 s; whole command 841-911 s.
- Validation about 90 s.
- Twelve deep-loop files run serially after the parallel group, about 265 s total.
- The cli lane's `upgrade-legacy` file takes about 400 s alone and sets that lane's time.
- Spec-kit core lane carries roughly 300 s of import time.
- Production-code ledger caching (`singleWriterReadCache`, gateway rescans) was proposed by read-only reviews and deliberately left out because it changes runtime behavior.

### Bounded Context Snapshot

- Source pointers: `.skilled/skills/system-spec-kit/runtime/vitest.config.ts`, `.skilled/skills/system-spec-kit/vitest.config.ts`, `.skilled/skills/system-deep-loop/runtime/vitest.config.ts`, `.skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs`, `.skilled/skills/system-spec-kit/runtime/scripts/run-cli-tests.sh`.
- Reuse candidates: the existing per-file coverage-database helper in `.skilled/skills/system-deep-loop/runtime/tests/helpers/spawn-cjs.ts`; the `test:council` second-step pattern in `package.json`.
- Integration points: the two Vitest project configs, the `npm test` runner script, and the test helper that isolates temp roots.
- Constraints and risks: timing numbers come from one 18-core Mac; any production-code change is out of scope for this lineage; a smaller CI runner gets less from file parallelism.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/research/inbox.jsonl`
- Question conflict owner: reducer registry
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-11-10T17:50:00Z
