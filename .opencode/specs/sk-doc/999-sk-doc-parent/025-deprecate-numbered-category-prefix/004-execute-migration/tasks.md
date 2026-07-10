---
title: "Tasks: execute the de-numbering migration"
description: "Task breakdown for running the migration fanned out by skill family."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/999-sk-doc-parent/025-deprecate-numbered-category-prefix"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-sk-doc-parent/025-deprecate-numbered-category-prefix/004-execute-migration"
    last_updated_at: "2026-07-10T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase tasks authored"
    next_safe_action: "Run dry-run, then execute per family"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Execute the De-numbering Migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation
`[x]` complete · `[ ]` pending.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] Full dry-run; reconcile the report against research.md counts and confirm 0 collisions.
- [ ] Confirm Phase 002 (tolerant classifier) has landed.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] Execute the migration family-by-family across all 34 skills (fan out on disjoint families).
- [ ] Validate each family `--strict` Errors 0 before its commit.
- [ ] Path-scoped commit per family (exclude branch WIP + concurrent-session dirt).
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] Repo-wide find: zero in-scope `NN--` category folders.
- [ ] Router prefixes + 115 `category:` values resolve to real de-numbered paths.
- [ ] Excluded surfaces (z_archive/CHANGELOG/history) byte-unchanged.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
All 390 folders renamed, all references rewritten, every family validated Errors 0, exclusions intact.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
Consumes Phase 003 tooling; gated by Phase 002 (ADR-002); verified end-to-end by Phase 005.
<!-- /ANCHOR:cross-refs -->
