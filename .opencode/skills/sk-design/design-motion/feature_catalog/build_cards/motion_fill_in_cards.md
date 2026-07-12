---
title: "Motion Fill-In Cards"
description: "Current-state reference for design-motion's fill-in build cards covering feedback, hover, focus, loading, transition, toast, gesture, and async-state patterns."
trigger_phrases:
  - "motion fill-in cards"
  - "motion pattern card"
  - "animation spec card"
  - "motion handoff card"
version: 1.0.0.0
---

# Motion Fill-In Cards

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`design-motion` converts a gate-approved motion decision into a build-ready spec using one fill-in card per interaction pattern, each naming owner, purpose, the state path, and a reduced-motion equivalent before any motion code is written.

A card with a blank cell is treated as not ready to hand to `sk-code`.

---

## 2. HOW IT WORKS

Eleven cards cover the common patterns: feedback, hover, focus, loading, state transition, toast, page transition, gesture, drag-and-drop, and async state-machine. Every card shares the same core fields (owner, purpose, states, timing/easing tier, animated properties, reduced-motion equivalent) so a single card can travel on its own attached to the surface it specs. Timing and easing values are cited from `motion_strategy.md` rather than invented per card.

### Pattern-Specific Fields

The feedback, hover, and focus cards check for a visible active/hover/focus-visible state and a matching reduced-motion fallback. The loading card requires a treatment (skeleton, determinate progress, or optimistic state) plus layout-preserving checks. The toast and page-transition cards check enter/exit symmetry and register-gated allowance for page-load choreography. The gesture and drag-and-drop cards cite behavior rules (thresholds, velocity, damping) from `micro_interactions.md` Section 4 rather than restating them. The async state-machine card requires every event to resolve to a target state and forbids impossible states such as loading and success rendering simultaneously.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-motion/assets/motion_pattern_cards.md` | Shared | Defines all eleven fill-in cards, shared fields, and per-pattern checklists. |
| `.opencode/skills/sk-design/design-motion/references/motion_strategy.md` | Shared | Supplies the timing and easing values cards cite rather than invent. |
| `.opencode/skills/sk-design/design-motion/references/micro_interactions.md` | Shared | Supplies gesture and drag-and-drop behavior rules the corresponding cards cite. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-motion/assets/motion_performance_failure_card.md` | Manual playbook | Build-side card of frame-dropping patterns checked before cards are handed off. |
| `.opencode/skills/sk-design/design-motion/manual_testing_playbook/manual_testing_playbook.md` | Manual playbook | Exercises micro-interaction and advanced-craft card scenarios against the live mode. |

---

## 4. SOURCE METADATA

- Group: Build Cards
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `build-cards/motion-fill-in-cards.md`

Related references:
- [../restraint-gate-and-choreography/choreography-and-reduced-motion.md](../restraint_gate_and_choreography/choreography_and_reduced_motion.md) - Timing, easing, and reduced-motion rules cards cite.
- [../procedure-cards/motion-procedure-card-inventory.md](../procedure_cards/motion_procedure_card_inventory.md) - Private card for interaction-state evidence gathering before card selection.
