---
title: "CR-015 -- AI-generated suspect quality"
description: "This scenario validates AI-generated suspect quality for `CR-015`. It focuses on Confirm AI-generated code is reviewed for over-abstraction, missing tests, and invented contracts without biasing severity unfairly."
---

# CR-015 -- AI-generated suspect quality

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-015`.

---

## 1. OVERVIEW

This scenario validates AI-generated suspect quality for `CR-015`. It focuses on Confirm AI-generated code is reviewed for over-abstraction, missing tests, and invented contracts without biasing severity unfairly.

### Why This Matters

AI-generated implementations pass shallow reads (variable names look right, types compile) but fail on edge cases, contract safety, and KISS/DRY when the underlying intent was hallucinated. CR-015 puts the adversarial Hunter/Skeptic/Referee discipline on plausible-looking output: the reviewer must check error paths, boundary conditions, and consumer assumptions, then disclose confidence rather than rubber-stamp.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-015` and confirm the expected signals without contradictory evidence.

- Objective: Confirm AI-generated code is reviewed for over-abstraction, missing tests, and invented contracts without biasing severity unfairly.
- Real user request: `Review target is suspected AI-generated code.`
- Prompt: `Review this suspected AI-generated diff for over-abstraction, contract safety, and test adequacy based on behavior, not authorship.`
- Expected execution process: Run the deterministic command sequence, capture the transcript, compare the output against sk-code-review references, and record a PASS, PARTIAL, FAIL, or SKIP verdict with rationale.
- Expected signals: Step 1: changed size visible; Step 2: suspect patterns checked; Step 3: findings tie to behavior not authorship
- Desired user-visible outcome: a balanced quality review that a real maintainer can act on without asking for missing scope or evidence.
- Pass/fail: PASS if over-engineering and missing tests are assessed via references/code_quality_checklist.md and test_quality_checklist.md; FAIL if report relies on AI-generated label alone

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
| CR-015 | AI-generated suspect quality | Confirm AI-generated code is reviewed for over-abstraction, missing tests, and invented contracts without biasing severity unfairly. | `Review this suspected AI-generated diff for over-abstraction, contract safety, and test adequacy based on behavior, not authorship.` | bash: git diff --staged --stat -> bash: rg -n -e "TODO" -e "placeholder" -e "future" -e "generic" -e "any" -e "unknown" -e "mock" path/to/changed/files -> agent: @review generated-code diff | Step 1: changed size visible; Step 2: suspect patterns checked; Step 3: findings tie to behavior not authorship | Diff stat, pattern grep, final report | PASS if over-engineering and missing tests are assessed via references/code_quality_checklist.md and test_quality_checklist.md; FAIL if report relies on AI-generated label alone | 1. Remove authorship assumptions; 2. Cite behavior risk; 3. Verify tests cover changed behavior |

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
| `../../references/fix-completeness-checklist.md` | Disposition and proof requirements for fixes |
| `../../references/code_quality_checklist.md` | Contract, KISS, DRY, and correctness checks |
| `../../references/review_core.md` | Evidence-first severity and uncertainty discipline |

---

## 5. SOURCE METADATA

- Group: Re Review And Stale Context
- Playbook ID: CR-015
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--re-review-and-stale-context/015-ai-generated-code-suspect-quality.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
