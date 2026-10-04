# Iteration 1: Workflow and engine contract

## Focus

Cross-check the /doctor:update router, presentation asset and check, align and apply workflow declarations against release-update.cjs, with attention to input binding, approval and rollback behavior.

## Actions Taken

1. Read the router, presentation asset and all three workflow YAML files.
2. Compared their flags and output declarations with the engine parser, release resolution, apply lock and rollback paths.
3. Inspected the existing release-update test cases for offline checks, prereleases, vendored trees, generated and binary files, partial apply and rollback. Tests were not run.
4. Read the sk-create-command router and presentation ownership contract.

## Findings

### P1: Hard interruption can strand the apply lock

applyPlan writes rollback.json before target writes and releases .skilled/release/.apply.lock in a finally block. A hard process kill or power loss can bypass that cleanup. rollbackPlan also has to acquire the same exclusive lock, while acquireLock rejects any existing lock. The apply workflow tells the operator to leave a pre-existing lock untouched. The engine therefore has no built-in path to recover an interrupted apply with a stale lock. This consequence is inferred from the control flow; it is not exercised by the current tests.

The suite covers an ordinary write failure followed by rollback, and separately verifies that a held lock blocks rollback. It does not test abrupt process termination. Add stale-lock recovery with owner validation or a documented safe recovery path, plus a child-process termination test.

[SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1775]
[SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1889]
[SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1903]
[SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2035]
[SOURCE: .skilled/commands/doctor/assets/workflows/doctor-update-apply.yaml:98]
[SOURCE: .skilled/commands/doctor/assets/workflows/doctor-update-apply.yaml:123]
[SOURCE: .skilled/commands/doctor/scripts/tests/release-update.test.cjs:1045]
[SOURCE: .skilled/commands/doctor/scripts/tests/release-update.test.cjs:1073]

### P2: Align and apply do not declare the prerelease input they map

The router accepts --include-prerelease for align and apply. Both workflow engine command templates also include the flag, and the engine supports it. However, the align and apply user_inputs blocks omit include_prerelease, while each workflow says to include only bound optional flags. The workflow contract therefore has no declared value to bind. Unless runtime binding bypasses user_inputs, these actions cannot select the latest prerelease through the command.

Add include_prerelease to both input blocks and cover latest-prerelease selection for align and apply.

[SOURCE: .skilled/commands/doctor/update.md:35]
[SOURCE: .skilled/commands/doctor/assets/workflows/doctor-update-align.yaml:33]
[SOURCE: .skilled/commands/doctor/assets/workflows/doctor-update-align.yaml:53]
[SOURCE: .skilled/commands/doctor/assets/workflows/doctor-update-align.yaml:93]
[SOURCE: .skilled/commands/doctor/assets/workflows/doctor-update-apply.yaml:37]
[SOURCE: .skilled/commands/doctor/assets/workflows/doctor-update-apply.yaml:51]
[SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:46]

### P2: The router repeats next-step wording owned by the presentation asset

The router says that all visible wording belongs in the presentation asset, but its workflow summary also tells the operator how to record and commit the installed base. The presentation asset already contains the full base-recording prompt. The router's next-step text therefore conflicts with the command-authoring ownership rule and can drift from the displayed prompt.

Keep the instruction in the presentation asset and have the router point to that template.

[SOURCE: .skilled/commands/doctor/update.md:58]
[SOURCE: .skilled/commands/doctor/update.md:68]
[SOURCE: .skilled/commands/doctor/assets/doctor-update-presentation.txt:82]
[SOURCE: .skilled/skills/sk-doc/sk-create-command/SKILL.md:331]
[SOURCE: .skilled/skills/sk-doc/sk-create-command/SKILL.md:354]

## Questions Answered

- Q3: The router is thin and the presentation asset owns the dashboards, approval prompts, dry-run result and rollback guidance. The apply workflow and presentation agree on one startup approval, dry-run behavior and rollback ordering. There is one presentation-boundary mismatch: the router repeats the first-run base-recording next step.

## Questions Remaining

- Q1: Complete the field-by-field check of every workflow promise against engine exit codes, report fields, unit keys, lock behavior and rollback outcomes. The prerelease binding gap is established, but the full contract matrix remains open.
- Q2: Finish the scenario matrix, especially abrupt interruption recovery, renames, offline align/apply and generated files outside the recognized patterns.
- Q4: Verify customization base recording, three-way merge provenance, hashes and decision-only apply behavior end to end.
- Q5: Inspect install and sync scripts, post-apply rebuild/reindex behavior, documentation and recovery paths.

## Sources Consulted

- .skilled/commands/doctor/update.md
- .skilled/commands/doctor/assets/doctor-update-presentation.txt
- .skilled/commands/doctor/assets/workflows/doctor-update-check.yaml
- .skilled/commands/doctor/assets/workflows/doctor-update-align.yaml
- .skilled/commands/doctor/assets/workflows/doctor-update-apply.yaml
- .skilled/commands/doctor/scripts/release-update.cjs
- .skilled/commands/doctor/scripts/tests/release-update.test.cjs
- .skilled/skills/sk-doc/sk-create-command/SKILL.md
- .skilled/skills/system-deep-loop/deep-research/references/state/state-jsonl.md

## Assessment

newInfoRatio: 0.68

The pass identified three actionable gaps, including an interrupted-apply recovery path not covered by the prior summary of ordinary partial-write rollback. The prerelease input failure is confirmed in the workflow declarations; its exact runtime effect is inferred until the workflow binding behavior is exercised. No tests were run.

## Reflection

Reading the workflow inputs beside the engine mapping exposed a declaration gap that would not appear in the engine's own parser tests. Comparing exception cleanup with lock acquisition exposed why the current rollback-lock test does not cover abrupt process death.

## Next Focus

Continue with the Q2 scenario matrix. Trace offline and rename handling through report classification and apply, then map each scenario to existing tests before moving to post-apply install and rebuild recovery.
