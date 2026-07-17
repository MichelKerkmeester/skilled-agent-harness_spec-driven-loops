---
title: "Feature Specification: Feature catalog (032 subtree 008 phase 008)"
description: "The skill’s feature_catalog tree contains 366 underscore-bearing filesystem names: the root, 17 candidate category directories, and 348 files. This phase renames the catalog root, categories, and content to kebab-case and updates catalog indexes, path-derived metadata, links, and consumers without changing frontmatter fields or code identifiers."
trigger_phrases:
  - "system-spec-kit feature catalog"
  - "feature_catalog to feature-catalog"
  - "catalog filename kebab-case"
  - "feature catalog phase 008"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit/008-feature-catalog"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored feature-catalog docs"
    next_safe_action: "Execute the feature-catalog map after shared/runtime is stable"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Feature catalog

> Phase adjacency under the 008 system-spec-kit subtree (grouping order, not a runtime dependency): predecessor 007-shared-and-runtime; successor 009-manual-testing-playbook.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit/008-feature-catalog |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | system-spec-kit |
| **Origin** | Phase 008 of the 008 system-spec-kit component migration under the 032 kebab-case program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The live catalog root is feature_catalog and its inventory contains 366 underscore-bearing basenames, including category directories such as bug_fixes_and_data_integrity, context_preservation, pipeline_architecture, and tooling_and_scripts. Content filenames such as canonical_id_dedup_hardening.md and database_and_schema_safety.md are path-addressed by indexes and cross-references, so the root, categories, files, and pointers must move as one content closure.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename the feature_catalog root to feature-catalog and update every active root/index consumer.
- Rename the 17 underscore-bearing category directories and 348 underscore-bearing catalog files using an explicit semantic map; retain already-compliant category/file names.
- Update feature-catalog indexes, links, category/path frontmatter values, README pointers, scripts, and references from active skills and tools.
- Preserve frontmatter field names, code identifiers, JSON/YAML/TOML keys, Python targets, generated/lockfile content, frozen history, and tool-mandated names.

### Out of Scope
- The manual_testing_playbook tree, which phase 009 owns.
- Changes to catalog meaning, feature classification, frontmatter schema, or content prose unrelated to path values.
- The old catalog names inside frozen changelog/history content, which are classified rather than rewritten.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The complete catalog candidate set is frozen before renaming. | The report accounts for 366 candidates: feature_catalog, 17 candidate directories, and 348 files, with no unknown bucket. |
| REQ-002 | Catalog roots, categories, and files use kebab-case targets. | feature_catalog -> feature-catalog and every permitted underscore basename has a collision-free semantic target. |
| REQ-003 | Catalog indexes and consumers resolve the new paths. | Index tables, links, category/path values, scripts, loaders, and active documentation point to feature-catalog targets. |
| REQ-004 | Schema and identifier boundaries remain intact. | Frontmatter keys, code identifiers, JSON/YAML/TOML keys, Python targets, and frozen/generated content are unchanged. |
| REQ-005 | Catalog classification and retrieval remain addressable. | Every catalog leaf remains discoverable by its intended category/path after the rename. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 366 permitted catalog candidates have a target or explicit exemption disposition.
- **SC-002**: The feature-catalog root, categories, files, indexes, and active consumers resolve with no broken links.
- **SC-003**: Catalog metadata fields and content semantics remain unchanged.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The catalog root is a runtime and indexing contract, not just a directory name. A missed consumer can silently downgrade or hide catalog leaves. The phase must use the program’s consumer map and verify every leaf remains discoverable; a blind underscore replacement can also create invalid or colliding names.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No blocking questions. Execution must record the final candidate count and the complete root/category/file map before any move.
<!-- /ANCHOR:questions -->

