---
title: Advanced Motion Craft
description: Compact guidance for origin-aware popovers, instant follow-up tooltips, CSS entry patterns, slow-motion debugging and shorthand caveats.
trigger_phrases:
  - "advanced motion craft"
  - "origin-aware popovers"
  - "instant follow-up tooltips"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Advanced Motion Craft

Use this for small interaction details where the standard strategy, micro-interaction and performance references are too broad. This is a craft top-up, not permission to add more motion.

---

## 1. OVERVIEW

### Purpose

Provides compact craft guidance for nuanced motion details such as origin-aware popovers, tooltip timing, CSS entry patterns, slow-motion debugging, shorthand limits, and ambitious effects.

### When to Use

Use when a motion decision is too specific for the standard strategy, micro-interaction, or performance references but still needs a bounded interaction contract.

### Core Principle

Advanced motion earns its place only when it clarifies origin, state, timing, or task flow while preserving performance and reduced-motion behavior.

---

## 2. ORIGIN-AWARE POPOVERS

Popover motion should start from the trigger's perceived origin.

- Menus, command palettes and contextual popovers scale or slide from the trigger edge.
- Tooltips can fade with a slight directional offset from the anchor.
- Drawers move from the edge that owns them.
- Modals are exempt. They usually belong to the viewport center or the task boundary, not the trigger.

Use transform origin and anchor geometry so motion explains where the surface came from. Do not animate layout properties just to fake origin.

## 3. INSTANT FOLLOW-UP TOOLTIPS

The first tooltip in a cluster may wait. Follow-up tooltips should be immediate while the pointer stays inside the same tool zone.

Suggested behavior:

- Initial delay: `350-600ms`.
- Follow-up delay: `0-80ms` while the cluster remains warm.
- Close delay: `80-150ms` to forgive tiny pointer slips.
- Reset warm state after `600-1000ms` outside the cluster.

This prevents flicker and repeated waiting while still avoiding accidental tooltip noise.

## 4. `@starting-style` ENTRY PATTERN

For CSS-only mounted entries, prefer `@starting-style` when browser support fits the project.

```css
.popover {
  opacity: 1;
  transform: translateY(0) scale(1);
  transition: opacity 160ms ease, transform 160ms ease;
}

@starting-style {
  .popover {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
  }
}
```

Use this instead of mounted-state hacks when the element is inserted already open. Keep a no-motion state for reduced motion.

## 5. SLOW-MOTION DEBUGGING

When a transition feels wrong, slow it down by a factor of 4 to 8.

Check:

- Does the motion start from the right origin?
- Does it overshoot or delay the user's task?
- Does exit feel faster than enter?
- Does focus move before, during or after the visual state?
- Does reduced motion preserve the state change?

If the slow version looks decorative or confusing, the fast version is hiding the same defect.

## 6. FRAMER MOTION SHORTHAND UNDER LOAD

Framer Motion shorthand is fine for small, isolated interactions. Under load, it can hide too much.

Avoid shorthand when:

- A list has many animated children.
- Layout changes and opacity changes are tied together.
- `mode="wait"` doubles perceived latency.
- The stack already uses CSS or another animation system for the same surface.

Prefer explicit variants, stable keys, bounded properties and a named reduced-motion path. If the shorthand makes ownership unclear, write the longer version.

## 7. HIGH-AMBITION EFFECTS

When an effect is ambitious, expensive, or meant to feel technically extraordinary, propose it before building.

The proposal must name:

- The effect and the user moment it serves.
- The materials involved: transform, opacity, mask, blur, filter, canvas, WebGL, View Transitions or another mechanism.
- The performance budget: target devices, frame-rate expectation, maximum duration, off-screen behavior and the properties that must stay compositor-safe.
- The reduced-motion fallback that preserves the same state information without the spectacle.

Do not silently ship a heavy effect because it looks impressive. The higher the ambition, the more explicit the motion contract needs to be.
