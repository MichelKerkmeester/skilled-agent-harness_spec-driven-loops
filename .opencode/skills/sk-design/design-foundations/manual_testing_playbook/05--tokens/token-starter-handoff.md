---
title: Token Starter Handoff Scenario
description: Manual scenario verifying the fill-in token scaffold for an OKLCH ramp, type scale and spacing scale keyed to the register.
trigger_phrases:
  - "test token starter"
  - "test token scaffold handoff"
  - "foundations token scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# FOUND-TOKEN-001 | Token Starter Handoff

## Prompt

`Scaffold a token system for a restrained product UI with a teal brand hue and dark mode, ready to hand to sk-code.`

## Expected Process

1. Route to `foundations` first. The token scaffold is filled here before any `sk-code` implementation handoff.
2. Read `../shared/register.md` first, then load `assets/token_starter.md`.
3. Set the register and copy the color strategy and density answers into the scaffold.
4. Fill the OKLCH ramp, type scale and spacing scale, pulling the brand hue from evidence rather than a default.
5. Fill the dark-mode block as its own surface system rather than inverted light values.

## Pass Criteria

- Reads the register before filling values, and lets the register win on posture when a value conflicts.
- Fills every color token with an OKLCH value or a deliberate compatibility reason.
- Tints neutrals toward the brand hue with a small chroma rather than using flat gray.
- Sets type roles before sizes, keeps body near 16 px, and uses tabular numerals on data.
- Pulls every spacing value from the scale rather than typing one-off numbers.
- Builds dark mode from its own surface and text pairs, holding hue and chroma steady while varying lightness.
- Confirms the handoff checklist before passing the filled scaffold to `sk-code`.
- Defers channel mechanics, contrast repair and semantic role theory to the color and type references.
