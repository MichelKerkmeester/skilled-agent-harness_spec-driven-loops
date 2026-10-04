---
title: "DOC-368 -- Doctor deep-loop scope"
description: "Manual scenario validating that /doctor:deep-loop --scope selects the research, review, council, both or all graph sources, that an absent flag asks the scope prompt and applies its default of all, and that a value outside the documented set is refused with the argument failure path."
version: 1.1.0.0
id: doctor-commands-doctor-deep-loop-scope
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-368 -- Doctor deep-loop scope

## 1. OVERVIEW

This scenario validates the `/doctor:deep-loop` scope flag against the source sets its policy names. A run with `--scope=research` reads the research iteration folders alone, a run with `--scope=review` reads the review iteration folders alone, and a run with `--scope=council` reads the ai-council artifacts and the council graph alone. A run with `--scope=both` reads the research and review iteration folders against the deep-loop coverage graph alone, and a run with `--scope=all` reads both iteration folders plus the ai-council artifacts against the deep-loop and council graphs. A run with no `--scope` flag asks the presentation contract's scope prompt, and an empty answer applies the default of `all`. The command contract limits the flag to `research|review|council|both|all`.

The refusal path is also user-observable. A value outside that set fails before the workflow YAML loads and prints the presentation contract's argument failure block with `STATUS=FAIL ERROR="unknown_argument"`. No workflow phase and no state log follow.

## 2. SCENARIO CONTRACT

- Objective: Prove that `--scope` selects the research, review, council, both or all graph sources, that an absent flag asks the scope prompt and applies its `all` default, and that an unknown value is refused with the argument failure path.
- Playbook ID: DOC-368.
- Real user request: `Check the deep-loop coverage for research, review and council with scope, and confirm that an unknown scope value is refused.`
- Prompt: `Check the deep-loop coverage for research, review and council with scope, and confirm that an unknown scope value is refused.`
- Preconditions: A disposable copy of the repository that contains at least one research iteration folder, one review iteration folder and one ai-council artifact set, plus an active spec packet whose scratch directory is writable.
- Expected execution process: Create the disposable copy, inventory the three source sets, run the five documented scopes in turn plus one run without the flag that answers the scope prompt, approve the three blocking gates in each accepted run, then run a value outside the documented set and capture the refusal.
- Expected signals: Phase 0 globs `<active-spec-folder>/research/iterations/*.md` for `--scope=research` and no review or ai-council source. The same holds for `--scope=review` over `<active-spec-folder>/review/iterations/*.md`, and `--scope=council` globs `<active-spec-folder>/ai-council/**`, stats `council-graph.sqlite` and samples the council graph with `loopType='council'`. `--scope=both` globs the research and review iteration folders and stats `deep-loop-graph.sqlite` without touching `ai-council/**` or `council-graph.sqlite`, and `--scope=all` adds the `ai-council/**` glob, the `council-graph.sqlite` stat and the `loopType='council'` council sampling on top of both iteration folders. A run without `--scope` prints the presentation contract's scope prompt `Which deep-loop history should be checked?` with options `1` to `5`, and an empty answer resolves to `all` with the matching Phase 0 activity. Each setup dashboard shows the resolved `Scope:` value. Every status, query and convergence call carries `--read-only`. The diagnostic summary shows `DOCTOR DIAGNOSTIC RESULT` with the resolved `Scope:` value and a matching `STATUS=[status]`, and the state log at `<active-spec-folder>/scratch/doctor-deep-loop-state.<timestamp>.json` records the same value in its `scope` field. The unknown value run prints the argument failure block, with the offending argument substituted into `Unknown argument: [argument]`, and ends at `STATUS=FAIL ERROR="unknown_argument"` before the workflow YAML loads.
- Desired user-visible outcome: A focused diagnostic per documented scope and one for the prompted default run, each naming the resolved scope in the setup dashboard and the result summary, plus one clear argument failure for the unknown value.
- Pass/fail: PASS if each scope reads only the source set its policy row names, the no-flag run asks the scope prompt and resolves an empty answer to `all`, each state log records the matching scope, and the unknown value prints the argument failure block with `STATUS=FAIL ERROR="unknown_argument"` before any workflow phase runs.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Check the deep-loop coverage for research, review and council with scope, and confirm that an unknown scope value is refused.
```

### Commands

1. Create a disposable copy of the repository, because each accepted run writes a packet-local state log.
2. In the copy, inventory the three focused source sets:
   - `find specs -path '*/research/iterations/*.md' | head`
   - `find specs -path '*/review/iterations/*.md' | head`
   - `find specs -path '*/ai-council/*' | head`
3. Run `/doctor:deep-loop --scope=research` through the real runtime.
4. Answer `y` at the three blocking gates, `before_phase_1_analysis`, `before_phase_2_recommendation` and `before_phase_3_report`.
5. Capture the setup dashboard, the Phase 0 Glob activity, the diagnostic summary, the `scope` field of the state log, and the `--read-only` flag on the status, query and convergence calls.
6. Repeat steps 3 to 5 with `--scope=review`, `--scope=council`, `--scope=both` and `--scope=all`.
7. Run `/doctor:deep-loop` with no flag, confirm the scope prompt `Which deep-loop history should be checked?` appears with options `1` to `5`, answer with an empty reply so the `all` default applies, approve the three gates and capture the same signals as step 5.
8. Run `/doctor:deep-loop --scope=benchmark`, a value outside the documented set, and capture the full output.
9. Confirm the unknown value run produced no diagnostic summary and no state log.
10. Discard the disposable copy and confirm the live working copy has no new state log under its active packet scratch folder.

### Expected

The command parses the flag and loads `.skilled/commands/doctor/assets/doctor-deep-loop.yaml` for each accepted run. Every accepted scope reads only the source set its policy names, runs each status, query and convergence call with `--read-only`, and writes only its packet-local state log. `--scope=both` reads the research and review iteration folders against the deep-loop coverage graph alone, and `--scope=all` adds the ai-council artifacts and the council graph. A run without the flag asks the presentation contract's scope prompt and an empty answer resolves to `all`. The setup dashboard and the result summary both show the resolved scope.

The unknown value never loads the workflow YAML. It prints the presentation contract's argument failure block and stops, so no phase runs and no state log is written.

### Evidence

- The six valid-run transcripts, each with the setup dashboard `Scope:` line and the Phase 0 Glob activity.
- The scope prompt `Which deep-loop history should be checked?` and its five options from the no-flag run, plus the `all` scope the empty answer resolved to.
- The state log path and `scope` field for each valid run.
- The `--read-only` flag on every status, query and convergence invocation.
- The literal line `Unknown argument: --scope=benchmark`, the only-flag line that follows it, and `STATUS=FAIL ERROR="unknown_argument"`.
- Confirmation that the unknown value run produced no diagnostic summary and no state log.
- The live working copy comparison before and after the scenario.

### Pass / Fail

- **Pass**: Each scope reads only the source set its policy row names, the no-flag run asks the scope prompt and resolves an empty answer to `all`, each state log records the matching scope, and the unknown value prints the argument failure block with `STATUS=FAIL ERROR="unknown_argument"` before any workflow phase runs.
- **Fail**: A scope reads a source outside its policy row, the no-flag run skips the scope prompt or resolves an empty answer to something other than `all`, a state log records a scope that does not match the resolved scope, or the unknown value reaches a workflow phase.

### Failure Triage

If a scope touches a source outside its policy row, inspect `field_handling.scope_policy` and the Phase 0 Glob activities in `.skilled/commands/doctor/assets/doctor-deep-loop.yaml`. If the no-flag run skips the scope prompt or applies a different default, inspect the argument parsing in `.skilled/commands/doctor/deep-loop.md` and the scope prompt in `.skilled/commands/doctor/assets/doctor-deep-loop-presentation.txt`. If the unknown value reaches a workflow phase, inspect the argument parsing in `.skilled/commands/doctor/deep-loop.md` and the argument failure block in `.skilled/commands/doctor/assets/doctor-deep-loop-presentation.txt`. If a graph call runs without `--read-only`, inspect the mutation boundary validator steps.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/deep-loop.md](../../../../commands/doctor/deep-loop.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-deep-loop.yaml](../../../../commands/doctor/assets/doctor-deep-loop.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-deep-loop-presentation.txt](../../../../commands/doctor/assets/doctor-deep-loop-presentation.txt)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)

Provenance: manual only - /doctor:deep-loop

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-368
- Feature name: Doctor deep-loop scope
- Command mode: `/doctor:deep-loop --scope`
- YAML asset: `doctor-deep-loop.yaml`
- Graph targets: `.skilled/skills/system-deep-loop/runtime/database/deep-loop-graph.sqlite` and `.skilled/skills/system-deep-loop/runtime/database/council-graph.sqlite`
- Mutation boundary: add-only diagnostic. The workflow writes only its packet-local state log under the active packet's scratch folder, and the iteration markdown files and ai-council artifacts stay read-only inputs.
- Feature file path: `doctor-commands/doctor-deep-loop-scope.md`
