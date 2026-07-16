---
title: "Tasks: create-command resource names"
description: "Concrete execution and verification tasks for the create-command resource naming phase."
trigger_phrases:
  - "create-command resource tasks"
  - "command template rename tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/004-create-command"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/004-create-command"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-command tasks"
    next_safe_action: "Execute the create-command inventory"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-command/assets/", ".opencode/skills/sk-doc/create-command/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: create-command resource names

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

- [ ] T001 Inventory create-command assets, references, routes, and consumers.
- [ ] T002 Freeze the seven source/target rows.
- [ ] T003 Mark command fields, keys, identifiers, mandated names, and existing canonical paths exempt.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename the three command templates and four reference files.
- [ ] T005 Update SKILL, README, template, and reference path values.
- [ ] T006 Preserve router/presentation split, argument hints, modes, and metadata.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Verify: all seven targets exist and old live paths are absent.
- [ ] T008 Verify: command resource links and routing references resolve.
- [ ] T009 Verify: command behavior fields and mandated names are unchanged.
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
