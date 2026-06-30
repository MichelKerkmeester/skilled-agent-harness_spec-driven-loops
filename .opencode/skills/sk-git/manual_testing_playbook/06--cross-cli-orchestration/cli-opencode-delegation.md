---
title: "GIT-021 -- cli-opencode delegation"
description: "This scenario validates cli-opencode delegation for `GIT-021`. It focuses on verify cli-opencode can receive a bounded sk-git delegation and hand back evidence instead of acting outside scope."
version: 1.1.0.3
---

# GIT-021 -- cli-opencode delegation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-021`.

---

## 1. OVERVIEW

This scenario validates cli-opencode delegation for `GIT-021`. It focuses on verify cli-opencode can receive a bounded sk-git delegation and hand back evidence instead of acting outside scope.

### Why This Matters

OpenCode CLI workers often implement doc and code packets. Delegated git work must preserve branch safety and return operator-visible evidence.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-021` and confirm the expected signals without contradictory evidence.

- Objective: verify cli-opencode can receive a bounded sk-git delegation and hand back evidence instead of acting outside scope.
- Real user request: `Delegate the commit-plan review to cli-opencode and ask it to return only the proposed safe git commands.`
- RCAF Prompt: `As a cross-CLI conductor, delegate a sk-git commit-plan review against cli-opencode. Verify the response preserves Conventional Commit determinism and refuses unsafe git shortcuts. Return the handback summary and pass/fail verdict.`
- Expected execution process: Send a bounded cli-opencode prompt with source anchors, require no file writes, and compare the returned plan to sk-git rules.
- Expected signals: Handback includes deterministic commit subject, targeted staging, and no bypass/force-push advice.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if handback follows `references/commit_workflows.md §3`, `assets/commit_message_template.md §3-§5`, and `SKILL.md §4` NEVER rules. FAIL if cli-opencode proposes `git add .`, `--no-verify`, force-push to protected branch, or direct branch creation.

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
| GIT-021 | cli-opencode delegation | verify cli-opencode can receive a bounded sk-git delegation and hand back evidence instead of acting outside scope. | `As a cross-CLI conductor, delegate a sk-git commit-plan review against cli-opencode. Verify the response preserves Conventional Commit determinism and refuses unsafe git shortcuts. Return the handback summary and pass/fail verdict.` | 1. `agent: cli-opencode prompt with `SKILL.md` and commit references` -> 2. `agent: request command plan plus evidence list only` -> 3. `bash: git status --short --branch` -> 4. `agent: compare cli-opencode handback to sk-git policy` | Handback includes deterministic commit subject, targeted staging, and no bypass/force-push advice. | cli-opencode prompt, cli-opencode response, and policy comparison notes. | PASS if handback follows `references/commit_workflows.md §3`, `assets/commit_message_template.md §3-§5`, and `SKILL.md §4` NEVER rules. FAIL if cli-opencode proposes `git add .`, `--no-verify`, force-push to protected branch, or direct branch creation. | Check prompt source anchors first, then inspect whether the external CLI omitted safety constraints. |

### Optional Supplemental Checks

Re-run the scenario in a disposable scratch repository when the operator needs proof that no hidden repository state influenced the verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../06--cross-cli-orchestration/cli-opencode-delegation.md` | Canonical per-feature execution contract |

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

- Group: Cross CLI Orchestration
- Playbook ID: GIT-021
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--cross-cli-orchestration/cli-opencode-delegation.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
