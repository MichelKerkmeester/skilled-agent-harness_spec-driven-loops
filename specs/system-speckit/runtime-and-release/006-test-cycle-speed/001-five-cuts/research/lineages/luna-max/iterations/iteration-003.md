# Iteration 3: Deep-loop serial test group

## Focus
Which twelve timing-sensitive system-deep-loop files make up about 265 seconds, what shared-state or timing assumptions keep them serial, and can any safe scheduling change retain all assertions?

The reducer still pointed to exact phase timings for upgrade-legacy, but that focus requires a controlled run. The strategy’s exhausted-approach section blocks repeated static inspection, and the dispatch forbids running the suite that writes a temp sandbox and invokes validation/Git. The steering file was checked and absent. I therefore selected the first open key question and record this focus conflict for the lineage.

## Actions Taken
1. Read the Vitest project configuration and expanded its serial globs to the matching stress and lifecycle test files.
2. Searched serial test sources for elapsed-time assertions, lock contention, child-process launches, kills, and timeout behavior.
3. Read the lock lifecycle, fanout overlap/SIGTERM cases, and representative CLI-adapter suite helpers.

## Findings
1. The configured serial bucket contains twelve files: eight CLI-adapter stress suites (cli-claude-code.vitest.ts, cli-codex.vitest.ts, cli-cursor.vitest.ts, cli-deepseek-harness.vitest.ts, cli-devin.vitest.ts, cli-opencode.vitest.ts, cli-pi.vitest.ts, fanout.vitest.ts), lifecycle db-open-close, unit fanout-run, unit lineage-timestamp-window, and integration deep-research-postflip-fanout. The config excludes this set from the parallel project and runs it in a second project with fileParallelism disabled after groupOrder 0. [SOURCE: .skilled/skills/system-deep-loop/runtime/vitest.config.ts:16] [SOURCE: .skilled/skills/system-deep-loop/runtime/vitest.config.ts:37] [SOURCE: .skilled/skills/system-deep-loop/runtime/vitest.config.ts:51]
2. The config documents the serial premise: elapsed-time checks, child-process termination, and graph-lock races assume a quiet machine. Examples include db-open-close polling for the writer lock and testing overlapping writers, and fanout-run verifying time-interval overlap plus SIGTERM handling; concurrent file execution could perturb those timing and process assertions. [SOURCE: .skilled/skills/system-deep-loop/runtime/vitest.config.ts:14] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/lifecycle/db-open-close.vitest.ts:29] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/lifecycle/db-open-close.vitest.ts:75] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:4407] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:4466]
3. No safe subset for parallel scheduling is established by the inspected evidence. Keep all twelve assertions intact and serial until repeated per-file measurements and explicit interference checks show that named files do not share timing, child-process, or lock-sensitive assumptions; then test only the supported scheduling change on the target runner. [INFERENCE: based on the serial-policy comment and the timing/process behaviors cited above]

## Questions Answered
- The serial set is identifiable and the config explains its quiet-machine premise; current evidence supports no safe file-level parallelization candidate.

## Questions Remaining
- Per-file timing contributions to the reported 265 seconds are not present in the dispatch evidence or source files, so the slowest serial files cannot be ranked here.
- Whether any specific file can move to a separate parallel subgroup requires repeated runs under the target 18-core runner and smaller CI runner, with interference checks.

## Next Focus
Which twelve timing-sensitive system-deep-loop files make up about 265 seconds, what shared-state or timing assumptions keep them serial, and can any safe scheduling change retain all assertions?

## Ruled Out
- Repeating static inspection to infer the upgrade-legacy phase split; reducer marks that direction blocked, and the controlled test is outside this lineage’s execution boundary.
- Moving any of the twelve files to parallel based only on filenames or source structure; the current evidence does not demonstrate independence under load.

## Dead Ends
- The reported aggregate 265-second serial time does not provide per-file costs. Source inspection identifies the scheduling premise but cannot rank candidates.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: strategy Next Focus still calls for a controlled profile, while the exhausted-approach state blocks more static inspection and the dispatch forbids that run; steering was absent. Followed the block and pivoted to this first open key question.
- Missing dependencies: per-file timing measurements are unavailable; no suite was run.
- Partial success: identified all twelve files and the serial rationale, but no safe scheduling change or per-file speed estimate is established.

## Sources Consulted
- .skilled/skills/system-deep-loop/runtime/vitest.config.ts:14-59
- .skilled/skills/system-deep-loop/runtime/tests/lifecycle/db-open-close.vitest.ts:21-35,75-83
- .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:4407-4463,4466-4533
- .skilled/skills/system-deep-loop/runtime/tests/unit/lineage-timestamp-window.vitest.ts:206-260
- .skilled/skills/system-deep-loop/runtime/tests/integration/deep-research-postflip-fanout.vitest.ts:46-54
- .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-claude-code.vitest.ts
- .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-codex.vitest.ts
- .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-cursor.vitest.ts
- .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-deepseek-harness.vitest.ts
- .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-devin.vitest.ts
- .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-opencode.vitest.ts
- .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-pi.vitest.ts
- .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts
- .skilled/skills/system-deep-loop/runtime/tests/lifecycle/db-open-close.vitest.ts
- specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/research/lineages/luna-max/steer.md (checked; absent)

## Assessment
- New information ratio: 1.0 (three findings add the exact serial inventory, documented quiet-machine rationale, and a bounded conclusion about scheduling evidence).
- Questions addressed: the twelve-file inventory, why the group is serial, and whether the current evidence supports a safe scheduling change.
- Questions answered: Which twelve timing-sensitive system-deep-loop files make up about 265 seconds, what shared-state or timing assumptions keep them serial, and can any safe scheduling change retain all assertions?
- Dispatch-supplied aggregate timing of about 265 seconds was not re-measured.

## Reflection
- What worked and why: combining the config globs with exact file discovery made the twelve-file set explicit; targeted reads showed concrete timing, child-process, and graph-lock behaviors.
- What did not work and why: static source cannot rank the twelve files by elapsed time or prove their independence under concurrent load.
- What I would do differently: collect repeated per-file timings and run a controlled subset/interference matrix before changing file scheduling.
- durationMs records elapsed wall time since the previous iteration gateway append and includes reducer and orchestration time.

## Recommended Next Focus
Which twelve timing-sensitive system-deep-loop files make up about 265 seconds, what shared-state or timing assumptions keep them serial, and can any safe scheduling change retain all assertions?
