---
title: "ID-011 -- Mechanical pre-flight card on a built UI"
description: "This scenario validates the Interface Pre-Flight Card for `ID-011`. It focuses on confirming a built or planned interface is walked box by box against the binary fill-in card in interface_preflight_card.md, that the verdict is SHIP only when every box passes, and that the register and dials set the context without relaxing any mechanical box."
contextType: reference
version: 1.0.0.0
---

# ID-011 -- Mechanical pre-flight card on a built UI

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ID-011`.

---

## 1. OVERVIEW

This scenario validates the Interface Pre-Flight Card for `ID-011`. It focuses on confirming a built or planned interface is walked box by box against the binary fill-in card in `assets/interface_preflight_card.md`, that a single failing box blocks SHIP, and that the register and dials set the context without relaxing any mechanical box.

### Why This Matters

ID-011 is the last filter before delivery, the checkable form of the layout gate, the content gate, and the dial calibration combined into one binary card. The card exists because a surface can read well to a glance and still ship a four-line hero, a button that hides its own label, or an em-dash the user can see. Every box is binary, so the value is lost the moment a box is estimated rather than checked against the real render at the real breakpoints. The card must also resist the temptation to let a loud register or a high dial value wave a mechanical failure through. A Brand hero may still not overflow and a high-motion page may still not skip reduced motion, so the context section sets posture and dials while the mechanical boxes hold for both.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ID-011` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a built or planned UI is walked box by box against `assets/interface_preflight_card.md`, the context section records the surface, register, dials, and section count, every failing box is listed by number, and the verdict is SHIP only when every box passes.
- Real user request: `Run the pre-flight checklist over this page and tell me whether it is ready to ship.`
- Prompt: `Run the interface pre-flight card over this built page and give me a SHIP or FIX verdict with the failing box numbers.`
- Expected execution process: Supply a real built or planned UI as the fixture so the card has a concrete render to grade. Load `assets/interface_preflight_card.md`, fill the context table (surface, register from `../shared/register.md`, the VARIANCE, MOTION, and DENSITY dials, section count, narrowest width tested), then walk Sections 2 through 10 box by box against the real render at the real breakpoints. Record the verdict as SHIP only when every box passes, otherwise FIX with the failing box numbers listed.
- Expected signals: Step 1: the context table is filled with the surface, register, dials, section count, and narrowest width; Step 2: every box in Sections 2 through 10 is marked pass or fail against the real render, not estimated; Step 3: the verdict is SHIP only when all boxes pass, otherwise FIX with the failing box numbers
- Desired user-visible outcome: a filled pre-flight card with a binary mark on every box, the context recorded, the failing box numbers listed, and a SHIP verdict reached only when no box fails.
- Pass/fail: PASS if the card fills the context, marks every box binary against the real render, and returns SHIP only with zero failing boxes per `assets/interface_preflight_card.md`; FAIL if any box is estimated rather than checked, a register or dial value is used to excuse a failing box, or a SHIP verdict is given with an unchecked or failing box

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain pre-flight-gate language.
2. Confirm a real built or planned render is available so each box can be checked, not estimated.
3. Execute the deterministic steps exactly as written, filling the context table first.
4. Compare the produced card against the boxes in `assets/interface_preflight_card.md`, confirming the verdict logic.
5. Return a concise final verdict that names any estimated box or any register-excused failure when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ID-011 | Mechanical pre-flight card on a built UI | Confirm a built or planned UI is walked box by box against assets/interface_preflight_card.md, the context section records the surface, register, dials, and section count, every failing box is listed by number, and the verdict is SHIP only when every box passes. | `Run the interface pre-flight card over this built page and give me a SHIP or FIX verdict with the failing box numbers.` | bash: rg -n "Every box is binary" assets/interface_preflight_card.md -> agent: fill the context table then walk Sections 2 through 10 box by box against the real render -> bash: rg -n "interface_preflight_card" SKILL.md | Step 1: the context table is filled with the surface, register, dials, section count, and narrowest width; Step 2: every box in Sections 2 through 10 is marked pass or fail against the real render, not estimated; Step 3: the verdict is SHIP only when all boxes pass, otherwise FIX with the failing box numbers | Terminal transcript, the filled pre-flight card, and the SHIP or FIX verdict with any failing box numbers | PASS if the card fills the context, marks every box binary against the real render, and returns SHIP only with zero failing boxes per assets/interface_preflight_card.md; FAIL if any box is estimated, a register or dial value excuses a failing box, or a SHIP verdict is given with an unchecked or failing box | 1. Re-read assets/interface_preflight_card.md Sections 1 through 11; 2. Confirm SKILL.md Section 2 loaded the card as the final mechanical pass; 3. Re-walk every box against the real render at the real breakpoints and recompute the verdict |

### Optional Supplemental Checks

If the primary run passes, repeat with a surface set to a loud register (Brand) and a high MOTION dial and confirm the mechanical boxes still hold, with no box waved through on posture or dial strength. Confirm the AI-tell sweep in Section 10 catches any visible em-dash or en-dash-as-separator. Keep supplemental evidence separate from the primary verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../README.md` | Skill overview and current operator-facing description |

### Implementation Anchors

| File | Role |
|---|---|
| `../../assets/interface_preflight_card.md` | The binary fill-in pre-flight card: context table, the layout, content, motion, and AI-tell boxes, and the SHIP or FIX verdict |
| `../../SKILL.md` | Section 2 loads the card as the final mechanical pass before shipping, and Section 5 lists it as a core reference |
| `../../references/design-process/mechanical_defaults.md` | The layout boxes on the card derive from this gate |
| `../../references/design-process/copy_and_mock_data.md` | The content boxes on the card derive from this gate |

---

## 5. SOURCE METADATA

- Group: Mechanical Pre-Flight Card
- Playbook ID: ID-011
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `09--mechanical-preflight-card/preflight-card-on-built-ui.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
