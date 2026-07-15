---
title: "Tasks: memory command namespace naming (017 phase 008/013/005)"
description: "Execution tasks for the memory presentation asset rename and reference closure."
trigger_phrases:
  - "memory namespace naming tasks"
  - "memory asset rename tasks"
  - "memory presentation reference repair"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/013-commands/005-memory-namespace"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/013-commands/005-memory-namespace"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored memory namespace tasks"
    next_safe_action: "Execute the memory presentation asset closure"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: Memory command namespace naming

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

- [ ] T001 Load the frozen memory map, BASE manifest, and commands-parent handoff.
- [ ] T002 [P] Inventory references to the four presentation assets and record external consumers.
- [ ] T003 Confirm tool IDs, plugin names, keys, frontmatter fields, and compliant command files are excluded.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename the learn, manage, save, and search presentation assets to mapped kebab-case targets.
- [ ] T005 Update command, README, asset-local, test, and external path-valued references in one closure.
- [ ] T006 Record dynamic, key, and non-path occurrences in the disposition ledger.
- [ ] T007 Preserve file modes, target uniqueness, tool IDs, and plugin behavior.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Compare the final memory manifest with all four map rows and check collisions.
- [ ] T009 Resolve all presentation pointers and run the command-reference checker.
- [ ] T010 Exercise learn, manage, save, and search presentation/tool flows against BASE scenarios.
- [ ] T011 Confirm no key, tool ID, exemption, or sibling namespace changed.
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
