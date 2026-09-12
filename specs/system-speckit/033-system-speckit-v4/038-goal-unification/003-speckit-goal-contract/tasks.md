---
title: "Tasks: Spec-kit goal contract"
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
# Tasks: Spec-kit goal contract

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

- [x] T001 Read ADR-3 and ADR-6 from ../002-decisions-and-contract-freeze/decision-record.md
- [x] T002 Route through sk-code-opencode (TypeScript) and sk-doc for the reference edits
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Edit goal.md.tmpl: strip boundary, 4000 budget, operator-copy wording (templates/addons/goal.md.tmpl)
- [x] T004 Edit playbook sections 4, 5, 7, 8 and fix the validation-rules link (references/workflows/goal-set-string-playbook.md)
- [x] T005 Add goal rules to spec-doc-structure.ts: binding-child existence, parent budget, heading separability (runtime/lib/validation/spec-doc-structure.ts)
- [x] T006 Add fixtures and tests for the two negatives and the good case
- [x] T007 Restore the goal section in validation-rules.md and regenerate the trigger index
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 npm run build in runtime/, then validate.sh --strict on fixtures and on this packet
- [x] T009 check-template-staleness.sh for goal.md
- [x] T010 Update goal.md log; resend parent if a criterion changed
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



