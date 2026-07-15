---
title: "Plan: execute the 111-file rename + fold in adjacent corpus fixes"
description: "Run the Phase 003 migration script fanned out by skill family, injecting stage: frontmatter and rewriting the 3 hub-routing root-index tables, then fix the 2 failing vitest suites and sweep the 7 dead allowlist entries."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/015-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames/004-execute-migration"
    last_updated_at: "2026-07-11T17:41:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase plan authored"
    next_safe_action: "Run the Phase 003 dry-run migration"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Plan: Execute the 111-file Rename + Fold in Adjacent Corpus Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY
Invoke the reviewed Phase 003 script for real, one skill family at a time, injecting `stage:` frontmatter on the
63 routing/holdout/negative-grouped files, rewriting the 3 hub-routing root-index tables in lockstep with their
owning family, and validating each family before its commit. Fold in operator decision B: fix the 2 failing
vitest suites and sweep the 7 dead allowlist entries in the same pass, since they hardcode stale numbered names
from the same corpus this migration touches.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
Per family: `validate.sh --strict` Errors 0 before commit; excluded surfaces (20 system-spec-kit single-digit
files, `z_archive/`, changelog/history) byte-unchanged; hub-routing root-index rows resolve to real de-numbered
paths; zero in-scope `^\d{3}-` snippet filenames after the last family; the 2 previously-failing vitest suites
pass; the 7 dead allowlist entries removed.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
The Phase 003 script (`denumber-snippet-filenames.mjs`) computes the strip-`^\d{3}-` rename map from the live
111-file set, derives the `stage:` value from the holdout/negative token where present, and performs a
word-boundary reference sweep for the 3 hub-routing root-index rows. This phase drives it with a family filter
(one skill or small group per invocation) so validation and commits stay scoped and bisectable. Sequenced after
Phase 001 (tolerant loader) and Phase 002 (corrected generator) so the corpus never loses a scenario mid-flight;
authored against the same tolerant loader Phase 003 was reviewed against. The vitest and allowlist fixes are
driven independently against the specific stale-reference lines identified in research, not against the family
batches, since they live in `system-spec-kit` rather than the 9 renamed packets.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase 1: Confirm Phase 001 (number-agnostic loader, `stage:` parsing) and Phase 002 (generator emits slugs) have
   landed; full dry-run; reconcile the report against research.md counts (111 files / 9 packets / 63 `stage:`
   injections / 3 hub-routing index rewrites / 0 collisions).
### Phase 2: Execute family-by-family (fan out across the 9 packets on disjoint families); inject `stage:` frontmatter;
   rewrite the owning hub-routing root-index rows in the same pass; validate each family.
### Phase 3: Path-scoped commit per family (exclude branch WIP and any concurrent-session dirt).
### Phase 4: Fix the 2 failing vitest suites and sweep the 7 dead allowlist entries in
   `workflow-invariance.vitest.ts:97-104` (decision B fold-in).
### Phase 5: Final repo-wide find: zero in-scope `^\d{3}-` snippet filenames outside the excluded surfaces.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
`validate.sh --strict` per family; a `find` assertion for residual in-scope `^\d{3}-` snippet filenames; a grep
that the 3 hub-routing root-index tables reference on-disk de-numbered paths and that all 63 grouped files carry
a `stage:` field; a targeted vitest run for the 2 previously-failing suites and the `workflow-invariance` suite
after the allowlist sweep.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
Phase 001 (number-agnostic loader with `stage:` parsing) and Phase 002 (generator alignment) must be complete;
Phase 003 (reviewed, dry-run-verified migration script) must be complete.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Per-family commits mean any family reverts with a single `git revert`; the vitest/allowlist fold-in is its own
commit and reverts independently. The whole migration reverts by resetting the branch to its pre-Phase-004 state.
`git mv` plus text rewrites are fully tracked, so revert is clean.
<!-- /ANCHOR:rollback -->
