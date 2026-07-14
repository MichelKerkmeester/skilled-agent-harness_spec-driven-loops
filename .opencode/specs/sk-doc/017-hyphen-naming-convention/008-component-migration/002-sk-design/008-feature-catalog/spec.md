---
title: "Feature Specification: Feature-catalog (017 phase 008)"
description: "The sk-design hub and mode packets use feature_catalog roots, category directories, and feature files with underscores, while catalog indexes link to manual playbook paths."
trigger_phrases:
  - "feature-catalog naming phase"
  - "sk-design feature-catalog phase"
  - "017 feature-catalog"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/002-sk-design"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/002-sk-design/008-feature-catalog"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored feature-catalog spec"
    next_safe_action: "Execute phase on pinned worktree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/feature_catalog/"
      - ".opencode/skills/sk-design/design-interface/feature_catalog/"
      - ".opencode/skills/sk-design/design-md-generator/feature_catalog/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Feature-catalog (017 phase 008)

> Phase 008 of the sk-design component migration under `sk-doc/017-hyphen-naming-convention/008-component-migration/002-sk-design`. This document defines the future execution scope; this authoring pass performs no migration.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/008-component-migration/002-sk-design/008-feature-catalog |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-design |
| **Origin** | Phase 8 of the sk-design subtree in the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The sk-design hub and mode packets use feature_catalog roots, category directories, and feature files with underscores, while catalog indexes link to manual playbook paths.

**Purpose:** Rename every non-exempt feature-catalog root, category directory, and feature file to kebab-case and update catalog-owned references across the sk-design surface.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Build one recursive map for all seven feature-catalog trees and classify every root, category, and feature file.
- Rename the catalog filesystem paths and update catalog indexes, feature cross-references, and catalog-to-playbook links where the target path is in this phase.
- Preserve feature IDs, frontmatter field names, category values as data unless they are path/slugs, scenario semantics, and tool-mandated names.
- Record manual-playbook references for phase 009 so the two phases do not silently diverge.

### Live candidate boundary
- The seven roots `feature_catalog/` under the hub, audit, foundations, interface, mcp-open-design, md-generator, and motion surfaces become `feature-catalog/`
- Each `feature_catalog.md` index becomes `feature-catalog.md`
- Category directories such as `manager_shell`, `procedure_card_system`, `aesthetic_direction_process`, `delivery_gates`, `adaptation_and_data`, `token_system`, `restraint_gate_and_choreography`, `cluster_classify`, `feature_extractors`, `write_design_md`, `ai_tell_catalog`, and `findings_first_review` become hyphenated
- All underscore-bearing catalog feature files, including `context_adaptation_matrix.md`, `data_visualization_discipline.md`, `procedure_card_schema_and_selection.md`, `od_mcp_install.md`, `md_generator_procedure_card_inventory.md`, and `ai_fingerprint_tell_catalog.md`, become hyphenated

### Out of Scope
- Manual-testing-playbook filesystem names, benchmark artifacts, changelog files, component-local non-catalog references, and shared files.
- JSON/YAML/TOML keys, Markdown frontmatter field names, code identifiers, Python scripts/package dirs, SKILL.md, and package manifests.
- Changing feature meaning, scenario IDs, catalog taxonomy, or validator behavior.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|-------|-------|-------|
| REQ-001 | All seven feature-catalog roots and their contents are mapped. | The inventory covers every root, index, category directory, and file with no unclassified underscore path. |
| REQ-002 | Catalog indexes and feature links resolve. | Every catalog-owned Markdown link points to an existing hyphenated target. |
| REQ-003 | Catalog semantics are unchanged. | Feature IDs, category meaning, frontmatter keys, and cross-reference intent remain identical. |
| REQ-004 | The playbook handoff is explicit. | References whose target moves in phase 009 are listed for that phase and are not silently left unresolved. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No in-scope underscore path remains inside any sk-design feature-catalog tree.
- **SC-002**: Each catalog index still enumerates the same feature set by ID and resolves its links.
- **SC-003**: The cross-phase ledger accounts for every catalog→playbook reference.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|-------|-------|-------|-------|
| Risk | Seven parallel catalog trees drift in different ways. | High | Use one recursive inventory schema and compare pre/post feature IDs and link counts per root. |
| Risk | A category value is changed as if it were a path. | Medium | Change path-valued references only; preserve frontmatter keys and semantic values unless they identify a filesystem path. |

Dependencies: the canonical convention and exemption boundary in `001-convention-policy-and-scope/`; the pinned BASE and rename-map evidence from the program's earlier baseline/tooling phases; and the sibling handoffs named in this phase's plan.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- No blocking questions; the live tree enumerates the seven roots and phase 009 owns the paired playbook surface.
<!-- /ANCHOR:questions -->
