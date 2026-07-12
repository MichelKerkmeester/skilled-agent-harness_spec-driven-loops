---
title: "GIT-019 -- Rebase vs merge decision"
description: "This scenario validates Rebase vs merge decision for `GIT-019`. It focuses on verify divergence recovery chooses rebase only for safe local/unpushed work and merge for shared history."
version: 1.1.0.3
---

# GIT-019 -- Rebase vs merge decision

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-019`.

---

## 1. OVERVIEW

This scenario validates Rebase vs merge decision for `GIT-019`. It focuses on verify divergence recovery chooses rebase only for safe local/unpushed work and merge for shared history.

### Why This Matters

Rebase is clean for private commits and dangerous for shared branches. sk-git must make that trade-off explicit.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-019` and confirm the expected signals without contradictory evidence.

- Objective: verify divergence recovery chooses rebase only for safe local/unpushed work and merge for shared history.
- Real user request: `My branch is behind origin/main. Should I rebase or merge before pushing?`
- Prompt: `Tell me whether to rebase or merge this diverged branch, based on local commits and published history.`
- Expected execution process: Inspect upstream/divergence state, determine whether commits are published, then recommend rebase or merge accordingly.
- Expected signals: Decision names the publication state; no force push is suggested for shared branches; commands match the chosen path.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if the decision follows `SKILL.md §4` NEVER rule 8 and `references/shared_patterns.md §6` failed-push pattern. FAIL if the AI blindly rebases public/shared commits, recommends force push to main, or omits publication-state reasoning.

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
| GIT-019 | Rebase vs merge decision | verify divergence recovery chooses rebase only for safe local/unpushed work and merge for shared history. | `Tell me whether to rebase or merge this diverged branch, based on local commits and published history.` | 1. `bash: git status --short --branch` -> 2. `bash: git fetch origin` -> 3. `bash: git log --oneline --left-right --cherry-pick HEAD...@{upstream}` -> 4. `agent: recommend rebase for local-only or merge for shared history` | Decision names the publication state; no force push is suggested for shared branches; commands match the chosen path. | Divergence log, upstream branch status, recommendation, and caveat about public/shared history. | PASS if the decision follows `SKILL.md §4` NEVER rule 8 and `references/shared_patterns.md §6` failed-push pattern. FAIL if the AI blindly rebases public/shared commits, recommends force push to main, or omits publication-state reasoning. | Check upstream tracking state, then inspect `references/quick_reference.md §7` decision guide. |

### Optional Supplemental Checks

Re-run the scenario in a disposable scratch repository when the operator needs proof that no hidden repository state influenced the verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../recovery-and-edge-cases/rebase-vs-merge-decision.md` | Canonical per-feature execution contract |

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
- Playbook ID: GIT-019
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `recovery-and-edge-cases/rebase-vs-merge-decision.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.

