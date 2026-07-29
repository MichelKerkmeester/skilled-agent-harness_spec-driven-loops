---
title: "Tasks: Phase 11: doctrine-and-docs"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/011-doctrine-and-docs"
    last_updated_at: "2026-07-28T04:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-011-doctrine-and-docs"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 11: doctrine-and-docs

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

- [x] T001 Confirm AGENTS.md and CLAUDE.md share one inode (edit once) — evidence: `scratch/closeout-facts.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Rewrite Mandatory Tools table, Code Search Decision Tree, MCP roster, daemon fallback ladder, Quick Reference in AGENTS.md — evidence: `scratch/closeout-facts.md`
- [x] T003 Rewrite the `.claude/CLAUDE.md` search-routing directive
- [x] T004 Remove root README subsystem coverage — evidence: `scratch/closeout-facts.md`
- [x] T005 Delete `SET-UP - Code Graph.md` and remove its install-guides index entry
- [x] T006 Update `bin/README.md` and `bin/lib/README.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 `rg --hidden --no-ignore` sweep: no instruction file or README references the removed subsystem
- [x] T008 AGENTS.md and CLAUDE.md remain the same inode with one set of edits — evidence: `scratch/closeout-facts.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (sweep + inode check)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->

