---
title: "Tasks: Phase 002 — Parent Hub Compatibility Shell"
description: "Level 2 task list for planning and later implementing the sk-design parent hub manager shell while preserving advisor identity and registry routing."
trigger_phrases:
  - "tasks"
  - "parent hub compatibility shell"
  - "sk-design manager shell"
  - "mode registry"
importance_tier: "high"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/design/009-sk-design-claude-parity/002-parent-hub-compatibility-shell/"
    last_updated_at: "2026-07-05"
    last_updated_by: "markdown-leaf-agent"
    recent_action: "Created planned Level 2 parent hub compatibility shell docs."
    next_safe_action: "Wait for Phase 001 gates to pass before any sk-design hub implementation."
---
# Tasks: Phase 002 — Parent Hub Compatibility Shell

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

### Entry Gate and Current Hub Review

- [ ] T001 Verify Phase 001 strict validation, ownership closure, baseline evidence, and go/no-go state (Phase 001 evidence) [15m]
- [ ] T002 Read current `sk-design` parent hub before editing (`.opencode/skills/sk-design/SKILL.md`) [10m]
- [ ] T003 Read current mode registry before editing (`.opencode/skills/sk-design/mode-registry.json`) [10m]
- [ ] T004 Record any logic-sync conflict between Phase 002 plan and current hub/registry shape (`implementation-summary.md`) [10m]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Compatibility Shell Contract

### Manager Behavior
- [ ] T005 Define context-first intake fields for goals, constraints, artifacts, design references, and verification expectations (hub shell contract) [20m]
- [ ] T006 Define visible plan behavior before design/build/transport execution (hub shell contract) [20m]
- [ ] T007 [P] Define proof gate fields for taste, accessibility, responsive behavior, and requested transport checks (hub shell contract) [20m]
- [ ] T008 [P] Define verifier cadence and blocking outcomes (hub shell contract) [20m]

### Boundaries
- [ ] T009 Document transport-vs-taste separation in the parent shell (hub shell contract) [15m]
- [ ] T010 Document negative rules against public skill mirroring and registry bypass (hub shell contract) [15m]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Registry Preservation

### Public Routing
- [ ] T011 Confirm the shell keeps one public `sk-design` advisor identity (route evidence) [10m]
- [ ] T012 Confirm the shell keeps existing five public modes and registry keys (registry evidence) [15m]
- [ ] T013 Confirm no 14 public skill mirror or public micro-skill identities are added (file inventory) [10m]

### Integration
- [ ] T014 Map manager-shell behavior to existing mode packet responsibilities without adding public routes (`plan.md` or shell notes) [20m]
- [ ] T015 Record Phase 003 handoff for private procedure-card detail (`implementation-summary.md`) [10m]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification and Handoff

### Verification
- [ ] T016 Run strict spec validation for this phase folder (validation evidence) [5m]
- [ ] T017 Run or record canonical router/registry preservation check after implementation (route evidence) [15m]
- [ ] T018 Review negative controls for public identity, registry authority, and transport boundary (`checklist.md`) [15m]
- [ ] T019 Update checklist P0/P1 rows with evidence or approved deferral (`checklist.md`) [15m]

### Documentation
- [ ] T020 Ensure docs do not claim implementation completion while Phase 001 or shell implementation remains unresolved (`implementation-summary.md`) [5m]
- [ ] T021 Record rollback path and stop triggers (`plan.md`) [5m]
- [ ] T022 Record handoff criteria for Phase 003 private procedure-card layer (`implementation-summary.md`) [10m]

<!-- /ANCHOR:phase-4 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Phase 001 P0 gates are verified with evidence before implementation begins.
- [ ] Parent hub shell contract exists in the approved implementation location.
- [ ] Single public `sk-design` identity and existing mode registry are preserved.
- [ ] Context-first intake, visible plan, proof gates, and verifier cadence are present.
- [ ] Transport-vs-taste separation is explicit.
- [ ] Negative controls prove no public 14-skill mirror was added.
- [ ] Checklist.md reflects current evidence state.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Predecessor Gate**: See `../001-baseline-ownership-gate/`

<!-- /ANCHOR:cross-refs -->
