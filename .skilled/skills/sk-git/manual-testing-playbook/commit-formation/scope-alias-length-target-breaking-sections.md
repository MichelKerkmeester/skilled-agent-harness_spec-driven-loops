---
title: "GIT-046 -- Scope aliases, length target and breaking sections"
description: "This scenario validates Scope aliases, length target and breaking sections for `GIT-046`. It focuses on verify the commit-msg gate refuses an alias scope, warns past the subject length target, and requires every breaking-change body section."
version: 1.0.0.0
---

# GIT-046 -- Scope aliases, length target and breaking sections

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `GIT-046`.

---

## 1. OVERVIEW

This scenario validates Scope aliases, length target and breaking sections for `GIT-046`. It focuses on verify the commit-msg gate refuses an alias scope, warns past the subject length target, and requires every breaking-change body section.

### Why This Matters

Three deviations once reached `main` because the gate checked only that a scope was well formed, that a subject stayed under the hard limit and that a breaking commit carried a footer. An alias scope splits one subsystem's history across two names, a subject past the target is harder to scan, and a breaking commit without its Verification section leaves readers no way to judge the change. Each rule must hold at the commit-msg hook, not only in review.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-046` and confirm the expected signals without contradictory evidence.

- Objective: verify the commit-msg gate refuses an alias scope, warns past the subject length target, and requires every breaking-change body section.
- Real user request: `Show me that the commit hook catches alias scopes, long subjects and incomplete breaking-change bodies.`
- Prompt: `In a scratch repository that uses the sk-git commit template, show that an alias scope is blocked with the canonical scope named, that a subject past the length target commits with a warning, and that a breaking commit is blocked until its body carries every required section.`
- Expected execution process: Create a scratch repository that uses the managed hooks and copy the sk-git commit template into `.sk-git/`. Attempt a commit with the alias scope `spec-kit`, then a conforming commit with an 84-character subject. Attempt a breaking commit whose body has Context and Changes but no Verification, then the same commit with all three sections.
- Expected signals: The alias commit exits 1 with `[subject.scope-alias] Scope 'spec-kit' is an alias; use canonical scope 'system-spec-kit'.` The long subject prints `[subject.length-target] Subject is 84 characters; target is 80 characters.` and exits 0. The incomplete breaking commit exits 1 with `[body.breaking-sections] ... Missing: Verification.` The complete breaking commit exits 0.
- Desired user-visible outcome: A concise PASS or FAIL verdict naming the rule ids each attempt reported. SKIP only when the sandbox has no writable scratch directory or no `node`.
- Pass/fail: PASS if every expected signal appears and the log shows exactly two commits. FAIL if the alias or incomplete breaking commit lands, or the long subject is blocked instead of warned.

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
| GIT-046 | Scope aliases, length target and breaking sections | verify the commit-msg gate refuses an alias scope, warns past the subject length target, and requires every breaking-change body section. | `In a scratch repository that uses the sk-git commit template, show that an alias scope is blocked with the canonical scope named, that a subject past the length target commits with a warning, and that a breaking commit is blocked until its body carries every required section.` | 1. `bash: R=$(mktemp -d) && git -C "$R" init -q && git -C "$R" config core.hooksPath "$PWD/.skilled/scripts/git-hooks" && mkdir "$R/.sk-git" && cp .skilled/skills/sk-git/assets/commit-message-template.md "$R/.sk-git/"` -> 2. `bash: git -C "$R" commit --allow-empty -m "chore(spec-kit): rebuild the scratch index" -m "A scratch commit that names an alias scope."; echo rc=$?` -> 3. `bash: git -C "$R" commit --allow-empty -m "docs(readme): record the scratch baseline with a deliberately long subject line here" -m "A scratch commit whose subject passes the target."; echo rc=$?` -> 4. `bash: git -C "$R" commit --allow-empty -m "feat(readme)!: drop the legacy layout" -m "Context: the old layout confused readers."$'\n'"Changes: the readme now uses one layout." -m "BREAKING CHANGE: links to old anchors break."; echo rc=$?` -> 5. `bash: git -C "$R" commit --allow-empty -m "feat(readme)!: drop the legacy layout" -m "Context: the old layout confused readers."$'\n'"Changes: the readme now uses one layout."$'\n'"Verification: rendered the readme and checked every link." -m "BREAKING CHANGE: links to old anchors break."; echo rc=$?` | Step 2 prints `[subject.scope-alias] Scope 'spec-kit' is an alias; use canonical scope 'system-spec-kit'.` with `rc=1`. Step 3 prints `[subject.length-target] Subject is 84 characters; target is 80 characters.` with `rc=0`. Step 4 prints `[body.breaking-sections]` ending `Missing: Verification.` with `rc=1`. Step 5 prints `rc=0`. | The transcript of all five steps and `git -C "$R" log --oneline` showing exactly two commits. | PASS if every expected signal appears and the log shows exactly two commits. FAIL if the alias or incomplete breaking commit lands, or the long subject is blocked instead of warned. | Run `node .skilled/skills/sk-git/scripts/validate-message.mjs --repo "$R" --explain` to see which template was resolved, then check `scopeAliases`, `warnLength` and `breakingSections` in the copied rules block and inspect `scripts/lib/message-contract.mjs`. |

### Optional Supplemental Checks

Run the pre-push range check, `node .skilled/skills/sk-git/scripts/validate-message.mjs --repo "$R" --rev-list "HEAD"`, after a `--no-verify` commit with the alias scope to confirm the range check still refuses it with `[subject.scope-alias]`.

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
| `../../assets/commit-message-template.md` | The rules block that sets `scopeAliases`, `warnLength` and `breakingSections` |
| `../../scripts/validate-message.mjs` | The validator every gate calls |
| `../../scripts/lib/message-contract.mjs` | The scope-alias, length-target and breaking-sections rules |
| `../../../../scripts/git-hooks/commit-msg` | Shim that runs the validator on each commit |

---

## 5. SOURCE METADATA

- Group: Commit Formation
- Playbook ID: GIT-046
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `commit-formation/scope-alias-length-target-breaking-sections.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
