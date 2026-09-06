---
title: "SKD-012 -- Type scale unit discipline"
description: "This scenario validates Type scale unit discipline for `SKD-012`. It focuses on confirm an em-based type size is flagged and converted, without breaking the measure exception."
stage: routing
id: "SKD-012"
version: 1.0.0.0
---

# SKD-012 -- Type scale unit discipline

This document captures the realistic user-testing contract, expected behavior, execution flow, source anchors, and metadata for `SKD-012`.

---

## 1. OVERVIEW

This scenario validates Type scale unit discipline for `SKD-012`. It focuses on confirm an em-based type size is flagged and converted, without breaking the measure exception.

### Why This Matters

`em` compounds through nesting, so a scale expressed in `em` silently stops existing. The exception for line length is real and must survive the correction.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SKD-012` and confirm the expected signals without contradictory evidence.

- Objective: confirm an em-based type size is flagged and converted, without breaking the measure exception.
- Real user request: `Set the headline to 2.5em`
- Prompt: `Set the headline to 2.5em`
- Expected execution process: Flag `em` for the type scale, offer a px or rem value from the scale, and leave measure in em untouched.
- Expected signals: The reply names the `em` rule, offers a scale value in px or rem, and does not convert `max-width` measure.
- Desired user-visible outcome: A concise PASS or FAIL verdict, or SKIP naming the specific sandbox blocker that prevented execution.
- Pass/fail: PASS if the reply rejects `em` for the type scale, offers a value from the scale, and preserves the measure exception if measure is mentioned; FAIL if the reply accepts `2.5em`, or converts the line-length `max-width` away from `em`.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the repository is at its checked-out state and no uncommitted edit to the skill is in flight.
3. Execute the command sequence exactly as written.
4. Capture the expected signals and evidence artifacts.
5. Return a concise user-facing verdict with failure triage if needed.

### Exact Command Sequence

1. `bash: python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "set the headline to 2.5em" --threshold 0.5`
2. `agent: issue the same prompt in a fresh session`
3. `bash: rg -n "em. is correct .here" .opencode/skills/sk-design/SKILL.md`

### Expected Signals

The reply names the `em` rule, offers a scale value in px or rem, and does not convert `max-width` measure.

### Evidence

The agent reply, and the grep proving the measure exception is documented alongside the rule.

### Pass / Fail Criteria

- **Pass**: the reply rejects `em` for the type scale, offers a value from the scale, and preserves the measure exception if measure is mentioned.
- **Fail**: the reply accepts `2.5em`, or converts the line-length `max-width` away from `em`.

### Failure Triage

Read the line-height and line length subsection in `SKILL.md` Section 3; over-correcting the measure means the exception was skipped.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKD-012 | Type scale unit discipline | confirm an em-based type size is flagged and converted, without breaking the measure exception | `Set the headline to 2.5em` | 1. `bash: python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "set the headline to 2.5em" --threshold 0.5` -> 2. `agent: issue the same prompt in a fresh session` -> 3. `bash: rg -n "em. is correct .here" .opencode/skills/sk-design/SKILL.md` | The reply names the `em` rule, offers a scale value in px or rem, and does not convert `max-width` measure. | The agent reply, and the grep proving the measure exception is documented alongside the rule. | PASS if the reply rejects `em` for the type scale, offers a value from the scale, and preserves the measure exception if measure is mentioned; FAIL if the reply accepts `2.5em`, or converts the line-length `max-width` away from `em` | Read the line-height and line length subsection in `SKILL.md` Section 3; over-correcting the measure means the exception was skipped. |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| [unit-discipline.md](unit-discipline.md) | Canonical per-feature execution contract |

### Implementation Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) | Value scales, hierarchy core, router and hard rules |
| [references/depth-and-detail.md](../../references/depth-and-detail.md) | Reference this scenario exercises |

No feature catalog exists for this skill, so no catalog cross-reference applies.

---

## 5. SOURCE METADATA

- Group: value-discipline
- Playbook ID: SKD-012
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `value-discipline/unit-discipline.md`
