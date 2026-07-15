---
title: "Tasks: sk-doc manual-testing-playbook tree"
description: "Concrete execution and verification tasks for the root manual-testing-playbook naming phase."
trigger_phrases:
  - "sk-doc manual playbook tasks"
  - "manual playbook rename tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/003-sk-doc/004-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/003-sk-doc/004-manual-testing-playbook"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored manual playbook tasks"
    next_safe_action: "Execute the playbook census"
    blockers: []
    key_files: [".opencode/skills/sk-doc/manual_testing_playbook/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: sk-doc manual-testing-playbook tree

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

- [ ] T001 Inventory root index, six category directories, scenarios, and consumers.
- [ ] T002 Freeze the complete directory/file rename map.
- [ ] T003 Mark scenario IDs, fields, content, and external surfaces exempt.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename the root directory/index and six category directories.
- [ ] T005 Rename all underscore-bearing scenario files and update index/category/cross-surface links; leave already-kebab scenarios unchanged.
- [ ] T006 Preserve scenario content, IDs, and fields.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Verify: every in-scope tree path has one kebab-case target.
- [ ] T008 Verify: root/category/scenario links resolve and counts match BASE.
- [ ] T009 Verify: scenario content and external ownership are unchanged.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete.
- [ ] All requirements in `spec.md` have evidence in the candidate report.
- [ ] The phase checklist is satisfied by the central verifier.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
<!-- /ANCHOR:cross-refs -->
