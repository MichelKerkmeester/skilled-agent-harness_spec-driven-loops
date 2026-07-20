---
title: "Feature Specification: create-readme resource names"
description: "The create-readme packet contains an install_guide directory and snake_case template/reference filenames. This phase renames those non-exempt resources to kebab-case and updates documentation and audit-script path references while keeping Python scripts and template payload keys exact."
trigger_phrases:
  - "create-readme resource naming"
  - "install guide kebab-case phase"
  - "create-readme template rename"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/002-create-readme"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/002-create-readme"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-readme phase docs"
    next_safe_action: "Build the create-readme rename map"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-readme/assets/", ".opencode/skills/sk-doc/create-readme/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: create-readme resource names
> Phase adjacency — predecessor `001-create-skill`; successor `003-create-agent`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | `sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/002-create-readme` |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc/create-readme |
| **Origin** | Phase 002 of the nested create-packets decomposition |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The create-readme packet's install-guide and README resources use underscores in directory and file names. These names are referenced by templates, examples, and the audit helper, so renaming only the visible files would leave the authoring workflow with broken links.

The outcome is a kebab-case create-readme resource tree with all path references updated and all document content semantics preserved.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rename `references/install_guide/` to `references/install-guide/`.
- Rename `assets/install_guide_template.md`, `assets/readme_code_template.md`, and `assets/readme_template.md`.
- Rename `quality_and_standards.md`, `section_examples.md`, `quality_and_checklist.md`, `types_and_voice.md`, and `writing_patterns.md` in their packet-owned reference directories.
- Update links and path values in `SKILL.md`, README, templates, references, and the audit helper's documentation.

### Out of Scope

- `SKILL.md`, `README.md`, package metadata, and other tool-mandated names.
- `scripts/audit_readmes.py`, Python package directories, code identifiers, content placeholders, and frontmatter fields.
- Resource names in other create-* packets.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `create-readme/assets/*_template.md` | Rename/reference update | Convert the three asset filenames |
| `create-readme/references/install_guide/` | Rename/reference update | Convert directory and two guide reference filenames |
| `create-readme/references/readme/` | Rename/reference update | Convert three README reference filenames |
| `create-readme/SKILL.md`, `README.md`, and docs | Modify | Repoint changed filesystem paths |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All listed create-readme resource names are kebab-case | The directory and eight files in the manifest have one target each and no unknown candidate remains |
| REQ-002 | Install-guide and README references remain distinct | Links resolve to the correct renamed reference domain and asset template |
| REQ-003 | Every path consumer is updated | Packet docs and audit-helper guidance contain no stale live old path |
| REQ-004 | Python and tool-mandated names remain exact | `SKILL.md`, `README.md`, and `audit_readmes.py` are not renamed |
| REQ-005 | Template payloads are unchanged | Only filesystem paths and path-valued references change in content diffs |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The create-readme asset and reference tree is kebab-case within scope.
- **SC-002**: Install-guide/README authoring and audit references resolve with unchanged document contracts.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | create-readme templates and references | Broken authoring links | Search old directory and basename tokens across the packet |
| Risk | Install-guide examples contain path-like text that is not a real path | Over-editing content | Change only links and filesystem path values |
| Risk | Audit helper references a template by a derived basename | Audit misses resources | Check literal, stem, and glob consumers |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The verifier must report any path built dynamically by the Python audit helper rather than editing Python identifiers.
<!-- /ANCHOR:questions -->
