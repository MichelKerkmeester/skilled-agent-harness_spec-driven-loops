---
title: "Tasks: Phase 011 — Manual Testing Playbook Full Alignment"
description: "Completed Level 2 task list for the manual testing playbook alignment pass across the sk-design hub and all five mode packets."
trigger_phrases:
  - "tasks"
  - "manual testing playbook alignment"
  - "procedure card selection proof"
  - "hub manager intake coverage"
importance_tier: "high"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/sk-design/009-sk-design-claude-parity/011-manual-testing-playbook-alignment/"
    last_updated_at: "2026-07-06T09:07:56Z"
    last_updated_by: "opencode-gpt-5-5"
    recent_action: "Completed Phase 011 playbook alignment tasks."
    next_safe_action: "Regenerate metadata and run strict validation if content changes again."
---
# Tasks: Phase 011 — Manual Testing Playbook Full Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

All Phase 011 tasks are complete except final metadata regeneration and strict validation, which are performed after all content edits and then recorded in `implementation-summary.md`.

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm Phases 001-005 are complete via provided grounding facts [10m]
  - Evidence: User-provided grounding facts state phases 001-006 are complete and strict-clean; parent-skill checker was not rerun because arbitrary `node` scripts outside named exceptions were explicitly banned.
- [x] T002 Read the hub `manual_testing_playbook.md` and record baseline [15m]
  - Evidence: Hub root initially showed 24 scenarios across 6 categories and `PB-001..003`; updated to 32 scenarios across 8 categories.
- [x] T003 Read every mode's `procedures/` folder listing [15m]
  - Evidence: Glob found interface 6 cards, foundations 3, motion 1, audit 2, md-generator 1, and shared 1.
- [x] T004 Read every mode's `Procedure Card Selection` and `Context, Proof, And Direct Fallback` sections [30m]
  - Evidence: Direct reads of all five mode `SKILL.md` sections confirmed the tables and fallback/direct-fallback lines.
- [x] T005 Confirm pre-implementation gap [10m]
  - Evidence: Before edits, root playbooks had no procedure-card-contract categories; after edits, Grep finds the new procedure-card IDs and scenario paths.
- [x] T006 Read hub `SKILL.md` manager-behavior subsections [15m]
  - Evidence: Direct read confirmed `Manager Intake Before Routing`, `Visible Plan Before Design or Build Work`, and `Proof Gates and Verifier Cadence`.
- [x] T007 [P] Confirm md-generator fallback nuance differs from read-only modes [10m]
  - Evidence: `design-md-generator/SKILL.md` states direct fallback preserves the normal backend boundary; advisory modes state Read/Glob/Grep-only fallback.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T008 Implement `PB-004` motion procedure-selection proof.
- [x] T009 [P] Implement `PB-005` audit procedure-selection proof.
- [x] T010 [P] Implement `PB-006` shared polish-gate selection proof.
- [x] T011 Implement category `07--fallback-and-resilience/`.
- [x] T012 Implement `FR-001` no-procedure-card-matches fallback statement scenario.
- [x] T013 Implement `FR-002` direct-fallback-without-subagents scenario.
- [x] T014 Implement category `08--hub-manager-intake/`.
- [x] T015 Implement `HM-001` context-first intake scenario.
- [x] T016 [P] Implement `HM-002` visible plan before build scenario.
- [x] T017 [P] Implement `HM-003` verifier-cadence pause scenario.
- [x] T018 Implement interface `ID-018` card-selection proof across 6 owned cards.
- [x] T019 [P] Implement interface `ID-019` no-card fallback.
- [x] T020 [P] Implement interface `ID-020` direct fallback.
- [x] T021 Implement foundations `FOUND-PROCCARD-001` card-selection proof across 3 owned cards.
- [x] T022 [P] Implement foundations `FOUND-PROCCARD-002` no-card fallback.
- [x] T023 [P] Implement foundations `FOUND-PROCCARD-003` direct fallback.
- [x] T024 Implement motion `MOTION-PROCCARD-001` card-selection proof.
- [x] T025 [P] Implement motion `MOTION-PROCCARD-002` no-card fallback.
- [x] T026 [P] Implement motion `MOTION-PROCCARD-003` direct fallback.
- [x] T027 Implement audit `AUDIT-PROCCARD-001` card-selection proof across 2 owned cards.
- [x] T028 [P] Implement audit `AUDIT-PROCCARD-002` no-card fallback.
- [x] T029 [P] Implement audit `AUDIT-PROCCARD-003` direct fallback.
- [x] T030 Implement md-generator `PROCCARD-001` card-selection proof.
- [x] T031 [P] Implement md-generator `PROCCARD-002` no-card fallback.
- [x] T032 [P] Implement md-generator `PROCCARD-003` backend-preserving direct fallback.

Evidence: All new files exist under their planned `manual_testing_playbook/**` paths and are indexed by the corresponding root playbook.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T033 Update hub root `manual_testing_playbook.md` to 32 scenarios across 8 categories and add new cross-reference rows.
- [x] T034 [P] Update interface root to 20 scenarios across 14 categories.
- [x] T035 [P] Update foundations root to include 11 scenarios and category 07.
- [x] T036 [P] Update motion root to include 13 scenarios and category 07.
- [x] T037 [P] Update audit root to include 14 scenarios and category 05.
- [x] T038 [P] Update md-generator root to 18 scenarios across 16 categories.
- [x] T039 Record critical-path candidates without silent promotion.
  - Evidence: Hub root lists PB-004, PB-005, PB-006, FR-001, FR-002, HM-001, HM-002, and HM-003 as candidates pending operator confirmation.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification and Handoff

- [x] T040 Regenerate `description.json` and `graph-metadata.json` after all content edits are final.
  - Evidence: `backfill-graph-metadata.js` refreshed 1 scoped folder and `generate-description.js` recreated `description.json` after content edits.
- [x] T041 Run strict spec validation for this phase folder and record the exit code.
  - Evidence: `validate.sh --strict` returned exit code 0 with `Summary: Errors: 0  Warnings: 0`.
- [x] T042 Confirm checklist reflects implemented work.
  - Evidence: `checklist.md` P0/P1/P2 items updated with completion evidence.
- [x] T043 Record completion evidence in implementation summary.
  - Evidence: `implementation-summary.md` created with files changed and verification sections.

<!-- /ANCHOR:phase-4 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Scenario additions implemented in allowed playbook paths.
- [x] Shared `polish_gate_orchestration.md` covered exactly once at hub level.
- [x] md-generator backend-preserving fallback is distinct from read-only-mode direct fallback.
- [x] Root playbook counts and indexes updated.
- [x] Metadata regenerated last and strict validation result recorded.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Implementation Summary**: `implementation-summary.md`
- **Predecessor Phase**: `../010-feature-catalog-completeness/`
- **Successor Phase**: `../012-routing-benchmark-rigor/`

<!-- /ANCHOR:cross-refs -->
