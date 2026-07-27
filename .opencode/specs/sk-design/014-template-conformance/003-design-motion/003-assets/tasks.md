---
title: "Tasks: design-motion assets/ conformance"
description: "Task breakdown for auditing design-motion's 3 assets/ files."
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/003-design-motion/003-assets"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author assets audit tasks"
    next_safe_action: "Read all 3 assets files against skill-asset-template.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: design-motion assets/ conformance

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

- [ ] T001 Read `skill-asset-template.md` in full
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 [P] Diff `animate-presence-checklist.md` against the template; fix if confirmed
- [ ] T003 [P] Diff `motion-pattern-cards.md` against the template; fix if confirmed
- [ ] T004 [P] Diff `motion-performance-failure-card.md` against the template; fix if confirmed
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Re-diff all 3 files
- [ ] T006 Run `validate.sh` for this folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks `[x]`
- [ ] No `[B]` blocked tasks remaining
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
