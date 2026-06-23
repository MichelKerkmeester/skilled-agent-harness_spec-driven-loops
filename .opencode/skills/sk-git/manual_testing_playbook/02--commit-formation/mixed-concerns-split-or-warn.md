---
title: "GIT-006 -- Mixed concerns split or warn"
description: "This scenario validates Mixed concerns split or warn for `GIT-006`. It focuses on verify unrelated changes are split into separate commits or clearly warned before committing."
version: 1.1.0.3
---

# GIT-006 -- Mixed concerns split or warn

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-006`.

---

## 1. OVERVIEW

This scenario validates Mixed concerns split or warn for `GIT-006`. It focuses on verify unrelated changes are split into separate commits or clearly warned before committing.

### Why This Matters

Atomic commits prevent hidden review debt. A docs change plus unrelated code refactor should not be silently bundled.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-006` and confirm the expected signals without contradictory evidence.

- Objective: verify unrelated changes are split into separate commits or clearly warned before committing.
- Real user request: `Commit everything that is staged, but tell me if the changes should be split.`
- Prompt: `Review the staged changes for mixed concerns, split or block unsafe grouping, and return the recommended commit plan.`
- Expected execution process: Inspect changed files, identify logical units, recommend one commit per concern, and avoid committing if grouping is unsafe.
- Expected signals: Unrelated concerns are identified; command sequence uses targeted staging rather than `git add .`; no premature commit occurs.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if mixed concerns are split or blocked per `references/commit_workflows.md §3` Step 4 and `assets/commit_message_template.md §9` bad example 5. FAIL if unrelated files are committed together without warning or if generated/internal artifacts are staged.

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
| GIT-006 | Mixed concerns split or warn | verify unrelated changes are split into separate commits or clearly warned before committing. | `Review the staged changes for mixed concerns, split or block unsafe grouping, and return the recommended commit plan.` | 1. `bash: git status --short` -> 2. `bash: git diff --cached --name-status` -> 3. `agent: classify changed files by logical concern` -> 4. `agent: return split plan or blocking warning` | Unrelated concerns are identified; command sequence uses targeted staging rather than `git add .`; no premature commit occurs. | Name-status output, concern grouping, recommended commit subjects, and final warning if blocked. | PASS if mixed concerns are split or blocked per `references/commit_workflows.md §3` Step 4 and `assets/commit_message_template.md §9` bad example 5. FAIL if unrelated files are committed together without warning or if generated/internal artifacts are staged. | Review `references/commit_workflows.md §4` decision matrix, then inspect staged files and artifact filters in §3 Step 2. |

### Optional Supplemental Checks

Re-run the scenario in a disposable scratch repository when the operator needs proof that no hidden repository state influenced the verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../02--commit-formation/mixed-concerns-split-or-warn.md` | Canonical per-feature execution contract |

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
- Playbook ID: GIT-006
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--commit-formation/mixed-concerns-split-or-warn.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.

