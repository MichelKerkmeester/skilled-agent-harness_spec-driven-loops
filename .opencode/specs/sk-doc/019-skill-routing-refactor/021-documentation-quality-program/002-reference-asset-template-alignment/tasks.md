---
title: "Tasks: Reference and Asset Template Alignment"
description: "Rename headers in the two reference files, restructure the asset file, verify all three VALID."
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/021-documentation-quality-program/002-reference-asset-template-alignment"
    last_updated_at: "2026-07-22T12:29:01Z"
    last_updated_by: "claude"
    recent_action: "All tasks shipped and verified VALID."
    next_safe_action: "Proceed to phase 003."
    blockers: []
    key_files: []
---

# Tasks: Reference and Asset Template Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

- [x] T001 Confirm the 15 current Title-Case headers and the asset file structure in `.opencode/skills/sk-doc/create-skill/`.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Rename the 7 H2 headers to ALL-CAPS in `create-skill/references/parent-skill/compiled-routing-architecture.md` (keep the `ready` code span literal).
- [x] T003 Rename the 8 H2 headers to ALL-CAPS in `create-skill/references/parent-skill/parent-skills-nested-packets.md`.
- [x] T004 Rewrite `create-skill/assets/parent-skill/parent-skill-smart-routing-template.md`: add frontmatter, fix the H1 em dash, add `## 1. OVERVIEW`, wrap the routing block, renumber, add `## 4. RELATED RESOURCES`, remove em dashes and semicolons.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Run `validate_document.py --type reference|asset` on all three; each reports VALID with 0 issues.
- [x] T006 `grep '^## '` confirms every H2 in the two reference files is ALL-CAPS.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All three files VALID
- [x] `checklist.md` verified with evidence

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
