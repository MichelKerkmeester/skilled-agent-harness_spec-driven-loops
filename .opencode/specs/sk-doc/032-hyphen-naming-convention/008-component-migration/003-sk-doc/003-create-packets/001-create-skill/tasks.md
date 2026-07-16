---
title: "Tasks: create-skill resource names"
description: "Concrete execution and verification tasks for the create-skill resource naming phase."
trigger_phrases:
  - "create-skill resource tasks"
  - "create-skill template rename tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/001-create-skill"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/001-create-skill"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-skill tasks"
    next_safe_action: "Execute the create-skill inventory"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-skill/assets/", ".opencode/skills/sk-doc/create-skill/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: create-skill resource names

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

- [ ] T001 Inventory create-skill assets, references, scripts, and path consumers.
- [ ] T002 Freeze the two parent-skill directory rows, twenty non-exempt file rows, and all consumer search terms.
- [ ] T003 Mark mandated files, Python files, package directories, keys, and identifiers exempt.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename the `parent_skill` resource directories and all twenty listed parent, scaffold, skill, and reference files to kebab-case.
- [ ] T005 Update scaffold, README, SKILL.md, reference, and script path values.
- [ ] T006 Leave tool-mandated names, `.py` files, and payload fields unchanged.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Verify: every manifest target exists and every old live path is gone.
- [ ] T008 Verify: parent-skill and ordinary-skill resource loading resolves through the new paths.
- [ ] T009 Verify: the diff contains no Python, mandated-name, key, or identifier changes.
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
