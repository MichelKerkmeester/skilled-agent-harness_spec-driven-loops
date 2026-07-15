---
title: "Implementation Summary: de-numbering migration tooling"
description: "PLANNED — will record the deterministic migration script once implemented: where it lives, how it computes the rename map from the live tree, how each of the five reference-class rewriters works, how the ADR-004 deny-list and collision check are enforced, and the dry-run report + validate evidence."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/015-sk-doc-parent/027-catalog-naming-convention/001-deprecate-numbered-category-prefix"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-parent/027-catalog-naming-convention/001-deprecate-numbered-category-prefix/003-migration-tooling"
    last_updated_at: "2026-07-12T12:16:22Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "denumber-categories.mjs authored; dry-run clean; commit dd5a30e826"
    next_safe_action: "Complete"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: De-Numbering Migration Tooling

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata
| Field | Value |
|-------|-------|
| **Spec Folder** | 003-migration-tooling |
| **Status** | Complete |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built
Authored `denumber-categories.mjs`, a deterministic, dry-runnable migration engine adapted from the proven
`z_archive/108` snippet-denumbering engine. It computes the rename map from the live tree, runs a collision
check, performs a boundary-safe reference sweep and a frontmatter pass, and defaults to dry-run (no mutation).
Scoped to the functional surface (`.md` / `.ts` / `.mjs`); artifacts, changelog, `z_archive/`, and this packet
are frozen by the deny-list.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
Adapted the proven `z_archive/108` engine: built the rename map from the live tree, collision-checked it, and
swept references with boundary-safe matching plus a frontmatter pass, all behind a dry-run default. Mutation is
gated so only Phase 004 runs it against the tree. Commit `dd5a30e826`.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions
Per `decision-record.md`: ADR-001 (hard rename, no aliases), ADR-004 (changelog/history/z_archive/this-packet's
evidence stay numbered — encoded as the script's deny-list). The rename map is computed from the filesystem so
tooling and tree cannot drift.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification
`bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` Errors 0. Dry-run against
the live tree: **391 folders, 0 collisions, 2,515 files / 14,091 replacements, 115 frontmatter** values — no
mutation.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations
Tooling-only phase — the engine performed no tree mutation here; Phase 004 ran it against the tree. The reported
counts are recomputed from the live tree each run, so they track the tree rather than a frozen snapshot.
<!-- /ANCHOR:limitations -->
