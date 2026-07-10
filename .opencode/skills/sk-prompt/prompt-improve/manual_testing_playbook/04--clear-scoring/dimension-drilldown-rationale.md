---
title: "SP-018 -- CLEAR dimension rationale included"
description: "This scenario validates per-dimension CLEAR rationale for `SP-018`. It focuses on explaining why each score was assigned."
version: 2.3.0.5
---

# SP-018 -- CLEAR dimension rationale included

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-018`.

---

## 1. OVERVIEW

This scenario validates that CLEAR scoring includes rationale, not only numbers. The operator asks for a data-validation prompt score and verifies that `@prompt-improver` explains each dimension score.

### Why This Matters

Scores without rationale are hard to trust and hard to improve. Dimension rationale turns scoring into actionable feedback.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-018` and confirm the expected signals without contradictory evidence.

- Objective: Confirm each CLEAR dimension has a one-line rationale.
- Real user request: `Score my data validation prompt and tell me WHY each CLEAR dimension got the score it did.`
- Prompt: `Score my data-validation prompt; verify every CLEAR dimension includes a numeric score and one-line rationale.`
- Expected execution process: `@prompt-improver` applies CLEAR and emits rationale for Correctness, Logic, Expression, Arrangement, and Reusability.
- Expected signals: Five rationale lines in the form `<Dimension>: <score> -- <reason>`.
- Desired user-visible outcome: Enhanced prompt plus auditable CLEAR rationale.
- Pass/fail: PASS if all five dimensions include score and rationale; FAIL if any rationale is missing or generic.

---

## 3. TEST EXECUTION

### Prompt

```
Score my data-validation prompt; verify every CLEAR dimension includes a numeric score and one-line rationale.
```

### Commands

1. `sk-prompt: Score my data validation prompt and tell me WHY each CLEAR dimension got the score it did.`
2. `agent: @prompt-improver raw_task="Score and improve a data-validation prompt with per-dimension CLEAR rationale." task_type=analyze target_cli=opencode complexity_hint=7 constraints="Each CLEAR dimension must include a one-line reason."`
3. `bash: rg 'Per-Dimension Scoring Rubrics|Scoring Criteria|CLEAR Dimensions' .opencode/skills/sk-prompt/prompt-improve/references/patterns_evaluation.md`

### Expected

The output includes five rationale-backed dimension lines and a total CLEAR score.

### Evidence

Capture the CLEAR breakdown, the rationale for each dimension, and the enhanced prompt.

### Pass / Fail

- **Pass**: Correctness, Logic, Expression, Arrangement, and Reusability each include score plus rationale.
- **Fail**: Any rationale is absent, duplicated verbatim, or too generic to explain the score.

### Failure Triage

1. Inspect `patterns_evaluation.md` scoring rubrics for score criteria.
2. Confirm the `@prompt-improver` response is not using the compact CLI-card format only.
3. Re-run with `constraints="include score rationale for C, L, E, A, R"`.

### Optional Supplemental Checks

Verify rationale points to the actual prompt content, not abstract CLEAR definitions.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §7 `@prompt-improver` structured output |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/patterns_evaluation.md` | CLEAR scoring rubrics and dimension criteria |
| `../../references/depth_framework.md` | Transparency model for user-visible scoring evidence |

---

## 5. SOURCE METADATA

- Group: CLEAR Scoring
- Playbook ID: SP-018
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--clear-scoring/dimension-drilldown-rationale.md`
