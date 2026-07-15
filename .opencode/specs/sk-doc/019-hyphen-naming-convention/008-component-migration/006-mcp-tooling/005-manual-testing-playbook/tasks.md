---
title: "Tasks: mcp-tooling hub manual-testing-playbook naming closure (017 phase 005)"
description: "Tasks for phase 005 of the mcp-tooling component naming migration: rename the hub-level playbook tree and repair its navigation."
trigger_phrases:
  - "mcp-tooling hub playbook tasks"
  - "hub routing scenario rename tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/006-mcp-tooling/005-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/006-mcp-tooling/005-manual-testing-playbook"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored phase 005 tasks"
    next_safe_action: "Create the hub playbook source-to-target map"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/manual_testing_playbook/"
      - ".opencode/skills/mcp-tooling/SKILL.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: mcp-tooling Hub Manual-Testing-Playbook Naming Closure

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
- [ ] T002 Census the 2 underscored directories and 7 underscored files in the hub playbook
- [ ] T003 Capture the seven-scenario discovery count and mark component-local trees excluded
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename manual_testing_playbook to manual-testing-playbook
- [ ] T005 Rename hub_routing to hub-routing and manual_testing_playbook.md to manual-testing-playbook.md
- [ ] T006 Rename the six underscored scenario files
- [ ] T007 Update SKILL.md, the index, and all hub scenario links
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Verify: every hub candidate has one map target — attach the two-directory/seven-file map
- [ ] T009 Verify: no in-scope underscore remains in the hub playbook — attach the post-change census
- [ ] T010 Verify: all hub links resolve and seven scenarios are discovered
- [ ] T011 Verify: component-local playbook trees were not changed — attach the path-owner diff
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
