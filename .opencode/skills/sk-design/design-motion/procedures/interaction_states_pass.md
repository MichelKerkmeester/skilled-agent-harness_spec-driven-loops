---
title: Interaction States Pass
description: Private procedure card for design-motion interaction states, feedback, transitions, and reduced-motion expectations.
trigger_phrases:
  - "interaction states pass"
  - "state feedback matrix"
  - "reduced motion states"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Interaction States Pass

Private procedure card for applying the existing design-motion interaction-state workflow.

## 1. REQUIRED FIELDS

| Field | Value |
|---|---|
| Purpose | Let `design-motion` specify complete interaction states, feedback, transitions, and reduced-motion expectations. |
| Owning mode | `design-motion` |
| Source reference | `interaction-states-pass.md` |
| Trigger | Use when the request involves hover, active, focus, disabled, loading, selected, navigation, forms, custom widgets, or missing feedback. |
| Output contract | An interaction-state matrix covering elements, default/hover/active/disabled/focus/loading states, transitions, action feedback, and reduced-motion behavior. |
| Proof gate | Every interactive element has a visible rest state, keyboard-visible focus, disabled semantics where needed, feedback for actions, and transition timing that fits the motion budget. |
| Privacy rule | This is private motion guidance and does not create a public interaction-states skill. |

## 2. READ-ONLY COMPATIBILITY

`design-motion` can return a state matrix or handoff. It must not require CSS edits, browser automation, or Bash to apply this card.

## 3. PROCEDURE

1. Inventory buttons, links, inputs, toggles, clickable rows or cards, nav items, and custom widgets.
2. For each element, specify default, hover, active, disabled, focus, and loading behavior when applicable.
3. Tie transitions to the register motion budget and keep micro-feedback responsive.
4. Add action feedback for submission, failure, validation, selection, filters, and async work.
5. Include reduced-motion alternatives for nonessential movement.

## 4. CONFLICT RULE

If the request is primarily an accessibility release claim, `design-audit/procedures/accessibility_audit.md` owns the verdict while this card supplies the interaction-state standard.
