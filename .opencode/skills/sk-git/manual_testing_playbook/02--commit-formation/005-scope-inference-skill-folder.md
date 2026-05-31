---
title: "GIT-005 -- Scope inference skill folder"
description: "This scenario validates Scope inference skill folder for `GIT-005`. It focuses on verify a change inside `.opencode/skills/sk-git/` yields a deterministic `sk-git` scope."
---

# GIT-005 -- Scope inference skill folder

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-005`.

---

## 1. OVERVIEW

This scenario validates Scope inference skill folder for `GIT-005`. It focuses on verify a change inside `.opencode/skills/sk-git/` yields a deterministic `sk-git` scope.

### Why This Matters

Scope inference keeps commit history scan-friendly. Skill-folder changes should not drift between `docs`, `skill`, and `sk-git` scopes for the same diff.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-005` and confirm the expected signals without contradictory evidence.

- Objective: verify a change inside `.opencode/skills/sk-git/` yields a deterministic `sk-git` scope.
- Real user request: `Commit these sk-git playbook docs. Infer the right scope from the changed path.`
- Prompt: `Commit these sk-git playbook docs, infer the scope from the staged path, and show the scope is deterministic.`
- Expected execution process: Run staged diff inspection twice, infer the scope from the top-level skill folder, and compare the proposed subjects.
- Expected signals: Both passes produce the same scope, ideally `sk-git`, with no path-sensitive drift.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if scope inference is stable and follows first-match scope rules in `SKILL.md §4` and `assets/commit_message_template.md §4`. FAIL if the same diff produces different scopes or falls back to an unrelated generic scope without explanation.

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
| GIT-005 | Scope inference skill folder | verify a change inside `.opencode/skills/sk-git/` yields a deterministic `sk-git` scope. | `Commit these sk-git playbook docs, infer the scope from the staged path, and show the scope is deterministic.` | 1. `bash: git diff --cached --name-only` -> 2. `agent: infer type and scope from changed paths` -> 3. `agent: repeat the same inference without changing inputs` -> 4. `bash: git diff --cached --stat` | Both passes produce the same scope, ideally `sk-git`, with no path-sensitive drift. | Changed-file list, two proposed subjects, and reasoning for scope choice. | PASS if scope inference is stable and follows first-match scope rules in `SKILL.md §4` and `assets/commit_message_template.md §4`. FAIL if the same diff produces different scopes or falls back to an unrelated generic scope without explanation. | Check path inventory first, then compare against `references/commit_workflows.md §3` Step 5 and `assets/commit_message_template.md §4`. |

### Optional Supplemental Checks

Re-run the scenario in a disposable scratch repository when the operator needs proof that no hidden repository state influenced the verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../02--commit-formation/005-scope-inference-skill-folder.md` | Canonical per-feature execution contract |

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
- Playbook ID: GIT-005
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--commit-formation/005-scope-inference-skill-folder.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.

