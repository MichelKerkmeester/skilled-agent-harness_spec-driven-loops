---
title: "SKD-010 -- Every value comes from a scale"
description: "This scenario validates Every value comes from a scale for `SKD-010`. It focuses on confirm a spatial or type value is returned from the fixed scale with the scale named."
stage: routing
id: "SKD-010"
version: 1.0.0.0
---

# SKD-010 -- Every value comes from a scale

This document captures the realistic user-testing contract, expected behavior, execution flow, source anchors, and metadata for `SKD-010`.

---

## 1. OVERVIEW

This scenario validates Every value comes from a scale for `SKD-010`. It focuses on confirm a spatial or type value is returned from the fixed scale with the scale named.

### Why This Matters

A value off the scale is the single defect this skill exists to prevent. It is what makes an interface read as amateur even when nothing is individually wrong.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SKD-010` and confirm the expected signals without contradictory evidence.

- Objective: confirm a spatial or type value is returned from the fixed scale with the scale named.
- Real user request: `How much padding should this card have?`
- Prompt: `What padding should this card have`
- Expected execution process: Answer from the spacing scale, name the step, and give the reason the step was chosen over its neighbours.
- Expected signals: The returned value appears verbatim in the spacing scale, and the reply names the scale.
- Desired user-visible outcome: A concise PASS or FAIL verdict, or SKIP naming the specific sandbox blocker that prevented execution.
- Pass/fail: PASS if the returned value appears in the grep output and the reply names the scale it came from; FAIL if the value is absent from the scale, or is returned with no scale named.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the repository is at its checked-out state and no uncommitted edit to the skill is in flight.
3. Execute the command sequence exactly as written.
4. Capture the expected signals and evidence artifacts.
5. Return a concise user-facing verdict with failure triage if needed.

### Exact Command Sequence

1. `bash: python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "what padding should this card have" --threshold 0.5`
2. `agent: issue the same prompt in a fresh session and record the returned value`
3. `bash: rg -n "^4  8  12  16  24  32  48" .opencode/skills/sk-design/SKILL.md`

### Expected Signals

The returned value appears verbatim in the spacing scale, and the reply names the scale.

### Evidence

Advisor JSON, the returned value, and the grep output showing the scale the value must belong to.

### Pass / Fail Criteria

- **Pass**: the returned value appears in the grep output and the reply names the scale it came from.
- **Fail**: the value is absent from the scale, or is returned with no scale named.

### Failure Triage

Compare the returned value against the grep output directly; a near-miss such as 20px or 40px means the scale was paraphrased rather than read.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKD-010 | Every value comes from a scale | confirm a spatial or type value is returned from the fixed scale with the scale named | `What padding should this card have` | 1. `bash: python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "what padding should this card have" --threshold 0.5` -> 2. `agent: issue the same prompt in a fresh session and record the returned value` -> 3. `bash: rg -n "^4  8  12  16  24  32  48" .opencode/skills/sk-design/SKILL.md` | The returned value appears verbatim in the spacing scale, and the reply names the scale. | Advisor JSON, the returned value, and the grep output showing the scale the value must belong to. | PASS if the returned value appears in the grep output and the reply names the scale it came from; FAIL if the value is absent from the scale, or is returned with no scale named | Compare the returned value against the grep output directly; a near-miss such as 20px or 40px means the scale was paraphrased rather than read. |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| [on-scale-values.md](on-scale-values.md) | Canonical per-feature execution contract |

### Implementation Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) | Value scales, hierarchy core, router and hard rules |
| [references/hierarchy.md](../../references/hierarchy.md) | Reference this scenario exercises |

No feature catalog exists for this skill, so no catalog cross-reference applies.

---

## 5. SOURCE METADATA

- Group: value-discipline
- Playbook ID: SKD-010
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `value-discipline/on-scale-values.md`
