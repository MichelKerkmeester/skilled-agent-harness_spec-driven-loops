---
title: "CMD-001 -- Repeatable slash command"
description: "This scenario validates selecting a repeatable user-triggered workflow as a slash command with a valid namespace path."
version: 1.0.0.3
---

# CMD-001 -- Repeatable slash command

This document captures the command-choice and path contract for a repeatable workflow.

---

## 1. OVERVIEW

This scenario validates command selection for `CMD-001`. It focuses on a repeatable slash invocation with a namespace and action path.

### Why This Matters

A command answers how a user triggers a workflow. A skill supplies reusable guidance. The path and invocation are part of the command contract, so a file can have good content and still expose the wrong command.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CMD-001`.

- Objective: select a command for a repeatable user-triggered workflow and resolve its path.
- Realistic user request: `I want a repeatable /release:check command that takes a path and returns a structured status. It should run the same workflow each time.`
- Prompt: `I want a repeatable /release:check command that takes a path and returns a structured status. It should run the same workflow each time.`
- Expected execution process: read the component-choice rules, classify the workflow as a command and resolve `.opencode/commands/release/check.md`.
- Expected signals: the command type is named, the namespace and action use lowercase hyphen-case and the invocation is `/release:check`.
- Desired user-visible outcome: the user receives a valid command path and invocation shape.
- Pass/fail: PASS if the request is routed to a command with a valid path. FAIL if it is routed to a skill, a root command path or a non-kebab segment.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `I want a repeatable /release:check command that takes a path and returns a structured status. It should run the same workflow each time.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CMD-001 | Repeatable slash command | Select a command and resolve a valid namespace path | `I want a repeatable /release:check command that takes a path and returns a structured status. It should run the same workflow each time.` | 1. `agent: Read references/common-pitfalls.md and state the command choice rule` -> 2. `agent: Resolve the namespace and action path for /release:check` -> 3. `agent: State why this is a command rather than a skill` -> 4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/check_authored_name_kebab.py .opencode/commands/create/command.md` | Step 1: a user-triggered repeatable workflow selects command. Step 2: the namespace path is valid. Step 3: reusable guidance is separated from the entry point. Step 4: the name check output and exit status are captured | The prompt, component decision, resolved path, invocation and name-check transcript | PASS if the workflow is assigned to a valid slash command. FAIL if a skill is selected or the path violates the naming rule | 1. Check whether the request needs a repeatable invocation. 2. Verify the namespace and action against the kebab-case rule. 3. Confirm the command owns executable steps rather than reference prose |

### Commands

1. `agent: Read references/common-pitfalls.md and state the command choice rule`
2. `agent: Resolve the namespace and action path for /release:check`
3. `agent: State why this is a command rather than a skill`
4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/check_authored_name_kebab.py .opencode/commands/create/command.md`

### Expected

Step 1 identifies a repeatable user-triggered workflow. Step 2 resolves `.opencode/commands/release/check.md`. Step 3 keeps reusable rules in a skill. Step 4 checks a real command name with the shared authored-name checker.

### Evidence

Capture the prompt, component decision, path, invocation and check output with its exit status.

### Pass / Fail

- **Pass**: the request is assigned to a command and the path uses valid namespace and action names.
- **Fail**: the request is assigned to a skill, the path is rooted incorrectly or a name uses underscores.

### Failure Triage

1. Re-read the command versus skill comparison.
2. Check the path segments and the resulting slash invocation.
3. Confirm the workflow has repeatable executable steps.

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
| [`../../SKILL.md`](../../SKILL.md) | Command choice and path resolution |
| [`../../references/common-pitfalls.md`](../../references/common-pitfalls.md) | Command versus skill distinction |

---

## 5. SOURCE METADATA

- Group: COMPONENT AND PATH
- Playbook ID: CMD-001
- Canonical root source: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `component-and-path/repeatable-slash-command.md`
