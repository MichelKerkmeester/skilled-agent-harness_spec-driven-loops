---
title: Performance And Reduced Motion Scenario
description: Manual scenario verifying performance-safe property choice and reduced-motion alternatives.
trigger_phrases:
  - "test motion performance"
  - "test reduced motion"
  - "animation jank scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: PERFORMANCE
expected_resources:
  - references/corpus-map.md
  - ../shared/register.md
  - references/performance-reduced-motion.md
  - assets/motion-performance-failure-card.md
---

**Exact prompt**

```
Plan a drawer animation with blur and layout change, but make sure it performs on mobile and respects reduced motion.
```

# MOTION-REDUCED-001 | Performance And Reduced Motion

## Prompt

`Plan a drawer animation with blur and layout change, but make sure it performs on mobile and respects reduced motion.`

## Expected Process

1. Load `references/performance-reduced-motion.md` and `references/motion-strategy.md`.
2. Prefer transform/opacity or FLIP for layout-like motion.
3. Bound blur/filter use and define reduced-motion behavior.

## Pass Criteria

- Avoids continuous layout animation.
- Names any paint-heavy effect and bounds it.
- Includes reduced-motion equivalent state feedback.
- Calls out mobile verification risk.
