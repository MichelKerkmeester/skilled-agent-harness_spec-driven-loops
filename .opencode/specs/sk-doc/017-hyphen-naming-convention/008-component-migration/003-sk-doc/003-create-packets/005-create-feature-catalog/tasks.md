---
title: "Tasks: create-feature-catalog resource names"
description: "Concrete execution and verification tasks for the create-feature-catalog resource naming phase."
trigger_phrases:
  - "create-feature-catalog resource tasks"
  - "feature catalog template rename tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/005-create-feature-catalog"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/005-create-feature-catalog"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored feature catalog tasks"
    next_safe_action: "Execute the feature catalog inventory"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-feature-catalog/assets/", ".opencode/skills/sk-doc/create-feature-catalog/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: create-feature-catalog resource names

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
- [ ] T002 Freeze the two asset and one reference rename rows.
- [ ] T003 Mark schema keys, feature IDs, external paths, mandated names, and fields exempt.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename the two feature-catalog templates and `common_pitfalls.md`.
- [ ] T005 Update packet-owned links and path values.
- [ ] T006 Preserve catalog payload and external path semantics.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Verify: all three targets exist and old packet paths are absent.
- [ ] T008 Verify: template and reference loading resolves.
- [ ] T009 Verify: schema, IDs, external paths, and mandated names are unchanged.
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
