---
title: Motion Strategy
description: Purpose, timing, easing, staging, animation principles, and material choice for interface motion.
trigger_phrases:
  - "motion strategy"
  - "animation timing"
  - "motion easing"
  - "motion materials"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Motion Strategy

Motion must communicate. Before choosing a library or property, name the job: feedback, orientation, focus, continuity, perceived performance, or earned delight.

---

## 1. OVERVIEW

### Purpose

Decide why an interface element moves before deciding how. This reference covers the motion budget, timing scale, easing, staging, material choice, and the verification checks that keep animation purposeful rather than decorative.

### When to Use

- Choosing whether a state change deserves motion at all.
- Setting duration and easing for feedback, transitions, or an earned hero moment.
- Picking the animation material (transform/opacity, blur, clip-path, FLIP) for a given effect.
- Verifying that motion supports the primary content instead of competing with it.

---

## 2. Motion Budget

| Layer | Use when | Rule |
| --- | --- | --- |
| Hero moment | One memorable brand or landing-page event earns choreography | One moment, not every section. |
| Feedback | Button press, toggle, validation, save, copy, drag | Fast and local. |
| Transition | Modal, drawer, tab, route, accordion, list changes | Clarifies where state came from or went. |
| Delight | Success, milestone, empty state, hidden discovery | Brief, contextual, skippable, never blocking. |

If motion does not improve clarity or feeling at one of these layers, remove it.

## 3. Timing

| Duration | Use case |
| --- | --- |
| `100-150ms` | press, hover, tap, tiny feedback |
| `200-300ms` | toggle, dropdown, tooltip, tab change |
| `300-500ms` | modal, drawer, accordion, layout transition |
| `500-800ms` | one earned entrance or brand choreography |

This is the 100/300/500 rule: roughly 100ms for instant feedback, 300ms for state changes, 500ms for layout changes, and timing matters more than easing for whether motion feels right. Exit animations should usually run at about 75 percent of the entrance duration. User-initiated feedback over `300ms` feels laggy. Anything under about `80ms` feels instant, because perception buffers input for roughly that long; target sub-`80ms` for micro-interactions.

## 4. Easing

Use deceleration for arrivals:

```css
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
--ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
```

Use ease-in for exits and spring only when overshoot-and-settle is the actual desired physical feel. Avoid bounce or elastic defaults.

Reserve `linear` for determinate progress bars and similar progress indicators; never use it for movement. Linear motion reads as mechanical, so transforms and position changes should use a deceleration or ease-in curve, not `linear`.

## 5. Staging

- Animate one focal point prominently at a time.
- Dim modal backgrounds to direct focus.
- Coordinate z-index and layer hierarchy before animating overlays.
- Stagger lists only when they are actual related siblings. Cap total delay; reduce per-item delay when the list is long.

## 6. Motion Materials

Transform and opacity are reliable defaults, but not the whole palette.

| Material | Use for | Constraint |
| --- | --- | --- |
| Transform/opacity | movement, press, simple reveals, list choreography | preferred default |
| Blur/filter/backdrop | focus pulls, lens, glass, softened entrances | small, bounded, verified smooth |
| Clip-path/masks | wipes, editorial reveals, product transitions | avoid large continuous masks |
| Shadow/glow/color | active state, affordance, warmth | local UI only; avoid page-wide effects |
| FLIP/grid-row | layout-like transitions | measure once, animate transform or bounded row expansion |

## 7. Verification

Check:
- Purpose named.
- Timing and easing match the state.
- Similar elements use consistent timing.
- Reduced-motion alternative exists.
- Motion does not compete with the primary content.
- Interaction remains usable during and after motion.
