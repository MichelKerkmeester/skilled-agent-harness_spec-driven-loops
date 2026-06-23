---
title: "GIT-002 -- Current branch no worktree"
description: "This scenario validates Current branch no worktree for `GIT-002`. It focuses on verify explicit user choice to work on the current branch is honored without creating a worktree."
version: 1.1.0.2
---

# GIT-002 -- Current branch no worktree

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-002`.

---

## 1. OVERVIEW

This scenario validates Current branch no worktree for `GIT-002`. It focuses on verify explicit user choice to work on the current branch is honored without creating a worktree.

### Why This Matters

sk-git requires the user, not the AI, to choose between a new worktree and the current branch. Respecting the current-branch choice prevents unwanted workspace churn.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-002` and confirm the expected signals without contradictory evidence.

- Objective: verify explicit user choice to work on the current branch is honored without creating a worktree.
- Real user request: `This is a tiny docs tweak. Stay in this checkout and do not make a worktree.`
- Prompt: `Use the current checkout for this docs tweak, create no worktree or branch, and report branch-state evidence.`
- Expected execution process: Record the explicit current-branch choice, inspect status, continue without `git worktree add`, and report the unchanged workspace.
- Expected signals: Branch remains unchanged; worktree list has no new entry; response names current-branch mode.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if no worktree is created after explicit current-branch selection per `SKILL.md §3` and `references/worktree_workflows.md §2`. FAIL if the agent creates a worktree, creates a branch, or treats current-branch mode as lower quality after the user chose it.

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
| GIT-002 | Current branch no worktree | verify explicit user choice to work on the current branch is honored without creating a worktree. | `Use the current checkout for this docs tweak, create no worktree or branch, and report branch-state evidence.` | 1. `bash: git branch --show-current` -> 2. `bash: git status --short --branch` -> 3. `bash: git worktree list` -> 4. `agent: confirm no `git worktree add` command was issued` | Branch remains unchanged; worktree list has no new entry; response names current-branch mode. | Branch output, `git status --short --branch`, `git worktree list`, and final user-facing response. | PASS if no worktree is created after explicit current-branch selection per `SKILL.md §3` and `references/worktree_workflows.md §2`. FAIL if the agent creates a worktree, creates a branch, or treats current-branch mode as lower quality after the user chose it. | Check whether the user choice was captured, then inspect `references/worktree_workflows.md §2` and `references/quick_reference.md §7`. |

### Optional Supplemental Checks

Re-run the scenario in a disposable scratch repository when the operator needs proof that no hidden repository state influenced the verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../01--worktree-setup/current-branch-no-worktree.md` | Canonical per-feature execution contract |

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
- Playbook ID: GIT-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--worktree-setup/current-branch-no-worktree.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.

