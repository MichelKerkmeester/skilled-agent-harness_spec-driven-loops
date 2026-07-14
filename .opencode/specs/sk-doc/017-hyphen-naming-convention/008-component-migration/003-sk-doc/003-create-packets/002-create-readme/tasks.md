---
title: "Tasks: create-readme resource names"
description: "Concrete execution and verification tasks for the create-readme resource naming phase."
trigger_phrases:
  - "create-readme resource tasks"
  - "install guide template rename tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/002-create-readme"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/002-create-readme"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-readme tasks"
    next_safe_action: "Execute the create-readme inventory"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-readme/assets/", ".opencode/skills/sk-doc/create-readme/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: create-readme resource names

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

- [ ] T001 Inventory create-readme assets, references, scripts, and path consumers.
- [ ] T002 Freeze the install-guide directory and eight file rename rows.
- [ ] T003 Mark Python, mandated names, placeholders, and keys exempt.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename the install-guide directory, three assets, and five reference files.
- [ ] T005 Update packet links, template links, examples, and audit-helper path values.
- [ ] T006 Leave `audit_readmes.py`, payload fields, and tool names unchanged.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Verify: all manifest targets exist and all old live paths are gone.
- [ ] T008 Verify: install-guide and README resource domains resolve independently.
- [ ] T009 Verify: content diff contains only path/reference changes.
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
