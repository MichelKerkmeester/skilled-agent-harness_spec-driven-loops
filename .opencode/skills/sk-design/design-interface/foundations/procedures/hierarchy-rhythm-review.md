---
title: Hierarchy Rhythm Review
description: Private procedure card for design-foundations hierarchy, rhythm, spacing, and scale review.
trigger_phrases:
  - "hierarchy rhythm review"
  - "spacing rhythm review"
  - "visual hierarchy audit"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Hierarchy Rhythm Review

Private procedure card for applying the existing design-foundations hierarchy and rhythm review workflow.

## 1. REQUIRED FIELDS

| Field | Value |
|---|---|
| Purpose | Let `design-foundations` review whether a design's hierarchy and rhythm make scanning, grouping, and emphasis intentional. |
| Owning mode | `design-foundations` |
| Source reference | `hierarchy-rhythm-review.md` |
| Trigger | Use when the request mentions hierarchy, rhythm, spacing, type scale, density, visual order, or a design that feels flat or chaotic. |
| Output contract | A foundations review naming primary/secondary/tertiary elements, spacing scale, type scale, repetition patterns, strategic variation, alignment, and color-discipline findings. |
| Proof gate | The review identifies scan path and scale discipline, labels confirmed versus inferred evidence, and maps each fix to foundations or implementation handoff. |
| Privacy rule | This is private foundations review guidance, not a public hierarchy skill. |

## 2. READ-ONLY COMPATIBILITY

`design-foundations` may perform the review using Read, Glob, and Grep evidence plus supplied artifacts. It can report findings and handoff fixes without editing files.

## 3. PROCEDURE

1. Resolve the medium and target surface.
2. Identify what the user should see first, second, and third.
3. Check size, color, weight, position, and density signals for the hierarchy path.
4. Check spacing, type scale, repetition, variation, palette discipline, section structure, and alignment for rhythm.
5. Produce owner-mapped fixes, preferring token and scale corrections over ad hoc styling.

## 4. RELATED CARDS

- `../design-audit/procedures/ai-slop-check.md` for generic-template smells.
- `../shared/procedures/polish-gate-orchestration.md` for full pre-delivery review.
