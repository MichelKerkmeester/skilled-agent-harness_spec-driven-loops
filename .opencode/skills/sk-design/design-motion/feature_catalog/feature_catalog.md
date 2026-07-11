---
title: "design-motion: Feature Catalog"
description: "Current-state inventory for design-motion's restraint gate, choreography, reduced motion, fill-in build cards, and private procedure cards."
trigger_phrases:
  - "design-motion feature catalog"
  - "motion restraint gate capabilities"
  - "AnimatePresence choreography"
  - "motion procedure cards"
last_updated: "2026-07-06"
version: 1.0.0.0
---

# design-motion: Feature Catalog

This catalog inventories the live `design-motion` mode. The mode owns the temporal layer of the `sk-design` family: it decides whether an interaction should animate at all, then choreographs timing, easing, presence, and reduced motion for the choices that survive the gate.

---

## 1. OVERVIEW

Use this catalog as the current-state inventory for motion work: the restraint gate that runs before any timing choice, choreography and reduced-motion paths, `AnimatePresence` exit patterns, the fill-in build cards that turn a decision into a spec, and the mode-local procedure card.

---

## 2. RESTRAINT GATE AND CHOREOGRAPHY

### Motion Restraint Gate

#### Description

Decide whether an interaction earns motion before any timing, easing, or material choice, using frequency, the keyboard rule, a named purpose, and the register motion-budget dial.

#### Current Reality

The gate runs four checks in order and stops at the first no: a 100-plus-times-a-day action never animates, a keyboard-driven action stays instant, the animation must name one purpose from feedback, orientation, focus, continuity, perceived performance, or earned delight, and the surviving choice must still fit the Brand-vs-Product motion budget.

#### Source Files

See [`restraint-gate-and-choreography/motion-restraint-gate.md`](restraint-gate-and-choreography/motion-restraint-gate.md) for the frequency table, the keyboard rule, and register coupling.

---

### Choreography And Reduced Motion

#### Description

Choreograph timing, easing, and material for motion that survives the gate, keep exits faster than entrances, and define a reduced-motion equivalent that preserves the state change.

#### Current Reality

Feedback motion stays under `300ms`, exit transitions run faster than their matching entrance, `AnimatePresence` exits require a wrapper, an `exit` prop, and a stable key, and `prefers-reduced-motion` swaps movement for instant state, opacity, or color changes without losing the state signal. Performance rules keep animation on the compositor (`transform`, `opacity`), forbid `transition: all`, and require a FLIP-style measure/invert/play sequence for layout-like transitions.

#### Source Files

See [`restraint-gate-and-choreography/choreography-and-reduced-motion.md`](restraint-gate-and-choreography/choreography-and-reduced-motion.md) for timing tiers, `AnimatePresence` rules, and the reduced-motion contract.

---

## 3. BUILD CARDS

### Motion Fill-In Cards

#### Description

Convert a motion decision that survived the gate into a build-ready spec using named fill-in cards for the common interaction patterns.

#### Current Reality

Cards cover feedback, hover, focus, loading, state transition, toast, page transition, gesture, drag-and-drop, and async state-machine patterns, each naming owner, purpose, states, timing/easing tier, properties, reduced-motion equivalent, and a pass/fail checklist. A card with a blank cell is not ready to hand to `sk-code`.

#### Source Files

See [`build-cards/motion-fill-in-cards.md`](build-cards/motion-fill-in-cards.md) for every card and its required fields.

---

## 4. PROCEDURE CARDS

### Motion Procedure Card Inventory

#### Description

One private card supports motion-specific interaction-state evidence gathering after the public mode is selected: interaction states pass.

#### Current Reality

The mode chooses the card when a trigger matches, cites it in the plan or proof line, and preserves read-only operation with Read, Glob, and Grep only.

#### Source Files

See [`procedure-cards/motion-procedure-card-inventory.md`](procedure-cards/motion-procedure-card-inventory.md) for the card definition and boundaries.
