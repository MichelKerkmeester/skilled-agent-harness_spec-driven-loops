---
title: Advanced Craft Popover And Tooltip Scenario
description: Manual scenario verifying origin-aware popovers, instant follow-up tooltip behavior and advanced CSS entry guidance.
trigger_phrases:
  - "test advanced motion craft"
  - "origin aware popover scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: ADVANCED_CRAFT
expected_resources:
  - references/corpus_map.md
  - ../shared/register.md
  - references/animation_decision_framework.md
  - references/advanced_craft.md
  - references/performance_reduced_motion.md
---

**Exact prompt**

```
Tune the popover and tooltip motion for a dense toolbar. The first tooltip can wait, but adjacent tooltips should feel instant.
```

# MOTION-ADVANCED-001 | Advanced Craft Popover And Tooltip

## Expected Process

1. Route to `motion`.
2. Load `references/advanced_craft.md` after the register and restraint gate.
3. Specify origin-aware popover movement from the trigger edge.
4. Specify delayed first tooltip and instant warm follow-up behavior.
5. Include reduced-motion and slow-motion debugging checks.

## Pass Criteria

- Popover origin is tied to the trigger or owning edge.
- Tooltip follow-up timing is immediate while the cluster is warm.
- `@starting-style` is suggested only for CSS mounted entries.
- Framer Motion shorthand is caveated under load.
- No extra motion is added beyond the interaction need.
