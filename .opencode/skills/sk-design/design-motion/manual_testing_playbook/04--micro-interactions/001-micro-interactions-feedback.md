---
title: Micro-Interactions Feedback Scenario
description: Manual scenario verifying press feedback, required active state, morphing-icon rules, and delight boundaries.
trigger_phrases:
  - "test micro-interactions"
  - "test interaction feedback"
  - "press state scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: MICRO_INTERACTIONS
expected_resources:
  - references/corpus_map.md
  - references/micro_interactions.md
  - assets/motion_pattern_cards.md
---

**Exact prompt**

```
Specify the hover, active, and loading feedback for a primary button and a menu-to-close morphing icon, with earned delight on success.
```

# MOTION-MICRO-001 | Micro-Interactions Feedback

## Prompt

`Specify the hover, active, and loading feedback for a primary button and a menu-to-close morphing icon, with earned delight on success.`

## Expected Process

1. Load `references/micro_interactions.md`.
2. Define each state and confirm an active/pressed state exists for every interactive control.
3. Set press-scale and morphing-icon behavior from the reference, with reduced-motion fallbacks.

## Pass Criteria

- Requires an active/pressed state, with press scale in `0.95-1.0` (commonly `0.96`) and never below `0.95`.
- Keeps the `1.05` lift as a hover affordance, not a press.
- Applies the three-line, shared-`viewBox`, `strokeLinecap="round"` morphing-icon rules.
- Keeps delight brief, contextual, non-blocking, and within the success/first-time/recovery boundaries.
