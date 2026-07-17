---
title: "Tasks: deep command namespace naming (032 phase 008/013/002)"
description: "Execution tasks for the maintained deep asset rename, legacy fallback closure, and generated contract refresh."
trigger_phrases:
  - "deep namespace naming tasks"
  - "deep asset rename tasks"
  - "deep contract refresh"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/002-deep-namespace"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/002-deep-namespace"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored deep namespace tasks"
    next_safe_action: "Execute the maintained deep asset closure"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: Deep command namespace naming

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| [ ] | Pending |
| [x] | Completed |
| [P] | Parallelizable |
| [B] | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Load the maintained deep map, generated-output disposition, BASE contract manifest, and compiler handoff.
- [ ] T002 [P] Inventory references to the 24 `deep_*` workflow/presentation assets and four legacy bodies.
- [ ] T003 Confirm compiled contract filenames, command IDs, schema keys, Python/package names, and frozen surfaces are excluded from physical rename.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename the eight maintained deep asset families from underscore basenames to mapped kebab-case targets.
- [ ] T005 Rename the four maintained legacy fallback bodies and update fallback injection pointers.
- [ ] T006 Update command, README, compiler, test, and external path-valued references in the same closure.
- [ ] T007 Regenerate or validate the four compiled contracts without renaming their generated filenames; record source-digest evidence.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Compare all maintained and exempt rows with the frozen map and check collisions.
- [ ] T009 Resolve all deep asset, legacy, compiler source, and contract references.
- [ ] T010 Run deep command-reference and compiled-contract validation with non-zero coverage.
- [ ] T011 Compare route, mode, fallback, and command-ID outcomes with BASE and confirm no generated filename changed.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked [x]
- [ ] No [B] blocked tasks remain
- [ ] Every requirement in spec.md has evidence in the candidate report
- [ ] The phase checklist is green
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Governing policy**: See `../../../001-convention-policy-and-scope/spec.md`
- **Commands parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
