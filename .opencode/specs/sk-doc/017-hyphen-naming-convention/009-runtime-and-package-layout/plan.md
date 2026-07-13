---
title: "Implementation Plan: runtime and package layout (017 phase 009)"
description: "Implementation Plan for phase 009 of the 017 kebab-case filesystem-naming program: runtime and package layout."
trigger_phrases:
  - "runtime and package layout implementation plan"
  - "hyphen naming phase 009 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/009-runtime-and-package-layout"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/009-runtime-and-package-layout"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Plan authored from the 16-phase decomposition"
    next_safe_action: "Execute this phase on the pinned worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Runtime and package layout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-doc + repo (phase 009) |
| **Change class** | Filesystem rename + package layout |
| **Execution** | Isolated worktree pinned to BASE (established in phase 000) |

### Overview
Runtime and package-layout directories (mcp_server, install_scripts, plugin_bridges, matrix_runners, behavior_benchmark, stress_test, level_1/2/3 templates, and __fixtures__/__tests__/_support where safe) interact with workspace manifests, tsconfigs, test discovery, launchers, and registries. Detailed design is finalized when this phase is picked up for execution against the pinned baseline.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Each runtime/package-layout dir moves with its complete manifest/launcher/import/test/registry closure
- [ ] Canonical workspace manifests + lockfiles are updated when a package path moves
- [ ] Deps and build resolve inside the worktree after each batch
- [ ] Affected builds/typechecks/tests pass after each batch
- [ ] Symlink modes and executable bits are preserved on moved launchers
- [ ] Python import-package directories are NOT renamed

### Definition of Done
- [ ] Runtime/package-layout dirs are hyphenated with reproducible builds
- [ ] No dangling manifest/registry/import references
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Rename in-scope runtime/package-layout directories WITH their manifests, lockfiles, tsconfigs, launchers, imports, tests, and registries, each in one dependency-closed batch.
- Update canonical `package.json` workspaces + regenerate lockfiles when a package path moves.
- Prove deps + build resolve inside the worktree after each batch (`realpath`, fresh install).
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm predecessor phases landed; verify the worktree is clean, pinned to BASE, and scoped.

### Phase 2: Implementation
- Rename in-scope runtime/package-layout directories WITH their manifests, lockfiles, tsconfigs, launchers, imports, tests, and registries, each in one dependency-closed batch.
- Update canonical `package.json` workspaces + regenerate lockfiles when a package path moves.
- Prove deps + build resolve inside the worktree after each batch (`realpath`, fresh install).

### Phase 3: Verification
- No dangling reference to the old path after the batch
- `package.json` workspaces and the lockfile reference the new path; a clean install succeeds
- `realpath` on resolved packages + build output stays inside the worktree
- `tsc`/build and tests for the moved packages are green
- Mode 120000 and +x survive the move
- No `_`->`-` on a directory that is imported as a Python package
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | No dangling reference to the old path after the batch |
| REQ-002 | `package.json` workspaces and the lockfile reference the new path; a clean install succeeds |
| REQ-003 | `realpath` on resolved packages + build output stays inside the worktree |
| REQ-004 | `tsc`/build and tests for the moved packages are green |
| REQ-005 | Mode 120000 and +x survive the move |
| REQ-006 | No `_`->`-` on a directory that is imported as a Python package |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Inherits the 017 program dependencies: the Lane C benchmark harness (regression check), the spec-kit validator
(rebuilt in the worktree), and sk-git for the worktree lifecycle. Phase-specific dependencies are the predecessor
phases named in this phase's spec adjacency.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All work lands on the dedicated worktree in path-scoped commits, so `git revert` of this phase's commits restores the
prior state (or a stopped, disposable satellite worktree is discarded). No data migration beyond git-reversible
filesystem renames and reference rewrites — except the SQLite handling in phase 013, which is schema-aware.
<!-- /ANCHOR:rollback -->
