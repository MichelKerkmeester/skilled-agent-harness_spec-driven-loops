---
title: "Task Breakdown: Runtime Coverage"
description: "Phase 7 of the git action advisory hook packet."
trigger_phrases:
  - "007-runtime-coverage docs"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/016-git-action-advisory-hook/007-runtime-coverage"
    last_updated_at: "2026-07-28T08:00:00Z"
    last_updated_by: "glm-5-2"
    recent_action: "Built and verified in one pass"
    next_safe_action: "Operator review"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-28-sk-git-016-7"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Task Breakdown: Runtime Coverage

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending · `[x]` complete · `[~]` blocked
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Confirm the foundation from phases 002, 003, and 006
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-002 Style-align the five sk-git script files
- [x] T-003 Build the OpenCode plugin adapter
- [x] T-004 Build the Pi extension adapter
- [x] T-005 Build the Cursor proxy adapter
- [x] T-006 Wire Devin into the `^exec$` matcher group
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-007 Tests green, drift guards pass, simulations advise and fail open
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Complete: evidence recorded in implementation-summary.md.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Parent: `../spec.md`
<!-- /ANCHOR:cross-refs -->
