---
description: Animation, transitions, micro-interactions, AnimatePresence, reduced motion. sk-design motion mode.
argument-hint: "<component-state> [--library]"
allowed-tools: Read, Glob, Grep
---

# /design:motion

Thin bridge into the `sk-design` parent skill's `motion` mode.

## 1. PURPOSE

Pin the `motion` mode of the `sk-design` parent hub to design purposeful animation and micro-interactions. The hub owns routing
across modes; this command loads the `motion` mode directly. If the request spans more
than `motion`, defer to the hub's routing instead of forcing this mode.

<!-- ANCHOR:sibling-discriminator -->
## 2. WHEN TO USE THIS, NOT A SIBLING

- **Use this command when** the request is to design purposeful animation, transitions, or reduced-motion behavior.
- **Prefer `/design:audit` when** the request is findings-first quality review, release scoring, or motion-performance assessment.
- **Prefer `/design:foundations` when** the request is static color, type, layout, responsive, or theme-token work.
- **Prefer `/design:interface` when** the request is to invent the full visual direction or interface concept first.
- **Prefer `/design:md-generator` when** the request is to capture measured CSS or tokens from a live site.
- **Defer to the `sk-design` hub when** the request is primarily static visual-system design, interface direction, audit scoring, or measured CSS extraction.
<!-- /ANCHOR:sibling-discriminator -->

## 3. INSTRUCTIONS

### Step 1: Load and apply the mode
- Read `.opencode/skills/sk-design/SKILL.md` -- the parent hub: routing table and the
  shared references under `shared/`.
- Read `.opencode/skills/sk-design/design-motion/SKILL.md` -- the `motion` mode contract
  -- and load its `references/` and assets as the work requires.
- Apply the `motion` mode to `$ARGUMENTS`, following its workflow and quality gates.

### Step 2: Return Status
- Success: `STATUS=OK`
- Failure: `STATUS=FAIL ERROR="<message>"`

## 4. EMIT DELIVERABLE

Emit `Motion Design Spec` as the primary deliverable.

Required fields:
- `componentState`
- `motionPurpose`
- `timingModel`
- `reducedMotionPath`

## 5. EXAMPLE

```
/design:motion modal-open-close --library framer-motion
```

Returns: a motion plan with purpose, timing, easing, interaction states, performance notes, and reduced-motion behavior
