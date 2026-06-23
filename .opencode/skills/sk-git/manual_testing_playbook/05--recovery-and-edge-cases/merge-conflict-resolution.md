---
title: "GIT-016 -- Merge conflict resolution"
description: "This scenario validates Merge conflict resolution for `GIT-016`. It focuses on verify merge conflicts stop for human resolution instead of silent auto-resolution."
version: 1.1.0.3
---

# GIT-016 -- Merge conflict resolution

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-016`.

---

## 1. OVERVIEW

This scenario validates Merge conflict resolution for `GIT-016`. It focuses on verify merge conflicts stop for human resolution instead of silent auto-resolution.

### Why This Matters

Complex conflicts encode product choices. sk-git escalates conflicts that cannot be safely auto-resolved.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-016` and confirm the expected signals without contradictory evidence.

- Objective: verify merge conflicts stop for human resolution instead of silent auto-resolution.
- Real user request: `Merge this branch. If there are conflicts, don't guess.`
- Prompt: `Merge this branch, surface any conflicts for my decision, and wait for resolved files and passing tests before finishing.`
- Expected execution process: Attempt merge, capture conflict files, stop for user decision, mark resolved only after edits, then rerun tests.
- Expected signals: Conflict files are listed; agent does not invent resolution; merge commit happens only after explicit resolution and tests.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if conflict handling follows `references/shared_patterns.md §6` merge-conflict pattern and `references/finish_workflows.md §7` troubleshooting. FAIL if the AI silently chooses one side, commits unresolved markers, or skips tests after resolution.

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
| GIT-016 | Merge conflict resolution | verify merge conflicts stop for human resolution instead of silent auto-resolution. | `Merge this branch, surface any conflicts for my decision, and wait for resolved files and passing tests before finishing.` | 1. `bash: git checkout main` -> 2. `bash: git merge feature/conflict-demo` -> 3. `bash: git status --short` -> 4. `bash: git diff --name-only --diff-filter=U` -> 5. `agent: ask user which conflict resolution should prevail` | Conflict files are listed; agent does not invent resolution; merge commit happens only after explicit resolution and tests. | Conflict transcript, unmerged-file list, user decision, and post-resolution test output if completed. | PASS if conflict handling follows `references/shared_patterns.md §6` merge-conflict pattern and `references/finish_workflows.md §7` troubleshooting. FAIL if the AI silently chooses one side, commits unresolved markers, or skips tests after resolution. | Inspect conflicted files for markers, then run `git status --short` and compare to `references/shared_patterns.md §6`. |

### Optional Supplemental Checks

Re-run the scenario in a disposable scratch repository when the operator needs proof that no hidden repository state influenced the verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../05--recovery-and-edge-cases/merge-conflict-resolution.md` | Canonical per-feature execution contract |

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
- Playbook ID: GIT-016
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--recovery-and-edge-cases/merge-conflict-resolution.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.

