---
title: "Feature Specification: create-feature-catalog resource names"
description: "The create-feature-catalog packet contains snake_case asset template filenames and a shared pitfalls reference. This phase renames those non-exempt resources to kebab-case and updates packet-local path references without changing catalog schema fields or feature identifiers."
trigger_phrases:
  - "create-feature-catalog resource naming"
  - "feature catalog kebab-case phase"
  - "feature catalog template rename"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/005-create-feature-catalog"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/005-create-feature-catalog"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored feature catalog phase docs"
    next_safe_action: "Build the feature catalog rename map"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-feature-catalog/assets/", ".opencode/skills/sk-doc/create-feature-catalog/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: create-feature-catalog resource names

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | `sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/005-create-feature-catalog` |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc/create-feature-catalog |
| **Origin** | Phase 005 of the nested create-packets decomposition |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The feature-catalog authoring packet names both of its asset templates and its pitfalls reference with underscores. These files are consumed as packet resources, while catalog field names and feature IDs are content contracts that must not be normalized by a filesystem rename.

The outcome is a kebab-case resource surface with resolved template links and unchanged catalog schema semantics.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rename `assets/feature_catalog_snippet_template.md` to `feature-catalog-snippet-template.md`.
- Rename `assets/feature_catalog_template.md` to `feature-catalog-template.md`.
- Rename `references/common_pitfalls.md` to `common-pitfalls.md`.
- Update packet-local links and path values in `SKILL.md`, README, templates, and references.
- Distinguish external feature-catalog path values from names owned by this packet.

### Out of Scope

- Catalog field keys, feature identifiers, frontmatter fields, and example payload keys.
- `SKILL.md`, `README.md`, changelog files, package metadata, and other mandated names.
- External catalog surfaces and other create-* packets.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `create-feature-catalog/assets/{feature_catalog_snippet_template,feature_catalog_template}.md` | Rename/reference update | Convert the two asset filenames |
| `create-feature-catalog/references/common_pitfalls.md` | Rename/reference update | Convert the pitfalls reference filename |
| `create-feature-catalog/SKILL.md`, `README.md`, and docs | Modify | Repoint packet-owned resource paths |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The three packet-owned resources use kebab-case | Manifest and filesystem census match exactly |
| REQ-002 | Template and reference links resolve | Every packet-local old path consumer points at its target |
| REQ-003 | Catalog schema content remains stable | No field key, feature ID, frontmatter field, or payload key changes as a side effect |
| REQ-004 | External path boundaries remain explicit | Paths owned by another surface are not silently renamed in this phase |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three create-feature-catalog resource names are kebab-case.
- **SC-002**: Feature-catalog templates remain usable with unchanged catalog semantics.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Feature-catalog templates | Authoring links break | Resolve all packet-local template links |
| Risk | A catalog key resembles a filesystem name | Schema drift | Review key/value changes separately from path changes |
| Risk | External catalog paths are edited under this scope | Cross-phase collision | Classify path ownership before editing |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Any cross-surface path consumer must be reported to the owning phase rather than expanded here.
<!-- /ANCHOR:questions -->
