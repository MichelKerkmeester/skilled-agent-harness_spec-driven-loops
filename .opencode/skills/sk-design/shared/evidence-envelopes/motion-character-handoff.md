---
title: Motion Character Handoff
description: Semantic motionCharacter envelope that selects existing sk-design timing and easing bands and requires interruption, reversal, async, and reduced-motion proof.
trigger_phrases:
  - "motion character handoff"
  - "quiet snappy elastic static first"
  - "motion interruption reversal async proof"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Motion Character Handoff

`motionCharacter` communicates temporal intent from an upstream design decision to the Motion owner. It never creates a duration, easing, spring, or theme token. Motion still chooses exact behavior from the existing timing bands and easing rules in `design-motion/references/motion-strategy.md` after the restraint gate passes.

## 1. SEMANTIC ENUM

```ts
type MotionCharacter = 'quiet' | 'snappy' | 'elastic' | 'static-first';
```

| Value | Existing timing bands | Existing easing/material rules | Constraint |
|---|---|---|---|
| `quiet` | `100-150ms` for earned local feedback; `200-300ms` for necessary state changes | Deceleration on arrival, ease-in on exit; opacity/color before travel | Remove choreography and large movement; omission is valid. |
| `snappy` | Use the responsive end of `100-150ms` feedback and `200-300ms` state-change bands | Existing ease-out curves for arrival and ease-in for exit | User-initiated feedback stays below `300ms`; speed cannot hide missing states. |
| `elastic` | `200-300ms` for state changes or `300-500ms` for layout transitions, selected by the interaction's job | Spring only when physical overshoot-and-settle is justified; otherwise use existing deceleration curves | The name does not authorize default bounce, a duration multiplier, or decorative overshoot. |
| `static-first` | Instant for keyboard, high-frequency, dense, or comprehension-sensitive paths; `100-150ms` only for an earned non-moving cue | Instant state, color, focus, or opacity feedback | Movement is opt-in and must survive the restraint gate. |

The existing `500-800ms` entrance band remains available only for one earned brand or entrance moment. No `motionCharacter` value selects it automatically.

## 2. HANDOFF SHAPE

```json
{
  "motionCharacter": "snappy",
  "rationale": "Frequent pointer-driven controls need immediate local feedback.",
  "timingBand": "100-150ms",
  "easingBand": "ease-out arrival / ease-in exit",
  "states": ["default", "hover", "active", "pending", "success", "error"],
  "interruption": "mid-flight input retargets from the current visual state",
  "reversal": "opposite input reverses immediately without waiting for completion",
  "asyncProof": "pending, resolve, reject, retry, cancel, and rollback scenarios recorded",
  "reducedMotion": "same state semantics with movement removed"
}
```

`timingBand` and `easingBand` cite existing Motion guidance. They do not mint aliases or write to the token vocabulary. Exact implementation values remain locked only after the Motion owner selects them for the target interaction.

## 3. INTERRUPTION AND REVERSAL PROOF

| Proof | Required evidence |
|---|---|
| Interruption | Rapid repeated input retargets from the current rendered state. Interactive state changes use interruptible transitions; one-shot keyframes are reserved for non-reversible sequences. |
| Reversal | Pointer leave, toggle reversal, dismissal, or cancellation responds immediately. Exit uses the corresponding existing ease-in rule and is normally shorter than entry rather than waiting for entry to finish. |
| Hover/focus parity | Hover never carries the only disclosure. Pointer hover is capability-gated, focus-visible feedback is immediate, and active feedback remains distinct. |
| Delayed affordance | When a tooltip delay is applicable, the existing initial/follow-up/close-delay guidance is used, timers clear on reversal, and keyboard focus does not inherit pointer waiting. |
| Reduced motion | The state change, focus, progress, success, and error meanings remain available with travel, scaling, shimmer, and decorative loops removed. |

Proof must exercise at least normal completion, rapid reversal before completion, repeated retriggering, keyboard access, and the reduced-motion path.

## 4. ASYNC AND ROLLBACK PROOF

Async work is specified as a state machine before animation is chosen. Record `idle`, `pending`, `success`, `error`, `retrying`, `cancelled`, and `disabled` when applicable, together with the events, guards, impossible combinations, entry actions, exit actions, and visible UI for each state.

An optimistic transition is ready only when:

- the prior committed state is retained until the operation resolves;
- rejection, timeout, or cancellation restores that state without an unrelated animation;
- pending work cannot display success and error simultaneously;
- retry starts from a defined state and duplicate submission is guarded;
- user input and recovery controls survive failure;
- progress or status remains perceivable without motion; and
- late responses cannot overwrite a newer user action.

Required scenarios are fast success, sustained pending, rejection with rollback, retry after rejection, cancellation, duplicate trigger, reversed intent while pending, and reduced motion. Each scenario records expected state, visible output, and the observed result.

## 5. AUTHORITY BOUNDARY

- Upstream design may select `motionCharacter` and explain why.
- Motion owns the restraint gate, timing band, easing/material, interruption model, and reduced-motion equivalent.
- Implementation receives exact locked values only through the normal sk-code handoff.
- Measured `DESIGN.md` output must not infer `motionCharacter`; it reports only captured `MotionSystem` evidence.

This contract is independently authored from the research syntheses. It copies no theme table, multiplier, token block, or fixed animation recipe.

