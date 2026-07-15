---
title: "Tasks: de-numbering snippet filenames migration tooling"
description: "Task breakdown for authoring the deterministic, dry-runnable rename engine for the 111 in-scope snippet filenames."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/015-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames/003-migration-tooling"
    last_updated_at: "2026-07-11T17:41:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase tasks authored"
    next_safe_action: "Implement the rename engine + dry-run report"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: De-Numbering Snippet Filenames Migration Tooling

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation
`[x]` complete · `[ ]` pending.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] Enumerate the 111 in-scope files from the 9 named packet paths and build the `{ oldPath → newPath }` rename map.
- [ ] Assert the map size against research.md (111 files across 9 packets; 63 R/H/N-structured).
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] Implement the collision check (abort if two stripped names collide in a parent category folder; expected 0).
- [ ] Implement the corrected deny-list predicate (`z_archive/`, `CHANGELOG*`/`changelog*`, history, this packet's evidence, and the current `sk-doc/015-sk-doc-parent` path — fixing the 108 stale `999-sk-doc-parent` self-exclusion bug).
- [ ] Implement stage derivation for the 63 R/H/N files (holdout/negative token detection; `routing` default) and the frontmatter-injection edit plan.
- [ ] Implement the reference sweep for the 3 hub-routing root-index tables (`cli-external`, `mcp-tooling`, `sk-prompt`), word-boundary safe.
- [ ] Implement the dry-run report (rename map + per-file diff + stage-injection preview + collision + excluded-surface summary) and the `--apply` gate.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] Dry-run reports 111 renames / 63 `stage:` injections (14 holdout / 5 negative / 44 routing) / 3 root-index tables / 0 collisions; `git status` clean after.
- [ ] Deny-list regression test: stale `999-sk-doc-parent` path does not match, current `sk-doc/015-sk-doc-parent` path does; excluded-surface summary empty; re-run byte-identical (idempotent); `validate.sh --strict` Errors 0.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
One deterministic script produces a mutation-free dry-run covering the scoped 111-file rename, the 63-file
`stage:` injection, and the 3-table reference sweep with 0 collisions and 0 edits to excluded surfaces, reviewed
before Phase 004 runs it.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
Consumes Phase 001 (number-agnostic loader + `stage:` field parsing) + Phase 002 (generator alignment); feeds
Phase 004 (runs with `--apply`).
<!-- /ANCHOR:cross-refs -->
