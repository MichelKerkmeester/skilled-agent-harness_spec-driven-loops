---
title: Motion Performance Failure Card Scenario
description: Manual scenario verifying the build-side failure card catches layout thrash, scroll polling, endless rAF, mixed systems, layer promotion, paint-heavy effects and blur.
trigger_phrases:
  - "test motion performance card"
  - "animation jank card scenario"
  - "dropped frames pre-handoff test"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: PERFORMANCE
expected_resources:
  - references/corpus_map.md
  - references/performance_reduced_motion.md
  - assets/motion_performance_failure_card.md
---

**Exact prompt**

```
Pre-flight this scroll-driven parallax header and a drag-to-reorder list for frame drops before handoff.
```

# MOTION-REDUCED-002 | Motion Performance Failure Card

## Prompt

`Pre-flight this scroll-driven parallax header and a drag-to-reorder list for frame drops before handoff.`

## Expected Process

1. Load `assets/motion_performance_failure_card.md` and read each failure signature against the build.
2. Walk the rendering cost floor, keeping motion on transform and opacity unless a stated constraint forces paint or layout.
3. Apply the cheaper mechanism where a failure mode is present, then clear the pre-handoff check boxes.

## Pass Criteria

- Replaces scroll-event-driven motion with a Scroll or View Timeline or `IntersectionObserver`, rather than reading `scrollY` per tick.
- Catches layout thrash and any continuous `width`, `height`, `top` or `left` animation, swapping it for transform or FLIP.
- Bounds blur at or below `8px` and keeps paint-heavy effects small, isolated and short-lived.
- Confirms one animation system per surface, a stop condition for every `requestAnimationFrame` loop and a check on the lowest target device.
