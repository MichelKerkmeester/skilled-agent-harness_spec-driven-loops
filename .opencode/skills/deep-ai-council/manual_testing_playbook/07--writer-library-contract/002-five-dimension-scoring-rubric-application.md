---
title: "DAC-015 -- Five-dimension scoring rubric application"
description: "This scenario validates the five-dimension scoring rubric for `DAC-015`. It focuses on rubric weights and comparison-table application."
---

# DAC-015 -- Five-dimension scoring rubric application

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAC-015`.

---

## 1. OVERVIEW

This scenario validates the five-dimension scoring rubric for `DAC-015`. It focuses on matching agent §6 weights and applying them in a comparison table row.

### Why This Matters

Council synthesis must score every seat with the same rubric. Without the fixed weights, selection drifts back into subjective picking.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DAC-015` and confirm the expected signals without contradictory evidence.

- Objective: Verify the 5-dimension rubric is documented with weights matching agent §6 and can be applied to a hypothetical seat output.
- Real user request: Score this hypothetical council seat output using the 5-dimension rubric and show the comparison table row.
- Prompt: `Score this hypothetical council seat output using the 5-dimension rubric and show the comparison table row.`
- Expected execution process: Inspect `scoring_rubric.md` §2 and §3, then grep for the five weighted dimensions.
- Expected signals: Correctness 30, Completeness 20, Elegance 15, Robustness 20, and Integration 15 are present.
- Desired user-visible outcome: The user sees a scored comparison row using the documented weights.
- Pass/fail: PASS if all 5 dimensions are present with weights matching agent §6; FAIL if any weight or dimension is missing.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read `scoring_rubric.md` §2 and §3.
2. Run the grep command for the weighted dimensions.
3. Confirm the comparison table row can total to 100.

### Prompt

`Score this hypothetical council seat output using the 5-dimension rubric and show the comparison table row.`

### Commands

1. `bash: rg -n "Correctness.*30|Completeness.*20|Elegance.*15|Robustness.*20|Integration.*15" .opencode/skills/deep-ai-council/references/scoring/scoring_rubric.md`

### Expected

All 5 dimensions are present with weights matching agent §6.

### Evidence

Capture grep output showing each weighted dimension in `scoring_rubric.md`.

### Pass / Fail

- **Pass**: All 5 dimensions present with weights matching agent §6.
- **Fail**: Any dimension or weight is missing or mismatched.

### Failure Triage

Update `scoring_rubric.md` from the authoritative agent §6 table, then rerun validation.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-015 | Five-dimension scoring | Verify weighted rubric application | `Score this hypothetical council seat output using the 5-dimension rubric and show the comparison table row.` | `bash: rg -n "Correctness.*30\|Completeness.*20\|Elegance.*15\|Robustness.*20\|Integration.*15" .opencode/skills/deep-ai-council/references/scoring/scoring_rubric.md` | Five weighted dimensions present | Grep output | PASS if all dimensions match agent §6 | Restore rubric from agent source |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `feature_catalog/` | No feature catalog exists yet |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-ai-council/references/scoring/scoring_rubric.md` | Rubric and comparison-table reference |
| `.opencode/agents/ai-council.md` | Authoritative synthesis protocol |

---

## 5. SOURCE METADATA

- Group: WRITER LIBRARY CONTRACT
- Playbook ID: DAC-015
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--writer-library-contract/002-five-dimension-scoring-rubric-application.md`
