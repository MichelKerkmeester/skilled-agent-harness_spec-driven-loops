---
title: "Tasks: system-deep-loop runtime names (032 phase 007/002)"
description: "Execution tasks for renaming the runtime directory/file surface and repairing package, script, test, catalog, playbook, and reference consumers."
trigger_phrases:
  - "system-deep-loop runtime tasks"
  - "runtime kebab-case naming tasks"
  - "deep loop runtime path repair tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/007-system-deep-loop/002-runtime"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/007-system-deep-loop/002-runtime"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored runtime tasks"
    next_safe_action: "Execute the runtime rename closure"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: System-deep-loop runtime names

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

- [ ] T001 Load the runtime frozen map, BASE manifest, package workspace data, and test-discovery baseline.
- [ ] T002 [P] Inventory `feature_catalog`, `manual_testing_playbook`, `coverage_graph`, `prompt_rendering`, `script_entry_points`, and `state_safety` plus all 108 underscore-bearing files.
- [ ] T003 Trace runtime imports, resource maps, script paths, fixtures, symlinks, database paths, and tool-name exclusions.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Classify every runtime path as rename, exempt, frozen, generated, or tool-mandated with no unknown row.
- [ ] T005 Rename the six directory families and their in-scope leaf files through dependency-closed batches.
- [ ] T006 Update runtime README/references, `lib/`, scripts, hooks, tests, fixtures, resource indexes, and path-valued package configuration.
- [ ] T007 Preserve `package-lock.json`, `tsconfig.json`, `vitest.config.ts`, state markers, database names, event keys, and code identifiers.
- [ ] T008 Record the final source-to-target map, reference dispositions, and workspace path evidence.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Resolve every old/new runtime module, resource, Markdown, script, fixture, and package path.
- [ ] T010 Rebuild/install from the isolated worktree and compare workspace realpaths and package resolution with BASE.
- [ ] T011 Run runtime unit/integration/script-contract checks with non-zero test discovery.
- [ ] T012 Compare catalog/playbook discovery and test counts with BASE and inspect the scope-clean diff.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] Every requirement in spec.md has evidence in the candidate report
- [ ] The phase checklist is green
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Governing policy**: See `../../../001-convention-policy-and-scope/spec.md`
<!-- /ANCHOR:cross-refs -->
