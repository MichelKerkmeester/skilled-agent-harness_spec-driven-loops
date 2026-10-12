---
title: "GIT-045 -- Template rules block nonconforming commits"
description: "This scenario validates Template rules block nonconforming commits for `GIT-045`. It focuses on verify a repository's own rules block decides what the commit-msg gate refuses, with no bypass."
version: 1.0.0.0
---

# GIT-045 -- Template rules block nonconforming commits

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `GIT-045`.

---

## 1. OVERVIEW

This scenario validates Template rules block nonconforming commits for `GIT-045`. It focuses on verify a repository's own rules block decides what the commit-msg gate refuses, with no bypass.

### Why This Matters

The gates hold a repository to the rules its own template declares, not to rules written into the code. If editing the template did not change the verdict, or the retired bypass variable still let a commit through, another repository could not adopt the contract and the gate could be switched off from the environment.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-045` and confirm the expected signals without contradictory evidence.

- Objective: verify a repository's own rules block decides what the commit-msg gate refuses, with no bypass.
- Real user request: `Show me that the commit hook follows my repository's template and cannot be skipped.`
- Prompt: `In a scratch repository, show that commits are unchecked until a commit template with a rules block is added, that a nonconforming commit is then blocked even with the old bypass variable set, and that editing the rules block changes the verdict.`
- Expected execution process: Create a scratch repository that uses the managed hooks, confirm `--explain` reports no contract, copy the sk-git commit template into `.sk-git/`, attempt a nonconforming commit with and without `SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1`, make a conforming commit, then lower `maxLength` in the copied rules block and retry a longer conforming subject.
- Expected signals: `--explain` first prints `No contract directory`, then `commit  enforced from .../.sk-git/commit-message-template.md`. The nonconforming commit exits 1 with `[subject.format]` and `[body.required]` both times. The conforming commit succeeds. After the edit, a 48-character subject fails with `[subject.max-length] Subject is 48 characters; maximum is 30.`
- Desired user-visible outcome: A concise PASS or FAIL verdict naming the rule ids each attempt reported. SKIP only when the sandbox has no writable scratch directory or no `node`.
- Pass/fail: PASS if every expected signal appears and no nonconforming commit lands. FAIL if a nonconforming commit is created, the bypass variable changes the exit code, or the edited `maxLength` is ignored.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the scratch repository sits outside the working checkout so no real history is touched.
3. Execute the command sequence exactly as written, from the repository root.
4. Capture the expected signals and evidence artifacts.
5. Return a concise user-facing verdict with failure triage if needed.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| GIT-045 | Template rules block nonconforming commits | verify a repository's own rules block decides what the commit-msg gate refuses, with no bypass. | `In a scratch repository, show that commits are unchecked until a commit template with a rules block is added, that a nonconforming commit is then blocked even with the old bypass variable set, and that editing the rules block changes the verdict.` | 1. `bash: R=$(mktemp -d) && git -C "$R" init -q && git -C "$R" config core.hooksPath "$PWD/.skilled/scripts/git-hooks"` -> 2. `bash: node .skilled/skills/sk-git/scripts/validate-message.mjs --repo "$R" --explain` -> 3. `bash: mkdir "$R/.sk-git" && cp .skilled/skills/sk-git/assets/commit-message-template.md "$R/.sk-git/" && node .skilled/skills/sk-git/scripts/validate-message.mjs --repo "$R" --explain` -> 4. `bash: git -C "$R" commit --allow-empty -m "Fixed stuff"; echo rc=$?` -> 5. `bash: SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1 git -C "$R" commit --allow-empty -m "Fixed stuff"; echo rc=$?` -> 6. `bash: git -C "$R" commit --allow-empty -m "docs(readme): record the scratch baseline" -m "A scratch commit that follows the template rules."; echo rc=$?` -> 7. `bash: sed -i.bak 's/"maxLength": 100,/"maxLength": 30,/' "$R/.sk-git/commit-message-template.md" && git -C "$R" commit --allow-empty -m "docs(readme): record the second scratch baseline" -m "A body line."; echo rc=$?` | Step 2 prints `No contract directory`. Step 3 prints `commit  enforced from`. Steps 4 and 5 print `[subject.format]` and `[body.required]` with `rc=1`. Step 6 prints `rc=0`. Step 7 prints `[subject.max-length] Subject is 48 characters; maximum is 30.` with `rc=1`. | The transcript of all seven steps and `git -C "$R" log --oneline` showing exactly one commit. | PASS if every expected signal appears and no nonconforming commit lands. FAIL if a nonconforming commit is created, the bypass variable changes the exit code, or the edited `maxLength` is ignored. | Run `node .skilled/skills/sk-git/scripts/validate-message.mjs --repo "$R" --explain` to see which template was resolved, then check that `$R/.git/hooks` is not shadowing `core.hooksPath` and inspect `.skilled/scripts/git-hooks/commit-msg` and `scripts/lib/message-contract.mjs`. |

### Optional Supplemental Checks

Run `git -C "$R" commit --allow-empty --no-verify -m "Fixed stuff"` and then the pre-push range check, `node .skilled/skills/sk-git/scripts/validate-message.mjs --repo "$R" --rev-list "HEAD"`, to confirm the `Fixed stuff` commit the hook never saw is still refused with `[subject.format]` before it can be pushed.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/workflow-playbooks/message-contract-enforcement.md` | Feature-catalog entry describing the template-driven contract |

### Implementation Anchors

| File | Role |
|---|---|
| `../../assets/commit-message-template.md` | The commit rules block the scenario copies and edits |
| `../../scripts/validate-message.mjs` | The validator every gate calls |
| `../../scripts/lib/message-contract.mjs` | Contract resolution and the commit rules |
| `../../../../scripts/git-hooks/commit-msg` | Shim that runs the validator on each commit |

---

## 5. SOURCE METADATA

- Group: Commit Formation
- Playbook ID: GIT-045
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `commit-formation/template-rules-block-commits.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
