---
title: Polish Gate Orchestration
description: Shared private procedure card for final pre-delivery design polish review across multiple modes.
trigger_phrases:
  - "polish gate orchestration"
  - "final design polish review"
  - "release readiness design gate"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Polish Gate Orchestration

Shared private procedure card for coordinating the existing final polish review across design modes.

## 1. REQUIRED FIELDS

| Field | Value |
|---|---|
| Purpose | Coordinate final pre-delivery design review across accessibility, anti-slop, hierarchy/rhythm, and interaction states. |
| Owning mode | `shared`; owning gate: `design-interface`'s `assets/interface-preflight-card.md` |
| Source reference | `polish-pass.md` |
| Trigger | Use when a built or planned design needs a final polish, release-readiness review, or stakeholder-facing quality gate that spans multiple review dimensions. |
| Output contract | A consolidated review plan or findings report grouped into blockers, quality issues, polish recommendations, open decisions, and out-of-scope observations. |
| Proof gate | The report covers accessibility, anti-slop, hierarchy/rhythm, and interaction states; duplicates are merged; P0/P1 issues are surfaced before polish notes. |
| Privacy rule | This shared private card is internal orchestration only and does not create a public polish-pass skill. |

## 2. PLACEMENT RATIONALE

`design-interface`'s `assets/interface-preflight-card.md` is the binary, mechanical last filter before delivery: it walks hero, bento/grid, eyebrow/meta-label, button/form contrast, breakpoint overflow, real imagery, copy, motion motivation and reduced motion, the AI-tell sweep (Section 11), and the interaction-state matrix (Section 12) box by box, and reaches SHIP only when every box passes. This card coordinates the findings that flow out of that gate to their owning capability: `design-interface` owns hierarchy and rhythm fixes, visual-direction repair, and interaction-state and transition standards (relocated in whole from the retired `motion` mode). Keeping the orchestration shared avoids duplicating the same final-gate routing logic in multiple mode folders while preserving the interface pre-flight card as the single mechanical reviewer.

## 3. READ-ONLY COMPATIBILITY

Read-only modes may cite the shared card to produce a review plan, findings report, or handoff. They must not require Write, Edit, Bash, or file mutation to use it.

## 4. PROCEDURE

1. Resolve whether the surface is ready for polish or still structurally mid-flight.
2. Cover accessibility, AI-template risk, hierarchy/rhythm, and interaction states.
3. Collect all findings before filtering so minor but real issues are not lost.
4. Deduplicate overlapping findings and order them by release impact.
5. Route fixes to the owning mode or `sk-code`; do not silently apply them from a read-only review context.
6. End with a concise verdict and any decisions the user must review.

## 5. RELATED CARDS

- `../../design-interface/assets/interface-preflight-card.md` - the mechanical pre-delivery gate this card orchestrates findings around, including its AI-tell sweep (Section 11) and interaction-state matrix (Section 12).
- `../../design-interface/procedures/hierarchy-rhythm-review.md` - the `design-interface` hierarchy and rhythm fix card.
- `../../design-interface/procedures/interaction-states-pass.md` - the `design-interface` interaction-state and transition fix card (relocated from the retired `motion` mode).
