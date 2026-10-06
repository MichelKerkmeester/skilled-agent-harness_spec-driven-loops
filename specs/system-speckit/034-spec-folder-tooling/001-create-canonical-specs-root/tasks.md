---
title: "Tasks: Make create.sh write new packets under the canonical specs root"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "create.sh canonical specs root"
  - "create.sh writes to .opencode/specs"
  - "spec packet lands in .opencode/specs"
  - "track numbering restarts at 001"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Make create.sh write new packets under the canonical specs root

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

- [x] T001 Trace the root history: packet 032's flip, the back-link, its removal in `befe3993f1`
- [x] T002 List every reference to the legacy root in the script, its libraries and its tests
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Rewrite the writer test for the canonical root and add the track numbering case (`tests/spec-root-writer-autosave.vitest.ts`)
- [x] T004 Run it against the unchanged script and confirm both cases fail
- [x] T005 Point `SPECS_DIR` at `specs/` and update the comments and help (`spec/create.sh`)
- [x] T006 Correct the registry entry for the root selection (`core/spec-root-registry.ts`)
- [x] T007 Add the superseded notice (`references/spec-root-alias-retirement-runbook.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Writer tests pass against the fixed script
- [x] T009 The 17 spec-root, scaffold, registry-rule and backfill test files pass, with only the existing deliberate skip
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



