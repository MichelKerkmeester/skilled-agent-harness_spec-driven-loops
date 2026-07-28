---
title: Token Starter Handoff Scenario
description: Manual scenario verifying the fill-in token scaffold for an OKLCH ramp, type scale and spacing scale keyed to the register.
trigger_phrases:
  - "test token starter"
  - "test token scaffold handoff"
  - "foundations token scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.1
expected_intent: COLOR
expected_resources:
  - references/foundations/corpus-map.md
  - ../shared/register.md
  - references/foundations/color/oklch-workflow.md
  - references/foundations/color/palette-theming.md
  - assets/foundations/token-starter.md
  - references/foundations/type/typography-system.md
  - references/foundations/layout/layout-responsive.md
  - ../shared/design-token-vocabulary.md
  - ../shared/sk-code-handoff.md
---

# FOUND-TOKEN-001 | Token Starter Handoff

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FOUND-TOKEN-001`.

**Exact prompt**

```text
Scaffold a token system for a restrained product UI with a teal brand hue and dark mode, ready to hand to sk-code.
```

---

## 1. OVERVIEW

This scenario validates the fill-in token scaffold in `interface`'s `foundations` static-system subworkflow — an OKLCH ramp, type scale, and spacing scale keyed to the register and confirmed against the handoff checklist before reaching `sk-code`.

### Why This Matters

A token scaffold handed off with blanks, flat-gray neutrals, or one-off spacing values pushes those decisions into implementation, where they get made ad hoc and inconsistently. Reading the register first and clearing the handoff checklist is what makes the scaffold a contract rather than a suggestion.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a token-scaffold request resolves in the foundations subworkflow with the register read first, every token filled from evidence, and the handoff checklist cleared before passing to `sk-code`.
- Real user request: `Put together the token system for our product UI. Brand hue is teal, keep it restrained, we need dark mode, and the build team takes it from there.`
- Prompt: `Scaffold a token system for a restrained product UI with a teal brand hue and dark mode, ready to hand to sk-code.`
- Expected execution process: Recognize this as `interface`'s `foundations` static-system subworkflow, where the token scaffold is filled before any `sk-code` implementation handoff; read `../../../shared/register.md` first, then load `../../assets/foundations/token-starter.md`; set the register and copy the color strategy and density answers into the scaffold; fill the OKLCH ramp, type scale, and spacing scale, pulling the brand hue from evidence rather than a default; fill the dark-mode block as its own surface system rather than inverted light values.
- Expected signals: The register is read and recorded before any value is filled; every color token carries an OKLCH value or a stated compatibility reason; neutrals are tinted toward the brand hue; every spacing value comes from the scale; the dark-mode block is built from its own surface and text pairs; the handoff checklist is confirmed.
- Desired user-visible outcome: A completely filled token scaffold, keyed to the register, that `sk-code` can implement without re-deciding anything.
- Pass/fail: PASS if the register is read first, every token is filled from evidence, dark mode is its own surface system, and the handoff checklist is confirmed; FAIL if values are filled before the register is set, neutrals are flat gray, spacing values are typed one-off, dark mode is inverted, or any cell is left blank at handoff.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Recognize this as `interface`'s `foundations` static-system subworkflow. The token scaffold is filled here before any `sk-code` implementation handoff.
2. Read `../shared/register.md` first, then load `assets/foundations/token-starter.md`.
3. Set the register and copy the color strategy and density answers into the scaffold.
4. Fill the OKLCH ramp, type scale and spacing scale, pulling the brand hue from evidence rather than a default.
5. Fill the dark-mode block as its own surface system rather than inverted light values.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FOUND-TOKEN-001 | Token starter scaffold handoff | Confirm the register is read first, every token is filled from evidence, and the handoff checklist clears before `sk-code` | `Scaffold a token system for a restrained product UI with a teal brand hue and dark mode, ready to hand to sk-code.` | bash: rg -n "register" ../../../shared/register.md -> bash: rg -n "token" ../../assets/foundations/token-starter.md -> bash: rg -n "OKLCH" ../../references/foundations/color/oklch-workflow.md -> agent: fill the token scaffold | Step 1: register posture and dials found; Step 2: scaffold cells found; Step 3: OKLCH ramp rules found; Step 4: scaffold returned with every cell filled and the handoff checklist confirmed | Terminal transcript, the filled token scaffold, the register record, the dark-mode block, and the final PASS or FAIL verdict | PASS when every Pass Criteria bullet below holds; FAIL when any bullet is contradicted, most critically a blank cell at handoff, flat-gray neutrals, or inverted dark mode | 1. Re-read `../../assets/foundations/token-starter.md` and confirm no cell is left blank; 2. Re-read `../../../shared/register.md` and confirm the register won on posture conflicts; 3. Re-run and verify every spacing value maps to the declared scale |

### Pass Criteria

- Reads the register before filling values, and lets the register win on posture when a value conflicts.
- Fills every color token with an OKLCH value or a deliberate compatibility reason.
- Tints neutrals toward the brand hue with a small chroma rather than using flat gray.
- Sets type roles before sizes, keeps body near 16 px, and uses tabular numerals on data.
- Pulls every spacing value from the scale rather than typing one-off numbers.
- Builds dark mode from its own surface and text pairs, holding hue and chroma steady while varying lightness.
- Confirms the handoff checklist before passing the filled scaffold to `sk-code`.
- Defers channel mechanics, contrast repair and semantic role theory to the color and type references.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Router and foundations resource map |
| `../../references/foundations/corpus-map.md` | Foundations corpus entry point |
| `../../assets/foundations/token-starter.md` | Fill-in token scaffold for ramp, type scale, and spacing scale |
| `../../references/foundations/color/oklch-workflow.md` | OKLCH channel mechanics and contrast repair |
| `../../references/foundations/color/palette-theming.md` | Semantic roles and dark-mode surface mapping |
| `../../references/foundations/type/typography-system.md` | Type roles and scale for the scaffold |
| `../../references/foundations/layout/layout-responsive.md` | Spacing scale for the scaffold |
| `../../../shared/register.md` | Register posture that sets color strategy and density |
| `../../../shared/design-token-vocabulary.md` | Canonical token naming vocabulary |
| `../../../shared/sk-code-handoff.md` | Handoff checklist confirmed before passing to `sk-code` |

---

## 5. SOURCE METADATA

- Group: Tokens
- Playbook ID: FOUND-TOKEN-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tokens/token-starter-handoff.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
