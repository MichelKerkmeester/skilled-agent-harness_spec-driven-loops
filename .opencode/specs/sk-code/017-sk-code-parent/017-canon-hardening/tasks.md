---
title: "Tasks: Phase 17 canon hardening"
description: "Unchecked task breakdown for the planned parent-hub canon hardening phase."
trigger_phrases:
  - "phase 017 tasks"
  - "canon hardening tasks"
  - "bundleRules task list"
importance_tier: "high"
contextType: "implementation"
status: "Complete"
parent: "sk-code/017-sk-code-parent"
phase: "017"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/017-canon-hardening"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase executed; bundleRules canon reconciled, STRICT 0/0"
    next_safe_action: "124 rollup"
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

All tasks are complete. The canon reconcile + sk-code registry/router hygiene shipped in `3a76f99ccb`; the placeholder-tail cleanup was resolved by the 016 metadata refresh (`af1170c663`).

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read and record current bundleRules shapes in template, schema, and validator (`parent_skill_hub_router_template.json`, `parent_hub_router_schema.md`, `parent-skill-check.cjs`) [source: master plan lines 38-40; audit digest lines 49-51] — executed via `3a76f99ccb` (three shapes reconciled)
- [x] T002 Capture strict parent-skill-check baseline for sk-code (`.opencode/skills/sk-code`) [source: master plan line 46; audit digest lines 42-43] — sk-code STRICT 0/0 baseline captured
- [x] T003 Capture strict parent-skill-check baseline for deep-loop-workflows and confirm the current 26-failure guard (`.opencode/skills/deep-loop-workflows`) [source: master plan lines 45-46; audit digest lines 3-5] — deep-loop 26-failure baseline confirmed
- [x] T004 Inventory sk-code registry/router version fields and `surfacePackets` field (`.opencode/skills/sk-code/mode-registry.json`, `.opencode/skills/sk-code/hub-router.json`) [source: master plan lines 41-42] — 3-part `1.1.0` + `surfacePackets` inventoried
- [x] T005 Inventory stale `"internal design notes"` metadata fields (`description.json`, `graph-metadata.json`) [source: master plan line 43] — three placeholder fields inventoried

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Canon Sources
- [x] T006 Update `parent_skill_hub_router_template.json` to use canonical `bundleRules[]` fields: `name`, `whenPrimary`, `includeSurfaces`, optional `whenAll`, and `outcome` (`.opencode/skills/sk-doc/assets/skill/parent_skill_hub_router_template.json`) [source: user prompt line 5; decision-record.md] — executed via `3a76f99ccb` (template ships surfaceBundle + orderedBundle examples in the canonical shape)
- [x] T007 Update `parent_hub_router_schema.md` so its examples and prose match the canonical bundleRules shape (`.opencode/skills/sk-doc/references/skill_creation/parent_hub_router_schema.md`) [source: master plan lines 40 and 44] — no edit needed: the schema already used `whenPrimary`/`includeSurfaces`; the canonical choice matched it, so the template + validator moved to the schema (`3a76f99ccb`)
- [x] T008 Update `parent-skill-check.cjs` check 5f to validate canonical fields and tolerate legacy aliases without increasing current hub failures (`.opencode/commands/doctor/scripts/parent-skill-check.cjs`) [source: master plan lines 45-46; audit digest lines 3-5] — executed via `3a76f99ccb` (5f collects refs from `whenPrimary`/`includeSurfaces`/`whenAll`; absent fields not punished)

### sk-code Reference Cleanup
- [x] T009 Rename `extensions.surface-axis.surfacePackets` to `surfaces` (`.opencode/skills/sk-code/mode-registry.json`) [source: master plan line 41; parent hub template says no second packet array] — executed via `3a76f99ccb`
- [x] T010 Bump `mode-registry.json` from 3-part to 4-part version (`.opencode/skills/sk-code/mode-registry.json`) [source: master plan line 42] — executed via `3a76f99ccb` (`1.1.0` -> `4.1.0.0`)
- [x] T011 Bump `hub-router.json` from 3-part to 4-part version (`.opencode/skills/sk-code/hub-router.json`) [source: master plan line 42] — executed via `3a76f99ccb` (`1.1.0` -> `4.1.0.0`)
- [x] T012 Remove `merger_spec_folder: "internal design notes"` (`.opencode/skills/sk-code/description.json`) [source: master plan line 43] — resolved by the 016 metadata refresh (`af1170c663`); 017 does not re-do it
- [x] T013 Remove `merger_packet: "internal design notes"` (`.opencode/skills/sk-code/graph-metadata.json`) [source: master plan line 43] — resolved by the 016 metadata refresh (`af1170c663`); 017 does not re-do it
- [x] T014 Remove `motion_dev_packet: "internal design notes"` (`.opencode/skills/sk-code/graph-metadata.json`) [source: master plan line 43] — resolved by the 016 metadata refresh (`af1170c663`); 017 does not re-do it
- [x] T015 Fix any additional template-to-schema-to-validator self-consistency gaps surfaced by x:sk-doc-canon review (`.opencode/skills/sk-doc/`, `.opencode/commands/doctor/scripts/parent-skill-check.cjs`) [source: master plan line 44; audit digest lines 49-51] — executed via `3a76f99ccb` (template + validator aligned to the schema's canonical shape)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Unit Tests
- [x] T016 JSON-parse changed JSON files after edits [source: changed JSON file list in spec.md] — template/registry/router JSON confirmed valid (`3a76f99ccb`)
- [x] T017 Run grep/read consistency checks for `bundleRules`, `whenPrimary`, `includeSurfaces`, `primary`, `surfaces`, `modes`, and `evidence` across template, schema, and validator [source: master plan line 40] — template + validator now use `whenPrimary`/`includeSurfaces` matching the schema (`3a76f99ccb`)

### Integration Tests
- [x] T018 Run strict parent-skill-check for sk-code and require pass (`.opencode/skills/sk-code`) [source: master plan line 46; audit digest lines 42-43] — sk-code parent-skill-check STRICT 0/0 (EXIT 0)
- [x] T019 Run strict parent-skill-check for deep-loop-workflows and require failure count unchanged or reduced, never increased (`.opencode/skills/deep-loop-workflows`) [source: master plan lines 45-46; audit digest lines 3-5] — deep-loop STRICT held at 26 (no regression)

### Manual Verification
- [x] T020 Grep sk-code metadata for `"internal design notes"` and require zero hits in the three named placeholder fields [source: master plan line 43] — zero hits (fields removed by `af1170c663`)
- [x] T021 Review diff to confirm no deep-loop files were modified by this phase [source: master plan lines 45 and 61-63] — `3a76f99ccb` touched no deep-loop-workflows files
- [x] T022 Update implementation-summary.md with actual verification evidence after execution (`implementation-summary.md`) [source: brief planned-state rules lines 17-24] — completed by this close-out

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks T001-T009 and T012-T014 are completed with evidence.
- [x] sk-code strict parent-skill-check remains green.
- [x] deep-loop strict failure count is unchanged or reduced.
- [x] No stale `"internal design notes"` placeholders remain in the three named fields.
- [x] `decision-record.md` reflects the implemented bundleRules shape.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`

<!-- /ANCHOR:cross-refs -->
