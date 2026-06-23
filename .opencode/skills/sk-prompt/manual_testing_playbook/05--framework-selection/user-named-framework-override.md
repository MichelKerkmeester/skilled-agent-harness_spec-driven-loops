---
title: "SP-020 -- User-named framework override wins"
description: "This scenario validates explicit framework override handling for `SP-020`. It focuses on honoring a user-named framework over automatic routing."
version: 2.3.0.5
---

# SP-020 -- User-named framework override wins

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-020`.

---

## 1. OVERVIEW

This scenario validates that an explicitly named framework wins over automatic framework selection. The operator asks for CRAFT on a technical-specification authoring prompt and verifies that `@prompt-improver` honors that choice.

### Why This Matters

Explicit user constraints outrank heuristics unless they are unsafe or contradictory. Ignoring named frameworks makes sk-prompt feel unpredictable to experienced operators.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-020` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a user-named framework is selected and logged as an override.
- Real user request: `Apply CRAFT framework to my prompt for technical specification authoring.`
- Prompt: `Apply CRAFT to my technical-spec authoring prompt; verify it overrides automatic framework routing and logs the user-named override.`
- Expected execution process: `@prompt-improver` detects the named CRAFT framework, applies it unless contradicted, and reports the override in rationale.
- Expected signals: `FRAMEWORK: CRAFT`; rationale includes `user-named` or `explicit override`.
- Desired user-visible outcome: CRAFT-structured enhanced prompt with override rationale.
- Pass/fail: PASS if CRAFT is used and override is logged; FAIL if another framework is selected without a contradiction explanation.

---

## 3. TEST EXECUTION

### Prompt

```
Apply CRAFT to my technical-spec authoring prompt; verify it overrides automatic framework routing and logs the user-named override.
```

### Commands

1. `sk-prompt: Apply CRAFT framework to my prompt for technical specification authoring.`
2. `agent: @prompt-improver raw_task="Apply CRAFT framework to a technical specification authoring prompt." task_type=generation target_cli=codex complexity_hint=4 constraints="User explicitly requested CRAFT; honor and log override."`
3. `bash: rg 'CRAFT|Framework Selection|user' .opencode/skills/sk-prompt/references/patterns_evaluation.md .opencode/skills/sk-prompt/SKILL.md`

### Expected

The response uses CRAFT and names the override in the rationale.

### Evidence

Capture `FRAMEWORK: CRAFT`, the override rationale, and CRAFT sections in the enhanced prompt.

### Pass / Fail

- **Pass**: CRAFT is selected and the report says the user named the framework.
- **Fail**: Automatic routing selects another framework without explaining why CRAFT was impossible or contradictory.

### Failure Triage

1. Confirm the operator request explicitly names `CRAFT`.
2. Inspect `patterns_evaluation.md` for CRAFT structure and valid use cases.
3. Re-dispatch to `@prompt-improver` with `constraints="FRAMEWORK must be CRAFT unless contradicted; explain if rejected"`.

### Optional Supplemental Checks

Verify the enhanced prompt includes CRAFT elements: Context, Role, Action, Format, Target.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §2 primary detection and §7 `@prompt-improver` contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/patterns_evaluation.md` | CRAFT definition and framework matrix |
| `../../references/depth_framework.md` | DEPTH phases applying selected framework |

---

## 5. SOURCE METADATA

- Group: Framework Selection
- Playbook ID: SP-020
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--framework-selection/user-named-framework-override.md`
