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
    next_safe_action: "Start T001 once adapter phases land"
    blockers:
      - "005-007 adapter phases not yet executed"
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

<!-- These tasks belong to a future execution pass, gated behind the 005-007 adapter phases. -->

- [ ] T004 [B] Relocate `reduce-state.cjs` from `deep-review/scripts/` to shared `runtime/scripts/` per ADR-010 (LOCKED), repoint `deep-review`'s import (behavior-preserving)
- [ ] T005 [B] Decide the convergence reuse-vs-extend option (this phase's own execution-time call, independent of ADR-010)
- [ ] T006 [B] Implement `runtime/scripts/reduce-alignment-state.cjs`, the alignment-report reducer, as a sibling of the relocated `reduce-state.cjs` (blocked on T005)
- [ ] T007 [B] Add `LEAF_BY_LOOP`/`STATE_LOG_BY_LOOP` entries for `alignment` in verify-iteration.cjs
- [ ] T008 [B] Implement lane-round-robin corpus partitioning for iteration dispatch
- [ ] T009 [B] Stand up the `alignment/` state-file layout mirroring the real `review/` precedent
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

<!-- These tasks belong to a future execution pass, gated behind the 005-007 adapter phases. -->

- [ ] T010 [B] Diff `deep-review`'s reducer output before/after the T004 relocation and confirm it is byte-identical (ADR-010 behavior-preservation check)
- [ ] T011 [B] Dry-run the loop-lock acquire/status/refresh/release cycle against a scratch `alignment/` directory
- [ ] T012 [B] Dry-run the reducer against a synthetic multi-lane findings set; confirm a FAIL lane is not averaged away
- [ ] T013 [B] Confirm "nothing to converge" reporting when zero lanes resolve
- [ ] T014 [B] Update `checklist.md` with evidence for each verified item
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
