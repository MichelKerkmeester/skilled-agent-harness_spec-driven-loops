---
title: "Checklist: system-skill-advisor feature catalog"
description: "Blocking SOL acceptance contract for the feature-catalog root, category, and file rename, path-link closure, classifier preservation, and catalog parity."
trigger_phrases:
  - "feature catalog checklist"
  - "feature-catalog tree verification"
  - "catalog link closure checklist"
importance_tier: "critical"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/005-feature-catalog"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/005-feature-catalog"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the feature-catalog SOL verifier contract"
    next_safe_action: "Run the checklist centrally after the catalog phase executes"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/feature_catalog"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This authoring pass does not rename catalog paths or run catalog validation."
---

# Checklist: system-skill-advisor feature catalog

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 005. Every item is checked against the candidate SHA,
BASE SHA, and rename-map hash. The report records root/category/file counts, link and classifier results, commands,
exit codes, and fails on zero scenarios or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The 42-file, root-index, and seven-category map is pinned with collision evidence
- [ ] CHK-002 [P0] Catalog, generator, validator, top-level-doc, and playbook path consumers are enumerated
- [ ] CHK-003 [P2] Root-consumer/alias behavior and BASE feature/link/classifier counts are recorded
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P1] Changes are limited to catalog filesystem names and path contexts
- [ ] CHK-005 [P0] sk-doc classification tags, frontmatter fields, feature IDs, tool IDs, JSON/YAML/TOML keys, and code identifiers are preserved
- [ ] CHK-006 [P1] The phase does not redesign root-name consumer logic or create duplicate physical roots
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] feature-catalog/ and all seven category directories exist in kebab-case with all 42 files accounted for
- [ ] CHK-008 [P0] Catalog indexes, feature links, catalog-to-playbook links, top-level docs, generators, and validators resolve
- [ ] CHK-009 [P0] Catalog validation/classifier checks pass with BASE-equivalent file, ID, link, and discovery counts
- [ ] CHK-010 [P1] No stale live feature_catalog path or duplicate physical catalog root remains
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-011 [P0] Every catalog source path and live consumer is represented in the map or old-name disposition ledger
- [ ] CHK-012 [P1] Catalog-to-playbook cross-links use the frozen sibling target map without changing scenario semantics
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-013 [P1] Path rewrites preserve validation roots and do not introduce traversal or duplicate-root behavior
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-014 [P1] SKILL, README, INSTALL_GUIDE, catalog indexes, generator examples, and feature links expose live kebab-case paths
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-015 [P1] The catalog rename is dependency-closed and no stray implementation summary or scratch directory remains in this leaf
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when the one-root/42-file/seven-category catalog tree, links, classifier behavior, and content
identifiers match BASE under the approved filesystem exemption boundary.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms catalog path closure and no semantic change outside filesystem names.
<!-- /ANCHOR:sign-off -->
