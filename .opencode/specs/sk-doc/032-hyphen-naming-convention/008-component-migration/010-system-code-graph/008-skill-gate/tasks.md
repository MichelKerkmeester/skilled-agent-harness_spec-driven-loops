---
title: "Tasks: system-code-graph subtree rollup gate (032 phase 008)"
description: "Tasks for phase 008 of the system-code-graph component naming migration: aggregate sibling evidence and prove the whole surface is kebab-clean without new migration work."
trigger_phrases:
  - "system-code-graph rollup gate tasks"
  - "system-code-graph whole-surface verification tasks"
  - "code graph naming gate tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/010-system-code-graph/008-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/010-system-code-graph/008-skill-gate"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored subtree gate tasks"
    next_safe_action: "Aggregate sibling checklist evidence"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/032-hyphen-naming-convention/008-component-migration/010-system-code-graph/"
      - ".opencode/skills/system-code-graph/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: system-code-graph Subtree Rollup Gate

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

Task format: T### [P?] Description (file path)
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Record candidate SHA, BASE SHA, and final rename-map hash
- [ ] T002 Load phases 001–007 checklists, maps, counts, release evidence, and reports
- [ ] T003 Build the complete system-code-graph path inventory with exemption, generated, tool-mandated, and frozen classifications
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Aggregate sibling P0/P1 status for phases 001–007 and fail on missing evidence or unresolved blockers
- [ ] T005 Run the exemption-aware whole-surface snake_case filesystem scan under `.opencode/skills/system-code-graph/`
- [ ] T006 Run active Markdown, path-value, catalog/playbook, launcher/configuration, and stale-old-name checks
- [ ] T007 Do not rename or repair any path in response to a rollup finding
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Verify: every sibling P0 contract passes with evidence — phases 001, 002, 003, 004, 005, 006, and 007 are all represented
- [ ] T009 Verify: no in-scope snake_case filesystem name remains under the system-code-graph root
- [ ] T010 Verify: all remaining underscores have approved exemption or frozen classifications
- [ ] T011 Verify: active references resolve and phase 008 creates no tracked migration mutation
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
- **Checklist**: See checklist.md
<!-- /ANCHOR:cross-refs -->
