---
title: "Tasks: create command namespace naming (032 phase 008/013/001)"
description: "Execution tasks for the create command asset rename and reference closure."
trigger_phrases:
  - "create namespace naming tasks"
  - "create asset rename tasks"
  - "create command reference repair"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/001-create-namespace"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/001-create-namespace"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create namespace tasks"
    next_safe_action: "Execute the create asset rename closure"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: Create command namespace naming

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

- [ ] T001 Load the frozen create map, BASE manifest, and commands-parent handoff.
- [ ] T002 [P] Capture every reference to the 30 `create_*` asset candidates and record external consumers.
- [ ] T003 Confirm command IDs, YAML keys, frontmatter fields, tool-mandated names, and already-compliant command files are excluded.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename the agent, benchmark, changelog, command, feature-catalog, flowchart, manual-testing-playbook, readme, skill, and skill-parent assets to their mapped kebab-case filenames.
- [ ] T005 Update command markdown, `README.txt`, asset-local, and external path-valued references in the same dependency-closed batch.
- [ ] T006 Record dynamic, generated, and non-path occurrences in the disposition ledger instead of applying a text-wide underscore replacement.
- [ ] T007 Preserve file modes and verify the new target paths are unique and addressable.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Compare the final create path manifest with all 30 map rows.
- [ ] T009 Resolve every active create asset pointer and run the command-reference checker.
- [ ] T010 Exercise auto, confirm, and presentation selection for each create command family.
- [ ] T011 Confirm no command ID, YAML key, frontmatter field, exemption, or sibling namespace changed.
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
