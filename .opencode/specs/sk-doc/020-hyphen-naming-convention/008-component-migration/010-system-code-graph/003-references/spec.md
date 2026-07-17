---
title: "Feature Specification: system-code-graph references"
description: "Rename the seven snake_case reference files in the system-code-graph surface to kebab-case and repair every Markdown link, path hint, and documentation pointer without changing reference content identifiers or policy keys."
trigger_phrases:
  - "system-code-graph references naming"
  - "code graph reference file rename"
  - "kebab-case reference links"
  - "reference path closure"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph/003-references"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored references migration contract"
    next_safe_action: "Execute reference-file rename on pinned BASE"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/references"
      - ".opencode/skills/system-code-graph/SKILL.md"
      - ".opencode/skills/system-code-graph/README.md"
      - ".opencode/skills/system-code-graph/ARCHITECTURE.md"
      - ".opencode/skills/system-code-graph/mcp_server/plugin_bridges/README.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The references tree contains seven snake_case Markdown files under config, readiness, and runtime."
      - "The mcp_server/assets and mcp_server/tests/assets gold-query JSON files are already kebab-case and are not reference-file rename targets."
      - "Reference keys, path-hint values used as identifiers, code identifiers, tool IDs, and frontmatter fields retain their existing spelling."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: system-code-graph references

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph/003-references |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 003 of the system-code-graph component migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The system-code-graph references tree has seven snake_case Markdown filenames: database_path_policy.md,
code_graph_readiness_check.md, readiness_and_scope_fingerprint.md, launcher_lease.md, naming_conventions.md,
ownership_boundary.md, and tool_surface.md. SKILL routing, README/ARCHITECTURE links, plugin bridge documentation,
and reference-to-reference links resolve those exact names, so a filename-only move would leave broken navigation.

### Purpose
Rename the seven reference files to kebab-case and update their complete link and path-pointer closure while
preserving reference keys, path-hint identifiers, code/data contracts, and already-compliant assets.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename references/config/database_path_policy.md to database-path-policy.md.
- Rename references/readiness/code_graph_readiness_check.md to code-graph-readiness-check.md and
  readiness_and_scope_fingerprint.md to readiness-and-scope-fingerprint.md.
- Rename references/runtime/launcher_lease.md, naming_conventions.md, ownership_boundary.md, and tool_surface.md to
  launcher-lease.md, naming-conventions.md, ownership-boundary.md, and tool-surface.md.
- Update links and path hints in SKILL.md, README.md, ARCHITECTURE.md, INSTALL_GUIDE.md, the plugin bridge README,
  reference cross-links, catalog/playbook docs, and any other live consumer found by the path scan.
- Classify mcp_server/assets/code-graph-gold-queries.json and mcp_server/tests/assets/code-graph-gold-queries.json as
  already-compliant asset files; do not invent template renames.

### Out of Scope
- Reference prose, frontmatter fields, routing identifiers, path-hint values that are identifiers rather than paths,
  code identifiers, MCP tool IDs, JSON/YAML/TOML keys, generated metadata, and frozen changelog history.
- The mcp-server, scripts, runtime, feature-catalog, and manual-playbook filesystem names owned by sibling phases.
- Asset/template files whose actual basenames are already kebab-case.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-code-graph/references/config/database_path_policy.md | Rename | database-path-policy.md |
| .opencode/skills/system-code-graph/references/readiness/{code_graph_readiness_check,readiness_and_scope_fingerprint}.md | Rename | Kebab-case readiness reference names |
| .opencode/skills/system-code-graph/references/runtime/{launcher_lease,naming_conventions,ownership_boundary,tool_surface}.md | Rename | Kebab-case runtime reference names |
| .opencode/skills/system-code-graph/{SKILL,README,ARCHITECTURE,INSTALL_GUIDE}.md | Modify | Repair top-level reference links and path hints |
| .opencode/skills/system-code-graph/mcp_server/plugin_bridges/README.md | Modify | Repair bridge reference pointer |
| .opencode/skills/system-code-graph/references/**/*.md | Modify | Repair relative reference-to-reference links |
| .opencode/skills/system-code-graph/{feature_catalog,manual_testing_playbook}/**/*.md | Modify | Repair live cross-surface reference pointers |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The reference inventory is complete | All seven current snake_case reference files and every already-compliant asset/template file have one disposition in the frozen map. |
| REQ-002 | Reference files use kebab-case | The seven target files exist at their kebab-case paths and no old live reference filename remains. |
| REQ-003 | Reference links are repaired | Top-level docs, plugin bridge docs, relative reference links, catalog links, playbook links, and path hints resolve at their new paths. |
| REQ-004 | Reference contracts are preserved | Reference keys, path-hint identifiers, frontmatter fields, code identifiers, MCP tool IDs, and content semantics are unchanged. |
| REQ-005 | Asset/template boundaries are honored | The already-kebab gold-query assets remain unchanged, and no missing or generated template file is fabricated. |
| REQ-006 | Navigation remains valid | Markdown/path resolution reports zero broken links attributable to this phase and reference discovery counts match BASE. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The seven reference files are present under kebab-case names with no stale live old paths.
- **SC-002**: Every live reference link and path pointer resolves without changing reference semantics.
- **SC-003**: Already-compliant assets/templates and all non-filesystem identifiers retain BASE content.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Catalog and playbook phases | Cross-surface links can point at sibling targets before those trees move | Use the frozen sibling maps and verify final integrated links at the subtree gate. |
| Risk | Path hints are mistaken for filenames | Runtime resource selection can change while links appear valid | Classify each occurrence as filesystem path, identifier, or prose before editing. |
| Risk | Existing asset files are swept mechanically | Gold-query fixtures or generated data can be altered | Keep the asset disposition explicit and compare file hashes/content to BASE. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The executor must retain the complete old-name hit ledger, including intentional identifier and prose
mentions, so the final gate can distinguish broken links from preserved contracts.
<!-- /ANCHOR:questions -->

