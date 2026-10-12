---
title: "DOC-374 -- Doctor git target menu"
description: "Manual scenario validating that a missing /doctor:git target shows the startup menu and waits, and that --dry-run renders plans without writing."
version: 1.0.0.0
id: doctor-commands-doctor-git-target-menu
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-374 -- Doctor git target menu

## 1. OVERVIEW

This scenario validates target resolution and the dry-run flag of `/doctor:git`. It confirms that with no positional target the first visible response is the presentation contract's startup menu, that no workflow loads until an answer binds a target, and that a later `--dry-run` run renders the change plan and writes nothing.

The run writes no git config value and no repository file, so no disposable copy is required. The before and after config outputs are the proof.

---

## 2. SCENARIO CONTRACT

- Objective: Prove a missing target shows the menu and waits, and prove `--dry-run` renders a plan without writing or asking for approval.
- Playbook ID: DOC-374.
- Real user request: `Run the doctor git command with no target so I can see the menu, then dry-run a hook gate change and show that nothing was written.`
- Prompt: `Run the doctor git command with no target so I can see the menu, then dry-run a hook gate change and show that nothing was written.`
- Preconditions: A working copy of the repository with the shipped gate registry and no positional token in the first command's arguments. No gate change is saved by the run.
- Expected execution process: Record the config state, run `/doctor:git` with no arguments, capture the menu, cancel it, run `/doctor:git hooks --dry-run`, capture the plan and the dry-run line, finish with `done`, and compare the config state.
- Expected signals: The first visible response is the startup menu with `What do you want to change?`, the options `1) Git hook gates`, `2) Commit, PR and branch rules`, `H) Help me decide` and `X) Cancel`, and no gate table, setup dashboard or workflow output appears before an answer. Replying `X` renders `STATUS=CANCELLED ACTION=cancelled`. `/doctor:git hooks --dry-run` renders a `GATE CHANGE PLAN` with the chosen gate, its current state and its exact `Will run` git config command, then the presentation's `Dry run: nothing was written.` line, asks no approval prompt and returns to the change prompt. Replying `done` renders `DOCTOR TARGET CANCELLED` with `Changed: none` and `STATUS=CANCELLED ACTION=cancelled`. `git config --local --get-regexp speckit.hooks` and `git config --global --get-regexp speckit.hooks` return the same output before and after, and `git status --porcelain` is unchanged.
- Desired user-visible outcome: The menu appears and waits for a target, the dry run shows exactly what would change, and nothing is written.
- Pass/fail: PASS if the missing target shows the menu and waits, the dry run renders the plan plus the dry-run line, no approval is asked in the dry run, and no config value or repository file changes.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Run the doctor git command with no target so I can see the menu, then dry-run a hook gate change and show that nothing was written.
```

### Commands

1. Record the starting state: `git config --local --get-regexp speckit.hooks`, `git config --global --get-regexp speckit.hooks` and `git status --porcelain`.
2. Run `/doctor:git` with no arguments through the real runtime.
3. Capture the startup menu and confirm that no gate table, setup dashboard or workflow output appears before an answer is given.
4. Reply `X` and capture the cancelled line.
5. Run `/doctor:git hooks --dry-run` through the real runtime.
6. At the change prompt, reply `cardSync off` and capture the `GATE CHANGE PLAN` including its `Will run` line.
7. Confirm the `Dry run: nothing was written.` line follows, no approval prompt is asked and the change prompt returns.
8. Reply `done` and capture the result block.
9. Record the config commands and the status output again and compare them with step 1.

### Expected

The missing target is not inferred from history or repository state, so the menu is shown once and the command waits. The menu is the whole first response, and the cancellation after it ends the run without loading a workflow.

In the dry run, the plan is fully rendered with the exact git config command that a real run would use, and the dry-run line replaces the approval prompt. Nothing is written, so the config outputs and the working tree are identical afterwards.

### Evidence

- The startup menu text with its four options.
- The absence of workflow output before the menu answer.
- The `STATUS=CANCELLED ACTION=cancelled` line from the `X` answer.
- The `GATE CHANGE PLAN` block with its `Will run` command and the `Dry run: nothing was written.` line.
- The confirmation that no approval prompt was asked.
- The final `DOCTOR TARGET CANCELLED` block with `Changed: none`.
- The step 1 and step 9 config outputs and status output.

### Pass / Fail

- **Pass**: The missing target shows the menu and waits, the dry run renders the plan plus the dry-run line, no approval is asked in the dry run, and no config value or repository file changes.
- **Fail**: A workflow loads before a target is bound, the menu is not the first response, the dry run writes a value or asks for approval, the plan omits the git config command, or a config value or file changes.

### Failure Triage

If a workflow loads without a target, inspect the MANDATORY INPUT GATE in `git.md` and the startup presentation in `doctor-git-presentation.txt`. If the dry-run line is missing, inspect the `dry_run` handling in Phase 3 of `doctor-git-hooks.yaml`. If a write occurs, confirm the plan call runs without `--apply` and compare `git config --local --get-regexp speckit.hooks` before and after.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/git.md](../../../../commands/doctor/git.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-git-hooks.yaml](../../../../commands/doctor/assets/doctor-git-hooks.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-git-presentation.txt](../../../../commands/doctor/assets/doctor-git-presentation.txt)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)
- Gate registry: [.skilled/scripts/git-hooks/lib/gates.tsv](../../../../scripts/git-hooks/lib/gates.tsv)

Provenance: manual only - /doctor:git

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-374
- Feature name: Doctor git target menu
- Command mode: `/doctor:git` and `/doctor:git hooks --dry-run`
- YAML asset: `doctor-git-hooks.yaml`
- Mutation boundary: none. The menu and the dry run read state and render plans, and neither writes a git config value or a repository file.
- Feature file path: `doctor-commands/doctor-git-target-menu.md`
