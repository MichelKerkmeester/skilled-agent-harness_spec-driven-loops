---
title: Motion Pattern Card Scenario
description: Manual scenario verifying a filled pattern card names owner, single purpose, states and reduced-motion path before handoff.
trigger_phrases:
  - "test motion pattern card"
  - "motion spec card scenario"
  - "interaction card fill-in test"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: MICRO_INTERACTIONS
expected_resources:
  - references/corpus_map.md
  - ../shared/register.md
  - references/micro_interactions.md
  - assets/motion_pattern_cards.md
---

**Exact prompt**

```
Spec a toast notification and a settings drawer toggle so I can hand them to the build team.
```

# MOTION-STRATEGY-002 | Motion Pattern Card

## Prompt

`Spec a toast notification and a settings drawer toggle so I can hand them to the build team.`

## Expected Process

1. Run the restraint gate in `references/animation_decision_framework.md` first, then pick the matching cards in `assets/motion_pattern_cards.md` (toast card, state transition card).
2. Replace every blank cell, pulling timing and easing from `references/motion_strategy.md` rather than inventing numbers.
3. Tick the per-card checks and confirm no cell is left as a placeholder before handoff.

## Pass Criteria

- Names the owner, exactly one purpose and the full state path for each card.
- Cites timing and easing from `motion_strategy.md`, not new values invented in the card.
- Defines a reduced-motion equivalent that keeps the state change and removes movement (toast fades only, drawer swaps instantly).
- Leaves no blank cell, since a card with blanks is not ready to hand to `sk-code`.
