---
title: "Tasks: Phase 17: Fanout Stall Watchdog"
description: "Completed task ledger for the opt-in fanout pool stall-watchdog abort-requeue path."
trigger_phrases:
  - "fanout stall watchdog"
  - "lag-ceiling abort-requeue"
  - "hung lineage abort"
  - "pool slot stall detection"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/002-deep-loop-runtime/017-fanout-stall-watchdog"
    last_updated_at: "2026-07-01T21:52:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold tasks with completed fanout stall-watchdog ledger from spec.md"
    next_safe_action: "Use this task ledger as completion evidence for the shipped opt-in stall watchdog"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs"
    session_dedup:
      fingerprint: "sha256:017b6f8d0e2c4a7193d5f7a9b1c3e5d7f9a0b2c4d6e8f1a3b5c7d9e0f2a4b6e4"
      session_id: "scaffold-content-remediation-017"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 17: Fanout Stall Watchdog

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Read the shipped phase spec and confirm `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` is the only implementation file in scope.
- [x] T002 Confirm existing `failure_class:"timeout"` retry ledger is the settlement path for aborted items.
- [x] T003 Confirm default pool behavior must remain unchanged when opt-in config is absent.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add opt-in `lagCeilingAction:"abort-requeue"` config behavior.
- [x] T005 Require explicit `lagCeilingMs` threshold when the watchdog action is enabled.
- [x] T006 Attach abort handles to active pool items per slot.
- [x] T007 Add stall detection polling against the configured lag ceiling.
- [x] T008 Settle aborted items through the existing `failure_class:"timeout"` retry ledger.
- [x] T009 Preserve active-slot count invariant after abort and requeue.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Verify pool without `lagCeilingAction` runs slow items to completion unaborted.
- [x] T011 Verify enabled watchdog aborts and requeues an item after the lag ceiling is exceeded.
- [x] T012 Verify aborted item records a `failure_class:"timeout"` retry ledger entry.
- [x] T013 Verify active slots remain at or below configured max immediately after abort.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Manual verification passed according to the spec.md acceptance criteria.
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
