---
title: Motion Corpus Map
description: Source-to-guidance map for temporal interaction design material distilled into motion.
trigger_phrases:
  - "motion corpus"
  - "animation source map"
  - "temporal layer sources"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Motion Corpus Map

This skill distills the temporal design corpus into practical, reusable motion guidance.

---

## 1. OVERVIEW

### Purpose

Trace each piece of motion guidance back to its source corpus file and record where the distilled material now lives. This reference maps source files to the references they fed and states the distillation boundary between this skill and its siblings.

### When to Use

- Confirming which corpus file a piece of motion guidance was distilled from.
- Locating where a source topic now lives across the motion references.
- Clarifying the boundary between motion build guidance, motion-performance review, and static systems.

---

## 2. Source Files

| Corpus file | Distilled into | Practical guidance kept |
| --- | --- | --- |
| `external/animate.md` | `motion_strategy.md`, `performance_reduced_motion.md` | Purposeful motion, timing scale, easing, materials, perceived performance, reduced motion |
| `external/interaction-design.md` | `micro_interactions.md`, `animate_presence_patterns.md` | Feedback patterns, loading, toggles, gestures, Framer Motion examples |
| `external/delight.md` | `micro_interactions.md` | Earned delight, copy/personality boundaries, celebration and loading restraint |
| `external/morphing-icons.md` | `micro_interactions.md` | Three-line SVG morphing architecture, collapsed lines, rotation groups, reduced-motion rules |
| `external/12-principles-of-animation.md` | `motion_strategy.md`, `micro_interactions.md` | Timing, easing, physics (active/pressed state, subtle deformation), staging checks adapted for web UI |
| `external/mastering-animate-presence.md` | `animate_presence_patterns.md` | Exit wrappers, exit props, keys, presence hooks, modes (sync/absolute remedy, popLayout for lists), nested exits |
| `external/fixing-motion-performance.md` | `performance_reduced_motion.md` | Rendering steps glossary, critical never-patterns, FLIP measurement, blur bounds, will-change discipline, view transitions |
| `external/make-interfaces-feel-better.md` | `micro_interactions.md`, `animate_presence_patterns.md`, `performance_reduced_motion.md` | Interruptible CSS transitions vs one-shot keyframes, scale-on-press, icon spring `bounce: 0`, `initial={false}` first-render suppression, never `transition: all` |

## 3. Distillation Boundary

This child owns motion build guidance. Motion-performance review and severity findings live in `audit`; static systems live in `foundations`.
