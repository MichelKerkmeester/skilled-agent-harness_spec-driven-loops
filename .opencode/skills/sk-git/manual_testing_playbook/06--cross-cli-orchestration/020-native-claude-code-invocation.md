---
title: "GIT-020 -- Native Claude Code invocation"
description: "This scenario validates Native Claude Code invocation for `GIT-020`. It focuses on verify sk-git guidance can be executed by a native Claude Code conductor without losing safety gates."
---

# GIT-020 -- Native Claude Code invocation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-020`.

---

## 1. OVERVIEW

This scenario validates Native Claude Code invocation for `GIT-020`. It focuses on verify sk-git guidance can be executed by a native Claude Code conductor without losing safety gates.

### Why This Matters

sk-git is consumed across runtimes. Native Claude Code execution still needs the same workspace, commit, and finish policies.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-020` and confirm the expected signals without contradictory evidence.

- Objective: verify sk-git guidance can be executed by a native Claude Code conductor without losing safety gates.
- Real user request: `Use Claude Code as the conductor to review this git workflow plan and return the safe commands.`
- RCAF Prompt: `As a cross-CLI conductor, delegate sk-git workflow planning against Claude Code native execution. Verify Claude Code preserves workspace-choice, commit-message, and finish safety gates. Return the command plan and evidence requirements.`
- Expected execution process: Dispatch Claude Code with read-only planning, compare its command plan to sk-git policy, and reject unsafe deltas.
- Expected signals: Plan asks before workspace choice, uses `git worktree add -b` for branches, and refuses unsafe finish shortcuts.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if native Claude Code output matches `SKILL.md §3-§6` and source anchors in `references/quick_reference.md`. FAIL if the delegated plan creates branches directly, bypasses checks, or omits cleanup gates.

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
| GIT-020 | Native Claude Code invocation | verify sk-git guidance can be executed by a native Claude Code conductor without losing safety gates. | `As a cross-CLI conductor, delegate sk-git workflow planning against Claude Code native execution. Verify Claude Code preserves workspace-choice, commit-message, and finish safety gates. Return the command plan and evidence requirements.` | 1. `agent: claude-code native prompt with sk-git sources` -> 2. `bash: git status --short --branch` -> 3. `agent: compare returned commands against sk-git NEVER rules` | Plan asks before workspace choice, uses `git worktree add -b` for branches, and refuses unsafe finish shortcuts. | Claude Code response, policy comparison notes, and final accepted command plan. | PASS if native Claude Code output matches `SKILL.md §3-§6` and source anchors in `references/quick_reference.md`. FAIL if the delegated plan creates branches directly, bypasses checks, or omits cleanup gates. | Compare command list to `references/quick_reference.md §9`, then rerun with stricter source quoting. |

### Optional Supplemental Checks

Re-run the scenario in a disposable scratch repository when the operator needs proof that no hidden repository state influenced the verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../06--cross-cli-orchestration/020-native-claude-code-invocation.md` | Canonical per-feature execution contract |

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
- Playbook ID: GIT-020
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--cross-cli-orchestration/020-native-claude-code-invocation.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.

