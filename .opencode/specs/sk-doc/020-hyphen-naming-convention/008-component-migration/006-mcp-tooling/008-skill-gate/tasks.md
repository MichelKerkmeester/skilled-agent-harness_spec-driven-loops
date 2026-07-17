---
title: "Tasks: mcp-tooling subtree rollup gate (032 phase 008)"
description: "Tasks for phase 008 of the mcp-tooling component naming migration: aggregate sibling evidence and prove the whole surface is kebab-clean without new migration work."
trigger_phrases:
  - "mcp-tooling rollup gate tasks"
  - "mcp tooling subtree verification tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/008-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/008-skill-gate"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored phase 008 tasks"
    next_safe_action: "Aggregate sibling checklist evidence"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/"
      - ".opencode/skills/mcp-tooling/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: mcp-tooling Subtree Rollup Gate

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

- [ ] T001 Record candidate SHA, BASE SHA, and final rename-map hash
- [ ] T002 Load phases 001-007 checklists, maps, counts, and reports
- [ ] T003 Build the complete mcp-tooling path inventory with exemption classes
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Aggregate sibling P0/P1 status and fail on missing evidence
- [ ] T005 Run the exemption-aware whole-surface snake_case scan
- [ ] T006 Run cross-surface Markdown, route, catalog/playbook, benchmark, and path-value checks
- [ ] T007 Do not rename or repair any path in response to a rollup finding
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Verify: every sibling P0 contract passes with evidence
- [ ] T009 Verify: no in-scope snake_case filesystem name remains under mcp-tooling
- [ ] T010 Verify: all remaining underscores have approved exemption/frozen classifications
- [ ] T011 Verify: references resolve and the gate creates no tracked mutation
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
