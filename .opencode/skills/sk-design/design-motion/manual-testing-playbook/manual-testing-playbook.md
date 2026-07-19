---
title: "motion: Manual Testing Playbook"
description: "Lean manual scenarios for verifying motion strategy, interaction feedback, AnimatePresence, and reduced-motion behavior."
version: 1.0.0.0
---

# motion: Manual Testing Playbook

> **EXECUTION POLICY**: Run scenarios against the live skill and on-disk references. Acceptable verdicts are PASS, PARTIAL, FAIL, or SKIP with a concrete blocker.

## 1. OVERVIEW

| ID | Scenario | File |
| --- | --- | --- |
| MOTION-STRATEGY-001 | Purposeful motion plan | [`strategy/purposeful-motion-plan.md`](strategy/purposeful-motion-plan.md) |
| MOTION-STRATEGY-002 | Motion pattern card | [`strategy/motion-pattern-card.md`](strategy/motion-pattern-card.md) |
| MOTION-STRATEGY-003 | Async state-machine card | [`strategy/async-state-machine-card.md`](strategy/async-state-machine-card.md) |
| MOTION-PRESENCE-001 | AnimatePresence exit rules | [`presence/animate-presence-exit-rules.md`](presence/animate-presence-exit-rules.md) |
| MOTION-PRESENCE-002 | AnimatePresence checklist | [`presence/animate-presence-checklist.md`](presence/animate-presence-checklist.md) |
| MOTION-REDUCED-001 | Performance and reduced motion | [`reduced-motion/performance-and-reduced-motion.md`](reduced-motion/performance-and-reduced-motion.md) |
| MOTION-REDUCED-002 | Motion performance failure card | [`reduced-motion/motion-performance-failure-card.md`](reduced-motion/motion-performance-failure-card.md) |
| MOTION-MICRO-001 | Micro-interactions feedback | [`micro-interactions/micro-interactions-feedback.md`](micro-interactions/micro-interactions-feedback.md) |
| MOTION-DECISION-001 | Restraint gate | [`decision/restraint-gate.md`](decision/restraint-gate.md) |
| MOTION-ADVANCED-001 | Advanced craft popover and tooltip timing | [`advanced-craft/advanced-craft-popover-tooltip.md`](advanced-craft/advanced-craft-popover-tooltip.md) |
| MOTION-PROCCARD-001 | Procedure-card selection proof | [`procedure-card-contract/card-selection-proof.md`](procedure-card-contract/card-selection-proof.md) |
| MOTION-PROCCARD-002 | No-card fallback | [`procedure-card-contract/no-card-fallback.md`](procedure-card-contract/no-card-fallback.md) |
| MOTION-PROCCARD-003 | Direct fallback without subagents | [`procedure-card-contract/direct-fallback-without-subagents.md`](procedure-card-contract/direct-fallback-without-subagents.md) |

## 2. GLOBAL PRECONDITIONS

1. The repository root is the working directory.
2. `SKILL.md` and all `references/` files under `motion` resolve.
3. `sk-code` is available for implementation handoff when code is involved.

## 3. EVIDENCE REQUIREMENTS

- Exact prompt used.
- Resources loaded.
- Motion purpose, timing, easing, reduced-motion path, and implementation handoff.
- Final verdict with rationale.
- Procedure card or no-card fallback proof when procedure support is in scope.

## 4. RELEASE READINESS

Release is ready when all 13 scenarios PASS or are SKIP only for environment reasons, and no scenario recommends decorative motion without purpose, omits reduced-motion behavior, skips procedure-card proof, or weakens the Read/Glob/Grep-only direct fallback.
