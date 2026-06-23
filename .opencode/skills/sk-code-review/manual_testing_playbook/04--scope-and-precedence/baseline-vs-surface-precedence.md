---
title: "CR-011 -- Baseline vs surface precedence"
description: "This scenario validates Baseline vs surface precedence for `CR-011`. It focuses on Confirm surface conventions override generic process advice while baseline security and correctness remain mandatory."
version: 1.5.0.4
---

# CR-011 -- Baseline vs surface precedence

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-011`.

---

## 1. OVERVIEW

This scenario validates Baseline vs surface precedence for `CR-011`. It focuses on Confirm surface conventions override generic process advice while baseline security and correctness remain mandatory.

### Why This Matters

Surface guidance from sk-code (style, verification commands, project conventions) overrides generic advice but NEVER overrides the baseline security or correctness minimums. CR-011 catches reviewers who let surface style win on a security conflict - the precedence rule is asymmetric, and misapplying it ships unsafe code under the guise of 'we follow the project's pattern'.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-011` and confirm the expected signals without contradictory evidence.

- Objective: Confirm surface conventions override generic process advice while baseline security and correctness remain mandatory.
- Real user request: `Review target has surface-specific conventions.`
- Prompt: `Review this diff against detected sk-code surface evidence, letting surface conventions win while baseline security and correctness still block.`
- Expected execution process: Run the deterministic command sequence, capture the transcript, compare the output against sk-code-review references, and record a PASS, PARTIAL, FAIL, or SKIP verdict with rationale.
- Expected signals: Step 1: surface markers found; Step 2: report names surface evidence; Step 3: precedence is explicit
- Desired user-visible outcome: a precedence-aware review that a real maintainer can act on without asking for missing scope or evidence.
- Pass/fail: PASS if precedence follows references/review_core.md section 5 and SKILL.md precedence matrix; FAIL if generic baseline overrides surface-specific test commands

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
| CR-011 | Baseline vs surface precedence | Confirm surface conventions override generic process advice while baseline security and correctness remain mandatory. | `Review this diff against detected sk-code surface evidence, letting surface conventions win while baseline security and correctness still block.` | bash: git diff --staged --name-only -> agent: @review diff with sk-code surface evidence -> bash: rg -n -e "package.json" -e "pyproject.toml" -e "Cargo.toml" -e "vite.config" -e "next.config" . | Step 1: surface markers found; Step 2: report names surface evidence; Step 3: precedence is explicit | Surface marker transcript, final report baseline/surface lines | PASS if precedence follows references/review_core.md section 5 and SKILL.md precedence matrix; FAIL if generic baseline overrides surface-specific test commands | 1. Identify detected surface; 2. Load surface standards; 3. Separate style/process from security/correctness |

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
| `../../references/review_core.md` | Baseline and surface precedence rules |
| `../../references/review_ux_single_pass.md` | Scope source and interactive report behavior |
| `../../assets/test_quality_checklist.md` | Test-only review severity guidance |

---

## 5. SOURCE METADATA

- Group: Scope And Precedence
- Playbook ID: CR-011
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--scope-and-precedence/baseline-vs-surface-precedence.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
