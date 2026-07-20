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
    last_updated_at: "2026-07-20T11:48:40Z"
    last_updated_by: "codex"
    recent_action: "Finished the scoped standard, CI gate, and verification tasks"
    next_safe_action: "Run central metadata and packet validation"
    blockers: []
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Gate host: CI only"
      - "Pre-commit wiring: follow up after staged-only guard support"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Fix the Shared Naming Standard and Wire the Kebab Guards

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

- [x] T001 Rewrite §2 filename rule + transformations to kebab (core-standards.md)
- [x] T002 Rewrite §4 Safe Auto-Fixes to drop "convert to snake_case" (core-standards.md)
- [x] T003 Rewrite §5 so underscored filenames are the violation (core-standards.md)
- [x] T004 Fix the inverted numbered-doc framing at :53 (core-standards.md)
- [x] T005 Confirm the §2 forward-pointer to filesystem-naming-convention.md stays intact (core-standards.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Resolve the gate host as CI only (spec.md, plan.md)
- [x] T007 Add full-history checkout and event-specific base selection (naming-standard-guard.yml)
- [x] T008 Invoke check_no_new_snake_case.py with --changed-since (naming-standard-guard.yml)
- [x] T009 Run the guard and root-resolver unit tests in CI (naming-standard-guard.yml)
- [x] T010 Record staged-only pre-commit support as a follow-up (implementation-summary.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Create a temporary snake_case .md name; confirm the guard exits 1
- [x] T012 Create a temporary kebab name; confirm the guard exits 0
- [x] T013 Run the two guard test files; 4 passed
- [x] T014 Parse the workflow YAML and assert action refs and full history
- [x] T015 Run validate_document.py on the edited core-standards.md; 0 issues
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation and targeted-verification tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] A changed underscore name is demonstrably blocked by the guard
- [ ] Central metadata generation and strict packet validation (orchestrator-owned)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
