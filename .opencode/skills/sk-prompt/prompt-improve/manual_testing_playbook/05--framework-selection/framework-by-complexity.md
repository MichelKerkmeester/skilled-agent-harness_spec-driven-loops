---
title: "SP-019 -- Framework selection by complexity"
description: "This scenario validates complexity-based framework routing for `SP-019`. It focuses on routing to RACE, RCAF, COSTAR, CIDI, TIDD-EC, CRISPE, or CRAFT based on task characteristics."
version: 2.3.0.7
---

# SP-019 -- Framework selection by complexity

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-019`.

---

## 1. OVERVIEW

This scenario validates that framework selection follows the documented complexity and characteristic matrix. The operator asks for customer-support prompt improvement and verifies that `@prompt-improver` selects an appropriate framework with a visible complexity score.

### Why This Matters

Framework selection is where sk-prompt decides how much structure the prompt needs. A wrong framework either under-specifies complex work or overbuilds simple work.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-019` and confirm the expected signals without contradictory evidence.

- Objective: Confirm complexity and task characteristics route to the documented framework family.
- Real user request: `Pick the right framework for my customer support response prompt — and explain why.`
- Prompt: `Improve my customer-support response prompt; verify framework selection evaluates complexity, chooses the right family, and returns score plus rationale.`
- Expected execution process: `@prompt-improver` scores task complexity, evaluates framework fit, selects the best framework, and names at least one alternative.
- Expected signals: Framework name is one of the seven documented frameworks; complexity score is 1-10; rationale matches the matrix.
- Desired user-visible outcome: Enhanced prompt plus `FRAMEWORK`, complexity score, and rationale.
- Pass/fail: PASS if selected framework aligns with documented complexity/task characteristics; FAIL if framework is absent, unsupported, or contradicted by the matrix without explanation.

---

## 3. TEST EXECUTION

### Prompt

```
Improve my customer-support response prompt; verify framework selection evaluates complexity, chooses the right family, and returns score plus rationale.
```

### Commands

1. `sk-prompt: Pick the right framework for my customer support response prompt — and explain why.`
2. `agent: @prompt-improver raw_task="Improve a customer support response prompt and select the right framework." task_type=generation target_cli=opencode complexity_hint=5 constraints="Return complexity score, selected framework, and rejected alternative."`
3. `bash: rg 'Framework Selection Matrix|Complete Framework Matrix|Complexity' .opencode/skills/sk-prompt/SKILL.md .opencode/skills/sk-prompt/prompt-improve/references/patterns_evaluation.md`

### Expected

The response selects a documented framework, includes complexity score, explains why it fits, and returns an enhanced prompt.

### Evidence

Capture `FRAMEWORK`, complexity score, rationale, rejected alternative, and the enhanced prompt.

### Pass / Fail

- **Pass**: Framework is documented and rationale aligns with complexity/task characteristics.
- **Fail**: Unsupported framework selected, no complexity score, or rationale conflicts with source matrix.

### Failure Triage

1. Inspect SKILL.md Framework Selection Matrix.
2. Inspect `patterns_evaluation.md` Complete Framework Matrix and algorithm.
3. Re-run through `@prompt-improver` with `constraints="cite complexity and selected/rejected framework"`.

### Optional Supplemental Checks

Run a second low-complexity variant and verify RACE or RCAF becomes more likely than CRAFT.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §3 framework selection matrix and §7 `@prompt-improver` contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/patterns_evaluation.md` | Seven-framework library and selection algorithm |

---

## 5. SOURCE METADATA

- Group: Framework Selection
- Playbook ID: SP-019
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--framework-selection/framework-by-complexity.md`
