---
title: "GIT-003 -- Stay on main no feature branches"
description: "This scenario validates Stay on main no feature branches for `GIT-003`. It focuses on verify a main-only user preference is restored after a helper creates or suggests an automatic branch."
version: 1.1.0.3
---

# GIT-003 -- Stay on main no feature branches

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-003`.

---

## 1. OVERVIEW

This scenario validates Stay on main no feature branches for `GIT-003`. It focuses on verify a main-only user preference is restored after a helper creates or suggests an automatic branch.

### Why This Matters

A persistent user preference says create.sh auto-branch behavior must be reverted and work should return to main. This scenario makes that memory testable.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-003` and confirm the expected signals without contradictory evidence.

- Objective: verify a main-only user preference is restored after a helper creates or suggests an automatic branch.
- Real user request: `Run the spec scaffold, but stay on main. If a helper moves me to a generated branch, return to main.`
- Prompt: `Run the spec scaffold, restore main if a helper changes branches, and report the branch-state evidence and recovery action.`
- Expected execution process: Inspect the starting branch, run the helper only in a disposable target if needed, detect generated-branch state, switch back to main, and report the recovery.
- Expected signals: The final branch is `main`; response explains any branch recovery; no feature branch is used for ongoing work.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if the final checkout is `main`, the agent honors the user preference per `SKILL.md §3`, and branch creation policy still avoids direct new-branch commands per `references/shared_patterns.md §3`. FAIL if the agent continues on an auto-created branch, creates another feature branch, or treats the stay-on-main preference as optional.

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
| GIT-003 | Stay on main no feature branches | verify a main-only user preference is restored after a helper creates or suggests an automatic branch. | `Run the spec scaffold, restore main if a helper changes branches, and report the branch-state evidence and recovery action.` | 1. `bash: git branch --show-current` -> 2. `bash: bash .opencode/skills/system-spec-kit/scripts/spec/create.sh --level 1 --name Scratch /tmp/sk-git-playbook-scratch` -> 3. `bash: git branch --show-current` -> 4. `bash: git switch main` -> 5. `bash: git status --short --branch` | The final branch is `main`; response explains any branch recovery; no feature branch is used for ongoing work. | Before/after branch outputs, create.sh transcript, final status, and recovery note. | PASS if the final checkout is `main`, the agent honors the user preference per `SKILL.md §3`, and branch creation policy still avoids direct new-branch commands per `references/shared_patterns.md §3`. FAIL if the agent continues on an auto-created branch, creates another feature branch, or treats the stay-on-main preference as optional. | Check the session preference capture, then inspect branch command history and `references/worktree_workflows.md §2`. |

### Optional Supplemental Checks

Re-run the scenario in a disposable scratch repository when the operator needs proof that no hidden repository state influenced the verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../01--worktree-setup/stay-on-main-no-feature-branches.md` | Canonical per-feature execution contract |

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
- Playbook ID: GIT-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--worktree-setup/stay-on-main-no-feature-branches.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.

