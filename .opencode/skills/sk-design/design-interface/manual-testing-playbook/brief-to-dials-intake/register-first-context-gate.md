---
title: "ID-016 -- Register-first context gate on a UI build"
description: "This scenario validates that interface work sets the Brand-vs-Product register and dials before any palette, layout, motion, copy, or delivery choice, and that the shared context-loading manifest blocks decisions when the register proof is missing."
contextType: reference
version: 1.0.0.0
id: ID-016
expected_intent: REGISTER_DIALS
expected_resources:
  - references/design-process/design-principles.md
  - ../shared/register.md
  - ../shared/context-loading-contract.md
  - ../shared/assets/context-loaded-card.md
  - references/design-process/brief-to-dials.md
  - assets/interface-preflight-card.md
---

# ID-016 -- Register-first context gate on a UI build

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ID-016`.

**Exact prompt**

```text
Design a dense operations dashboard for incident commanders and show the register, dials, and loaded context before any visual choices.
```

---

## 1. OVERVIEW

This scenario validates the register-first context gate for `ID-016`. It focuses on confirming a UI build request sets the Brand-vs-Product register and the variance, motion, and density dials before any palette, layout, motion, copy, or delivery claim, then names the loaded context bundle required by `../../../shared/context-loading-contract.md`.

### Why This Matters

The register is the first design decision because it sets the operating posture for the whole surface. A dense incident-command dashboard is a Product surface: the interface serves operational judgment, so density, motion restraint, copy register, color dosage, and audit severity all start from that posture. If the agent chooses colors, layout, or motion before setting Product and the dials, the output can drift toward a generic landing-page default while still sounding plausible. The guard catches that miss before the design work starts.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ID-016` and confirm the expected signals without contradictory evidence.

- Objective: Confirm an interface build request emits the context manifest, sets `REGISTER: Product` with WHY and DIALS, stages the downstream-effect proof, and blocks any visual or delivery decision until those fields exist.
- Real user request: `Design a dense operations dashboard for incident commanders. I need the visual direction, but do not skip the design context checks.`
- Prompt: `Design a dense operations dashboard for incident commanders and show the register, dials, and loaded context before any visual choices.`
- Expected execution process: Load `../../../shared/context-loading-contract.md`, `../../../shared/register.md`, `../../references/design-process/brief-to-dials.md`, and `../../assets/interface-preflight-card.md`; fill a Context Loaded card first; set Product register with WHY and variance, motion, and density dials; only then produce palette, layout, motion, copy, or pre-flight work.
- Expected signals: Step 1: context manifest names the loaded shared and interface files; Step 2: `REGISTER: Product`, WHY, DIALS, and DOWNSTREAM EFFECT appear before visual choices; Step 3: palette, layout, motion, and copy choices explicitly inherit the Product posture; Step 4: missing register proof returns BLOCKED or FIX instead of continuing.
- Desired user-visible outcome: A context-loaded card followed by a calibrated Product design direction, with no palette, layout, motion, copy, or ready claim emitted before register and dials proof.
- Pass/fail: PASS if the register and dials proof appears first and gates every downstream visual choice per `../../../shared/context-loading-contract.md`; FAIL if the response starts with palette, layout, motion, copy, anti-slop, audit severity, or delivery language before setting register and dials.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request as an interface build for a concrete Product surface.
2. Load the shared context-loading contract and register before mode-specific design decisions.
3. Fill the Context Loaded card and the register/dials proof fields before any palette or layout statement.
4. Confirm the first downstream design decision references the Product posture and dial values.
5. Return a concise final verdict that names whether the guard fired or the skipped-register miss recurred.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ID-016 | Register-first context gate on a UI build | Confirm register and dials are set before palette, layout, motion, copy, or delivery choices for a realistic Product UI build | `Design a dense operations dashboard for incident commanders and show the register, dials, and loaded context before any visual choices.` | bash: rg -n "REGISTER: Brand \\| Product|Context Loaded|Register/Dials" ../../../shared/context-loading-contract.md -> bash: rg -n "first design decision|Set the register" ../../../shared/register.md -> bash: rg -n "Set the register first|Design Read" ../../references/design-process/brief-to-dials.md -> agent: produce the context-loaded card, then the first design direction paragraph | Step 1: manifest names context_loading_contract.md, register.md, brief_to_dials.md, and interface_preflight_card.md; Step 2: Product register, WHY, DIALS, and DOWNSTREAM EFFECT precede any visual decision; Step 3: missing proof blocks work instead of continuing | Terminal transcript, context-loaded card, first design-direction paragraph, and final PASS or FAIL verdict | PASS if the guard fires before visual choices and the first design direction inherits Product register and dials; FAIL if palette, layout, motion, copy, audit severity, or ready language appears before register proof | 1. Re-read ../../../shared/context-loading-contract.md Sections 1 through 5; 2. Re-read ../../../shared/register.md Sections 1 through 4; 3. Re-run with the same prompt and inspect the first non-procedural paragraph for pre-register visual choices |

### Optional Supplemental Checks

Repeat with a Brand surface prompt such as a film-festival landing page. The expected register changes to Brand, but the order does not change: register and dials still appear before color, type, layout, motion, copy, or delivery claims.

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
| `../../../shared/context-loading-contract.md` | Shared context manifest, register/dials proof fields, and hard gates that block design decisions before context proof exists |
| `../../../shared/register.md` | Brand-vs-Product register and downstream dials that must be set first |
| `../../../shared/assets/context-loaded-card.md` | Fill-in card proving the loaded files and staged proof fields before design work |
| `../../references/design-process/brief-to-dials.md` | Design Read intake that sets variance, motion, and density after the register posture |
| `../../assets/interface-preflight-card.md` | Final pre-flight card whose context table also requires register and dials |
| `../../SKILL.md` | Resource-loading table and workflow rule requiring register plus brief-to-dials before decisions |

---

## 5. SOURCE METADATA

- Group: Brief-To-Dials Intake
- Playbook ID: ID-016
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `brief-to-dials-intake/register-first-context-gate.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
