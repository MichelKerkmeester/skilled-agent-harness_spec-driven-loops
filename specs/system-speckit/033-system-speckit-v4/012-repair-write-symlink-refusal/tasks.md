---
title: "Tasks: Repair Write Symlink Refusal"
description: "The repair script decided a path was a regular file during its scan and wrote it later. The write now refuses to traverse a symlink itself. Also records why the sibling resume-containment finding was declined: its remedy would break every symlinked track."
trigger_phrases:
  - "repair write symlink tasks"
  - "writeExistingFileNoFollow helper"
  - "refuse symlink traversal at open"
  - "swapped path refusal test"
  - "repair-write-symlink-refusal.sh test"
  - "normal file still writes"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Refuse symlink traversal in the graph-metadata repair write path

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

- [x] T001 Confirm the scan already rejects symlinks - the walk tests the directory entry, which reports on the link itself (`mcp-server/scripts/repair-graph-metadata.mjs:101`)
- [x] T002 Confirm the write does not - the write call followed the path (`mcp-server/scripts/repair-graph-metadata.mjs:361`), so the scan's decision was not enforced where it mattered
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Open the destination with traversal disabled so the write enforces its own precondition - `writeExistingFileNoFollow` in `mcp-server/scripts/repair-graph-metadata.mjs`
- [x] T004 Report a refusal rather than a raw errno so the cause is legible - `mcp-server/scripts/repair-graph-metadata.mjs:114` maps the traversal errno to a named refusal
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Confirm a normal file still writes - `scripts/tests/repair-write-symlink-refusal.sh:45` wrote and read back the replaced content
- [x] T006 Confirm a swapped path is refused and its target untouched - `scripts/tests/repair-write-symlink-refusal.sh:50` reports refused, target retains its content
- [x] T007 Confirm the script still runs end to end - `repair-graph-metadata.mjs --dry-run` reports 366 candidates and 0 remaining, writing nothing
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



