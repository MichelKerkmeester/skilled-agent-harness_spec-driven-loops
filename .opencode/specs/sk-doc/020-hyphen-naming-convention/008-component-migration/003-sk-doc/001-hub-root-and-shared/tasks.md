---
title: "Tasks: sk-doc hub root and shared backbone"
description: "Concrete execution and verification tasks for the sk-doc hub/shared kebab-case rename phase."
trigger_phrases:
  - "sk-doc hub shared tasks"
  - "shared backbone rename tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/001-hub-root-and-shared"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/001-hub-root-and-shared"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored hub shared tasks"
    next_safe_action: "Execute the census and reference inventory"
    blockers: []
    key_files: [".opencode/skills/sk-doc/shared/", ".opencode/skills/sk-doc/scripts/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: sk-doc hub root and shared backbone

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

- [ ] T001 Record the shared-tree census and root facade symlink targets at BASE.
- [ ] T002 Classify every underscore-bearing candidate as rename, exempt, mandated, generated, or frozen.
- [ ] T003 Record all live path consumers for the eleven non-exempt target names.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename the five shared asset names to kebab-case.
- [ ] T005 Rename `core_standards.md`, `evergreen_packet_id_rule.md`, `frontmatter_versioning.md`, `hvr_rules.md`, `quick_reference.md`, and `skill_contract.cjs` to kebab-case.
- [ ] T006 Update path-valued references and preserve root facade symlink paths, modes, and relative targets.
- [ ] T007 Confirm Python scripts, Python package directories, metadata, registry names, and keys were not edited.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Verify: the manifest is bijective — every changed shared path has one target and no unclassified candidate remains.
- [ ] T009 Verify: live consumers resolve — no stale old path remains outside intentional historical/content examples.
- [ ] T010 Verify: the facade is preserved — symlink targets, modes, and representative script dispatch match BASE behavior.
- [ ] T011 Verify: the exemption boundary is preserved — `.py`, package directories, mandated names, keys, and identifiers are unchanged.
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
- **Decision record**: See `decision-record.md`.
<!-- /ANCHOR:cross-refs -->
