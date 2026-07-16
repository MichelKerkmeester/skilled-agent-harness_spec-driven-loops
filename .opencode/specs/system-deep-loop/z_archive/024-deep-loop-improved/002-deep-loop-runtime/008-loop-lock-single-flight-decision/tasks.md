---
title: "Tasks: Phase 8: Loop-Lock Single-Flight Decision"
description: "Completed task ledger for the advisory-lock ADR and opt-in socket-bind guard."
trigger_phrases:
  - "loop-lock socket-bind"
  - "single-flight lock decision"
  - "host-local single flight"
  - "durable packet lock adr"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/002-deep-loop-runtime/008-loop-lock-single-flight-decision"
    last_updated_at: "2026-07-01T21:34:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold tasks with completed single-flight ADR ledger from spec.md"
    next_safe_action: "Use this task ledger as completion evidence for the shipped opt-in socket-bind decision"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts"
    session_dedup:
      fingerprint: "sha256:008b6f8d0e2c4a7193d5f7a9b1c3e5d7f9a0b2c4d6e8f1a3b5c7d9e0f2a4b6d5"
      session_id: "scaffold-content-remediation-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: Loop-Lock Single-Flight Decision

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

- [x] T001 Read the completed ADR spec and confirm `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts` is the only implementation surface.
- [x] T002 Record `durablePacketLock` as the default advisory file-lock baseline.
- [x] T003 Record `hostLocalSingleFlight` as an opt-in same-host socket-bind guard, default false.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the `hostLocalSingleFlight` opt-in socket-bind path in `loop-lock.ts`.
- [x] T005 Implement live-holder detection by attempting `net.connect` before any socket unlink.
- [x] T006 Allow unlink only after the connection attempt proves the socket path is stale.
- [x] T007 Preserve advisory-only behavior when the opt-in flag is false or absent.
- [x] T008 Document that multi-host distributed locking remains unsolved and out of scope.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Verify a second process is rejected when `hostLocalSingleFlight: true` and a live holder exists.
- [x] T010 Verify stale-socket handling does not unlink a live holder's socket.
- [x] T011 Verify disabled/default behavior creates no socket and matches advisory file-lock behavior.
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
