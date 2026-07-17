---
title: "Checklist: execute the de-numbering migration"
description: "Verification checklist for the fanned-out migration execution."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/001-deprecate-numbered-category-prefix"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/001-deprecate-numbered-category-prefix/004-execute-migration"
    last_updated_at: "2026-07-11T19:50:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase checklist authored"
    next_safe_action: "Run dry-run, then execute per family"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Execute the De-numbering Migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol
Each item carries per-family validate output or a repo-wide find/grep as evidence.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-001 [P2] Dry-run report reconciled against research.md counts; 0 collisions; Phase 002 landed.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-002 [P0] Renames via `git mv` (history preserved); reference rewrites confined to in-scope surfaces.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-003 [P0] Each migrated family `validate.sh --strict` Errors 0 before commit.
- [x] CHK-004 [P0] Repo-wide find: zero in-scope `NN--` category folders remain.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-005 [P2] All 34 skills migrated; all four reference classes + both router-prefix blocks + 115 categories rewritten.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [x] CHK-006 [P2] Path-scoped commits exclude concurrent-session dirt; no unrelated files swept in.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-007 [P2] Excluded surfaces (z_archive/CHANGELOG/history/this-packet evidence) confirmed byte-unchanged.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-008 [P2] Folder tree now uses bare descriptive slugs under feature_catalog/ and manual_testing_playbook/.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
All folders renamed and references rewritten, each family independently validated Errors 0, exclusions intact.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off
Migration executed cleanly per family; ready for the Phase 005 end-to-end gate.
<!-- /ANCHOR:sign-off -->
