---
title: "Checklist: execute the 111-file rename + fold in adjacent corpus fixes"
description: "Verification checklist for the fanned-out migration execution and the decision-B fold-in fixes."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames/004-execute-migration"
    last_updated_at: "2026-07-11T17:41:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Applied migration (111 renames / 88 stage / 3 index); commit a61233bc01"
    next_safe_action: "Complete"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Execute the 111-file Rename + Fold in Adjacent Corpus Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol
Each item carries per-family validate output, a repo-wide find/grep, or a targeted vitest run as evidence.
Deferred fold-in items are left unchecked with the reason, not falsely marked complete.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] Phase 001 (number-agnostic loader, `stage:` parsing) and Phase 002 (generator alignment) confirmed landed.
- [x] Dry-run report reconciled against the live tree (111 files / 9 packets / 88 `stage:` injections under
      `--stage-scope=all` / 3 hub-routing index rewrites / 0 collisions). The 63 figure was an initial estimate;
      the live tree has 88 stage-eligible files (operator "all 88", `decision-record.md` ADR-004).
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] Renames via `git mv` (history preserved); reference rewrites confined to the 3 hub-routing root-index
      tables and the 111 in-scope files.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [x] Each migrated family `validate.sh --strict` Errors 0.
- [x] Repo-wide find: zero in-scope `^\d{3}-` snippet filenames remain outside the excluded surfaces.
- [x] Benchmark corpus intact: loader discovers every renamed file; `playbook-mode` + `skill-benchmark` vitest
      byte-identical to the pre-migration baseline (no scenario dropped).
- [ ] DEFERRED (ADR-007) — `feature-flag-reference-docs.vitest.ts` / `outsourced-agent-handback-docs.vitest.ts`:
      they target system-spec-kit's own numbered docs and fail on content assertions beyond de-numbering; carried
      to a system-spec-kit maintenance pass, outside the 111-file scope.
- [ ] DEFERRED (ADR-007) — `workflow-invariance.vitest.ts` allowlist: the "7 dead entries" premise proved
      inaccurate (three files were renamed, not deleted, and still need allowlisting under new names); same pass.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] All 111 files migrated across the 9 packets; all 88 stage-eligible files carry `stage:` (14 holdout / 5
      negative / 69 routing); all 3 hub-routing root-index tables rewritten (11 rows). The ADR-007 vitest/allowlist
      fold-in is deferred (see Testing above).
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [x] Path-scoped commits exclude concurrent-session dirt; no unrelated files swept in (verified: 0 `stage:`
      additions in the concurrent-session feature_catalog files, staged only the 111 renames + 3 index tables).
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [x] Excluded surfaces (20 system-spec-kit single-digit files, `z_archive/`, changelog/history) confirmed
      byte-unchanged (identical blobs).
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [x] Snippet files under `feature_catalog/` and `manual_testing_playbook/` now use bare descriptive slugs across
      the 9 in-scope packets.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
The migration was applied: 111 renames (git mv, history preserved), 88 `stage:` injections (14/5/69), 3
hub-routing index tables rewritten, 0 collisions, and the 20 protected single-digit files byte-unchanged. The
benchmark corpus is proven intact by a byte-identical vitest baseline, and the commits were path-scoped to avoid
concurrent-session dirt. The ADR-007 fold-in (2 system-spec-kit vitest suites + the workflow-invariance
allowlist) is explicitly deferred to a system-spec-kit maintenance pass; see the unchecked items and
`decision-record.md`.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off
Migration executed and verified (commit `a61233bc01`; review-driven doc fixes `075b956014`). Phase complete as
scoped, with the ADR-007 system-spec-kit test/allowlist fold-in carried forward as a documented deferral.
<!-- /ANCHOR:sign-off -->
