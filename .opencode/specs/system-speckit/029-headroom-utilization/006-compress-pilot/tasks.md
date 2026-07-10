---
title: "Tasks: Scoped Offline compress() Pilot"
description: "Run a scoped, offline Headroom compress() pilot on one copied non-authoritative artifact behind the 003 guard, measuring real token savings, citation survival, and rejection of excluded fixtures — turning the proven perfect-fit design into a measured result."
trigger_phrases:
  - "compress pilot"
  - "headroom compress benchmark"
  - "perfect fit pilot"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-headroom-utilization/006-compress-pilot"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the compress-pilot phase"
    next_safe_action: "Pick one large copied artifact and reuse the 004 install"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-029-006-compress-pilot"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Scoped Offline compress() Pilot

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

- [ ] T001 Reuse the 004 isolated install; confirm clean-room env
- [ ] T002 Select one large copied non-authoritative artifact + assemble negative fixtures
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Run the artifact through the 003 guard, then compress() with the conservative config
- [ ] T004 Measure before/after tokens + [SOURCE:] equality; run negative fixtures
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Write the measured report (savings, citation survival, rejection rate)
- [ ] T006 Run validate.sh; STOP for the adoption decision
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Report artifact written and `validate.sh` green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
