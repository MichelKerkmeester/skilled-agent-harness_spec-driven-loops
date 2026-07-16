---
title: "Implementation Plan: Feature catalog (032 subtree 008 phase 008)"
description: "The skill’s feature_catalog tree contains 366 underscore-bearing filesystem names: the root, 17 candidate category directories, and 348 files. This phase renames the catalog root, categories, and content to kebab-case and updates catalog indexes, path-derived metadata, links, and consumers without changing frontmatter fields or code identifiers."
trigger_phrases:
  - "system-spec-kit feature catalog"
  - "feature_catalog to feature-catalog"
  - "catalog filename kebab-case"
  - "feature catalog phase 008"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/008-system-spec-kit/008-feature-catalog"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned feature-catalog execution"
    next_safe_action: "Execute the feature-catalog map after shared/runtime is stable"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Feature catalog

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | .opencode/skills/system-spec-kit (Feature catalog) |
| **Change class** | Catalog tree rename and reference closure |
| **Execution** | Isolated worktree pinned to BASE; planning only |

### Overview
Freeze the 366-name candidate inventory, build a bijective semantic map, move the root/category/file tree in dependency-closed batches, and rewrite indexes and path-valued metadata alongside each batch. Verify leaf discoverability after every batch and preserve all non-filesystem contracts.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 007 shared/runtime handoff is complete.
- [ ] The catalog inventory reports 366 underscore-bearing candidates and is hashed with BASE.
- [ ] Active catalog consumers and frozen-history boundaries are listed.

### Definition of Done
- [ ] The root, categories, and files are kebab-case with no unknown disposition.
- [ ] All active catalog links, indexes, loaders, and path metadata resolve.
- [ ] Catalog leaves remain discoverable and schema/identifier boundaries are untouched.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
- Use explicit root, category, and file mappings; do not substitute underscores mechanically inside arbitrary names.
- Batch by dependency closure so index rows and content files move together.
- Compare the catalog leaf set and category mapping before and after to catch silent loss or downgrade.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Enumerate catalog root, category directories, and files; record 366 candidates and already-compliant names.
- Search active consumers for feature_catalog, feature-catalog, catalog index names, and path-derived category values.

### Phase 2: Implementation
- Freeze and review the full catalog map with collision/casefold/NFC checks.
- Rename root, categories, and files in dependency-closed batches and update indexes, links, and path-valued metadata.
- Reconcile active loaders and validators without altering frontmatter fields or content identifiers.

### Phase 3: Verification
- Resolve every active catalog link and consumer from the target root.
- Compare pre/post leaf IDs, category assignments, file counts, and path-derived metadata.
- Review all old-root matches and classify frozen, generated, identifier, or unresolved entries.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Inventory report and map hash account for 366 candidates: root, 17 directories, and 348 files. |
| REQ-002 | Map review proves kebab targets and no exact, casefold, or NFC collisions. |
| REQ-003 | Run catalog index, link, loader, and path-value resolution against feature-catalog. |
| REQ-004 | Diff audit proves fields, keys, identifiers, Python targets, and frozen/generated content remain unchanged. |
| REQ-005 | Compare catalog leaf/category discovery and retrieval results with the baseline. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 007 shared/runtime | Internal | Required | The content surface is migrated after shared/runtime paths are stable. |
| Catalog consumer map | Internal | Required | Root consumers must be updated with the root move. |
| Phase 009 manual playbook | Internal | Downstream | The sibling content tree is verified separately. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Stop on any leaf-count mismatch, collision, silent category loss, or unresolved consumer. Revert the current dependency-closed batch with its index and metadata rewrites; do not repair a broken catalog with broad text replacement.
<!-- /ANCHOR:rollback -->

