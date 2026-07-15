---
title: "Implementation Plan: system-code-graph feature catalog"
description: "Rename the feature-catalog root, eight categories, and 19 files with an explicit path map, then repair catalog and cross-surface links while keeping classifier tokens and content identifiers stable."
trigger_phrases:
  - "system-code-graph feature catalog implementation plan"
  - "code graph feature-catalog path closure"
  - "catalog rename map"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/010-system-code-graph/005-feature-catalog"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/010-system-code-graph/005-feature-catalog"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored catalog implementation plan"
    next_safe_action: "Freeze 19-file catalog map and cross-links"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/feature_catalog"
      - ".opencode/skills/system-code-graph/feature_catalog/feature_catalog.md"
      - ".opencode/skills/system-code-graph/SKILL.md"
      - ".opencode/skills/system-code-graph/README.md"
      - ".opencode/skills/system-code-graph/INSTALL_GUIDE.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current tree contains eight snake_case category directories and 19 files including the root index."
      - "Catalog classification tokens, feature IDs, tool IDs, and content identifiers remain unchanged."
---

# Implementation Plan: system-code-graph feature catalog

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown catalog assets, sk-doc routing metadata, path-aware validators |
| **Framework** | Feature-catalog index and catalog-to-playbook/reference link contracts |
| **Storage** | Version-controlled 19-file Markdown tree and derived metadata |
| **Testing** | Inventory/map check, link scan, catalog validation, count and identifier parity |

### Overview
Use a bijective map for the feature-catalog root, root index, eight category directories, and 18 category files.
Update only path contexts in catalog content and consumers. The central root-name consumer contract supplies the
read/emit transition; this phase changes the system-code-graph tree and links, not the classifier's identifiers or
feature content schema.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The 19-file inventory, eight category list, and target map are pinned.
- [ ] Root-consumer/alias behavior and cross-phase playbook/reference targets are available.
- [ ] BASE feature IDs, source references, catalog links, and discovery counts are recorded.

### Definition of Done
- [ ] One feature-catalog root and eight kebab-case categories exist.
- [ ] All catalog links and path-valued consumer references resolve.
- [ ] Classification tags, IDs, frontmatter, code/data identifiers, and category semantics are unchanged.
- [ ] Catalog file/link/count checks match BASE.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Dependency-closed content-tree rename with path-only link rewriting.

### Key Components
- Catalog root/index: feature_catalog and feature_catalog.md.
- Category groups: context_retrieval, coverage_graph, detect_changes, doctor_code_graph,
  edge_confidence_and_provenance, manual_scan_verify_status, mcp_tool_surface, and read_path_freshness.
- Consumers: SKILL routing metadata, README/INSTALL/ARCHITECTURE indexes, catalog files, playbook links, references,
  and live path-aware validators.

### Data Flow
The classifier and catalog tooling discover the root/index, then operators follow category/file links to source
references and playbook scenarios. The map updates each filesystem segment and link target while preserving the
skill_asset_feature_catalog classification token, feature IDs, and content identifiers.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Enumerate all 19 files and eight categories; calculate kebab targets and collision checks.
- [ ] Scan catalog, skill docs, reference pointers, playbook links, validators, and other live consumers for old paths.
- [ ] Capture feature IDs, source references, link counts, and classifier discovery counts at BASE.

### Phase 2: Implementation
- [ ] Rename the root, root index, categories, and all 18 category files in dependency-closed groups.
- [ ] Update path-valued links and root/category/file examples in the enumerated consumers.
- [ ] Leave classification tags, feature/tool IDs, code identifiers, frontmatter fields, data keys, and generated
  metadata unchanged.

### Phase 3: Verification
- [ ] Scan for duplicate roots and stale live old paths.
- [ ] Resolve every catalog link, catalog-to-playbook pointer, and catalog-to-reference pointer.
- [ ] Run catalog validation and compare IDs, file counts, link counts, and discovery output to BASE.
- [ ] Record the target map for the manual-playbook phase and subtree gate.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Inventory | Root, categories, files, and collisions | rg, filesystem manifest, rename-map checker |
| Links | Catalog indexes and cross-links | Markdown/path resolver |
| Classification | Root/index discovery and template tags | sk-doc validator/classifier |
| Content | IDs, source references, fields, and counts | parser and BASE comparison |
| Integration | Top-level docs and path-aware consumers | targeted generator/validator/link smoke |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Root-name consumer/alias phases | Internal | Required | New root may not be discoverable |
| Frozen catalog map | Internal | Required | Partial tree rename breaks links |
| Reference and manual-playbook maps | Internal | Required | Cross-links cannot be closed |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Missing catalog target, duplicate root, changed feature ID/classifier result, or link/count drift.
- **Procedure**: Restore the catalog map and path-only link edits in the isolated worktree, retain the old-path
  disposition report, and rerun the root discovery baseline before retrying.
<!-- /ANCHOR:rollback -->

