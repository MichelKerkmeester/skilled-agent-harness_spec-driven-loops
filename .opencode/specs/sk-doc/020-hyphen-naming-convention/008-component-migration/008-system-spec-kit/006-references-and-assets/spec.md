---
title: "Feature Specification: References and assets (020 subtree 008 phase 006)"
description: "The system-spec-kit reference and asset surfaces contain a broad set of underscore-bearing Markdown filenames, plus MCP documentation and curated benchmark report files. This phase renames permitted reference/asset files and updates links and pointers while keeping tool-mandated names, generated artifacts, Python files, keys, and frozen history within their exemptions."
trigger_phrases:
  - "system-spec-kit references and assets"
  - "reference filename kebab-case"
  - "asset filename rename"
  - "benchmark_report rename"
  - "kebab-case phase 006"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit/006-references-and-assets"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored reference-asset docs"
    next_safe_action: "Execute the reference and asset file map after template pointers are stable"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: References and assets

> Phase adjacency under the 008 system-spec-kit subtree (grouping order, not a runtime dependency): predecessor 005-templates-and-examples; successor 007-shared-and-runtime.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit/006-references-and-assets |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | system-spec-kit |
| **Origin** | Phase 006 of the 008 system-spec-kit component migration under the 020 kebab-case program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The live reference inventory contains 42 underscore-bearing files under references/ and four under assets/, including daemon_cli_reference.md, environment_variables.md, template_mapping.md, validation_rules.md, and rename_pattern.md. The MCP surface also has ENV_REFERENCE.md, INSTALL_GUIDE.md, MODULE_MAP.md, and seven curated benchmark_report.md files. Links and path-derived pointers must move with these files.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename the 42 permitted underscore-bearing files under references/ and the four under assets/ to kebab-case, including nested templates, validation, workflows, memory, config, and CLI references.
- Rename MCP reference/asset documents ENV_REFERENCE.md, INSTALL_GUIDE.md, lib/MODULE_MAP.md, and curated benchmark_report.md files to semantic kebab targets unless the central classifier marks a file generated or frozen.
- Update Markdown links, SKILL.md resource maps, README pointers, scripts, frontmatter path values, benchmark indexes, and cross-reference tables.
- Preserve code identifiers, JSON/YAML/TOML keys, frontmatter fields, .py files, generated/lockfile artifacts, tool-mandated names, and frozen changelog/history content.

### Out of Scope
- Feature-catalog and manual-playbook trees, which are separate content surfaces in phases 008 and 009.
- Script filename moves, which phase 004 owns even when a script is referenced from a benchmark asset.
- Changing reference prose except where a path or link target requires the update.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The reference and asset candidate inventory is complete. | The report accounts for 42 reference files, four asset files, MCP documentation files, and seven curated benchmark reports with per-file dispositions. |
| REQ-002 | Permitted filenames use kebab-case targets. | Every rename candidate has a semantic source-to-target mapping with no collision or leading-hyphen hazard. |
| REQ-003 | Every link and pointer follows the file move. | Markdown links, resource maps, frontmatter path values, scripts, indexes, and README pointers resolve to the target files. |
| REQ-004 | Exempt and frozen surfaces are not rewritten. | Generated/lockfile outputs, tool-mandated names, keys, fields, Python targets, and frozen historical prose remain unchanged or explicitly dispositioned. |
| REQ-005 | Reference resolution is complete. | The central link checker reports zero broken active links and no unknown old-path disposition. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The active references/assets surface has no in-scope underscore-bearing filename.
- **SC-002**: All active links and path pointers resolve to kebab-case targets.
- **SC-003**: Curated benchmark and MCP reference documentation remain discoverable under their new names.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The reference tree contains path-like strings that are not links, while frontmatter fields must remain exact even when values carry paths. Benchmark reports are curated evidence, not automatically disposable output; their classification must be explicit. A whole-tree text replacement would corrupt keys and historical references.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No blocking questions. Execution must confirm the final per-file count and whether any MCP benchmark report is classified as generated rather than curated.
<!-- /ANCHOR:questions -->

