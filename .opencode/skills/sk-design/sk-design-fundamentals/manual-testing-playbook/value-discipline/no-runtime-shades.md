---
title: "SKD-011 -- Runtime shade generation is refused"
description: "This scenario validates Runtime shade generation is refused for `SKD-011`. It focuses on confirm a request for a derived hover shade is answered from a defined ramp instead of a runtime function."
stage: routing
id: "SKD-011"
version: 1.0.0.0
---

# SKD-011 -- Runtime shade generation is refused

This document captures the realistic user-testing contract, expected behavior, execution flow, source anchors, and metadata for `SKD-011`.

---

## 1. OVERVIEW

This scenario validates Runtime shade generation is refused for `SKD-011`. It focuses on confirm a request for a derived hover shade is answered from a defined ramp instead of a runtime function.

### Why This Matters

Runtime lighten and darken calls are how a project ends up with dozens of near-identical blues and no palette at all.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SKD-011` and confirm the expected signals without contradictory evidence.

- Objective: confirm a request for a derived hover shade is answered from a defined ramp instead of a runtime function.
- Real user request: `I need a slightly darker blue for the hover state, can you just darken it 10%?`
- Prompt: `I need a slightly darker blue for the hover state`
- Expected execution process: Refuse the runtime derivation, name an existing ramp step, and state why shades are defined up front.
- Expected signals: The reply names a numbered ramp step and explicitly declines to generate the shade at runtime.
- Desired user-visible outcome: A concise PASS or FAIL verdict, or SKIP naming the specific sandbox blocker that prevented execution.
- Pass/fail: PASS if the reply names an existing ramp step and declines runtime generation; FAIL if the reply proposes a lighten or darken call, or invents a hex outside the ramp.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the repository is at its checked-out state and no uncommitted edit to the skill is in flight.
3. Execute the command sequence exactly as written.
4. Capture the expected signals and evidence artifacts.
5. Return a concise user-facing verdict with failure triage if needed.

### Exact Command Sequence

1. `bash: python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "I need a slightly darker blue for the hover state" --threshold 0.5`
2. `agent: issue the same prompt in a fresh session`
3. `bash: rg -n "NEVER generate shades at runtime" .opencode/skills/sk-design/SKILL.md`

### Expected Signals

The reply names a numbered ramp step and explicitly declines to generate the shade at runtime.

### Evidence

The agent reply, and the grep proving the rule is stated as a hard rule rather than a preference.

### Pass / Fail Criteria

- **Pass**: the reply names an existing ramp step and declines runtime generation.
- **Fail**: the reply proposes a lighten or darken call, or invents a hex outside the ramp.

### Failure Triage

Check that the hard rules in `SKILL.md` Section 4 were loaded; the rule is in the NEVER list, not the scales.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKD-011 | Runtime shade generation is refused | confirm a request for a derived hover shade is answered from a defined ramp instead of a runtime function | `I need a slightly darker blue for the hover state` | 1. `bash: python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "I need a slightly darker blue for the hover state" --threshold 0.5` -> 2. `agent: issue the same prompt in a fresh session` -> 3. `bash: rg -n "NEVER generate shades at runtime" .opencode/skills/sk-design/SKILL.md` | The reply names a numbered ramp step and explicitly declines to generate the shade at runtime. | The agent reply, and the grep proving the rule is stated as a hard rule rather than a preference. | PASS if the reply names an existing ramp step and declines runtime generation; FAIL if the reply proposes a lighten or darken call, or invents a hex outside the ramp | Check that the hard rules in `SKILL.md` Section 4 were loaded; the rule is in the NEVER list, not the scales. |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| [no-runtime-shades.md](no-runtime-shades.md) | Canonical per-feature execution contract |

### Implementation Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) | Value scales, hierarchy core, router and hard rules |
| [references/color-system.md](../../references/color-system.md) | Reference this scenario exercises |

No feature catalog exists for this skill, so no catalog cross-reference applies.

---

## 5. SOURCE METADATA

- Group: value-discipline
- Playbook ID: SKD-011
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `value-discipline/no-runtime-shades.md`
