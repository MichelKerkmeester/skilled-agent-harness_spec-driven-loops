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
  - references/corpus-map.md
  - ../shared/register.md
  - references/animation-decision-framework.md
  - references/advanced-craft.md
  - references/performance-reduced-motion.md
---

**Exact prompt**

```
Tune the popover and tooltip motion for a dense toolbar. The first tooltip can wait, but adjacent tooltips should feel instant.
```

# MOTION-ADVANCED-001 | Advanced Craft Popover And Tooltip

## Expected Process

1. Route to `motion`.
2. Load `references/advanced-craft.md` after the register and restraint gate.
3. Specify origin-aware popover movement from the trigger edge.
4. Specify delayed first tooltip and instant warm follow-up behavior.
5. Include reduced-motion and slow-motion debugging checks.
6. If the effect becomes ambitious, expensive, or technically extraordinary, require a proposal before implementation.

## Pass Criteria

- Popover origin is tied to the trigger or owning edge.
- Tooltip follow-up timing is immediate while the cluster is warm.
- `@starting-style` is suggested only for CSS mounted entries.
- Framer Motion shorthand is caveated under load.
- High-ambition effects are proposed before building, naming the effect, served user moment, materials, performance budget, and reduced-motion fallback.
- No extra motion is added beyond the interaction need.
