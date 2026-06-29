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

## 3. INSTRUCTIONS

### Step 1: Load and apply the mode
- Read `.opencode/skills/sk-design/SKILL.md` -- the parent hub: routing table and the
  shared references under `shared/`.
- Read `.opencode/skills/sk-design/design-interface/SKILL.md` -- the `interface` mode contract
  -- and load its `references/` and assets as the work requires.
- Apply the `interface` mode to `$ARGUMENTS`, following its workflow and quality gates.

### Step 2: Return Status
- Success: `STATUS=OK`
- Failure: `STATUS=FAIL ERROR="<message>"`

## 4. EMIT DELIVERABLE

Emit `Interface Direction Spec` as the primary deliverable.

Required fields:
- `target`
- `register`
- `designDials`
- `preflightResult`

## 5. EXAMPLE

```
/design:interface dashboard-shell --mode redesign
```

Returns: a deliberate interface direction with rationale, visual choices, critique, and handoff notes
