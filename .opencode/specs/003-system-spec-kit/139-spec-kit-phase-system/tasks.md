<!-- SPECKIT_LEVEL: 3+ -->
# Task Breakdown: SpecKit Phase System

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## Overview

| Phase | Tasks | Est. LOC | Priority |
|-------|-------|----------|----------|
| Phase 1: Detection & Scoring | T001-T005 | ~150 | P0 |
| Phase 2: Templates & Creation | T006-T012 | ~250 | P0 |
| Phase 3: Commands & Router | T013-T020 | ~400 | P0/P1 |
| Phase 4: Validation, Docs & Nodes | T021-T032 | ~500 | P0/P1 |
| **Total** | **32 tasks** | **~1300** | |

---

## Phase 1: Detection & Scoring

| ID | Task | Priority | Status | Dependencies |
|----|------|----------|--------|-------------|
| T001 | Add `determine_phasing()` function to `recommend-level.sh` with 5 phase signal scoring dimensions | P0 | Pending | None |
| T002 | Add `--recommend-phases` CLI flag to include phase scoring in output | P0 | Pending | T001 |
| T003 | Add `--phase-threshold <N>` CLI flag for threshold override (default 25) | P1 | Pending | T001 |
| T004 | Extend JSON output with `recommended_phases`, `phase_score`, `phase_reason`, `suggested_phase_count` | P0 | Pending | T001, T002 |
| T005 | Create 5 test fixtures: below threshold, at boundary, above threshold, extreme scale, no risk factors | P1 | Pending | T001-T004 |

## Phase 2: Templates & Creation

| ID | Task | Priority | Status | Dependencies |
|----|------|----------|--------|-------------|
| T006 | Create `templates/addendum/phase/phase-parent-section.md` (Phase Documentation Map template) | P0 | Pending | None |
| T007 | Create `templates/addendum/phase/phase-child-header.md` (parent back-reference metadata block) | P0 | Pending | None |
| T008 | Add `--phase` flag to `create.sh` (mutually exclusive with `--subfolder`) | P0 | Pending | T006, T007 |
| T009 | Add `--phases <N>` flag for multi-child creation with auto-numbering | P1 | Pending | T008 |
| T010 | Add `--phase-names <list>` flag for descriptive child folder naming | P1 | Pending | T008 |
| T011 | Implement Phase Documentation Map injection into parent spec.md | P0 | Pending | T006, T008 |
| T012 | Implement parent back-reference injection into child spec.md | P0 | Pending | T007, T008 |

## Phase 3: Commands & Router

| ID | Task | Priority | Status | Dependencies |
|----|------|----------|--------|-------------|
| T013 | Add PHASE intent to SKILL.md `INTENT_SIGNALS` dict | P0 | Pending | None |
| T014 | Add PHASE → `phase_definitions.md` to SKILL.md `RESOURCE_MAP` | P0 | Pending | T013 |
| T015 | Add `/spec_kit:phase` → PHASE to SKILL.md `COMMAND_BOOSTS` | P0 | Pending | T013 |
| T016 | Remove `"phase"` from IMPLEMENT keywords in SKILL.md | P1 | Pending | T013 |
| T017 | Create `command/spec_kit/phase.md` command entry point | P0 | Pending | None |
| T018 | Create `assets/spec_kit_phase_auto.yaml` (7-step autonomous workflow) | P0 | Pending | T017 |
| T019 | Create `assets/spec_kit_phase_confirm.yaml` (7-step interactive workflow) | P1 | Pending | T017 |
| T020 | Update `/spec_kit:plan` with Gate 3 Option E and `--phase-folder` argument | P1 | Pending | Phase 2 |
| T021 | Update `/spec_kit:implement` for nested phase path resolution | P1 | Pending | Phase 2 |
| T022 | Update `/spec_kit:complete` with phase lifecycle validation step | P1 | Pending | Phase 2 |
| T023 | Update `/spec_kit:resume` with phase folder detection and selection | P1 | Pending | Phase 2 |

## Phase 4: Validation, Docs & Nodes

| ID | Task | Priority | Status | Dependencies |
|----|------|----------|--------|-------------|
| T024 | Add `--recursive` flag to `validate.sh` with child folder discovery | P0 | Pending | None |
| T025 | Implement per-phase validation aggregation and combined exit codes | P0 | Pending | T024 |
| T026 | Extend JSON output with `"phases": [...]` array | P1 | Pending | T024 |
| T027 | Create `check-phase-links.sh` validation rule script | P1 | Pending | T024 |
| T028 | Create 6 test fixtures: flat, 1-phase, 3-phase, mixed levels, empty child, broken links | P1 | Pending | T024-T027 |
| T029 | Create `references/structure/phase_definitions.md` | P1 | Pending | None |
| T030 | Update `sub_folder_versioning.md`, `level_specifications.md`, `template_guide.md`, `quick_reference.md`, `validation_rules.md` | P1 | Pending | T029 |
| T031 | Create `nodes/phase-system.md` graph mode node | P1 | Pending | None |
| T032 | Update `index.md` MOC with phase-system node link | P1 | Pending | T031 |

---

## Dependency Graph

```
T001 ──→ T002 ──→ T004 ──→ T005
  │       │
  └──→ T003

T006 ──→ T008 ──→ T009
T007 ──→ T008 ──→ T010
T006 + T008 ──→ T011
T007 + T008 ──→ T012

T013 ──→ T014, T015, T016
T017 ──→ T018, T019
Phase 2 ──→ T020, T021, T022, T023

T024 ──→ T025 ──→ T026
T024 ──→ T027 ──→ T028
T029 ──→ T030
T031 ──→ T032
```
