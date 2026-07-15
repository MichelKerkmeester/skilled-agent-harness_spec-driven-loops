---
title: "Tasks: mcp-tooling hub root and shared naming closure (017 phase 001)"
description: "Tasks for phase 001 of the mcp-tooling component naming migration: classify root/shared paths, repair hub references, and preserve exact contracts."
trigger_phrases:
  - "mcp-tooling hub root tasks"
  - "mcp-tooling shared naming tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/006-mcp-tooling/001-hub-root-and-shared"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/006-mcp-tooling/001-hub-root-and-shared"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored phase 001 tasks"
    next_safe_action: "Begin with the root/shared census"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/SKILL.md"
      - ".opencode/skills/mcp-tooling/mode-registry.json"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: mcp-tooling Hub Root and Shared Naming Closure

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

- [ ] T001 Record BASE SHA and frozen rename-map hash for the root/shared closure
- [ ] T002 Census .opencode/skills/mcp-tooling root siblings and confirm shared/ is absent at the current baseline
- [ ] T003 Mark manual-testing-playbook, benchmark, and the three component roots as delegated surfaces
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Classify every root/shared filesystem candidate as rename, exempt, frozen, generated, or tool-mandated
- [ ] T005 Apply the semantic root/shared rename map without creating a synthetic shared directory
- [ ] T006 Update SKILL.md, README.md, hub-router.json, and mode-registry.json path values
- [ ] T007 Verify JSON keys, routing identifiers, SKILL.md, and mode-registry.json filenames were not changed
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Verify: no in-scope root/shared snake_case path remains — attach the scoped find/git ls-files census
- [ ] T009 Verify: hub route references resolve — attach path-resolution output and parent-skill-check.cjs exit code
- [ ] T010 Verify: delegated child roots were not renamed by this phase — attach the path-owner diff
- [ ] T011 Verify: candidate report records the SHA, BASE SHA, map hash, commands, and non-zero scan counts
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] Every P0 checklist item has evidence
- [ ] No unexpected tracked mutation remains after verification
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
- **Decision Record**: See decision-record.md
<!-- /ANCHOR:cross-refs -->
