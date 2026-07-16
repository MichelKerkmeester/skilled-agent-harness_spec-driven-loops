---
title: "Tasks: create-flowchart resource names"
description: "Concrete execution and verification tasks for the create-flowchart resource naming phase."
trigger_phrases:
  - "create-flowchart resource tasks"
  - "flowchart asset rename tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/008-create-flowchart"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/008-create-flowchart"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-flowchart tasks"
    next_safe_action: "Execute the flowchart resource inventory"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-flowchart/assets/", ".opencode/skills/sk-doc/create-flowchart/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: create-flowchart resource names

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

- [ ] T001 Inventory flowchart assets, references, validator paths, and consumers.
- [ ] T002 Freeze the ten source/target rows.
- [ ] T003 Mark notation tokens, validator behavior/content, mandated names, and fields exempt.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename six pattern assets, three reference files, and the validator filename.
- [ ] T005 Update packet links and path values.
- [ ] T006 Preserve validator behavior and flowchart notation after the script path change.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Verify: all ten targets exist and old live paths are absent.
- [ ] T008 Verify: pattern/guidance resources and validator references resolve.
- [ ] T009 Verify: notation and script content are unchanged.
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
