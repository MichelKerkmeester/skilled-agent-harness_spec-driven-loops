---
title: "Tasks: create-changelog resource names"
description: "Concrete execution and verification tasks for the create-changelog resource naming phase."
trigger_phrases:
  - "create-changelog resource tasks"
  - "changelog guidance rename tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/009-create-changelog"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/009-create-changelog"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-changelog tasks"
    next_safe_action: "Execute the changelog guidance inventory"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-changelog/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: create-changelog resource names

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

- [ ] T001 Inventory create-changelog references, indexes, examples, and consumers.
- [ ] T002 Freeze the three source/target rows.
- [ ] T003 Mark version values, release filenames, global paths, mandated names, and fields exempt.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename topology, version-bump, and worked-example references.
- [ ] T005 Update packet-local links and path values.
- [ ] T006 Preserve version/release semantics and phase 006 ownership.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Verify: all three targets exist and old packet paths are absent.
- [ ] T008 Verify: guidance links and indexes resolve.
- [ ] T009 Verify: version/release content and global changelog paths are unchanged.
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
