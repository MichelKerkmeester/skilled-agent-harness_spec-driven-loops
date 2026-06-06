---
title: "GIT-013 -- Finish create PR with template"
description: "This scenario validates Finish create PR with template for `GIT-013`. It focuses on verify PR creation uses the documented title/body template and remote-operation path."
---

# GIT-013 -- Finish create PR with template

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-013`.

---

## 1. OVERVIEW

This scenario validates Finish create PR with template for `GIT-013`. It focuses on verify PR creation uses the documented title/body template and remote-operation path.

### Why This Matters

PRs need enough context for reviewers. sk-git forbids PRs without a description and ships a PR template for consistency.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-013` and confirm the expected signals without contradictory evidence.

- Objective: verify PR creation uses the documented title/body template and remote-operation path.
- Real user request: `Push this feature branch and open a PR with the standard template.`
- Prompt: `Push this feature branch, open a PR with the sk-git template, and return the PR URL and template evidence.`
- Expected execution process: Confirm PR option, push branch, create PR with title/body, and return URL plus body summary.
- Expected signals: Branch is pushed; PR has Summary and Test Plan sections; user gets PR URL.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if PR creation follows `references/finish_workflows.md §3` Option 2 and `assets/pr_template.md §3` complete template expectations. FAIL if PR lacks description, omits testing notes, uses a non-conventional title, or ignores GitHub MCP/gh error handling.

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
| GIT-013 | Finish create PR with template | verify PR creation uses the documented title/body template and remote-operation path. | `Push this feature branch, open a PR with the sk-git template, and return the PR URL and template evidence.` | 1. `bash: git status --short --branch` -> 2. `bash: git push -u origin feature/example` -> 3. `bash: gh pr create --base main --head feature/example --title "feat(sk-git): add playbook" --body-file /tmp/sk-git-pr-body.md` -> 4. `agent: verify PR body sections` | Branch is pushed; PR has Summary and Test Plan sections; user gets PR URL. | Push transcript, PR create command or GitHub MCP response, PR URL, and body excerpt. | PASS if PR creation follows `references/finish_workflows.md §3` Option 2 and `assets/pr_template.md §3` complete template expectations. FAIL if PR lacks description, omits testing notes, uses a non-conventional title, or ignores GitHub MCP/gh error handling. | Check `references/github_mcp_integration.md §4`, then verify title/body against `assets/pr_template.md §8-§10`. |

### Optional Supplemental Checks

Re-run the scenario in a disposable scratch repository when the operator needs proof that no hidden repository state influenced the verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../04--integration-and-pr/finish-create-pr-with-template.md` | Canonical per-feature execution contract |

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
- Playbook ID: GIT-013
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--integration-and-pr/finish-create-pr-with-template.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.

