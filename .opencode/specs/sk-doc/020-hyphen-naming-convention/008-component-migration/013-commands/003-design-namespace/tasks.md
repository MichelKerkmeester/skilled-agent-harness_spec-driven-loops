---
title: "Tasks: design command namespace naming (032 phase 008/013/003)"
description: "Execution tasks for the design command asset rename and reference closure."
trigger_phrases:
  - "design namespace naming tasks"
  - "design asset rename tasks"
  - "design command reference repair"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/003-design-namespace"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/003-design-namespace"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored design namespace tasks"
    next_safe_action: "Execute the design asset rename closure"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: Design command namespace naming

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

- [ ] T001 Load the frozen design map, BASE manifest, and commands-parent handoff.
- [ ] T002 [P] Inventory references to the 15 `design_*` assets and record external consumers.
- [ ] T003 Confirm command IDs, configuration/YAML keys, frontmatter fields, and already-compliant command files are excluded.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename the audit, foundations, interface, md-generator, and motion auto/confirm/presentation files to mapped kebab-case targets.
- [ ] T005 Update command, asset-local, index, test, and external path-valued references in one closure.
- [ ] T006 Record dynamic and non-path occurrences in the disposition ledger.
- [ ] T007 Preserve modes, target uniqueness, and file metadata while applying the map.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Compare the final design manifest with all 15 map rows and check collisions.
- [ ] T009 Resolve every design asset pointer and run the command-reference checker.
- [ ] T010 Exercise all five design command modes and compare presentation/workflow outcomes with BASE.
- [ ] T011 Confirm no command ID, configuration key, exemption, or sibling namespace changed.
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
