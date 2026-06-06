---
title: "GIT-007 -- Co-Authored-By footer"
description: "This scenario validates Co-Authored-By footer for `GIT-007`. It focuses on verify the canonical Claude Opus co-author footer is preserved exactly when required."
---

# GIT-007 -- Co-Authored-By footer

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `GIT-007`.

---

## 1. OVERVIEW

This scenario validates Co-Authored-By footer for `GIT-007`. It focuses on verify the canonical Claude Opus co-author footer is preserved exactly when required.

### Why This Matters

Attribution footers are machine-checked by downstream workflow. One character of drift breaks traceability.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `GIT-007` and confirm the expected signals without contradictory evidence.

- Objective: verify the canonical Claude Opus co-author footer is preserved exactly when required.
- Real user request: `Commit this change and include the Claude Opus 4.7 co-author footer exactly.`
- Prompt: `Commit this change with the exact Claude Opus co-author footer and show the footer equality check.`
- Expected execution process: Prepare the Conventional Commit message, append the footer on its own line, and compare it against the pinned string before commit.
- Expected signals: Footer appears exactly once, with exact capitalization, spacing, model text, and email.
- Desired user-visible outcome: A concise PASS, PARTIAL, FAIL, or SKIP verdict with the evidence needed for release review.
- Pass/fail: PASS if the footer exactly equals `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` and the subject follows `references/commit_workflows.md §3` and the footer matches the canonical line documented in project root `CLAUDE.md` "Committing changes with git" HEREDOC example. FAIL if capitalization, spacing, angle brackets, model text, or placement differs.

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
| GIT-007 | Co-Authored-By footer | verify the canonical Claude Opus co-author footer is preserved exactly when required. | `Commit this change with the exact Claude Opus co-author footer and show the footer equality check.` | 1. `agent: build commit subject and body` -> 2. `agent: append `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`` -> 3. `agent: compare footer string for exact equality` -> 4. `agent: write commit message + footer to /tmp/git-007-msg.txt` -> 5. `bash: git commit -F /tmp/git-007-msg.txt` | Footer appears exactly once, with exact capitalization, spacing, model text, and email. | Rendered commit message and exact string comparison result. | PASS if the footer exactly equals `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` and the subject follows `references/commit_workflows.md §3` and the footer matches the canonical line documented in project root `CLAUDE.md` "Committing changes with git" HEREDOC example. FAIL if capitalization, spacing, angle brackets, model text, or placement differs. | Compare byte-for-byte first, then inspect the canonical Co-Authored-By line in project root `CLAUDE.md` "Committing changes with git" HEREDOC example. |

### Optional Supplemental Checks

Re-run the scenario in a disposable scratch repository when the operator needs proof that no hidden repository state influenced the verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../02--commit-formation/co-authored-by-footer.md` | Canonical per-feature execution contract |

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
- Playbook ID: GIT-007
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--commit-formation/co-authored-by-footer.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.

