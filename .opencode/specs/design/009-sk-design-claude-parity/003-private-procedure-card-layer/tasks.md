---
title: "Tasks: Phase 003 - Private Procedure Card Layer"
description: "Pending task breakdown for implementing private OpenCode-native procedure cards inside the existing sk-design five-mode architecture."
trigger_phrases:
  - "phase 003 tasks"
  - "procedure-card tasks"
  - "private card inventory"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "design/009-sk-design-claude-parity/003-private-procedure-card-layer"
    last_updated_at: "2026-07-05T00:00:00.000Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Created Phase 003 tasks."
    next_safe_action: "Start T001 when scoped."
---
# Tasks: Phase 003 - Private Procedure Card Layer

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable after dependencies are met |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (primary artifact)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Review approved external procedure inventory by safe source identifier.
- [ ] T002 Classify the fourteen procedure themes into discovery, direction, prototype, extraction, review, and polish families.
- [ ] T003 [P] Record which themes map naturally to one mode and which require cross-mode orchestration.
- [ ] T004 Confirm no source procedure body needs to be copied for card authoring.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Define the private procedure-card schema.
- [ ] T006 Create the `design-interface` card inventory for discovery, aesthetic direction, wireframes, prototypes, and variations.
- [ ] T007 Create the `design-foundations` card inventory for visual-system direction, hierarchy, typography, color, spacing, and polish.
- [ ] T008 Create the `design-motion` card inventory for interaction, motion review, temporal polish, and reduced-motion checks.
- [ ] T009 Create the `design-audit` card inventory for accessibility, slop, hierarchy, interaction, and polish review.
- [ ] T010 Create the `design-md-generator` card inventory for extraction and source-to-reference conversion.
- [ ] T011 Identify any shared procedure candidates and document why a single mode cannot own them.
- [ ] T012 Define card selection precedence after the parent hub chooses a mode.
- [ ] T013 Define conflict handling for overlapping cards.
- [ ] T014 Define parent hub fallback when no card applies.
- [ ] T015 Define source-adaptation rules for synthesis, source citation, and no long-form prompt copying.
- [ ] T016 Define proof requirements for each card category.
- [ ] T017 Define reviewer checks for private cards, shared cards, and public taxonomy drift.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T018 Run strict validation for the Phase 003 packet.
- [ ] T019 Verify every card has an owning mode or approved shared-placement rationale.
- [ ] T020 Verify no public fourteen-skill mirror was added.
- [ ] T021 Verify no card contains long-form copied external prompt text.
- [ ] T022 Update `implementation-summary.md` with final implementation evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements in `spec.md` are satisfied.
- [ ] All tasks required for schema, inventory, routing, adaptation, and proof are marked `[x]` with evidence.
- [ ] No `[B]` blocked tasks remain.
- [ ] Strict validation passes for the phase packet.
- [ ] The implementation summary records final status, evidence, and known limitations.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
