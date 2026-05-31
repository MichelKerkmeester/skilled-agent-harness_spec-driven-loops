---
title: "GIT-018 -- Empty commit or no changes"
description: "This scenario validates Empty commit or no changes for `GIT-018`. It focuses on verify commit flow refuses no-op commits unless the user explicitly asks for an empty commit with rationale."
---

# GIT-018 -- Empty commit or no changes

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-018`.

---

## 1. OVERVIEW

This scenario validates Empty commit or no changes for `GIT-018`. It focuses on verify commit flow refuses no-op commits unless the user explicitly asks for an empty commit with rationale.

### Why This Matters

No-op commits obscure history. sk-git should report there is nothing to commit and avoid manufacturing changes.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-018` and confirm the expected signals without contradictory evidence.

- Objective: verify commit flow refuses no-op commits unless the user explicitly asks for an empty commit with rationale.
- Real user request: `Commit my changes. If there are none, tell me instead of making something up.`
- Prompt: `Commit my changes if any exist; if the worktree is empty, do not create a commit.`
- Expected execution process: Inspect status and staged diff, detect no changes, and return a clear no-op message.
- Expected signals: Status is empty; no commit command runs; response says there is nothing to commit.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if the agent refuses a normal no-change commit and follows readiness checks in `references/commit_workflows.md §3` Step 6. FAIL if the AI fabricates a change, runs `git commit --allow-empty` without explicit rationale, or claims a commit was created.

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
| GIT-018 | Empty commit or no changes | verify commit flow refuses no-op commits unless the user explicitly asks for an empty commit with rationale. | `Commit my changes if any exist; if the worktree is empty, do not create a commit.` | 1. `bash: git status --short` -> 2. `bash: git diff --cached --stat` -> 3. `bash: git diff --stat` -> 4. `agent: return no-op commit response` | Status is empty; no commit command runs; response says there is nothing to commit. | Status output, diff stats, and unchanged `git log -1` SHA if captured. | PASS if the agent refuses a normal no-change commit and follows readiness checks in `references/commit_workflows.md §3` Step 6. FAIL if the AI fabricates a change, runs `git commit --allow-empty` without explicit rationale, or claims a commit was created. | Compare pre/post HEAD SHA and inspect `references/commit_workflows.md §8` success criteria. |

### Optional Supplemental Checks

Re-run the scenario in a disposable scratch repository when the operator needs proof that no hidden repository state influenced the verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../05--recovery-and-edge-cases/018-empty-commit-or-no-changes.md` | Canonical per-feature execution contract |

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

- Group: Recovery And Edge Cases
- Playbook ID: GIT-018
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--recovery-and-edge-cases/018-empty-commit-or-no-changes.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.

