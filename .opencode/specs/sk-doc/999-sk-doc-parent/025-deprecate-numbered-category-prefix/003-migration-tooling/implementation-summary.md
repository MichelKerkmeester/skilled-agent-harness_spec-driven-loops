---
title: "Implementation Summary: de-numbering migration tooling"
description: "PLANNED — will record the deterministic migration script once implemented: where it lives, how it computes the rename map from the live tree, how each of the five reference-class rewriters works, how the ADR-004 deny-list and collision check are enforced, and the dry-run report + validate evidence."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/999-sk-doc-parent/025-deprecate-numbered-category-prefix"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-sk-doc-parent/025-deprecate-numbered-category-prefix/003-migration-tooling"
    last_updated_at: "2026-07-10T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Stub — phase not yet implemented"
    next_safe_action: "Implement the migration script + dry-run report"
    blockers: []
    completion_pct: 0
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
| **Status** | Planned (not yet implemented) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built
_Planned._ To be filled on completion with the migration script's location and its five reference-class
rewriters (a git mv folder renames, b frontmatter `category:`, c index-table rows, d nav/cross-ref links,
e the two SKILL.md router-prefix blocks), the rename map computed from the live tree, and the dry-run report.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
_Planned._ Discover numbered folders from the tree → build the rename map → collision-check → apply the ADR-004
deny-list → plan per-class edits → emit a dry-run report (rename map + per-file diff + collision + excluded-
surface summary). Mutation is gated behind `--apply`, exercised only by Phase 004.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions
Per `decision-record.md`: ADR-001 (hard rename, no aliases), ADR-004 (changelog/history/z_archive/this-packet's
evidence stay numbered — encoded as the script's deny-list). The rename map is computed from the filesystem so
tooling and tree cannot drift.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification
_Planned._ `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` Errors 0,
plus a dry-run whose reported counts reconcile with research.md (~390 renames / ~115 category edits / ~1,052
index rows / ~5,298 links / 2 router blocks / 0 collisions) and whose `git status` is clean afterward
(zero mutation), with an empty excluded-surface summary.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations
_Planned._ Tooling-only phase; the script performs no tree mutation here — Phase 004 runs it with `--apply`.
The reported counts are approximate and recomputed from the live tree each run, so they track the tree rather
than a frozen snapshot.
<!-- /ANCHOR:limitations -->
