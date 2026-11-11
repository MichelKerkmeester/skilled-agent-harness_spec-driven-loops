# Iteration 6: Smaller CI runner concurrency

## Focus
How do worker count and file parallelism affect elapsed time on smaller CI runners, and what runner-specific measurements should guide any concurrency change?

## Actions Taken
1. Read the CI jobs that run the spec-kit and deep-loop Vitest suites, including runner labels, commands, and timeouts.
2. Checked both Vitest configs and the test setup/helper paths for file parallelism, worker caps, per-file temporary databases, and resource measurements.
3. Compared the CI topology with the packet’s 18-core Mac timing reports and the fixed serial-group duration.

## Findings
1. The relevant CI jobs use the ubuntu-latest runner label, while their workflow commands do not pass a worker cap; the inspected Vitest configs enable file parallelism but do not pin maxWorkers or maxThreads. The workflow files therefore do not record the effective CPU or worker count for a run. [SOURCE: .github/workflows/spec-kit-check.yml:93] [SOURCE: .github/workflows/spec-kit-check.yml:170] [SOURCE: .github/workflows/deep-loop-runtime.yml:41] [SOURCE: .github/workflows/deep-loop-runtime.yml:74] [SOURCE: .skilled/skills/system-deep-loop/runtime/vitest.config.ts:37] [SOURCE: .skilled/skills/system-deep-loop/runtime/vitest.config.ts:47] [SOURCE: .skilled/skills/system-spec-kit/runtime/vitest.config.ts:27]
2. The reported deep-loop run spends about 265 seconds in its serial group out of 504-511 seconds total, or roughly 52-53%. Even if the remaining parallel portion were eliminated, that split puts an approximate 1.9x upper bound on file-parallelism speedup for that measured run; raising worker count cannot shorten the serial 12-file group. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:145] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:156] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:158] [INFERENCE: 265 seconds divided by the reported 504-511 second total]
3. The parallel groups create per-file worker processes and scratch databases; deep-loop tests also create per-file scratch database roots, and the config notes heavy tests slow down when they share the disk. On a smaller runner, more workers can therefore trade CPU parallelism against disk contention, worker startup, and timing-test noise; the source does not show a linear gain. [SOURCE: .skilled/skills/system-spec-kit/runtime/vitest.config.ts:27] [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts:55] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/helpers/spawn-cjs.ts:15] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/helpers/spawn-cjs.ts:31] [SOURCE: .skilled/skills/system-deep-loop/runtime/vitest.config.ts:10] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/plan.md:83]
4. No small-runner timing is recorded: all packet timings are from one 18-core Mac. Before changing worker count, capture the actual CI runner’s available processors, memory, OS/Node/Vitest versions, then compare the exact CI commands at fixed caps such as 1, 2, 4, and default across repeated runs. Keep file lists and assertion counts fixed; record lane and per-file wall time, CPU/RSS, temp-database and lock contention, timeouts, and failures. Use the median and spread to choose a setting; keep the timing-sensitive serial group unchanged unless separate evidence proves a safe split. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:156] [SOURCE: .github/workflows/spec-kit-check.yml:97] [SOURCE: .github/workflows/deep-loop-runtime.yml:45] [INFERENCE: based on the worker and isolation topology in the cited configs]

## Questions Answered
- File parallelism can only accelerate the parallel groups; the twelve-file serial group is a fixed floor in the reported deep-loop split. Smaller-runner worker settings must be measured on the actual CI environment because the workflows do not pin or record worker capacity.

## Questions Remaining
- No timing result from a smaller runner is available, so the best worker cap and expected savings remain unknown.
- The packet’s 18-core timings do not establish whether the current ubuntu-latest jobs are CPU-bound, disk-bound, or constrained by worker startup.

## Next Focus
- Summarize the measured and source-backed findings, preserving the unmeasured runner-specific and phase-level questions as explicit limits.

## Ruled Out
- Treating the 18-core Mac timings as a measurement of the current ubuntu-latest CI jobs.
- Increasing worker count as a way to reduce the serial 12-file group.
- Choosing a maxWorkers value from runner-label assumptions without capturing the actual runner resources.

## Dead Ends
- The workflow runner label and current source files do not contain a CPU-count measurement or worker-count benchmark.

## Edge Cases
- Ambiguous input: interpreted smaller CI runners as the ubuntu-latest jobs in the spec-kit and deep-loop workflows; the exact provisioned CPU/memory is not fixed in these YAML files.
- Contradictory evidence: none.
- Missing dependencies: no small-runner benchmark or per-worker telemetry is present in the packet.
- Partial success: established the scheduling bounds and a measurement plan, but did not run CI or claim a small-runner speed result.

## Sources Consulted
- .github/workflows/spec-kit-check.yml:93-98,143-176
- .github/workflows/deep-loop-runtime.yml:41-46,74-75
- .skilled/skills/system-deep-loop/runtime/vitest.config.ts:10-22,37-59
- .skilled/skills/system-deep-loop/runtime/tests/helpers/spawn-cjs.ts:15-41
- .skilled/skills/system-spec-kit/runtime/vitest.config.ts:24-34
- .skilled/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts:55-68
- specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:145-158
- specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/plan.md:78-83
- specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/research/lineages/luna-max/steer.md (checked; absent)

## Assessment
- New information ratio: 0.88 (three findings add CI worker/resource topology and the fixed serial fraction; the measurement matrix is a derived recommendation).
- Questions addressed: How do worker count and file parallelism affect elapsed time on smaller CI runners, and what runner-specific measurements should guide any concurrency change?
- Questions answered: How do worker count and file parallelism affect elapsed time on smaller CI runners, and what runner-specific measurements should guide any concurrency change?
- The small-runner effect was not measured in this lineage.

## Reflection
- What worked and why: reading the workflow commands beside the Vitest configs showed that the current CI runner label is not a resource measurement and the file-parallelism settings leave worker count to defaults.
- What did not work and why: the packet contains no runner-side timing or CPU/IO profile, so no worker cap can be selected responsibly from its Mac measurements.
- What I would do differently: add runner resource and per-lane telemetry to a controlled benchmark and compare a small worker-cap matrix without changing the collected files or assertions.
- durationMs records elapsed wall time since the previous iteration gateway append, including reducer and orchestration time.

## Recommended Next Focus
- Synthesis: consolidate the six iteration findings, the five question outcomes, and the measurement work that remains unverified.
