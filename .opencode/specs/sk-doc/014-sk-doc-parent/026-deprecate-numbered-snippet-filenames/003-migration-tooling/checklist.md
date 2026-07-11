---
title: "Checklist: de-numbering snippet filenames migration tooling"
description: "Verification checklist for the deterministic, dry-runnable rename engine for the 111 in-scope snippet filenames."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/026-deprecate-numbered-snippet-filenames"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/026-deprecate-numbered-snippet-filenames/003-migration-tooling"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase checklist authored"
    next_safe_action: "Implement the rename engine + dry-run report"
    blockers: []
    completion_pct: 0
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
- [ ] Rename map built from the scoped 9-packet enumeration and reconciled against research.md (111 files; 63 R/H/N-structured).
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] Enumeration is scoped to exactly the 9 named packet paths (not a generic tree walk); deny-list references the current `sk-doc/014-sk-doc-parent` path, not the stale 108 `999-sk-doc-parent` path; script comments keep durable WHY only (no spec/packet ids).
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [ ] Dry-run mutates nothing: `git status` clean afterward (R1).
- [ ] Collision check reports 0 and aborts on a synthetic colliding pair (R3).
- [ ] Deny-list regression test passes: stale `999-sk-doc-parent` path excluded/not-matched, current `sk-doc/014-sk-doc-parent` path correctly matched.
- [ ] Re-run is byte-identical (idempotent, R6); `validate.sh --strict` Errors 0 on this phase folder.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] All in-scope surfaces covered: 111-file rename, 63-file `stage:` injection (14 holdout / 5 negative / 44 routing), 3 hub-routing root-index table rewrites — none missed (R2, R4, R5).
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [ ] Dry-run is the default; `--apply` gates mutation; no network/out-of-band state; reversible via git.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [ ] Dry-run report format documented: rename map + per-file diff + stage-injection preview + collision + excluded-surface summary.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [ ] Script confined to its planned packet-local `scripts/` location; touches no tree file in dry-run.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
Dry-run reports 111 renames / 63 `stage:` injections (14 holdout / 5 negative / 44 routing) / 3 root-index
tables rewritten / 0 collisions / 0 excluded-surface edits; `git status` clean; validate --strict Errors 0.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off
Migration tooling deterministic, dry-run-clean, deny-list-honoring (`014-sk-doc-parent` corrected), and
reviewed before Phase 004 runs it.
<!-- /ANCHOR:sign-off -->
