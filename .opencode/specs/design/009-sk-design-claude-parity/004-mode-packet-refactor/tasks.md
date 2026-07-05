---
title: "Tasks: Phase 004 - Mode Packet Refactor"
description: "Pending task breakdown for the planned sk-design mode-packet refactor."
trigger_phrases:
  - "phase 004 tasks"
  - "mode packet refactor tasks"
  - "procedure integration tasks"
importance_tier: "high"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "design/009-sk-design-claude-parity/004-mode-packet-refactor"
    last_updated_at: "2026-07-05T00:00:00.000Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Created Phase 004 task list."
    next_safe_action: "Use tasks for scoped future implementation."
---
# Tasks: Phase 004 - Mode Packet Refactor

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path or surface) [effort] {deps: T###}`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Target |
|-----------|-------|--------|
| M1 Contract Freeze | T001-T007 | Before implementation edits |
| M2 Mode Integration | T008-T017 | Implementation pass |
| M3 Proof and Fallback | T018-T026 | Implementation pass |
| M4 Maintainer Docs | T027-T031 | After mode behavior verified |
| M5 Verification | T032-T042 | Completion gate |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [Milestone M1]

- [ ] T001 Read `sk-design` parent hub before implementation (`.opencode/skills/sk-design/SKILL.md`) [20m]
- [ ] T002 Read `mode-registry` and record current five public modes (`.opencode/skills/sk-design/`) [20m]
- [ ] T003 Read hub-router behavior and current routing references (`.opencode/skills/sk-design/`) [20m]
- [ ] T004 [P] Read `design-interface` mode packet (`.opencode/skills/sk-design/design-interface/`) [20m]
- [ ] T005 [P] Read `design-foundations` mode packet (`.opencode/skills/sk-design/design-foundations/`) [20m]
- [ ] T006 [P] Read `design-motion`, `design-audit`, and `design-md-generator` mode packets (`.opencode/skills/sk-design/`) [45m]
- [ ] T007 Record md-generator backend boundary and verification command (`design-md-generator`) [30m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [Milestone M2]

- [ ] T008 Define common procedure-selection language for modes (shared wording) [30m] {deps: T001, T002, T003}
- [ ] T009 Add procedure integration to `design-interface` mode packet [45m] {deps: T004, T008}
- [ ] T010 Add procedure integration to `design-foundations` mode packet [45m] {deps: T005, T008}
- [ ] T011 Add procedure integration to `design-motion` mode packet [45m] {deps: T006, T008}
- [ ] T012 Add procedure integration to `design-audit` mode packet [45m] {deps: T006, T008}
- [ ] T013 Add procedure integration to `design-md-generator` while preserving backend boundary [60m] {deps: T006, T007, T008}
- [ ] T014 Check that no new public mode names or public procedure skills were introduced [20m] {deps: T009, T010, T011, T012, T013}
- [ ] T015 Check that `mode-registry` still lists only the five current public modes [20m] {deps: T014}
- [ ] T016 Check that hub-router semantics still select public modes before private procedures [30m] {deps: T014}
- [ ] T017 Remove any duplicated shared base guidance introduced during mode edits [30m] {deps: T009, T010, T011, T012, T013}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification [Milestone M3]

These tasks prepare the mode-level proof and fallback checks used by the final verification pass.

- [ ] T018 Define context card expectations for each mode [45m] {deps: T009, T010, T011, T012, T013}
- [ ] T019 Define proof card expectations for each mode [45m] {deps: T018}
- [ ] T020 Add verifier cadence for procedure selection and proof evidence [45m] {deps: T019}
- [ ] T021 Add direct no-subagent fallback to `design-interface` [20m] {deps: T009}
- [ ] T022 Add direct no-subagent fallback to `design-foundations` [20m] {deps: T010}
- [ ] T023 Add direct no-subagent fallback to `design-motion` [20m] {deps: T011}
- [ ] T024 Add direct no-subagent fallback to `design-audit` [20m] {deps: T012}
- [ ] T025 Add direct no-subagent fallback to `design-md-generator` [20m] {deps: T013}
- [ ] T026 Verify fallback paths keep the same proof expectations as normal execution [30m] {deps: T021, T022, T023, T024, T025}
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Maintainer Docs [Milestone M4]

- [ ] T027 Update README maintainer guidance if scoped by implementation (`.opencode/skills/sk-design/README.md`) [30m] {deps: T020, T026}
- [ ] T028 Update changelog or packet-local change notes if required [30m] {deps: T020, T026}
- [ ] T029 Document mode procedure model without listing private cards as public user choices [30m] {deps: T027}
- [ ] T030 Confirm shared reference links still resolve after documentation updates [20m] {deps: T027, T028}
- [ ] T031 Confirm README/changelog claims match implemented behavior [20m] {deps: T027, T028, T030}
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification [Milestone M5]

- [ ] T032 Run strict validation for the Phase 004 packet [10m]
- [ ] T033 Run link checks for hub, registry, mode packets, shared references, README, and changelog [30m] {deps: T027, T028, T030}
- [ ] T034 Run routing checks for single advisor identity and five public modes [30m] {deps: T015, T016}
- [ ] T035 Run mode proof review for all five mode packets [45m] {deps: T018, T019, T020}
- [ ] T036 Run md-generator backend verification [45m] {deps: T013, T025}
- [ ] T037 Run boundary audit for private procedure exposure [30m] {deps: T014, T029}
- [ ] T038 Reconcile `checklist.md` with evidence [30m] {deps: T032, T033, T034, T035, T036, T037}
- [ ] T039 Update `implementation-summary.md` with final implementation evidence [30m] {deps: T038}
- [ ] T040 Update `description.json` and `graph-metadata.json` if status changes [20m] {deps: T039}
- [ ] T041 Re-run strict validation after summary and checklist updates [10m] {deps: T038, T039, T040}
- [ ] T042 Report final validation exit and residual risks [10m] {deps: T041}
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 checklist items verified with evidence.
- [ ] No public mode taxonomy expansion occurred.
- [ ] All five mode packets have procedure integration, proof expectations, and direct fallback paths.
- [ ] `design-md-generator` backend verification passed.
- [ ] Strict spec validation passed after final metadata updates.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
