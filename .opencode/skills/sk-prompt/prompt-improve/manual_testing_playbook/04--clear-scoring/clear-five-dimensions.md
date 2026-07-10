---
title: "SP-015 -- CLEAR scores all five dimensions"
description: "This scenario validates five-dimension CLEAR scoring for `SP-015`. It focuses on Correctness, Logic, Expression, Arrangement, and Reusability being scored separately."
version: 2.3.0.5
---

# SP-015 -- CLEAR scores all five dimensions

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-015`.

---

## 1. OVERVIEW

This scenario validates that CLEAR output includes all five dimensions, not only a total. The operator asks for customer-feedback parsing prompt scoring and verifies that `@prompt-improver` returns C, L, E, A, and R values.

### Why This Matters

A total score alone hides the failure mode. Per-dimension scores make targeted improvement and regression triage possible.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-015` and confirm the expected signals without contradictory evidence.

- Objective: Confirm Correctness, Logic, Expression, Arrangement, and Reusability are each scored.
- Real user request: `Score my prompt for parsing customer feedback across all 5 CLEAR dimensions, not just the total.`
- Prompt: `Score and improve my customer-feedback parsing prompt; verify CLEAR reports all five dimension scores plus the total.`
- Expected execution process: `@prompt-improver` applies CLEAR after DEPTH Test and emits the five-dimension score breakdown.
- Expected signals: `CLEAR_SCORE: <n>/50 (C:<n> L:<n> E:<n> A:<n> R:<n>)`.
- Desired user-visible outcome: Enhanced prompt plus a five-dimension CLEAR breakdown.
- Pass/fail: PASS if all five dimension labels and numeric values appear; FAIL if any dimension is missing or only a total is provided.

---

## 3. TEST EXECUTION

### Prompt

```
Score and improve my customer-feedback parsing prompt; verify CLEAR reports all five dimension scores plus the total.
```

### Commands

1. `sk-prompt: Score my prompt for parsing customer feedback across all 5 CLEAR dimensions, not just the total.`
2. `agent: @prompt-improver raw_task="Score and improve a customer-feedback parsing prompt with full CLEAR breakdown." task_type=analyze target_cli=opencode complexity_hint=6 constraints="Return C, L, E, A, R and total."`
3. `bash: rg 'Correctness|Logic|Expression|Arrangement|Reusability|CLEAR_SCORE' .opencode/skills/sk-prompt/prompt-improve/references/patterns_evaluation.md .opencode/skills/sk-prompt/SKILL.md`

### Expected

The output includes all five CLEAR dimensions with numeric values and a total out of 50.

### Evidence

Capture the scoring block and final enhanced prompt.

### Pass / Fail

- **Pass**: C, L, E, A, and R appear with numeric values and sum to the displayed total.
- **Fail**: Any dimension is missing, non-numeric, or collapsed into an unexplained total.

### Failure Triage

1. Inspect `patterns_evaluation.md` CLEAR dimensions for the canonical labels and point values.
2. Inspect SKILL.md §7 structured output for the expected `CLEAR_SCORE` block.
3. Re-run through `@prompt-improver` with `constraints="print CLEAR_SCORE exactly as C/L/E/A/R"`.

### Optional Supplemental Checks

Check that Expression is scored out of 15 and Reusability out of 5, not all dimensions out of 10.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §3 scoring systems and §7 `@prompt-improver` output |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/patterns_evaluation.md` | CLEAR dimension definitions and scoring rubrics |
| `../../references/depth_framework.md` | Test-phase CLEAR checkpoint |

---

## 5. SOURCE METADATA

- Group: CLEAR Scoring
- Playbook ID: SP-015
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--clear-scoring/clear-five-dimensions.md`
