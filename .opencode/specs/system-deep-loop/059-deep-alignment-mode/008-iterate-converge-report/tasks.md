---
title: "Tasks: Phase 8: iterate-converge-report"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase 008"
  - "convergence wiring"
  - "alignment reducer"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/008-iterate-converge-report"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Draft phase 008 task list"
    next_safe_action: "Start T004 loop-lock dry-run"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-008"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 8: iterate-converge-report

<!-- SPECKIT_LEVEL: 2 -->
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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm phases 005-007 adapter check() output shape or fall back to the phase-005 contract findings shape
- [ ] T002 Re-read `.opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs` lines 640-780 for currency
- [ ] T003 [P] Re-read `.opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` lines 1-40 for currency
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [B] Escalate the convergence reuse-vs-extend tradeoff to the 002 decision-record (blocked on that packet ruling)
- [ ] T005 [B] Implement the alignment-report reducer per the reduce-state.cjs-mirrored plan (blocked on T004)
- [ ] T006 [P] Add `LEAF_BY_LOOP`/`STATE_LOG_BY_LOOP` entries for `alignment` in verify-iteration.cjs
- [ ] T007 Implement lane-round-robin corpus partitioning for iteration dispatch
- [ ] T008 Stand up the `alignment/` state-file layout mirroring the real `review/` precedent
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Dry-run the loop-lock acquire/status/refresh/release cycle against a scratch `alignment/` directory
- [ ] T010 Dry-run the reducer against a synthetic multi-lane findings set; confirm a FAIL lane is not averaged away
- [ ] T011 Confirm "nothing to converge" reporting when zero lanes resolve
- [ ] T012 Update `checklist.md` with evidence for each verified item
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
