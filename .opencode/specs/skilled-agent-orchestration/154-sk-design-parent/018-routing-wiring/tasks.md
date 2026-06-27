---
title: "Tasks: sk-design routing and resource-loading wiring"
description: "Task list for the routing wiring: interface grounding split and preflight dial input, foundations aliases and cross-axis TOKENS load, precise md-generator aliases, then a benchmark rerun. Not started."
trigger_phrases:
  - "sk-design routing wiring tasks"
  - "foundations aliases tasks"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/018-routing-wiring"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Split the interface grounding loader and wired the foundations and md-gen routing"
    next_safe_action: "Move to 019 handoff card"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-018-routing-wiring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-design routing and resource-loading wiring

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the interface, foundations and md-generator lineage findings as grounding evidence
- [x] T002 Confirmed the live `mode-registry.json` aliases and the three SKILL.md resource maps
- [x] T003 Read the 014 baseline routed-vs-wasted counts (interface 2.9/1.7, foundations 2.5/1.5, md-generator 7.0/5.3)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Split the interface `GROUNDING` loader into `REAL_SYSTEM_GROUNDING` (own-system, loads the inventory only) and `REAL_WORLD_REFERENCE` (the Mobbin and Refero catalogs), so a system-grounding task no longer pulls the external tool refs (`.opencode/skills/sk-design/design-interface/SKILL.md`)
- [x] T005 [P] Added `brief_to_dials.md` to the interface `MECHANICAL_PREFLIGHT` branch so the preflight card has its dial-calibration input (`.opencode/skills/sk-design/design-interface/SKILL.md`)
- [x] T006 [P] Added the foundations parent registry aliases: grid, container queries, context adaptation, data visualization, chart type, data tables, token starter (`.opencode/skills/sk-design/mode-registry.json`)
- [x] T007 [P] Made the foundations `TOKENS` branch load the cross-axis color, type and layout references plus the parent token vocabulary, not just the scaffold (`.opencode/skills/sk-design/design-foundations/SKILL.md`)
- [x] T008 [P] Added precise md-generator validate, report, preview and study aliases with no collision against foundations or interface (`.opencode/skills/sk-design/mode-registry.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Verified routing holds: the gate scores 100 with 0 escapes, 0 dead intent keys and 0 dead paths on all five modes, and router-replay routes the split intents and the cross-axis TOKENS load correctly
- [x] T010 Interface over-routing dropped: a system-grounding task now loads one grounding file instead of four. Audit and md-generator multi-resource loading is largely intentional, so their economy is addressed by routing reach (aliases) not trimming; a full Mode-A re-score is deferred to 020 fixtures
- [x] T011 `validate.sh --strict` passes on this packet, and the new foundations and md-generator aliases do not collide with each other or the other modes
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation tasks complete
- [x] No blocked tasks remaining
- [x] Routing holds (gate 100, 0 escapes), interface over-routing dropped, and strict validation passes

### Status note

COMPLETE. The interface grounding loader was split so a system-grounding task loads the inventory alone instead of the inventory plus both external catalogs, the preflight branch now loads its dial-calibration input, the foundations TOKENS branch loads the full cross-axis set plus the shared token vocabulary, and the parent registry gained the foundations and md-generator aliases the children own. The gate scores 100 with 0 escapes on all five modes, the grounding split cuts a system-grounding load from four files to one, and packaging passes. A full Mode-A re-score against the 014 baseline is deferred to the 020 fixtures phase.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Grounding**: See the interface, foundations, and md-generator lineage research and `../014-routing-benchmark/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
