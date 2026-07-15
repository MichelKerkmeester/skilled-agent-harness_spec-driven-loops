---
title: "Tasks: mcp-code-mode references and assets (017 component 011 phase 003)"
description: "Tasks for the four reference/asset filename renames and their active link and path-pointer closure."
trigger_phrases:
  - "mcp-code-mode references assets tasks"
  - "mcp-code-mode phase 003 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/003-references-and-assets"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/003-references-and-assets"
    last_updated_at: "2026-07-14T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored references-assets tasks"
    next_safe_action: "Freeze the four-file map"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: mcp-code-mode references and assets

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

- [ ] T001 Freeze the four-entry path map and record BASE
- [ ] T002 Inventory active links and path values for the four source filenames
- [ ] T003 [P] Mark tool names, keys, fields, Python paths, and frozen changelog hits as non-rename dispositions
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename naming_convention.md to naming-convention.md
- [ ] T005 Rename tool_catalog.md to tool-catalog.md
- [ ] T006 Rename config_template.md to config-template.md and env_template.md to env-template.md
- [ ] T007 Update active links, router lists, script messages, and cross-references to the four targets
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Resolve Markdown links across the mcp-code-mode surface
- [ ] T009 Verify no stale active source filename remains
- [ ] T010 Verify frozen history and non-filesystem identifiers were not changed
- [ ] T011 Pin the map hash, link report, stale-hit report, and exit codes
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
