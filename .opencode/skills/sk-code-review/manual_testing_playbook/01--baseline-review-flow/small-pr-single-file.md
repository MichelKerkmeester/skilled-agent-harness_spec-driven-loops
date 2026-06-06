---
title: "CR-001 -- Small PR single-file"
description: "This scenario validates Small PR single-file for `CR-001`. It focuses on Confirm a focused one-file diff review stays findings-first without over-scoping."
---

# CR-001 -- Small PR single-file

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-001`.

---

## 1. OVERVIEW

This scenario validates Small PR single-file for `CR-001`. It focuses on Confirm a focused one-file diff review stays findings-first without over-scoping.

### Why This Matters

CR-001 is the simplest review path - one file, under 100 LOC. If the reviewer cannot stay findings-first on a focused diff (no over-scoping, no generic style noise), every more-complex scenario downstream is already broken. This is the baseline gate the rest of the playbook depends on.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-001` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a focused one-file diff review stays findings-first without over-scoping.
- Real user request: `Review target is staged changes in one file.`
- Prompt: `Review the staged one-file diff findings-first, with file:line evidence for P0/P1 issues and a clear merge posture.`
- Expected execution process: Run the deterministic command sequence, capture the transcript, compare the output against sk-code-review references, and record a PASS, PARTIAL, FAIL, or SKIP verdict with rationale.
- Expected signals: Step 1: one-file diff visible; Step 2: findings precede summary; Step 3: stats match reviewed scope
- Desired user-visible outcome: a severity-ordered review report that a real maintainer can act on without asking for missing scope or evidence.
- Pass/fail: PASS if findings are severity ordered and every P0/P1 cites file:line per references/review_core.md; FAIL if summary or praise appears before findings

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
| CR-001 | Small PR single-file | Confirm a focused one-file diff review stays findings-first without over-scoping. | `Review the staged one-file diff findings-first, with file:line evidence for P0/P1 issues and a clear merge posture.` | bash: git diff --staged -- path/to/file.ts -> agent: @review staged single-file diff -> bash: git diff --staged --stat | Step 1: one-file diff visible; Step 2: findings precede summary; Step 3: stats match reviewed scope | Terminal transcript, reviewed file path, and final report | PASS if findings are severity ordered and every P0/P1 cites file:line per references/review_core.md; FAIL if summary or praise appears before findings | 1. Check references/review_ux_single_pass.md report flow; 2. Confirm review_core.md evidence rules were loaded; 3. Narrow target to one file and rerun |

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
- Playbook ID: CR-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--baseline-review-flow/small-pr-single-file.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
