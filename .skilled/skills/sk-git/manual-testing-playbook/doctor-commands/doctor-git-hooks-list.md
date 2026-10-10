---
title: "DOC-369 -- Doctor git hooks list"
description: "Manual scenario validating that /doctor:git hooks lists every shipped hook gate with its local, global and effective setting and reports the hook install state."
version: 1.0.0.0
id: doctor-commands-doctor-git-hooks-list
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-369 -- Doctor git hooks list

## 1. OVERVIEW

This scenario validates `/doctor:git hooks` against the shipped gate registry. It confirms that Phase 1 reads `git-hook-gates.cjs list --json` and `install-git-hooks.sh --status`, that the rendered table carries one row per gate line in `gates.tsv` with the saved local value, the saved global value and the effective state, and that the install block names `core.hooksPath` plus each hook.

The run approves no change, so every write path stays unused and the report is the presentation contract's cancelled result. The scenario is read-only and safe to run in the live working copy.

---

## 2. SCENARIO CONTRACT

- Objective: Prove every gate in `gates.tsv` appears with its hook, saved local and global values, effective state and description, and prove the install status reports the hooks path and each hook's state.
- Playbook ID: DOC-369.
- Real user request: `List the git hook gates with their saved settings and show the hook install state.`
- Prompt: `List the git hook gates with their saved settings and show the hook install state.`
- Preconditions: A working copy of the repository with the shipped `.skilled/scripts/git-hooks/lib/gates.tsv` and a hook install readable through `bash .skilled/scripts/install-git-hooks.sh --status`.
- Expected execution process: Run `/doctor:git hooks`, capture the gate table, the hand-off block and the install status, reply `done` without approving a change, and compare the local `speckit.hooks` config before and after.
- Expected signals: The gate table has one row per gate line in `gates.tsv`, thirteen rows in the shipped registry, each naming its key, hook, saved local value, saved global value, effective state and description. The non-persistable rows `remotePush` and `massDeletion` read `per push only` in the effective column. The install block starts `HOOK INSTALL` and shows the `core.hooksPath` line plus each hook as linked, SHADOWED or missing. The `SWITCHES THIS COMMAND DOES NOT SAVE` block names `remotePush` and `massDeletion` as per-push approvals, points the commit-msg rules at `/doctor:git standards`, and lists `SYSTEM_GIT_COMMIT_HOOKS_DISABLED`, `SYSTEM_GIT_HOOKS_CHECK_DISABLED`, `SK_GIT_PREFLIGHT_DISABLED` and `SYSTEM_GIT_WORKTREE_GUARD_DISABLED` under `/doctor:env`. `node .skilled/commands/doctor/scripts/git-hook-gates.cjs list --json` exits 0 with `STATUS=OK GATES=13 OFF=<count>`, and `bash .skilled/scripts/install-git-hooks.sh --status` exits 0 with the hooks path and one line per hook. Replying `done` renders `DOCTOR TARGET CANCELLED` with `Target: hooks`, `Changed: none` and `STATUS=CANCELLED ACTION=cancelled`. `git config --local --get-regexp speckit.hooks` returns the same output before and after the run and `git status --porcelain` is unchanged.
- Desired user-visible outcome: The gate table with both saved values and the effective state, the hand-off for the switches owned elsewhere, the install state, and a summary that shows the run changed nothing.
- Pass/fail: PASS if every gate in `gates.tsv` appears with its hook, saved local and global values and effective state, the install block reports the hooks path and each hook, and no git config value or repository file changes.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
List the git hook gates with their saved settings and show the hook install state.
```

### Commands

1. Confirm the working copy is clean and record the saved gate settings: `git config --local --get-regexp speckit.hooks`. The command exits 1 with no output when no gate is saved locally.
2. Run `/doctor:git hooks` through the real runtime.
3. Capture the Phase 1 gate table, the `HOOK INSTALL` block and the `SWITCHES THIS COMMAND DOES NOT SAVE` block.
4. At the change prompt, reply `done`.
5. Capture the result block.
6. Run `node .skilled/commands/doctor/scripts/git-hook-gates.cjs list --json` and keep its exit code, the `gates` array length and the `STATUS=OK GATES=13 OFF=<count>` line.
7. Run `bash .skilled/scripts/install-git-hooks.sh --status` and keep the `core.hooksPath` line plus each hook line.
8. Record `git config --local --get-regexp speckit.hooks` again and compare it with step 1.
9. Run `git status --porcelain` and confirm the working tree is unchanged.

### Expected

Every gate line in `gates.tsv` appears in the rendered table with the saved local value, the saved global value, the effective state and the description taken from the registry. The non-persistable per-push approvals show `per push only`, and the hand-off block names every switch this command does not save. The install block reports where the hooks resolve and flags a SHADOWED hook as another checkout's copy that may predate the gate settings.

The run writes no git config value and no repository file. Replying `done` without approving a change renders the cancelled result with `Changed: none`.

### Evidence

- The rendered gate table and the `SWITCHES THIS COMMAND DOES NOT SAVE` block.
- The `HOOK INSTALL` lines, including the `core.hooksPath` line and any SHADOWED or missing hook.
- The `list --json` exit code, the `gates` array length and the `STATUS=OK GATES=13 OFF=<count>` line.
- The `install-git-hooks.sh --status` output with its exit code.
- The `DOCTOR TARGET CANCELLED` block.
- The step 1 and step 8 config outputs and the step 9 status output.

### Pass / Fail

- **Pass**: Every gate line in `gates.tsv` appears with its hook, saved local and global values and effective state, the install block reports the hooks path and each hook, and no git config value or repository file changes.
- **Fail**: A gate is missing, a saved value or effective state is absent or inconsistent, the install block is missing, the per-push approvals are presented as saveable, a config value or file changes, or the run does not end with the cancelled result.

### Failure Triage

If a gate row is missing, inspect `readRegistry` in `git-hook-gates.cjs` and the matching line in `gates.tsv`. If a hook shows as missing or SHADOWED, run `bash .skilled/scripts/install-git-hooks.sh --status` on its own and inspect the `core.hooksPath` read. If the effective state disagrees with the saved values, inspect `gate-config.sh` and the gate's `persistable` column, and confirm the report names the scope that still decides the gate.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/git.md](../../../../commands/doctor/git.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-git-hooks.yaml](../../../../commands/doctor/assets/doctor-git-hooks.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-git-presentation.txt](../../../../commands/doctor/assets/doctor-git-presentation.txt)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)
- Gate registry: [.skilled/scripts/git-hooks/lib/gates.tsv](../../../../scripts/git-hooks/lib/gates.tsv)
- Hook installer: [.skilled/scripts/install-git-hooks.sh](../../../../scripts/install-git-hooks.sh)

Provenance: manual only - /doctor:git

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-369
- Feature name: Doctor git hooks list
- Command mode: `/doctor:git hooks`
- YAML asset: `doctor-git-hooks.yaml`
- Mutation boundary: none. The run reads the gate registry, the saved settings and the install state, and writes no git config value and no repository file.
- Feature file path: `doctor-commands/doctor-git-hooks-list.md`
