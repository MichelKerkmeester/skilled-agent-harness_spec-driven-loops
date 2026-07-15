---
title: "Feature Specification: system-skill-advisor feature catalog"
description: "Rename the system-skill-advisor feature_catalog root, seven category directories, and 42 catalog files to kebab-case, then update every path link while preserving catalog classification tokens and code/data identifiers."
trigger_phrases:
  - "system-skill-advisor feature catalog naming"
  - "feature-catalog tree migration"
  - "feature_catalog to feature-catalog"
  - "catalog file link closure"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/009-system-skill-advisor"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/005-feature-catalog"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the feature-catalog tree migration contract"
    next_safe_action: "Execute the catalog root, category, and file rename on the pinned BASE worktree"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/feature_catalog"
      - ".opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md"
      - ".opencode/skills/system-skill-advisor/SKILL.md"
      - ".opencode/skills/system-skill-advisor/README.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The catalog contains 42 files, including feature_catalog/feature_catalog.md, under seven snake_case category directories."
      - "The root and path segments become feature-catalog and category/feature names become kebab-case."
      - "sk-doc template tags, frontmatter fields, JSON/YAML/TOML keys, and code identifiers retain their current spelling."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: system-skill-advisor feature catalog

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/019-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/005-feature-catalog |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 005 of the system-skill-advisor component migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor's feature catalog currently uses the snake_case root feature_catalog, seven snake_case category
directories, and 42 Markdown files. Catalog indexes, feature-to-playbook links, SKILL routing metadata, generator
contracts, and documentation refer to those paths. The migration must change filesystem paths without changing the
classification token skill_asset_feature_catalog, tool identifiers, or the catalog content's data contracts.

### Purpose
Convert the complete feature-catalog tree to kebab-case and update all path references so every catalog link and
loader sees the same content at its new canonical path.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename feature_catalog/ to feature-catalog/ and feature_catalog.md to feature-catalog.md.
- Rename the seven category directories: auto_indexing, daemon_and_freshness, hooks_and_plugin, lifecycle_routing,
  mcp_surface, python_compat, and scorer_fusion.
- Rename every snake_case Markdown feature file below those categories to kebab-case.
- Update links and path values in catalog files, playbook cross-links, SKILL/README/INSTALL docs, and generator or
  validation consumers after the root-consumer compatibility phase is in place.

### Out of Scope
- Feature prose, frontmatter fields, sk-doc-template values, code identifiers, tool IDs, JSON/YAML/TOML keys,
  Python filenames, Python package directories, generated graph metadata, and changelog history.
- The runtime classifier/consumer redesign owned by the program's root-name-consumer phase.
- Manual-playbook filesystem names, which are handled by phase 006; only direct catalog-to-playbook path pointers are
  updated here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-skill-advisor/feature_catalog/ | Rename | Root to feature-catalog/ |
| .opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md | Rename | Catalog index to feature-catalog.md |
| .opencode/skills/system-skill-advisor/feature_catalog/{auto_indexing,daemon_and_freshness,hooks_and_plugin,lifecycle_routing,mcp_surface,python_compat,scorer_fusion}/ | Rename | Seven category directories to kebab-case |
| .opencode/skills/system-skill-advisor/feature_catalog/**/*.md | Rename | All in-scope feature files to kebab-case |
| .opencode/skills/system-skill-advisor/{SKILL,README,INSTALL_GUIDE}.md | Modify | Repair root/index and feature links |
| .opencode/commands/create/assets/create_feature_catalog_*.yaml | Modify | Update path-valued catalog examples where this phase owns the consumer |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The catalog inventory is complete | The 42-file tree, root index, and seven category directories each have exactly one kebab-case target in the frozen map. |
| REQ-002 | The catalog tree is canonical | feature-catalog/ and all permitted descendants use kebab-case; no old live catalog path remains. |
| REQ-003 | Catalog links are repaired | Index links, feature-to-playbook links, top-level docs, generator examples, and validation path values resolve at their new paths. |
| REQ-004 | Classification and data contracts are preserved | sk-doc-template: skill_asset_feature_catalog, frontmatter keys/values not representing paths, tool IDs, and code identifiers are unchanged. |
| REQ-005 | Root transition behavior is respected | Reads follow the program's bounded dual-name/alias-removal contract; the phase does not introduce a second physical root or redesign the classifier. |
| REQ-006 | Content coverage remains stable | Catalog file count, feature IDs, source references, and playbook cross-link count match BASE after path normalization. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The full 42-file feature catalog is present under one kebab-case root with seven kebab-case categories.
- **SC-002**: Catalog navigation and cross-links resolve without changing feature semantics or classification tokens.
- **SC-003**: Root-name consumers and generated metadata can be refreshed without observing duplicate physical roots.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Root-name consumer and alias phases | Renaming the physical root before readers support the target can break indexing | Execute against the program's consumer contract and verify the alias-removal handoff. |
| Risk | Underscores in content identifiers are altered | Validation and routing behavior can drift while links appear green | Restrict replacements to filesystem path contexts and compare identifiers/content counts to BASE. |
| Risk | Catalog-to-playbook links move in a separate sibling phase | Intermediate links may point to a planned but not yet present target | Use the frozen cross-phase map and verify final integrated links in phase 008. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The executor must record the complete generated rename map rather than relying on a character
substitution, especially for category and feature names that share identifiers with data fields.
<!-- /ANCHOR:questions -->
