---
title: "Tasks: Phase 3: markdown-reference-sweep"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "markdown reference sweep tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: markdown-reference-sweep

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

- [x] T001 List spec folders and files whose names carry the identity
- [x] T002 Decide machine-record exclusions for specs/ (.jsonl, .log, .out, .err)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 `git mv` 28 spec packets and the spec files that carry the name
- [x] T004 Rewrite identity references in spec markdown and metadata JSON
- [x] T005 Repair derived metadata for every renamed packet (repair-derived.cjs --apply)
- [x] T006 Refresh the six affected track roots (refresh-track-roots.mjs)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Confirm zero identity hits in spec markdown outside this packet
- [x] T008 Compare each renamed packet's strict validation with main: 28 of 28 equal
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
