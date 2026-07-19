---
title: "Tasks: mcp-chrome-devtools naming closure (020 phase 002)"
description: "Tasks for phase 002 of the mcp-tooling component naming migration: rename Chrome DevTools paths and repair their references."
trigger_phrases:
  - "mcp-chrome-devtools naming tasks"
  - "chrome devtools playbook rename tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/002-mcp-chrome-devtools"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/002-mcp-chrome-devtools"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored phase 002 tasks"
    next_safe_action: "Create the Chrome DevTools source-to-target map"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md"
      - ".opencode/skills/mcp-tooling/mcp-chrome-devtools/manual_testing_playbook/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: mcp-chrome-devtools Naming Closure

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
- [ ] T002 Census the 8 underscored directories and 28 underscored files under the component
- [ ] T003 Inventory links, path tables, and path-derived category values
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename INSTALL_GUIDE.md to install-guide.md
- [ ] T005 Rename the manual-testing-playbook root, seven categories, scenario files, and two reference files
- [ ] T006 Update SKILL.md, README.md, playbook indexes, scenario links, and reference links
- [ ] T007 Update path-derived category values while preserving fields, identifiers, and prose tokens
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Verify: every census candidate has one map target or exemption — attach the complete map
- [ ] T009 Verify: no in-scope underscore remains — attach the post-change path census
- [ ] T010 Verify: all Markdown links and path tables resolve — attach resolver output with non-zero resources
- [ ] T011 Verify: Chrome scenario discovery and parent-skill-check.cjs pass — attach commands and exit codes
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
