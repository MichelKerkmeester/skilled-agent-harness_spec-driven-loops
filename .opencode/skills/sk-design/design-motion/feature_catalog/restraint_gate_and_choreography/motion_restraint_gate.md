---
title: "Motion Restraint Gate"
description: "Current-state reference for design-motion's frequency-based restraint gate that decides whether an interaction animates at all."
trigger_phrases:
  - "motion restraint gate"
  - "should this animate"
  - "animation frequency gate"
  - "keyboard rule motion"
version: 1.0.0.0
---

# Motion Restraint Gate

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`design-motion` answers "should this animate at all" before any timing, easing, or material choice, because most over-animated interfaces fail at this question rather than at the timing scale.

Frequency is the strongest lever: an action a user triggers a hundred times a day is never animated, while an action triggered once is where delight can live.

---

## 2. HOW IT WORKS

The gate runs four checks in order and stops at the first no. Frequency: 100-plus times per day is no animation ever; tens of times per day gets removed or reduced hard; occasional interactions (modals, drawers, toasts) get a standard state transition; rare or first-time moments (onboarding, celebration) allow delight. Input: any keystroke-driven action, including command palettes, shortcut-driven panel toggles, and keyboard list navigation, stays instant, even when a click can also trigger it.

### Purpose And Register

A choice that survives frequency and input still needs one named purpose: feedback, spatial continuity, state indication, orientation, preventing a jarring change, or explanation. "Looks cool" is valid only in the rare or first-time tier. The surviving choice is then checked against the register motion-budget dial from `../shared/register.md`: a Product surface gets state transitions and no page-load choreography, a Brand surface can afford one well-rehearsed moment, and an unlabeled internal surface is treated as Product.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-motion/references/animation_decision_framework.md` | Shared | Defines the frequency gate, the keyboard rule, the purpose test, and register coupling. |
| `.opencode/skills/sk-design/shared/register.md` | Shared | Supplies the Brand-vs-Product register that sets the motion-budget dial. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-motion/manual_testing_playbook/manual_testing_playbook.md` | Manual playbook | Exercises restraint-gate and decision scenarios against the live mode. |

---

## 4. SOURCE METADATA

- Group: Restraint Gate And Choreography
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `restraint-gate-and-choreography/motion-restraint-gate.md`

Related references:
- [choreography-and-reduced-motion.md](choreography-and-reduced-motion.md) - Choreography for choices that survive the gate.
- [../build-cards/motion-fill-in-cards.md](../build-cards/motion-fill-in-cards.md) - Fill-in cards that spec a gate-approved pattern.
