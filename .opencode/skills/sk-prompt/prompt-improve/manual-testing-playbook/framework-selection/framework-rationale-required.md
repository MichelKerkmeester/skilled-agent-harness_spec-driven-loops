---
title: "SP-021 -- Framework rationale required"
description: "This scenario validates framework-selection rationale for `SP-021`. It focuses on explaining why the selected framework won over alternatives."
version: 2.3.0.7
---

# SP-021 -- Framework rationale required

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-021`.

---

## 1. OVERVIEW

This scenario validates that framework selection is explained, not merely declared. The operator asks for code-documentation prompt improvement and verifies that `@prompt-improver` states why the selected framework beats at least one alternative.

### Why This Matters

Framework rationale is the audit trail for prompt structure. Without it, operators cannot tell whether the framework was chosen or guessed.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-021` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the framework-selection report names the chosen framework, at least one rejected alternative, and a differentiating criterion.
- Real user request: `Tighten my prompt for code documentation generation — and tell me why you picked the framework you did instead of the others.`
- Prompt: `Tighten my code documentation prompt; verify the framework rationale names the choice, a rejected alternative, and the differentiating criterion.`
- Expected execution process: `@prompt-improver` evaluates framework fit, selects one framework, and includes a why-this-over-alternatives rationale.
- Expected signals: `FRAMEWORK`, `rejected`, and `reason` fields or equivalent lines.
- Desired user-visible outcome: Enhanced prompt plus concise framework rationale.
- Pass/fail: PASS if rationale includes chosen framework, rejected alternative, and differentiating criterion; FAIL if rationale only says the chosen framework is "best".

---

## 3. TEST EXECUTION

### Prompt

```
Tighten my code documentation prompt; verify the framework rationale names the choice, a rejected alternative, and the differentiating criterion.
```

### Commands

1. `sk-prompt: Tighten my prompt for code documentation generation — and tell me why you picked the framework you did instead of the others.`
2. `agent: @prompt-improver raw_task="Improve a code documentation generation prompt and explain framework choice over alternatives." task_type=generation target_cli=opencode complexity_hint=6 constraints="Rationale must include selected framework, rejected alternative, and criterion."`
3. `bash: rg 'alternative|reasoning|select_best|Framework Selection Algorithm' .opencode/skills/sk-prompt/prompt-improve/references/patterns-evaluation.md`

### Expected

The output includes an enhanced prompt and a rationale comparing the selected framework with at least one rejected alternative.

### Evidence

Capture the rationale line, selected framework, rejected alternative, criterion, and enhanced prompt.

### Pass / Fail

- **Pass**: Chosen framework, rejected alternative, and differentiating criterion are all explicit.
- **Fail**: Rationale is absent, circular, or does not name an alternative.

### Failure Triage

1. Inspect `patterns-evaluation.md` Framework Selection Algorithm for primary/alternative output.
2. Confirm `@prompt-improver` returned the structured `RATIONALE` field.
3. Re-dispatch with `constraints="include why not RCAF/CRAFT/TIDD-EC as applicable"`.

### Optional Supplemental Checks

Verify the rejected alternative is plausible for the task, not a strawman unrelated framework.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §7 structured output block |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/patterns-evaluation.md` | Framework selection algorithm and alternative reasoning |

---

## 5. SOURCE METADATA

- Group: Framework Selection
- Playbook ID: SP-021
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `framework-selection/framework-rationale-required.md`
