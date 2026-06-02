---
title: "Motion.dev Animation Principles"
description: "Design-principle layer for Motion.dev: timing, easing, stagger direction, anticipation, overshoot, arc, depth, and visual verification cues."
---

# Motion.dev Animation Principles

Design-principle layer for Motion.dev: timing, easing, stagger direction, anticipation, overshoot, arc, depth, and visual verification cues.

Attribution: Adapted from `Schmandarine/web-motion-skill` (MIT), especially its web-adapted 12 principles and frame-by-frame animation review workflow.

---

## 1. OVERVIEW

### Core Principle

Use Motion.dev APIs to express motion with perceived weight, timing, and direction, not just to move pixels between two states.

### Purpose

The other Motion.dev references explain API shape, imports, scroll, gestures, performance, and tool selection. This reference fills the design layer: how an animation should feel, which timing/easing/stagger vocabulary to use, and what to inspect when motion feels robotic, abrupt, or inconsistent.

### When to Use

- You need to choose a duration, easing curve, stagger direction, or overshoot amount.
- A Motion.dev animation works technically but feels too linear, abrupt, slow, robotic, or weightless.
- You are translating GSAP/CSS motion-design language into Motion.dev `animate()`, `scroll()`, `inView()`, and `stagger()` patterns.
- You need a compact checklist for visual review beyond console-clean/browser-loaded verification.

### Key Sources

- Mined design source: `Schmandarine/web-motion-skill` (MIT), `SKILL.md` and `README.md`.
- Motion stagger API: https://motion.dev/docs/stagger
- Existing sk-code API refs: [`animate_and_timelines.md`](./animate_and_timelines.md), [`scroll_and_gestures.md`](./scroll_and_gestures.md), [`performance_and_pitfalls.md`](./performance_and_pitfalls.md).

---

## 2. MOTION VOCABULARY

Use a small vocabulary per product and repeat it. Mixed easing families on the same component make the object feel like it changes mass mid-motion.

| Motion intent | Use | Motion.dev options |
|---|---|---|
| Immediate feedback | Button press, focus response, tap affordance | `duration: 0.1` to `0.15`, `ease: "easeOut"`, press scale around `0.95` to `0.98` |
| Standard UI transition | Dropdown, tooltip, tab, small card state | `duration: 0.2` to `0.3`, `ease: [0.22, 1, 0.36, 1]` |
| Meaningful entrance/exit | Modal enter, section reveal, page-area transition | `duration: 0.4` to `0.6`, `ease: [0.4, 0, 0.2, 1]` or `[0.16, 1, 0.3, 1]` |
| Emphasis/storytelling | Hero sequence, scroll reveal, brand moment | `duration: 0.6+`, staged sequence segments, deliberate dwell |
| Playful settle | Badge pop, expressive card, loader | `spring()` / spring transition with visible but bounded overshoot |

Motion durations are seconds in `animate()` options. Keep reduced-motion fallbacks near-instant, usually `duration: 0.01`, with opacity-only or final-state keyframes.

---

## 3. EASING AS PERCEIVED PHYSICS

Linear input does not feel physical by default. Scroll progress, pointer movement, and programmatic state changes are mechanically linear; easing is the transfer function that makes motion appear to accelerate from rest and decelerate back to rest.

| Feel | Use when | Motion.dev equivalent |
|---|---|---|
| Natural in/out mass | Object enters and settles, or exits while deceleration happens off-screen | `ease: [0.4, 0, 0.2, 1]` |
| Smooth deceleration | General UI reveal, hover settle, standard card entrance | `ease: [0.22, 1, 0.36, 1]` |
| Emphatic premium entrance | Hero reveal or large section motion that should feel deliberate | `ease: [0.16, 1, 0.3, 1]` |
| Immediate response | Press/hover/focus feedback | `ease: "easeOut"`, `duration: 0.1` to `0.2` |
| Throw/launch | Element accelerates away from the user | use a shorter segment with stronger ease-in, then settle or remove off-screen |
| Bounce/elastic | Playful UI only | use spring transition or `spring()` with bounded bounce; avoid for rigid/professional UI |

Do not animate the same property through overlapping Motion controls unless interruption is intentional and tested. Competing opacity, transform, or scroll-linked controls are a common reason an animation jumps between frames.

---

## 4. STAGGER, FOLLOW-THROUGH, AND STAGING

Groups should not start and stop on the same frame. Stagger creates follow-through and directs the user's eye.

| Pattern | Motion.dev delay | Use |
|---|---|---|
| Reading-order entrance | `delay: stagger(0.06)` to `stagger(0.1)` | Cards, nav items, body copy, list entrances |
| Reverse-led entrance | `delay: stagger(0.08, { from: "last" })` | Elements entering from below/left when the last DOM item should start first |
| Center-out reveal | `delay: stagger(0.05, { from: "center" })` | Radial, grid, or badge-like effects where center focus matters |
| Outgoing group | `delay: stagger(0.05, { from: "first" })` | First visible item leads the exit, then the group follows |
| Weighted stagger | `delay: stagger(0.08, { ease: [0.22, 1, 0.36, 1] })` | Wave-like timing that accelerates/decelerates across the group |

Stage content in priority order: headline first, supporting copy second, primary action last. If six things move at once, the animation is usually competing with its own message.

```js
import { animate, stagger } from "motion";

animate(
  "[data-reveal-item]",
  { opacity: [0, 1], y: [18, 0] },
  {
    delay: stagger(0.08, { from: "first" }),
    duration: 0.45,
    ease: [0.22, 1, 0.36, 1],
  },
);
```

---

## 5. ANTICIPATION, OVERSHOOT, AND SECONDARY ACTION

Anticipation is a small preparatory motion in the opposite direction before the main action. It should read subconsciously, not like a second feature.

| Principle | Guardrail | Motion.dev expression |
|---|---|---|
| Anticipation scale | `0.05` to `0.1` scale delta | press or pre-reveal `scale: [0.96, 1]` to `scale: [0.9, 1]` only for expressive UI |
| Anticipation rotation | `3deg` to `8deg` | tiny handle/card tilt before opening or launching |
| Overshoot | `10%` to `15%` beyond target | spring/back-style settle; calibrate to product personality |
| Secondary action | lower contrast than primary | icon rotate, shadow lift, checkmark draw, or text fade supporting the main movement |

Use squash/stretch only when the component can feel flexible or playful. Buttons, badges, and loaders can tolerate it; forms, nav, legal, and professional UI often should not.

---

## 6. ARC AND DEPTH

Straight diagonal motion often looks mechanical. Natural movement tends to curve and has depth cues.

| Goal | Motion.dev pattern |
|---|---|
| Curved diagonal path | Sequence or keyframe `x` and `y` with slightly different durations/eases so the trajectory bends. |
| Thrown card | Combine `x`, `y`, and `rotate` with stronger exit easing; keep the card visible long enough to read the trajectory. |
| Parallax depth | Use `scroll()` to move foreground faster than background, with reduced-motion fallback. |
| Hover depth | Pair `scale` with shadow, `z-index`, or subtle `rotateX/Y`; keep transform-origin and perspective consistent. |
| Layered entrance | Larger/foreground elements can move slightly farther or settle later, but do not let decoration outrank content. |

For scroll-linked animation, reserve scroll range for phases: incoming motion, dwell, outgoing motion. If the visible dwell lasts only a few frames, the animation will feel like it exits before the user can perceive it.

---

## 7. VISUAL REVIEW CHECKLIST

When an animation feels wrong but code and console checks pass, inspect the motion itself.

| Question | What to inspect |
|---|---|
| Does it start or stop abruptly? | Easing may be too linear or a segment may be too short. |
| Do items arrive on the same frame? | Add or reverse stagger direction. |
| Is the user's eye guided to the right content? | Stage headline/copy/action instead of animating everything together. |
| Does it feel weightless? | Add slow in/out, anticipation, or a slightly longer settle. |
| Does it feel laggy? | Reduce duration, remove smooth-scroll lag, or avoid excessive scroll scrub smoothing. |
| Does it jump between frames? | Check for overlapping animations on the same property or layout reads/writes mid-animation. |
| Is it clipped? | Check parent overflow during arc/scatter/exit movement. |

For frame-level verification, see [`performance_and_pitfalls.md`](./performance_and_pitfalls.md). The key method is: capture the animation, extract frames, build a labelled contact sheet, identify entrance/dwell/exit windows, drill into the suspect frames, then re-run after the fix.

---

## 8. RELATED RESOURCES

- [`animate_and_timelines.md`](./animate_and_timelines.md) - `animate()` API shape, sequences, transition options.
- [`scroll_and_gestures.md`](./scroll_and_gestures.md) - `scroll()`, `inView()`, hover, press, drag-adjacent behavior.
- [`performance_and_pitfalls.md`](./performance_and_pitfalls.md) - reduced motion, compositing, CWV risk, visual verification escalation.
- [`decision_matrix.md`](./decision_matrix.md) - CSS vs Motion.dev vs GSAP vs WAAPI selection.
- Snippet: `assets/motion_dev/snippets/principled_reveal.js`.
