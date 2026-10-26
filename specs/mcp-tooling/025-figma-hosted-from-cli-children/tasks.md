---
title: "Tasks: Figma hosted server from CLI children"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "figma hosted from cli children tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
# Tasks: Figma hosted server from CLI children

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

- [x] T001 Read `mcp-wiring.md` Section 6 and the newest changelog (.skilled/skills/mcp-tooling/mcp-figma/)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add the CLI child subsection (references/mcp-wiring.md). Verify: `rg -n 'Reaching the hosted server natively' references/mcp-wiring.md` prints one line
- [x] T003 Write the v1.1.6.0 changelog and move `SKILL.md` to 1.1.6.0 (changelog/v1.1.6.0.md, SKILL.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Run `validate_document.py` on the reference and the changelog
- [x] T005 Run `validate.sh --strict` on this folder
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



