---
title: "Tasks: mcp-code-mode scripts (020 component 011 phase 002)"
description: "Tasks for the language-aware script filename audit, Python exemption proof, and conditional non-Python reference closure."
trigger_phrases:
  - "mcp-code-mode scripts tasks"
  - "mcp-code-mode phase 002 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/002-scripts"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/002-scripts"
    last_updated_at: "2026-07-14T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored scripts audit tasks"
    next_safe_action: "Enumerate script filenames"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: mcp-code-mode scripts

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

- [ ] T001 Record the pinned BASE and enumerate mcp-code-mode/scripts and mcp-server/scripts
- [ ] T002 [P] Classify each filename as eligible non-Python rename, Python exemption, or compliant
- [ ] T003 Inventory shell source, import, registry, documentation, and manual-pointer consumers
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Freeze the semantic script rename map, accepting an empty map only with evidence
- [ ] T005 Rename each eligible non-Python script filename, if any
- [ ] T006 Update every affected source, import, registry, documentation, and manual pointer
- [ ] T007 Preserve validate_config.py and all Python/package-directory exemptions
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Verify no eligible snake_case script filename remains
- [ ] T009 Run bash -n and node --check for affected script types
- [ ] T010 Verify all affected references resolve and no old eligible path remains
- [ ] T011 Pin the inventory, map hash, dispositions, commands, and exit codes
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
