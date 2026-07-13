---
title: "Tasks: root-name consumer migration (017 phase 002)"
description: "Tasks for phase 002 of the 017 kebab-case filesystem-naming program: root-name consumer migration."
trigger_phrases:
  - "root-name consumer migration tasks"
  - "hyphen naming phase 002 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/002-root-name-consumer-migration"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/002-root-name-consumer-migration"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Tasks authored from the 16-phase decomposition"
    next_safe_action: "Execute this phase on the pinned worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Root-name consumer migration

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

- [ ] T001 Confirm predecessor phases landed and the pinned worktree is clean (per this phase's spec adjacency)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 The `validate_document.py` classifier: update the real file under `shared/scripts/` and preserve the `sk-doc/scripts/` symlink (mode 120000)
- [ ] T003 The Lane C loader (`load-playbook-scenarios.cjs`) + generator (`playbook-generator.cjs`) hardcoded root/index names
- [ ] T004 `parent-skill-check.cjs`, `post-edit-router.cjs`, and `package_skill.py` root-name references
- [ ] T005 The inverse guard `check_no_hyphenated_catalog_content.py` + its tests, plus `test_category_classification_denumbered.py`, redefined to the hyphenated target
- [ ] T006 A bounded dual-name tolerance: accept both roots for reads, emit only hyphens, fail closed if both physical roots coexist
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Verify: Every runtime consumer of the catalog/playbook root/index names accepts the hyphenated roots — A reviewed consumer manifest lists each and all are updated
- [ ] T008 Verify: The classifier change preserves the symlink and types hyphenated leaves correctly — A hyphenated catalog leaf classifies as its typed document, not `readme`; the symlink mode stays 120000
- [ ] T009 Verify: A bounded dual-name tolerance accepts both roots but fails closed if both physically coexist — Both roots classify identically for reads; coexistence of both physical roots errors
- [ ] T010 Verify: The Lane C loader + generator load unchanged against the hyphenated roots — Discovered-scenario count and IDs are unchanged
- [ ] T011 Verify: The inverse guard and its tests are redefined to the hyphenated target — The guard rejects underscore catalog content and accepts hyphenated content
- [ ] T012 Verify: Root-name handling is correct on POSIX and Windows-style path separators — Matrix tests pass for both separators
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
