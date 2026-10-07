---
title: "Tasks: Fix: fan-out runner, merge and lineage prompt"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "fanout runner and prompt fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Fix: fan-out runner, merge and lineage prompt

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

- [x] T001 Read 048's goal log for the four faults and their evidence
- [x] T002 Capture the suite baseline before any change
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Read `claim` and `summary` in the merge and warn on unreadable finding rows
- [x] T004 Classify a gateway projection refusal as non-retryable in the runner, and resolve the lineage directory to an absolute path before the prompt is built
- [x] T005 Add the field name, contradiction rule and verbatim lineage-path rule to the iteration prompt pack, with render assertions
- [x] T006 Keep the runner edits clear of the uncommitted `system-deep-loop/038-review-and-cli-lineage/003-cli-pi-opencode-go-route` region of `fanout-run.cjs` and its test, so both changes merge cleanly
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run the merge and runner suites
- [x] T008 Re-merge 048's 008 lineages from their original delta rows
- [x] T009 Run `validate.sh --strict` on this phase
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



