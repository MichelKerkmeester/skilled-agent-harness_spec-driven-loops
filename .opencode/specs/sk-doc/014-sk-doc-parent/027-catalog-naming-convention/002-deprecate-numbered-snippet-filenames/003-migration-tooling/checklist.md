---
title: "Checklist: de-numbering snippet filenames migration tooling"
description: "Verification checklist for the deterministic, dry-runnable rename engine for the 111 in-scope snippet filenames."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames/003-migration-tooling"
    last_updated_at: "2026-07-11T17:41:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Rename engine authored; dry-run clean"
    next_safe_action: "Complete"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: De-Numbering Snippet Filenames Migration Tooling

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol
Every item carries a dry-run-output or `git status` evidence line.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] Rename map built from the scoped 9-packet enumeration and reconciled against `research.md` §A (111 files; 88 R/H/N-category, operator-amended from 63).
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] Enumeration is scoped to exactly the 9 named packet paths (not a generic tree walk); deny-list references the current `sk-doc/014-sk-doc-parent` path, not the stale 108 `999-sk-doc-parent` path; script comments keep durable WHY only (no spec/packet ids).
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [x] Dry-run mutates nothing: `git status` clean afterward (R1).
- [x] Collision check reports `0 collisions` and aborts on a synthetic colliding pair (R3).
- [x] Deny-list regression test passes: stale `999-sk-doc-parent` path excluded/not-matched, current `sk-doc/014-sk-doc-parent` path correctly matched.
- [x] Re-run is byte-identical (idempotent, R6); `validate.sh --strict` Errors 0 on this phase folder.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] All in-scope surfaces covered: 111-file rename, 88-file `stage:` injection (14 holdout / 5 negative / 69 routing), 3 hub-routing root-index table rewrites — none missed (R2, R4, R5).
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [x] Dry-run is the default; `--apply` gates mutation; no network/out-of-band state; reversible via git.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [x] Dry-run report format documented (`denumber-snippet-filenames.mjs` output): rename map + per-file diff + stage-injection preview + collision + excluded-surface summary.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [x] Script confined to its planned packet-local `scripts/` location; touches no tree file in dry-run.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
Dry-run reports 111 renames / 88 `stage:` injections (14 holdout / 5 negative / 69 routing) / 3 root-index
tables rewritten / 0 collisions / 0 excluded-surface edits; `git status` clean; validate --strict Errors 0.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off
Migration tooling deterministic, dry-run-clean, deny-list-honoring (`014-sk-doc-parent` corrected), and
reviewed before Phase 004 runs it.
<!-- /ANCHOR:sign-off -->
