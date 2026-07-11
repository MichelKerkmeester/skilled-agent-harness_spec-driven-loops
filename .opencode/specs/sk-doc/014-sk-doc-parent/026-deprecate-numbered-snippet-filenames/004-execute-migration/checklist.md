---
title: "Checklist: execute the 111-file rename + fold in adjacent corpus fixes"
description: "Verification checklist for the fanned-out migration execution and the decision-B fold-in fixes."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/026-deprecate-numbered-snippet-filenames"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/026-deprecate-numbered-snippet-filenames/004-execute-migration"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase checklist authored"
    next_safe_action: "Run the Phase 003 dry-run migration"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Execute the 111-file Rename + Fold in Adjacent Corpus Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol
Each item carries per-family validate output, a repo-wide find/grep, or a targeted vitest run as evidence.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [ ] Phase 001 (number-agnostic loader, `stage:` parsing) and Phase 002 (generator alignment) confirmed landed.
- [ ] Dry-run report reconciled against research.md counts (111 files / 9 packets / 63 `stage:` injections / 3
      hub-routing index rewrites / 0 collisions).
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] Renames via `git mv` (history preserved); reference rewrites confined to the 3 hub-routing root-index
      tables and the 111 in-scope files.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [ ] Each migrated family `validate.sh --strict` Errors 0 before commit.
- [ ] Repo-wide find: zero in-scope `^\d{3}-` snippet filenames remain outside the excluded surfaces.
- [ ] The 2 previously-failing vitest suites (`feature-flag-reference-docs.vitest.ts`,
      `outsourced-agent-handback-docs.vitest.ts`) pass.
- [ ] `workflow-invariance.vitest.ts` passes after the 7 dead allowlist entries are removed.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] All 111 files migrated across the 9 packets; all 63 grouped files carry `stage:`; all 3 hub-routing
      root-index tables rewritten; the 2 vitest suites and 7 allowlist entries resolved.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [ ] Path-scoped commits exclude concurrent-session dirt; no unrelated files swept in.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [ ] Excluded surfaces (20 system-spec-kit single-digit files, `z_archive/`, changelog/history) confirmed
      byte-unchanged.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [ ] Snippet files under `feature_catalog/` and `manual_testing_playbook/` now use bare descriptive slugs across
      the 9 in-scope packets.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
Pending execution — all items above are unchecked until Phase 001 and Phase 002 land and this phase runs.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off
Not yet executed; ready to start once Phase 001 and Phase 002 land and the Phase 003 dry-run reconciles.
<!-- /ANCHOR:sign-off -->
