---
title: "Feature Specification: Manual-testing-playbook (032 phase 009)"
description: "The sk-design hub and mode packets use manual_testing_playbook roots, category directories, scenario files, and index names with underscores, and catalog/index references point into those paths."
trigger_phrases:
  - "manual-testing-playbook naming phase"
  - "sk-design manual-testing-playbook phase"
  - "032 manual-testing-playbook"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design/009-manual-testing-playbook"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored manual-testing-playbook spec"
    next_safe_action: "Execute phase on pinned worktree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/manual_testing_playbook/"
      - ".opencode/skills/sk-design/design-interface/manual_testing_playbook/"
      - ".opencode/skills/sk-design/design-md-generator/manual_testing_playbook/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Manual-testing-playbook (032 phase 009)

> Phase 009 of the sk-design component migration under `sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design`. This document defines the future execution scope; this authoring pass performs no migration.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design/009-manual-testing-playbook |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-design |
| **Origin** | Phase 9 of the sk-design subtree in the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The sk-design hub and mode packets use manual_testing_playbook roots, category directories, scenario files, and index names with underscores, and catalog/index references point into those paths.

**Purpose:** Rename every non-exempt manual-testing-playbook root, category directory, and scenario file to kebab-case and update all playbook-owned references.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Build one recursive map for all seven manual-testing-playbook trees, including roots, indexes, category directories, and scenario files.
- Rename the playbook filesystem paths and update each root index, scenario link, catalog cross-reference, and SKILL/README path that targets a playbook file.
- Preserve scenario IDs, headings, evidence contracts, frontmatter fields, and the distinction between scenario content and filesystem path values.
- Consume the phase-008 catalog handoff so catalog and playbook links converge on the final paths.

### Live candidate boundary
- The seven roots `manual_testing_playbook/` under the hub, audit, foundations, interface, mcp-open-design, md-generator, and motion surfaces become `manual-testing-playbook/`
- Each `manual_testing_playbook.md` index becomes `manual-testing-playbook.md`
- Category directories such as `advisor_integration`, `fallback_and_resilience`, `hub_manager_intake`, `md_generator_pipeline`, `mode_routing`, `parity_behavior`, `shared_reference_base`, `transform_verb_framing`, `procedure_card_contract`, `brief_to_dials_intake`, `real_ui_loop`, `a11y_performance`, `evidence_worksheet`, `slop_hardening`, `dark_mode`, `gated_runs`, and `advanced_craft` become hyphenated
- All underscore-bearing scenario files, including `context_first_intake.md`, `gated_verb_confirm.md`, `interaction_state_matrix.md`, `performance_and_reduced_motion.md`, `ai_fingerprint_tells.md`, and `content_and_mock_data_gate_on_built_ui.md`, become hyphenated

### Out of Scope
- Feature-catalog filesystem names, benchmark artifacts, changelog files, component-local non-playbook names, and shared files.
- Python scripts/package dirs, tool-mandated filenames, JSON/YAML/TOML keys, frontmatter fields, scenario IDs, and scenario behavior.
- Adding or deleting scenarios; this phase changes paths and path references only.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|-------|-------|-------|
| REQ-001 | All seven playbook roots and contents are mapped. | The inventory covers every root, index, category directory, and scenario file with no unknown disposition. |
| REQ-002 | Playbook indexes and scenario links resolve. | Root indexes, category references, catalog links, and SKILL/README references point to existing hyphenated targets. |
| REQ-003 | Scenario identity and evidence contracts are preserved. | Scenario IDs, headings, expected outcomes, and evidence requirements remain unchanged. |
| REQ-004 | The catalog/playbook handoff is closed. | Every cross-reference from phase 008 is either updated or explicitly proven exempt/non-path data. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No in-scope underscore path remains inside any sk-design manual-testing-playbook tree.
- **SC-002**: Scenario counts and IDs match the pre-rename inventory for all seven roots.
- **SC-003**: A whole-surface stale-reference sweep finds no old playbook path.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|-------|-------|-------|-------|
| Risk | A root index and per-scenario links are updated inconsistently. | High | Verify link targets from each root index and compare scenario IDs/counts before and after. |
| Risk | A conceptual category value is changed with the directory name. | Medium | Preserve semantic values and change only path-valued references or filesystem names. |

Dependencies: the canonical convention and exemption boundary in `001-convention-policy-and-scope/`; the pinned BASE and rename-map evidence from the program's earlier baseline/tooling phases; and the sibling handoffs named in this phase's plan.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- No blocking questions; phase 008 supplies the catalog handoff and the seven live playbook roots are known.
<!-- /ANCHOR:questions -->
