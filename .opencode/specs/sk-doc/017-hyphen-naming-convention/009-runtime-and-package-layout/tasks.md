---
title: "Tasks: runtime and package layout (017 phase 009)"
description: "Tasks for phase 009 of the 017 kebab-case filesystem-naming program: runtime and package layout."
trigger_phrases:
  - "runtime and package layout tasks"
  - "hyphen naming phase 009 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/009-runtime-and-package-layout"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/009-runtime-and-package-layout"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Tasks authored from the 16-phase decomposition"
    next_safe_action: "Execute this phase on the pinned worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Runtime and package layout

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

- [ ] T001 Confirm predecessor phases landed and the pinned worktree is clean (per this phase's spec adjacency)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 Rename in-scope runtime/package-layout directories WITH their manifests, lockfiles, tsconfigs, launchers, imports, tests, and registries, each in one dependency-closed batch
- [ ] T003 Update canonical `package.json` workspaces + regenerate lockfiles when a package path moves
- [ ] T004 Prove deps + build resolve inside the worktree after each batch (`realpath`, fresh install)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Verify: Each runtime/package-layout dir moves with its complete manifest/launcher/import/test/registry closure — No dangling reference to the old path after the batch
- [ ] T006 Verify: Canonical workspace manifests + lockfiles are updated when a package path moves — `package.json` workspaces and the lockfile reference the new path; a clean install succeeds
- [ ] T007 Verify: Deps and build resolve inside the worktree after each batch — `realpath` on resolved packages + build output stays inside the worktree
- [ ] T008 Verify: Affected builds/typechecks/tests pass after each batch — `tsc`/build and tests for the moved packages are green
- [ ] T009 Verify: Symlink modes and executable bits are preserved on moved launchers — Mode 120000 and +x survive the move
- [ ] T010 Verify: Python import-package directories are NOT renamed — No `_`->`-` on a directory that is imported as a Python package
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
