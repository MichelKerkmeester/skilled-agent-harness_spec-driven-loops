---
title: "Tasks: Phase 12 spec-kit relocation"
description: "Completed Level 2 task list for relocating spec-folder authoring docs to system-spec-kit."
trigger_phrases:
  - "spec kit relocation tasks"
  - "spec-folder authoring docs relocation"
  - "system-spec-kit workflows"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/012-spec-kit-relocation"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Backfilled Level 2 tasks for the already-shipped spec-kit relocation phase"
    next_safe_action: "Run strict validation for this phase folder"
---
# Tasks: Phase 12 spec-kit relocation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm spec-folder authoring ownership belongs to system-spec-kit (`spec.md`) [10m]
- [x] T002 Identify source docs under sk-code (`code-implement/assets/opencode/recipes/spec_folder_write.md`, `code-quality/assets/opencode-checklists/spec_folder_authoring.md`) [10m]
- [x] T003 Identify inbound reference surfaces (`code-implement/SKILL.md`, `code-quality/SKILL.md`, `shared/references/smart_routing.md`, `description.json`, speckit YAMLs, system-spec-kit SKILL) [10m]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Document Moves
- [x] T004 Move write recipe to `.opencode/skills/system-spec-kit/references/workflows/spec_folder_write_recipe.md` [20m]
- [x] T005 Move authoring checklist to `.opencode/skills/system-spec-kit/references/workflows/spec_folder_authoring_checklist.md` [20m]
- [x] T006 Repoint moved-doc internal cross-references to same-directory siblings [15m]

### Inbound Reference Updates
- [x] T007 Repoint four load-contract rows in `code-implement/SKILL.md` [15m]
- [x] T008 Repoint the spec-folder authoring reference in `code-quality/SKILL.md` [10m]
- [x] T009 Update `shared/references/smart_routing.md` machine RESOURCE_MAP block and prose row [20m]
- [x] T010 Update `sk-code/description.json` keywords [10m]
- [x] T011 Repoint `cross_skill_authoring_load` in both speckit completion YAML files [15m]
- [x] T012 Add the system-spec-kit SKILL cross-load note and COMPLETE-intent indexing [15m]

### Versioning
- [x] T013 Bump sk-code from 4.0.0.0 to 4.0.1.0 and add changelog entry [15m]
- [x] T014 Bump system-spec-kit from 3.7.0.0 to 3.7.1.0 and add changelog entry [15m]
- [x] T015 Leave `{skill,agent,command,mcp_server}` authoring checklists in sk-code for phase 013 [5m]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Unit Tests
- [x] T016 Run `sk-code-router-sync` vitest and confirm 4/4 passing [15m]

### Integration Tests
- [x] T017 Check links among touched files and confirm no broken links [15m]
- [x] T018 Run dead-reference sweep and confirm clean result [15m]

### Manual Verification
- [x] T019 Confirm remaining `{skill,agent,command,mcp_server}` authoring checklists intentionally remain in sk-code [5m]

### Documentation
- [x] T020 Record shipped commit `85a0c2c9ac` in phase documentation [5m]
- [x] T021 Backfill Level 2 docs in this phase folder (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`) [30m]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Shipped commit recorded: `85a0c2c9ac`.
- [x] `sk-code-router-sync` vitest passed 4/4.
- [x] Touched-file broken-link check passed.
- [x] Dead-reference sweep passed.
- [x] Checklist.md fully verified.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

<!-- /ANCHOR:cross-refs -->
