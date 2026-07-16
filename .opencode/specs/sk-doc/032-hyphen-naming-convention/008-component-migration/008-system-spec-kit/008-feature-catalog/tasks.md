---
title: "Tasks: Feature catalog (032 subtree 008 phase 008)"
description: "The skill’s feature_catalog tree contains 366 underscore-bearing filesystem names: the root, 17 candidate category directories, and 348 files. This phase renames the catalog root, categories, and content to kebab-case and updates catalog indexes, path-derived metadata, links, and consumers without changing frontmatter fields or code identifiers."
trigger_phrases:
  - "system-spec-kit feature catalog"
  - "feature_catalog to feature-catalog"
  - "catalog filename kebab-case"
  - "feature catalog phase 008"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/008-system-spec-kit/008-feature-catalog"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned feature-catalog tasks"
    next_safe_action: "Execute the feature-catalog map after shared/runtime is stable"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: Feature catalog

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Freeze the 366-candidate inventory and active consumer map.
- [ ] T002 Capture baseline leaf IDs, category assignments, and link/resolution output.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Create and review the root/category/file semantic map.
- [ ] T004 Rename catalog paths in dependency-closed batches.
- [ ] T005 Update indexes, links, path-valued metadata, and active consumers.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Verify: Candidate count and map are complete — evidence: inventory and hash.
- [ ] T007 Verify: Targets are collision-free — evidence: collision report.
- [ ] T008 Verify: All consumers resolve — evidence: link/index/loader output.
- [ ] T009 Verify: Schema and exemption boundaries hold — evidence: diff audit.
- [ ] T010 Verify: Leaf discovery is unchanged — evidence: pre/post parity report.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green in the central validation worktree
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

