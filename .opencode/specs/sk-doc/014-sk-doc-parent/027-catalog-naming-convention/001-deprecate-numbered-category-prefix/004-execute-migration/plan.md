---
title: "Plan: execute the de-numbering migration"
description: "Run the Phase 003 migration script fanned out by skill family, validating and committing each batch, inside the isolated worktree."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/001-deprecate-numbered-category-prefix"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/001-deprecate-numbered-category-prefix/004-execute-migration"
    last_updated_at: "2026-07-11T19:50:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase plan authored"
    next_safe_action: "Run dry-run, then execute per family"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Plan: Execute the De-numbering Migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY
Invoke the reviewed Phase 003 script for real, one skill family at a time, validating each family before its
path-scoped commit. Isolated worktree keeps the ~6,500 edits away from concurrent-session WIP.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
Per family: `validate.sh --strict` Errors 0 before commit; excluded surfaces byte-unchanged; router prefixes +
frontmatter categories resolve to real paths; zero in-scope numbered folders after the last family.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
The Phase 003 script computes the rename map from the live tree and applies renames + reference rewrites. This
phase drives it with a family filter (a skill or small group per invocation) so validation and commits stay
scoped. Sequenced after Phase 002 so the classifier already tolerates both forms.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Full dry-run; confirm the report matches research.md counts (390 / 115 / ~1,052 / ~5,298 / 2 / 0 collisions).
2. Execute family-by-family (fan out with the GPT-terra + Sonnet fleet on disjoint families); validate each.
3. Path-scoped commit per family (exclude branch WIP + concurrent-session dirt).
4. Final repo-wide find: zero in-scope numbered category folders.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
`validate.sh --strict` per family; a `find` assertion for residual `NN--` category folders; a grep that the two
SKILL.md router-prefix blocks and the 115 `category:` values reference on-disk de-numbered paths.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
Phase 002 (tolerant classifier, ADR-002) and Phase 003 (reviewed script) must be complete.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Per-family commits mean any family reverts with a single `git revert`; the whole migration reverts by resetting
the worktree branch. `git mv` + text rewrites are fully tracked, so revert is clean.
<!-- /ANCHOR:rollback -->
