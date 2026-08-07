---
title: "Tasks: create-quality-control resource names"
description: "Concrete execution and verification tasks for the create-quality-control resource naming phase."
trigger_phrases:
  - "create-quality-control resource tasks"
  - "quality control reference rename tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/011-create-quality-control"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/011-create-quality-control"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored quality control tasks"
    next_safe_action: "Execute the quality control inventory"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-quality-control/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: create-quality-control resource names

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

- [ ] T001 Inventory quality-control references, indexes, workflows, and consumers.
- [ ] T002 Freeze the three source/target rows.
- [ ] T003 Mark shared paths, workflow fields, keys, mandated names, and identifiers exempt.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename transformation, validation, and workflow-example references.
- [ ] T005 Update packet-owned links and path values.
- [ ] T006 Preserve `workflows.md`, shared paths, scores, and validation semantics.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Verify: all three targets exist and old packet paths are absent.
- [ ] T008 Verify: reference indexes and workflow links resolve.
- [ ] T009 Verify: shared ownership and quality-control content remain unchanged.
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
