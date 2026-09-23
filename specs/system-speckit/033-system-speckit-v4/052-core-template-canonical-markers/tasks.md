---
title: "Tasks: Phase 52: Core template canonical markers"
description: "Ordered tasks to move the core templates and create.sh's phase-mode slots onto the canonical placeholder marker."
trigger_phrases:
  - "core template marker tasks"
  - "canonical placeholder tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 52: Core template canonical markers

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

Decisions: answered by the operator on 2026-09-23 and recorded in `spec.md` §7. The tasks description becomes a slot, and no retroactive fix is forced.

- [ ] T001 Inventory every caller that scaffolds and then validates before filling (`.skilled/commands`, `.skilled/skills/system-deep-loop`, authoring drivers)
- [ ] T002 [P] Record every default string the core templates ship today, frontmatter and body, the tasks description included, as the retired list for phase 053
- [ ] T003 [P] Record a recursive strict baseline over `specs/`: the set of passing and failing folders before any change (`scratch/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rewrite the author-fill slots as canonical markers (`templates/core/spec.md.tmpl`, `plan.md.tmpl`, `tasks.md.tmpl`, `implementation-summary.md.tmpl`)
- [ ] T005 Rewrite the phase-mode slots as canonical markers (`runtime/cli/spec/create.sh`)
- [ ] T006 Add the strict gate's marker pattern to the broad scan (`runtime/cli/spec/check-placeholders.sh`)
- [ ] T007 Fix or exempt each caller found in T001
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Scaffold one packet per level, confirm one `PLACEHOLDER_FILLED` finding per slot, fill them and confirm the pass (REQ-001)
- [ ] T009 Run the broad scan on the canonical-marker probe (REQ-002)
- [ ] T010 Update fixtures and run `test-phase-system.sh`, `test-validation-extended.sh` and vitest (REQ-003)
- [ ] T011 Rerun the recursive strict pass over `specs/` and confirm the same pass and fail set as T003 (REQ-006)
- [ ] T012 Write the retired default list into `implementation-summary.md` and run strict validation on this phase (REQ-005)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
