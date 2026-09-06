---
title: "SKD-003 -- Motion band selection"
description: "This scenario validates Motion band selection for `SKD-003`. It focuses on confirm a duration question is answered from the motion bands with the consistency rule attached."
stage: routing
id: "SKD-003"
version: 1.0.0.0
---

# SKD-003 -- Motion band selection

This document captures the realistic user-testing contract, expected behavior, execution flow, source anchors, and metadata for `SKD-003`.

---

## 1. OVERVIEW

This scenario validates Motion band selection for `SKD-003`. It focuses on confirm a duration question is answered from the motion bands with the consistency rule attached.

### Why This Matters

Durations picked by feel produce 400ms buttons and inconsistent timing across similar elements. The bands exist so a duration is a scale choice, not a guess.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SKD-003` and confirm the expected signals without contradictory evidence.

- Objective: confirm a duration question is answered from the motion bands with the consistency rule attached.
- Real user request: `How long should this dropdown animation be?`
- Prompt: `What animation duration should this dropdown use`
- Expected execution process: Classify the motion as a state change rather than direct feedback or a layout transition, then read the band.
- Expected signals: The answer sits in the 180-260ms state-change band and states that similar elements must share the value.
- Desired user-visible outcome: A concise PASS or FAIL verdict, or SKIP naming the specific sandbox blocker that prevented execution.
- Pass/fail: PASS if the returned duration falls in 180-260ms, is named as a state change, and the reply states the consistency rule; FAIL if the duration falls outside the band, no band is named, or the reply omits the consistency rule.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the repository is at its checked-out state and no uncommitted edit to the skill is in flight.
3. Execute the command sequence exactly as written.
4. Capture the expected signals and evidence artifacts.
5. Return a concise user-facing verdict with failure triage if needed.

### Exact Command Sequence

1. `bash: python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "what animation duration should this dropdown use" --threshold 0.5`
2. `agent: issue the same prompt in a fresh session`
3. `bash: rg -n "180 to 260ms" .opencode/skills/sk-design/references/motion-principles.md`

### Expected Signals

The answer sits in the 180-260ms state-change band and states that similar elements must share the value.

### Evidence

Advisor JSON, the returned duration with its band name, and the grep confirming the band is the documented one.

### Pass / Fail Criteria

- **Pass**: the returned duration falls in 180-260ms, is named as a state change, and the reply states the consistency rule.
- **Fail**: the duration falls outside the band, no band is named, or the reply omits the consistency rule.

### Failure Triage

Check `motion-principles.md` Section 5 for the three-way split; a reply citing a single 200ms or 300ms ceiling means the reconciliation was not read.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKD-003 | Motion band selection | confirm a duration question is answered from the motion bands with the consistency rule attached | `What animation duration should this dropdown use` | 1. `bash: python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "what animation duration should this dropdown use" --threshold 0.5` -> 2. `agent: issue the same prompt in a fresh session` -> 3. `bash: rg -n "180 to 260ms" .opencode/skills/sk-design/references/motion-principles.md` | The answer sits in the 180-260ms state-change band and states that similar elements must share the value. | Advisor JSON, the returned duration with its band name, and the grep confirming the band is the documented one. | PASS if the returned duration falls in 180-260ms, is named as a state change, and the reply states the consistency rule; FAIL if the duration falls outside the band, no band is named, or the reply omits the consistency rule | Check `motion-principles.md` Section 5 for the three-way split; a reply citing a single 200ms or 300ms ceiling means the reconciliation was not read. |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| [motion-entry.md](motion-entry.md) | Canonical per-feature execution contract |

### Implementation Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) | Value scales, hierarchy core, router and hard rules |
| [references/motion-principles.md](../../references/motion-principles.md) | Reference this scenario exercises |

No feature catalog exists for this skill, so no catalog cross-reference applies.

---

## 5. SOURCE METADATA

- Group: routing
- Playbook ID: SKD-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `routing/motion-entry.md`
