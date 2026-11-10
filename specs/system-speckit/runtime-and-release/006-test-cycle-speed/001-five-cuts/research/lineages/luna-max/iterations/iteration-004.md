# Iteration 4: Spec-kit core import time

## Focus
What accounts for about 300 seconds of import time in the spec-kit core lane, how is that time produced, and which test-process or module-loading changes can reduce it without changing coverage?

The reducer’s Next Focus still requires repeated measurements of serial test scheduling. The exhausted list blocks deciding on parallel groups by static inspection, and the dispatch forbids the required test runs. The steering file was checked and absent. I followed the first open key question instead; this resolves the focus conflict without repeating the blocked measurement approach.

## Actions Taken
1. Read the spec-kit package scripts, core Vitest config, test setup, bounded runner, and optional sharded runner.
2. Searched the parent packet for the recorded 302-second import figure and its measurement context.
3. Checked the 129-file collection and searched the inspected runner/config paths for import-stage or module-load profiling.

## Findings
1. The parent packet reports that import time remained 302 seconds after the core lane stopped collecting the deep-loop suite; the updated core run collected 126 spec-kit files and the config check recorded 129 collected files. The persistent cost therefore is not explained by importing the excluded deep-loop suite. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:69] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:71] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/tasks.md:46]
2. The core Vitest config runs files in parallel, with each file in its own worker process; the shared setup allocates a scratch database per test file and removes it afterward. Repeated worker setup and module initialization across the 129-file core lane are plausible contributors, but the available sources do not measure their import share. [SOURCE: .skilled/skills/system-spec-kit/runtime/vitest.config.ts:27] [SOURCE: .skilled/skills/system-spec-kit/runtime/vitest.config.ts:29] [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts:55] [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts:63]
3. The runner times the whole Vitest invocation and logs one elapsed total; it exposes no stage- or module-level import timer in the inspected path. The sharded runner starts each shard as a separate process sequentially to address accumulated worker CPU rehashing, so it is not evidence of lower import time or wall time. [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs:71] [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs:89] [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs:5] [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs:28] [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs:41]

## Questions Answered
- The recorded import time persisted after removing deep-loop tests; repeated per-file worker setup is a plausible source, but the exact modules and phase costs are not identified.

## Questions Remaining
- Which modules or import phases account for the reported 302 seconds, and whether process reuse or module-loading changes reduce wall time while preserving the per-file scratch database and all assertions.

## Next Focus
What evidence would justify production changes involving singleWriterReadCache or gateway rescans, and how should their runtime-behavior risk be separated from test-only speed work?

## Ruled Out
- Attributing the remaining import time to deep-loop test imports; the recorded 302-second figure remained after those tests were excluded.
- Treating the sequential shard runner as a proven import-time optimization; its source documents a different purpose and separate process starts.

## Dead Ends
- The packet and runner do not identify slow modules or the method behind the reported import-time value. A per-worker/module profile is required before a specific loading change can be justified.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: reducer Next Focus requests repeated timing runs while the exhausted state and dispatch limit prohibit the necessary test execution; steer was absent. Pivoted to the first open key question.
- Missing dependencies: no module-level import profile is present in the inspected packet and runner sources.
- Partial success: located the persistent 302-second record and the per-file worker setup; exact causes and any winning change remain unverified.

## Sources Consulted
- specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:69-77,140-146
- specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/plan.md:73-79,91-94
- specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/tasks.md:46-52
- .skilled/skills/system-spec-kit/runtime/package.json:23-32
- .skilled/skills/system-spec-kit/runtime/vitest.config.ts:9-34
- .skilled/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts:27-71
- .skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs:71-120
- .skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs:5-43
- specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/research/lineages/luna-max/steer.md (checked; absent)

## Assessment
- New information ratio: 0.83 (two findings are new to this import-cost focus; one partly reuses the previously established whole-lane timer fact while adding the sharded runner behavior).
- Questions addressed: persistence of the 302-second value after deep-loop exclusion and the current core test-process topology.
- Questions answered: no exact module or import phase is identified; repeated per-file initialization is only a plausible mechanism.
- The packet’s timing value is reported evidence and was not re-measured in this lineage.

## Reflection
- What worked and why: combining the before/after record with the current Vitest config separated a likely repeated worker cost from the excluded deep-loop suite.
- What did not work and why: the available runner reports only whole-invocation time, so it cannot assign the 302 seconds to particular imports.
- What I would do differently: profile import/transform time per worker and module while preserving the current per-file database isolation, then compare one narrowly scoped process-loading change.
- durationMs records elapsed wall time since the prior iteration gateway append, including reducer and orchestration time.

## Recommended Next Focus
What evidence would justify production changes involving singleWriterReadCache or gateway rescans, and how should their runtime-behavior risk be separated from test-only speed work?
