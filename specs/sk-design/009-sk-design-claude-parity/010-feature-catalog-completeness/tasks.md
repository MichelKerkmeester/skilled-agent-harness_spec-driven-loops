---
title: "Tasks: Phase 010 — Feature Catalog and Snippet Completeness"
description: "Level 2 task list for auditing sk-design's feature-catalog coverage and drafting the planned file layout for five new/augmented feature_catalog/ packages."
trigger_phrases:
  - "tasks"
  - "feature catalog completeness"
  - "sk-design feature catalog"
  - "phase 010"
importance_tier: "high"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/010-feature-catalog-completeness"
    last_updated_at: "2026-07-06"
    last_updated_by: "markdown-agent"
    recent_action: "Marked all T001-T030 tasks complete with real evidence."
    next_safe_action: "Complete: no further action needed for Phase 010."
---
# Tasks: Phase 010 — Feature Catalog and Snippet Completeness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path or evidence target) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Coverage Inventory and Template Read

- [x] T001 Inventory current `feature_catalog/` coverage across all six `sk-design` packages (`find **/feature_catalog -type f`) — confirmed hub + `design-interface` already complete (6 files each, out-of-band), `design-foundations` had only a root file, `design-motion`/`design-audit` were empty category shells, `design-md-generator` had categories 01-07 only [10m]
- [x] T002 Read the root scaffold template (`.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md`) [10m]
- [x] T003 Read the per-feature scaffold template (`.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_snippet_template.md`) [10m]
- [x] T004 Read the existing catalog (`.opencode/skills/sk-design/design-md-generator/feature_catalog/feature_catalog.md`) as a worked completeness baseline [15m]

### Mode and Hub Evidence Read

- [x] T005 [P] Read the DONE hub `feature_catalog.md` (manager-shell intake, proof gates, transport-vs-taste separation) as the reference shape [15m]
- [x] T006 [P] Read `shared/procedure_card_schema.md`-derived hub procedure-card-inventory.md and the per-mode `procedures/*.md` cards across all five owning packets [15m]
- [x] T007 [P] Read the DONE `design-interface/feature_catalog.md` and its `procedures/*.md` cards as the second reference shape [15m]
- [x] T008 [P] Read `design-foundations/README.md`, references (`oklch_workflow.md`, `typography_system.md`, `adaptation_matrix.md`, `data_viz.md`), and its 3 `procedures/*.md` cards [15m]
- [x] T009 [P] Read `design-motion/README.md`, references (`animation_decision_framework.md`, `performance_reduced_motion.md`, `animate_presence_patterns.md`), assets (`motion_pattern_cards.md`), and its 1 `procedures/*.md` card [10m]
- [x] T010 [P] Read `design-audit/README.md`, references (`audit_contract.md`, `ai_fingerprint_tells.md`), and its 2 `procedures/*.md` cards [10m]
- [x] T011 No logic-sync conflict found between this plan and current `sk-design` state; `mode-registry.json` still lists exactly 5 modes with unchanged `toolSurface` entries [10m]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Package Layout Drafting

- [x] T012 Hub package layout already complete out-of-band: `manager-shell/` (3 features) + `procedure-card-system/` (2 features) — verified untouched, 6 files [20m]
- [x] T013 [P] `design-interface` package already complete out-of-band: `aesthetic-direction-process/`, `delivery-gates/`, `procedure-cards/` (5 features) — verified untouched, 6 files [20m]
- [x] T014 [P] Authored the `design-foundations` package: `token-system/`, `adaptation-and-data/`, `procedure-cards/` (5 new per-feature files; root already existed) — 6 files total, `find` verified [20m]
- [x] T015 [P] Authored the `design-motion` package: `restraint-gate-and-choreography/`, `build-cards/`, `procedure-cards/` (root + 4 new per-feature files) — 5 files total, `find` verified [20m]
- [x] T016 [P] Authored the `design-audit` package: `findings-first-review/`, `ai-tell-catalog/`, `procedure-cards/` (root + 4 new per-feature files) — 5 files total, `find` verified [20m]
- [x] T017 Authored the `design-md-generator` completeness fix: new `procedure-cards/md-generator-procedure-card-inventory.md` and a new root "9. PROCEDURE CARDS" section — 9 files total, `grep -n "^## "` confirms sections 1-8 unchanged plus new section 9 [15m]

### Evidence and Contract Citation

- [x] T018 Cited real source-evidence files (README/SKILL.md/references/procedures paths) in every new/updated Source Files section across all four remediated packages [20m]
- [x] T019 Cited `feature_catalog_template.md`/`feature_catalog_snippet_template.md` as the authoring contract for every new file (frontmatter + section shape matches both templates) [10m]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Layout Consistency

- [x] T020 Confirmed every root catalog entry maps 1:1 to a per-feature file across all six packages (18 new/changed files match `spec.md`'s layout table; `find` counts: foundations 6, motion 5, audit 5, md-generator 9) [15m]
- [x] T021 Confirmed category directory numbering (`NN--category-name`) is internally consistent within each package [10m]
- [x] T022 Confirmed all new prose uses "current reality" phrasing with no packet/phase-number references (`spec.md` §3 In Scope note) [10m]

### Scope Boundary

- [x] T023 Confirmed via `git status --short -- .opencode/skills/sk-design .opencode/specs/sk-design/.../010-feature-catalog-completeness` that only the five named `feature_catalog/**` package paths changed under `.opencode/skills/sk-design/**`, no `.opencode/skills/sk-doc/**` file was touched, and hub/`design-interface` show zero modifications [10m]
- [x] T024 Ran `python3 .opencode/skills/sk-doc/scripts/validate_document.py <path>` (auto-detects `feature_catalog` document type for per-feature files) on all 18 new/changed files — 0 issues on every file [5m]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification and Handoff

### Verification
- [x] T025 Ran strict spec validation for this phase folder (validation evidence recorded in `implementation-summary.md`) [5m]
- [x] T026 Updated `checklist.md` P0/P1/P2 rows with real evidence [15m]
- [x] T027 Confirmed docs now claim implementation completion consistently, since all catalog packages are written and validated (`spec.md`, `plan.md`, `tasks.md`, `checklist.md` all reconciled) [10m]

### Documentation and Handoff
- [x] T028 Rollback path and stop triggers remain recorded in `plan.md` §7 (non-destructive review before recovery) [5m]
- [x] T029 Recorded handoff criteria for Phase 011 (`manual-testing-playbook-alignment`) (`spec.md` Related Documents) [10m]
- [x] T030 Regenerated `description.json`/`graph-metadata.json` via `generate-context.js` as the final step, then re-ran strict validation [10m]

<!-- /ANCHOR:phase-4 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All six `sk-design` packages have a real, populated feature-catalog: 2 already complete out-of-band (hub, `design-interface`), 3 newly authored in full (`design-foundations`, `design-motion`, `design-audit`), and 1 audited and augmented (`design-md-generator`).
- [x] Every new/updated file cites a real sk-doc template and a real source-evidence file.
- [x] The `design-md-generator` completeness gap is closed with the named fix (new category + file + root section).
- [x] Only the five named `feature_catalog/**` package paths were written under `.opencode/skills/sk-design/**`; no `.opencode/skills/sk-doc/**` file was edited by this phase.
- [x] `checklist.md` reflects the completed state with real evidence for every item.
- [x] Strict validation passes (Errors: 0) after metadata regeneration.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Predecessor Phase**: See `../009-readme-alignment/`
- **Successor Phase**: See `../011-manual-testing-playbook-alignment/`

<!-- /ANCHOR:cross-refs -->
