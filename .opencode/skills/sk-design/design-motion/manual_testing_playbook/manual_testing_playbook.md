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
| MOTION-STRATEGY-001 | Purposeful motion plan | [`01--strategy/purposeful-motion-plan.md`](01--strategy/purposeful-motion-plan.md) |
| MOTION-STRATEGY-002 | Motion pattern card | [`01--strategy/motion-pattern-card.md`](01--strategy/motion-pattern-card.md) |
| MOTION-PRESENCE-001 | AnimatePresence exit rules | [`02--presence/animate-presence-exit-rules.md`](02--presence/animate-presence-exit-rules.md) |
| MOTION-PRESENCE-002 | AnimatePresence checklist | [`02--presence/animate-presence-checklist.md`](02--presence/animate-presence-checklist.md) |
| MOTION-REDUCED-001 | Performance and reduced motion | [`03--reduced-motion/performance-and-reduced-motion.md`](03--reduced-motion/performance-and-reduced-motion.md) |
| MOTION-REDUCED-002 | Motion performance failure card | [`03--reduced-motion/motion-performance-failure-card.md`](03--reduced-motion/motion-performance-failure-card.md) |
| MOTION-MICRO-001 | Micro-interactions feedback | [`04--micro-interactions/micro-interactions-feedback.md`](04--micro-interactions/micro-interactions-feedback.md) |
| MOTION-DECISION-001 | Restraint gate | [`05--decision/restraint-gate.md`](05--decision/restraint-gate.md) |

## 2. GLOBAL PRECONDITIONS

1. The repository root is the working directory.
2. `SKILL.md` and all `references/` files under `motion` resolve.
3. `sk-code` is available for implementation handoff when code is involved.

## 3. EVIDENCE REQUIREMENTS

- Exact prompt used.
- Resources loaded.
- Motion purpose, timing, easing, reduced-motion path, and implementation handoff.
- Final verdict with rationale.

## 4. RELEASE READINESS

Release is ready when all scenarios PASS or are SKIP only for environment reasons, and no scenario recommends decorative motion without purpose or omits reduced-motion behavior.
