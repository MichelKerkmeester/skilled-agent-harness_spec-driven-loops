---
title: Deck Direction Spec
description: Private procedure card for design-interface slide deck direction and implementation handoff.
trigger_phrases:
  - "deck direction spec"
  - "slide presentation design"
  - "html presentation plan"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Deck Direction Spec

Private procedure card for applying the existing design-interface deck planning workflow.

## 1. REQUIRED FIELDS

| Field | Value |
|---|---|
| Purpose | Help `design-interface` plan a slide deck as a fixed-size visual system before implementation. |
| Owning mode | `design-interface` |
| Source reference | `make-a-deck.md` |
| Trigger | Use when the user asks for a deck, slide presentation, pitch, or HTML presentation design. |
| Output contract | A deck plan with audience, format, time budget, slide count, tone, source material, layout system, type scale, contrast expectations, and implementation handoff. |
| Proof gate | The plan names slide layout types, one-message-per-slide discipline, minimum body text size, overflow checks, navigation expectations, and any placeholder imagery decisions. |
| Privacy rule | This card is private deck-planning guidance inside `design-interface`, not a public deck skill. |

## 2. READ-ONLY COMPATIBILITY

`design-interface` may produce the deck plan and handoff. It must not require Write, Edit, or Bash to use this card.

## 3. PROCEDURE

1. Resolve audience, aspect ratio, slide count, time budget, tone, source content, and speaker-note need.
2. Commit to 4 to 6 layout types before implementation.
3. Keep the visual system constrained: limited backgrounds, clear type hierarchy, and one primary message per slide.
4. Flag charts, imagery, and dense slides that need separate source or data validation.
5. Hand off to implementation with keyboard navigation, scaling, overflow, contrast, and body-size verification.
