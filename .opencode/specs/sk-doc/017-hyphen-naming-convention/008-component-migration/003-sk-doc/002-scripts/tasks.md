---
title: "Tasks: sk-doc scripts and test fixtures"
description: "Concrete execution and verification tasks for the sk-doc scripts-tree naming phase."
trigger_phrases:
  - "sk-doc scripts tasks"
  - "scripts fixture rename tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/002-scripts"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/002-scripts"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored scripts tasks"
    next_safe_action: "Execute the type-aware inventory"
    blockers: []
    key_files: [".opencode/skills/sk-doc/scripts/", ".opencode/skills/sk-doc/scripts/tests/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: sk-doc scripts and test fixtures

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

- [ ] T001 Inventory every file and symlink under `scripts/` and classify by extension.
- [ ] T002 Freeze the thirteen non-Python fixture/test source/target rows and all consumer search terms.
- [ ] T003 Record Python script names and package directories as explicit exemptions.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename `auto_detect_command.md`, `missing_emojis.md`, `missing_sections.md`, `missing_toc.md`, `single_dash_anchors.md`, `auto_detect_spec.md`, `valid_command.md`, `valid_install_guide.md`, `valid_readme.md`, `valid_skill.md`, `valid_spec.md`, `test_flowchart_validator.sh`, and `test_frontmatter_version.mjs` to kebab-case.
- [ ] T005 Update fixture loaders, test references, README links, globs, and path-valued registry entries.
- [ ] T006 Leave all `.py`, existing hyphenated executable names, and facade symlink basenames unchanged.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Verify: no non-Python snake_case candidate remains under `scripts/`.
- [ ] T008 Verify: every old fixture path has no stale live consumer and every target is discoverable.
- [ ] T009 Verify: Python script names, symlink names, modes, and target behavior match BASE.
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
