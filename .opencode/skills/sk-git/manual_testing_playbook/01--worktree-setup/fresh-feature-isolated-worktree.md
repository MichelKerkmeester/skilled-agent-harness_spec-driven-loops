---
title: "GIT-001 -- Fresh feature isolated worktree"
description: "This scenario validates Fresh feature isolated worktree for `GIT-001`. It focuses on prove a new feature starts in an isolated worktree created with a branch through `git worktree add -b`."
version: 1.1.0.2
---

# GIT-001 -- Fresh feature isolated worktree

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-001`.

---

## 1. OVERVIEW

This scenario validates Fresh feature isolated worktree for `GIT-001`. It focuses on prove a new feature starts in an isolated worktree created with a branch through `git worktree add -b`.

### Why This Matters

Workspace isolation is the first sk-git safety boundary. A fresh feature should not begin by mutating the main checkout or creating a branch with direct branch commands.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-001` and confirm the expected signals without contradictory evidence.

- Objective: prove a new feature starts in an isolated worktree created with a branch through `git worktree add -b`.
- Real user request: `Start a new feature for a login timeout fix and keep my current checkout clean.`
- Prompt: `Start a login-timeout feature in an isolated worktree, keep main clean, and report the worktree path, branch, and verdict.`
- Expected execution process: Ask for workspace choice when needed, create the worktree with `git worktree add -b`, run baseline checks, and report the isolated path.
- Expected signals: Main status is unchanged; new worktree appears in `git worktree list`; branch is `fix/login-timeout`.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if the workspace is created with `git worktree add -b` per `references/worktree_workflows.md §3` and no direct `git branch`, `git checkout -b`, or `git switch -c` is used per `SKILL.md §3` and `references/shared_patterns.md §3`. FAIL if the agent creates a branch directly, mutates main, skips user choice, or cannot show worktree evidence.

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
| GIT-001 | Fresh feature isolated worktree | prove a new feature starts in an isolated worktree created with a branch through `git worktree add -b`. | `Start a login-timeout feature in an isolated worktree, keep main clean, and report the worktree path, branch, and verdict.` | 1. `bash: git status --short --branch` -> 2. `bash: git worktree list` -> 3. `bash: git worktree add .worktrees/login-timeout -b fix/login-timeout main` -> 4. `bash: cd .worktrees/login-timeout && git branch --show-current && git status --short` | Main status is unchanged; new worktree appears in `git worktree list`; branch is `fix/login-timeout`. | Terminal transcript, `git worktree list`, branch output, and clean main status. | PASS if the workspace is created with `git worktree add -b` per `references/worktree_workflows.md §3` and no direct `git branch`, `git checkout -b`, or `git switch -c` is used per `SKILL.md §3` and `references/shared_patterns.md §3`. FAIL if the agent creates a branch directly, mutates main, skips user choice, or cannot show worktree evidence. | Check `SKILL.md §3` workspace-choice enforcement, then `references/worktree_workflows.md §4` creation steps and `assets/worktree_checklist.md §3`. |

### Optional Supplemental Checks

Re-run the scenario in a disposable scratch repository when the operator needs proof that no hidden repository state influenced the verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../01--worktree-setup/fresh-feature-isolated-worktree.md` | Canonical per-feature execution contract |

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

- Group: Worktree Setup
- Playbook ID: GIT-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--worktree-setup/fresh-feature-isolated-worktree.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.

