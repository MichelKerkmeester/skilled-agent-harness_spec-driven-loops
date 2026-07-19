---
title: Tweakable Design Controls
description: Private procedure card for design-foundations live-adjustable design controls.
trigger_phrases:
  - "tweakable design controls"
  - "adjustable design tokens"
  - "live design controls"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Tweakable Design Controls

Private procedure card for applying the existing design-foundations tweak-control workflow.

## 1. REQUIRED FIELDS

| Field | Value |
|---|---|
| Purpose | Let `design-foundations` define a small, meaningful set of live-adjustable design controls for a surface or system. |
| Owning mode | `design-foundations` |
| Source reference | `make-tweakable.md` |
| Trigger | Use when the user wants to play with options, compare visual choices, expose adjustable tokens, or make variants controllable. |
| Output contract | A tweak-control spec naming 3 to 8 controls, control types, token or state targets, defaults, persistence expectations, and hidden-when-off behavior. |
| Proof gate | Each control changes a meaningful design axis, maps to a token or state, has a default, and excludes nonessential knobs. |
| Privacy rule | This is private foundations guidance and does not create a public tweakable skill. |

## 2. READ-ONLY COMPATIBILITY

`design-foundations` can return the control schema and handoff without writing code or running host protocols. Implementation of controls belongs to a mutating follow-up or `sk-code`.

## 3. PROCEDURE

1. Identify which axes are worth exposing: color, type, density, layout, component treatment, copy, or feature visibility.
2. Keep the control surface small and purposeful.
3. Map each control to a token, CSS custom property, or stateful UI setting.
4. Specify defaults and persistence behavior for implementation.
5. Require the final design to hide tweak chrome when controls are off.

## 4. RELATED CARDS

- `component-system-inventory.md` when controls affect reusable component variants.
- `../design-interface/procedures/variation-set.md` when alternatives are better shown as separate directions.
