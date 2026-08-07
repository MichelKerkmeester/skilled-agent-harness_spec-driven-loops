---
title: "Feature Specification: Hub root and shared (020 phase 001)"
description: "The sk-design hub and shared reference base still contain snake_case Markdown asset names, so routing instructions and cross-mode references cannot be treated as kebab-clean."
trigger_phrases:
  - "hub-root-and-shared naming phase"
  - "sk-design hub/shared phase"
  - "020 hub-root-and-shared"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design/001-hub-root-and-shared"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored hub/shared spec"
    next_safe_action: "Execute phase on pinned worktree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/README.md"
      - ".opencode/skills/sk-design/shared/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Hub root and shared (020 phase 001)
> Phase adjacency — successor `002-design-interface`.

> Phase 001 of the sk-design component migration under `sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design`. This document defines the future execution scope; this authoring pass performs no migration.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design/001-hub-root-and-shared |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-design |
| **Origin** | Phase 1 of the sk-design subtree in the 020 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The sk-design hub and shared reference base still contain snake_case Markdown asset names, so routing instructions and cross-mode references cannot be treated as kebab-clean.

**Purpose:** Rename only the non-exempt hub/shared filesystem names to kebab-case and update every reference that resolves those paths.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Build the phase-local source→target map for the shared Markdown assets and cards listed above.
- Rename the shared Markdown files and update hub, mode, README, and shared-document links that point to them.
- Preserve the shared directory structure, frontmatter fields, JSON/YAML/TOML keys, code identifiers, and Python script filenames.
- Record every candidate as rename or exempt so later phases can consume an unambiguous boundary.

### Live candidate boundary
- `shared/anti_slop_principles.md` → `shared/anti-slop-principles.md`; `shared/cognitive_laws.md` → `shared/cognitive-laws.md`
- `shared/context_loading_contract.md`, `design_dispatch_boundary.md`, `design_proof_token.md`, `design_token_vocabulary.md`, `numeric_design_laws.md`, `procedure_card_schema.md`, and `sk_code_handoff.md` become their hyphenated names
- `shared/assets/context_loaded_card.md`, `proof_of_application_card.md`, `register_card.md`, and `variant_parameter_contract.md` become their hyphenated names
- `shared/procedures/polish_gate_orchestration.md` becomes `polish-gate-orchestration.md`
- `shared/scripts/*.py` remains exact under the Python-script exemption; the existing hyphenated `*.mjs` helpers remain unchanged

### Out of Scope
- Mode-local assets, references, procedures, scripts, feature catalogs, playbooks, benchmark artifacts, and changelog entries; those belong to sibling phases.
- SKILL.md, mode-registry.json, package manifests, and Python scripts or package directories named by the exemption policy.
- Executing any rename or changing runtime behavior during this authoring pass.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|-------|-------|-------|
| REQ-001 | The shared Markdown candidate set is complete. | The inventory lists every non-exempt underscore-bearing shared path and marks each Python script as exempt. |
| REQ-002 | Shared Markdown names use kebab-case after execution. | No in-scope shared Markdown file retains an underscore in its filesystem name. |
| REQ-003 | Hub and shared references remain resolvable. | The reference sweep finds no stale old shared path and no broken new path. |
| REQ-004 | The exemption boundary is preserved. | SKILL.md, tool-mandated names, Python scripts, package dirs, identifiers, and data keys are unchanged. |
| REQ-005 | The phase records its rename evidence for the subtree gate. | The source-to-target path map, stale-reference sweep, and exemption report are captured as evidence for `012-skill-gate`. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The shared reference base is kebab-clean outside the declared exemptions.
- **SC-002**: Hub and cross-mode consumers resolve the renamed shared files without changing routing semantics.
- **SC-003**: The phase evidence contains the source→target map, stale-reference sweep, and exemption report.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|-------|-------|-------|-------|
| Risk | Shared files are cited by every design mode. | High | Generate the consumer list from the live tree before any rename and verify every reference after the map is applied. |
| Risk | A Python helper is mistaken for a filesystem candidate. | Medium | Classify by extension and package role before applying the kebab rule. |

Dependencies: the canonical convention and exemption boundary in `001-convention-policy-and-scope/`; the pinned BASE and rename-map evidence from the program's earlier baseline/tooling phases; and the sibling handoffs named in this phase's plan.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- No blocking questions; the live shared tree and the program exemption boundary define the candidate set.
<!-- /ANCHOR:questions -->
