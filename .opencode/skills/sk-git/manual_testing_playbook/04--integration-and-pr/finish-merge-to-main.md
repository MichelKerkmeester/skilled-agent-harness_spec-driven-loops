---
title: "GIT-012 -- Finish merge to main"
description: "This scenario validates Finish merge to main for `GIT-012`. It focuses on verify finished work can be merged locally only after tests pass and base branch is current."
---

# GIT-012 -- Finish merge to main

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-012`.

---

## 1. OVERVIEW

This scenario validates Finish merge to main for `GIT-012`. It focuses on verify finished work can be merged locally only after tests pass and base branch is current.

### Why This Matters

The finish phase prevents untested or stale work from landing. Local merge is safe only when the pre-merge gates are green.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-012` and confirm the expected signals without contradictory evidence.

- Objective: verify finished work can be merged locally only after tests pass and base branch is current.
- Real user request: `The branch is ready. Merge it back to main locally and clean up.`
- Prompt: `Merge the ready feature branch into main only after tests pass, then clean up and report merge evidence.`
- Expected execution process: Confirm option 1 local merge, update main, run tests, merge the feature branch, rerun verification, and clean up branch/worktree.
- Expected signals: Tests pass before and after merge; merge succeeds without conflicts; branch cleanup happens only after success.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if merge follows `references/finish_workflows.md §3` Option 1 and success criteria in §8, including tests before integration. FAIL if tests are skipped, main is stale, branch is deleted before merge succeeds, or conflicts are auto-resolved without human input.

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
| GIT-012 | Finish merge to main | verify finished work can be merged locally only after tests pass and base branch is current. | `Merge the ready feature branch into main only after tests pass, then clean up and report merge evidence.` | 1. `bash: git checkout main` -> 2. `bash: git pull --ff-only` -> 3. `bash: npm test` -> 4. `bash: git merge --no-ff feature/example` -> 5. `bash: npm test` -> 6. `bash: git branch -d feature/example` | Tests pass before and after merge; merge succeeds without conflicts; branch cleanup happens only after success. | Test transcript, merge output, final branch list, and cleanup confirmation. | PASS if merge follows `references/finish_workflows.md §3` Option 1 and success criteria in §8, including tests before integration. FAIL if tests are skipped, main is stale, branch is deleted before merge succeeds, or conflicts are auto-resolved without human input. | Check finish option chosen, then inspect `references/finish_workflows.md §4` and `references/shared_patterns.md §7` pre-merge checklist. |

### Optional Supplemental Checks

Re-run the scenario in a disposable scratch repository when the operator needs proof that no hidden repository state influenced the verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../04--integration-and-pr/finish-merge-to-main.md` | Canonical per-feature execution contract |

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

- Group: Integration And PR
- Playbook ID: GIT-012
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--integration-and-pr/finish-merge-to-main.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.

