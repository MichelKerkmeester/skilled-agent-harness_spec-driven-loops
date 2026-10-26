---
title: "DOC-393 -- Doctor CI scaffold"
description: "Manual scenario validating that /doctor:ci scaffold prints its plan and the whole proposed workflow under --dry-run without writing a file, and that answering no to the approval prompt also writes nothing."
version: 1.0.0.0
id: doctor-commands-doctor-ci-scaffold
expected_workflow_mode: sk-code-ci
expected_leaf_resources: []
---

# DOC-393 -- Doctor CI scaffold

## 1. OVERVIEW

This scenario validates `/doctor:ci scaffold`, the route that creates one new GitHub Actions workflow under `.github/workflows/` from the workflow standards templates. The route prints a plan and the whole proposed file, and it writes the file only after the operator answers yes.

The scenario checks the two paths that must leave the tree untouched: `--dry-run`, which stops before the approval prompt, and a `no` answer to the prompt. It also checks the refusals that fire before any plan is shown. A scaffold that writes a file on a dry run, writes after a `no`, or overwrites an existing workflow fails the scenario.

---

## 2. SCENARIO CONTRACT

- Objective: Prove `/doctor:ci scaffold` prints the plan and the whole proposed file under `--dry-run` and writes nothing, treats a `no` answer as a cancellation that writes nothing, and refuses an existing or protected target before any plan is shown.
- Playbook ID: DOC-393.
- Real user request: `Scaffold a new CI workflow called probe-check.yml and show me the file before you write anything.`
- Prompt: `Scaffold a new CI workflow called probe-check.yml and show me the file before you write anything.`
- Preconditions: The shared current-code doctor environment at `.worktrees/.doctor-test-environment`, fast-forwarded to `origin/main` with an empty `git status --porcelain`. No workflow file named `probe-check.yml` exists under the workflows directory. No GitHub login is needed, because the route makes no GitHub call.
- Expected execution process: Confirm the target name is free, run the route with `--dry-run`, run it again without `--dry-run` and answer no, then run it with the name of an existing workflow, and confirm the tree is unchanged after every step.
- Expected signals: The dry run prints `WORKFLOW SCAFFOLD PLAN` with the target path, the two templates, a switch group, a timeout and the README row, then the whole file between `--- proposed file ---` and `--- end of file ---`, then `Dry run: nothing was written.`, and it asks no question. The second run prints the same plan and `Write this file? [yes/no]`; the answer no ends with `STATUS=CANCELLED ACTION=cancelled` and `Changed: none`. The existing-name run prints `REFUSE: the target path already exists; scaffold creates new workflows only` and `STATUS=FAIL ERROR="refused"` without a plan.
- Desired user-visible outcome: The operator sees exactly the file the route would create before anything is written, and a refusal or a no leaves the repository as it was.
- Pass/fail: PASS if the dry run prints the plan and the whole file and writes nothing, the no answer ends in the cancelled result and writes nothing, the existing-name run is refused without a plan and `git status --porcelain` stays empty after every step.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Scaffold a new CI workflow called probe-check.yml and show me the file before you write anything.
```

### Commands

1. `cd .worktrees/.doctor-test-environment`, run `git fetch origin` and `git merge --ff-only origin/main`, and confirm `git status --porcelain` prints nothing. Confirm `ls .github/workflows | grep probe-check` prints nothing. Run every step below inside the environment.
2. Run `/doctor:ci scaffold --name=probe-check.yml --dry-run` in the AI runtime, answer the route's questions with the TESTS switch group and the default timeout, and capture the output.
3. Confirm `git status --porcelain` prints nothing and `ls .github/workflows | grep probe-check` still prints nothing.
4. Run `/doctor:ci scaffold --name=probe-check.yml` without `--dry-run`, answer the questions the same way, and answer `no` at the `Write this file? [yes/no]` prompt. Capture the output.
5. Confirm `git status --porcelain` prints nothing and `ls .github/workflows | grep probe-check` still prints nothing.
6. Run `/doctor:ci scaffold --name=<the name of any file already under .github/workflows/> --dry-run` and capture the output. Repeat with `--name=Probe_Check.yml` and capture the output.
7. Confirm `git status --porcelain` prints nothing after the last run.

### Expected

Step 2 prints the plan, with `Target file: .github/workflows/probe-check.yml`, both template paths, `Switch group: TESTS` and the timeout, then the whole proposed file. The file carries a timeout, a permissions block, a concurrency block and a switch condition on the TESTS group variable. The output ends with `Dry run: nothing was written.` and asks no yes or no question.

Step 4 prints the same plan and the prompt `Write this file? [yes/no]`. After the answer no it prints `DOCTOR TARGET CANCELLED`, `Changed: none` and `STATUS=CANCELLED ACTION=cancelled`.

Steps 3, 5 and 7 print nothing from `git status --porcelain`, and the probe file does not exist.

Step 6 prints `REFUSE: the target path already exists; scaffold creates new workflows only` for the existing name and `REFUSE: Probe_Check.yml is not a bare lowercase hyphen-case name ending in .yml` for the second name. Each run ends with `STATUS=FAIL ERROR="refused"` and shows no plan.

### Evidence

- The step 2 output, including the proposed file.
- The step 4 output and the answer given.
- The step 6 output for both names.
- The `git status --porcelain` output and an `ls .github/workflows | grep probe-check` result after steps 3, 5 and 7.

### Pass / Fail

- **Pass**: The dry run prints the plan and the whole file and ends with `Dry run: nothing was written.`, the no answer ends in `STATUS=CANCELLED ACTION=cancelled`, both bad names are refused without a plan and no step creates or changes a file.
- **Fail**: A dry run writes a file or asks for approval, a no answer writes a file, an existing workflow is offered for overwrite, a refusal still shows a plan, or `git status --porcelain` prints anything after any step.

### Failure Triage

If the dry run writes a file, read `phase_4_plan_and_approval` in the matching YAML asset, since the dry-run line must precede the approval prompt. If a file appears after the no answer, read the same phase for the rule that any answer other than yes counts as no. If the proposed file lacks a timeout, permissions block or concurrency block, compare it with `.skilled/skills/sk-code/sk-code-ci/assets/workflow-template.yml`. Remove any file a failed run created before the next run.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/ci.md](../../../../commands/doctor/ci.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-ci-scaffold.yaml](../../../../commands/doctor/assets/doctor-ci-scaffold.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-ci-presentation.txt](../../../../commands/doctor/assets/doctor-ci-presentation.txt)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)
- Category notes: [doctor-commands README](README.md)

Provenance: manual only - /doctor:ci scaffold

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-393
- Feature name: Doctor CI scaffold
- Command mode: `/doctor:ci scaffold`
- YAML asset: `doctor-ci-scaffold.yaml`
- Mutation boundary: the route can create one new file under `.github/workflows/` only after a yes. Every step of this scenario uses `--dry-run` or answers no, so it writes nothing.
- Feature file path: `doctor-commands/doctor-ci-scaffold.md`
