---
title: "Tasks: Phase 12: ci-red-check-repairs"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "ci red check repairs tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 12: ci-red-check-repairs

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

- [x] T001 Capture the failing CI evidence before any repair (scratch/before/canary.txt, scratch/before/validation-switch.txt)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Tighten the AGENTS.md wording: 11 edits with no rule removed or weakened; ten restate a rule in fewer words, and one makes Gate 2 refer to the gitignored runtime state Gate 3 exempts (AGENTS.md)
- [x] T003 Rewrite the SESSION_RELAUNCH_REPO_ROOT line as the export its heading describes, so the switch-line test no longer reads it as a switch (.skilled/hooks/hook-flags.env.example)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Run check-rule-copies.js and record exit 0 with the Blast-Radius Management end at byte 16323, a 61-byte margin (scratch/after/canary.txt)
- [x] T005 Run test_validation_switch.py and record 8 passed with no reported flag (scratch/after/validation-switch.txt)
- [x] T006 Run the full sk-doc script suite and record the result (scratch/after/sk-doc-script-tests.txt)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



