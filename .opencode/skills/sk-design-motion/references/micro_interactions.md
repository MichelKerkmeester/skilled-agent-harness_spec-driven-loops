---
title: Micro-Interactions And Delight
description: Interaction feedback, loading states, gestures, earned delight, copy boundaries, and morphing-icon rules.
trigger_phrases:
  - "micro interactions"
  - "interaction feedback"
  - "delight moments"
  - "morphing icons"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Micro-Interactions And Delight

Micro-interactions confirm that an action happened, explain state, and make the interface feel responsive. Delight is only useful when the moment earns it.

---

## 1. OVERVIEW

### Purpose

Design the small, local feedback that makes an interface feel alive and trustworthy, and decide when a moment earns added delight. This reference covers feedback patterns, loading states, gestures, delight boundaries, morphing-icon rules, and the implementation handoff snippet.

### When to Use

- Specifying hover, active, focus, loading, success, or error feedback for a control.
- Choosing loading and waiting treatments that preserve layout and set expectations.
- Deciding whether a success, milestone, or recovery moment earns delight.
- Defining morphing-icon behavior or handing motion intent to implementation.

---

## 2. Feedback Patterns

| State | Motion pattern | Notes |
| --- | --- | --- |
| Hover | small lift, color shift, shadow, icon cue | Must not be the only disclosure path. A lift such as `scale(1.05)` is a hover affordance, not a press. |
| Active | quick scale down then up, depressed shadow | Required, not optional: every interactive control needs an active/pressed state. Press scale stays in `0.95-1.0` (commonly `0.96`); never below `0.95`. |
| Focus | visible ring or path highlight | Keyboard parity required. |
| Loading | skeleton, progress, optimistic state | Explain what is happening when waits are long. |
| Success | checkmark, gentle pulse, brief celebration | Reserve confetti for real milestones. |
| Error | local shake or color/icon shift | Do not punish; pair with clear copy. |

Interactive controls REQUIRE an active/pressed state; a hover-only control fails physics expectations. Press feedback scales down into the `0.95-1.0` range (`0.96` is a good default) and never below `0.95`, which reads as exaggerated. The `1.05` value belongs to a hover lift, not a press.

### Animation Mechanism

- Use CSS transitions for interactive state changes (hover, active, focus, toggle). They can be interrupted mid-animation, so a user who reverses an action gets an immediate response instead of waiting for a keyframe sequence to finish.
- Reserve keyframes (`@keyframes`, one-shot Motion sequences) for staged sequences that run once, such as a success flourish or an entrance.
- For springs on most UI and icon motion, set `bounce: 0` (for example `transition: { type: "spring", duration: 0.3, bounce: 0 }`). Keep overshoot only when an element should physically settle; default icon and control springs should not bounce.

## 3. Loading And Waiting

- Skeletons preserve layout and reduce perceived wait.
- Progress bars should be determinate when progress is knowable.
- Loading copy must be product-specific: `Syncing your team's changes...`, not generic jokes.
- For waits above a few seconds, set expectations or provide cancel/escape.

## 4. Gestures

- Drag states need lift, target feedback, and rollback/undo when meaningful.
- Swipe actions need thresholds and visible alternatives.
- Touch interactions need 44 by 44 pixel targets and spacing.
- Gesture-only actions need accessible alternatives.

## 5. Delight Boundaries

Delight belongs at success, first-time action, empty state, milestone, or error recovery. It should be quick, appropriate, and optional. If users notice the delight more than their task, it has gone too far.

Never:
- Delay the core action for delight.
- Use humor in critical errors.
- Add celebration to routine low-value actions.
- Play sound without respecting system settings and mute controls.
- Repeat the same flourish until it becomes noise.

## 6. Morphing Icons

Use morphing icons only when transformation communicates state continuity, such as menu to close, plus to cross, arrow direction, or play to pause.

Rules distilled from the corpus:
- Every icon in a morphing set uses exactly three SVG lines.
- Icons needing fewer lines collapse extras to invisible center points.
- All icons share one viewBox, commonly `14x14`.
- Rotational variants share base lines and a group.
- Grouped rotations may animate; unrelated rotations jump instantly.
- Lines use `strokeLinecap="round"`.
- Decorative icon SVGs are `aria-hidden="true"`; the control carries the accessible name.
- Reduced motion sets transition duration to zero or swaps instantly.

## 7. Handoff Snippet

When handing to implementation, include:

```text
Motion purpose: feedback / orientation / focus / continuity / delight
Trigger state: default -> hover -> active -> loading -> success/error
Timing: <duration> and <easing/spring>
Properties: transform/opacity/etc.
Reduced motion: <alternate behavior>
Performance risk: <none / bounded paint / FLIP / scroll>
```
