---
title: "SKD-021 -- Contrast failure offers both escape hatches"
description: "This scenario validates Contrast failure offers both escape hatches for `SKD-021`. It focuses on confirm a brand color that cannot reach its ratio produces two options and an escalation, not a silent recolor."
stage: routing
id: "SKD-021"
version: 1.0.0.0
---

# SKD-021 -- Contrast failure offers both escape hatches

This document captures the realistic user-testing contract, expected behavior, execution flow, source anchors, and metadata for `SKD-021`.

---

## 1. OVERVIEW

This scenario validates Contrast failure offers both escape hatches for `SKD-021`. It focuses on confirm a brand color that cannot reach its ratio produces two options and an escalation, not a silent recolor.

### Why This Matters

Silently changing a brand color is a decision the operator owns. Both escape hatches keep the color and reach the ratio, so offering them is what makes the escalation honest.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SKD-021` and confirm the expected signals without contradictory evidence.

- Objective: confirm a brand color that cannot reach its ratio produces two options and an escalation, not a silent recolor.
- Real user request: `Our brand green fails contrast on white, what do we do?`
- Prompt: `Our brand green fails contrast on white`
- Expected execution process: Offer the flip-the-contrast and hue-rotation hatches, then escalate the brand change as an operator decision.
- Expected signals: Both hatches are named, and the brand change is escalated rather than applied.
- Desired user-visible outcome: A concise PASS or FAIL verdict, or SKIP naming the specific sandbox blocker that prevented execution.
- Pass/fail: PASS if both escape hatches are named and the brand change is escalated to the operator; FAIL if only one hatch is offered, or the reply changes the brand color without escalating.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the repository is at its checked-out state and no uncommitted edit to the skill is in flight.
3. Execute the command sequence exactly as written.
4. Capture the expected signals and evidence artifacts.
5. Return a concise user-facing verdict with failure triage if needed.

### Exact Command Sequence

1. `bash: python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "our brand green fails contrast on white" --threshold 0.5`
2. `agent: issue the same prompt in a fresh session`
3. `bash: rg -n "Escape hatch" .opencode/skills/sk-design/references/color-system.md`

### Expected Signals

Both hatches are named, and the brand change is escalated rather than applied.

### Evidence

Advisor JSON, the agent reply listing both hatches, and the grep proving both are documented.

### Pass / Fail Criteria

- **Pass**: both escape hatches are named and the brand change is escalated to the operator.
- **Fail**: only one hatch is offered, or the reply changes the brand color without escalating.

### Failure Triage

Read `color-system.md` Section 6; a reply that only raises lightness has not read the hue-rotation hatch.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKD-021 | Contrast failure offers both escape hatches | confirm a brand color that cannot reach its ratio produces two options and an escalation, not a silent recolor | `Our brand green fails contrast on white` | 1. `bash: python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "our brand green fails contrast on white" --threshold 0.5` -> 2. `agent: issue the same prompt in a fresh session` -> 3. `bash: rg -n "Escape hatch" .opencode/skills/sk-design/references/color-system.md` | Both hatches are named, and the brand change is escalated rather than applied. | Advisor JSON, the agent reply listing both hatches, and the grep proving both are documented. | PASS if both escape hatches are named and the brand change is escalated to the operator; FAIL if only one hatch is offered, or the reply changes the brand color without escalating | Read `color-system.md` Section 6; a reply that only raises lightness has not read the hue-rotation hatch. |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| [contrast-escape-hatches.md](contrast-escape-hatches.md) | Canonical per-feature execution contract |

### Implementation Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) | Value scales, hierarchy core, router and hard rules |
| [references/color-system.md](../../references/color-system.md) | Reference this scenario exercises |

No feature catalog exists for this skill, so no catalog cross-reference applies.

---

## 5. SOURCE METADATA

- Group: conflict-handling
- Playbook ID: SKD-021
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `conflict-handling/contrast-escape-hatches.md`
