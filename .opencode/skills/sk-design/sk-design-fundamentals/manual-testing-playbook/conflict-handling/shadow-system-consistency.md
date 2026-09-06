---
title: "SKD-022 -- One shadow system per project"
description: "This scenario validates One shadow system per project for `SKD-022`. It focuses on confirm a shadow request names which of the three systems the project is on before giving values."
stage: routing
id: "SKD-022"
version: 1.0.0.0
---

# SKD-022 -- One shadow system per project

This document captures the realistic user-testing contract, expected behavior, execution flow, source anchors, and metadata for `SKD-022`.

---

## 1. OVERVIEW

This scenario validates One shadow system per project for `SKD-022`. It focuses on confirm a shadow request names which of the three systems the project is on before giving values.

### Why This Matters

The three shadow systems are parallel and use different alphas. Mixing them makes elevation unreadable, and the alphas are not portable between them.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SKD-022` and confirm the expected signals without contradictory evidence.

- Objective: confirm a shadow request names which of the three systems the project is on before giving values.
- Real user request: `Add a drop shadow to this card.`
- Prompt: `Add a drop shadow to this card`
- Expected execution process: Identify which shadow system the project already uses, then give a value from that system only.
- Expected signals: The reply names a system, gives a value from it, and warns against mixing systems.
- Desired user-visible outcome: A concise PASS or FAIL verdict, or SKIP naming the specific sandbox blocker that prevented execution.
- Pass/fail: PASS if the reply names a shadow system, gives a value from that system, and does not mix alphas between systems; FAIL if the reply gives a shadow with no system named, or combines a single-shadow alpha with a layered stack.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the repository is at its checked-out state and no uncommitted edit to the skill is in flight.
3. Execute the command sequence exactly as written.
4. Capture the expected signals and evidence artifacts.
5. Return a concise user-facing verdict with failure triage if needed.

### Exact Command Sequence

1. `bash: python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "add a drop shadow to this card" --threshold 0.5`
2. `agent: issue the same prompt in a fresh session`
3. `bash: rg -n "Three parallel systems, pick one" .opencode/skills/sk-design/references/depth-and-detail.md`

### Expected Signals

The reply names a system, gives a value from it, and warns against mixing systems.

### Evidence

Advisor JSON, the agent reply, and the grep proving the three-system rule is documented.

### Pass / Fail Criteria

- **Pass**: the reply names a shadow system, gives a value from that system, and does not mix alphas between systems.
- **Fail**: the reply gives a shadow with no system named, or combines a single-shadow alpha with a layered stack.

### Failure Triage

Compare the returned alpha against the system it claims; roughly .2 belongs to a single shadow and .03 to .06 to a layered stack.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKD-022 | One shadow system per project | confirm a shadow request names which of the three systems the project is on before giving values | `Add a drop shadow to this card` | 1. `bash: python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "add a drop shadow to this card" --threshold 0.5` -> 2. `agent: issue the same prompt in a fresh session` -> 3. `bash: rg -n "Three parallel systems, pick one" .opencode/skills/sk-design/references/depth-and-detail.md` | The reply names a system, gives a value from it, and warns against mixing systems. | Advisor JSON, the agent reply, and the grep proving the three-system rule is documented. | PASS if the reply names a shadow system, gives a value from that system, and does not mix alphas between systems; FAIL if the reply gives a shadow with no system named, or combines a single-shadow alpha with a layered stack | Compare the returned alpha against the system it claims; roughly .2 belongs to a single shadow and .03 to .06 to a layered stack. |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| [shadow-system-consistency.md](shadow-system-consistency.md) | Canonical per-feature execution contract |

### Implementation Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) | Value scales, hierarchy core, router and hard rules |
| [references/depth-and-detail.md](../../references/depth-and-detail.md) | Reference this scenario exercises |

No feature catalog exists for this skill, so no catalog cross-reference applies.

---

## 5. SOURCE METADATA

- Group: conflict-handling
- Playbook ID: SKD-022
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `conflict-handling/shadow-system-consistency.md`
