---
title: Motion Pattern Cards
description: Fill-in cards for the common motion patterns, each naming the owner, the trigger states, the purpose and the reduced-motion path before any code is written.
trigger_phrases:
  - "motion pattern card"
  - "animation spec card"
  - "interaction pattern fill-in"
  - "motion handoff card"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Motion Pattern Cards

Fill-in cards for common motion patterns before implementation handoff.

## 1. OVERVIEW

### Purpose

Each card forces the four things a motion spec must name: who owns the interaction, which states it moves between, why it moves and what happens under reduced motion. These cards are handoff artifacts, not reusable components. Fill one card per interaction, keep it attached to the surface that owns the behavior, and treat any unchecked box as a design problem to resolve before implementation.

### Usage

Pick the card for the pattern you are building and fill the blanks before writing any motion code. Run the decision gate in `references/animation-decision-framework.md` first. If the gate says do not animate, you do not need a card. Copy the table, replace every `__________` and tick the boxes that apply. A card with blank cells is not ready to hand to `sk-code`. Timing, easing and material values come from `references/motion-strategy.md`, so a card cites them rather than inventing new numbers.

---

## 2. SHARED FIELDS

Every card carries these. They are repeated in each table so a single card can travel on its own.

- **Owner.** The component or surface that owns this interaction.
- **Purpose.** One of feedback, orientation, focus, continuity, perceived performance or earned delight. Exactly one.
- **States.** The state path the motion crosses, for example `default -> hover -> active`.
- **Timing and easing.** Pulled from `motion-strategy.md`, not invented here.
- **Properties.** The animated properties, transform and opacity by default.
- **Reduced motion.** The equivalent state change with movement removed.

---

## 3. FEEDBACK CARD

Confirms an action was received. Press, toggle, validation, copy, save.

| Field | Value |
|---|---|
| Owner | `__________` |
| Purpose | feedback |
| States | default -> active (-> success / error) |
| Trigger | `__________` (click / tap / submit) |
| Timing and easing | `__________` (feedback tier, near the `100-150ms` floor) |
| Properties | `__________` (scale on press stays `0.95-1.0`, commonly `0.96`) |
| Reduced motion | `__________` (instant color or state change, no movement) |
| Checks | [ ] active state present [ ] not the only signal [ ] sub-`300ms` |

---

## 4. HOVER CARD

A pointer affordance only. It signals "interactive" and never replaces a press state or a disclosure path.

| Field | Value |
|---|---|
| Owner | `__________` |
| Purpose | feedback |
| States | default -> hover |
| Trigger | pointer enter |
| Timing and easing | `__________` (micro-feedback tier) |
| Properties | `__________` (small lift, color or shadow, where a lift such as `scale(1.05)` is hover, not press) |
| Reduced motion | `__________` (keep color or focus signal, drop movement) |
| Checks | [ ] gated behind `(hover: hover) and (pointer: fine)` [ ] not the only disclosure [ ] separate active state exists |

---

## 5. FOCUS CARD

Keyboard parity for a hover or active affordance. Required, not optional.

| Field | Value |
|---|---|
| Owner | `__________` |
| Purpose | focus |
| States | default -> focus-visible |
| Trigger | keyboard focus |
| Timing and easing | `__________` (instant or micro-feedback tier) |
| Properties | `__________` (visible ring or path highlight) |
| Reduced motion | `__________` (ring stays, any movement drops) |
| Checks | [ ] visible focus ring [ ] matches the hover or active affordance [ ] never removed for looks |

---

## 6. LOADING CARD

Sets expectations during a wait and preserves layout so nothing jumps when content lands.

| Field | Value |
|---|---|
| Owner | `__________` |
| Purpose | perceived performance |
| States | idle -> loading -> loaded / error |
| Treatment | `__________` (skeleton / determinate progress / optimistic state) |
| Timing and easing | `__________` (loops use `linear`, and skeleton shimmer stays subtle) |
| Copy | `__________` (product-specific, for example "Syncing your team's changes", never a generic joke) |
| Reduced motion | `__________` (static placeholder or text, no shimmer or spin) |
| Checks | [ ] layout preserved [ ] determinate when progress is knowable [ ] cancel or escape for long waits [ ] loop pauses off-screen |

---

## 7. STATE TRANSITION CARD

A control or region changing between two settled states. Toggle, accordion, tab content, expand and collapse.

| Field | Value |
|---|---|
| Owner | `__________` |
| Purpose | orientation |
| States | `__________` (state A -> state B) |
| Trigger | `__________` |
| Timing and easing | `__________` (small-transition tier, ease-out in, ease-in out) |
| Properties | `__________` (transform and opacity, never animate layout properties directly) |
| Reduced motion | `__________` (instant swap, keep any color or icon change) |
| Checks | [ ] interruptible CSS transition, not a one-shot keyframe [ ] exit about 75 percent of enter [ ] sibling controls use matching timing |

---

## 8. TOAST CARD

A transient message. Enters and leaves from the same edge so swipe to dismiss feels obvious.

| Field | Value |
|---|---|
| Owner | `__________` |
| Purpose | continuity |
| States | absent -> entering -> present -> exiting |
| Enter and exit edge | `__________` (same edge for both, supports spatial consistency) |
| Timing and easing | `__________` (small-transition tier, exit faster than enter) |
| Properties | `__________` (translate by own size using a percentage, plus opacity) |
| Reduced motion | `__________` (fade only, no slide) |
| Checks | [ ] interruptible transition for rapid stacking [ ] timer pauses when the tab is hidden [ ] stable key per toast [ ] dismiss has an accessible path |

---

## 9. PAGE TRANSITION CARD

A route or view replacement. The heaviest motion on a Product surface, so justify it against the register.

| Field | Value |
|---|---|
| Owner | `__________` |
| Purpose | orientation |
| States | view A -> view B |
| Trigger | navigation |
| Mode | `__________` (`wait` makes the old view leave first and roughly doubles total time, so shorten each phase) |
| Timing and easing | `__________` (layout-transition tier) |
| Properties | `__________` (transform and opacity) |
| Reduced motion | `__________` (crossfade or instant swap, no large movement) |
| Checks | [ ] register allows it (no page-load choreography on a Product surface) [ ] total perceived time stays fast [ ] keyboard navigation not delayed |

---

## 10. GESTURE CARD

Drag, swipe and pointer-driven motion. This card records the spec only. The behavior rules for thresholds, velocity, damping and accessible alternatives live in `references/micro-interactions.md` Section 4, so cite them here rather than restating them.

| Field | Value |
|---|---|
| Owner | `__________` |
| Purpose | continuity |
| States | rest -> dragging -> released / dismissed |
| Gesture | `__________` (swipe / drag / pull) |
| Behavior rules source | `references/micro-interactions.md` Section 4 |
| Timing and easing | `__________` (spring is appropriate for interruptible drag) |
| Properties | `__________` (transform, updated directly on the element, not through an inherited CSS variable) |
| Reduced motion | `__________` (keep the action, remove or shorten the travel) |
| Checks | [ ] target feedback during drag [ ] release path snappy [ ] accessible alternative exists [ ] touch targets at least 44 by 44 pixels |

---

## 11. DRAG-AND-DROP CARD

Reordering or moving items between containers. A specialized gesture, so it inherits the gesture behavior rules and adds drop and reorder concerns.

| Field | Value |
|---|---|
| Owner | `__________` |
| Purpose | continuity |
| States | rest -> lifted -> over target -> dropped / cancelled |
| Behavior rules source | `references/micro-interactions.md` Section 4 |
| Lift feedback | `__________` (shadow, scale or elevation on pick up) |
| Drop and reorder | `__________` (target highlight, gap preview, rollback or undo when meaningful) |
| Timing and easing | `__________` (spring for the moving item, and the list settle uses the small-transition tier) |
| Properties | `__________` (transform, with FLIP for the settle of displaced items) |
| Reduced motion | `__________` (instant reorder, keep the result, drop the travel) |
| Checks | [ ] lift feedback present [ ] drop target legible [ ] undo or rollback for meaningful moves [ ] list settle uses FLIP, not layout animation |

---

## 12. ASYNC STATE-MACHINE CARD

Branching async UI needs a state fragment before it needs animation. Use this for upload, sync, payment, import, generation, search, or any flow where pending, success, failure, retry, cancellation, and disabled states can overlap.

| Field | Value |
|---|---|
| Owner | `__________` |
| Purpose | orientation |
| States | `__________` (idle / pending / success / error / retrying / cancelled / disabled) |
| Events | `__________` (submit, resolve, reject, retry, cancel, timeout, reset) |
| Transitions | `__________` (event -> from state -> to state) |
| Guards | `__________` (conditions that block or redirect a transition) |
| Impossible states | `__________` (for example loading + success visible at the same time) |
| Entry actions | `__________` (disable controls, start progress, announce state, focus target) |
| Exit actions | `__________` (clear timers, restore controls, preserve user input, stop loop) |
| Visible UI per state | `__________` (copy, control state, affordance, feedback location) |
| Timing and easing | `__________` (cite `references/motion-strategy.md`; no custom values) |
| Reduced motion | `__________` (same state feedback, movement removed) |
| Checks | [ ] every event has a target state [ ] impossible states cannot render [ ] errors preserve recovery path [ ] visible UI matches the current state |
