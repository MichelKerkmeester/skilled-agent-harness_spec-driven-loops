---
title: "Tasks: mcp-code-mode manual-testing playbook (017 component 011 phase 005)"
description: "Tasks for the manual-testing root, eight category directories, index, 27 scenario files, and their active link closure."
trigger_phrases:
  - "mcp-code-mode manual playbook tasks"
  - "mcp-code-mode phase 005 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/005-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/005-manual-testing-playbook"
    last_updated_at: "2026-07-14T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored manual-playbook tasks"
    next_safe_action: "Freeze the full playbook map"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: mcp-code-mode manual-testing playbook

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

- [ ] T001 Record BASE and enumerate the root, index, eight categories, and 27 scenarios
- [ ] T002 [P] Capture scenario IDs, relative links, and content hashes for parity
- [ ] T003 Inventory active old-tree references in the skill, scenarios, scripts, guides, and consumers
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename manual_testing_playbook and manual_testing_playbook.md to manual-testing-playbook and manual-testing-playbook.md
- [ ] T005 Rename the eight category directories to their hyphenated targets
- [ ] T006 Rename all 27 scenario files to their hyphenated targets
- [ ] T007 Update the index, scenario links, tables, scripts, guides, and active consumers to final paths
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Resolve all Markdown links and scan for stale old-tree paths
- [ ] T009 Verify eight category counts, 27 scenario files, scenario IDs, and content parity
- [ ] T010 Verify only path strings changed and exemptions/frozen history were preserved
- [ ] T011 Pin the map hash, link report, parity report, dispositions, and exit codes
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test/link as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
<!-- /ANCHOR:cross-refs -->
