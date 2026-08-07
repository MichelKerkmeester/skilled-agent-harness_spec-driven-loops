---
title: "Tasks: create-agent resource names"
description: "Concrete execution and verification tasks for the create-agent resource naming phase."
trigger_phrases:
  - "create-agent resource tasks"
  - "agent template rename tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/003-create-agent"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/003-create-agent"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-agent tasks"
    next_safe_action: "Execute the create-agent inventory"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-agent/assets/", ".opencode/skills/sk-doc/create-agent/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: create-agent resource names

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

- [ ] T001 Inventory create-agent assets, references, routes, and consumers.
- [ ] T002 Freeze the three resource rename rows.
- [ ] T003 Mark permission fields, identifiers, mandated names, and existing hyphenated files exempt.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename `agent_template.md`, `common_pitfalls.md`, and `permission_design.md`.
- [ ] T005 Update scaffold, README, SKILL.md, and route/reference path values.
- [ ] T006 Preserve agent permission content and already-canonical resource names.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Verify: all three targets exist and old live paths are absent.
- [ ] T008 Verify: routed resource loading and agent scaffold links resolve.
- [ ] T009 Verify: permission/frontmatter fields and mandated names are unchanged.
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
