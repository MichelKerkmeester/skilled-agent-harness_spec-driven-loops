---
title: "Tasks: Global CLAUDE.md as a symlink to AGENTS.md"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "global claude md symlink tasks"
  - "claude md relink verification"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Global CLAUDE.md as a symlink to AGENTS.md

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

- [x] T001 Locate the compaction-stop rule. It is only in `~/.claude/CLAUDE.md`, not in the repo `AGENTS.md` or any compaction hook (`~/.claude/CLAUDE.md`)
- [x] T002 Back up the file and confirm the copy with `cmp` (`~/.claude/CLAUDE.md.bak-2026-09-25`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Replace the file with an absolute symlink to the repo root `AGENTS.md` (`~/.claude/CLAUDE.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 `readlink` prints the repo `AGENTS.md` path and `cmp` reports no difference against it (`~/.claude/CLAUDE.md`)
- [x] T005 `grep -c "Context Compaction Behavior"` on the linked file returns 0 (`~/.claude/CLAUDE.md`)
- [x] T006 Fill the packet docs and pass `validate.sh --strict` (`specs/agents/015-global-claude-md-agents-symlink/`)
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
