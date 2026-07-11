---
title: Purposeful Motion Plan Scenario
description: Manual scenario verifying that motion is planned around purpose, timing, easing, and one focal choreography.
trigger_phrases:
  - "test motion strategy"
  - "purposeful motion scenario"
  - "animation plan test"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: STRATEGY
expected_resources:
  - references/corpus_map.md
  - ../shared/register.md
  - references/motion_strategy.md
  - ../shared/sk_code_handoff.md
---

**Exact prompt**

```
Design the motion for a product landing hero and pricing cards; make it feel premium without animating everything.
```

# MOTION-STRATEGY-001 | Purposeful Motion Plan

## Prompt

`Design the motion for a product landing hero and pricing cards; make it feel premium without animating everything.`

## Expected Process

1. Route to `motion`.
2. Load `references/motion_strategy.md`.
3. Pick one focal choreography and local feedback only where it clarifies state.

## Pass Criteria

- Names motion purpose for each animated element.
- Uses timing and easing from the reference.
- Verifies named duration and easing tokens map to the reference timing bands and easing curves.
- Includes a global reduced-motion override and names explicit no-motion cases for high-frequency keyboard paths, repeated list/table operations, dense admin surfaces, and interactions where movement delays comprehension.
- Provides a non-gesture accessible alternative for every gesture-driven interaction.
- Avoids scattershot scroll reveals.
- Includes reduced-motion fallback.
