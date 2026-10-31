---
title: "Tasks: Build: improve the Jev completion-claim audit (026)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "completion claims improvements tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Build: improve the Jev completion-claim audit (026)

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

- [x] T001 Read 048's research for this feature and the sentinel
- [x] T002 Capture the suite baseline before any change
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the closing-window anchor and the context filters, and record each arm's counts on the 047 rows
- [x] T004 Add `complete` to the claim words, with negative tests
- [x] T005 Refuse duplicate IDs, fix whole-word attribution and correct `labels-happy`
- [x] T006 Document the pre-registered threshold, add the holdout flag, cost in the rule and the one-call arm
- [x] T007 Wire the Cursor adapter in `.cursor/hooks.json`
- [x] T008 Reconcile Pi visibility in the README and the injection contract
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the sentinel and audit suites
- [x] T010 Run the scorer's census on the 047 rows
- [x] T011 Run `validate.sh --strict` on this phase
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



