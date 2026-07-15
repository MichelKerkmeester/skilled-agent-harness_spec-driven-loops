---
title: "Tasks: execute the 111-file rename + fold in adjacent corpus fixes"
description: "Task breakdown for running the migration fanned out by skill family, plus the decision-B fold-in fixes."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/015-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames/004-execute-migration"
    last_updated_at: "2026-07-11T17:41:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase tasks authored"
    next_safe_action: "Run the Phase 003 dry-run migration"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Execute the 111-file Rename + Fold in Adjacent Corpus Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation
`[x]` complete · `[ ]` pending.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] Confirm Phase 001 (number-agnostic loader, `stage:` parsing) has landed.
- [ ] Confirm Phase 002 (generator emits slug filenames) has landed.
- [ ] Full dry-run; reconcile the report against research.md counts (111 files across 9 packets, 63 `stage:`
      injections, 3 hub-routing index rewrites, 0 collisions).
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] Execute the migration family-by-family across the 9 packets (fan out on disjoint families): `cli-external`
      (`cli-claude-code` 10, `cli-opencode` 10, hub-routing 5), `mcp-tooling` (hub-routing 6, `mcp-chrome-devtools`
      8, `mcp-click-up` 7, `mcp-figma` 9), `sk-code` (`code-review` 7, `code-opencode` 9, `code-webflow` 13,
      `code-quality` 1), `sk-prompt` (hub-routing 4), `system-deep-loop` (`deep-improvement` 10, `deep-research`
      8, `deep-review` 4).
- [ ] Inject `stage: routing|holdout|negative` frontmatter on the 63 grouped files during each family's rename
      pass; default `stage: routing` on the remaining 48.
- [ ] Rewrite the 3 hub-routing root-index tables (`cli-external`, `mcp-tooling`, `sk-prompt`) in lockstep with
      their owning family's rename.
- [ ] Validate each family `--strict` Errors 0 before its commit.
- [ ] Path-scoped commit per family (exclude branch WIP and any concurrent-session dirt).
- [ ] Adjacent fold-in (operator decision): fix `system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts`
      (`ENOENT` on a stale numbered name).
- [ ] Adjacent fold-in: fix `system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts` (`ENOENT` on
      a stale numbered name).
- [ ] Adjacent fold-in: sweep the 7 dead allowlist entries in `workflow-invariance.vitest.ts:97-104`.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] Repo-wide find: zero in-scope `^\d{3}-` snippet filenames outside the excluded surfaces.
- [ ] Hub-routing root-index rows and all 63 `stage:` fields resolve/confirm against on-disk de-numbered paths.
- [ ] Excluded surfaces (20 system-spec-kit single-digit files, `z_archive/`, changelog/history) byte-unchanged.
- [ ] The 2 previously-failing vitest suites pass; `workflow-invariance.vitest.ts` passes with the allowlist
      entries removed.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
All 111 files renamed across the 9 packets, `stage:` frontmatter injected on the 63 grouped files, the 3
hub-routing root-index tables rewritten, every family validated Errors 0, the 2 vitest suites fixed, the 7 dead
allowlist entries swept, exclusions intact.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
Consumes Phase 003 tooling; gated by Phase 001 (tolerant loader) and Phase 002 (generator alignment); verified
end-to-end by Phase 005.
<!-- /ANCHOR:cross-refs -->
