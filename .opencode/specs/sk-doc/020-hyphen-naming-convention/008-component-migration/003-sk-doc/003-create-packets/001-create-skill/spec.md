---
title: "Feature Specification: create-skill resource names"
description: "The create-skill packet uses snake_case directories and template/reference filenames throughout its parent-skill and ordinary skill resource trees. This phase converts those non-exempt filesystem names to kebab-case and updates generator and documentation references while preserving SKILL.md, manifests, and Python scripts."
trigger_phrases:
  - "create-skill resource naming"
  - "create-skill kebab-case phase"
  - "parent skill template rename"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/001-create-skill"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/001-create-skill"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-skill phase docs"
    next_safe_action: "Build the create-skill rename map"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-skill/assets/", ".opencode/skills/sk-doc/create-skill/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: create-skill resource names

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | `sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/001-create-skill` |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc/create-skill |
| **Origin** | Phase 001 of the nested create-packets decomposition |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The create-skill packet's resource names encode parent-skill and skill template concepts with underscores. These names are filesystem paths consumed by scaffolding instructions and package documentation, not Python identifiers. A partial rename would leave generated links or parent-skill references pointing at missing files.

The outcome is a component-local kebab-case resource tree with every path consumer updated and the tool contract unchanged.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rename `assets/parent_skill/` and `references/parent_skill/` to `parent-skill/`.
- Rename `parent_skill_description_template.json`, `parent_skill_graph_metadata_template.json`, `parent_skill_hub_router_template.json`, `parent_skill_hub_template.md`, and `parent_skill_registry_template.json` to kebab-case.
- Rename `assets/parent_skill/scaffold/hub_skill_scaffold.md` and `packet_skill_scaffold.md` to kebab-case.
- Rename skill assets `skill_asset_template.md`, `skill_md_template.md`, `skill_procedure_template.md`, `skill_readme_template.md`, `skill_reference_template.md`, `skill_scaffold_template.md`, and `skill_smart_router.md`.
- Rename `parent_hub_router_schema.md`, `parent_skills_nested_packets.md`, `common_pitfalls.md`, `validation_and_packaging.md`, `creation_workflow.md`, and `examples_and_maintenance.md` in their packet-owned reference directories.
- Update `SKILL.md`-adjacent documentation, template links, scaffold instructions, and Python-script path values.

### Out of Scope

- `SKILL.md`, `README.md`, package manifests, registry metadata, and other tool-mandated names.
- `.py` script filenames and Python package directories under `scripts/`.
- Content identifiers, JSON keys, frontmatter fields, and resources in other create-* packets.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `create-skill/assets/parent_skill/` | Rename/reference update | Kebab-case the parent-skill directory, five templates, and two scaffold files |
| `create-skill/assets/skill/` | Rename/reference update | Kebab-case seven skill template/resource filenames |
| `create-skill/references/parent_skill/` and `references/skill/` | Rename/reference update | Kebab-case reference directories and six reference filenames |
| `create-skill/references/shared/` | Rename/reference update | Rename the two packet-local shared reference files |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All listed non-exempt create-skill resource names use kebab-case | Directory and filename census matches the component manifest with no unknown candidate |
| REQ-002 | Every create-skill path consumer follows the target names | `SKILL.md`, README, references, scaffold text, and generator path values resolve after the rename |
| REQ-003 | Tool-mandated and Python names remain exact | `SKILL.md`, manifests, `.py` files, and Python package directories have no rename entries |
| REQ-004 | Parent-skill and ordinary-skill resource domains remain distinct | Parent and skill template links resolve to their corresponding renamed directories |
| REQ-005 | No content key or identifier is changed as a side effect | Diff review separates filesystem path updates from template payload fields |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The create-skill assets and references have no in-scope snake_case filesystem name.
- **SC-002**: Skill and parent-skill scaffolding resolves the renamed resources without changing generated contract content.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | create-skill `SKILL.md` and README | Stale links or loader paths | Search all relative path values and render/read each target |
| Risk | Parent-skill directory is referenced from multiple scaffold examples | Partial resource loading | Search both `parent_skill` and each basename stem across the packet |
| Risk | Python helper path is included in a mechanical rename | Import failure | Keep `.py` basenames and package directories in the explicit exemption list |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Dynamic path assembly must be recorded in the execution evidence if static reference search cannot resolve it.
<!-- /ANCHOR:questions -->
