---
title: "Tasks: Decisions and contract freeze"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Decisions and contract freeze

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

- [x] T001 Copy the decision-record template into this folder (decision-record.md)
- [x] T002 Read `../001-goal-unification-research/research/synthesis.md` in full
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write ADR-1 binding, ADR-2 store fate, ADR-3 strip contract (decision-record.md)
- [x] T004 Write ADR-4 resend and reminder, ADR-5 runtime matrix, ADR-6 budget (decision-record.md)
- [x] T005 Write ADR-7 isolation reconciliation citing specs/hooks/009-goal-isolation (decision-record.md)
- [x] T005b Write ADR-8 goal posture home: AGENTS.md row versus repo rule, with the proposed wording (decision-record.md)
- [x] T006 Diff ADR wording against ../goal.md D1-D7; amend and resend the parent if changed
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 validate.sh --strict on this folder
- [x] T008 Update goal.md log
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Verification tasks passed with recorded output
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



