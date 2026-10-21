---
title: "Tasks: Phase 38: plugin-scanner-follow-ups"
description: "Ordered tasks for the scanner follow-ups: baseline the scan, add the stored-result and type-parameter rules, declare rolldown, align the docs, review and ship."
trigger_phrases:
  - "plugin scanner follow ups tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 38: plugin-scanner-follow-ups

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

- [x] T001 Scaffold the phase and fill the parent phase-map rows (`../spec.md`)
- [x] T002 Record the scan of every bridged plugin and the plugin suite before any edit (`scratch/baseline/`)
- [x] T003 [P] Check the four 024 limits against the current scanner; all four already have closing fixtures (`.opencode/plugins/tests/plugin-inventory.test.cjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Report a helper call whose stored result decides a branch (`.opencode/plugins/tests/helpers/plugin-inventory.cjs`)
- [x] T005 Trace type-named parameters through their calls, failing closed (`.opencode/plugins/tests/helpers/plugin-inventory.cjs`)
- [x] T006 Stop counting object keys and member properties as values (`.opencode/plugins/tests/helpers/plugin-inventory.cjs`)
- [x] T007 [P] Declare rolldown 1.2.12 and refresh the lockfile (`.skilled/package.json`, `.skilled/package-lock.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Fixtures for each rule, each failing on the old helper or under a mutation probe (`scratch/mutation-probes.txt`)
- [x] T009 Scan of every bridged plugin unchanged; plugin suite, battery unit and purity tests rerun (`scratch/after/`)
- [x] T010 Remove the tree ordinals and rewrite the event-guard limit (`.opencode/plugins/ARCHITECTURE.md`)
- [x] T011 Luna review until PASS (`scratch/luna-round-1.txt`, `scratch/luna-round-2.txt`)
- [x] T012 Merge main, push, and record CI on the pushed commit (`implementation-summary.md`)
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



