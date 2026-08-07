---
title: "Tasks: create-skill scaffolding and packaging (020 phase 003 child 001)"
description: "Tasks for aligning create-skill scaffolding, package checks, templates, and regression fixtures with the kebab-case filesystem policy."
trigger_phrases:
  - "create-skill scaffolding tasks"
  - "skill packaging naming tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/003-create-generators-and-templates/001-create-skill-and-packaging"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/003-create-generators-and-templates/001-create-skill-and-packaging"
    last_updated_at: "2026-07-18T06:41:37.848Z"
    last_updated_by: "codex"
    recent_action: "Completed all create-skill output naming and package verification tasks"
    next_safe_action: "No child work remains"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Create-skill Scaffolding and Packaging

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

- [x] T001 Confirm the pinned worktree, 020 exemption boundary, and child scope before implementation. Evidence: `BASE 1ec0ad2947b` and scoped diff inventory.
- [x] T002 Inventory standalone/parent output branches in `create-skill/scripts/init_skill.py`, package checks, templates, and focused tests.
- [x] T003 [P] Build disposable standalone and parent-hub fixture inputs for generated-tree assertions.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Update generated skill-root, packet, and parent-hub storage names to use canonical kebab-case. Evidence: init_skill.py:315.
- [x] T005 Update package folder/frontmatter, generated resource-path, and archive-root checks without rejecting declared Python or tool-mandated exemptions. Evidence: package_skill.py:501.
- [x] T006 Update create-skill templates and packaging guidance so emitted reference/asset examples use hyphens. Evidence: SKILL.md:186 and validation_and_packaging.md:55.
- [x] T007 Add regression fixtures for invalid underscore names, valid hyphen names, recursive paths, archives, Python files/package directories, and tool-mandated names. Evidence: `test_generated_path_check_preserves_python_and_tool_exemptions`.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Verify: standalone scaffolding emits `demo-skill/SKILL.md` and rejects `demo_skill` before writing.
- [x] T009 Verify: parent-hub scaffolding emits hyphenated packet/storage directories and exact tool-mandated files. Evidence: `test_parent_scaffold_emits_kebab_storage_and_exact_tool_names`.
- [x] T010 Verify: generated templates and guidance contain canonical output patterns, with Python and tool exemptions stated explicitly. Evidence: `manual-testing-playbook/` and `frontmatter-templates.md`.
- [x] T011 Verify: package checks pass matching hyphenated names and fail noncanonical generated resource paths with actionable diagnostics. Evidence: `test_packaging_rejects_noncanonical_generated_resource_path`.
- [x] T012 Verify: archive filename, archive root, and members contain no non-exempt underscore path segment. Evidence: `test_package_uses_kebab_archive_root_and_members`.
- [x] T013 Run focused create-skill and package regression suites and record command, exit code, and fixture evidence.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete.
- [x] All requirements in `spec.md` are met with evidence.
- [x] The phase gate is green for the focused scaffold/package checks and tests.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Program policy**: See `../../001-convention-policy-and-scope/decision-record.md`.
<!-- /ANCHOR:cross-refs -->
