---
title: "SP-013 -- Mechanism-first prototype"
description: "This scenario validates mechanism-first prompt structure for `SP-013`. It focuses on WHY-before-WHAT ordering in the Prototype phase."
version: 2.3.0.5
---

# SP-013 -- Mechanism-first prototype

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-013`.

---

## 1. OVERVIEW

This scenario validates that Prototype builds the enhanced prompt with mechanism first: role/context and why the approach works before action instructions. The operator asks for microservices explanation prompt improvement and verifies that `@prompt-improver` does not lead with bare imperatives.

### Why This Matters

Mechanism-first structure improves model grounding. If Prototype jumps straight to commands, the output can be clear-looking but shallow.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-013` and confirm the expected signals without contradictory evidence.

- Objective: Confirm Prototype orders WHY/context before WHAT/instructions.
- Real user request: `Refactor my prompt for explaining microservices — explain WHY they help before WHAT they are.`
- Prompt: `Refactor my microservices explanation prompt; verify Prototype orders WHY and context before WHAT and instructions.`
- Expected execution process: `@prompt-improver` reaches Prototype, validates mechanism-first ordering, and revises any prompt that starts with action before context.
- Expected signals: First section establishes role/context/mechanism; later section gives instructions or tasks.
- Desired user-visible outcome: Enhanced prompt whose first section explains the teaching mechanism before asking for the explanation deliverable.
- Pass/fail: PASS if WHY/context appears before WHAT/action; FAIL if the prompt opens with an imperative task and no mechanism/context.

---

## 3. TEST EXECUTION

### Prompt

```
Refactor my microservices explanation prompt; verify Prototype orders WHY and context before WHAT and instructions.
```

### Commands

1. `sk-prompt: Refactor my prompt for explaining microservices — explain WHY they help before WHAT they are.`
2. `agent: @prompt-improver raw_task="Improve a prompt that teaches microservices using WHY-before-WHAT ordering." task_type=generation target_cli=opencode complexity_hint=6 constraints="First establish mechanism and context, then instructions."`
3. `bash: rg 'Mechanism First|WHY then WHAT|Prototype' .opencode/skills/sk-prompt/prompt-improve/references/depth_framework.md`

### Expected

The enhanced prompt begins with role, audience context, and why microservices help, then moves into instructions for explaining what they are.

### Evidence

Capture the first two sections of the enhanced prompt and the transparency note that Prototype validated mechanism-first structure.

### Pass / Fail

- **Pass**: The prompt establishes WHY/context before WHAT/action and the report names mechanism-first validation.
- **Fail**: The prompt starts with task imperatives, omits the mechanism, or lacks Prototype validation evidence.

### Failure Triage

1. Inspect the Prototype phase in `depth_framework.md` for mechanism-first validation.
2. Check whether a selected framework reordered the content against the mechanism-first requirement.
3. Re-run through `@prompt-improver` with `constraints="reject outputs that begin with action before context"`.

### Optional Supplemental Checks

Verify the mechanism-first section is domain-specific to microservices, not generic prompt advice.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §3 pipeline and §7 `@prompt-improver` contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/depth_framework.md` | Mechanism-first technique and Prototype exit criteria |
| `../../references/patterns_evaluation.md` | Framework structures that Prototype applies |

---

## 5. SOURCE METADATA

- Group: DEPTH+CLEAR Loop
- Playbook ID: SP-013
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `depth-clear-loop/mechanism-first-prototype.md`
