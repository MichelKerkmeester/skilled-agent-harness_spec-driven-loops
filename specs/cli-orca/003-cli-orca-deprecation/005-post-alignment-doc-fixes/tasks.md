---
title: "Tasks: Phase 5: post-alignment-doc-fixes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "cli orca post alignment doc fixes tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: post-alignment-doc-fixes

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run `/local-skilled-alignment` and `/local-doc-alignment` over the removal (`~/.local/state/local-skilled-alignment/536-provision-dev-dependencies/20261124T123940Z/report.md`). Verify: the report lists the README count and the release-note gap.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Correct the family counts (`.skilled/skills/README.txt`). Verify: `sed -n 24p` shows `cli-*` (2), `mcp-*` (3).
- [x] T003 Add the removal to the open release notes (`.skilled/changelog/skilled/v4.2.0.0.md`). Verify: `grep -c 'c-the-cli-orca-skill-is-removed'` prints 3.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Validate the release notes (`validate_document.py`). Verify: it prints `Total issues: 0`.
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
