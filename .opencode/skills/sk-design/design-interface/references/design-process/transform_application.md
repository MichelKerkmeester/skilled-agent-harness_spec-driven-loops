---
title: "Transform Application"
description: "Interface-owned lane for applying bolder, quieter, distill, clarify and delight requests after the hub routes a make-it transform prompt to interface."
trigger_phrases:
  - "make it bolder"
  - "make it quieter"
  - "make it distill"
  - "make it clarify"
  - "make it delight"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Transform Application

This is the interface-side landing lane for transform verbs. It applies a requested change to an interface surface after the hub has already selected `interface`. It does not decide whether the change is warranted; that is an audit question.

Read this with `design_principles.md` and `brief_to_dials.md`. The transform still has to be grounded in the subject, register, density, motion budget and the surface's single job.

---

## 1. Routing Rule

Use the framing to break the audit/interface tie.

| Framing | Route | Meaning |
|---|---|---|
| `make it ...` | interface | Apply the transform with restraint and prove what changed. |
| `should it be ...` | audit | Judge whether the transform is the right remedy before changing direction. |

`clarify` is an interface alias only. It has no command-surface projection yet. `typeset` and `colorize` stay foundations-owned, while `harden` and `polish` stay audit-owned.

---

## 2. Shared Application Contract

Every transform uses the same proof shape.

| Field | Requirement |
|---|---|
| Keep ledger | Name what must survive: primary task, brand cue, existing component affordance, accessibility or content constraint. |
| Remove ledger | Name what gets cut or reduced: visual noise, timid hierarchy, redundant copy, decoration, excess motion or ambiguity. |
| Before/after | State the current read and the intended read in one sentence each. |
| Earned moment | Add or preserve one memorable move only when it helps the surface's job. |
| Reduced motion | Any new motion has a reduced-motion path; decorative motion can be removed entirely. |
| Opt-out | If the transform would harm comprehension, accessibility, brand constraints or product trust, say so and route to audit or foundations instead. |

Do not expose sliders, vibe controls or style presets. The verb is a work request, not a user-facing dial.

---

## 3. Verb Lanes

### Bolder

**Intent:** Increase commitment and hierarchy without adding generic drama.

| Ledger | Guidance |
|---|---|
| Keep | The surface's main job, the clearest existing affordance and any brand cue that already feels specific. |
| Remove | Medium-everything hierarchy, timid contrast, generic card rhythm, unused whitespace that weakens focus. |
| Before/after | Before: the surface feels competent but forgettable. After: one priority is unmistakable and the visual stance is more committed. |
| Earned moment | One stronger focal move: scale contrast, type treatment, image crop, layout interruption or color commitment. |
| Reduced motion | Prefer static hierarchy first. If motion helps, keep it brief and compositable, with no-motion parity. |
| Opt-out | Do not make dense product work theatrical, shout over critical content or solve blandness with effects. |

### Quieter

**Intent:** Lower intensity while keeping the point of view.

| Ledger | Guidance |
|---|---|
| Keep | The signature cue, primary action, readable contrast and the brand/product register. |
| Remove | Competing accents, heavy backgrounds, stacked shadows, decorative animation and repeated emphasis. |
| Before/after | Before: too many elements demand attention. After: the surface has a clearer resting state and one deliberate point of focus. |
| Earned moment | Keep one calm signature detail rather than flattening everything to neutral. |
| Reduced motion | Cut ambient motion first; interaction feedback can stay if it explains state. |
| Opt-out | Do not erase useful hierarchy, accessibility contrast or brand recognition in the name of calm. |

### Distill

**Intent:** Reduce the surface to the few decisions that matter.

| Ledger | Guidance |
|---|---|
| Keep | The primary user goal, required controls, legal or safety copy and state cues people need to act. |
| Remove | Duplicate labels, redundant cards, competing secondary actions, decorative containers and unnecessary copy. |
| Before/after | Before: the surface asks the user to sort too much. After: the next action and supporting context are obvious. |
| Earned moment | The memorable move should come from clarity: a tighter sequence, a sharper reveal or a stronger empty state. |
| Reduced motion | Use motion only to explain disclosure or state change; otherwise prefer structural simplification. |
| Opt-out | Do not remove needed capability, error recovery or comparison detail from product workflows. |

### Clarify

**Intent:** Make meaning, order and action easier to understand.

| Ledger | Guidance |
|---|---|
| Keep | Domain language users recognize, the information scent, current navigation promises and required states. |
| Remove | Clever labels, ambiguous grouping, mixed action names, unexplained icons and visual hierarchy that fights the content. |
| Before/after | Before: the user can see the pieces but not the path. After: labels, order and emphasis tell the same story. |
| Earned moment | A small structural cue can be memorable when it explains the domain: a timeline, grouped proof, map, ruler or status grammar. |
| Reduced motion | Motion may clarify cause and effect, but the same relationship must be visible without animation. |
| Opt-out | Do not rename domain terms into generic copy or over-explain a surface that is already obvious. |

### Delight

**Intent:** Add an earned moment that makes the surface feel cared for.

| Ledger | Guidance |
|---|---|
| Keep | Task speed, accessibility, trust cues and the surface's main tone. |
| Remove | Random decoration, novelty that slows the path, celebratory motion on routine actions and mood without information. |
| Before/after | Before: the surface works but has no felt craft. After: one moment rewards attention without stealing it. |
| Earned moment | Tie the moment to the subject or a meaningful state: completion, reveal, empty state, progress, hover, transition or illustration. |
| Reduced motion | Delight must degrade to a static or instant state with the same information. |
| Opt-out | Do not add delight to destructive actions, errors, dense decision points or accessibility-sensitive paths. |

### Applied-Transform Proof Cards

These are the fillable proof artifacts for applied `distill`, `clarify` and `delight` transforms. Fill one card for the real surface being changed. The lane named on the card supplies the guidance; the Shared Application Contract supplies the field meanings.

Shape check only: a filled card has a keep-ledger row, a remove-ledger row, a before line and an after line. Whether the choices and earned moment are right remains an audit judgment.

#### Proof Card - Distill

Guidance lane: `Distill`. Contract: `Shared Application Contract`.

Surface/job: `__________`

| Field | Record for this surface |
|---|---|
| Keep ledger | `__________` |
| Remove ledger | `__________` |
| Before | `__________` |
| After | `__________` |
| Earned moment | `__________` |
| Reduced motion | `__________` |
| Opt-out | `__________` |

#### Proof Card - Clarify

Guidance lane: `Clarify`. Contract: `Shared Application Contract`.

Surface/job: `__________`

| Field | Record for this surface |
|---|---|
| Keep ledger | `__________` |
| Remove ledger | `__________` |
| Before | `__________` |
| After | `__________` |
| Earned moment | `__________` |
| Reduced motion | `__________` |
| Opt-out | `__________` |

#### Proof Card - Delight

Guidance lane: `Delight`. Contract: `Shared Application Contract`.

Surface/job: `__________`

| Field | Record for this surface |
|---|---|
| Keep ledger | `__________` |
| Remove ledger | `__________` |
| Before | `__________` |
| After | `__________` |
| Earned moment | `__________` |
| Reduced motion | `__________` |
| Opt-out | `__________` |

---

## 4. Gold Prompts

These prompts anchor the hub route.

| Prompt | Expected route |
|---|---|
| `make it bolder` | interface |
| `should it be bolder` | audit |
| `make it quieter` | interface |
| `should it be quieter` | audit |
| `make it distill` | interface |
| `should it be distill` | audit |
| `make it clarify` | interface |
| `should it be clarify` | audit |
| `make it delight` | interface |
| `should it be delight` | audit |

The interface arm proves the alias. The audit arm proves the frame: a question about whether the transform is appropriate belongs to audit before any application work begins.
