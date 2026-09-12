---
title: "Tasks: Phase 13: research-findings-remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "remediation task breakdown"
  - "claim verification tasks"
  - "compat suite verification"
  - "frontmatter gate check"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Phase 13: research-findings-remediation

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

- [x] T001 Check the trigger-phrase claim against the suites actually on disk
- [x] T002 Check the gitignore claim against the file, its line numbers and whether the patterns still match anything
- [x] T003 Read the target file in full before editing it
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Replace the phrase naming a deleted suite with two naming suites that exist
- [x] T005 Complete the key-files table from two rows to the four files in its own tree
- [x] T006 Refuse the gitignore change and record why, rather than dropping the claim silently
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run the four compatibility suites and read their output and exit status
- [x] T008 Run the repository frontmatter gate
- [x] T009 Confirm the scoped diff touches only the one intended file
- [x] T010 Run `validate.sh --strict` on this phase and require `RESULT: PASSED`
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
