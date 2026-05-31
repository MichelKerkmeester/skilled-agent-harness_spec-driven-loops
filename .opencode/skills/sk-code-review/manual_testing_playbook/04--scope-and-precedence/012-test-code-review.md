---
title: "CR-012 -- Test code review"
description: "This scenario validates Test code review for `CR-012`. It focuses on Confirm test-only changes are reviewed for false confidence, isolation, and meaningful assertions."
---

# CR-012 -- Test code review

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-012`.

---

## 1. OVERVIEW

This scenario validates Test code review for `CR-012`. It focuses on Confirm test-only changes are reviewed for false confidence, isolation, and meaningful assertions.

### Why This Matters

Tests get reviewed too lightly because 'they're just tests' - but assertion-free tests, swallowed assertions, over-mocking, and flaky shared-state setups ship coverage gaps that look green. CR-012 applies the test_quality_checklist with the same severity discipline as production code: a test that asserts nothing is worse than no test, because it falsely signals safety.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-012` and confirm the expected signals without contradictory evidence.

- Objective: Confirm test-only changes are reviewed for false confidence, isolation, and meaningful assertions.
- Real user request: `Review target only changes test files.`
- Prompt: `Review the staged test-only diff for assertion-free tests, swallowed assertions, over-mocking, flaky state, and cleanup gaps.`
- Expected execution process: Run the deterministic command sequence, capture the transcript, compare the output against sk-code-review references, and record a PASS, PARTIAL, FAIL, or SKIP verdict with rationale.
- Expected signals: Step 1: test diff captured; Step 2: test-quality checklist applied; Step 3: findings avoid production-style-only noise
- Desired user-visible outcome: a test-quality findings report that a real maintainer can act on without asking for missing scope or evidence.
- Pass/fail: PASS if findings use references/test_quality_checklist.md severity guidance and cite file:line; FAIL if assertion-free tests are approved

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
| CR-012 | Test code review | Confirm test-only changes are reviewed for false confidence, isolation, and meaningful assertions. | `Review the staged test-only diff for assertion-free tests, swallowed assertions, over-mocking, flaky state, and cleanup gaps.` | bash: git diff --staged -- '*test*' '*spec*' -> agent: @review test-only diff -> bash: rg -n -e "catch" -e "expect\(" -e "assert" -e "mock" -e "beforeEach" -e "afterEach" path/to/tests | Step 1: test diff captured; Step 2: test-quality checklist applied; Step 3: findings avoid production-style-only noise | Test diff, grep transcript, final report | PASS if findings use references/test_quality_checklist.md severity guidance and cite file:line; FAIL if assertion-free tests are approved | 1. Count assertions; 2. Inspect catch blocks; 3. Check isolation and cleanup |

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
| `../../references/test_quality_checklist.md` | Test-only review severity guidance |

---

## 5. SOURCE METADATA

- Group: Scope And Precedence
- Playbook ID: CR-012
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--scope-and-precedence/012-test-code-review.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
