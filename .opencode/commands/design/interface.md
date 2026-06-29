---
description: Distinctive, intentional UI design: direction, palette, type, layout, motion. sk-design interface mode.
argument-hint: "<target> [--mode]"
allowed-tools: Read, Glob, Grep
---

# /design:interface

Thin bridge into the `sk-design` parent skill's `interface` mode.

## 1. PURPOSE

Pin the `interface` mode of the `sk-design` parent hub to build or reshape a distinctive, intentional interface. The hub owns routing
across modes; this command loads the `interface` mode directly. If the request spans more
than `interface`, defer to the hub's routing instead of forcing this mode.

<!-- ANCHOR:sibling-discriminator -->
## 2. WHEN TO USE THIS, NOT A SIBLING

- **Use this command when** the request is to invent or reshape a distinctive interface direction.
- **Prefer `/design:audit` when** the request is findings-first review, accessibility, performance, scoring, or production hardening.
- **Prefer `/design:foundations` when** the request is static token work: color, typography, layout, spacing, responsive adaptation, or theming.
- **Prefer `/design:md-generator` when** the request is extracting a live site's measured CSS into DESIGN.md.
- **Prefer `/design:motion` when** the request is animation choreography, transitions, micro-interactions, or reduced-motion behavior.
- **Defer to the `sk-design` hub when** the request is primarily static tokens, motion behavior, audit findings, or measured CSS extraction.
<!-- /ANCHOR:sibling-discriminator -->

## 3. PRECONDITIONS

- **Requires:** an interface target (surface, screen, or component set) plus the register and any mode hint
- **Ask-first:** if that input is missing, emit `STATUS=ASK MISSING=<input>` and ask "Which interface surface, and is this Brand or Product register?" Do not run on a guess.
- **Cannot-run:** when no interface target is named to shape, stop with `STATUS=FAIL ERROR=<named-cause>`.
- **Escalate:** if the register is genuinely mixed or unresolved and changes the design dials, return `STATUS=DEFER ROUTE=hub` rather than forcing the mode.
- **Route instead:** when the request is primarily static tokens, motion behavior, audit findings, or measured CSS extraction, return `STATUS=DEFER ROUTE=hub`.

## 4. INSTRUCTIONS

### Step 1: Load and apply the mode
- Read `.opencode/skills/sk-design/SKILL.md` -- the parent hub: routing table and the
  shared references under `shared/`.
- Read `.opencode/skills/sk-design/design-interface/SKILL.md` -- the `interface` mode contract
  -- and load its `references/` and assets as the work requires.
- Apply the `interface` mode to `$ARGUMENTS`, following its workflow and quality gates.

### Step 2: Return Status
- Success: `STATUS=OK`
- Missing input: `STATUS=ASK MISSING=<input>` plus the Ask-first question.
- Cannot run: `STATUS=FAIL ERROR=<named-cause>` with the cause named.
- Route instead: `STATUS=DEFER ROUTE=<hub|sibling>`.

## 5. EMIT DELIVERABLE

Emit `Interface Direction Spec` as the primary deliverable.

Required fields:
- `target`
- `register`
- `designDials`
- `preflightResult`

## 6. EXAMPLE

```
/design:interface dashboard-shell --mode redesign
```

Returns: a deliberate interface direction with rationale, visual choices, critique, and handoff notes
