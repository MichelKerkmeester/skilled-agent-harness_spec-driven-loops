---
title: Hierarchy Rhythm Review
description: Private procedure card for the static-system subworkflow's hierarchy, rhythm, spacing, and scale review.
trigger_phrases:
  - "hierarchy rhythm review"
  - "spacing rhythm review"
  - "visual hierarchy audit"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Hierarchy Rhythm Review

Private procedure card for applying the existing `sk-design-md-generator` hierarchy and rhythm review workflow. It is reached from the final-polish orchestrator (`../../shared/procedures/polish-gate-orchestration.md`) as the interface hierarchy and rhythm fix card.

## 1. REQUIRED FIELDS

| Field | Value |
|---|---|
| Purpose | Let the `sk-design-md-generator` workflow review whether a design's hierarchy and rhythm make scanning, grouping, and emphasis intentional. |
| Owning mode | `design-interface` |
| Source reference | `hierarchy-rhythm-review.md` |
| Trigger | Use when the request mentions hierarchy, rhythm, spacing, type scale, density, visual order, or a design that feels flat or chaotic. |
| Output contract | A design-system review naming primary/secondary/tertiary elements, spacing scale, type scale, repetition patterns, strategic variation, alignment, and color-discipline findings. |
| Proof gate | The review identifies scan path and scale discipline, labels confirmed versus inferred evidence, and maps each fix to static-system or implementation handoff. |
| Privacy rule | This is private design-system review guidance, not a public hierarchy skill. |

---

## 2. READ-ONLY COMPATIBILITY

`sk-design-md-generator` may perform the review using Read, Glob, and Grep evidence plus supplied artifacts. It can report findings and handoff fixes without editing files.

---

## 3. PROCEDURE

1. Resolve the medium and target surface.
2. Identify what the user should see first, second, and third.
3. Check size, color, weight, position, and density signals for the hierarchy path.
4. Check spacing, type scale, repetition, variation, palette discipline, section structure, and alignment for rhythm.
5. Produce owner-mapped fixes, preferring token and scale corrections over ad hoc styling.

---

## 4. RELATED CARDS

- `../assets/interface-preflight-card.md` (Section 11) for generic-template smells.
- `../../shared/procedures/polish-gate-orchestration.md` for full pre-delivery review.
