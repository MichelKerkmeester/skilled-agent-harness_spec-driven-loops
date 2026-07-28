---
title: "Tasks: Cross-runtime goal hook capability probes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "capability probe tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/002-capability-probes"
    last_updated_at: "2026-07-28T21:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored Level 1 planning docs for phase 002 capability probes"
    next_safe_action: "Run the three live capability probes and record the matrix"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-002-20260728"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether Devin's Stop hook supports a blocking/continue decision (resolved by this phase)."
      - "Whether Pi's typed event surface offers a usable turn-end event (resolved by this phase)."
    answered_questions: []
---
# Tasks: Cross-runtime goal hook capability probes

<!-- SPECKIT_LEVEL: 1 -->
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

- [ ] T001 Confirm live session access (or document absence) for a Devin probe session
- [ ] T002 Confirm live session access (or document absence) for a Cursor probe session
- [ ] T003 [P] Locate Pi's installed `types.d.ts` on disk and confirm it is readable
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [P] Probe (a): read Pi's `types.d.ts` event-type declarations for a usable turn-end/agent-loop event
- [ ] T005 [P] Probe (b): dispatch a live Devin session with a test `Stop` hook returning `decision:"block"`; observe actual continuation behavior
- [ ] T006 [P] Probe (c): dispatch a live Cursor session with a test `preToolUse` hook attempting an `agent_message` refresh; observe actual delivery
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Populate the capability matrix in `spec.md` with all three probe results, each cited by evidence (`spec.md`)
- [ ] T008 Update phases 003/004/005 `spec.md` scope sections to reference the fixed tiers instead of open questions
- [ ] T009 Run `validate.sh --strict` on this folder and resolve any errors
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Capability matrix fully populated, no `TBD` cells
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
