---
title: "Implementation Plan: system-skill-advisor feature catalog"
description: "Rename the feature catalog root, seven categories, and 42 files with an explicit path map, then repair catalog and cross-surface links while keeping classifier tokens and content identifiers stable."
trigger_phrases:
  - "feature catalog implementation plan"
  - "feature-catalog tree path closure"
  - "advisor catalog rename map"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/005-feature-catalog"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/005-feature-catalog"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the feature-catalog implementation plan"
    next_safe_action: "Freeze the 42-file catalog map and cross-link inventory"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/feature_catalog"
      - ".opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md"
      - ".opencode/skills/system-skill-advisor/SKILL.md"
      - ".opencode/commands/create/assets/create_feature_catalog_auto.yaml"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current tree contains seven snake_case category directories and 42 files including the root index."
      - "Catalog classification tokens and content identifiers remain unchanged."
---

# Implementation Plan: system-skill-advisor feature catalog

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown catalog assets, sk-doc generators, path-aware validators |
| **Framework** | Feature-catalog template and classifier conventions |
| **Storage** | Version-controlled Markdown tree and derived metadata |
| **Testing** | Inventory/map check, link scan, catalog validation, count parity |

### Overview
Use a bijective map for the feature-catalog root, seven category directories, the root index, and all 42 files.
Update only path contexts in catalog content and consumers. The root-name consumer contract supplies the read/emit
transition; this phase does not alter the classifier's identifier or the feature content schema.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The 42-file inventory, seven category list, and target map are pinned.
- [ ] Root-consumer/alias behavior and cross-phase playbook targets are available.
- [ ] BASE feature IDs, source references, and catalog link counts are recorded.

### Definition of Done
- [ ] One feature-catalog root and seven kebab-case categories exist.
- [ ] All catalog links and path-valued consumer references resolve.
- [ ] Classification tags, IDs, frontmatter, and code/data identifiers are unchanged.
- [ ] Catalog file/link/count checks match BASE.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Dependency-closed content-tree rename with path-only link rewriting.

### Key Components
- Catalog root/index: feature_catalog and feature_catalog.md.
- Category groups: auto_indexing, daemon_and_freshness, hooks_and_plugin, lifecycle_routing, mcp_surface,
  python_compat, and scorer_fusion.
- Consumers: SKILL routing metadata, README/INSTALL indexes, generators, validators, and playbook links.

### Data Flow
The classifier and catalog tooling discover the root/index, then operators follow category/file links to source
references and playbook scenarios. The map updates each filesystem segment and link target while preserving catalog
frontmatter and the skill_asset_feature_catalog classification token.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Enumerate all 42 files and seven categories; calculate kebab targets and collision checks.
- [ ] Scan catalog, skill docs, generators, validators, and playbook links for old path segments.
- [ ] Capture feature IDs, link counts, and classifier discovery counts at BASE.

### Phase 2: Implementation
- [ ] Rename the root, root index, categories, and all in-scope feature files in dependency-closed groups.
- [ ] Update path-valued links and generator/validation examples.
- [ ] Leave classification tags, tool IDs, code identifiers, frontmatter fields, and generated metadata unchanged.

### Phase 3: Verification
- [ ] Scan for duplicate roots and stale live old paths.
- [ ] Resolve every catalog link and catalog-to-playbook pointer.
- [ ] Run catalog validation and compare IDs, file counts, link counts, and discovery output to BASE.
- [ ] Record the target map for the manual-playbook phase and subtree gate.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Inventory | Root, categories, files, collisions | rg, filesystem manifest, rename-map checker |
| Links | Catalog indexes and cross-links | Markdown/path resolver |
| Classification | Root/index discovery and template tags | sk-doc validator/classifier |
| Content | IDs, source references, frontmatter, counts | parser and BASE comparison |
| Integration | Generator/validator path values | targeted generator and validation smoke |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Root-name consumer phase | Internal | Required | New root may not be discoverable |
| Frozen catalog map | Internal | Required | Partial tree rename breaks links |
| Manual-playbook map | Internal | Required | Cross-links cannot be closed |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Missing catalog target, duplicate root, changed feature ID/classifier result, or link-count drift.
- **Procedure**: Restore the catalog map and path-only link edits in the isolated worktree, retain the old-path
  disposition report, and rerun the root discovery baseline before retrying.
<!-- /ANCHOR:rollback -->
