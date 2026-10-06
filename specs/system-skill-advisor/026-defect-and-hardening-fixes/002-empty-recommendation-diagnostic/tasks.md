---
title: "Tasks: A successful advisor call with nothing to recommend reported itself as an outage"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "no match diagnostic tasks"
  - "negative control task"
  - "advisor diagnostics verification"
  - "consumer search before changing a marker"
importance_tier: "normal"
contextType: "general"
---
# Tasks: A successful advisor call with nothing to recommend reported itself as an outage

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

- [x] T001 Locate the status resolver and confirm which condition produces the misleading branch
- [x] T002 Search for consumers of the marker before changing it, across runtime and extensions
- [x] T003 Read the diagnostics type to learn which fields are permitted
<!-- /ANCHOR:phase-1 -->

---

## Phase 2: Implementation

- [x] T004 Split the no-match case out of the outage diagnostics, carrying a reason rather than an invented error code
- [x] T005 Let the compiler reject the first attempt rather than widen a type to fit it
- [x] T006 Export the result builder as a test seam and rebuild the served output
- [x] T007 Write the regression test over the three outcomes

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Exercise the real hook with two routable prompts and one inert one
- [x] T009 Run the new test against the old branch and confirm it fails
- [x] T010 Restore and confirm it passes
- [x] T011 Run the full advisor suite
- [x] T012 Run `validate.sh --strict` on this packet and require `RESULT: PASSED`
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
