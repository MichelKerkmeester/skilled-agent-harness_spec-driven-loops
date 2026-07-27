---
title: "Tasks: design-motion manual-testing-playbook/ conformance"
description: "Task breakdown for auditing design-motion's 14-file manual-testing-playbook/ tree."
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/003-design-motion/007-manual-testing-playbook"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author manual-testing-playbook audit tasks"
    next_safe_action: "Enumerate and read all 14 playbook files against the template"
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
# Tasks: design-motion manual-testing-playbook/ conformance

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

- [ ] T001 Read `manual-testing-playbook-template.md` in full
- [ ] T002 Enumerate all 14 target files by full path
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [P] Diff root `manual-testing-playbook.md`; fix if confirmed
- [ ] T004 [P] Diff `advanced-craft/advanced-craft-popover-tooltip.md`; fix if confirmed
- [ ] T005 [P] Diff `decision/restraint-gate.md`; fix if confirmed
- [ ] T006 [P] Diff `micro-interactions/micro-interactions-feedback.md`; fix if confirmed
- [ ] T007 [P] Diff `presence/animate-presence-checklist.md` and `presence/animate-presence-exit-rules.md`; fix if confirmed
- [ ] T008 [P] Diff `procedure-card-contract/{card-selection-proof,direct-fallback-without-subagents,no-card-fallback}.md`; fix if confirmed
- [ ] T009 [P] Diff `reduced-motion/{motion-performance-failure-card,performance-and-reduced-motion}.md`; fix if confirmed
- [ ] T010 [P] Diff `strategy/{async-state-machine-card,motion-pattern-card,purposeful-motion-plan}.md`; fix if confirmed
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Re-diff all 14 fixed files
- [ ] T012 Run `validate.sh` for this folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 14 files accounted for
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Sibling with same-named files**: `../003-assets/`
<!-- /ANCHOR:cross-refs -->
