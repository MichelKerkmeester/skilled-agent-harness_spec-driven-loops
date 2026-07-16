---
title: "Feature Specification: mcp-code-mode references and assets (032 component 011 phase 003)"
description: "The skill's reference and asset directories contain four permitted snake_case Markdown filenames: naming_convention.md, tool_catalog.md, config_template.md, and env_template.md. This phase renames those files to kebab-case and closes every active link and path pointer while leaving tool-name examples, keys, Python paths, and frozen changelog history intact."
trigger_phrases:
  - "mcp-code-mode references and assets"
  - "mcp-code-mode phase 003"
  - "reference asset kebab-case closure"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/011-mcp-code-mode"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/003-references-and-assets"
    last_updated_at: "2026-07-14T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored references-assets docs"
    next_safe_action: "Freeze the four-file path map"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: mcp-code-mode references and assets

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/032-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/003-references-and-assets |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 003 of the 032 mcp-code-mode component migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The mcp-code-mode references and assets tree uses underscore filenames for two reference documents and two copy-ready templates. The main guide, README, configuration reference, architecture/workflow references, scripts, and the templates themselves link to those paths, so isolated renames would create broken navigation.

This phase applies the exact four-file kebab-case map and updates every active path pointer to it. It changes filesystem paths and links only; tool-call names, JSON/YAML/TOML keys, frontmatter fields, Python paths, and frozen changelog records remain untouched.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- references/naming_convention.md → references/naming-convention.md.
- references/tool_catalog.md → references/tool-catalog.md.
- assets/config_template.md → assets/config-template.md.
- assets/env_template.md → assets/env-template.md.
- Active Markdown links, router/resource lists, script messages, and path-valued pointers to those four files.

### Out of Scope
- Snake_case words inside tool names, code examples, JSON/YAML/TOML keys, frontmatter fields, or prose.
- Frozen changelog history and generated metadata unless its owning generator requires a path-valued refresh.
- The mcp-server directory, scripts, runtime, manual-testing tree, other skills, and migration execution during this authoring pass.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The four permitted reference/asset filenames use kebab-case | The rename map contains exactly the four source-to-target pairs listed in scope |
| REQ-002 | Active links and pointers follow the new names | Markdown link resolution and path scans find no stale active source filename |
| REQ-003 | Cross-links among the four files remain valid | The naming, catalog, config template, and env template navigation links resolve from their new relative locations |
| REQ-004 | Main skill consumers are updated | SKILL.md, README.md, configuration.md, architecture.md, workflows.md, and scripts/update.sh contain only final active paths where applicable |
| REQ-005 | The exemption boundary is preserved | Tool-name underscores, data keys, frontmatter fields, Python paths, and frozen changelog references are not treated as filesystem renames |
| REQ-006 | The phase produces evidence for all references | The candidate report records the path map, link scan, stale-hit scan, and any generated/frozen dispositions |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The four reference/asset documents are addressed through kebab-case paths and all active links resolve.
- **SC-002**: No content contract is changed merely because an underscore appears in a tool name, key, field, or historical path.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The high-risk edge is a relative link that crosses references and assets, especially the links in configuration.md, the templates, and SKILL.md. This phase depends on the semantic reference checker and on phase 001's path state, but it does not own the manual-playbook or runtime references that other children rename.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking; the execution scan must distinguish active path values from frozen changelog history before applying the four-file map.
<!-- /ANCHOR:questions -->
