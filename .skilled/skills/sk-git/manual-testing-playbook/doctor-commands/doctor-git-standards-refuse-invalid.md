---
title: "DOC-373 -- Doctor git standards refuse invalid"
description: "Manual scenario validating that /doctor:git standards refuses a rule change the hooks would reject and returns the operator to the change menu."
version: 1.2.0.0
id: doctor-commands-doctor-git-standards-refuse-invalid
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-373 -- Doctor git standards refuse invalid

## 1. OVERVIEW

This scenario validates the refusal path of `/doctor:git standards`. It confirms that a request the contract validator would reject is refused before any write, that the reason names the offending settings, and that the workflow returns the operator to the change menu with the template unchanged.

The refused change writes nothing by contract, and the scenario still runs in the environment because the init step creates `.sk-git/` first. The environment is restored at the end.

---

## 2. SCENARIO CONTRACT

- Objective: Prove an invalid rule change exits with a refusal, leaves the rules block unchanged and returns to the change menu instead of applying anything.
- Playbook ID: DOC-373.
- Real user request: `Let the subject length warning fire at 100 characters, the same as the hard limit.`
- Prompt: `Let the subject length warning fire at 100 characters, the same as the hard limit.`
- Preconditions: The current-code doctor environment at `.worktrees/.doctor-test-environment`, fast-forwarded to `origin/main` with an empty `git status --porcelain`, with no `.sk-git/` directory and no `skgit.contractDir` override, so the shipped sk-git templates are the active rules and the run offers the init copy that creates the editable `.sk-git/` files.
- Expected execution process: Run `/doctor:git standards` in the environment, approve the init copy, request the invalid `subject.warnLength` value, capture the exit 2 refusal, confirm the change menu returns, finish with `done`, and restore the environment.
- Expected signals: The plan call `set commit subject.warnLength 100 --json` exits 2 with stderr beginning `git-standards:` and a reason that reads `the change would break the commit rules block, so nothing was written` and names `subject.warnLength` and `subject.maxLength`. The stdout carries a `STATUS=FAIL ERROR=` line with the same reason. The workflow renders the reason and returns to the `What should change?` menu without running an `--apply` call. The hash of `.sk-git/commit-message-template.md` is identical before and after the attempt, and `check --json` returns the same exit code and `STATUS` line as before it. Replying `D` renders `DOCTOR TARGET CANCELLED` with `Changed: .sk-git/ files` for the init copies applied before the cancel and `STATUS=CANCELLED ACTION=cancelled`.
- Desired user-visible outcome: The refused change is explained, nothing is written, and the operator can pick a value the gates accept.
- Pass/fail: PASS if the invalid change exits 2 with the shape reason, no write occurs, the change menu returns, the check result is unchanged, and the result shows `Changed: .sk-git/ files`.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Let the subject length warning fire at 100 characters, the same as the hard limit.
```

### Commands

1. `cd .worktrees/.doctor-test-environment`, run `git fetch origin` and `git merge --ff-only origin/main`, and confirm `git status --porcelain` prints nothing.
2. Confirm `.sk-git/` does not exist and no override is configured: `test ! -d .sk-git` and `git config --get skgit.contractDir` exits 1, then run `/doctor:git standards` through the real runtime and approve the init copy so `.sk-git/` holds editable templates.
3. Record the baseline: `shasum -a 256 .sk-git/commit-message-template.md` and `node .skilled/commands/doctor/scripts/git-standards.cjs check --json` with its exit code.
4. At the change menu, choose `1` for a rule setting, kind `commit`, setting `subject.warnLength`, value `100`.
5. Capture the stderr reason, the stdout `STATUS=FAIL ERROR=` line and the exit code, which is 2.
6. Confirm the workflow renders the reason and returns to the `What should change?` menu, and that no `--apply` call ran.
7. Record the template hash and the `check --json` output again and compare them with step 3.
8. Reply `D` and capture the result block.
9. Restore every file the scenario changed with `git checkout -- <path>`, remove any file it added, and confirm `git status --porcelain` prints nothing.

### Expected

The invalid value is refused by the same shape check the gates use, so the request ends with exit 2 and a reason that names both settings. The template is byte-identical after the attempt, the check result is unchanged, and the operator is returned to the change menu to pick another value.

No rule change is approved, so the run ends with the presentation contract's cancelled result, whose `Changed:` line reports the `.sk-git/` files the approved init copied before the cancel.

### Evidence

- The stderr reason naming `subject.warnLength` and `subject.maxLength`.
- The exit code and the stdout `STATUS=FAIL ERROR=` line.
- The returned `What should change?` menu.
- The before and after template hashes.
- The before and after `check --json` outputs with their exit codes.
- The `DOCTOR TARGET CANCELLED` block with `Changed: .sk-git/ files`.
- The final `git status --porcelain` output from step 9.

### Pass / Fail

- **Pass**: The invalid change exits 2 with the shape reason, no write occurs, the change menu returns, the check result is unchanged, and the result shows `Changed: .sk-git/ files`.
- **Fail**: The script exits 0, a write occurs, the reason is missing or does not name both settings, the workflow treats the change as applied, or the template changes in any way.

### Failure Triage

If the change is accepted, inspect `contractShapeErrors` and the `warnLength` comparison in `message-contract.mjs`. If the reason appears without a return to the menu, inspect the refusal branch in Phase 4 of `doctor-git-standards.yaml`. If the template changes, restore the environment with the recorded undo, confirm the hash, and report the run as `FAIL`.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/git.md](../../../../commands/doctor/git.md)
- Matching YAML asset: [.skilled/commands/doctor/assets/doctor-git-standards.yaml](../../../../commands/doctor/assets/doctor-git-standards.yaml)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-git-presentation.txt](../../../../commands/doctor/assets/doctor-git-presentation.txt)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)
- Standards writer: [.skilled/commands/doctor/scripts/git-standards.cjs](../../../../commands/doctor/scripts/git-standards.cjs)
- Contract validator: [.skilled/skills/sk-git/scripts/lib/message-contract.mjs](../../../../skills/sk-git/scripts/lib/message-contract.mjs)
- Environment guide: [doctor-commands README](../../../system-spec-kit/manual-testing-playbook/doctor-commands/README.md)

Provenance: manual only - /doctor:git

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-373
- Feature name: Doctor git standards refuse invalid
- Command mode: `/doctor:git standards`
- YAML asset: `doctor-git-standards.yaml`
- Mutation boundary: none for the refused change. The init step is the only write, creates `.sk-git/` in the environment, and the refused `set` call leaves the rules block unchanged. The environment is restored after the run.
- Feature file path: `doctor-commands/doctor-git-standards-refuse-invalid.md`
