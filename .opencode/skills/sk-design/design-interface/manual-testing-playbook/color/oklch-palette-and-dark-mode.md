---
title: OKLCH Palette And Dark Mode Scenario
description: Manual scenario verifying OKLCH color planning, semantic roles, contrast repair, and dark-mode mapping.
trigger_phrases:
  - "test oklch palette"
  - "test dark mode tokens"
  - "foundations color scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.1
expected_intent: COLOR
expected_resources:
  - references/foundations/corpus-map.md
  - ../shared/register.md
  - references/foundations/color/oklch-workflow.md
  - references/foundations/color/palette-theming.md
---

# FOUND-COLOR-001 | OKLCH Palette And Dark Mode

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FOUND-COLOR-001`.

**Exact prompt**

```text
Create a color token system for a finance dashboard with a teal brand color, restrained product UI, semantic states, and dark mode.
```

---

## 1. OVERVIEW

This scenario validates OKLCH color planning, semantic role ordering, contrast repair, and dark-mode mapping in `interface`'s `foundations` static-system subworkflow. It confirms the palette is grounded in a physical scene before a light-versus-dark decision, and that roles are named before values.

### Why This Matters

A palette can look coherent and still encode meaning by hue alone, invert badly into dark mode, or ship a dangerous meaning pair. Grounding the palette in a scene, naming roles before values, and building dark mode as its own surface system are what separate a durable token system from a set of picked colors.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm a realistic color-token request resolves in the foundations subworkflow with OKLCH values, semantic roles before values, and a dark mode built from its own surface and text pairs.
- Real user request: `We need a color system for our finance dashboard. The brand is teal, the product UI should stay restrained, and it has to work in dark mode.`
- Prompt: `Create a color token system for a finance dashboard with a teal brand color, restrained product UI, semantic states, and dark mode.`
- Expected execution process: Recognize this as `interface`'s `foundations` static-system subworkflow; load `../../references/foundations/color/oklch-workflow.md` and `../../references/foundations/color/palette-theming.md`; ground the palette in one physical-scene sentence before choosing light, dark, restrained, committed, full-palette, or drenched; produce semantic roles before values; state contrast, dangerous meaning-pair, color-vision, and dark-mode rules.
- Expected signals: The physical scene is named first; canonical color roles appear before any value; OKLCH values (or a stated compatibility exception) are used; contrast repair moves lightness; dark mode remaps surface lightness and semantic tokens rather than inverting.
- Desired user-visible outcome: A grounded color token system with semantic roles, accessible pairs, and a dark mode that reads as its own surface system.
- Pass/fail: PASS if the scene is named first, roles precede values, OKLCH is used or excepted deliberately, and dark mode is built from its own surface and text pairs; FAIL if the palette is chosen before grounding, meaning is carried by hue alone, contrast is repaired by anything other than lightness, or dark mode is produced by inversion.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Recognize this as `interface`'s `foundations` static-system subworkflow (color/token-system intent), not the aesthetic-direction or delivery-gate path.
2. Load `references/foundations/color/oklch-workflow.md` and `references/foundations/color/palette-theming.md`.
3. Ground the palette in one physical-scene sentence before choosing light, dark, restrained, committed, full-palette, or drenched.
4. Produce semantic roles before values.
5. State contrast, dangerous meaning-pair, color-vision, and dark-mode rules.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FOUND-COLOR-001 | OKLCH palette and dark-mode token plan | Confirm foundations color work grounds the palette, orders roles before values, and maps dark mode as its own surface system | `Create a color token system for a finance dashboard with a teal brand color, restrained product UI, semantic states, and dark mode.` | bash: rg -n "OKLCH" ../../references/foundations/color/oklch-workflow.md -> bash: rg -n "dark mode" ../../references/foundations/color/palette-theming.md -> bash: rg -n "register" ../../../shared/register.md -> agent: produce the color token system | Step 1: OKLCH channel and repair rules found; Step 2: dark-mode remapping rules found; Step 3: register posture found; Step 4: output names the physical scene first, then roles, then values, and closes with dark-mode pairs | Terminal transcript, the produced color token system, the role list, the dark-mode block, and the final PASS or FAIL verdict | PASS when every Pass Criteria bullet below holds; FAIL when any bullet is contradicted, most critically hue-only meaning, inversion-based dark mode, or values chosen before roles | 1. Re-read `../../references/foundations/color/oklch-workflow.md` for the lightness-first repair rule; 2. Re-read `../../references/foundations/color/palette-theming.md` for dark-mode surface mapping; 3. Re-run naming the scene explicitly and confirm roles still precede values |

### Pass Criteria

- Uses OKLCH or explains a compatibility exception.
- Names the physical scene first: who uses it, where they are, ambient light, and the intended mood before deciding light versus dark.
- Includes the canonical color roles: primary/accent, neutral, semantic, surface, border, and text.
- Covers the accent states (action, selection, focus) under the primary/accent role rather than inventing a separate focus role.
- Warns against dangerous meaning pairs such as red/green, blue/red, and yellow/white, and notes that roughly 8% of men have a color-vision deficiency.
- Never encodes meaning by hue alone; pairs hue with text, icon shape, pattern, position, or state copy.
- Repairs contrast through lightness changes.
- Dark mode uses surface lightness and semantic token remapping, not inversion.
- Verifies theme-specific media, including logos, illustrations, screenshots, maps, charts, and embedded media, so assets remain legible and brand marks do not disappear in each supported theme.
- Notes when semantically loaded colors need locale-aware review because status, ritual, political, or cultural meanings could change by market.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Router and foundations resource map |
| `../../references/foundations/corpus-map.md` | Foundations corpus entry point |
| `../../references/foundations/color/oklch-workflow.md` | OKLCH channel mechanics and lightness-first contrast repair |
| `../../references/foundations/color/palette-theming.md` | Semantic roles, theming, and dark-mode surface mapping |
| `../../../shared/register.md` | Register posture that sets color strategy and token density |

---

## 5. SOURCE METADATA

- Group: Color
- Playbook ID: FOUND-COLOR-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `color/oklch-palette-and-dark-mode.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
