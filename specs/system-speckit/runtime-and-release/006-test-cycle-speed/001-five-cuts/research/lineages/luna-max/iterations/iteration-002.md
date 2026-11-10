# Iteration 2: Upgrade-legacy timing attribution evidence

## Focus
Check whether existing packet evidence or runner instrumentation separates the upgrade-legacy file time into copy, reset, CLI subprocess, and validation costs. The strategy carried this measurement question forward because iteration 1 found the operations but no measured share for each.

## Actions Taken
1. Searched the parent plan, task list, implementation summary, and decision record for timing-profile evidence.
2. Read the runner timing wrapper, CLI lane shell runner, and upgrade-legacy fixture/process helpers at their cited lines.
3. Did not execute the test suite: the test uses os.tmpdir() for its sandbox and invokes git and validate.sh; this lineage is explicitly barred from test/validation execution and writes outside its own directory.

## Findings
1. The parent packet reports that upgrade-legacy sets the roughly 400-second CLI lane, while its recorded file-level profiling concerns the deep-loop suite; the packet contains no per-case split for copy, reset, subprocess, or validation time. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:77] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:81] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:155] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/tasks.md:51]
2. The spec-kit runner logs elapsed time around whole lane invocations, and the CLI shell runner waits for the slow upgrade-legacy process and the remaining CLI project process; neither timer separates test setup, resets, child commands, or validation. The test harness uses spawnSync for upgrade and validation and creates its sandbox under os.tmpdir(), so attribution requires a separately instrumented controlled run. [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs:71] [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs:89] [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs:109] [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-cli-tests.sh:7] [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-cli-tests.sh:12] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:28] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:36] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:195]

## Questions Answered
- Existing packet evidence and runner output do not report the requested per-case seconds; no timing attribution can be made from the available records.

## Questions Remaining
- Exact copy, reset, subprocess, and validation durations remain unknown and require a controlled instrumented run.

## Next Focus
Which twelve timing-sensitive system-deep-loop files make up about 265 seconds, what shared-state or timing assumptions keep them serial, and can any safe scheduling change retain all assertions?

## Ruled Out
- Treating the lane total or the slow file total as evidence of which internal phase dominates; the current timers measure broader invocations.

## Dead Ends
- Static packet and runner inspection cannot produce per-case elapsed time. A controlled instrumented run is the next evidence needed.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: no per-phase profile is present in the inspected packet; source inspection was used as a fallback.
- Partial success: the measurement gap is established, but exact seconds remain unknown. The controlled test was not run under the dispatch boundary.

## SCOPE VIOLATIONS
- None executed. The controlled test run was avoided because its harness writes a temporary sandbox outside the lineage and invokes validation and Git operations barred by the dispatch.

## Sources Consulted
- .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:28,36,195-220
- .skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs:71-97,109-119
- .skilled/skills/system-spec-kit/runtime/scripts/run-cli-tests.sh:7-13
- specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:77,81,155
- specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/tasks.md:51
- specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/research/lineages/luna-max/steer.md (checked; absent)

## Assessment
- New information ratio: 0.75 (one new runner-timing fact and one partially new packet-evidence finding).
- Questions addressed: whether the current packet/runner exposes a per-case timing breakdown.
- Questions answered: no strategy key question was fully answered; the measurement availability check found no breakdown.

## Reflection
- What worked and why: reading the parent timing notes alongside the runner showed that the reported slow-file duration and runner log are not phase-level measurements.
- What did not work and why: static inspection cannot assign elapsed seconds to the fixture copy, reset loop, subprocesses, or validation calls.
- What I would do differently: use a controlled profile that records durations around those boundaries while retaining all existing assertions.
- durationMs records elapsed wall time since the previous iteration gateway append and includes the reducer and orchestration interval.

## Recommended Next Focus
Which twelve timing-sensitive system-deep-loop files make up about 265 seconds, what shared-state or timing assumptions keep them serial, and can any safe scheduling change retain all assertions?
