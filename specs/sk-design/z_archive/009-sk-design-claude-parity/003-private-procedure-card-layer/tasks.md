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
    packet_pointer: "sk-design/009-sk-design-claude-parity/003-private-procedure-card-layer"
    last_updated_at: "2026-07-05T00:00:00.000Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Revalidated Phase 003 tasks."
    next_safe_action: "Use Phase 004 for mode routing integration."
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

- [x] T001 Review approved external procedure inventory by safe source identifier. Evidence: read all 14 files under `external/claude/skills/*.md`.
- [x] T002 Classify the fourteen procedure themes into discovery, direction, prototype, extraction, review, and polish families. Evidence: implemented cards cover discovery, aesthetic direction, wireframe, deck, prototype, variations, tweakable controls, extraction, component inventory, accessibility, AI-slop, hierarchy/rhythm, interaction states, and polish.
- [x] T003 [P] Record which themes map naturally to one mode and which require cross-mode orchestration. Evidence: 13 cards are mode-local and `shared/procedures/polish_gate_orchestration.md` documents the cross-mode rationale and `design-audit` owner.
- [x] T004 Confirm no source procedure body needs to be copied for card authoring. Evidence: cards cite source filenames only and summarize OpenCode-native purpose, triggers, output contracts, and proof gates.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Define the private procedure-card schema. Evidence: `shared/procedure_card_schema.md` defines purpose, owning mode, source reference, trigger, output contract, proof gate, privacy rule, optional fields, selection rules, adaptation rules, and shared placement.
- [x] T006 Create the `design-interface` card inventory for discovery, aesthetic direction, wireframes, prototypes, and variations. Evidence: six files exist under `design-interface/procedures/`.
- [x] T007 Create the `design-foundations` card inventory for visual-system direction, hierarchy, typography, color, spacing, and polish. Evidence: three files exist under `design-foundations/procedures/`.
- [x] T008 Create the `design-motion` card inventory for interaction, motion review, temporal polish, and reduced-motion checks. Evidence: `design-motion/procedures/interaction_states_pass.md` exists and includes state, transition, feedback, and reduced-motion proof.
- [x] T009 Create the `design-audit` card inventory for accessibility, slop, hierarchy, interaction, and polish review. Evidence: `accessibility_audit.md` and `ai_slop_check.md` exist under `design-audit/procedures/`; cross-mode polish is owned by audit in the shared card.
- [x] T010 Create the `design-md-generator` card inventory for extraction and source-to-reference conversion. Evidence: `design-md-generator/procedures/design_system_extraction.md` exists and preserves md-generator as the only mutating design mode.
- [x] T011 Identify any shared procedure candidates and document why a single mode cannot own them. Evidence: only `shared/procedures/polish_gate_orchestration.md` is shared and its placement rationale names the four mode dimensions it coordinates.
- [x] T012 Define card selection precedence after the parent hub chooses a mode. Evidence: schema selection rules require hub mode selection first, then mode-local exact triggers before shared cards.
- [x] T013 Define conflict handling for overlapping cards. Evidence: schema and mode cards define conflict rules for extraction versus component inventory, wireframe versus variation/prototype, accessibility versus motion-state verdicts, and no-card fallback.
- [x] T014 Define parent hub fallback when no card applies. Evidence: schema selection rule 5 states the mode follows existing `SKILL.md` behavior and reports that no private procedure card applied.
- [x] T015 Define source-adaptation rules for synthesis, source citation, and no long-form prompt copying. Evidence: schema source adaptation rules require filename-only citation and preserving intent rather than phrasing.
- [x] T016 Define proof requirements for each card category. Evidence: every card has a `Proof gate` row and category-specific evidence requirements.
- [x] T017 Define reviewer checks for private cards, shared cards, and public taxonomy drift. Evidence: checklist records schema, source citation, no-copy, read-only compatibility, single graph-metadata, and public taxonomy checks.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Run strict validation for the Phase 003 packet. Evidence: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-design/009-sk-design-claude-parity/003-private-procedure-card-layer --strict` returned `Errors: 0, Warnings: 0` with exit code 0.
- [x] T019 Verify every card has an owning mode or approved shared-placement rationale. Evidence: each card has an `Owning mode` row; the only shared card names `design-audit` as owning reviewer and explains placement.
- [x] T020 Verify no public fourteen-skill mirror was added. Evidence: `Glob` found exactly one `.opencode/skills/sk-design/graph-metadata.json`; `git status --short -- mode-registry.json hub-router.json design-*/SKILL.md` returned no output for the registry, router, or mode packet `SKILL.md` files.
- [x] T021 Verify no card contains long-form copied external prompt text. Evidence: normalized 15-word source/card comparison through `grep -Fxf` returned no matches and printed `no_15_word_verbatim_runs=true`.
- [x] T022 Update `implementation-summary.md` with final implementation evidence. Evidence: summary records files changed, source/card read evidence, verification commands, validation exit code 0, and limitations.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements in `spec.md` are satisfied.
- [x] All tasks required for schema, inventory, routing, adaptation, and proof are marked `[x]` with evidence.
- [x] No `[B]` blocked tasks remain.
- [x] Strict validation passes for the phase packet or produces only the accepted dirty-tree freshness warning described in the user scope.
- [x] The implementation summary records final status, evidence, and known limitations.
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
