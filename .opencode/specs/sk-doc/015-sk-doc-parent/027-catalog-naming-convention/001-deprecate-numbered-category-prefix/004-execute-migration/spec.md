---
title: "Spec: execute the de-numbering migration across all skills"
description: "Phase 004. Run the Phase 003 migration tooling against the live tree, fanned out by skill family so each batch validates independently: rename all 390 numbered category folders to their bare slug, rewrite every in-scope reference (115 frontmatter category values, ~1,052 index-table rows, ~5,298 nav/cross-ref links, the two SKILL.md router-prefix blocks), and leave the changelog/history surface untouched. Path-scoped commits inside the isolated worktree. Gated on Phase 002's tolerant classifier landing first (ADR-002)."
trigger_phrases:
  - "execute de-numbering migration"
  - "rename category folders"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/015-sk-doc-parent/027-catalog-naming-convention/001-deprecate-numbered-category-prefix"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-parent/027-catalog-naming-convention/001-deprecate-numbered-category-prefix/004-execute-migration"
    last_updated_at: "2026-07-11T19:50:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase spec authored"
    next_safe_action: "Run dry-run, then execute per family"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Spec: Execute the De-numbering Migration

> **Phase adjacency** (grouping order under the parent, not a runtime dependency): predecessor `003-migration-tooling`; successor `005-validate-and-rebenchmark`.

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

## 1. METADATA
<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Packet** | 025/004-execute-migration |
| **Level** | 2 |
| **Status** | Complete |
| **Phase** | 004 of 005 (execution) |
<!-- /ANCHOR:metadata -->

## 2. PROBLEM & PURPOSE
<!-- ANCHOR:problem -->
The migration tooling (Phase 003) is dry-run-verified but has not mutated the tree. This phase runs it for real.
Because ~6,500 edits across 34 skills is too large to review as one commit, execution is **fanned out by skill
family**: each skill (or small group) is migrated, validated, and committed on its own, so a failure is isolated
and bisectable. Per ADR-002 this phase may only start once Phase 002's number-agnostic classifier has landed —
otherwise each renamed leaf would lose validation the moment it is renamed.
<!-- /ANCHOR:problem -->

## 3. SCOPE
<!-- ANCHOR:scope -->
**In scope:** invoke the Phase 003 script against the live worktree; per-family batches covering all 34 skills;
per-family `validate.sh --strict`; path-scoped commits (excluding pre-existing branch WIP and any
concurrent-session dirt). All 390 folders renamed; all four reference classes + the two router-prefix blocks
rewritten; 115 frontmatter `category:` values updated.

**Out of scope:** authoring the script (Phase 003); the final recursive validation + benchmark regression proof
(Phase 005); editing changelog/history (excluded by the script's deny-list, ADR-004).
<!-- /ANCHOR:scope -->

## 4. REQUIREMENTS
<!-- ANCHOR:requirements -->
- **REQ-001:** Zero `feature_catalog/NN--*/` or `manual_testing_playbook/NN--*/` folders remain outside the excluded
  changelog/history surface after execution.
- **REQ-002:** Each migrated skill family passes `validate.sh --strict` (Errors 0) before its commit; a family that
  fails is fixed or reverted, not committed.
- **REQ-003:** The excluded surfaces (`z_archive/`, `CHANGELOG*`, history/implementation-summary narrative, this
  packet's evidence docs) are byte-unchanged.
- **REQ-004:** The two SKILL.md router-prefix blocks resolve to renamed, on-disk folders (no dead prefixes).
- **REQ-005:** All 115 numbered `category:` frontmatter values are updated to the de-numbered form.
<!-- /ANCHOR:requirements -->

## 5. SUCCESS CRITERIA
<!-- ANCHOR:success-criteria -->
1. A repo-wide find for in-scope `NN--` category folders returns zero.
2. Every touched skill family validated Errors 0 at commit time.
3. Router prefixes + frontmatter categories confirmed pointing at real de-numbered paths.
<!-- /ANCHOR:success-criteria -->

## 6. RISKS & DEPENDENCIES
<!-- ANCHOR:risks -->
- *Concurrent-session churn on the active branch* → executed in the isolated worktree with path-scoped commits.
- *A mid-migration link breakage* → caught by per-family `validate.sh --strict` before commit; Phase 005 runs
  the whole-workspace link guard as the backstop.
- *Depends on* Phase 002 (tolerant classifier, ADR-002) and Phase 003 (the reviewed script).
<!-- /ANCHOR:risks -->

## 7. OPEN QUESTIONS
<!-- ANCHOR:questions -->
Family batching granularity (per-skill vs per-parent-hub) is decided at run time from the dry-run report size.
<!-- /ANCHOR:questions -->
