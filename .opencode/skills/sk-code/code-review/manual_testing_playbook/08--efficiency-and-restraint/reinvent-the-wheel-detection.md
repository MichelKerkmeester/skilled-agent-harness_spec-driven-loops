---
title: "CR-020 -- Reinvent-the-wheel detection"
description: "This scenario validates reinvent-the-wheel detection for `CR-020`. It focuses on flagging hand-rolled code that duplicates a standard-library or native platform capability and recommending the built-in."
version: 1.5.0.2
---

# CR-020 -- Reinvent-the-wheel detection

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-020`.

---

## 1. OVERVIEW

This scenario validates reinvent-the-wheel detection for `CR-020`. It focuses on flagging hand-rolled code that duplicates a standard-library or native platform capability and recommending the built-in.

### Why This Matters

A review that waves through code re-implementing what the language or platform already provides leaves behind extra surface to test, document, and maintain for no gain. The two §6 Maintainability rows added in the v1.4.0.0 ponytail refinement name the smell directly: hand-rolled standard-library behavior where a clear primitive already matches, and custom code or a dependency duplicating a native capability with no requirement the native feature cannot satisfy. CR-020 proves the reviewer catches the duplication and recommends the standard or native API instead of accepting a bespoke copy.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-020` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the reviewer flags hand-rolled standard-library or native duplication and recommends the built-in primitive.
- Real user request: `Review target hand-rolls behavior the language or platform already provides for free.`
- Prompt: `Review this diff for code that re-implements standard-library or native platform behavior, and recommend the built-in primitive where the behavior and edge cases match.`
- Expected execution process: Run the deterministic command sequence, capture the transcript, compare the output against sk-code-review references, and record a PASS, PARTIAL, FAIL, or SKIP verdict with rationale.
- Expected signals: Step 1: diff captured; Step 2: review flags the hand-rolled duplication as a §6 maintainability finding; Step 3: recommended fix names the standard or native API.
- Desired user-visible outcome: a maintainability finding that points the author at an existing standard or native primitive instead of a bespoke re-implementation.
- Pass/fail: PASS if a reinvented-wheel instance is flagged with the standard or native replacement per assets/code_quality_checklist.md section 6; FAIL if hand-rolled duplication is waved through.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain review-scope language.
2. Confirm the review target, changed-file list, and the standard or native primitive the code duplicates.
3. Execute the deterministic steps exactly as written.
4. Compare the observed report against the cited sk-code-review reference files.
5. Return a concise final verdict that names the missing primitive when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-020 | Reinvent-the-wheel detection | Confirm the reviewer flags hand-rolled standard-library or native duplication and recommends the built-in primitive. | `Review this diff for code that re-implements standard-library or native platform behavior, and recommend the built-in primitive where the behavior and edge cases match.` | bash: git diff --staged -U5 -> agent: @review for reinvented-wheel maintainability findings -> bash: rg -n "the duplicated primitive name" path/to/file | Step 1: diff captured; Step 2: review flags duplication as section 6 maintainability; Step 3: fix names the standard or native API | Diff hunk, the named primitive, final maintainability finding | PASS if a reinvented-wheel instance is flagged with the standard or native replacement per assets/code_quality_checklist.md section 6; FAIL if duplication is waved through | 1. Confirm the primitive truly matches behavior and edge cases; 2. Check section 6 rows loaded; 3. Add the named replacement to the finding |

### Optional Supplemental Checks

If the primary run passes, repeat the scenario against a diff where the hand-rolled code legitimately differs from the primitive (an edge case the built-in does not cover) and confirm the reviewer does NOT force the replacement. Keep supplemental evidence separate from the primary verdict.

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
| `../../assets/code_quality_checklist.md` | Section 6 reinvent-the-wheel maintainability rows and recommended-fix wording |
| `../../SKILL.md` | Findings-first severity contract the maintainability finding slots into |

---

## 5. SOURCE METADATA

- Group: Efficiency And Restraint
- Playbook ID: CR-020
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--efficiency-and-restraint/reinvent-the-wheel-detection.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
