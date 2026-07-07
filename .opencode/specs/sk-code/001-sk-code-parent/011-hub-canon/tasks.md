---
title: "Tasks: Phase 11 hub canon"
description: "Completed tasks for the shipped hub canon phase and Level-2 documentation backfill."
trigger_phrases:
  - "hub canon tasks"
  - "parent hub task list"
  - "two-axis hub tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/011-hub-canon"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "openai-gpt-5.5"
    recent_action: "Backfilled completed Level 2 task tracking for the hub canon phase."
    next_safe_action: "Run strict validation for the 011-hub-canon phase folder."
---
# Tasks: Phase 11 hub canon

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

- [x] T001 Define the one parent-hub canon (`design-contract.md`) [shipped]
- [x] T002 Define `packetKind: "workflow" | "surface"` as the required axis discriminator (`design-contract.md`) [shipped]
- [x] T003 Define surface packet constraints (`design-contract.md`) [shipped]
- [x] T004 Define required `hub-router.json` and `description.json` companion files (`design-contract.md`) [shipped]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### sk-doc Templates and References
- [x] T005 Rewrite parent hub SKILL template (`.opencode/skills/sk-doc/assets/skill/parent_skill_hub_template.md`) [shipped]
- [x] T006 Rewrite parent registry template (`.opencode/skills/sk-doc/assets/skill/parent_skill_registry_template.json`) [shipped]
- [x] T007 Rewrite parent graph metadata template (`.opencode/skills/sk-doc/assets/skill/parent_skill_graph_metadata_template.json`) [shipped]
- [x] T008 [P] Create hub router schema doc (`.opencode/skills/sk-doc/references/skill_creation/parent_hub_router_schema.md`) [shipped]
- [x] T009 [P] Create hub router template (`.opencode/skills/sk-doc/assets/skill/parent_skill_hub_router_template.json`) [shipped]
- [x] T010 [P] Create description template (`.opencode/skills/sk-doc/assets/skill/parent_skill_description_template.json`) [shipped]
- [x] T011 Rewrite nested packet guidance (`.opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md`) [shipped]
- [x] T012 Update skill creation index (`.opencode/skills/sk-doc/references/skill_creation.md`) [shipped]
- [x] T013 Add routable PARENT_HUB intent (`.opencode/skills/sk-doc/SKILL.md`) [shipped]

### Enforcement, Sync, and Scaffolding
- [x] T014 Upgrade parent-skill-check checks 1-9 for all hubs (`.opencode/commands/doctor/scripts/parent-skill-check.cjs`) [shipped]
- [x] T015 Produce strict-gap inventory for sk-code, deep-loop, and sk-design (`parent-skill-check.cjs`) [shipped]
- [x] T016 Make vocab sync fail loud on missing router/registry (`parent-hub-vocab-sync.cjs`) [shipped]
- [x] T017 Add vocab-sync vitest fixtures for missing metadata (`parent-hub-vocab-sync.cjs` tests) [shipped]
- [x] T018 Upgrade parent skill scaffolder to two-axis canon (`/create:sk-skill-parent`) [shipped]
- [x] T019 Add doctor two-axis invariant (`.opencode/commands/doctor/doctor_parent-skill.yaml`) [shipped]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Unit Tests
- [x] T020 Run vocab-sync vitests: 5/5 pass [shipped]
- [x] T021 Run drift-guard tests: 7/7 pass [shipped]

### Integration Tests
- [x] T022 Run deep-improvement vitests: 414 pass with 2 pre-existing unrelated failures [shipped]
- [x] T023 Run scratch scaffold parent-skill-check in default mode: exit 0 [shipped]
- [x] T024 Run scratch scaffold parent-skill-check in strict mode: exit 0 [shipped]

### Manual Verification
- [x] T025 Confirm strict-gap inventory: sk-code 6, deep-loop 27, sk-design 10 [shipped]
- [x] T026 Confirm code work was pushed in core and tail commits (`b6fe2f31b1`, `deab5a3853`, `d1b545e4b6`) [shipped]

### Documentation
- [x] T027 Backfill Level-2 `spec.md` in current template shape (`spec.md`) [current session]
- [x] T028 Add Level-2 implementation plan (`plan.md`) [current session]
- [x] T029 Add Level-2 task list (`tasks.md`) [current session]
- [x] T030 Add Level-2 checklist (`checklist.md`) [current session]
- [x] T031 Add Level-2 implementation summary with continuity block (`implementation-summary.md`) [current session]
- [x] T032 Run strict validation for this phase folder (`validate.sh --strict`) [current session]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Canon docs and templates shipped.
- [x] Enforcement and scaffolding changes shipped.
- [x] Verification evidence recorded in `checklist.md`.
- [x] Strict validation produced zero errors for the phase folder; graph metadata warning accepted.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Design Contract**: See `design-contract.md`

<!-- /ANCHOR:cross-refs -->
