---
title: AnimatePresence Exit Rules Scenario
description: Manual scenario verifying exit wrapper, exit prop, stable key, mode, and nested-exit guidance.
trigger_phrases:
  - "test AnimatePresence"
  - "test exit animations"
  - "presence rules scenario"
importance_tier: normal
contextType: reference
version: 1.0.0.0
expected_intent: MOTION_PRESENCE
expected_resources:
  - references/motion/corpus-map.md
  - ../shared/register.md
  - references/motion/animate-presence-patterns.md
  - assets/motion/animate-presence-checklist.md
---

**Exact prompt**

```
Review this modal/list transition plan for AnimatePresence correctness before implementation.
```

# MOTION-PRESENCE-001 | AnimatePresence Exit Rules

## Prompt

`Review this modal/list transition plan for AnimatePresence correctness before implementation.`

## Expected Process

1. Load `references/motion/animate-presence-patterns.md`.
2. Check wrapper, exit prop, stable key, mode, nested exits, and presence hook placement.
3. Produce concrete guidance or file:line findings when code is provided.

## Pass Criteria

- Flags missing wrappers and exit props.
- Rejects index keys for animated lists.
- Explains `wait` duration and `popLayout` list use.
- Mentions `propagate` for nested coordinated exits when relevant.
