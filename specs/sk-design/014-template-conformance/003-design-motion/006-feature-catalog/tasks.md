---
title: "Tasks: design-motion feature-catalog/ conformance"
description: "Task breakdown for auditing design-motion's feature-catalog/ root and 3 subdirectories."
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/003-design-motion/006-feature-catalog"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author feature-catalog audit tasks"
    next_safe_action: "Read all feature-catalog/ files against feature-catalog-template.md"
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
# Tasks: design-motion feature-catalog/ conformance

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

- [ ] T001 Read `feature-catalog-template.md` in full
- [ ] T002 Enumerate all 5 target files (root + 3 subdirectories)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [P] Diff `feature-catalog.md` against the template; fix if confirmed
- [ ] T004 [P] Diff `build-cards/motion-fill-in-cards.md` against the template; fix if confirmed
- [ ] T005 [P] Diff `procedure-cards/motion-procedure-card-inventory.md` against the template; fix if confirmed
- [ ] T006 [P] Diff `restraint-gate-and-choreography/choreography-and-reduced-motion.md` against the template; fix if confirmed
- [ ] T007 [P] Diff `restraint-gate-and-choreography/motion-restraint-gate.md` against the template; fix if confirmed
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Re-diff all 5 fixed files
- [ ] T009 Run `validate.sh` for this folder
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
