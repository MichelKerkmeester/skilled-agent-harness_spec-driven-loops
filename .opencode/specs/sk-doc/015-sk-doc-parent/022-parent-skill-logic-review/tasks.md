---
title: "Tasks: Parent-skill logic deep review"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "parent skill logic review tasks"
  - "014 sk-doc phase 022 tasks"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-parent/022-parent-skill-logic-review"
    last_updated_at: "2026-07-07T15:48:20.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-022 tasks"
    next_safe_action: "Collect review-report.md; summarize; validate"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 40
    open_questions: []
    answered_questions: []
---
# Tasks: Parent-skill logic deep review

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

- [x] T001 Locate the doctrine (create-skill), four hubs, and the advisor
- [x] T002 Create the review phase folder under sk-doc/999-sk-doc-parent
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Dispatch the Fable-5 xhigh single-round review with precise pointers
- [ ] T004 Agent writes review-report.md (findings + cross-hub matrix + advisor section)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Confirm report covers doctrine + 4 hubs + advisor; findings carry file:line + severity
- [ ] T006 `validate.sh`; commit the phase
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Fable-5 review dispatched
- [ ] review-report.md present + covers all dimensions
- [ ] `validate.sh` passes
- [ ] No `[B]` blocked tasks remaining
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Report**: See `review-report.md`
<!-- /ANCHOR:cross-refs -->
