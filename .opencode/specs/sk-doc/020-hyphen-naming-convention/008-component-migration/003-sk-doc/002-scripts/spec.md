---
title: "Feature Specification: sk-doc scripts and test fixtures"
description: "The sk-doc scripts tree contains snake_case markdown fixture filenames and Python script names that must be treated differently. This phase renames only the non-Python filesystem names, updates their sourcing/import/registry references, and records the Python exemption explicitly."
trigger_phrases:
  - "sk-doc scripts naming"
  - "sk-doc test fixture kebab-case"
  - "020 scripts phase"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/002-scripts"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/002-scripts"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored scripts phase docs"
    next_safe_action: "Build the scripts rename and reference map"
    blockers: []
    key_files: [".opencode/skills/sk-doc/scripts/", ".opencode/skills/sk-doc/scripts/tests/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: sk-doc scripts and test fixtures

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | `sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/002-scripts` |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 002 of the sk-doc component migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The scripts tree mixes executable helpers, facade symlinks, and markdown test fixtures. Thirteen non-Python fixture/test filenames use underscores, while the executable `.py` names are intentionally exempt and the remaining `.sh`, `.js`, and `.mjs` names are already hyphenated. Without a file-type-aware manifest, the phase could rename Python scripts and break imports or miss fixture references.

The outcome is a complete scripts-tree path map with kebab-case non-Python names, unchanged Python names and package semantics, and updated test/resource references.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rename `scripts/tests/command/auto_detect_command.md` to `auto-detect-command.md`.
- Rename `scripts/tests/missing_emojis.md`, `missing_sections.md`, `missing_toc.md`, and `single_dash_anchors.md` to kebab-case.
- Rename `scripts/tests/specs/auto_detect_spec.md` to `auto-detect-spec.md`.
- Rename `scripts/tests/valid_command.md`, `valid_install_guide.md`, `valid_readme.md`, `valid_skill.md`, and `valid_spec.md` to kebab-case.
- Rename `scripts/tests/test_flowchart_validator.sh` and `test_frontmatter_version.mjs` to kebab-case.
- Update references in test runners, fixture indexes, README paths, and any script registry/source/import path that points to these files.
- Audit every executable filename and record already-hyphenated scripts plus Python-exempt filenames in the manifest.

### Out of Scope

- `.py` filenames such as `audit_readmes.py`, `quick_validate.py`, `test_create_skill_contract.py`, and `validate_document.py`.
- Python import-package directories, tool-mandated names, code identifiers, and test content keys.
- Shared non-Python resources, create-* packet resources, and the root manual playbook, handled by sibling phases.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/scripts/tests/command/auto_detect_command.md` | Rename | Convert the command fixture filename |
| `.opencode/skills/sk-doc/scripts/tests/{missing_emojis,missing_sections,missing_toc,single_dash_anchors}.md` | Rename | Convert root fixture filenames |
| `.opencode/skills/sk-doc/scripts/tests/specs/auto_detect_spec.md` | Rename | Convert the spec fixture filename |
| `.opencode/skills/sk-doc/scripts/tests/{valid_command,valid_install_guide,valid_readme,valid_skill,valid_spec}.md` | Rename | Convert the validation fixture filenames |
| `.opencode/skills/sk-doc/scripts/tests/{test_flowchart_validator.sh,test_frontmatter_version.mjs}` | Rename | Convert non-Python test runner filenames |
| `.opencode/skills/sk-doc/scripts/` consumers | Modify | Update path references while keeping Python facade names exact |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All non-Python snake_case names in the scripts scope are renamed | The thirteen fixture/test names have one kebab-case target each and no other non-exempt candidate is unclassified |
| REQ-002 | Python script names remain exempt | No `.py` basename or Python package directory appears in the rename diff, including facade symlinks named after Python scripts |
| REQ-003 | Script and fixture references are closed | Test commands, fixture loaders, README links, and path-valued registry entries resolve to the new names |
| REQ-004 | Existing non-Python executable names remain stable when already canonical | Already-kebab names such as `check-frontmatter-versions.sh` and `frontmatter-version.mjs` are not rewritten |
| REQ-005 | The scripts test surface remains discoverable | The existing test inventory runs or loads every renamed fixture through its new path |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The thirteen non-Python snake_case fixture/test paths are kebab-case and fully referenced.
- **SC-002**: Python script exemptions and existing symlink facade names are preserved without import or dispatch drift.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 001 convention policy and scope | File-type boundary is misapplied | Classify by extension and package semantics before editing |
| Risk | A test loader derives fixture paths dynamically | Tests fail only at runtime | Search basename stems and execute fixture discovery |
| Risk | A Python facade symlink is treated as a rename candidate | Import/dispatch behavior breaks | Compare symlink names and targets separately from target resources |
| Risk | A fixture filename is mistaken for a content identifier | Assertions or keys change unnecessarily | Change only filesystem path tokens and links |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. If a dynamic fixture glob cannot be proven statically, the execution report must include the exact discovery command and result.
<!-- /ANCHOR:questions -->
