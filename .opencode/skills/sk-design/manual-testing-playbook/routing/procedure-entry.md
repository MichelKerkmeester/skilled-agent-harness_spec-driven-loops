---
title: "SKD-004 -- Build procedure entry from nothing"
description: "This scenario validates Build procedure entry from nothing for `SKD-004`. It focuses on confirm a from-scratch design request starts from a feature and defers color."
stage: routing
id: "SKD-004"
version: 1.0.0.0
---

# SKD-004 -- Build procedure entry from nothing

This document captures the realistic user-testing contract, expected behavior, execution flow, source anchors, and metadata for `SKD-004`.

---

## 1. OVERVIEW

This scenario validates Build procedure entry from nothing for `SKD-004`. It focuses on confirm a from-scratch design request starts from a feature and defers color.

### Why This Matters

Designing the shell before the features produces a shell the features must then fit into. The procedure exists to stop that, and it only helps if it loads before any layout is proposed.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SKD-004` and confirm the expected signals without contradictory evidence.

- Objective: confirm a from-scratch design request starts from a feature and defers color.
- Real user request: `I need to design a new settings screen, where do I start?`
- Prompt: `Where do I start designing this screen`
- Expected execution process: Load the build procedure, start from one real piece of functionality, work in grayscale, and defer the shell.
- Expected signals: The answer starts from a feature rather than a layout, names grayscale-first, and does not propose a nav pattern.
- Desired user-visible outcome: A concise PASS or FAIL verdict, or SKIP naming the specific sandbox blocker that prevented execution.
- Pass/fail: PASS if the reply begins from a feature, names grayscale-first, and proposes no top-nav or sidebar decision; FAIL if the reply opens with a layout or navigation choice, or proposes a color palette before the layout works.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the repository is at its checked-out state and no uncommitted edit to the skill is in flight.
3. Execute the command sequence exactly as written.
4. Capture the expected signals and evidence artifacts.
5. Return a concise user-facing verdict with failure triage if needed.

### Exact Command Sequence

1. `bash: python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "where do I start designing this screen" --threshold 0.5`
2. `agent: issue the same prompt in a fresh session`
3. `bash: rg -n "Start with a feature, not a layout" .opencode/skills/sk-design/references/build-procedure.md`

### Expected Signals

The answer starts from a feature rather than a layout, names grayscale-first, and does not propose a nav pattern.

### Evidence

Advisor JSON, the agent reply, and the grep proving step one is the documented one.

### Pass / Fail Criteria

- **Pass**: the reply begins from a feature, names grayscale-first, and proposes no top-nav or sidebar decision.
- **Fail**: the reply opens with a layout or navigation choice, or proposes a color palette before the layout works.

### Failure Triage

If a layout was proposed first, confirm `build-procedure.md` loaded at all; the PROCEDURE intent keywords are in `SKILL.md` Section 2.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SKD-004 | Build procedure entry from nothing | confirm a from-scratch design request starts from a feature and defers color | `Where do I start designing this screen` | 1. `bash: python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "where do I start designing this screen" --threshold 0.5` -> 2. `agent: issue the same prompt in a fresh session` -> 3. `bash: rg -n "Start with a feature, not a layout" .opencode/skills/sk-design/references/build-procedure.md` | The answer starts from a feature rather than a layout, names grayscale-first, and does not propose a nav pattern. | Advisor JSON, the agent reply, and the grep proving step one is the documented one. | PASS if the reply begins from a feature, names grayscale-first, and proposes no top-nav or sidebar decision; FAIL if the reply opens with a layout or navigation choice, or proposes a color palette before the layout works | If a layout was proposed first, confirm `build-procedure.md` loaded at all; the PROCEDURE intent keywords are in `SKILL.md` Section 2. |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| [procedure-entry.md](procedure-entry.md) | Canonical per-feature execution contract |

### Implementation Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) | Value scales, hierarchy core, router and hard rules |
| [references/build-procedure.md](../../references/build-procedure.md) | Reference this scenario exercises |

No feature catalog exists for this skill, so no catalog cross-reference applies.

---

## 5. SOURCE METADATA

- Group: routing
- Playbook ID: SKD-004
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `routing/procedure-entry.md`
