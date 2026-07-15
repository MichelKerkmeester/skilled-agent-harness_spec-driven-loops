---
title: "Tasks: create-manual-testing-playbook resource names"
description: "Concrete execution and verification tasks for the create-manual-testing-playbook resource naming phase."
trigger_phrases:
  - "create playbook resource tasks"
  - "manual testing template rename tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/006-create-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/006-create-manual-testing-playbook"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-playbook tasks"
    next_safe_action: "Execute the playbook resource inventory"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-manual-testing-playbook/assets/", ".opencode/skills/sk-doc/create-manual-testing-playbook/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: create-manual-testing-playbook resource names

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

- [ ] T001 Inventory packet assets, references, and path consumers.
- [ ] T002 Freeze the four source/target rows and root-playbook boundary.
- [ ] T003 Mark scenario IDs, fields, keys, mandated names, and root paths exempt.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename the two playbook templates and two reference files.
- [ ] T005 Update packet-owned links and path values.
- [ ] T006 Preserve playbook content contracts and root surface ownership.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Verify: all four targets exist and old packet paths are absent.
- [ ] T008 Verify: packet resource links resolve without touching the root playbook.
- [ ] T009 Verify: scenario/content fields and mandated names are unchanged.
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
