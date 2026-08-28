---
title: Motion Principles
description: The twelve animation principles adapted to interfaces, plus the enforceable timing, easing, physics and staging rules that make them concrete.
trigger_phrases:
  - "twelve principles of animation"
  - "animation duration for ui"
  - "spring versus easing curve"
  - "when not to animate"
  - "stagger and overshoot"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Motion Principles

Motion is communication, not decoration. The twelve principles say what motion should express; the rules in Section 4 say what values express it.

---

## 1. OVERVIEW

### Core Principle

Great animation is invisible. Users do not think "nice ease-out curve" — they think "this feels good", and they cannot say why. Motion that draws attention to itself has failed.

### When to Use

- Adding or reviewing any transition, animation or gesture.
- Choosing between a spring and an easing curve.
- Deciding whether something should animate at all.
- Motion feels sluggish, chaotic, or cartoonish and the cause is unclear.

### Sources

The twelve principles are Disney's, codified in the 1930s and adapted to interfaces by Raphael Salaja (<https://userinterface.wiki>). The enforceable rules in Section 4 are that adaptation's timing, easing, physics and staging ruleset, restated here with their values intact.

### The Two Halves

Sections 2 and 3 are judgment — what a piece of motion is *for*. Section 4 is mechanical — values that can be checked in a diff. Read the judgment half when designing motion and the mechanical half when reviewing it.

---

## 2. THE TWELVE PRINCIPLES, PART ONE

### 1. Squash and stretch

Everything has mass, and momentary deformation is what tells the brain about weight, material and energy. Digital objects have no physics, so it has to be faked.

Keep it subtle. Too much squash and stretch turns professional software into a cartoon. The target is believability, not slapstick — see the 0.95 to 1.05 bound in Section 4.

### 2. Anticipation

Prepare the user for what comes next. A pitcher winds up; a dancer bends before leaping. In an interface, a pull-to-refresh gesture reveals a hint as the drag passes the threshold, and the elastic resistance says something will happen on release.

Reserve anticipation for moments that matter. If every micro-interaction has a wind-up, the app feels sluggish. Save the drama for the dramatic.

### 3. Staging

Anticipation is about the before; staging is about the during. When a complex panel opens, what should the eye land on first? If everything animates at once, the answer is nothing — attention scatters.

Bring one element into focus and dim the rest. Staging is film direction: not just showing information, but directing attention.

### 4. Straight ahead action and pose to pose

Straight ahead means drawing frame after frame and letting the animation discover itself. Pose to pose means defining the key moments first and filling the gaps.

The web works pose to pose: define the keyframes and let the browser interpolate. That means nailing the important states — start, end, occasionally a midpoint — rather than obsessing over every frame.

It also means **not everything needs to move**. Apple's context menus animate only on exit, never on entry, because context menus are used constantly and an entrance animation would compound into irritation. Sometimes the best animation is none.

### 5. Follow through and overlapping action

Nothing in nature moves as a rigid unit. Hair keeps moving after you stop walking; arms take a moment to catch up when you start running.

This is what springs are for. They add the organic overshoot-and-settle that an easing curve cannot reproduce. The danger is latency: too much stagger and the interface feels like it is thinking too hard, so keep it off critical paths.

### 6. Slow in and slow out

Nothing starts or stops instantly. This is the cornerstone of comfortable transitions, and in practice it is the easing curve.

`ease-out` makes entrances feel snappy — the element arrives fast and settles gently. `ease-in` suits exits, building momentum before departure. `ease-in-out` suits deliberate movement such as a panel sliding across the screen. Linear motion reads as mechanical, which is why it is reserved for progress indicators.

---

## 3. THE TWELVE PRINCIPLES, PART TWO

### 7. Arcs

Movement along a gentle curve feels organic; movement in a straight line feels mechanical. Arcs are hard to get right in UI and are most useful for hero moments and playful interactions. For utilitarian interfaces, straight lines are fine.

### 8. Secondary action

Small flourishes that support the main action without stealing it: a checkmark that pops and then sparkles after a successful submit. The sparkle is not the message; it reinforces it. Sound can play this role too.

### 9. Timing

Timing is the speed of an action, and it is what makes an interface feel snappy or broken. A tooltip at 150ms feels responsive; the same tooltip at 400ms feels broken. The information did not change, only the wait.

**Keep user-initiated interactions under 300ms.** Anything longer needs a stated reason.

More important than any single value: **be consistent**. If buttons animate at 200ms, every button animates at 200ms. Inconsistent timing creates a subconscious sense that something is wrong even when nobody can articulate it. Define the timing scale early and reuse it, exactly as with the spacing and type scales in `SKILL.md`.

### 10. Exaggeration

Amplifying motion past physical accuracy to make a point land. Theatrical and intentional, and correct only in the right moments: onboarding, empty states, confirmations, error notifications. Everywhere else it is noise.

### 11. Solid drawing

Traditional animators made 2D drawings feel three-dimensional. The translation is depth: shadows suggest it, layering implies hierarchy, and CSS `perspective` gives 3D transforms actual depth instead of flat rotation.

Consistency is the other half. If an icon rotates in 3D it must not suddenly read flat or inverted. This is the moving counterpart of the light-source rules in [`depth-and-detail.md`](depth-and-detail.md) Section 2 — one light source, one set of physics, held everywhere.

### 12. Appeal

The sum of the other eleven, applied with care. Appeal is the difference between software people tolerate and software they recommend. It is not a technique; it is what happens when someone clearly gave a damn.

---

## 4. THE ENFORCEABLE RULESET

These are checkable in a diff. Grouped by what they govern.

### Timing

| Rule | Value |
|---|---|
| User-initiated animation ceiling | 300ms; longer needs a stated reason |
| Press and hover | 120 to 180ms |
| Small state change — toggle, dropdown, tooltip | 180 to 260ms |
| Similar elements | identical timing values, no exceptions |
| Feels slow | shorten the duration before touching the curve |
| Context menus | no entrance animation; exit only |
| Stagger | under 50ms per item |

### Easing and springs

| Situation | Use |
|---|---|
| Entrance | `ease-out` |
| Exit | `ease-in` |
| View or mode transition | `ease-in-out` |
| Progress or elapsed time | `linear` — and nothing else uses linear |
| System state change | an easing curve |
| Gesture-driven motion (drag, flick, swipe) | a spring |
| Interruptible motion | a spring |
| Overshoot and settle | a spring, not an easing curve |
| Decay of a value over time | an exponential ramp, not a linear one |

When a gesture ends, pass the input velocity into the spring so the release preserves the energy the user put in. Keep spring parameters balanced — `stiffness: 1000, damping: 5` oscillates like a toy; something near `stiffness: 500, damping: 30` settles.

### Physics

- Every interactive element needs an `:active` state with a scale transform. Without one it feels unresponsive under the finger.
- Deformation stays in the **0.95 to 1.05** range. `scale(0.8)` on a tap is a cartoon.
- Animation values are proportional to the trigger size: a dialog scales from about `0.8`, a button presses to about `0.96`.

### Staging

- One element animates prominently at a time. Two competing animations split attention and neither reads.
- Dim modal and dialog backgrounds rather than using a transparent overlay; a transparent scrim does not isolate anything.
- Animated elements need explicit `z-index`. Tooltips and overlays without one render behind content and break the layering.

### When not to animate

- High-frequency interactions — a search input reacting to every keystroke.
- Keyboard navigation. Focus movement is instant; use `:focus-visible` styling, not a motion component.
- Context menu entrances.
- Theme switches, which must suppress transitions entirely for the duration of the swap.

---

## 5. RECONCILING THE DURATION GUIDANCE

Three sources give three ceilings, and the disagreement is real rather than a rounding difference.

| Source | Says |
|---|---|
| Web Interface Guidelines | not more than 200ms, for interactions to feel immediate |
| This ruleset | 300ms ceiling; 120 to 180ms press and hover; 180 to 260ms small state |
| `sk-design-md-generator` numeric design laws | 100 to 150ms feedback, 200 to 300ms state change, 300 to 500ms layout transition |

They are measuring different things. The 200ms figure is about *direct feedback* — the response to a press or hover, where any perceptible lag reads as unresponsiveness. The 300ms ceiling is about *user-initiated state changes*, which are allowed slightly more room because something visibly changed. The 300 to 500ms band covers *layout transitions* such as a drawer or modal, which are not blocking a further input.

Use this resolution:

- **Direct feedback** — press, hover, tap: 120 to 180ms. Never above 200ms.
- **State change** — toggle, dropdown, tooltip, tab: 180 to 260ms. Never above 300ms.
- **Layout transition** — modal, drawer, accordion: up to 500ms, and only when it is not blocking the next input.
- **One earned entrance** per surface may run 500 to 800ms. Repeated page-load choreography is not earned.

The consistency rule outranks all of these. A single value reused everywhere beats a perfectly-tuned value used once.

---

## 6. REFERENCES AND RELATED RESOURCES

- [`interaction-craft.md`](interaction-craft.md) Section 6 — the implementation-level motion items: theme swaps, off-screen loops, smooth anchors.
- [`depth-and-detail.md`](depth-and-detail.md) Section 2 — the static light-source model that Solid Drawing extends into motion.
- [`review-checklist.md`](review-checklist.md) — how these rules surface in an audit pass.
