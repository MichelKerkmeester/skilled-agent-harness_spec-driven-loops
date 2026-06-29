---
description: Visual systems: color/OKLCH, typography, layout, spacing, tokens, theming. sk-design foundations mode.
argument-hint: "<axis> <target>"
allowed-tools: Read, Glob, Grep
---

# /design:foundations

Thin bridge into the `sk-design` parent skill's `foundations` mode.

## 1. PURPOSE

Pin the `foundations` mode of the `sk-design` parent hub to design the static visual system - color, typography, layout, spacing, tokens. The hub owns routing
across modes; this command loads the `foundations` mode directly. If the request spans more
than `foundations`, defer to the hub's routing instead of forcing this mode.

<!-- ANCHOR:sibling-discriminator -->
## 2. WHEN TO USE THIS, NOT A SIBLING

- **Use this command when** the request is to design or correct the static visual system.
- **Prefer `/design:audit` when** the request is to review, score, accessibility-check, or harden a design surface.
- **Prefer `/design:interface` when** the request is to invent the overall interface direction, voice, or signature visual concept first.
- **Prefer `/design:md-generator` when** the request is to extract measured tokens from a live site into DESIGN.md.
- **Prefer `/design:motion` when** the request is animation, transition choreography, micro-interactions, or reduced-motion behavior.
- **Defer to the `sk-design` hub when** the request spans invention of the overall interface direction, motion choreography, or release-quality audit.
<!-- /ANCHOR:sibling-discriminator -->

## 3. PRECONDITIONS

- **Requires:** a design-system axis (color, type, layout, spacing, or tokens) plus the target surface or product context
- **Ask-first:** if that input is missing, emit `STATUS=ASK MISSING=<input>` and ask "Which axis (color, type, layout, spacing, tokens) and for which target surface?" Do not run on a guess.
- **Cannot-run:** when no axis is named, or no target/product context is given to ground the system, stop with `STATUS=FAIL ERROR=<named-cause>`.
- **Escalate:** if the request actually needs full interface invention, not a single static axis, return `STATUS=DEFER ROUTE=hub` rather than forcing the mode.
- **Route instead:** when the work is overall interface direction, motion behavior, or release-quality audit, return `STATUS=DEFER ROUTE=hub`.

## 4. INSTRUCTIONS

### Step 1: Load and apply the mode
- Read `.opencode/skills/sk-design/SKILL.md` -- the parent hub: routing table and the
  shared references under `shared/`.
- Read `.opencode/skills/sk-design/design-foundations/SKILL.md` -- the `foundations` mode contract
  -- and load its `references/` and assets as the work requires.
- Apply the `foundations` mode to `$ARGUMENTS`, following its workflow and quality gates.

### Step 2: Return Status
- Success: `STATUS=OK`
- Missing input: `STATUS=ASK MISSING=<input>` plus the Ask-first question.
- Cannot run: `STATUS=FAIL ERROR=<named-cause>` with the cause named.
- Route instead: `STATUS=DEFER ROUTE=<hub|sibling>`.

## 5. EMIT DELIVERABLE

Emit `Visual System Foundations Plan` as the primary deliverable.

Required fields:
- `axis`
- `target`
- `tokenDecisions`
- `contrastEvidence`

## 6. EXAMPLE

```
/design:foundations color marketing-site
```

Returns: a static visual-system plan with color, type, layout, spacing, responsive, and token guidance as applicable
