---
title: "Feature Specification: system-code-graph feature catalog"
description: "Rename the system-code-graph feature_catalog root, eight category directories, and 19 catalog/index files to kebab-case, then update every path link while preserving catalog classification tokens, feature IDs, and code/data identifiers."
trigger_phrases:
  - "system-code-graph feature catalog naming"
  - "code graph feature-catalog tree migration"
  - "feature_catalog to feature-catalog"
  - "code graph catalog link closure"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph/005-feature-catalog"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored feature-catalog migration contract"
    next_safe_action: "Execute catalog tree rename on pinned BASE"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/feature_catalog"
      - ".opencode/skills/system-code-graph/feature_catalog/feature_catalog.md"
      - ".opencode/skills/system-code-graph/SKILL.md"
      - ".opencode/skills/system-code-graph/README.md"
      - ".opencode/skills/system-code-graph/INSTALL_GUIDE.md"
      - ".opencode/skills/system-code-graph/ARCHITECTURE.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The catalog contains 19 files including feature_catalog/feature_catalog.md under eight snake_case category directories."
      - "The root, category directories, and file basenames become kebab-case; feature IDs and classification tokens remain unchanged."
      - "The root-name consumer phase owns central classifier compatibility; this phase updates the system-code-graph surface and its path consumers."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: system-code-graph feature catalog
> Phase adjacency — predecessor `004-runtime`; successor `006-manual-testing-playbook`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph/005-feature-catalog |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 005 of the system-code-graph component migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The code-graph feature catalog currently uses the snake_case root feature_catalog, eight snake_case category
directories, and 19 Markdown files. The root index, catalog-to-playbook links, SKILL routing metadata, README and
architecture docs, and feature cross-links refer to those paths. The migration must change filesystem paths without
changing the skill_asset_feature_catalog classification token, feature/tool IDs, or content data contracts.

### Purpose
Convert the complete 19-file feature-catalog tree to kebab-case and update all path references so catalog discovery,
navigation, and cross-links resolve the same features at their canonical paths.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename feature_catalog/ to feature-catalog/ and feature_catalog.md to feature-catalog.md.
- Rename the eight category directories: context_retrieval, coverage_graph, detect_changes, doctor_code_graph,
  edge_confidence_and_provenance, manual_scan_verify_status, mcp_tool_surface, and read_path_freshness.
- Rename all 18 category files: code_graph_context.md, context_handler.md, deep_loop_graph_convergence.md,
  deep_loop_graph_query.md, deep_loop_graph_status.md, deep_loop_graph_upsert.md, detect_changes_preflight.md,
  doctor_apply_mode.md, edge_confidence_differentiation.md, edge_evidence_classification.md,
  seeded_ppr_impact_ranking.md, code_graph_scan.md, code_graph_status.md, code_graph_verify.md, code_index_cli.md,
  tool_registrations.md, ensure_code_graph_ready.md, and query_self_heal.md.
- Update links and path values in the catalog index, catalog files, SKILL/README/INSTALL/ARCHITECTURE docs,
  manual-playbook cross-links, reference pointers, and any other live system-code-graph consumer.
- Apply the program's bounded root-name transition contract without changing the central classifier design.

### Out of Scope
- Feature prose, frontmatter fields, sk-doc-template: skill_asset_feature_catalog, feature IDs, tool IDs, code
  identifiers, JSON/YAML/TOML keys, generated graph metadata, and frozen changelog history.
- The mcp-server, scripts, references, runtime, and manual-playbook filesystem names owned by sibling phases; only
  direct catalog path pointers to sibling targets are repaired here.
- Adding catalog features, changing category semantics, or redesigning resource routing.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-code-graph/feature_catalog/ | Rename | Root to feature-catalog/ |
| .opencode/skills/system-code-graph/feature_catalog/feature_catalog.md | Rename | Root index to feature-catalog.md |
| .opencode/skills/system-code-graph/feature_catalog/{context_retrieval,coverage_graph,detect_changes,doctor_code_graph,edge_confidence_and_provenance,manual_scan_verify_status,mcp_tool_surface,read_path_freshness}/ | Rename | Eight category directories to kebab-case |
| .opencode/skills/system-code-graph/feature_catalog/**/*.md | Rename | All 18 category files to kebab-case |
| .opencode/skills/system-code-graph/{SKILL,README,INSTALL_GUIDE,ARCHITECTURE}.md | Modify | Repair root, category, and feature links |
| .opencode/skills/system-code-graph/manual_testing_playbook/**/*.md | Modify | Repair catalog-to-playbook paths where needed |
| .opencode/skills/system-code-graph/mcp_server/.gitkeep and other live consumers | Modify | Repair path-valued catalog references |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The catalog inventory is complete | The 19-file tree, root index, and eight category directories each have exactly one kebab-case target in the frozen map. |
| REQ-002 | The catalog tree is canonical | feature-catalog/ and all permitted descendants use kebab-case; no old live catalog path remains. |
| REQ-003 | Catalog links are repaired | Index links, feature links, catalog-to-playbook links, top-level docs, reference pointers, and path-valued consumers resolve at their new paths. |
| REQ-004 | Classification and data contracts are preserved | skill_asset_feature_catalog, frontmatter fields, feature IDs, tool IDs, code identifiers, and JSON/YAML/TOML keys are unchanged. |
| REQ-005 | Root transition behavior is respected | Reads follow the program's bounded dual-name/alias-removal contract; the phase does not introduce a second physical root or redesign the classifier. |
| REQ-006 | Content coverage remains stable | Catalog file count, feature IDs, source references, and catalog/playbook link counts match BASE after path normalization. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The full 19-file feature catalog is present under one kebab-case root with eight kebab-case categories.
- **SC-002**: Catalog navigation and cross-links resolve without changing feature semantics or classification tokens.
- **SC-003**: Root-name consumers and generated metadata observe one physical catalog root under the approved transition contract.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Root-name consumer/alias phases | Renaming the physical root before readers support the target can break discovery | Execute against the program's consumer contract and verify alias-removal handoff. |
| Dependency | Manual-playbook phase | Catalog-to-playbook links can point at planned but not yet present sibling targets | Use the frozen playbook map and verify final integrated links at the subtree gate. |
| Risk | Underscores in content identifiers are altered | Routing and validation can drift while links appear green | Restrict replacements to filesystem path contexts and compare identifiers/content counts to BASE. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The executor must record the complete generated rename map rather than relying on a character
substitution, especially where category or feature names resemble tool and data identifiers.
<!-- /ANCHOR:questions -->

