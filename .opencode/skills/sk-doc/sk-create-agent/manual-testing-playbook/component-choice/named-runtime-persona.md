---
title: "AGC-001 -- Named runtime persona"
description: "This scenario validates choosing an agent for a stable runtime persona with explicit permissions and an authority boundary."
version: 1.0.0.0
---

# AGC-001 -- Named runtime persona

This document captures the operator contract for choosing an agent when a request needs a stable runtime persona.

---

## 1. OVERVIEW

This scenario validates agent selection for `AGC-001`. It focuses on a named persona with explicit permissions and a non-delegating boundary.

### Why This Matters

An agent answers who should do the work. A skill answers how the work should be done. A command answers how a user should trigger it. Choosing the wrong component creates the wrong runtime contract.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `AGC-001`.

- Objective: choose an agent when the request needs a stable persona, permissions and an authority boundary.
- Realistic user request: `I need a named OpenCode persona that reviews release notes and can read files but cannot delegate work. Create the agent file.`
- Prompt: `I need a named OpenCode persona that reviews release notes and can read files but cannot delegate work. Create the agent file.`
- Expected execution process: read the component-choice reference, identify the runtime role, select `.opencode/agents/` and keep reusable review rules in a linked skill.
- Expected signals: the answer selects an agent, names the OpenCode runtime path and denies delegation for the leaf role.
- Desired user-visible outcome: the operator gets a bounded agent plan with linked domain guidance.
- Pass/fail: PASS if the answer names the agent decision and its authority boundary. FAIL if it selects a skill or command, or embeds reusable guidance as the agent's main purpose.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `I need a named OpenCode persona that reviews release notes and can read files but cannot delegate work. Create the agent file.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| AGC-001 | Named runtime persona | Select an agent for a stable persona with permissions and a non-delegating boundary | `I need a named OpenCode persona that reviews release notes and can read files but cannot delegate work. Create the agent file.` | 1. `agent: Read references/agent-vs-skill-vs-command.md and state the component rule` -> 2. `agent: Resolve the runtime directory and authority boundary` -> 3. `agent: State which reusable guidance stays in a skill` -> 4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/check_authored_name_kebab.py .opencode/agents/release-note-reviewer.md` | Step 1: agent is selected for role and authority. Step 2: `.opencode/agents/` and no delegation are named. Step 3: reusable rules are linked, not pasted. Step 4: the authored-name check result and exit status are captured | The prompt as typed, the component decision, runtime path, authority boundary, linked guidance and validator transcript | PASS if the mode selects an agent and keeps the boundary narrow. FAIL if the request is routed to a skill or command, or if delegation is granted without an orchestration role | 1. Confirm the role needs a stable persona rather than only reusable knowledge. 2. Check the runtime path before reviewing frontmatter. 3. Verify the leaf does not receive `task: allow` without an orchestration need |

### Commands

1. `agent: Read references/agent-vs-skill-vs-command.md and state the component rule`
2. `agent: Resolve the runtime directory and authority boundary`
3. `agent: State which reusable guidance stays in a skill`
4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/check_authored_name_kebab.py .opencode/agents/release-note-reviewer.md`

### Expected

Step 1 selects an agent because the request names a reusable runtime persona with tool limits. Step 2 resolves the OpenCode path and a leaf boundary. Step 3 keeps domain guidance in a skill or reference. Step 4 checks the kebab-case target name.

### Evidence

Capture the prompt, component decision, runtime path, authority boundary and literal check output with its exit status.

### Pass / Fail

- **Pass**: the answer selects an agent and names the runtime path and authority boundary.
- **Fail**: the answer creates a skill or command, grants delegation without a role need or moves the artifact outside the runtime agent directory.

### Failure Triage

1. Re-read the component comparison and identify whether the request asks who should act.
2. Check whether the proposed file has explicit runtime authority rather than only reference prose.
3. Confirm reusable domain content is linked instead of copied into the agent body.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory and scenario summary |
| No feature-catalog entry | This package has no feature catalog |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Component choice and runtime placement |
| [`../../references/agent-vs-skill-vs-command.md`](../../references/agent-vs-skill-vs-command.md) | Agent versus skill and command decision |

---

## 5. SOURCE METADATA

- Group: COMPONENT CHOICE
- Playbook ID: AGC-001
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `component-choice/named-runtime-persona.md`
