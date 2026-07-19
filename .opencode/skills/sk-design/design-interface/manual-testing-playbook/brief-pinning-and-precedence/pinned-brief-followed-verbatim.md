---
title: "ID-002 -- Pinned brief is followed verbatim"
description: "This scenario validates Pinned brief is followed verbatim for `ID-002`. It focuses on confirming the skill follows a brief that pins the direction and never overrides it, even when the brief asks for an AI-default look."
version: 1.5.0.3
id: ID-002
expected_intent: DESIGN_PRINCIPLES
expected_resources:
  - references/design-process/design-principles.md
  - ../shared/register.md
  - references/design-process/ux-quality-reference.md
---

# ID-002 -- Pinned brief is followed verbatim

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ID-002`.

**Exact prompt**

```
Build the hero using exactly this direction: cream #F4F1EA background, a high-contrast serif display, and a terracotta accent. Do not change the palette.
```

---

## 1. OVERVIEW

This scenario validates Pinned brief is followed verbatim for `ID-002`. It focuses on confirming the skill follows a brief that pins the direction and never overrides it, even when the brief asks for an AI-default look.

### Why This Matters

ID-002 is the precedence guard that keeps the deviation guidance from becoming a liability. The skill's instinct to avoid default looks must never override a brief that explicitly pins one. If the skill substitutes its own palette when the user pinned cream-serif-terracotta, it stops being useful and starts fighting the user. This pairs with ID-001: the skill must know when to deviate and when to obey.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ID-002` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the skill follows a pinned brief verbatim and does not apply deviation guidance to the pinned axes, even when the brief asks for an AI-default look.
- Real user request: `Use exactly the cream, serif, and terracotta direction I already chose for the hero.`
- Prompt: `Build the hero using exactly this direction: cream #F4F1EA background, a high-contrast serif display, and a terracotta accent. Do not change the palette.`
- Expected execution process: Detect that the brief pins the direction, skip default-avoidance on the pinned axes per `SKILL.md` Section 2 routing, and produce a plan that uses the pinned palette and type verbatim.
- Expected signals: Step 1: brief detected as direction-pinned; Step 2: plan uses cream #F4F1EA, serif display, and terracotta accent unchanged; Step 3: no deviation argument is applied to the pinned axes
- Desired user-visible outcome: a design plan that follows the pinned cream-serif-terracotta direction verbatim, with no substitution and no deviation argument applied to the pinned axes.
- Pass/fail: PASS if the plan keeps the pinned palette and type verbatim per `SKILL.md` NEVER rule 4; FAIL if the skill substitutes a different palette or argues the user out of the pinned direction

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain design-scope language.
2. Confirm the brief pins the visual direction before deciding whether to apply deviation guidance.
3. Execute the deterministic steps exactly as written.
4. Compare the produced plan against the cited `interface` reference files.
5. Return a concise final verdict that names any unauthorized substitution when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ID-002 | Pinned brief is followed verbatim | Confirm the skill follows a pinned brief verbatim and does not apply deviation guidance to the pinned axes, even when the brief asks for an AI-default look. | `Build the hero using exactly this direction: cream #F4F1EA background, a high-contrast serif display, and a terracotta accent. Do not change the palette.` | bash: rg -n "brief's own words always win" references/design-process/design-principles.md -> agent: produce the plan following the pinned direction -> bash: rg -n "NEVER override a brief that pins" SKILL.md | Step 1: brief detected as direction-pinned; Step 2: plan uses cream #F4F1EA, serif display, and terracotta accent unchanged; Step 3: no deviation argument is applied to the pinned axes | Terminal transcript, the design plan text, and confirmation the pinned palette was kept | PASS if the plan keeps the pinned palette and type verbatim per SKILL.md NEVER rule 4; FAIL if the skill substitutes a different palette or argues the user out of the pinned direction | 1. Re-read SKILL.md Section 2 direction-pinned routing; 2. Confirm references/design-process/design-principles.md "brief's own words always win" was loaded; 3. Re-detect the pinned axes and rerun without deviation |

### Optional Supplemental Checks

If the primary run passes, repeat with a brief that pins only one axis (for example only the palette) and confirm the skill obeys the pinned axis while still applying deviation guidance to the remaining free axes. Keep supplemental evidence separate from the primary verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../README.md` | Skill overview and current operator-facing description |

### Implementation Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Section 2 direction-pinned routing and the NEVER-override-a-pinned-brief rule |
| `../../references/design-process/design-principles.md` | The calibration note that the brief's own words always win |

---

## 5. SOURCE METADATA

- Group: Brief Pinning And Precedence
- Playbook ID: ID-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `brief-pinning-and-precedence/pinned-brief-followed-verbatim.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
