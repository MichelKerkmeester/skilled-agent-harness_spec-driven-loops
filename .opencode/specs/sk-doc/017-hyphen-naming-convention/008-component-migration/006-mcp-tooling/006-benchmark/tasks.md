---
title: "Tasks: mcp-tooling benchmark naming closure (017 phase 006)"
description: "Tasks for phase 006 of the mcp-tooling component naming migration: census benchmark artifacts, preserve .gitkeep, and rename only real candidates."
trigger_phrases:
  - "mcp-tooling benchmark tasks"
  - "benchmark artifact census tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/006-mcp-tooling/006-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/006-mcp-tooling/006-benchmark"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored phase 006 tasks"
    next_safe_action: "Run the benchmark zero-candidate census"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/benchmark/"
      - ".opencode/skills/mcp-tooling/benchmark/.gitkeep"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: mcp-tooling Benchmark Naming Closure

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
- [ ] T002 Census all benchmark descendants and verify the current inventory is benchmark/.gitkeep only
- [ ] T003 Inventory benchmark loaders, documentation paths, and path-valued metadata
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 If candidates exist, classify every fixture/profile/storage-guide/support path
- [ ] T005 If candidates exist, rename only the mapped in-scope paths
- [ ] T006 Update references for moved artifacts without changing data keys or scenario IDs
- [ ] T007 Preserve .gitkeep and do not create speculative benchmark content
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Verify: the zero-candidate baseline or complete candidate map is attached
- [ ] T009 Verify: no in-scope snake_case benchmark name remains
- [ ] T010 Verify: affected loader and documentation references resolve
- [ ] T011 Verify: .gitkeep and benchmark data semantics are unchanged
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
