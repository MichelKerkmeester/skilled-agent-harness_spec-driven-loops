---
title: Prototype Flow Spec
description: Private procedure card for design-interface stateful prototype flow specifications.
trigger_phrases:
  - "prototype flow spec"
  - "interactive prototype brief"
  - "stateful ui flow"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Prototype Flow Spec

Private procedure card for applying the existing design-interface prototype flow specification workflow.

## 1. REQUIRED FIELDS

| Field | Value |
|---|---|
| Purpose | Convert an interface request for a prototype into a stateful flow specification that `sk-code` can implement. |
| Owning mode | `design-interface` |
| Source reference | `make-a-prototype.md` |
| Trigger | Use when the user asks for a prototype, interactive mockup, demo, clickable flow, or validation of stateful UI behavior. |
| Output contract | A prototype brief with screens, entry point, goal state, state model, interaction matrix, feedback states, persistence expectations, and implementation handoff constraints. |
| Proof gate | The spec covers navigation, validation, loading, success, error, keyboard, focus, and any state that should survive reload; unresolved fake or simulated behavior is labeled. |
| Privacy rule | This card does not make `design-interface` a builder mode or public prototype skill. Implementation remains a handoff to `sk-code`. |

## 2. READ-ONLY COMPATIBILITY

The four read-only design modes may cite this card to produce a flow spec or handoff. They must not require writing files, running commands, or creating a working prototype themselves.

## 3. PROCEDURE

1. Confirm flow scope, fidelity, device frame, variation count, visual system, and sample-data needs.
2. Map screens and state transitions before any implementation handoff.
3. Require real feedback states for navigation, forms, async work, success, error, and sub-state changes.
4. Decide which state should persist across reloads or sessions.
5. Hand implementation to `sk-code` with a verification checklist for the complete flow.

## 4. CONFLICT RULE

If the user only needs structure, start with `wireframe_exploration.md`. If they need multiple prototype directions, combine with `variation_set.md` before handoff.
