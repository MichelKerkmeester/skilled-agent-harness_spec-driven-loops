---
title: "Tasks: sk-doc validator and classifier logic (019 phase 002)"
description: "Tasks for phase 002 of the 019 kebab-case filesystem-naming program: sk-doc validator and classifier logic."
trigger_phrases:
  - "sk-doc validator and classifier logic tasks"
  - "hyphen naming phase 002 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/002-sk-doc-validator-and-classifier-logic"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/002-sk-doc-validator-and-classifier-logic"
    last_updated_at: "2026-07-13T11:44:19Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Tasks scaffolded from the 019 decomposition"
    next_safe_action: "Plan or execute this phase on the worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: sk-doc validator and classifier logic

<!-- SPECKIT_LEVEL: 1 -->
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

- [ ] T001 Confirm predecessor phases landed and the execution worktree is clean (per this phase's spec adjacency)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 `validate_document.py` classifier (both copies) updated to recognize `feature-catalog` / `manual-testing-playbook`
- [ ] T003 A transition tolerance that accepts BOTH the underscore and hyphen root names during migration
- [ ] T004 Any validator rule or Lane C loader path that references the two root names by string
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Verify: The classifier recognizes hyphenated catalog/playbook roots and still types leaves correctly — A hyphenated catalog leaf classifies as its typed document, not `readme`
- [ ] T006 Verify: A dual-name tolerance accepts both underscore and hyphen roots during transition — Both `feature_catalog` and `feature-catalog` leaves classify identically
- [ ] T007 Verify: Both copies of the classifier change identically with no drift — Diff of the two copies is byte-identical in the changed region
- [ ] T008 Verify: The Lane C loader remains separator-agnostic and loads unchanged — Discovered-scenario count is unchanged
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
