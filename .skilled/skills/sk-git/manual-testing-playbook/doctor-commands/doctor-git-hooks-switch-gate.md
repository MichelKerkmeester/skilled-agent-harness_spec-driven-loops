---
title: "DOC-370 -- Doctor git hooks switch gate"
description: "Manual scenario validating that /doctor:git hooks switches one gate only after showing the exact git config command and getting an approval."
version: 1.1.0.0
id: doctor-commands-doctor-git-hooks-switch-gate
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-370 -- Doctor git hooks switch gate

## 1. OVERVIEW

This scenario validates the switch flow of `/doctor:git hooks` for one persistable gate. It confirms that the change plan names the exact `git config --local` command before any write, that a declined approval writes nothing, that an approved change is applied through one `git-hook-gates.cjs set --apply` call, and that a re-read proves the new effective state.

The scenario writes local git config, so it runs against a disposable copy of the repository and ends by discarding that copy. The shipped hook scripts and `core.hooksPath` are never touched.

---

## 2. SCENARIO CONTRACT

- Objective: Prove one gate can be switched off only after its exact git config command was shown and approved, prove the effective state changes for that gate, and prove every other gate keeps its recorded setting.
- Playbook ID: DOC-370.
- Real user request: `Switch the cardSync hook gate off for this repository after showing me the git config command.`
- Prompt: `Switch the cardSync hook gate off for this repository after showing me the git config command.`
- Preconditions: A disposable copy of the repository (a scratch clone or a separate git worktree) with the shipped gate registry and the hook install readable, and a clean starting state where `cardSync` is not saved in local or global config.
- Expected execution process: Record the pre-change gate state, run `/doctor:git hooks`, decline one change, approve the `cardSync off` change, capture the plan, the apply output and the re-read, finish with `done`, and discard the copy.
- Expected signals: The first `cardSync off` request renders the `GATE CHANGE PLAN` block with `Gate: cardSync (pre-commit)`, the current state, `Change: off in local config`, `Will run: git config --local --replace-all speckit.hooks.cardSync off` and the `SPECKIT_SKIP_CARD_SYNC` bypass line, then asks `Apply this change? Reply approve to write it, or no to cancel.` Replying `no` records the change as cancelled, returns to the change prompt and leaves the config unchanged. Replying `approve` on the second request runs `set cardSync off --scope local --apply --json`, which exits 0 with a JSON payload carrying `applied` true, a `commands` list naming `git config --local --replace-all speckit.hooks.cardSync off`, and the before and after states, followed by `STATUS=OK MODE=APPLIED KEY=cardSync`. The re-read `list --json` shows `effective.state` `off` from `local config` for `cardSync`, and every other gate keeps its recorded local, global and effective values. The result renders `DOCTOR MUTATING RESULT` with `Target: hooks`, `Changed: git config --local speckit.hooks.cardSync off`, a `Verification` line naming the re-read setting, an `Undo` line naming the same set call with the previous state and `STATUS=OK`. `git config --local --get-regexp speckit.hooks` in the live working copy is identical before and after the scenario.
- Desired user-visible outcome: A plan that shows the exact config command, a write only after `approve`, a verified off state for `cardSync`, and a recorded undo.
- Pass/fail: PASS if the plan names the exact `git config --local` command before the approval, nothing is written for the declined request, the approved request writes the one local value and verifies `off`, every other gate is unchanged, and the result names the undo with `STATUS=OK`.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Switch the cardSync hook gate off for this repository after showing me the git config command.
```

### Commands

1. Create a disposable copy of the repository, for example a scratch clone under `/tmp/`, and work only inside it.
2. Record the pre-change state: `git config --local --get-regexp speckit.hooks` and `node .skilled/commands/doctor/scripts/git-hook-gates.cjs list --json`.
3. Run `/doctor:git hooks` through the real runtime.
4. At the change prompt, reply `cardSync off`, capture the full `GATE CHANGE PLAN` block including the `Will run` line, then answer `no`.
5. Confirm the change is recorded as cancelled, the change prompt returns and `git config --local --get-regexp speckit.hooks` is unchanged.
6. Reply `cardSync off` again and capture the plan block.
7. Answer `approve` and capture the apply output plus the re-read `list --json`.
8. Reply `done` and capture the result block.
9. Compare the gate list with step 2 and confirm only `cardSync` changed.
10. Discard the disposable copy and confirm the live working copy's `git config --local --get-regexp speckit.hooks` and `git status --porcelain` match their pre-scenario values.

### Expected

The plan is shown before the approval prompt and names the exact `git config --local` command that the apply call will run. A declined approval writes nothing and returns to the change prompt. The approved change is one set call with `--apply` for `cardSync` in local config, and the re-read proves the gate is now off for this repository while every other gate keeps its previous value.

The success result names the changed key and scope, the verification and the undo command that restores the previous state.

### Evidence

- The two `GATE CHANGE PLAN` blocks with their `Will run` and bypass lines.
- The cancelled change record from the declined request and the unchanged config output that follows it.
- The `set ... --apply --json` output with its JSON payload and `STATUS=OK MODE=APPLIED KEY=cardSync`.
- The pre-change and post-change `list --json` outputs.
- The `DOCTOR MUTATING RESULT` block including the verification and undo lines.
- The step 9 comparison and the step 10 confirmation that the live copy is unchanged.

### Pass / Fail

- **Pass**: The plan names the exact `git config --local` command before the approval, the declined request writes nothing, the approved request writes one local value and the re-read shows `off` from local config, every other gate is unchanged, and the result names the undo with `STATUS=OK`.
- **Fail**: A write happens before the approval, the plan omits the exact command, the declined request changes config, the effective state is not off after the approved write, another gate changes, or the undo is missing.

### Failure Triage

If a write happens before the approval, inspect the approval step in Phase 3 of `doctor-git-hooks.yaml` and confirm the plan call runs without `--apply`. If the re-read does not show `off`, inspect the scope that still decides the gate, report it as the workflow requires, and inspect `gate-config.sh`. If `set` exits 2, the key is not persistable or unknown, so render the script reason and the presentation pointer and pick a persistable gate.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/git.md](../../../../commands/doctor/git.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-git-hooks.yaml](../../../../commands/doctor/assets/doctor-git-hooks.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-git-presentation.txt](../../../../commands/doctor/assets/doctor-git-presentation.txt)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)
- Gate registry: [.skilled/scripts/git-hooks/lib/gates.tsv](../../../../scripts/git-hooks/lib/gates.tsv)
- Gate writer: [.skilled/commands/doctor/scripts/git-hook-gates.cjs](../../../../commands/doctor/scripts/git-hook-gates.cjs)

Provenance: manual only - /doctor:git

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-370
- Feature name: Doctor git hooks switch gate
- Command mode: `/doctor:git hooks`
- YAML asset: `doctor-git-hooks.yaml`
- Mutation boundary: one `git config --local speckit.hooks.cardSync` value in a disposable copy, written by one approved `set --apply` call. The shipped hook scripts, `gates.tsv` and `core.hooksPath` are never written.
- Feature file path: `doctor-commands/doctor-git-hooks-switch-gate.md`
