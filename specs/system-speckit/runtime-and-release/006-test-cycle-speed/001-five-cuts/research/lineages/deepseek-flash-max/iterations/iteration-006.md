# Iteration 6: Whether upgrade-legacy's cost is spread across its 65 tests or concentrated

## Focus

The last open question is the cli lane's `upgrade-legacy` file, which sets that lane's time at about 400 s. Iteration 1 mapped its structure but could not say whether the seconds sit in a few heavy tests or spread evenly. That distinction decides the whole recommendation: a concentrated cost is cut test by test, a spread cost is cut by sharding the file.

## Actions Taken

1. Parsed the test file into its 65 `it` blocks and counted, per test, the process-shaped calls it makes: `runUpgrade`, `validate`, `validateJson`, direct `git` execs, `commitChanges`, `manifest` hashes, and the two heavy fixtures.
2. Ranked the tests by that count and measured the top-ten share of the total.
3. Counted the tests that make no process call at all.
4. Combined that distribution with the sandbox reset count from iteration 1 to size the two cost components.

## Findings

1. The work is spread, not concentrated: 65 tests make 105 process-shaped calls between them, and the ten heaviest tests account for only 36% of those calls. Nine tests make none at all. `[SOURCE: measured: static per-test count over .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts → 65 tests, 105 calls, top-10 share 36%, 9 tests with zero]`
2. The heaviest single test is `dirty-tree-writes-manifest` with six calls (two spawns and four git operations), followed by `stale-manifest-head-refuses-apply` with six (three spawns, two git operations and the dirty-manifest fixture). No test dominates the file. `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:1004]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:1394]`
3. Each of those 105 calls is not one process but a chain: `node upgrade-legacy.mjs`, then `bash validate.sh` per packet in scope, then two node processes per validation. At one to three packets per call that is roughly four to ten processes per call, or several hundred processes for the file. `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:951]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:405]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:421]`
4. The second cost component is the reset, paid 58 times because three of five describes reset after every test: `git reset --hard` over a 3115-file repository, six path removals, and a `utimesSync` pass over 734 `dist` files. That is a smaller share than the process chains but not a rounding error. `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:90]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:132]` `[SOURCE: measured: 734 files under a dist path]`
5. Because both components scale with the number of tests rather than with a few heavy ones, sharding divides them both: N shards, each with its own sandbox, put roughly 1/N of the calls and 1/N of the resets on each worker, and the only new cost is N sandbox copies instead of one. `[INFERENCE: from findings 1-4 and the 35.8 MB copy measured in iteration 1]`
6. The estimated result is about 400 s down to roughly 100-140 s at four shards, dominated by the per-shard `beforeAll` copy plus a quarter of the test work. That is an estimate and the file's own profile is still the missing evidence; the four-shard figure must be measured before it is claimed. `[INFERENCE: from findings 1-5]`

## Ruled Out

- **Cutting individual heavy tests.** The top ten are 36% of the calls, so even removing them entirely would not halve the file, and removing tests is out of scope.
- **Trimming the sandbox copy to fund more shards.** At 35.8 MB the copy is affordable once per shard; the cost that multiplies is small next to the work it parallelises.
- **`describe.concurrent` inside one file.** The tests share one sandbox by construction, so concurrency inside the file would make the shared baseline the assertion.
- **Raising the 180 s per-test timeouts.** No test is timing out; the file is slow in aggregate, not blocked on a cap.

## Dead Ends

- The file's own per-test timing still does not exist in the packet, so the split between process chains and resets in finding 4 is inferred from counts rather than measured seconds.

## Edge Cases

- Ambiguous input: "can it be cut" was read as "without removing an assertion", which rules out test deletion and points at restructuring only.
- Contradictory evidence: none.
- Missing dependencies: the per-test profile.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:90`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:132`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:1004`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:1394`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:951`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:405`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:421`
- measured: static per-test call count → 65 tests, 105 calls, top-10 share 36%, 9 tests with zero calls
- measured: 734 files under a `dist` path; 35.8 MB / 3115 files in the copy (iteration 1)

## Assessment

- New information ratio: 0.88
- Questions addressed: Q2 (what sets the cli lane's time, and can it be cut without dropping assertions)
- Questions answered: Q2

## Reflection

- What worked and why: counting process-shaped calls per test answered a question that reading the file could not, because the file is uniform in shape and only the counts differ. A 36% top-ten share is a decisive answer to "concentrated or spread".
- What did not work and why: the count treats every spawn as equal, so it cannot split seconds between a `runUpgrade` chain and a `git` call. The estimate in finding 6 carries that error bar.
- What I would do differently: instrument one test per describe block with a timer before estimating, because two or three measured tests would calibrate the whole model.

## Recommended Next Focus

All five key questions are now answered, so the next pass should test the two headline recommendations against the strongest objection available: whether the sharding estimates survive contact with the actual per-file profile, and whether any of the three findings that rest on arithmetic (iterations 3, 5 and 6) contradicts another. If nothing new survives, the run is converged.

## Questions Answered

- What sets the time of the cli lane's tests/upgrade-legacy.vitest.ts, and can it be cut without dropping assertions?

## Questions Remaining

- None of the five key questions remains open.
