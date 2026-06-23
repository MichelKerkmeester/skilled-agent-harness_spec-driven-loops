---
title: "SP-012 -- RICCE validation gate"
description: "This scenario validates RICCE completeness for `SP-012`. It focuses on ensuring Role, Instructions, Context, Constraints, and Examples are present or justified."
version: 2.3.0.5
---

# SP-012 -- RICCE validation gate

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-012`.

---

## 1. OVERVIEW

This scenario validates that the final prompt passes the RICCE gate before delivery. The operator asks for a new-engineer onboarding prompt and verifies that `@prompt-improver` includes or justifies Role, Instructions, Context, Constraints, and Examples.

### Why This Matters

RICCE omissions create prompts that look polished but fail in handoff. The gate makes missing structure visible and recoverable.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-012` and confirm the expected signals without contradictory evidence.

- Objective: Confirm all RICCE elements are present or explicitly justified before delivery.
- Real user request: `Make my onboarding prompt for new engineers more rigorous — I want explicit role, instructions, context, constraints, and examples.`
- Prompt: `Strengthen my new-engineer onboarding prompt; verify the final output accounts for Role, Instructions, Context, Constraints, and Examples.`
- Expected execution process: `@prompt-improver` runs DEPTH, validates RICCE in Prototype/Harmonize, and blocks silent omissions.
- Expected signals: Five RICCE rows; each row is `present` or `omitted with reason`.
- Desired user-visible outcome: Enhanced onboarding prompt plus `RICCE: Role=present, Instructions=present, Context=present, Constraints=present, Examples=present`.
- Pass/fail: PASS if all 5 RICCE elements are present or justified; FAIL if any element is missing without explanation.

---

## 3. TEST EXECUTION

### Prompt

```
Strengthen my new-engineer onboarding prompt; verify the final output accounts for Role, Instructions, Context, Constraints, and Examples.
```

### Commands

1. `sk-prompt: Make my onboarding prompt for new engineers more rigorous — I want explicit role, instructions, context, constraints, and examples.`
2. `agent: @prompt-improver raw_task="Improve an onboarding prompt for new engineers with explicit RICCE coverage." task_type=generation target_cli=codex complexity_hint=7 constraints="Return Role, Instructions, Context, Constraints, Examples status."`
3. `bash: rg 'RICCE|Role, Instructions, Context, Constraints, Examples|present or justified' .opencode/skills/sk-prompt/SKILL.md .opencode/skills/sk-prompt/references/depth_framework.md`

### Expected

The final response includes an enhanced onboarding prompt and a RICCE status table with all 5 elements accounted for.

### Evidence

Capture the enhanced prompt body and the RICCE status table.

### Pass / Fail

- **Pass**: Role, Instructions, Context, Constraints, and Examples are each marked present or omitted with a concrete reason.
- **Fail**: Any RICCE element is absent from both the prompt and the status table.

### Failure Triage

1. Inspect SKILL.md §4 for the RICCE validation rule.
2. Inspect `depth_framework.md` Prototype and Harmonize gates for where the check should run.
3. Re-dispatch to `@prompt-improver` with `constraints="block delivery on missing RICCE status"`.

### Optional Supplemental Checks

Verify examples are meaningful examples, not placeholder labels with no sample content.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §4 RICCE rule, §7 `@prompt-improver` contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/depth_framework.md` | RICCE and phase-gate integration |
| `../../references/patterns_evaluation.md` | CLEAR scoring that quantitatively backs RICCE quality |

---

## 5. SOURCE METADATA

- Group: DEPTH+CLEAR Loop
- Playbook ID: SP-012
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--depth-clear-loop/ricce-validation-gate.md`
