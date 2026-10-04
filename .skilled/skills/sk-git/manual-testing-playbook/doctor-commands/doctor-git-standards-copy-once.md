---
title: "DOC-371 -- Doctor git standards copy once"
description: "Manual scenario validating that /doctor:git standards copies the shipped sk-git templates into .sk-git once and never overwrites the repository's own copies."
version: 1.1.0.0
id: doctor-commands-doctor-git-standards-copy-once
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-371 -- Doctor git standards copy once

## 1. OVERVIEW

This scenario validates the copy step of `/doctor:git standards`. It confirms that the status phase names the shipped sk-git templates as the active rules, that `init` plans every template copy before writing anything, that the approved write creates the three files under `.sk-git/`, and that a repeated `init` keeps every existing file and never overwrites it.

The scenario writes `.sk-git/` files, so it runs against a disposable copy of the repository and ends by discarding that copy. The shipped templates under `.skilled/skills/sk-git/assets/` and the `skgit.contractDir` setting are never written.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the shipped templates are copied into `.sk-git/` exactly once, that a repeat run keeps the repository's own copies, and that a dry run writes nothing.
- Playbook ID: DOC-371.
- Real user request: `Copy the shipped sk-git templates into .sk-git so this repository can own its rules.`
- Prompt: `Copy the shipped sk-git templates into .sk-git so this repository can own its rules.`
- Preconditions: A disposable copy of the repository with no `.sk-git/` directory and no `skgit.contractDir` override, so the shipped sk-git templates are the active rules.
- Expected execution process: Run `/doctor:git standards`, confirm the status names the shipped templates, capture the init plan, approve the copy, finish with `done`, then repeat the init call after marking one copy to prove it is kept.
- Expected signals: The status phase renders `WHERE THE RULES COME FROM` with the three lookup steps and reports the shipped sk-git templates as the active source, which this command does not edit. The init plan renders `Would copy: .sk-git/commit-message-template.md`, `Would copy: .sk-git/pr-template.md` and `Would copy: .sk-git/worktree-checklist.md`, each with its shipped source path, and with `--dry-run` the presentation's `Dry run: nothing was written.` line follows while `.sk-git/` stays absent. On approve, `init --apply --json` exits 0 with a JSON payload whose `applied` is true and whose `plan` lists each of the three `.sk-git/` files with `action` `copy`, followed by `STATUS=OK MODE=APPLIED`. A repeated `init --apply --json` reports `action` `keep (already present)` for each file and leaves a marker edit inside one copy intact. The result renders `DOCTOR MUTATING RESULT` with `Changed: .sk-git/ files` and `STATUS=OK`, and reminds the operator that `.sk-git/` is ordinary repository content to commit so CI and teammates enforce the same rules. `git status --porcelain .skilled/skills/sk-git/assets` stays empty.
- Desired user-visible outcome: The three templates copied once into `.sk-git/`, the repository's own copies kept on every later run, and a result that says where the rules now live.
- Pass/fail: PASS if the dry run writes nothing, the approved run copies all three templates, the repeat run keeps every existing file and never overwrites it, the shipped assets stay untouched, and the result shows `STATUS=OK`.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Copy the shipped sk-git templates into .sk-git so this repository can own its rules.
```

### Commands

1. Create a disposable copy of the repository, for example a scratch clone under `/tmp/`, and work only inside it.
2. Confirm `.sk-git/` does not exist and no override is configured: `test ! -d .sk-git` and `git config --get skgit.contractDir` exits 1.
3. Optionally run `/doctor:git standards --dry-run` through the real runtime, capture the init plan and the `Dry run: nothing was written.` line, confirm `.sk-git/` still does not exist, and reply `D` at its change menu to finish that run.
4. Run `/doctor:git standards` through the real runtime.
5. Capture the status phase, including the `WHERE THE RULES COME FROM` block and the source it names.
6. At the init prompt, approve the copy and capture the `init --apply --json` output.
7. Confirm the three files exist under `.sk-git/` and record the hash of `.sk-git/commit-message-template.md`.
8. At the change menu, reply `D` to finish and capture the result block.
9. Add a marker comment to `.sk-git/commit-message-template.md`, then repeat the init call the workflow used: `node .skilled/commands/doctor/scripts/git-standards.cjs init --apply --json`.
10. Confirm every `plan` entry in the JSON payload reports `action` `keep (already present)`, and confirm the marker comment survives.
11. Discard the disposable copy and confirm the live working copy has no `.sk-git/` directory and no `skgit.contractDir` setting.

### Expected

The status phase shows that the shipped templates are in force and not editable by this command. The dry run renders the copy plan and writes nothing. The approved init copies the three templates into `.sk-git/` and reports each copy. A later init run finds every file present, keeps it and says so, which proves the repository's own copies are never overwritten.

The shipped assets stay untouched and the result ends with `STATUS=OK` plus the reminder to commit `.sk-git/`.

### Evidence

- The status phase output naming the shipped templates as the active source.
- The init plan lines and the dry-run line.
- The `init --apply --json` output with its JSON payload and `STATUS=OK MODE=APPLIED`.
- The repeated init output with its `keep (already present)` plan entries and the surviving marker comment.
- The `DOCTOR MUTATING RESULT` block with `STATUS=OK`.
- The step 11 confirmation that the live copy is unchanged.

### Pass / Fail

- **Pass**: The dry run writes nothing, the approved run copies all three templates, the repeat run keeps every existing file and never overwrites it, the shipped assets stay untouched, and the result shows `STATUS=OK`.
- **Fail**: The dry run writes a file, a template is not copied, a repeated run overwrites or drops an existing copy, a shipped asset changes, or the result does not show `STATUS=OK`.

### Failure Triage

If a template is not copied, inspect the `init` plan in `git-standards.cjs` and confirm the shipped source exists. If a repeated run overwrites a copy, inspect the `keep (already present)` branch in the same function. If the status names another source, inspect `git config skgit.contractDir` and the resolution order in `message-contract.mjs`.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/git.md](../../../../commands/doctor/git.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-git-standards.yaml](../../../../commands/doctor/assets/doctor-git-standards.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-git-presentation.txt](../../../../commands/doctor/assets/doctor-git-presentation.txt)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)
- Standards writer: [.skilled/commands/doctor/scripts/git-standards.cjs](../../../../commands/doctor/scripts/git-standards.cjs)
- Shipped templates: [.skilled/skills/sk-git/assets/commit-message-template.md](../../../../skills/sk-git/assets/commit-message-template.md)

Provenance: manual only - /doctor:git

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-371
- Feature name: Doctor git standards copy once
- Command mode: `/doctor:git standards`
- YAML asset: `doctor-git-standards.yaml`
- Mutation boundary: only `.sk-git/` copies of the three templates in a disposable copy, written by an approved `init --apply` call. The shipped `.skilled/skills/sk-git/` assets and `git config skgit.contractDir` are never written.
- Feature file path: `doctor-commands/doctor-git-standards-copy-once.md`
