---
description: Distinctive, intentional UI design: direction, palette, type, layout, motion. sk-design interface mode.
argument-hint: "<target> [--mode]"
allowed-tools: Read, Glob, Grep
---

# /design:interface

I want to invent or reshape a distinctive interface direction for a surface.

## 1. USER INTENT

This command serves that user job and owns these signals: "shape interface direction", "redesign ui surface", "make ui distinctive".

## 2. INTERNAL BINDING

Pin the `interface` mode of the `sk-design` parent hub to build or reshape a distinctive, intentional interface. The hub owns routing
across modes; this command loads the `interface` mode directly. If the request spans more
than `interface`, defer to the hub's routing instead of forcing this mode.

## 3. INTERFACE TASK LANES

Pick the lane that matches the request; if none fits, defer to the `sk-design` hub.

- **direction** (default) -- invent a distinctive interface direction.
- **directions** (`--mode directions`) -- produce debiased options.
- **redesign** (`--mode redesign`) -- reshape an existing surface.
- **preflight** (`--mode preflight`) -- run the pre-ship mechanical gate.
- **handoff** (`--mode build`) -- run the real UI loop and emit the sk-code handoff manifest.
- **aesthetic** (`--mode aesthetic`) -- name a realized look.
- **quality** is not owned here; route accessibility, contrast, scoring, and hardening to `/design:audit`.
- **register**, **copy-gate**, **grounding**, and **reference** are internal or hidden lanes; they run inside the workflow and are not surfaced and not selectable tasks.

<!-- ANCHOR:sibling-discriminator -->
## 4. WHEN TO USE THIS, NOT A SIBLING

- **Use this command when** the request is to invent or reshape a distinctive interface direction.
- **Prefer `/design:audit` when** the request is findings-first review, accessibility, performance, scoring, or production hardening.
- **Prefer `/design:foundations` when** the request is static token work: color, typography, layout, spacing, responsive adaptation, or theming.
- **Prefer `/design:md-generator` when** the request is extracting a live site's measured CSS into DESIGN.md.
- **Prefer `/design:motion` when** the request is animation choreography, transitions, micro-interactions, or reduced-motion behavior.
- **Defer to the `sk-design` hub when** the request is primarily static tokens, motion behavior, audit findings, or measured CSS extraction.
<!-- /ANCHOR:sibling-discriminator -->

## 5. PRECONDITIONS

- **Requires:** an interface target (surface, screen, or component set) plus the register and any mode hint
- **Ask-first:** if that input is missing, emit `STATUS=ASK MISSING=<input>` and ask "Which interface surface, and is this Brand or Product register?" Do not run on a guess.
- **Cannot-run:** when no interface target is named to shape, stop with `STATUS=FAIL ERROR=<named-cause>`.
- **Escalate:** if the register is genuinely mixed or unresolved and changes the design dials, return `STATUS=DEFER ROUTE=hub` rather than forcing the mode.
- **Route instead:** when the request is primarily static tokens, motion behavior, audit findings, or measured CSS extraction, return `STATUS=DEFER ROUTE=hub`.

<!-- ANCHOR:register -->
## REGISTER

- **Pin with** `--register <brand|product>` at command entry. Default `auto` resolves the posture from a declared register field, then the task cue, then the surface in focus.
- **Postures:** Brand (design IS the product) gives the interface room for expression, identity, and a memorable move. Product (design SERVES the product) keeps the interface dense, predictable, and task-led.
- **This command's dials:** `register`, `density`, `motionBudget`, `colorStrategy`.
- **Ask-first:** when the register is unresolved or the surface is genuinely mixed, emit `STATUS=ASK MISSING_REGISTER` and ask "Is this a Brand surface (design IS the product) or a Product surface (design SERVES the product)?" Do not guess the posture.
<!-- /ANCHOR:register -->

## 6. INSTRUCTIONS

### Step 1: Load and apply the mode
- Read `.opencode/skills/sk-design/SKILL.md` -- the parent hub: routing table and the
  shared references under `shared/`.
- Read `.opencode/skills/sk-design/design-interface/SKILL.md` -- the `interface` mode contract
  -- and load its `references/` and assets as the work requires.
- Apply the `interface` mode to `$ARGUMENTS`, following its workflow and quality gates.

### Step 2: Return Status
- Success: `STATUS=OK PRODUCES="Interface Direction Spec" NEXT=/design:foundations,/design:motion,/design:audit PROOF=target,register,designDials,preflightResult`
- Missing input: `STATUS=ASK MISSING=<input>` plus the Ask-first question.
- Cannot run: `STATUS=FAIL ERROR=<named-cause>` with the cause named.
- Route instead: `STATUS=DEFER ROUTE=<hub|sibling>`.

## 7. EMIT DELIVERABLE

Emit `Interface Direction Spec` as the primary deliverable.

Required fields:
- `target`
- `register`
- `designDials`
- `preflightResult`

## 8. PIPELINE & HANDOFF

- **Stage:** direction - frames the interface decision before static systems, behavior, audit, or build.
- **Accepts from:** `/design:audit`, `/design:foundations`, `/design:md-generator`, `/design:motion`.
- **Produces:** Interface Direction Spec, carrying `target`, `register`, `designDials`, `preflightResult`.
- **Hands to next (recommend-only):** `/design:foundations`, `/design:motion`, `/design:audit` -- emitted as `NEXT=`, never auto-invoked.
- **Hands to build:** when the accepted interface direction moves to implementation, hand off to `sk-code` via the shared sk-code handoff card `.opencode/skills/sk-design/shared/sk_code_handoff.md`.
- **Recommend-only:** this command never silently chains; the user or the `sk-design` hub chooses the next step.

## 9. EXAMPLE

```
/design:interface dashboard-shell --mode redesign
```

Returns: a deliberate interface direction with rationale, visual choices, critique, and handoff notes
