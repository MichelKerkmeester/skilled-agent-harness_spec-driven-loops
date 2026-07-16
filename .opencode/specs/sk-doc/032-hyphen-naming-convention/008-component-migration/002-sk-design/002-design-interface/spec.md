---
title: "Feature Specification: Design-interface (032 phase 002)"
description: "The design-interface mode has underscore-bearing procedure, asset, and reference names while its SKILL.md and README.md cite those paths directly."
trigger_phrases:
  - "design-interface naming phase"
  - "sk-design design-interface phase"
  - "032 design-interface"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/002-sk-design"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/002-sk-design/002-design-interface"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored design-interface spec"
    next_safe_action: "Execute phase on pinned worktree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
      - ".opencode/skills/sk-design/design-interface/README.md"
      - ".opencode/skills/sk-design/design-interface/references/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Design-interface (032 phase 002)

> Phase 002 of the sk-design component migration under `sk-doc/032-hyphen-naming-convention/008-component-migration/002-sk-design`. This document defines the future execution scope; this authoring pass performs no migration.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/032-hyphen-naming-convention/008-component-migration/002-sk-design/002-design-interface |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-design |
| **Origin** | Phase 2 of the sk-design subtree in the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The design-interface mode has underscore-bearing procedure, asset, and reference names while its SKILL.md and README.md cite those paths directly.

**Purpose:** Rename the design-interface mode's non-exempt filesystem names to kebab-case and keep its routing, procedure, and handoff references intact.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Inventory and rename the interface assets, procedures, and reference directories/files listed above.
- Update SKILL.md, README.md, procedure links, reference tables, and handoff paths that resolve these names.
- Keep the feature-catalog and manual-testing-playbook roots and their contents for phases 008 and 009.
- Preserve command names, frontmatter keys, design vocabulary, and all tool-mandated filenames.

### Live candidate boundary
- `assets/interface_preflight_card.md` → `interface-preflight-card.md`
- `procedures/aesthetic_direction.md`, `deck_direction_spec.md`, `discovery_question_round.md`, `prototype_flow_spec.md`, `variation_set.md`, and `wireframe_exploration.md` become hyphenated
- `references/design_grounding/` → `references/design-grounding/` and `design_inventory.md`, `design_references_mcp.md` become hyphenated
- `references/design_process/` → `references/design-process/` and its underscore-bearing files become hyphenated
- `references/mcp_tooling/` → `references/mcp-tooling/`; `mobbin_tools.md` and `refero_tools.md` become hyphenated

### Out of Scope
- The feature-catalog and manual-testing-playbook trees, shared files, benchmark artifacts, and changelog.
- Python scripts, Python package directories, SKILL.md, mode-registry.json, package manifests, and non-filesystem identifiers.
- Any design behavior, routing rule, or content rewrite unrelated to path references.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|-------|-------|-------|
| REQ-001 | Every non-exempt underscore path in the mode-local surface is mapped. | The map covers assets, procedures, reference directories, and reference files, with no unknown bucket. |
| REQ-002 | Mode-local references are updated in lockstep. | SKILL.md, README.md, and all affected Markdown path links point to the target names. |
| REQ-003 | The mode contract is behaviorally unchanged. | The registry route, procedure selection, shared handoff, and resource-loading semantics remain identical. |
| REQ-004 | Sibling ownership is respected. | Catalog/playbook names are handed to phases 008/009 rather than partially renamed here. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The design-interface tree outside catalog/playbook is free of in-scope underscores.
- **SC-002**: A path-resolution sweep reports zero stale or broken mode-local references.
- **SC-003**: The phase report distinguishes path changes from unchanged identifiers and tool-mandated names.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|-------|-------|-------|-------|
| Risk | The mode has dense SKILL.md resource tables. | High | Use the rename map to drive reference replacement and verify every listed resource path exists. |
| Risk | Catalog/playbook links are changed in the wrong phase. | Medium | Keep those roots in the phase-008/009 handoff ledger and only update local non-catalog/playbook paths here. |

Dependencies: the canonical convention and exemption boundary in `001-convention-policy-and-scope/`; the pinned BASE and rename-map evidence from the program's earlier baseline/tooling phases; and the sibling handoffs named in this phase's plan.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- No blocking questions; the component boundary is the design-interface directory minus its catalog and playbook subtrees.
<!-- /ANCHOR:questions -->
