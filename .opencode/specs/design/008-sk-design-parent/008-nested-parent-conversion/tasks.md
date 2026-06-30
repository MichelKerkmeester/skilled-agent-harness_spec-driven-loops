---
title: "Tasks: Phase 8: nested-parent-conversion"
description: "Task breakdown for the plan-only nested-parent-conversion packet: the planning/authoring tasks done in this packet, and the FUTURE conversion tasks (executed only after operator approval)."
trigger_phrases:
  - "sk-design conversion tasks"
  - "sk-design nested packet task list"
  - "sk-design conversion stages tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/008-nested-parent-conversion"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Listed planning tasks and the future conversion tasks"
    next_safe_action: "Run T013 metadata + dual validate, then stop for review"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design/008-sk-design-parent/008-nested-parent-conversion"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: nested-parent-conversion

<!-- SPECKIT_LEVEL: 3 -->

<!-- "Setup" = this plan-only packet (done). "Implementation" + "Verification" = the FUTURE
conversion, which this packet does NOT execute. Unchecked items are future, operator-gated. -->

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

This phase is the plan-only authoring done in THIS packet.

- [x] T001 Read the pattern + invariant (`parent_skills_nested_packets.md`) and the three parent-skill templates
- [x] T002 Read the canonical example (`deep-loop-workflows/`) and the prior 002 decision
- [x] T003 Author `spec.md` (Level 3, plan-only, completion_pct 0)
- [x] T004 Author `decision-record.md` ADR-001 (Model-B → Model-A reversal) + ADR-002 (invokable-hub routing; merged-identity avoided)
- [x] T005 Author `plan.md` with the five gated stages, entry/exit gates, and rollback
- [x] T006 Author `tasks.md` (this file) and `checklist.md`
- [x] T007 Author `implementation-summary.md` (honest: plan-only, completion_pct 0)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

The FUTURE conversion stages. This packet executes NONE of these.

- [ ] T010 Stage 1 - Create `sk-design/SKILL.md` (hub, routing-only, aggregate trigger phrases) {deps: operator approval}
- [ ] T011 Stage 1 - Create `sk-design/mode-registry.json` (five modes; `backendKind`; `packetSkillName` where folder differs) {deps: T010}
- [ ] T012 Stage 1 - Create `sk-design/graph-metadata.json` (one identity; aggregated trigger phrases; edges depends_on 155, related 002/147/150) {deps: T010}
- [ ] T013 Stage 2 - Establish the recovery baseline (worktree OR committed pre-move tag) {deps: T010, T011, T012}
- [ ] T014 Stage 2 - Move the five skills' content verbatim into `sk-design/<mode>/` {deps: T013}
- [ ] T015 Stage 2 - Delete each moved skill's `graph-metadata.json` (one hub graph-metadata remains) {deps: T014}
- [ ] T016 Stage 2 - Repoint packet internal paths; move shared base refs into `sk-design/shared/` {deps: T014}
- [ ] T017 Stage 3 - Rewire the ~72 `.opencode/skills/` cross-refs → `sk-design` (+ mode/packet path) {deps: T015, T016}
- [ ] T018 [P] Stage 3 - Rewire the 2 root-config refs (`CLAUDE.md`, `AGENTS.md`) {deps: T015, T016}
- [ ] T019 Stage 4 (OPTIONAL) - Add `/design:*` commands + design-mode agents, or explicitly defer {deps: T017, T018}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

This packet verifies only the plan-only deliverables (T020). T030–T034 are the FUTURE conversion gate.

- [ ] T020 THIS PACKET: generate `description.json` + `graph-metadata.json`; append the 008 row to the parent 154 map (append-only); run `validate.sh --strict` on this packet AND on 154 {deps: T003-T007}
- [ ] T030 Stage 5 - `package_skill.py --check` passes on the hub `sk-design` {deps: T017, T018}
- [ ] T031 Stage 5 - `advisor_rebuild` + `skill_graph_validate` succeed (no new merged-identity maps, no new drift-guard) {deps: T017, T018}
- [ ] T032 Stage 5 - Routing fixture: a design query routes to `sk-design` at ≥0.8 {deps: T031}
- [ ] T033 Stage 5 - Routing fixture: the hub routes representative requests to the correct mode packet {deps: T031}
- [ ] T034 Stage 5 - `validate.sh --recursive` on `154-sk-design-parent` passes {deps: T030, T032, T033}
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (THIS PACKET: T001-T007 done; T020 the remaining plan-only task)
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (dual `validate.sh --strict` clean for this packet + parent 154)

> The conversion stages (T010-T019, T030-T034) are FUTURE and are NOT gated by this plan-only packet.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
