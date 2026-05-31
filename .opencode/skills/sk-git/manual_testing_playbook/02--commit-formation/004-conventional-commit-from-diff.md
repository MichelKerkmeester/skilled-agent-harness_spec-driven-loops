---
title: "GIT-004 -- Conventional commit from diff"
description: "This scenario validates Conventional commit from diff for `GIT-004`. It focuses on verify sk-git derives a Conventional Commit subject from the staged diff."
---

# GIT-004 -- Conventional commit from diff

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-004`.

---

## 1. OVERVIEW

This scenario validates Conventional commit from diff for `GIT-004`. It focuses on verify sk-git derives a Conventional Commit subject from the staged diff.

### Why This Matters

Commit hygiene is the second sk-git phase. The same staged change should produce a clear `type(scope): summary` subject instead of vague history.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-004` and confirm the expected signals without contradictory evidence.

- Objective: verify sk-git derives a Conventional Commit subject from the staged diff.
- Real user request: `Commit the staged docs update with a proper Conventional Commit message.`
- Prompt: `Commit the staged docs update with a Conventional Commit message and report the proposed message plus readiness verdict.`
- Expected execution process: Inspect staged and unstaged changes, classify the logical change, infer type and scope, and produce the commit message before committing.
- Expected signals: Subject uses Conventional Commits; staged diff is reviewed; body includes a useful why/spec reference when available.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if the message follows `type(scope): summary` per `references/commit_workflows.md §3` and `assets/commit_message_template.md §2`. FAIL if the subject is vague, non-conventional, duplicates legacy prefixes, or omits available traceability.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the repository is on the intended branch and the working tree is safe for the scenario.
3. Execute or document the command sequence exactly as written.
4. Capture the expected signals and evidence artifacts.
5. Return a concise user-facing verdict with failure triage if needed.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| GIT-004 | Conventional commit from diff | verify sk-git derives a Conventional Commit subject from the staged diff. | `Commit the staged docs update with a Conventional Commit message and report the proposed message plus readiness verdict.` | 1. `bash: git status --short` -> 2. `bash: git diff --cached --stat` -> 3. `bash: git diff --cached` -> 4. `agent: propose `docs(sk-git): add manual testing playbook` with optional body` | Subject uses Conventional Commits; staged diff is reviewed; body includes a useful why/spec reference when available. | Diff transcript, proposed subject/body, and final commit readiness checklist. | PASS if the message follows `type(scope): summary` per `references/commit_workflows.md §3` and `assets/commit_message_template.md §2`. FAIL if the subject is vague, non-conventional, duplicates legacy prefixes, or omits available traceability. | Check `SKILL.md §4` commit-message logic, then `references/commit_workflows.md §3` Step 5 and `assets/commit_message_template.md §11`. |

### Optional Supplemental Checks

Re-run the scenario in a disposable scratch repository when the operator needs proof that no hidden repository state influenced the verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../02--commit-formation/004-conventional-commit-from-diff.md` | Canonical per-feature execution contract |

### Implementation Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Top-level sk-git workflow rules and safety gates |
| `../../references/quick_reference.md` | Compact phase and rule reference |
| `../../references/worktree_workflows.md` | Worktree setup and workspace-choice policy |
| `../../references/commit_workflows.md` | Commit analysis, staging, and message workflow |
| `../../references/finish_workflows.md` | Finish, merge, PR, and cleanup workflow |
| `../../references/shared_patterns.md` | Recovery, branch, and command patterns |
| `../../assets/commit_message_template.md` | Conventional Commit message rules |
| `../../assets/pr_template.md` | Pull request body and title expectations |

---

## 5. SOURCE METADATA

- Group: Commit Formation
- Playbook ID: GIT-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--commit-formation/004-conventional-commit-from-diff.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.

