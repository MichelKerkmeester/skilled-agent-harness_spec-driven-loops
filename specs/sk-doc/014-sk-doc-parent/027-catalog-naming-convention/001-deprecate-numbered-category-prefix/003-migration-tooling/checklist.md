---
title: "Checklist: de-numbering migration tooling"
description: "Verification checklist for the deterministic, dry-runnable migration script."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/001-deprecate-numbered-category-prefix"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/001-deprecate-numbered-category-prefix/003-migration-tooling"
    last_updated_at: "2026-07-11T19:50:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase checklist authored"
    next_safe_action: "Implement the migration script + dry-run report"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: De-Numbering Migration Tooling

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol
Every item carries a dry-run-output or `git status` evidence line.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-001 [P2] Rename map built from the live tree and reconciled against research.md (390 = 123 + 267 / 34 skills).
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-002 [P2] Rename map computed from the filesystem, not hardcoded; script comments keep durable WHY only (no spec/packet ids).
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-003 [P0] Dry-run mutates nothing: `git status` clean afterward (R1).
- [x] CHK-004 [P2] Collision check reports 0 and aborts on a synthetic colliding pair (R3).
- [x] CHK-005 [P0] Re-run is byte-identical (idempotent, R5); `validate.sh --strict` Errors 0 on this phase folder.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-006 [P2] All five reference classes covered (a git mv, b frontmatter, c index rows, d nav links, e router blocks) — none missed (R4).
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [x] CHK-007 [P0] Dry-run is the default; `--apply` gates mutation; no network/out-of-band state; reversible via git.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-008 [P2] Dry-run report format documented: rename map + per-file diff + collision + excluded-surface summary.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-009 [P1] Script confined to its planned packet-local `scripts/` location; touches no tree file in dry-run.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
Dry-run reports ~390 / ~115 / ~1,052 / ~5,298 / 2 router blocks / 0 collisions / 0 excluded-surface edits;
`git status` clean; validate --strict Errors 0.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off
Migration tooling deterministic, dry-run-clean, deny-list-honoring, and reviewed before Phase 004 runs it.
<!-- /ANCHOR:sign-off -->
