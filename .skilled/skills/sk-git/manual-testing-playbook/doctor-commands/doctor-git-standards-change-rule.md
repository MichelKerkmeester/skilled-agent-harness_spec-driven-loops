---
title: "DOC-372 -- Doctor git standards change rule"
description: "Manual scenario validating that /doctor:git standards changes or removes one rule and points out the template prose that still describes the old rule."
version: 1.0.0.0
id: doctor-commands-doctor-git-standards-change-rule
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-372 -- Doctor git standards change rule

## 1. OVERVIEW

This scenario validates the rule change flow of `/doctor:git standards`. It confirms that a change plan names the setting, its old and new value, the rule ids that switch on or off and every prose passage that still states the old rule, that the prose follow-up is offered after the write, and that the check ends clean once the prose matches the rules block.

The scenario writes `.sk-git/` files, so it runs against a disposable copy of the repository and ends by discarding that copy. The rules block itself is only ever changed through the script, and the shipped assets stay untouched.

---

## 2. SCENARIO CONTRACT

- Objective: Prove one rule setting change and one rule setting removal each name their prose drift before the write, that only the named prose lines change on approval, and that the check ends clean.
- Playbook ID: DOC-372.
- Real user request: `Raise the commit subject limit to 120 characters and point out any template prose that still states the old limit.`
- Prompt: `Raise the commit subject limit to 120 characters and point out any template prose that still states the old limit.`
- Preconditions: A disposable copy of the repository where the shipped sk-git templates are the active rules, so the init step can copy them into `.sk-git/`.
- Expected execution process: Run `/doctor:git standards`, approve the init copy, change `subject.maxLength` to 120, approve the write and the prose follow-up, remove `subject.warnLength`, approve again, finish with `done`, and discard the copy.
- Expected signals: The first plan renders `RULE CHANGE PLAN` with `Template: .sk-git/commit-message-template.md`, `Setting: commit subject.maxLength: 100 -> 120`, the `Rules switched on` and `Rules switched off` lines and `Prose to update:` lines naming each passage that still states 100 characters for `subject.max-length`, including the contract paragraph and the self-check bullet. The second plan renders `Setting: commit subject.warnLength: 80 -> null`, `Rules switched off: subject.length-target` and a `Prose to update:` line naming the prose that still names `subject.length-target`. After each approved write the presentation asks `The template's prose still states the old rule. Update those lines in .sk-git/commit-message-template.md to match? Reply approve, or no to leave them.` and only the named lines change. `check --json` exits 0 with `STATUS=OK DRIFT=0 BROKEN=0` after the prose edits. The result renders `DOCTOR MUTATING RESULT` with `STATUS=OK`, each applied change, the files written, the last check result and the undo for each.
- Desired user-visible outcome: Each rule change states its prose drift up front, the prose is brought back in line only on approval, and the final check is clean.
- Pass/fail: PASS if every plan names its prose drift before the write, the prose follow-up is offered after each write, only the named lines change, both checks end clean, and the result lists the changes, files, check result and undo with `STATUS=OK`.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
Raise the commit subject limit to 120 characters and point out any template prose that still states the old limit.
```

### Commands

1. Create a disposable copy of the repository, for example a scratch clone under `/tmp/`, and work only inside it.
2. Confirm the shipped sk-git templates are the active rules: `node .skilled/commands/doctor/scripts/git-standards.cjs status --json`.
3. Run `/doctor:git standards` through the real runtime and approve the init copy so `.sk-git/` holds editable templates.
4. At the change menu, choose `1` for a rule setting, kind `commit`, setting `subject.maxLength`, value `120`.
5. Capture the `RULE CHANGE PLAN`, including the `Setting`, `Rules switched on`, `Rules switched off` and `Prose to update` lines, then approve.
6. Capture the apply output, then approve the prose follow-up and confirm only the named prose lines changed.
7. Run `node .skilled/commands/doctor/scripts/git-standards.cjs check --json` and keep its exit code and `STATUS` line.
8. At the change menu, choose `2` for a rule setting removal, kind `commit`, setting `subject.warnLength`.
9. Capture the second plan with its `Rules switched off` and `Prose to update` lines, approve, then approve the prose follow-up.
10. Run `check --json` again and keep its exit code and `STATUS` line.
11. Reply `D` to finish and capture the result block.
12. Discard the disposable copy and confirm the live working copy has no `.sk-git/` directory and unchanged shipped assets.

### Expected

Each plan states the setting change or removal, the rules it switches, and every prose passage that still states the old rule. The write happens only after the approval prompt, and the prose follow-up runs after the write and edits only the lines the drift findings name. The rules block is never touched by hand.

The final check is clean and the result lists every applied change, the files written, the last check result and the undo for each. The result also reminds the operator that `.sk-git/` is ordinary repository content to commit.

### Evidence

- Both plan blocks with their `Setting`, `Rules switched on`, `Rules switched off` and `Prose to update` lines.
- Both prose follow-up prompts and the diff showing only the named lines changed.
- Both `check --json` outputs with their exit codes and `STATUS` lines.
- The template diffs showing that only the rules block and the named prose lines changed.
- The `DOCTOR MUTATING RESULT` block with the files written and the undo for each change.
- The step 12 confirmation that the live copy is unchanged.

### Pass / Fail

- **Pass**: Every plan names its prose drift before the write, the prose follow-up is offered after each write, only the named lines change, both checks end clean, and the result lists the changes, files, check result and undo with `STATUS=OK`.
- **Fail**: A plan omits the prose drift, a write happens without approval, the prose edit touches lines outside the drift findings, the rules block is edited by hand, a check still reports drift or a broken block, or the result is not `STATUS=OK`.

### Failure Triage

If a plan lists no prose drift, inspect `templateDriftErrors` and `lengthLiteralErrors` in `message-contract.mjs` and confirm the prose names the changed rule id. If the prose prompt does not appear, inspect Phase 6 of `doctor-git-standards.yaml`. If `check` exits 1, the remaining drift is reported and the prose follow-up was skipped, so repeat it. If `check` exits 2, the block is broken, so restore the copy with the recorded undo and report the run as `FAIL`.

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
- Playbook ID: DOC-372
- Feature name: Doctor git standards change rule
- Command mode: `/doctor:git standards`
- YAML asset: `doctor-git-standards.yaml`
- Mutation boundary: the rules block and the named prose lines in `.sk-git/commit-message-template.md` inside a disposable copy. The rules block changes only through `git-standards.cjs` after an approved plan, and the shipped assets stay untouched.
- Feature file path: `doctor-commands/doctor-git-standards-change-rule.md`
