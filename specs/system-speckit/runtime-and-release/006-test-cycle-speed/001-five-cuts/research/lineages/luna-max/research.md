# How can the Skilled test cycle get faster after the five cuts already built?

## 1. Executive Summary

The next safe work is measurement at the remaining expensive boundaries. The current evidence does not support changing assertions, moving the timing-sensitive deep-loop files into parallel execution, or changing production ledger reads. The lineage ran no tests and claims no new time savings.

The supplied 18-core Mac timings put the deep-loop suite at 504–511 seconds and spec-kit `npm test` at 841–911 seconds. The packet also gives 834 seconds as the spec-kit minimum in its implementation summary. Keep that discrepancy visible until the original run records are reconciled. The largest unprofiled targets are the roughly 400-second `upgrade-legacy` file, the 12-file serial group at about 265 seconds and about 302 seconds of core import time. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/tasks.md:46-61] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:58-83]

## 2. Topic and Scope

This research follows the five test-cycle cuts already implemented. It identifies evidence-backed next measurements while preserving every current test and assertion. It does not implement a code or CI change. The spec excludes deleting tests and production changes that alter runtime behavior, including new ledger read caching. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/spec.md:60-75]

The evidence combines packet timings, source inspection and the ten iteration records in this lineage. The runs came from one 18-core Mac. No smaller-runner result or fresh test run was collected here. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:68-83] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/research/lineages/luna-max/deep-research-config.json:1-20]

## 3. Key Questions and Answers

1. **What accounts for the slow CLI lane?** The upgrade-legacy harness resets and restamps a shared sandbox, launches Node and validation subprocesses, and runs as a dedicated Vitest process beside the remaining CLI tests. Those are plausible costs, but the available evidence does not split its roughly 400 seconds by case or operation. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:28-36] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:90-194] [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-cli-tests.sh:2-14]
2. **Why are twelve deep-loop files serial?** They exercise elapsed-time limits, child-process termination, shared writer locks or graph-lock races. The configuration places them in a second project with file parallelism disabled. Existing evidence does not establish a safe subset to move. [SOURCE: .skilled/skills/system-deep-loop/runtime/vitest.config.ts:14-51] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/lifecycle/db-open-close.vitest.ts:29-75] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:4407-4466]
3. **What produces core import time?** The reported 302 seconds remained after deep-loop files left the spec-kit core project. Worker and module initialization may contribute, but no module- or phase-level profile identifies the cause. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:68-71] [SOURCE: .skilled/skills/system-spec-kit/runtime/vitest.config.ts:27-29] [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts:55-63]
4. **Should ledger reads be cached or rescanned less?** No. Scan cost is unmeasured, and gateway reads support current-head authorization, cross-process freshness, append fencing and projection refresh. Preserve the existing narrow single-writer cache behavior; require a measured profile and contract checks before proposing more production changes. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:104] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:383-432] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:261-307]
5. **What concurrency helps on smaller CI runners?** Unknown. The packet has only 18-core Mac timings. CI uses `ubuntu-latest` without a recorded effective worker count, and the configs create worker processes and scratch databases. Measure on the actual runner before changing concurrency. [SOURCE: .github/workflows/spec-kit-check.yml:93-176] [SOURCE: .github/workflows/deep-loop-runtime.yml:41-75] [SOURCE: .skilled/skills/system-spec-kit/runtime/vitest.config.ts:27-29]

## 4. Measured Baseline and Five Cuts

Before the work, the deep-loop suite took about 1,130 seconds. Afterward, the same 173 files and 2,873 tests passed in 504, 507 and 511 seconds. Spec-kit `npm test` now includes the CLI project. The packet records final runs of 841 and 911 seconds in `tasks.md`, while `implementation-summary.md` reports 834–911 seconds. The original run records are needed to settle the lower bound. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:53-84] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/tasks.md:46-61]

The five completed cuts were: removing deep-loop collection from spec-kit core while retaining its own suite; adding the CLI project to spec-kit `npm test`; documenting which package suite a change owes; profiling deep-loop files and sharing repeated read-only ledger fixtures; and enabling file parallelism with per-file coverage databases while keeping twelve timing-sensitive files serial. No test or assertion was removed. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:53-84]

The remaining measured split is approximately 348–399 seconds for core, around 400 seconds for the CLI lane, and around 90 seconds for validation. The core import estimate is about 302 seconds. The deep-loop serial group is about 265 seconds of the 504–511 second total. These are packet measurements, not measurements repeated during this research. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:68-83] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:145-158]

## 5. Method and Evidence Boundaries

The lineage read repository code, test configuration, workflow files and packet records. It did not run tests or modify production code. The packet describes a JSON profile ranking 173 deep-loop files, but the scoped packet inventory did not contain that profile. The inspected CI workflows also show no artifact-upload step for it. An ignored or external copy may still exist. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:81] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/tasks.md:51] [SOURCE: .github/workflows/spec-kit-check.yml:93-176] [INFERENCE: scoped packet inventory and inspected workflow files]

Consequently, source structure identifies work that could cost time but cannot assign seconds to that work. Recommendations below are profiling steps, not forecasts of savings.

## 6. Upgrade-Legacy CLI Lane

The test file builds a temporary repository and copied skill fixture, then resets a shared sandbox between cases. Reset work includes Git reset, fixture-tree removal and recreation, and copied-file restamping. Helpers launch a fresh Node process for an upgrade and Bash for strict validation. The upgrade command also validates packets in child processes. These operations are observable in the harness, but the packet has no per-case timing that apportions the roughly 400-second lane among them. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:28-36] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:90-230] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:107-110]

The CLI runner already starts the heavy file in a dedicated Vitest process alongside the remaining CLI project. Increasing file concurrency alone would not shorten the heavy process, and the shared mutable sandbox makes parallel cases unsafe without isolation evidence. First time sandbox preparation, resets, upgrade subprocesses and validation separately. Then change only the operation whose measured cost is material, retaining every assertion. [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-cli-tests.sh:2-14] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:194-230]

## 7. Serial Deep-Loop Group

The serial group is `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-deepseek-harness`, `cli-devin`, `cli-opencode`, `cli-pi`, `fanout`, lifecycle `db-open-close`, unit `fanout-run`, unit `lineage-timestamp-window` and integration `deep-research-postflip-fanout`. The Vitest config excludes these files from the parallel project and runs them in a second project with file parallelism disabled. [SOURCE: .skilled/skills/system-deep-loop/runtime/vitest.config.ts:16-51]

The packet attributes about 265 seconds to this group. That is roughly 52–53% of the 504–511 second suite. If the entire parallel portion became free, the serial fraction would still cap ideal speedup near 1.9×. This is an Amdahl-style upper bound, not a feasible forecast. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:145-158] [INFERENCE: 265 seconds divided by the reported 504–511 second total]

Time-based assertions, child-process termination and lock contention explain the quiet-machine policy. Capture per-file timings and interference evidence before considering any scheduling change. Keep all twelve files serial until repeated runs show a named candidate is isolated from those timing and shared-state assumptions. [SOURCE: .skilled/skills/system-deep-loop/runtime/vitest.config.ts:14-51] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/lifecycle/db-open-close.vitest.ts:29-75] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:4407-4466]

## 8. Spec-Kit Core Import Time

The reported import time stayed near 302 seconds after the core lane stopped collecting deep-loop tests. The core project runs files in worker processes, and setup allocates a scratch database for each test file. Those facts make worker startup and repeated module initialization candidates to profile, but they do not prove which one causes the time. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:68-71] [SOURCE: .skilled/skills/system-spec-kit/runtime/vitest.config.ts:27-29] [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts:55-63]

The runner reports elapsed time around whole lane invocations. It does not currently expose module- or import-phase timings. The sharded runner starts each shard as a separate process in sequence, so its existence is not evidence that it reduces import time or total wall time. [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs:71-120] [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs:5-41]

## 9. Ledger Cache and Gateway Rescans

`singleWriterReadCache` is opt-in and defaults off. Its documented safety condition is one writer for the cache lifetime; a cache hit skips the cross-process lock and could hide another process's append until a rescan. The long-lived per-lineage effect ledger already enables the cache under its single-owner assumption. Its tests compare cached results with lock-per-read behavior and check append invalidation. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/authorized-ledger-types.ts:104] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:383-432] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/fanout-effect-dispatch.ts:411-420] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/ledger-read-cache.vitest.ts:130-198]

The CLI append gateway keeps freshness-sensitive reads around authorization, idempotency, exclusive-lock append and projection refresh. No profile shows these reads materially contribute to the test cycle. Keep new gateway caching or scan reduction out of a test-speed change unless timing data justifies it and tests preserve cross-process freshness, append visibility, fencing, retry behavior and projection parity. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:261-307] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:507-541] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:668] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/spec.md:72]

## 10. Smaller CI Runner

The timing data comes from one 18-core Mac. The inspected CI workflows use `ubuntu-latest` and do not record the effective CPU count or Vitest worker count. Worker processes, scratch databases and disk contention mean a higher cap may help on one machine and hurt on another. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:145-158] [SOURCE: .github/workflows/spec-kit-check.yml:93-176] [SOURCE: .github/workflows/deep-loop-runtime.yml:41-75] [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts:55-63] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/plan.md:83]

On the actual CI runner, record processor and memory limits, OS, Node and Vitest versions. Compare the unchanged test commands at fixed worker caps such as 1, 2, 4 and default across repeated runs. Track full lane and per-file duration, CPU, memory, disk and database contention, timeouts and failures. Use median and spread to choose a cap. The best setting and expected gain remain unknown until measured. [SOURCE: .github/workflows/spec-kit-check.yml:97] [SOURCE: .github/workflows/deep-loop-runtime.yml:45] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:156-158]

## 11. Recommendations

1. Search for the historical 173-file JSON profile in its original storage location. If it cannot be recovered, make a fresh profile under controlled conditions before ranking file-level work. The packet inventory and inspected workflows do not expose a retained copy. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:81] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/tasks.md:51] [INFERENCE: scoped packet inventory and inspected workflow files]
2. Instrument the heavy upgrade-legacy file by operation and case, then address only measured fixture or subprocess overhead. Keep the existing assertions and sandbox isolation. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:28-36] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:194-230]
3. Add per-file timing for the twelve serial deep-loop tests and profile the core import phase. Retain serial scheduling and per-file scratch databases while collecting evidence. [SOURCE: .skilled/skills/system-deep-loop/runtime/vitest.config.ts:14-51] [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts:55-63]
4. Measure worker caps on the actual CI runner and compare end-to-end wall time before changing config or splitting jobs. [SOURCE: .github/workflows/spec-kit-check.yml:93-176] [SOURCE: .github/workflows/deep-loop-runtime.yml:41-75]
5. Defer new production ledger caching until a profile shows meaningful cost and contract-preserving tests are specified. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/spec.md:72] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:261-307]

### Eliminated Alternatives

- Increasing CLI file concurrency alone: the slow file already runs as a separate process alongside the remaining CLI tests. [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-cli-tests.sh:2-14]
- Moving the twelve timing-sensitive files together into the parallel project: no evidence establishes their timing, lock and subprocess isolation. [SOURCE: .skilled/skills/system-deep-loop/runtime/vitest.config.ts:14-51]
- Enabling gateway caching or removing rescans from source inspection alone: scan time and correctness-preserving savings are unmeasured. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:383-432] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:261-307]
- Splitting CI jobs based only on sequential YAML steps: setup/build duplication, total runner minutes and failure semantics are not measured. [SOURCE: .github/workflows/spec-kit-check.yml:93-176]
- Claiming all parallel time can be removed: the serial group alone is about 52–53% of the deep-loop total. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:145-158]

## Divergence Map

No divergent pivots, saturated directions or overrides are recorded in the lineage registry. The remaining frontier is measurement: per-case CLI costs, per-file serial costs, core import phases, actual CI worker behavior, gateway read cost and the end-to-end effect of job splitting. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/research/lineages/luna-max/findings-registry.json]

The research did identify two unresolved provenance or workflow details: the spec-kit minimum is reported as both 834 and 841 seconds, and the workflow's all-questions-answered STOP path is not clearly reconciled with the separate low-novelty gate. This lineage stopped at the configured maximum, so it does not claim those matters were resolved. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/tasks.md:60-61] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:58-61] [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:774-825] [SOURCE: .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md:114-146]

## 12. Open Questions

The five tracked key questions are marked answered in the reducer registry. Thirteen carried-forward entries remain measurement or artifact gaps, not reopened key questions. They concern per-case setup/reset/subprocess/validation time; per-file timings for the serial group; core import phases; gateway scan cost; small-runner capacity and timings; and whether the historical profile is archived elsewhere. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/research/lineages/luna-max/findings-registry.json]

The candidate CI job split also remains unmeasured. The current workflow runs core, CLI, legacy and validation work sequentially in one check job. Parallel jobs could reduce wall time, but they may repeat setup and build work and change cross-lane fail-fast behavior. [SOURCE: .github/workflows/spec-kit-check.yml:93-176] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/research/lineages/luna-max/iterations/iteration-009.md] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/research/lineages/luna-max/iterations/iteration-010.md]

## 13. Measurement Plan

1. Recover the existing 173-file profile or capture a replacement with the same file list and assertions.
2. Run the current full commands repeatedly on the 18-core Mac and the actual CI runner. Record versions, available processors, memory limits, lane times, per-file times, CPU and memory use, failures and timing spread.
3. Instrument `upgrade-legacy` around fixture creation, sandbox reset, upgrade subprocesses and strict validation. Compare operation totals with the file's wall time.
4. Measure the twelve serial deep-loop files individually under the current quiet-machine policy. Test a candidate scheduling change only for a named file with repeated non-interference evidence, while retaining all assertions.
5. Profile core startup and module loading by phase. Keep the per-file scratch database boundary fixed while comparing any process or module-loading experiment.
6. Measure gateway read and scan time under representative workloads. Any proposal must also verify fresh cross-process reads, append visibility, authorization, fencing, retries and identical projections.
7. Compare a minimal CI job split with the current workflow using complete end-to-end wall time and runner minutes. Preserve every command and required check, and account for repeated setup and build work.

## 14. CI Job-Splitting Candidate

The spec-kit check workflow places the CLI project, legacy and validation commands, and runtime Vitest work in one job with sequential steps. The CLI helper already runs the heavy legacy file beside the remaining CLI tests in two processes. A job split could overlap existing independent groups, but it would repeat setup or build steps and remove the current cross-lane fail-fast sequence. Measure complete workflow wall time, setup/build cost, total runner minutes and check outcomes before adopting it. Keep each existing command, file list, assertion and validation step intact. [SOURCE: .github/workflows/spec-kit-check.yml:93-124] [SOURCE: .github/workflows/spec-kit-check.yml:143-176] [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-cli-tests.sh:2-14] [INFERENCE: split points follow existing commands, but speed and isolation costs are unmeasured]

The runner already logs elapsed time around each whole test lane. That provides a baseline for lane comparisons, but not case- or phase-level attribution. [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs:71-120]

## 15. Coverage and Risk Guardrails

Keep all collected files and assertions. Preserve each per-file scratch database because it isolates graph writers. Keep time-sensitive lock, subprocess and termination tests serial unless repeated evidence proves a specific file safe to move. The package verification rule requires the full suite of each changed package, while generated-only rebases do not owe a rerun. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:77-83] [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts:55-63] [SOURCE: .skilled/skills/system-deep-loop/runtime/vitest.config.ts:14-51] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/shared/workflow-guardrails.md:58-60]

Separate test-only speed changes from runtime-behavior changes. Any new gateway cache or rescan reduction needs its own correctness evidence for cross-process freshness and projection parity. Do not use the 18-core Mac profile to set a smaller runner's worker cap. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/spec.md:60-75] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts:383-432]

## 16. Convergence and Evidence Limits

The lineage completed ten iterations, resolving all five tracked key questions. Its last three new-information ratios were 0.50, 0.75 and 0.75, all above the configured threshold of 0.05. The ten-iteration cap therefore ended the loop through `maxIterationsReached`; this is not evidence that the novelty threshold was met. The YAML makes the cap terminal before the quality-guard path. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/research/lineages/luna-max/deep-research-state.jsonl] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/research/lineages/luna-max/deep-research-config.json:1-20] [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:774-776]

The workflow YAML and convergence reference leave the separate low-novelty enforcement on the all-questions-answered STOP branch unclear. This run reached the hard maximum instead, so the branch ambiguity did not determine its terminal reason. The original spec-kit timing minimum also remains inconsistent between packet sources. No new runtime, test-suite or CI result was gathered to settle either issue. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:774-825] [SOURCE: .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md:114-146] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/tasks.md:60-61] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:58-61]

## 17. References

- [Resource map](resource-map.md)
- [Implementation summary](../../../implementation-summary.md)
- [Tasks](../../../tasks.md)
- [Specification](../../../spec.md)
- [Deep-loop Vitest configuration](../../../../../../../.skilled/skills/system-deep-loop/runtime/vitest.config.ts)
- [Spec-kit Vitest configuration](../../../../../../../.skilled/skills/system-spec-kit/runtime/vitest.config.ts)
- [Append gateway](../../../../../../../.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs)
- [CI spec-kit workflow](../../../../../../../.github/workflows/spec-kit-check.yml)

## Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 10
- Questions answered: 5 / 5
- Remaining key questions: 0
- Last three iterations: run 8, profile availability (0.50); run 9, CI lane and artifact boundaries (0.75); run 10, lane timing and scheduling boundary (0.75)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded; the remaining frontier is measurement of the candidate costs and CI behavior.
- Segment transitions, wave scores and checkpoint metrics are omitted because the live workflow marks them experimental.

## Workflow Execution Note

Generated findings writeback to the parent `spec.md` was deferred because it is outside the lineage-only write boundary, and the gateway accepted the `spec_synthesis_deferred` event. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/research/lineages/luna-max/synthesis-events/spec_synthesis_deferred.json]

The workflow lock-release command succeeded and removed the lineage lock. Its legacy `lock_released` bookkeeping row was rejected by the append gateway on three attempts with `legacy-event-has-no-lossless-mode-event`. The compatibility layer explicitly pins this legacy event because it has no lossless mode-event mapping. No direct state-projection write was made. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:78-84] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:482-484] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/research/lineages/luna-max/synthesis-events/lock_released.json]
