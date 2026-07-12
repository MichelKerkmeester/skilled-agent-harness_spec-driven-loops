---
title: "Choreography And Reduced Motion"
description: "Current-state reference for design-motion timing, easing, AnimatePresence exits, performance safety, and reduced-motion equivalents."
trigger_phrases:
  - "choreography and reduced motion"
  - "AnimatePresence exit rules"
  - "motion performance compositor"
  - "prefers-reduced-motion"
version: 1.0.0.0
---

# Choreography And Reduced Motion

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`design-motion` choreographs timing, easing, and material for any interaction that survives the restraint gate, then defines the reduced-motion equivalent that preserves the same state change with the movement removed.

Exits are always faster than their matching entrance, and feedback motion stays under `300ms`.

---

## 2. HOW IT WORKS

`AnimatePresence` exits require the conditional element to sit inside an `AnimatePresence` wrapper, carry an `exit` prop, use a stable data-ID key rather than an array index, and set `initial={false}` when the element is already present on mount so no enter animation plays on page load. Presence modes are chosen by need: `sync` for simple overlays with layout risk mitigated by `absolute` positioning, `wait` for route replacement (roughly doubling total perceived time, so each phase is shortened), and `popLayout` for list reordering with layout-aware children.

### Performance Safety

Animation stays on the compositor (`transform`, `opacity`) by default; layout properties (`width`, `height`, `top`, `left`) are avoided for continuous animation in favor of a FLIP sequence (measure first geometry, apply the change, measure last geometry, invert with transform, play back to zero). `transition: all` is never used; `will-change` is applied temporarily and only to compositable properties. Scroll-driven motion uses `IntersectionObserver` or Scroll/View Timelines rather than raw scroll events, and loops pause off-screen.

### Reduced Motion

`prefers-reduced-motion: reduce` swaps movement for instant state changes, opacity shifts, or color/focus changes rather than removing state feedback entirely; React consumers use `useReducedMotion()` to swap to a zero-duration or non-motion state.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-motion/references/animate_presence_patterns.md` | Shared | Defines exit rules, presence modes, presence hooks, nested exits, and list transitions. |
| `.opencode/skills/sk-design/design-motion/references/performance_reduced_motion.md` | Shared | Defines rendering cost tiers, critical never patterns, the FLIP technique, and the reduced-motion contract. |
| `.opencode/skills/sk-design/design-motion/references/motion_strategy.md` | Shared | Defines purpose, timing, easing, staging, and motion materials choreography draws from. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-design/design-motion/assets/animate_presence_checklist.md` | Manual playbook | Pass/fail checklist for shipping an `AnimatePresence` exit animation. |
| `.opencode/skills/sk-design/design-motion/manual_testing_playbook/manual_testing_playbook.md` | Manual playbook | Exercises presence, reduced-motion, and advanced-craft scenarios against the live mode. |

---

## 4. SOURCE METADATA

- Group: Restraint Gate And Choreography
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `restraint-gate-and-choreography/choreography-and-reduced-motion.md`

Related references:
- [motion-restraint-gate.md](../restraint_gate_and_choreography/motion_restraint_gate.md) - The gate that decides whether choreography is needed at all.
- [../build-cards/motion-fill-in-cards.md](../build_cards/motion_fill_in_cards.md) - Fill-in cards that cite these timing and reduced-motion rules.
