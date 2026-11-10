# Iteration 1: CLI lane and upgrade-legacy harness

## Focus
Inspect the CLI test runner and `tests/upgrade-legacy.vitest.ts` to identify repeated setup, reset, and subprocess work behind the supplied roughly 400-second lane figure. The figure is dispatch-provided; this lineage did not run the suite.

## Actions Taken
- Read the iteration state, config, strategy, and rendered prompt; selected the strategy's first Next Focus.
- Inspected the test harness, CLI runner, and upgrade command's validator process model.
- Did not run Vitest or validation: the upgrade test creates a sandbox under `os.tmpdir()`, outside the lineage write fence.

## Findings
1. The upgrade-legacy file is a stateful integration suite: its main describes reset a shared sandbox after cases, and each reset performs a hard Git reset, removes fixture trees, recreates `specs/`, and restamps copied `dist` files; `beforeAll` also recursively copies the skill and creates a committed temporary repository. These are plausible costs, but no per-case profile attributes the supplied 400 seconds to them. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:90] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:194]
2. The test helpers launch a fresh Node process for each `runUpgrade` call and `bash` for each strict validation; the upgrade command itself validates packets in child processes and uses a pool capped at 24 workers because validator subprocesses spend time waiting. The process work is evidenced, but its share of this file's elapsed time is unmeasured. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:28] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:36] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:107]
3. The CLI runner already launches `upgrade-legacy.vitest.ts` in a dedicated Vitest process alongside a second process for the remaining CLI tests, while the test file intentionally shares one mutable sandbox. Raising file-level concurrency alone cannot shorten the slow process; first measure `resetSandbox`, `runUpgrade`, and `validate` separately, then reduce only measured fixture/process overhead without changing assertions. [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-cli-tests.sh:2] [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-cli-tests.sh:7] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:227]

## Questions Answered
- Which fixture setup, waits, subprocesses, and assertions account for the roughly 400-second cli lane in tests/upgrade-legacy.vitest.ts, and what test-only changes can reduce elapsed time while retaining every assertion? Structurally answered: the source shows repeated sandbox reset and process work; the exact time split remains unmeasured.

## Questions Remaining
- How many seconds the copy, resets, CLI subprocesses, and validation calls each contribute; answer with per-case timing in a controlled run.

## Ruled Out
- Raising the CLI file-level worker count by itself: the runner already executes the slow file concurrently with the rest of the CLI project.

## Dead Ends
- None. Static inspection identified measurable phases; it did not establish their relative costs.

## Edge Cases
- Ambiguous input: none; the first strategy focus names the CLI test file.
- Contradictory evidence: none.
- Missing dependencies: no timing profile for this file was present in the inspected source.
- Partial success: code paths and safe measurement targets are identified, but the supplied 400-second timing was not remeasured or decomposed.

## Sources Consulted
- .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:28
- .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:90
- .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:194
- .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:107
- .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:951
- .skilled/skills/system-spec-kit/runtime/scripts/run-cli-tests.sh:7

## Assessment
- New information ratio: 1.0 (3 fully new findings)
- Questions addressed: the CLI harness and runner behind the supplied slow-file timing.
- Questions answered: Which fixture setup, waits, subprocesses, and assertions account for the roughly 400-second cli lane in tests/upgrade-legacy.vitest.ts, and what test-only changes can reduce elapsed time while retaining every assertion? (structural answer; timing allocation remains open).

## Reflection
- What worked and why: reading the harness and runner together separated repeated per-test work from the one-time skill copy and showed that the slow file is already isolated from the other CLI files.
- What did not work and why: static reading cannot determine which phase consumes the most wall time.
- What I would do differently: use one controlled profile to time reset, CLI subprocess, and strict validation phases before changing concurrency or fixture structure.

## Recommended Next Focus
Which twelve timing-sensitive system-deep-loop files make up about 265 seconds, what shared-state or timing assumptions keep them serial, and can any safe scheduling change retain all assertions?

## SCOPE VIOLATIONS
- Avoided the workflow's pre-init and post-synthesis writes to the parent `spec.md`; the dispatcher bound all writes to this lineage. The pre-init decision was recorded through the gateway; post-synthesis will emit a deferred event.
- The YAML event steps stage temporary files under `TMPDIR`; this lineage stages those gateway event files under its own directory instead.
- Two initial setup calls used an absolute working-directory value for read-only operations before the path constraint was noticed; no writes occurred outside this lineage, and subsequent commands use repository-relative paths.

## Status
complete
