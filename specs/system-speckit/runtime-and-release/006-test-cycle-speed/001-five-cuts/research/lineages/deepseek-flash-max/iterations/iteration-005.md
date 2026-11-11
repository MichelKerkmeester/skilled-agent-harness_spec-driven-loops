# Iteration 5: Which remaining cuts still pay on a smaller CI runner, and how to measure each

## Focus

Every saving found so far is a parallelism saving, and the packet's limitation 2 says a smaller CI runner gains less from parallel files. This iteration checked what CI actually runs on, then ranked the surviving cuts by whether they help on four cores as much as on eighteen, and named the measurement that would settle each one.

## Actions Taken

1. Listed the CI workflows and read the runner labels and job timeouts for both suites.
2. Read the spec-kit test job's steps, including how the `cli` lane is split in CI.
3. Compared the core lane's summed work with its measured wall time to estimate parallel efficiency.
4. Checked whether any config pins `maxWorkers`, to confirm a smaller-runner simulation is possible without a new machine.

## Findings

1. Both suites run on `ubuntu-latest`, not on a self-hosted runner: `spec-kit-check` has a 51-minute job timeout and `deep-loop-runtime` a 34-minute one, and neither declares a shard matrix. `[SOURCE: .github/workflows/spec-kit-check.yml:95]` `[SOURCE: .github/workflows/spec-kit-check.yml:98]` `[SOURCE: .github/workflows/deep-loop-runtime.yml:45]` `[SOURCE: .github/workflows/deep-loop-runtime.yml:47]`
2. CI already runs the `cli` lane the way `run-cli-tests.sh` does — `upgrade-legacy.vitest.ts` in one background process and every other cli file in a second, joined with `wait`. So splitting that file into shards is a test-file change inside the existing process, not a CI workflow change. `[SOURCE: .github/workflows/spec-kit-check.yml:148]` `[SOURCE: .github/workflows/spec-kit-check.yml:153]` `[SOURCE: .github/workflows/spec-kit-check.yml:155]`
3. The core lane's parallel efficiency is poor: its summed work is roughly 302 s of import plus its test time against a 348-399 s wall, which is about 1.3-1.4× even counting the test time generously, and close to 1.0× if the import figure and the wall belong to the same run. At that efficiency a four-core runner would cost about the same wall time, not more. This is an inference and needs one instrumented run, because iteration 3 found the packet's two import figures are not comparable. `[INFERENCE: from spec.md's 338 s import and implementation-summary's 302 s import, the 348-399 s core-lane wall, and the 18-worker default]`
4. The deep-loop suite's 265 s serial group is the one cost that is identical on eighteen cores and on four, because it never uses more than one worker. That makes shrinking it the highest-value cut for a smaller runner, and it is the same cut iteration 2 identified from the assertion side. `[SOURCE: .skilled/skills/system-deep-loop/runtime/vitest.config.ts:13]`
5. `--maxWorkers=4` is the cheap CI proxy. Neither config pins `maxWorkers`, and Vitest accepts it as a CLI flag, so one four-worker run on this Mac predicts the `ubuntu-latest` wall without provisioning a runner. `[SOURCE: .skilled/skills/system-spec-kit/runtime/vitest.config.ts:26]` `[SOURCE: .skilled/skills/system-deep-loop/runtime/vitest.config.ts:45]`
6. The ranking that follows is: first shrink the serial group, because it is core-count independent; second split the heavy files, because it shortens the critical path on every runner; third cut summed import work, which is worth about 17 s on eighteen cores and only becomes material when cores are scarce; fourth the ledger caching, which iteration 4 showed buys nothing on the append path. `[INFERENCE: from findings 1-5 and iteration 4's finding 4]`

## Ruled Out

- **A CI shard matrix as the first move.** Both jobs already fit inside their timeouts, and sharding multiplies setup and build cost before any file gets faster.
- **Optimising for the 18-core Mac.** The measured machine is not the machine that gates merges; a cut that only pays at 18 workers is a local convenience.
- **Treating summed import work as the small-runner lever.** It becomes material only below a handful of cores, and the serial group dominates before that point.

## Dead Ends

- No CI timing history is checked in, so the `ubuntu-latest` wall for either suite is unknown; the four-worker proxy is the only way to estimate it from this repository.

## Edge Cases

- Ambiguous input: "a smaller CI runner" was read as GitHub's `ubuntu-latest` default, because that is what both workflows name; a self-hosted runner would change the arithmetic.
- Contradictory evidence: none new. Finding 3 inherits iteration 3's warning that the packet's import numbers are not comparable, and states the range rather than one value.
- Missing dependencies: no CI wall-clock measurements.
- Partial success: none.

## Sources Consulted

- `.github/workflows/spec-kit-check.yml:95`
- `.github/workflows/spec-kit-check.yml:98`
- `.github/workflows/spec-kit-check.yml:148`
- `.github/workflows/spec-kit-check.yml:153`
- `.github/workflows/spec-kit-check.yml:155`
- `.github/workflows/deep-loop-runtime.yml:45`
- `.github/workflows/deep-loop-runtime.yml:47`
- `.skilled/skills/system-spec-kit/runtime/vitest.config.ts:26`
- `.skilled/skills/system-deep-loop/runtime/vitest.config.ts:13`
- `.skilled/skills/system-deep-loop/runtime/vitest.config.ts:45`
- `specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/spec.md:49`
- `specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:71`

## Assessment

- New information ratio: 0.92
- Questions addressed: Q5 (which cuts pay on a smaller runner, and how to measure them)
- Questions answered: Q5

## Reflection

- What worked and why: reading the CI job before ranking anything turned "a smaller runner gains less" from an assumption into an arithmetic question about the lane's actual parallel efficiency. The efficiency figure then decided the ranking.
- What did not work and why: without a CI timing history the four-core prediction stays an inference, and the packet's inconsistent import numbers widen the range instead of narrowing it.
- What I would do differently: run `--maxWorkers=4` on one lane early, because a single measured four-worker wall would replace findings 3 and 5 with evidence.

## Recommended Next Focus

Q2 is the only question left open, and it is the largest single block in either suite: `upgrade-legacy.vitest.ts` at about 400 s. The next iteration should settle whether its cost is spread across 65 tests or concentrated in a few, since that decides between sharding the file and cutting individual tests' work.

## Questions Answered

- Which remaining cuts still pay off on a smaller CI runner, and how should each be measured before it is claimed as a win?

## Questions Remaining

- 1 of 5 key questions remains open (Q2, the cli lane's `upgrade-legacy` file).
