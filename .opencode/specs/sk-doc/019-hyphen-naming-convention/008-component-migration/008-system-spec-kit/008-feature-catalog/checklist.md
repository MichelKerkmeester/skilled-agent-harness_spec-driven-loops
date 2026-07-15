---
title: "Checklist: Feature catalog (017 subtree 008 phase 008)"
description: "The skill’s feature_catalog tree contains 366 underscore-bearing filesystem names: the root, 17 candidate category directories, and 348 files. This phase renames the catalog root, categories, and content to kebab-case and updates catalog indexes, path-derived metadata, links, and consumers without changing frontmatter fields or code identifiers."
trigger_phrases:
  - "system-spec-kit feature catalog"
  - "feature_catalog to feature-catalog"
  - "catalog filename kebab-case"
  - "feature catalog phase 008"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/008-system-spec-kit/008-feature-catalog"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored SOL verifier checklist"
    next_safe_action: "Execute the feature-catalog map after shared/runtime is stable"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: Feature catalog

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 008. The verifier records candidate SHA, BASE SHA, rename-map hash, commands, exit codes, discovery counts, and disposition-ledger evidence before accepting the phase.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 007 handoff and catalog baseline are available.
- [ ] CHK-002 [P0] Candidate count 366 and consumer boundary are recorded before moving content.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P1] Root/category/file mappings are semantic and explicit.
- [ ] CHK-004 [P0] No catalog leaf is accepted without pre/post discoverability evidence.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-005 [P0] The full 366-candidate inventory has no unknown disposition.
- [ ] CHK-006 [P0] feature-catalog links, indexes, loaders, and path values resolve.
- [ ] CHK-007 [P0] Frontmatter fields, identifiers, keys, Python targets, and frozen content are unchanged.
- [ ] CHK-008 [P1] Leaf and category parity matches the baseline.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-009 [P1] No permitted catalog root/category/file basename retains an underscore.
- [ ] CHK-010 [P1] Old active catalog paths have zero unresolved matches.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-011 [P2] Catalog loading and validation boundaries are not broadened.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-012 [P2] Candidate map, parity report, and consumer ledger are retained for phase 009.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-013 [P1] Batch contains only feature-catalog paths and their active references.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Accept only when the 366-name inventory, semantic map, consumer closure, metadata boundary, and catalog leaf parity are evidenced.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the feature-catalog tree is kebab-clean and fully addressable.
<!-- /ANCHOR:sign-off -->

