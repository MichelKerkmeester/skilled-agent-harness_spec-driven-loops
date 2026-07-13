---
title: "Tasks: remove transition aliases (017 phase 008)"
description: "Tasks for phase 008 of the 017 kebab-case filesystem-naming program: remove transition aliases."
trigger_phrases:
  - "remove transition aliases tasks"
  - "hyphen naming phase 008 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-remove-transition-aliases"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-remove-transition-aliases"
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
# Tasks: Remove transition aliases

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

- [ ] T002 Remove the underscore aliases from the 002 classifier/loader/guards
- [ ] T003 Prove the old live root names are now rejected
- [ ] T004 Confirm only scoped frozen/exempt references to the old names remain
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Verify: The underscore aliases are removed from all 002 consumers — No consumer accepts the underscore roots anymore
- [ ] T006 Verify: The old live root names are rejected — A synthetic underscore catalog leaf fails classification/guard
- [ ] T007 Verify: Only scoped frozen/exempt references to the old names remain — A scope-aware scan finds old-name references only under frozen/exempt paths
- [ ] T008 Verify: The Lane C loader still loads all scenarios under the hyphenated roots — Scenario count and IDs unchanged after alias removal
- [ ] T009 Verify: The convention guard now enforces hyphen-only for catalog content — The inverse guard rejects any re-introduced underscore catalog name
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
