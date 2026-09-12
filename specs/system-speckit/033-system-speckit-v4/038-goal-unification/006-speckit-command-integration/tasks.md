---
title: "Tasks: Spec-kit command integration"
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
# Tasks: Spec-kit command integration

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

- [x] T001 Read ADR-4 and ADR-5
- [x] T002 Load sk-create-command
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the goal step to plan.md, implement.md, complete.md (.opencode/commands/speckit/)
- [x] T004 Add read and reminder to resume.md; log update to save.md (.opencode/commands/speckit/)
- [x] T005 Rewrite objective_shape and extend dispatch_by_runtime (assets/speckit-plan.yaml)
- [x] T006 Route natural-language goal phrases to the same step
- [x] T006b Add the goal posture row to AGENTS.md section 4 and a Quick Reference entry per ADR-8; show the wording to the operator before writing; the row states that a set goal gets a one-line acknowledgement and work continues immediately (AGENTS.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Compile command contracts and run the playbooks for REQ-001 to REQ-003
- [x] T008 Update goal.md log; resend parent if a criterion changed
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification tasks passed with recorded output
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



