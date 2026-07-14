---
title: "GIT-015 -- Branch cleanup after merge"
description: "This scenario validates Branch cleanup after merge for `GIT-015`. It focuses on verify worktree and branch cleanup happens after successful merge."
version: 1.1.0.3
---

# GIT-015 -- Branch cleanup after merge

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-015`.

---

## 1. OVERVIEW

This scenario validates Branch cleanup after merge for `GIT-015`. It focuses on verify worktree and branch cleanup happens after successful merge.

### Why This Matters

Stale worktrees and merged branches create operator confusion. sk-git lists cleanup as part of integration completion.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-015` and confirm the expected signals without contradictory evidence.

- Objective: verify worktree and branch cleanup happens after successful merge.
- Real user request: `The PR merged. Clean up the local worktree and merged branches safely.`
- Prompt: `Clean up the merged PR worktree and branches only after merge confirmation, then report cleanup evidence.`
- Expected execution process: Confirm merged state, remove worktree, delete local branch safely, delete remote branch if appropriate, and verify no stale references remain.
- Expected signals: Only merged branches are deleted; worktree list no longer includes removed path; remote delete is explicit.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if cleanup follows `SKILL.md §4` ALWAYS rule 6 and `references/finish-workflows.md §3` Step 5 without force-deleting unmerged work. FAIL if unmerged branches are force-deleted, worktree removal runs with dirty changes, or stale entries remain untriaged.

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
| GIT-015 | Branch cleanup after merge | verify worktree and branch cleanup happens after successful merge. | `Clean up the merged PR worktree and branches only after merge confirmation, then report cleanup evidence.` | 1. `bash: git branch --merged main` -> 2. `bash: git worktree list` -> 3. `bash: git worktree remove .worktrees/example` -> 4. `bash: git branch -d feature/example` -> 5. `bash: git push origin --delete feature/example` -> 6. `bash: git worktree prune` | Only merged branches are deleted; worktree list no longer includes removed path; remote delete is explicit. | Merged-branch list, cleanup command transcript, final worktree list, and branch list. | PASS if cleanup follows `SKILL.md §4` ALWAYS rule 6 and `references/finish-workflows.md §3` Step 5 without force-deleting unmerged work. FAIL if unmerged branches are force-deleted, worktree removal runs with dirty changes, or stale entries remain untriaged. | Check `references/finish-workflows.md §7` worktree cleanup troubleshooting and `references/shared-patterns.md §6` stale worktree pattern. |

### Optional Supplemental Checks

Re-run the scenario in a disposable scratch repository when the operator needs proof that no hidden repository state influenced the verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../integration-and-pr/branch-cleanup-after-merge.md` | Canonical per-feature execution contract |

### Implementation Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Top-level sk-git workflow rules and safety gates |
| `../../references/quick-reference.md` | Compact phase and rule reference |
| `../../references/worktree-workflows.md` | Worktree setup and workspace-choice policy |
| `../../references/commit-workflows.md` | Commit analysis, staging, and message workflow |
| `../../references/finish-workflows.md` | Finish, merge, PR, and cleanup workflow |
| `../../references/shared-patterns.md` | Recovery, branch, and command patterns |
| `../../assets/commit-message-template.md` | Conventional Commit message rules |
| `../../assets/pr-template.md` | Pull request body and title expectations |

---

## 5. SOURCE METADATA

- Group: Integration And PR
- Playbook ID: GIT-015
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `integration-and-pr/branch-cleanup-after-merge.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.

