# Iteration 10: Existing lane timing and a safe scheduling boundary

## Focus
Inspect the current test runner and CLI helper to identify the precise suite boundary for a measured CI job-splitting experiment while preserving all commands. This is the configured maximum iteration, so the research loop will stop at its hard cap after this record.

## Actions Taken
1. Read the spec-kit runtime test runner's lane dispatch and elapsed-time logging.
2. Read the CLI test helper's heavy-file split and the package scripts for validation and legacy suites.
3. Compared those scripts with the CI job sequence captured in iteration 9.

## Findings
1. The local npm test runner already times each whole lane with Date.now and logs elapsed milliseconds for successful invocations. Its default order is core Vitest, CLI tests, then spec-validation, with early exit on the first failed lane; it does not time individual cases or phases. This is a no-code baseline route for lane-level measurements, but the CLI Vitest helper itself only reports success/failure for its two concurrent processes. [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs:71-97] [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs:100-120] [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-cli-tests.sh:5-14]
2. A CI scheduling experiment can preserve coverage by keeping the existing core, CLI, legacy, validation, and shared-package commands intact while moving independent test groups into separate jobs. The current runner and workflow sequence shows the split points, but job isolation duplicates setup/build work and removes the current cross-lane fail-fast behavior; compare complete workflow time, install/build cost, file counts, assertions, and required-check outcomes before accepting a change. [SOURCE: .skilled/skills/system-spec-kit/runtime/package.json:23-26] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/package.json:19-22] [SOURCE: .github/workflows/spec-kit-check.yml:111-124] [SOURCE: .github/workflows/spec-kit-check.yml:143-176] [INFERENCE: the candidate split follows existing independent commands but its timing and isolation cost are unmeasured]

## Questions Answered
- None in this iteration. The five tracked research questions were answered in iterations 1-6.

## Questions Remaining
- No original key questions remain. Actual job-split savings, repeated setup/build cost, CI-runner capacity, detailed test phases, and the historical profile's external availability remain unmeasured or unconfirmed.

## Next Focus
The configured maximum has been reached. Synthesize the ten iterations, preserve the stop-contract and baseline discrepancies, and list measurement gates before any code or workflow change.

## Ruled Out
- Claiming per-test or per-phase timing from the runner's existing whole-lane timer.
- Treating separate commands as proof that a parallel CI job split will be faster.

## Dead Ends
- The existing npm runner provides lane-level elapsed logs only; it cannot identify which case or import phase dominates a lane.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: none newly found; the stop-contract and baseline-range discrepancies from iteration 7 remain open.
- Missing dependencies: no end-to-end timing for a split workflow is available, and no runtime measurement was performed in this lineage.
- Partial success: the current timer and safe command boundaries are identified, but a split's total wall time and repeated setup cost are unknown.

## Sources Consulted
- .skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs:71-120
- .skilled/skills/system-spec-kit/runtime/scripts/run-cli-tests.sh:5-14
- .skilled/skills/system-spec-kit/runtime/package.json:23-26
- .skilled/skills/system-spec-kit/runtime/cli/package.json:19-22
- .github/workflows/spec-kit-check.yml:111-124,143-176
- specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/research/lineages/luna-max/steer.md (checked; absent)

## Assessment
- New information ratio: 0.75 (the built-in lane timer and exact order add detail; the parallel job candidate is a partial synthesis without a measured result).
- Questions addressed: none.
- Questions answered: none; all five tracked questions were already answered.

## Reflection
- What worked and why: reading the runner entrypoint exposed a ready-made lane timer and the exact sequence without executing the suite.
- What did not work and why: the existing timer stops at lane boundaries, so it cannot rank per-case or module-import costs; workflow text cannot establish job-splitting savings.
- What I would do differently: capture repeated per-lane timings with the existing log, then separately compare one minimal CI split while keeping all current commands and required checks.

## Recommended Next Focus
Synthesis: rank the measurement actions by existing evidence, preserve the open runtime and convergence limitations, and stop at maxIterationsReached.
