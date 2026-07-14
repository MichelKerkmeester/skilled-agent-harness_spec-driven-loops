---
title: "Tasks: mcp-click-up naming closure (017 phase 003)"
description: "Tasks for phase 003 of the mcp-tooling component naming migration: rename ClickUp catalog/playbook paths and repair their references."
trigger_phrases:
  - "mcp-click-up naming tasks"
  - "clickup catalog playbook tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/006-mcp-tooling/003-mcp-click-up"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/006-mcp-tooling/003-mcp-click-up"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored phase 003 tasks"
    next_safe_action: "Create the complete ClickUp source-to-target map"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-click-up/feature_catalog/"
      - ".opencode/skills/mcp-tooling/mcp-click-up/manual_testing_playbook/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: mcp-click-up Naming Closure

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

- [ ] T001 Record BASE SHA and frozen map hash
- [ ] T002 Census the 26 underscored directories and 137 underscored files under mcp-click-up
- [ ] T003 Capture catalog, playbook, reference, and scenario discovery counts
- [ ] T004 Inventory path links, category values, package paths, and data identifiers
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Rename feature_catalog, FEATURE_CATALOG.md, and all catalog categories/files
- [ ] T006 Rename manual_testing_playbook, its categories, index, and scenario files
- [ ] T007 Rename cupt_commands.md, install_guide.md, mcp_tools.md, and remaining reference files
- [ ] T008 Update SKILL.md, README.md, examples, scripts, indexes, links, and path-derived values
- [ ] T009 Preserve package manifests, mcp-servers layout, cupt tokens, and MCP/data identifiers
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Verify: every census candidate has one map target or exemption — attach the complete map
- [ ] T011 Verify: no in-scope underscore remains — attach the post-change component census
- [ ] T012 Verify: catalog/playbook/reference links resolve — attach resolver output and non-zero discovery counts
- [ ] T013 Verify: package/server layout and identifiers are unchanged — attach focused diff evidence
- [ ] T014 Verify: parent-skill-check.cjs and component checks pass — attach commands and exit codes
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All P0 checklist checks have evidence
- [ ] No unexpected tracked mutation remains after verification
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
<!-- /ANCHOR:cross-refs -->
