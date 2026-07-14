---
title: "Feature Specification: Design-md-generator (017 phase 006)"
description: "The md-generator mode contains underscore-bearing authoring, extraction, and validation resource names, including its installation guide and private extraction procedure."
trigger_phrases:
  - "design-md-generator naming phase"
  - "sk-design design-md-generator phase"
  - "017 design-md-generator"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/002-sk-design"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/002-sk-design/006-design-md-generator"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored design-md-generator spec"
    next_safe_action: "Execute phase on pinned worktree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/SKILL.md"
      - ".opencode/skills/sk-design/design-md-generator/references/"
      - ".opencode/skills/sk-design/design-md-generator/backend/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Design-md-generator (017 phase 006)

> Phase 006 of the sk-design component migration under `sk-doc/017-hyphen-naming-convention/008-component-migration/002-sk-design`. This document defines the future execution scope; this authoring pass performs no migration.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/008-component-migration/002-sk-design/006-design-md-generator |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-design |
| **Origin** | Phase 6 of the sk-design subtree in the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The md-generator mode contains underscore-bearing authoring, extraction, and validation resource names, including its installation guide and private extraction procedure.

**Purpose:** Rename the md-generator mode's non-exempt filesystem names to kebab-case and update its extraction and validation references while preserving the backend contract.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename the md-generator guide, assets, private procedure, and reference paths listed above.
- Update SKILL.md, README.md, extraction procedure citations, backend documentation, and local Markdown links.
- Keep the embedded backend implementation and its TypeScript module filenames unchanged unless a separate frozen map classifies a candidate.
- Defer feature-catalog and manual-testing-playbook trees to phases 008/009.

### Live candidate boundary
- `INSTALL_GUIDE.md` → `INSTALL-GUIDE.md`
- `assets/cardinal_rules_card.md`, `design_md_prompt_template.md`, and `source_of_truth_router_card.md` become hyphenated
- `procedures/design_system_extraction.md` becomes `design-system-extraction.md`
- `references/authoring_boundary.md`, `color_role_taxonomy.md`, `component_taxonomy.md`, `design_md_format.md`, `extraction_workflow.md`, `guided_run.md`, `quality_checklist.md`, and `writing_style_guide.md` become hyphenated
- `references/examples/editorial_exemplar.md` becomes `editorial-exemplar.md`; backend TypeScript modules and tool-mandated SKILL.md remain exact

### Out of Scope
- Backend behavior, Playwright extraction logic, generated DESIGN.md output, Python package/script exemptions, and data keys.
- Feature-catalog, manual-testing-playbook, shared, benchmark, changelog, SKILL.md, and package manifests.
- Changing the md-generator procedure selection rules; only its path references move.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|-------|-------|-------|
| REQ-001 | All non-exempt mode-local underscore names are mapped. | The map covers INSTALL_GUIDE.md, assets, the extraction procedure, references, and examples. |
| REQ-002 | Extraction references remain valid. | SKILL.md, README.md, procedure citations, and links resolve to the new paths. |
| REQ-003 | The backend boundary is preserved. | Backend code, module semantics, generated artifact names, and tool-mandated names are not changed by this phase. |
| REQ-004 | Catalog/playbook ownership is preserved. | The phase report records those trees as deferred, not partially renamed. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The md-generator non-catalog/playbook tree is kebab-clean.
- **SC-002**: The private extraction procedure remains discoverable at its new path.
- **SC-003**: A path-resolution sweep finds zero stale md-generator resource paths.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|-------|-------|-------|-------|
| Risk | INSTALL_GUIDE.md is assumed to be tool-mandated because of its uppercase style. | Medium | The exemption names only SKILL.md, mode-registry.json, manifests, Python surfaces, and other declared tool names; map INSTALL_GUIDE.md explicitly. |
| Risk | Backend references use the old documentation paths. | Medium | Search the whole component, including backend docs and README links, before closing the phase. |

Dependencies: the canonical convention and exemption boundary in `001-convention-policy-and-scope/`; the pinned BASE and rename-map evidence from the program's earlier baseline/tooling phases; and the sibling handoffs named in this phase's plan.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- No blocking questions; the live component tree identifies the documentation surface and the backend remains an explicit boundary.
<!-- /ANCHOR:questions -->
