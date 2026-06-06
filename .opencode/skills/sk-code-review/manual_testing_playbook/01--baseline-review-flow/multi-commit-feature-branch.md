---
title: "CR-003 -- Multi-commit feature branch"
description: "This scenario validates Multi-commit feature branch for `CR-003`. It focuses on Confirm branch review preserves commit lineage and distinguishes PR scope from unrelated churn."
---

# CR-003 -- Multi-commit feature branch

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-003`.

---

## 1. OVERVIEW

This scenario validates Multi-commit feature branch for `CR-003`. It focuses on Confirm branch review preserves commit lineage and distinguishes PR scope from unrelated churn.

### Why This Matters

When a branch contains five commits, findings tied to 'the branch' lose their actionability - the maintainer cannot tell which commit introduced the issue. CR-003 catches reviewers who flatten lineage: each P0/P1 must reference the commit SHA where the issue lives, and unrelated changes between commits must be flagged as scope drift.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-003` and confirm the expected signals without contradictory evidence.

- Objective: Confirm branch review preserves commit lineage and distinguishes PR scope from unrelated churn.
- Real user request: `Review target is merge-base to HEAD.`
- Prompt: `Review the branch from merge-base to HEAD, preserving commit lineage and flagging unrelated-change risk.`
- Expected execution process: Run the deterministic command sequence, capture the transcript, compare the output against sk-code-review references, and record a PASS, PARTIAL, FAIL, or SKIP verdict with rationale.
- Expected signals: Step 1: merge base resolves; Step 2: commits listed; Step 3: files map to branch scope; Step 4: report flags scope drift when present
- Desired user-visible outcome: a findings-first branch review that a real maintainer can act on without asking for missing scope or evidence.
- Pass/fail: PASS if the report ties findings to branch scope and PR guidance from references/review_ux_single_pass.md; FAIL if it ignores commit lineage or reviews unrelated files as in-scope

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain review-scope language.
2. Confirm the review target, changed-file list, and risk lens before invoking the reviewer.
3. Execute the deterministic steps exactly as written.
4. Compare the observed report against the cited sk-code-review reference files.
5. Return a concise final verdict that names missing evidence when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-003 | Multi-commit feature branch | Confirm branch review preserves commit lineage and distinguishes PR scope from unrelated churn. | `Review the branch from merge-base to HEAD, preserving commit lineage and flagging unrelated-change risk.` | bash: git merge-base main HEAD -> bash: git log --oneline main..HEAD -> bash: git diff main...HEAD --name-only -> agent: @review branch range | Step 1: merge base resolves; Step 2: commits listed; Step 3: files map to branch scope; Step 4: report flags scope drift when present | Merge-base SHA, commit list, changed-file list, final report | PASS if the report ties findings to branch scope and PR guidance from references/review_ux_single_pass.md; FAIL if it ignores commit lineage or reviews unrelated files as in-scope | 1. Verify merge-base range; 2. Compare changed files to PR purpose; 3. Re-run with explicit file list |

### Optional Supplemental Checks

If the primary run passes, repeat the scenario against a second tiny fixture or narrowed file list to confirm the behavior is not tied to one diff shape. Keep supplemental evidence separate from the primary verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../README.md` | Skill overview and current operator-facing description |

### Implementation Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Routing, output contract, scope and escalation rules |
| `../../references/review_core.md` | Severity, evidence, precedence, and finding schema |
| `../../references/review_ux_single_pass.md` | Interactive report flow and PR/pre-commit guidance |

---

## 5. SOURCE METADATA

- Group: Baseline Review Flow
- Playbook ID: CR-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--baseline-review-flow/multi-commit-feature-branch.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
