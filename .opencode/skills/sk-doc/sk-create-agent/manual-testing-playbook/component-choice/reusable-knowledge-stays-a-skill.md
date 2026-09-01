---
title: "AGC-002 -- Reusable knowledge stays a skill"
description: "This scenario validates that reusable guidance without a runtime persona is left to the skill workflow instead of becoming an agent."
version: 1.0.0.0
---

# AGC-002 -- Reusable knowledge stays a skill

This document captures the negative component-choice contract for reusable guidance.

---

## 1. OVERVIEW

This scenario validates the boundary for `AGC-002`. It focuses on a request that must not create a runtime persona.

### Why This Matters

The mode is for a stable named persona with authority and tool policy. Reusable standards belong in a skill or reference. The negative case prevents a permission-bearing agent from becoming a container for general knowledge.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `AGC-002`.

- Objective: leave a reusable knowledge request to the skill workflow.
- Realistic user request: `Write a reusable guide for reviewing release notes. It should be reference knowledge and should not define a runtime role.`
- Prompt: `Write a reusable guide for reviewing release notes. It should be reference knowledge and should not define a runtime role.`
- Expected execution process: read the component-choice reference, compare the request with the agent decision rule and decline to create a runtime persona.
- Expected signals: the answer selects a skill or reference, explains why no agent is needed and proposes no permission block.
- Desired user-visible outcome: the user knows which component owns reusable guidance.
- Pass/fail: PASS if the request is left to a skill or reference. FAIL if an agent file, persona name or permission object is proposed.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Write a reusable guide for reviewing release notes. It should be reference knowledge and should not define a runtime role.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| AGC-002 | Reusable knowledge stays a skill | Leave a reusable knowledge request to the skill workflow | `Write a reusable guide for reviewing release notes. It should be reference knowledge and should not define a runtime role.` | 1. `agent: Read references/agent-vs-skill-vs-command.md and state the component rule` -> 2. `agent: Decide whether the request names a runtime persona` -> 3. `agent: Return the owning workflow without proposing an agent file` -> 4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/sk-create-agent/SKILL.md --type agent` | Step 1: the agent rule is quoted. Step 2: no runtime persona is found. Step 3: a skill or reference is selected. Step 4: the mode contract validates with its exit status captured | The prompt, reference excerpt, component decision, non-agent response and validation transcript | PASS if no agent is proposed and the skill boundary is named. FAIL if a runtime persona or permission object is introduced | 1. Check whether the request asks who should act or only how to document knowledge. 2. Confirm the answer names the lighter component. 3. Verify the validator was run on the mode contract and not used to justify an agent choice |

### Commands

1. `agent: Read references/agent-vs-skill-vs-command.md and state the component rule`
2. `agent: Decide whether the request names a runtime persona`
3. `agent: Return the owning workflow without proposing an agent file`
4. `bash: python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/sk-create-agent/SKILL.md --type agent`

### Expected

Step 1 states that an agent answers who and a skill answers how. Step 2 finds no named persona or authority need. Step 3 leaves the work with a skill or reference. Step 4 records a real structural check on the mode contract.

### Evidence

Capture the prompt, the component rule, the decision that no persona is needed, the owning workflow and validator output with its exit status.

### Pass / Fail

- **Pass**: the request is left to a skill or reference and no agent frontmatter is proposed.
- **Fail**: an agent filename, persona or permission object is proposed for reusable knowledge alone.

### Failure Triage

1. Compare the request with the agent signals in the reference.
2. Check for any authority or stable invocation requirement. None should be invented.
3. Confirm the answer does not create an agent merely because the content concerns agent work.

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
| [`../../references/agent-vs-skill-vs-command.md`](../../references/agent-vs-skill-vs-command.md) | Component decision rule |

---

## 5. SOURCE METADATA

- Group: COMPONENT CHOICE
- Playbook ID: AGC-002
- Canonical root source: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `component-choice/reusable-knowledge-stays-a-skill.md`
