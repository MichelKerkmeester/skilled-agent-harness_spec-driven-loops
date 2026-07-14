---
title: "Tasks: mcp-figma naming closure (017 phase 004)"
description: "Tasks for phase 004 of the mcp-tooling component naming migration: rename Figma paths, repair references, and preserve helper semantics."
trigger_phrases:
  - "mcp-figma naming tasks"
  - "figma catalog helper tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/006-mcp-tooling/004-mcp-figma"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/006-mcp-tooling/004-mcp-figma"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored phase 004 tasks"
    next_safe_action: "Create the complete Figma source-to-target map"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-figma/feature_catalog/"
      - ".opencode/skills/mcp-tooling/mcp-figma/manual_testing_playbook/"
      - ".opencode/skills/mcp-tooling/mcp-figma/scripts/_common.sh"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: mcp-figma Naming Closure

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
- [ ] T002 Census the 14 underscored directories and 30 underscored files under mcp-figma
- [ ] T003 Inventory Markdown links, path values, shell source commands, and helper identifiers
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename feature_catalog, feature_catalog.md, and all catalog categories/files
- [ ] T005 Rename manual_testing_playbook, its categories, index, and scenario files
- [ ] T006 Rename assets, references, and INSTALL_GUIDE.md
- [ ] T007 Rename scripts/_common.sh to scripts/common.sh and update every source path
- [ ] T008 Preserve shell variables, Figma/Code Mode identifiers, package paths, and transport rules
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Verify: every census candidate has one map target or exemption — attach the complete map
- [ ] T010 Verify: no in-scope underscore remains — attach the post-change component census
- [ ] T011 Verify: Markdown links and shell source paths resolve — attach resolver output
- [ ] T012 Verify: bash -n, helper resolution, non-zero discovery, and parent-skill-check.cjs pass
- [ ] T013 Verify: the mcp-figma workspace remains read-only — attach the transport contract diff
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
