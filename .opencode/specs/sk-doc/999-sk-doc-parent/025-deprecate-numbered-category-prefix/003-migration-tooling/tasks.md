---
title: "Tasks: de-numbering migration tooling"
description: "Task breakdown for authoring the deterministic, dry-runnable migration script."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/999-sk-doc-parent/025-deprecate-numbered-category-prefix"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-sk-doc-parent/025-deprecate-numbered-category-prefix/003-migration-tooling"
    last_updated_at: "2026-07-10T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase tasks authored"
    next_safe_action: "Implement the migration script + dry-run report"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: De-Numbering Migration Tooling

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation
`[x]` complete · `[ ]` pending.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] Discover numbered folders from the live tree and build the `{ oldPath → newPath }` rename map.
- [ ] Assert the map size against research.md (390 = 123 feature_catalog + 267 manual_testing_playbook / 34 skills).
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] Implement the collision check (abort if two stripped names collide in a parent; expected 0).
- [ ] Implement the ADR-004 deny-list predicate (`z_archive/`, `CHANGELOG*`/`changelog*`, history, this packet's evidence).
- [ ] Implement rewriter (a): `git mv` folder renames from the rename map.
- [ ] Implement rewriter (b): frontmatter `category:` value rewrites (115).
- [ ] Implement rewriter (c): root index-table path rows (`feature_catalog.md` / `manual_testing_playbook.md`, ~1,052).
- [ ] Implement rewriter (d): nav / cross-ref markdown links (~5,298 across ~1,841 files), deny-list applied.
- [ ] Implement rewriter (e): the two SKILL.md router-prefix blocks (skill-advisor + code-graph).
- [ ] Implement the dry-run report (rename map + per-file diff + collision + excluded-surface summary) and the `--apply` gate.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] Dry-run reports ~390 / ~115 / ~1,052 / ~5,298 / 2 router blocks / 0 collisions; `git status` clean after.
- [ ] Excluded-surface summary is empty; re-run is byte-identical (idempotent); `validate.sh --strict` Errors 0.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
One deterministic script produces a mutation-free dry-run covering all five reference classes with 0 collisions
and 0 edits to excluded surfaces, reviewed before Phase 004 runs it.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
Consumes Phase 001 (canonical slug) + Phase 002 (tolerant classifier); feeds Phase 004 (runs with `--apply`).
<!-- /ANCHOR:cross-refs -->
