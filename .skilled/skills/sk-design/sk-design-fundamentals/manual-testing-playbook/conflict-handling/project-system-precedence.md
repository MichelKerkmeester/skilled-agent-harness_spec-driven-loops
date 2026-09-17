---
title: "SKD-020 -- An established project system wins"
description: "This scenario validates An established project system wins for `SKD-020`. It focuses on confirm the skill defers to a project's own tokens rather than arguing for its defaults."
stage: routing
id: "SKD-020"
version: 1.0.0.0
---

# SKD-020 -- An established project system wins

This document captures the realistic user-testing contract, expected behavior, execution flow, source anchors, and metadata for `SKD-020`.

---

## 1. OVERVIEW

This scenario validates An established project system wins for `SKD-020`. It focuses on confirm the skill defers to a project's own tokens rather than arguing for its defaults.

### Why This Matters

These scales are for what nobody has decided yet. A project that already decided outranks them, and a skill that argues with an established system is worse than no skill.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SKD-020` and confirm the expected signals without contradictory evidence.

- Objective: confirm the skill defers to a project's own tokens rather than arguing for its defaults.
- Real user request: `Our design system says 24px spacing here, but you suggested 32px.`
- Prompt: `Our design system says 24px spacing, but you suggested 32px`
- Expected execution process: Accept the project value, restate the precedence rule, and stop advocating for the default.
- Expected signals: The reply adopts 24px without argument and states that an established system outranks the defaults.
- Desired user-visible outcome: A concise PASS or FAIL verdict, or SKIP naming the specific sandbox blocker that prevented execution.
- Pass/fail: PASS if the reply adopts the project value and names the precedence rule; FAIL if the reply defends 32px, asks the operator to change the design system, or adopts the value without acknowledging the rule.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the repository is at its checked-out state and no uncommitted edit to the skill is in flight.
3. Execute the command sequence exactly as written.
4. Capture the expected signals and evidence artifacts.
5. Return a concise user-facing verdict with failure triage if needed.

### Exact Command Sequence

1. `agent: issue the prompt in a session that already received a 32px suggestion`
2. `bash: rg -n "design system, or a measured .DESIGN.md. Style Reference" .opencode/skills/sk-design/SKILL.md`

### Expected Signals

The reply adopts 24px without argument and states that an established system outranks the defaults.

### Evidence

The agent reply, and the grep proving the precedence rule is written into the skill rather than inferred.

### Pass / Fail Criteria

- **Pass**: the reply adopts the project value and names the precedence rule.
- **Fail**: the reply defends 32px, asks the operator to change the design system, or adopts the value without acknowledging the rule.

### Failure Triage

Check the ESCALATE list in `SKILL.md` Section 4; deference to an established system is the first escalation, not a negotiation.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKD-020 | An established project system wins | confirm the skill defers to a project's own tokens rather than arguing for its defaults | `Our design system says 24px spacing, but you suggested 32px` | 1. `agent: issue the prompt in a session that already received a 32px suggestion` -> 2. `bash: rg -n "design system, or a measured .DESIGN.md. Style Reference" .opencode/skills/sk-design/SKILL.md` | The reply adopts 24px without argument and states that an established system outranks the defaults. | The agent reply, and the grep proving the precedence rule is written into the skill rather than inferred. | PASS if the reply adopts the project value and names the precedence rule; FAIL if the reply defends 32px, asks the operator to change the design system, or adopts the value without acknowledging the rule | Check the ESCALATE list in `SKILL.md` Section 4; deference to an established system is the first escalation, not a negotiation. |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| [project-system-precedence.md](project-system-precedence.md) | Canonical per-feature execution contract |

### Implementation Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) | Value scales, hierarchy core, router and hard rules |
| [assets/token-starter-set.md](../../assets/token-starter-set.md) | Reference this scenario exercises |

No feature catalog exists for this skill, so no catalog cross-reference applies.

---

## 5. SOURCE METADATA

- Group: conflict-handling
- Playbook ID: SKD-020
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `conflict-handling/project-system-precedence.md`
