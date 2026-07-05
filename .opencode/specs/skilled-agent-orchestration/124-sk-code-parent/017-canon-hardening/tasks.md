---
title: "Tasks: Phase 17 canon hardening"
description: "Unchecked task breakdown for the planned parent-hub canon hardening phase."
trigger_phrases:
  - "phase 017 tasks"
  - "canon hardening tasks"
  - "bundleRules task list"
importance_tier: "high"
contextType: "implementation"
status: "Draft"
parent: "skilled-agent-orchestration/124-sk-code-parent"
phase: "017"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/017-canon-hardening"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Phase planned and documented"
    next_safe_action: "Start T001 canon source inventory"
---
# Tasks: Phase 17 canon hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

All tasks are intentionally unchecked because this phase is planned and not yet executed.

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read and record current bundleRules shapes in template, schema, and validator (`parent_skill_hub_router_template.json`, `parent_hub_router_schema.md`, `parent-skill-check.cjs`) [source: master plan lines 38-40; audit digest lines 49-51]
- [ ] T002 Capture strict parent-skill-check baseline for sk-code (`.opencode/skills/sk-code`) [source: master plan line 46; audit digest lines 42-43]
- [ ] T003 Capture strict parent-skill-check baseline for deep-loop-workflows and confirm the current 26-failure guard (`.opencode/skills/deep-loop-workflows`) [source: master plan lines 45-46; audit digest lines 3-5]
- [ ] T004 Inventory sk-code registry/router version fields and `surfacePackets` field (`.opencode/skills/sk-code/mode-registry.json`, `.opencode/skills/sk-code/hub-router.json`) [source: master plan lines 41-42]
- [ ] T005 Inventory stale `"internal design notes"` metadata fields (`description.json`, `graph-metadata.json`) [source: master plan line 43]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Canon Sources
- [ ] T006 Update `parent_skill_hub_router_template.json` to use canonical `bundleRules[]` fields: `name`, `whenPrimary`, `includeSurfaces`, optional `whenAll`, and `outcome` (`.opencode/skills/sk-doc/assets/skill/parent_skill_hub_router_template.json`) [source: user prompt line 5; decision-record.md]
- [ ] T007 Update `parent_hub_router_schema.md` so its examples and prose match the canonical bundleRules shape (`.opencode/skills/sk-doc/references/skill_creation/parent_hub_router_schema.md`) [source: master plan lines 40 and 44]
- [ ] T008 Update `parent-skill-check.cjs` check 5f to validate canonical fields and tolerate legacy aliases without increasing current hub failures (`.opencode/commands/doctor/scripts/parent-skill-check.cjs`) [source: master plan lines 45-46; audit digest lines 3-5]

### sk-code Reference Cleanup
- [ ] T009 Rename `extensions.surface-axis.surfacePackets` to `surfaces` (`.opencode/skills/sk-code/mode-registry.json`) [source: master plan line 41; parent hub template says no second packet array]
- [ ] T010 Bump `mode-registry.json` from 3-part to 4-part version (`.opencode/skills/sk-code/mode-registry.json`) [source: master plan line 42]
- [ ] T011 Bump `hub-router.json` from 3-part to 4-part version (`.opencode/skills/sk-code/hub-router.json`) [source: master plan line 42]
- [ ] T012 Remove `merger_spec_folder: "internal design notes"` (`.opencode/skills/sk-code/description.json`) [source: master plan line 43]
- [ ] T013 Remove `merger_packet: "internal design notes"` (`.opencode/skills/sk-code/graph-metadata.json`) [source: master plan line 43]
- [ ] T014 Remove `motion_dev_packet: "internal design notes"` (`.opencode/skills/sk-code/graph-metadata.json`) [source: master plan line 43]
- [ ] T015 Fix any additional template-to-schema-to-validator self-consistency gaps surfaced by x:sk-doc-canon review (`.opencode/skills/sk-doc/`, `.opencode/commands/doctor/scripts/parent-skill-check.cjs`) [source: master plan line 44; audit digest lines 49-51]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Unit Tests
- [ ] T016 JSON-parse changed JSON files after edits [source: changed JSON file list in spec.md]
- [ ] T017 Run grep/read consistency checks for `bundleRules`, `whenPrimary`, `includeSurfaces`, `primary`, `surfaces`, `modes`, and `evidence` across template, schema, and validator [source: master plan line 40]

### Integration Tests
- [ ] T018 Run strict parent-skill-check for sk-code and require pass (`.opencode/skills/sk-code`) [source: master plan line 46; audit digest lines 42-43]
- [ ] T019 Run strict parent-skill-check for deep-loop-workflows and require failure count unchanged or reduced, never increased (`.opencode/skills/deep-loop-workflows`) [source: master plan lines 45-46; audit digest lines 3-5]

### Manual Verification
- [ ] T020 Grep sk-code metadata for `"internal design notes"` and require zero hits in the three named placeholder fields [source: master plan line 43]
- [ ] T021 Review diff to confirm no deep-loop files were modified by this phase [source: master plan lines 45 and 61-63]
- [ ] T022 Update implementation-summary.md with actual verification evidence after execution (`implementation-summary.md`) [source: brief planned-state rules lines 17-24]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 tasks T001-T009 and T012-T014 are completed with evidence.
- [ ] sk-code strict parent-skill-check remains green.
- [ ] deep-loop strict failure count is unchanged or reduced.
- [ ] No stale `"internal design notes"` placeholders remain in the three named fields.
- [ ] `decision-record.md` reflects the implemented bundleRules shape.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`

<!-- /ANCHOR:cross-refs -->
