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
    recent_action: "Enumerated the routing-wiring tasks across three modes"
    next_safe_action: "Split the interface grounding loader, then add the foundations aliases"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-018-routing-wiring"
      parent_session_id: null
    completion_pct: 0
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

- [ ] T001 Read the interface (sections 5), foundations (P1-1, P1-2), and md-generator (P1 routing) lineage findings as the grounding evidence
- [ ] T002 Confirm the live `mode-registry.json` aliases and the interface, foundations, and md-generator resource maps (`.opencode/skills/sk-design/mode-registry.json` and the three SKILL.md routers)
- [ ] T003 Read the `../014-routing-benchmark` baseline routed-vs-wasted counts for the affected modes
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [P] Split the interface `GROUNDING` loader into `REAL_SYSTEM_GROUNDING` (own-system grounding) and `REAL_WORLD_REFERENCE` (one surface-chosen catalog, Mobbin for app, Refero for web), keeping paid lookup optional (`.opencode/skills/sk-design/design-interface/SKILL.md`)
- [ ] T005 [P] Add `brief_to_dials.md` to the interface `MECHANICAL_PREFLIGHT` branch so the preflight card has its dial-calibration input (`.opencode/skills/sk-design/design-interface/SKILL.md`)
- [ ] T006 [P] Add the foundations parent registry aliases the child owns: grid, container queries, adaptation, data visualization, chart type, data tables, token starter, and related terms (`.opencode/skills/sk-design/mode-registry.json`)
- [ ] T007 [P] Make the foundations `TOKENS` branch load cross-axis color, type, and layout references plus the parent token vocabulary, not just the token scaffold (`.opencode/skills/sk-design/design-foundations/SKILL.md`)
- [ ] T008 [P] Add precise md-generator validate, report, preview, and study aliases that do not collide with foundations or interface (`.opencode/skills/sk-design/mode-registry.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Rerun the routing benchmark for the affected modes and confirm resource recall holds
- [ ] T010 Confirm wasted-load counts drop for audit and md-generator versus the 014 baseline
- [ ] T011 Run `validate.sh --strict` on this packet (0 errors) and confirm no new alias collisions across modes
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All implementation tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The benchmark rerun confirms recall holds and economy improves for audit and md-generator, and strict validation passes

### Status note

This packet is NOT STARTED. It scaffolds the router-precision and resource-loading wiring the interface, foundations, and md-generator lineages named, with the routing economy cost confirmed by the sibling 014 benchmark. A later subagent splits the interface grounding loader, adds the preflight dial input, adds the foundations and md-generator aliases and the foundations cross-axis TOKENS load, reruns the benchmark, and records the evidence.
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
