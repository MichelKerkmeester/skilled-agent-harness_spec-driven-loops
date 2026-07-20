---
title: "Tasks: Fix the Shared Naming Standard and Wire the Kebab Guards"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "core-standards kebab tasks"
  - "kebab guard wiring tasks"
  - "no-new-snake gate tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/022-naming-standard-hardening/001-fix-shared-standard-and-wire-guards"
    last_updated_at: "2026-07-20T10:13:27Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase-001 task list for the standard flip and gate wiring"
    next_safe_action: "Execute T001 to reconcile core-standards section 2"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Fix the Shared Naming Standard and Wire the Kebab Guards

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

- [ ] T001 Rewrite §2 filename rule + transformations to kebab (core-standards.md)
- [ ] T002 Rewrite §4 Safe Auto-Fixes to drop "convert to snake_case" (core-standards.md)
- [ ] T003 Rewrite §5 common-violations table to drop the "replace `-` with `_`" row (core-standards.md)
- [ ] T004 Fix the inverted numbered-doc framing at :53 (core-standards.md)
- [ ] T005 Confirm the §2 forward-pointer to filesystem-naming-convention.md stays intact (core-standards.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Decide gate host: pre-commit hook, CI, or both (open question)
- [ ] T007 Invoke check_no_new_snake_case.py on changed paths in the hook (.opencode/scripts/git-hooks/pre-commit)
- [ ] T008 [P] Invoke check_no_hyphenated_catalog_content.py for catalog/playbook content (same gate)
- [ ] T009 Confirm guard exclusions cover shipped legacy underscore roots before enabling --all (check_no_new_snake_case.py)
- [ ] T010 Add the guard unit tests to the CI suite (CI workflow)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Stage a snake_case .md name; confirm the gate fails
- [ ] T012 Stage a kebab name; confirm the gate passes
- [ ] T013 Run validate_document.py on the edited core-standards.md; 0 issues
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] A staged underscore name is demonstrably blocked by the gate
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
