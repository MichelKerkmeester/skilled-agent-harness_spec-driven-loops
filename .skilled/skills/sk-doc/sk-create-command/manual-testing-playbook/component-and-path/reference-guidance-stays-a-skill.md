---
title: "CMD-002 -- Reference guidance stays a skill"
description: "This scenario validates that reusable guidance without a slash invocation is left to a skill or reference instead of becoming a command."
version: 1.0.0.3
---

# CMD-002 -- Reference guidance stays a skill

This document captures the negative component-choice contract for reusable guidance.

---

## 1. OVERVIEW

This scenario validates the boundary for `CMD-002`. It focuses on a request that must not create a slash command.

### Why This Matters

The command packet is for repeatable user-triggered workflows. Reusable standards belong in a skill or reference. The negative case prevents a prose guide from gaining an unnecessary invocation surface.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CMD-002`.

- Objective: leave reusable release-check guidance to a skill or reference.
- Realistic user request: `Write a reusable standard for release checks. It should explain the process and should not add a slash command.`
- Prompt: `Write a reusable standard for release checks. It should explain the process and should not add a slash command.`
- Expected execution process: read the component-choice reference, identify the lack of an invocation contract and decline to create a command file.
- Expected signals: a skill or reference is selected, no command path is proposed and the reason is stated.
- Desired user-visible outcome: the user knows which workflow owns reusable guidance.
- Pass/fail: PASS if no command is proposed. FAIL if a slash path, command frontmatter or argument hint is introduced.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Write a reusable standard for release checks. It should explain the process and should not add a slash command.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CMD-002 | Reference guidance stays a skill | Leave reusable guidance to a skill or reference | `Write a reusable standard for release checks. It should explain the process and should not add a slash command.` | 1. `agent: Read references/common-pitfalls.md and state the component comparison` -> 2. `agent: Check whether the request has a slash invocation or repeatable command input` -> 3. `agent: Return the owning skill or reference without proposing a command file` -> 4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/sk-create-command/SKILL.md --type skill` | Step 1: command and skill roles are distinguished. Step 2: no invocation contract is found. Step 3: a skill or reference is selected. Step 4: the mode contract validator output and exit status are captured | The prompt, component comparison, missing invocation finding, non-command response and validator transcript | PASS if no command is proposed and the skill boundary is named. FAIL if a command file, `argument-hint` or slash invocation is added | 1. Check for a repeatable user-triggered workflow. 2. Confirm the request asks how to document guidance, not how to invoke it. 3. Verify the validator was run on the mode contract |

### Commands

1. `agent: Read references/common-pitfalls.md and state the component comparison`
2. `agent: Check whether the request has a slash invocation or repeatable command input`
3. `agent: Return the owning skill or reference without proposing a command file`
4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/sk-create-command/SKILL.md --type skill`

### Expected

Step 1 states that a command is a user-triggered workflow entry. Step 2 finds no invocation or input contract. Step 3 leaves the work with a skill or reference. Step 4 records a real structural check on the mode contract.

### Evidence

Capture the prompt, comparison, missing invocation decision, owning workflow and validator output with its exit status.

### Pass / Fail

- **Pass**: the request is left to a skill or reference and no command artifact is proposed.
- **Fail**: a slash invocation, command filename or command frontmatter is proposed for reference prose alone.

### Failure Triage

1. Compare the request with the command-use rule.
2. Check for an input or mode that needs command parsing.
3. Confirm the answer does not create a command because the subject matter is operational.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory and scenario summary |
| No feature-catalog entry | This package has no feature catalog |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../SKILL.md`](../../SKILL.md) | When to use and when not to use the mode |
| [`../../references/common-pitfalls.md`](../../references/common-pitfalls.md) | Component choice and common mistakes |

---

## 5. SOURCE METADATA

- Group: COMPONENT AND PATH
- Playbook ID: CMD-002
- Canonical root source: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `component-and-path/reference-guidance-stays-a-skill.md`
