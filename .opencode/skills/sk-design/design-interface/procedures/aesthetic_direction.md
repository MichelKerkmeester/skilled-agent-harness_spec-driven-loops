---
title: Aesthetic Direction
description: Private procedure card for design-interface visual direction when no brand or design system exists.
trigger_phrases:
  - "aesthetic direction"
  - "visual direction brief"
  - "greenfield interface direction"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Aesthetic Direction

Private procedure card for applying the existing design-interface aesthetic direction workflow.

## 1. REQUIRED FIELDS

| Field | Value |
|---|---|
| Purpose | Make `design-interface` commit to a concrete visual direction before high-fidelity work when no brand or design system is available. |
| Owning mode | `design-interface` |
| Source reference | `frontend-aesthetic-direction.md` |
| Trigger | Use when a greenfield interface, landing page, or visual redesign lacks an existing brand, design system, or reference to match. |
| Output contract | A direction brief naming mood, audience, type choices, color posture, density, radius, component style, imagery, motion budget, and review risks. |
| Proof gate | The mode states why existing context is absent, names a non-generic direction, explains how the direction avoids common AI-default looks, and identifies axes that need user sign-off. |
| Privacy rule | This is private guidance for interface decisions and does not create a public aesthetic-direction skill. |

## 2. READ-ONLY COMPATIBILITY

`design-interface` can use this card by reading available context and returning a direction or handoff. It does not require Write, Edit, Bash, or external transport.

## 3. PROCEDURE

1. Confirm that no stronger existing brand, product, or reference source applies.
2. Resolve the audience, industry, desired adjectives, and off-limits tropes from the brief or ask through the discovery card.
3. Choose specific type, color, density, radius, component, imagery, and motion decisions instead of broad style labels.
4. Include at least one deliberate non-median choice tied to the subject matter.
5. Produce a short review note explaining what should be tested before scaling the direction.

## 4. RELATED CARDS

- `variation_set.md` when the user wants multiple visual directions.
- `prototype_flow_spec.md` when the selected direction needs interaction handoff.
