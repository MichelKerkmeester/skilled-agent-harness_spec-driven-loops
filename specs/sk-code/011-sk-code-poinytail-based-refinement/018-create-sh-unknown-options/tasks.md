---
title: "Tasks: Phase 18: create-sh-unknown-options"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "create sh unknown options tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 18: create-sh-unknown-options

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

- [x] T001 Sweep every caller of create.sh and list the flags each passes
- [x] T002 Record the create test baseline on the pre-fix script
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the unknown-option branch (`.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`)
- [x] T004 Add the happy path and edge case test (`.skilled/skills/system-spec-kit/runtime/cli/tests/create-unknown-options.vitest.ts`)
- [x] T005 Replace `--phase-count` with `--phases` in the literal-naming playbook scenario and catalog entry
- [x] T006 Write the v2.7.10.0 release entry and bump the skill version
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run the edge test against the pre-fix script and confirm it fails
- [x] T008 Run the create test set and every other suite that invokes create.sh
- [x] T009 Validate the parent recursively and commit
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every goal.md criterion passes on the orchestrator's rerun
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
