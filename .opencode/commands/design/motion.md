---
description: Animation, transitions, micro-interactions, AnimatePresence, reduced motion. sk-design motion mode.
argument-hint: "<component-state> [--library]"
allowed-tools: Read, Glob, Grep
---

# /design:motion

I want to design purposeful animation, transitions, or reduced-motion behavior for a component or state.

## 1. USER INTENT

This command serves that user job and owns these signals: "design motion behavior", "plan micro interactions", "specify animation states".

## 2. INTERNAL BINDING

Pin the `motion` mode of the `sk-design` parent hub to design purposeful animation and micro-interactions. The hub owns routing
across modes; this command loads the `motion` mode directly. If the request spans more
than `motion`, defer to the hub's routing instead of forcing this mode.

<!-- ANCHOR:sibling-discriminator -->
## 3. WHEN TO USE THIS, NOT A SIBLING

- **Use this command when** the request is to design purposeful animation, transitions, or reduced-motion behavior.
- **Prefer `/design:audit` when** the request is findings-first quality review, release scoring, or motion-performance assessment.
- **Prefer `/design:foundations` when** the request is static color, type, layout, responsive, or theme-token work.
- **Prefer `/design:interface` when** the request is to invent the full visual direction or interface concept first.
- **Prefer `/design:md-generator` when** the request is to capture measured CSS or tokens from a live site.
- **Defer to the `sk-design` hub when** the request is primarily static visual-system design, interface direction, audit scoring, or measured CSS extraction.
<!-- /ANCHOR:sibling-discriminator -->

## 4. PRECONDITIONS

- **Requires:** a component or state transition to animate, plus an optional animation library
- **Ask-first:** if that input is missing, emit `STATUS=ASK MISSING=<input>` and ask "Which component or state transition should the motion describe, and which library?" Do not run on a guess.
- **Cannot-run:** when no component or state transition is named to animate, stop with `STATUS=FAIL ERROR=<named-cause>`.
- **Escalate:** if the motion depends on an interface direction that has not been decided yet, return `STATUS=DEFER ROUTE=hub` rather than forcing the mode.
- **Route instead:** when the request is static visual-system design, interface direction, audit scoring, or measured CSS extraction, return `STATUS=DEFER ROUTE=hub`.

<!-- ANCHOR:register -->
## REGISTER

- **Pin with** `--register <brand|product>` at command entry. Default `auto` resolves the posture from a declared register field, then the task cue, then the surface in focus.
- **Postures:** Brand (design IS the product) allows choreography when it earns the moment. Product (design SERVES the product) keeps motion to state, feedback, loading, and view changes.
- **This command's dials:** `register`, `motionBudget`.
- **Ask-first:** when the register is unresolved or the surface is genuinely mixed, emit `STATUS=ASK MISSING_REGISTER` and ask "Is this a Brand surface (design IS the product) or a Product surface (design SERVES the product)?" Do not guess the posture.
<!-- /ANCHOR:register -->

## 5. INSTRUCTIONS

### Step 1: Load and apply the mode
- Read `.opencode/skills/sk-design/SKILL.md` -- the parent hub: routing table and the
  shared references under `shared/`.
- Read `.opencode/skills/sk-design/design-motion/SKILL.md` -- the `motion` mode contract
  -- and load its `references/` and assets as the work requires.
- Apply the `motion` mode to `$ARGUMENTS`, following its workflow and quality gates.

### Step 2: Return Status
- Success: `STATUS=OK PRODUCES="Motion Design Spec" NEXT=/design:interface,/design:foundations,/design:audit PROOF=componentState,motionPurpose,timingModel,reducedMotionPath`
- Missing input: `STATUS=ASK MISSING=<input>` plus the Ask-first question.
- Cannot run: `STATUS=FAIL ERROR=<named-cause>` with the cause named.
- Route instead: `STATUS=DEFER ROUTE=<hub|sibling>`.

## 6. EMIT DELIVERABLE

Emit `Motion Design Spec` as the primary deliverable.

Required fields:
- `componentState`
- `motionPurpose`
- `timingModel`
- `reducedMotionPath`

## 7. PIPELINE & HANDOFF

- **Stage:** behavior - specifies temporal behavior after direction or foundations and before audit or build.
- **Accepts from:** `/design:audit`, `/design:foundations`, `/design:interface`.
- **Produces:** Motion Design Spec, carrying `componentState`, `motionPurpose`, `timingModel`, `reducedMotionPath`.
- **Hands to next (recommend-only):** `/design:interface`, `/design:foundations`, `/design:audit` -- emitted as `NEXT=`, never auto-invoked.
- **Hands to build:** when accepted motion behavior moves to implementation, hand off to `sk-code` via the shared sk-code handoff card `.opencode/skills/sk-design/shared/sk_code_handoff.md`.
- **Recommend-only:** this command never silently chains; the user or the `sk-design` hub chooses the next step.

## 8. EXAMPLE

```
/design:motion modal-open-close --library framer-motion
```

Returns: a motion plan with purpose, timing, easing, interaction states, performance notes, and reduced-motion behavior

## TASK PROJECTIONS

No transform-verb projections own this mode. Transform verbs route to their owning mode, never to a new command.

**Negative corpus:** none of the design transform verbs is a `/design:<verb>` command.
