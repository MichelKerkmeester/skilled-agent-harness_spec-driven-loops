---
title: "motion: Feature Catalog"
description: "Lean capability inventory for motion strategy, micro-interactions, AnimatePresence patterns, and reduced-motion performance guidance."
trigger_phrases:
  - "motion feature catalog"
  - "motion capability inventory"
  - "temporal layer catalog"
last_updated: "2026-06-25"
version: 1.0.0.0
---

# motion: Feature Catalog

## 1. OVERVIEW

| Capability | What it does | Detail file |
| --- | --- | --- |
| Motion strategy | Defines purpose, timing, easing, staging, and material choice | [`01--motion-strategy/motion-strategy.md`](01--motion-strategy/motion-strategy.md) |
| Micro-interactions | Defines feedback, loading, gestures, delight, and morphing icons | [`02--micro-interactions/micro-interactions.md`](02--micro-interactions/micro-interactions.md) |
| Presence and performance | Defines AnimatePresence, exit rules, reduced motion, and jank avoidance | [`03--presence-performance/presence-performance.md`](03--presence-performance/presence-performance.md) |

## 2. CURRENT REALITY

The skill owns temporal behavior. It does not own static visual tokens or release audit scoring. It returns choreography and implementation constraints that `sk-code` can apply in the target stack.

## 3. SOURCE ANCHORS

- `SKILL.md` for routing and boundaries.
- `references/motion_strategy.md` for motion purpose and timing.
- `references/micro_interactions.md` for feedback and delight.
- `references/animate_presence_patterns.md` and `references/performance_reduced_motion.md` for implementation guardrails.
