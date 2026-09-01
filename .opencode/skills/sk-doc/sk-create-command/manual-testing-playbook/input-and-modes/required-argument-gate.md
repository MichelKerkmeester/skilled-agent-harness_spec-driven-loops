---
title: "CMI-001 -- Required argument gate"
description: "This scenario validates the mandatory input gate for a required command argument and its ban on inferred context."
version: 1.0.0.0
---

# CMI-001 -- Required argument gate

This document captures the input-gate contract for a command with a required target.

---

## 1. OVERVIEW

This scenario validates `CMI-001`. It focuses on a required `argument-hint`, an immediate gate and explicit user input.

### Why This Matters

A command with a required input can run against the wrong target if it guesses from context. The mode requires the gate before other content and forbids inference from open files or conversation history.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CMI-001`.

- Objective: add a mandatory gate for a required target path and stop when input is absent.
- Realistic user request: `Create a command that requires a target path. It must stop and ask when the path is missing instead of guessing from open files.`
- Prompt: `Create a command that requires a target path. It must stop and ask when the path is missing instead of guessing from open files.`
- Expected execution process: read the argument-hint reference, place the gate immediately after frontmatter and test empty input with and without a mode suffix.
- Expected signals: the gate checks empty, undefined and whitespace-only input, ignores `:auto` or `:confirm` when checking content and waits for an explicit path.
- Desired user-visible outcome: the command asks for the target instead of guessing.
- Pass/fail: PASS if the gate precedes the body and forbids inference. FAIL if the command runs first or derives a path from context.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Create a command that requires a target path. It must stop and ask when the path is missing instead of guessing from open files.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CMI-001 | Required argument gate | Require explicit target input before command workflow steps | `Create a command that requires a target path. It must stop and ask when the path is missing instead of guessing from open files.` | 1. `agent: Read references/argument-hints-and-modes.md and state the required-argument rule` -> 2. `agent: Inspect the draft immediately after frontmatter for the blocking gate` -> 3. `agent: Test empty input, whitespace-only input and a mode-only suffix` -> 4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/commands/create/command.md --type command` | Step 1: required angle brackets and a gate are named. Step 2: the gate is first after frontmatter. Step 3: all three missing-input forms stop and ask for explicit input. Step 4: validator output and exit status are captured | The prompt, reference rule, gate excerpt, three input checks and validator transcript | PASS if the gate is immediate and rejects inferred context. FAIL if a mode suffix counts as the required input or the workflow runs without a target | 1. Check the argument hint for a required angle-bracket value. 2. Confirm the gate comes before the H1 and workflow instructions. 3. Verify the test used a mode-only suffix as a boundary case |

### Commands

1. `agent: Read references/argument-hints-and-modes.md and state the required-argument rule`
2. `agent: Inspect the draft immediately after frontmatter for the blocking gate`
3. `agent: Test empty input, whitespace-only input and a mode-only suffix`
4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/commands/create/command.md --type command`

### Expected

Step 1 establishes that a required hint needs a blocking gate. Step 2 checks placement. Step 3 proves the gate does not mistake a mode suffix for content. Step 4 records a structural validator run.

### Evidence

Capture the prompt, hint, gate excerpt, input results and validator output with its exit status.

### Pass / Fail

- **Pass**: the gate is first after frontmatter, waits for explicit input and rejects all missing-input forms.
- **Fail**: the command infers a path, treats a suffix as input or starts workflow steps before the gate.

### Failure Triage

1. Inspect the first body lines after frontmatter.
2. Compare the gate checks with the required-input reference.
3. Repeat with `:auto` alone and confirm it still stops.

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
| [`../../SKILL.md`](../../SKILL.md) | Mandatory input gates |
| [`../../references/argument-hints-and-modes.md`](../../references/argument-hints-and-modes.md) | Required arguments and mode suffixes |

---

## 5. SOURCE METADATA

- Group: INPUT AND MODES
- Playbook ID: CMI-001
- Canonical root source: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `input-and-modes/required-argument-gate.md`
