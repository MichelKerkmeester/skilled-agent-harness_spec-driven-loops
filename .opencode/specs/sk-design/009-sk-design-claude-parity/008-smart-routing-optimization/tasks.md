---
title: "Tasks: Phase 008 — Smart Routing Optimization (Hub + Mode Packets)"
description: "Level 2 task list for planning and later implementing sharpened SMART ROUTING keyword/alias coverage across the sk-design hub and five mode packets."
trigger_phrases:
  - "tasks"
  - "smart routing optimization"
  - "sk-design routing vocabulary"
  - "hub-router keyword sync"
importance_tier: "high"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/008-smart-routing-optimization"
    last_updated_at: "2026-07-06"
    last_updated_by: "markdown-leaf-agent"
    recent_action: "Implemented Phase 008 routing vocabulary/prose optimization and captured benchmark evidence."
    next_safe_action: "Use Phase 009 for README alignment only; Phase 008 routing edits are complete."
---
# Tasks: Phase 008 — Smart Routing Optimization (Hub + Mode Packets)

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

**Task Format**: `T### [P?] Description (file path or evidence target) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Entry Gate and Current Routing Review

- [x] T001 Verify Phase 007 strict validation, template-alignment closure, and go/no-go state (Phase 007 evidence) [15m]
- [x] T002 Read current hub `SKILL.md` Section 2 SMART ROUTING before editing (`.opencode/skills/sk-design/SKILL.md`) [10m]
- [x] T003 [P] Read current `mode-registry.json` before editing, including `aliases` and `transformVerbRouting` (`.opencode/skills/sk-design/mode-registry.json`) [10m]
- [x] T004 [P] Read current `hub-router.json` before editing, including `vocabularyClasses` and `routerSignals` (`.opencode/skills/sk-design/hub-router.json`) [10m]
- [x] T005 Read each of the five mode packets' `SKILL.md` Section 2 SMART ROUTING, including existing procedure-card CONDITIONAL tables (`design-interface/`, `design-foundations/`, `design-motion/`, `design-audit/`, `design-md-generator/`) [30m]
- [x] T006 Re-read or re-run `benchmark/baseline/skill-benchmark-report.json` and `benchmark/after-009/report.json`, extracting D1/D2/D3/D5 scores and named contamination scenarios (benchmark evidence) [20m]
- [x] T007 Record any logic-sync conflict between this plan and current hub/mode/registry/router shape (`plan.md` or implementation notes) [10m]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Keyword/Alias Sharpening Contract

### Ambiguity Resolution
- [x] T008 Draft the per-mode ambiguity resolution map: benchmark finding -> proposed keyword/alias/prose fix or explicit no-change decision (routing contract draft) [30m]
- [x] T009 [P] Map each `after-009/report.md` contamination scenario (AI-003, TV-003, TV-005, MG-001, MG-002, MG-003, SR-001, SR-004, PB-001, PB-002, PB-003) to a mode pair and a proposed disambiguation (routing contract draft) [30m]

### Hub and Mode Prose
- [x] T010 Draft sharpened keyword/alias prose for the hub Section 2 SMART ROUTING, preserving the existing routing rule and discriminator contract (hub shell contract) [25m]
- [x] T011 [P] Draft sharpened keyword/alias prose for `design-interface/SKILL.md` Section 2 SMART ROUTING [20m]
- [x] T012 [P] Draft sharpened keyword/alias prose for `design-foundations/SKILL.md` Section 2 SMART ROUTING [20m]
- [x] T013 [P] Draft sharpened keyword/alias prose for `design-motion/SKILL.md` Section 2 SMART ROUTING [20m]
- [x] T014 [P] Draft sharpened keyword/alias prose for `design-audit/SKILL.md` Section 2 SMART ROUTING [20m]
- [x] T015 [P] Draft sharpened keyword/alias prose for `design-md-generator/SKILL.md` Section 2 SMART ROUTING [20m]
- [x] T016 Draft the explicit procedure-card cross-reference for each of the five modes' routing prose, citing the existing CONDITIONAL selection table by relative path [20m]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Registry/Router Sync Preservation

### Vocabulary Sync
- [x] T017 Draft the `hub-router.json` `vocabularyClasses`/`routerSignals` updates needed to match the proposed keyword/alias changes (registry/router draft) [25m]
- [x] T018 Draft the `mode-registry.json` `aliases`/`transformVerbRouting` vocabulary-only updates, explicitly excluding `workflowMode`, `backendKind`, `packet`, `proceduresPath`, `packetSkillName`, `advisorRouting`, and `toolSurface` (registry/router draft) [25m]
- [x] T019 Confirm existing `transformVerbRouting.excludedAliases` entries (`foundations: typeset, colorize`; `audit: harden, polish`) are preserved unless explicitly revised with rationale (registry/router draft) [10m]

### Negative Controls
- [x] T020 Confirm the plan keeps five public modes and no new `workflowMode` values (route evidence) [10m]
- [x] T021 Confirm the plan keeps `toolSurface` entries unchanged for all five modes (registry evidence) [10m]
- [x] T022 Confirm no public micro-skill identities or registry bypass are introduced (file inventory) [10m]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification and Handoff

### Verification
- [x] T023 Run strict spec validation for this phase folder (validation evidence) [5m]
- [x] T024 Run or record the canonical Lane-C skill-benchmark command after implementation and compare against `benchmark/after-009/report.json` (benchmark evidence) [20m]
- [x] T025 Review negative controls for registry authority, `toolSurface` boundary, and public-identity preservation (`checklist.md`) [15m]
- [x] T026 Update checklist P0/P1 rows with evidence or approved deferral (`checklist.md`) [15m]

### Documentation
- [x] T027 Ensure docs do not claim implementation completion while Phase 007 or routing-vocabulary implementation remains unresolved (`tasks.md`, `checklist.md`) [5m]
- [x] T028 Record rollback path and stop triggers (`plan.md`) [5m]
- [x] T029 Record handoff criteria for Phase 009 README alignment (`tasks.md`) [10m]

<!-- /ANCHOR:phase-4 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Phase 007 P0 gates are verified with evidence before implementation begins.
- [x] Sharpened keyword/alias prose exists in the hub and all five mode packets' Section 2 SMART ROUTING.
- [x] Each mode's routing prose explicitly cross-references its existing procedure-card CONDITIONAL selection table.
- [x] `hub-router.json` `vocabularyClasses`/`routerSignals` and `mode-registry.json` `aliases` are updated together; all other registry/router structural keys are unchanged.
- [x] Negative controls prove no new public modes, no registry-key renames, and no `toolSurface` changes were introduced.
- [x] Checklist.md reflects current evidence state.

<!-- ANCHOR:implementation-evidence -->
## Implementation Evidence

| Evidence Area | Result |
|---------------|--------|
| Phase 007 gate | Phase 007 checklist Gate Status CLOSED; current strict validation returned Errors: 0, Warnings: 1 (`CONTINUITY_FRESHNESS` only), accepted under the user-provided warning policy |
| Routing files read before edit | Hub `SKILL.md`, five mode `SKILL.md` files, `mode-registry.json`, `hub-router.json`, baseline benchmark report, and after-009 benchmark report |
| Ambiguity map | AI-003/PB-001 hub identity isolated from interface router evidence; TV-003 hierarchy clarified as foundations unless full direction; TV-005 polish/audit clarified as audit review frame; MG-001/MG-002 `tokens.json`/`DESIGN.md` clarified as md-generator artifacts; PB-002 hierarchy remains foundations; PB-003 remains md-generator |
| Files changed | `sk-design/SKILL.md`; five `design-*/SKILL.md` files; `hub-router.json`; `mode-registry.json`; this Phase 008 folder |
| Registry/router negative control | `git diff -G'workflowMode|backendKind|packet\"|proceduresPath|packetSkillName|advisorRouting|toolSurface|routerPolicy|bundleRules'` produced no output for `mode-registry.json`/`hub-router.json` |
| JSON validity | `jq empty .opencode/skills/sk-design/mode-registry.json .opencode/skills/sk-design/hub-router.json` passed with no output |
| Benchmark rerun | `benchmark-after-008/report.md`: aggregate 69/100; D1inter unscored-mode-a; D2 100; D3 0; D5 100; D4 unscored-mode-a; contamination list remains qualitative drift, not failures |
| Phase 009 handoff | README alignment intentionally remains in `../009-readme-alignment/`; Phase 008 changed routing vocabulary/prose only |

<!-- /ANCHOR:implementation-evidence -->

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Predecessor Gate**: See `../007-procedure-card-template-alignment/`
- **Benchmark Evidence**: `../../../../skills/sk-design/benchmark/baseline/skill-benchmark-report.md`, `../../../../skills/sk-design/benchmark/after-009/report.md`

<!-- /ANCHOR:cross-refs -->
