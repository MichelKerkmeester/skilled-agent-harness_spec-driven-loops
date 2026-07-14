---
title: "GIT-017 -- Accidental commit wrong branch"
description: "This scenario validates Accidental commit wrong branch for `GIT-017`. It focuses on verify a commit made on the wrong branch is recovered without destructive history rewrite."
version: 1.1.0.3
---

# GIT-017 -- Accidental commit wrong branch

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-017`.

---

## 1. OVERVIEW

This scenario validates Accidental commit wrong branch for `GIT-017`. It focuses on verify a commit made on the wrong branch is recovered without destructive history rewrite.

### Why This Matters

Wrong-branch commits happen during busy work. sk-git should preserve work while returning the operator to the intended branch.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-017` and confirm the expected signals without contradictory evidence.

- Objective: verify a commit made on the wrong branch is recovered without destructive history rewrite.
- Real user request: `I accidentally committed this on main. Move it to a proper worktree branch without losing the work.`
- Prompt: `Move my accidental main commit to a proper worktree branch without losing work, then return recovery evidence.`
- Expected execution process: Identify the mistaken commit, create a recovery worktree branch from that commit, move or revert main safely, and report preserved SHA.
- Expected signals: Recovery branch contains the commit; main is clean or explicitly reverted; no force reset occurs without approval.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if recovery uses worktree-created branch policy per `SKILL.md §3` and shared recovery patterns in `references/shared-patterns.md §6`. FAIL if the AI runs destructive reset, drops the commit, or creates a branch directly with `git checkout -b`.

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
| GIT-017 | Accidental commit wrong branch | verify a commit made on the wrong branch is recovered without destructive history rewrite. | `Move my accidental main commit to a proper worktree branch without losing work, then return recovery evidence.` | 1. `bash: git log --oneline -1` -> 2. `bash: git worktree add .worktrees/recovery -b fix/recover-wrong-branch HEAD` -> 3. `bash: git checkout main` -> 4. `bash: git revert HEAD (only if approved)` -> 5. `bash: git status --short --branch` | Recovery branch contains the commit; main is clean or explicitly reverted; no force reset occurs without approval. | Commit SHA, recovery branch output, final main status, and any approved revert transcript. | PASS if recovery uses worktree-created branch policy per `SKILL.md §3` and shared recovery patterns in `references/shared-patterns.md §6`. FAIL if the AI runs destructive reset, drops the commit, or creates a branch directly with `git checkout -b`. | Check reflog and current HEAD first, then inspect `references/shared-patterns.md §6` detached/wrong-state recovery guidance. |

### Optional Supplemental Checks

Re-run the scenario in a disposable scratch repository when the operator needs proof that no hidden repository state influenced the verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../recovery-and-edge-cases/accidental-commit-wrong-branch.md` | Canonical per-feature execution contract |

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

- Group: Recovery And Edge Cases
- Playbook ID: GIT-017
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `recovery-and-edge-cases/accidental-commit-wrong-branch.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.

